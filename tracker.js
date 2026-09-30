/**
 * SKCore Health Technologies — Cookie consent + site visitor analytics
 *
 * Visitors choose "Accept" or "Reject" in a small banner (DPDP Act 2023: consent
 * must be free, specific, informed and as easy to withdraw as to give).
 *
 *  Accepted → page view is logged with: visitor ID (random, stored in this
 *             browser), visit count, approximate location from the IP address
 *             (city, region, country, postal code, network/ISP, timezone),
 *             IP address, device, browser, screen and language.
 *  Rejected → only an anonymous page view (page, title, referring site).
 *             No IP, location, visitor ID, device or browser details.
 *  No choice yet → nothing is sent until the visitor chooses.
 *
 * The choice is remembered for 180 days and can be changed any time from the
 * "Cookie settings" link added to the footer of every page.
 * Data goes to the "Site Visitors" tab via the same Apps Script web app.
 */
(function () {
  var TRACKER_ENDPOINT = 'https://script.google.com/macros/s/AKfycbz-JkCwwDHOvw9feVnmen3ucz7xFhfqpAxs92OCnyW2HRgnVHL5W0vE02Cfm1nzjLa3/exec';
  var CONSENT_KEY = 'skc_consent';           // JSON {v:'accepted'|'rejected', t:epoch ms}
  var VID_KEY     = 'skc_vid';               // random visitor id (accepted only)
  var COUNT_KEY   = 'skc_visits';            // visit counter (accepted only)
  var GEO_KEY     = 'skc_geo';               // per-session cache of the IP lookup
  var CONSENT_TTL = 180 * 24 * 60 * 60 * 1000;

  function ls(k, v) {
    try { if (v === undefined) return localStorage.getItem(k); if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (_) { return null; }
  }
  function ss(k, v) {
    try { if (v === undefined) return sessionStorage.getItem(k); sessionStorage.setItem(k, v); } catch (_) { return null; }
  }
  function getConsent() {
    try {
      var c = JSON.parse(ls(CONSENT_KEY) || 'null');
      if (c && (c.v === 'accepted' || c.v === 'rejected') && (Date.now() - c.t) < CONSENT_TTL) return c.v;
    } catch (_) {}
    return '';
  }
  function setConsent(v) {
    ls(CONSENT_KEY, JSON.stringify({ v: v, t: Date.now() }));
    if (v === 'rejected') { ls(VID_KEY, null); ls(COUNT_KEY, null); try { sessionStorage.removeItem(GEO_KEY); } catch (_) {} }
  }

  function send(data) {
    if (!TRACKER_ENDPOINT) return;
    try {
      fetch(TRACKER_ENDPOINT + '?' + new URLSearchParams(data).toString(),
        { method: 'GET', mode: 'no-cors', keepalive: true }).catch(function () {});
    } catch (_) {}
  }

  function refDomain() {
    try { return document.referrer ? new URL(document.referrer).hostname : ''; } catch (_) { return ''; }
  }

  // Where the visit came from: search engine, social, direct, other site or campaign (utm_source)
  function source() {
    try {
      var q = new URLSearchParams(location.search);
      if (q.get('utm_source')) return 'Campaign: ' + q.get('utm_source') + (q.get('utm_medium') ? ' / ' + q.get('utm_medium') : '');
      if (!document.referrer) return 'Direct / bookmark';
      var h = new URL(document.referrer).hostname.replace(/^www\./, '');
      if (h === location.hostname.replace(/^www\./, '')) return 'Internal';
      var map = [[/(^|\.)google\./, 'Search: Google'], [/(^|\.)bing\.com$/, 'Search: Bing'], [/duckduckgo\.com$/, 'Search: DuckDuckGo'],
        [/(^|\.)yahoo\./, 'Search: Yahoo'], [/yandex\./, 'Search: Yandex'], [/ecosia\.org$/, 'Search: Ecosia'], [/baidu\.com$/, 'Search: Baidu'],
        [/(chatgpt\.com|openai\.com|perplexity\.ai|claude\.ai|gemini\.google\.com|copilot\.microsoft\.com)$/, 'AI assistant: ' + h],
        [/(linkedin\.com|lnkd\.in)$/, 'Social: LinkedIn'], [/(facebook\.com|fb\.com|m\.facebook\.com)$/, 'Social: Facebook'],
        [/(t\.co|twitter\.com|x\.com)$/, 'Social: X / Twitter'], [/instagram\.com$/, 'Social: Instagram'], [/(youtube\.com|youtu\.be)$/, 'Social: YouTube'],
        [/(whatsapp\.com|wa\.me)$/, 'Social: WhatsApp'], [/(mail\.google\.com|outlook\.)/, 'Email']];
      for (var i = 0; i < map.length; i++) if (map[i][0].test(h)) return map[i][1];
      return 'Website: ' + h;
    } catch (_) { return ''; }
  }

  function device() {
    var ua = navigator.userAgent || '';
    var d = /iPad|Tablet/i.test(ua) ? 'Tablet' : /Mobi|Android|iPhone/i.test(ua) ? 'Mobile' : 'Desktop';
    var os = /Windows/i.test(ua) ? 'Windows' : /Android/i.test(ua) ? 'Android' : /iPhone|iPad|iOS/i.test(ua) ? 'iOS' :
             /Mac OS X/i.test(ua) ? 'macOS' : /Linux/i.test(ua) ? 'Linux' : 'Other';
    var b = /Edg\//.test(ua) ? 'Edge' : /OPR\/|Opera/.test(ua) ? 'Opera' : /SamsungBrowser/.test(ua) ? 'Samsung Internet' :
            /Chrome\//.test(ua) ? 'Chrome' : /Firefox\//.test(ua) ? 'Firefox' : /Safari\//.test(ua) ? 'Safari' : 'Other';
    return { device: d + ' · ' + os, browser: b };
  }

  function vid() {
    var v = ls(VID_KEY);
    if (!v) {
      v = (window.crypto && crypto.randomUUID) ? crypto.randomUUID()
        : 'v-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
      ls(VID_KEY, v);
    }
    return v;
  }
  function visitNumber() {
    var first = !ss('skc_counted');
    var n = parseInt(ls(COUNT_KEY) || '0', 10) || 0;
    if (first) { n += 1; ls(COUNT_KEY, String(n)); ss('skc_counted', '1'); }
    return n || 1;
  }

  // Approximate location from the visitor's public IP — only after consent.
  function geo() {
    var cached = ss(GEO_KEY);
    if (cached) { try { return Promise.resolve(JSON.parse(cached)); } catch (_) {} }
    function norm(o) { return o; }
    var ctrl = window.AbortController ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, 6000);
    var opt = ctrl ? { signal: ctrl.signal } : {};
    return fetch('https://ipapi.co/json/', opt).then(function (r) { return r.json(); }).then(function (j) {
      if (!j || j.error || !j.ip) throw new Error('ipapi');
      return { ip: j.ip, city: j.city, region: j.region, country: j.country_name, postal: j.postal, org: j.org, tz: j.timezone };
    }).catch(function () {
      return fetch('https://get.geojs.io/v1/ip/geo.json', opt).then(function (r) { return r.json(); }).then(function (j) {
        if (!j || !j.ip) throw new Error('geojs');
        return { ip: j.ip, city: j.city, region: j.region, country: j.country, postal: '', org: j.organization_name || j.organization || '', tz: j.timezone };
      });
    }).catch(function () {
      return fetch('https://ipwho.is/', opt).then(function (r) { return r.json(); }).then(function (j) {
        if (!j || j.success === false) throw new Error('ipwho');
        return { ip: j.ip, city: j.city, region: j.region, country: j.country, postal: j.postal,
                 org: (j.connection && (j.connection.isp || j.connection.org)) || '', tz: (j.timezone && j.timezone.id) || '' };
      });
    }).catch(function () { return {}; }).then(function (g) {
      clearTimeout(timer); g = norm(g || {});
      if (g.ip) ss(GEO_KEY, JSON.stringify(g));
      return g;
    });
  }

  function logVisit() {
    var c = getConsent();
    if (!c) return;
    var base = { type: 'visit', t: new Date().toISOString(), title: document.title || '',
                 url: (location.pathname || '/') + (location.search || ''), consent: c, src: source() };
    if (c === 'rejected') { base.ref = refDomain(); send(base); return; }
    var d = device();
    base.ref = document.referrer || '';
    base.screen = (screen.width || '') + 'x' + (screen.height || '');
    base.lang = navigator.language || '';
    base.vid = vid();
    base.visitNo = visitNumber();
    base.device = d.device; base.browser = d.browser;
    geo().then(function (g) {
      base.ip = g.ip || ''; base.city = g.city || ''; base.region = g.region || '';
      base.country = g.country || ''; base.postal = g.postal || ''; base.org = g.org || '';
      base.tz = g.tz || (Intl.DateTimeFormat ? Intl.DateTimeFormat().resolvedOptions().timeZone : '');
      send(base);
    });
  }

  // ── Banner ────────────────────────────────────────────────────────────
  var css = '' +
  '#skc-consent{position:fixed;left:20px;bottom:20px;z-index:9995;width:400px;max-width:calc(100vw - 32px);' +
    'background:#fff;border-radius:16px;box-shadow:0 16px 48px rgba(6,26,45,.28);padding:18px 18px 16px;' +
    'font:14px/1.5 Inter,system-ui,sans-serif;color:#2d3e4e;display:none}' +
  '#skc-consent.show{display:block;animation:skcIn .25s ease-out}' +
  '@keyframes skcIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}' +
  '#skc-consent h4{margin:0 0 6px;font:700 16px Manrope,Inter,sans-serif;color:#0b2840}' +
  '#skc-consent p{margin:0 0 12px;font-size:13px}' +
  '#skc-consent a{color:#0d72ae;font-weight:600}' +
  '#skc-consent .skc-btns{display:flex;gap:10px}' +
  '#skc-consent button{flex:1;border-radius:10px;padding:10px;font:600 14px Inter,system-ui,sans-serif;cursor:pointer}' +
  '#skc-accept{border:none;background:linear-gradient(135deg,#0d72ae,#0b2840);color:#fff}' +
  '#skc-reject{border:1.5px solid #0b2840;background:#fff;color:#0b2840}' +
  'body.skc-consent-open .skl-fab,body.skc-consent-open .skl-card{display:none!important}' +
  '.skc-cookie-link{background:none;border:none;padding:0;color:inherit;opacity:.8;cursor:pointer;font:inherit;text-decoration:underline}' +
  '@media(max-width:480px){#skc-consent{left:16px;right:16px;bottom:16px;width:auto}}';

  function showBanner() {
    var b = document.getElementById('skc-consent');
    if (b) { b.classList.add('show'); document.body.classList.add('skc-consent-open'); }
  }
  function hideBanner() {
    var b = document.getElementById('skc-consent');
    if (b) b.classList.remove('show');
    document.body.classList.remove('skc-consent-open');
  }
  function choose(v) {
    var before = getConsent();
    setConsent(v); hideBanner();
    if (before !== v) logVisit();   // log this page once with the new choice
  }

  function init() {
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    var policyLink = '<a href="#" data-pol="privacy">Read our Privacy Policy</a>';
    var box = document.createElement('div');
    box.id = 'skc-consent'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-live', 'polite');
    box.setAttribute('aria-label', 'Cookie consent');
    box.innerHTML = '<h4>🍪 Your privacy choice</h4>' +
      '<p>With your permission we use a cookie and your IP address to understand visits to our site — ' +
      'your approximate location (city, region, country), network provider, device and browser, and whether you have visited before. ' +
      'We do not sell this data or use it for advertising. If you reject, we record only an anonymous page view. ' +
      'You can change this any time from "Cookie settings" at the bottom of the page. ' + policyLink + '</p>' +
      '<div class="skc-btns"><button id="skc-reject" type="button">Reject</button>' +
      '<button id="skc-accept" type="button">Accept</button></div>';
    document.body.appendChild(box);
    document.getElementById('skc-accept').addEventListener('click', function () { choose('accepted'); });
    document.getElementById('skc-reject').addEventListener('click', function () { choose('rejected'); });
    box.querySelector('[data-pol]').addEventListener('click', function (e) {
      e.preventDefault(); e.stopImmediatePropagation();
      if (typeof window.openPolicy === 'function' && document.getElementById('privacy-overlay')) window.openPolicy('privacy-overlay');
    });

    // "Cookie settings" link in every footer
    var fb = document.querySelector('.footer-bottom');
    if (fb) {
      var p = document.createElement('p');
      var btn = document.createElement('button');
      btn.type = 'button'; btn.className = 'skc-cookie-link'; btn.textContent = 'Cookie settings';
      btn.addEventListener('click', showBanner);
      p.appendChild(btn); fb.appendChild(p);
    }

    if (getConsent()) logVisit(); else showBanner();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
