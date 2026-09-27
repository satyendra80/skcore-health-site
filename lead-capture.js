/**
 * SKCore Health Technologies — "Stay in touch" visitor lead capture
 * A small, polite prompt that lets visitors leave their details (with consent)
 * so SKCore can contact them. Saves to the "Visitor Leads" tab via the same
 * Google Apps Script web app as the demo/contact forms (FORMS_ENDPOINT,
 * defined in demo-modal.js — load this file after demo-modal.js).
 *
 * Behaviour
 *  - A "Stay in touch" button is always available (bottom-right).
 *  - The card opens by itself once, after 30 s on the site or 60% scroll.
 *  - If dismissed it stays closed for 14 days; after a submission it never
 *    opens by itself again.
 */
(function () {
  var KEY = 'skc_lead_state';        // '' | 'dismissed:<epoch ms>' | 'done'
  var SNOOZE_MS = 14 * 24 * 60 * 60 * 1000;
  var AUTO_DELAY_MS = 30000;

  function getState() { try { return localStorage.getItem(KEY) || ''; } catch (_) { return ''; } }
  function setState(v) { try { localStorage.setItem(KEY, v); } catch (_) {} }
  function mayAutoOpen() {
    var st = getState();
    if (st === 'done') return false;
    if (st.indexOf('dismissed:') === 0) return (Date.now() - parseInt(st.slice(10), 10)) > SNOOZE_MS;
    return true;
  }

  var css = '' +
  '.skl-fab{position:fixed;right:20px;bottom:20px;z-index:9990;border:none;cursor:pointer;' +
    'background:linear-gradient(135deg,#0d72ae,#0b2840);color:#fff;font:600 14px Inter,system-ui,sans-serif;' +
    'padding:12px 18px;border-radius:999px;box-shadow:0 8px 24px rgba(6,26,45,.25)}' +
  '.skl-fab:hover{transform:translateY(-1px)}' +
  '.skl-card{position:fixed;right:20px;bottom:80px;z-index:9991;width:340px;max-width:calc(100vw - 32px);' +
    'background:#fff;border-radius:16px;box-shadow:0 16px 48px rgba(6,26,45,.25);font-family:Inter,system-ui,sans-serif;' +
    'display:none;overflow-y:auto;max-height:calc(100vh - 100px)}' +
  '.skl-card.open{display:block;animation:sklIn .25s ease-out}' +
  '@keyframes sklIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}' +
  '.skl-head{background:linear-gradient(135deg,#0b2840,#0d72ae);color:#fff;padding:16px 18px;position:relative}' +
  '.skl-head h3{margin:0 0 4px;font:700 17px Manrope,Inter,sans-serif;color:#fff}' +
  '.skl-head p{margin:0;font-size:13px;color:rgba(255,255,255,.85);line-height:1.45}' +
  '.skl-x{position:absolute;top:10px;right:10px;background:rgba(255,255,255,.15);border:none;color:#fff;' +
    'width:28px;height:28px;border-radius:50%;cursor:pointer;font-size:14px}' +
  '.skl-body{padding:14px 18px 16px}' +
  '.skl-body label{display:block;font-size:12px;font-weight:600;color:#0b2840;margin:8px 0 4px}' +
  '.skl-body input[type=text],.skl-body input[type=email],.skl-body input[type=tel],.skl-body select{' +
    'width:100%;box-sizing:border-box;border:1.5px solid #cddce1;border-radius:10px;padding:9px 11px;font-size:14px;font-family:inherit}' +
  '.skl-body input:focus,.skl-body select:focus{outline:none;border-color:#0d72ae}' +
  '.skl-consent{display:flex!important;gap:8px;align-items:flex-start;font-weight:400!important;color:#4a5568!important;line-height:1.45}' +
  '.skl-consent input{margin-top:2px;flex-shrink:0}' +
  '.skl-hp{position:absolute!important;left:-9999px!important;width:1px;height:1px;opacity:0}' +
  '.skl-btn{width:100%;margin-top:12px;border:none;border-radius:10px;padding:11px;font:600 14px inherit;' +
    'background:linear-gradient(135deg,#0d72ae,#0b2840);color:#fff;cursor:pointer}' +
  '.skl-btn:disabled{opacity:.6;cursor:not-allowed}' +
  '.skl-err{display:none;margin-top:10px;background:#fff5f5;border:1px solid #fca5a5;color:#c53030;border-radius:8px;padding:8px 10px;font-size:12px}' +
  '.skl-ok{display:none;text-align:center;padding:22px 18px}' +
  '.skl-ok h4{margin:6px 0;color:#0b2840;font:700 16px Manrope,Inter,sans-serif}' +
  '.skl-ok p{margin:0;color:#4a5568;font-size:13px}' +
  '@media(max-width:480px){.skl-card{right:16px;bottom:76px}.skl-fab{right:16px;bottom:16px}}';

  function build() {
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    var wrap = document.createElement('div');
    wrap.innerHTML =
      '<button type="button" class="skl-fab" id="skl-fab" data-modal="none" aria-controls="skl-card" aria-expanded="false">💬 Stay in touch</button>' +
      '<div class="skl-card" id="skl-card" role="dialog" aria-labelledby="skl-title">' +
        '<div class="skl-head"><button type="button" class="skl-x" id="skl-x" data-modal="none" aria-label="Close">✕</button>' +
          '<h3 id="skl-title">Interested in SKCore?</h3>' +
          '<p>Leave your details and we will get in touch — about pilots, partnerships, investment or our products.</p></div>' +
        '<form class="skl-body" id="skl-form" novalidate>' +
          '<label for="skl-name">Name *</label><input type="text" id="skl-name" autocomplete="name"/>' +
          '<label for="skl-email">Email *</label><input type="email" id="skl-email" autocomplete="email"/>' +
          '<label for="skl-phone">Phone / WhatsApp</label><input type="tel" id="skl-phone" autocomplete="tel" placeholder="+91"/>' +
          '<label for="skl-org">Organisation</label><input type="text" id="skl-org" autocomplete="organization"/>' +
          '<label for="skl-interest">I am interested in</label>' +
          '<select id="skl-interest"><option>Product information</option><option>Pilot partnership</option>' +
            '<option>Investment / incubation</option><option>Clinical advisory</option><option>Careers</option><option>Other</option></select>' +
          '<input type="text" id="skl-hp" class="skl-hp" tabindex="-1" autocomplete="off" aria-hidden="true"/>' +
          '<label class="skl-consent"><input type="checkbox" id="skl-consent"/> I agree that SKCore Health Technologies may store these details and contact me, as described in the Privacy Policy. *</label>' +
          '<div class="skl-err" id="skl-err"></div>' +
          '<button type="submit" class="skl-btn" id="skl-submit">Send my details</button>' +
        '</form>' +
        '<div class="skl-ok" id="skl-ok"><div style="font-size:36px">🙏</div><h4>Thank you!</h4><p>We will get in touch soon.</p></div>' +
      '</div>';
    document.body.appendChild(wrap);
  }

  function $(id) { return document.getElementById(id); }
  function open(auto) {
    $('skl-card').classList.add('open'); $('skl-fab').setAttribute('aria-expanded', 'true');
    if (!auto) setTimeout(function () { $('skl-name').focus(); }, 50);
  }
  function close(remember) {
    $('skl-card').classList.remove('open'); $('skl-fab').setAttribute('aria-expanded', 'false');
    if (remember && getState() !== 'done') setState('dismissed:' + Date.now());
  }
  function err(msg) { var e = $('skl-err'); e.textContent = msg; e.style.display = 'block'; }

  function init() {
    build();
    $('skl-fab').addEventListener('click', function () { $('skl-card').classList.contains('open') ? close(true) : open(false); });
    $('skl-x').addEventListener('click', function () { close(true); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && $('skl-card').classList.contains('open')) close(true); });

    $('skl-form').addEventListener('submit', function (e) {
      e.preventDefault(); $('skl-err').style.display = 'none';
      var v = function (id) { return ($(id).value || '').trim(); };
      var name = v('skl-name'), email = v('skl-email'), phone = v('skl-phone');
      if (!name || !email) return err('Please enter your name and email.');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return err('Please enter a valid email address.');
      if (phone && !/^[+\d][\d\s()-]{6,}$/.test(phone)) return err('Please enter a valid phone number.');
      if (!$('skl-consent').checked) return err('Please tick the consent box so we can contact you.');
      if (typeof FORMS_ENDPOINT === 'undefined' || !FORMS_ENDPOINT) return err('Form service unavailable. Please email info@skcorehealth.com.');

      var payload = {
        type: 'lead', timestamp: new Date().toISOString(),
        name: name, email: email, phone: phone, organisation: v('skl-org'),
        interest: v('skl-interest'), consent: 'yes',
        page: location.pathname, referrer: document.referrer || '', website: v('skl-hp')
      };
      var btn = $('skl-submit'); btn.disabled = true; btn.textContent = 'Sending…';
      var fail = function () {
        btn.disabled = false; btn.textContent = 'Send my details';
        err('Sorry — this could not be sent right now. Please email info@skcorehealth.com.');
      };
      var ctrl = (typeof AbortController !== 'undefined') ? new AbortController() : null;
      var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, 20000);
      fetch(FORMS_ENDPOINT, {
        method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload), redirect: 'follow', signal: ctrl ? ctrl.signal : undefined
      }).then(function (r) { return r.text(); }).then(function (t) {
        clearTimeout(timer);
        var res = null; try { res = JSON.parse(t); } catch (_) {}
        if (!(res && res.status === 'ok')) return fail();
        setState('done');
        $('skl-form').style.display = 'none'; $('skl-ok').style.display = 'block';
        setTimeout(function () { close(false); }, 4000);
      }).catch(function () { clearTimeout(timer); fail(); });
    });

    // Gentle auto-open: once, after 30 s or 60% scroll, unless snoozed/done
    if (mayAutoOpen()) {
      var fired = false;
      var trigger = function () {
        if (fired) return; fired = true;
        window.removeEventListener('scroll', onScroll);
        // don't pop over an open demo/contact/policy modal
        if (document.querySelector('.skc-overlay.open, .pol-overlay.open')) return;
        open(true);
      };
      var onScroll = function () {
        var h = document.documentElement;
        if ((h.scrollTop + window.innerHeight) / h.scrollHeight > 0.6) trigger();
      };
      setTimeout(trigger, AUTO_DELAY_MS);
      window.addEventListener('scroll', onScroll, { passive: true });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
