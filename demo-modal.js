/**
 * SKCore Health Technologies — Forms (Demo Request + Contact Inquiry)
 * Self-contained: injects styles + HTML for both modals.
 *
 * Configuration — paste your Google Apps Script Web App URL below.
 * One URL handles both form types (type field differentiates them).
 */
	//const FORMS_ENDPOINT = 'https://script.google.com/macros/s/AKfycbz-JkCwwDHOvw9feVnmen3ucz7xFhfqpAxs92OCnyW2HRgnVHL5W0vE02Cfm1nzjLa3/exec';
const FORMS_ENDPOINT = 'https://script.google.com/macros/s/AKfycbz-JkCwwDHOvw9feVnmen3ucz7xFhfqpAxs92OCnyW2HRgnVHL5W0vE02Cfm1nzjLa3/exec';

/* ══════════════════════════════════════════════════════════════════════
   STYLES
═══════════════════════════════════════════════════════════════════════ */
(function injectStyles() {
  const css = `
  /* Shared overlay */
  .skc-overlay{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;
    justify-content:center;background:rgba(6,26,45,.78);backdrop-filter:blur(7px);
    opacity:0;pointer-events:none;transition:opacity .25s}
  .skc-overlay.open{opacity:1;pointer-events:all}

  /* Shared modal box */
  .skc-modal{background:#fff;border-radius:20px;width:min(580px,94vw);
    max-height:92vh;overflow-y:auto;box-shadow:0 28px 90px rgba(0,0,0,.32);
    transform:translateY(30px) scale(.97);
    transition:transform .3s cubic-bezier(.34,1.56,.64,1)}
  .skc-overlay.open .skc-modal{transform:translateY(0) scale(1)}

  /* Header band */
  .skc-head{padding:30px 36px 26px;border-radius:20px 20px 0 0;position:relative}
  .skc-head.demo-head{background:linear-gradient(135deg,#0b2840 0%,#0d72ae 100%)}
  .skc-head.contact-head{background:linear-gradient(135deg,#061a2d 0%,#0d72ae 70%,#52d4df 100%)}
  .skc-head h2{color:#fff;font-family:Manrope,sans-serif;font-size:21px;
    font-weight:800;margin:0 0 5px}
  .skc-head p{color:rgba(255,255,255,.72);font-size:13.5px;margin:0}
  .skc-close{position:absolute;top:14px;right:14px;background:rgba(255,255,255,.15);
    border:none;color:#fff;width:32px;height:32px;border-radius:50%;font-size:17px;
    cursor:pointer;display:flex;align-items:center;justify-content:center;
    transition:background .2s}
  .skc-close:hover{background:rgba(255,255,255,.3)}

  /* Body */
  .skc-body{padding:30px 36px 36px}
  .dm-row{display:grid;grid-template-columns:1fr 1fr;gap:16px}
  @media(max-width:500px){.dm-row{grid-template-columns:1fr}}
  .dm-field{display:flex;flex-direction:column;gap:6px;margin-bottom:16px}
  .dm-field label{font-size:13px;font-weight:600;color:#0b2840}
  .dm-field input,.dm-field select,.dm-field textarea{
    border:1.5px solid #ccd8e4;border-radius:10px;padding:10px 14px;font-size:14px;
    font-family:inherit;color:#061a2d;outline:none;
    transition:border-color .2s,box-shadow .2s;background:#fafcff}
  .dm-field input:focus,.dm-field select:focus,.dm-field textarea:focus{
    border-color:#0d72ae;box-shadow:0 0 0 3px rgba(13,114,174,.13);background:#fff}
  .dm-field textarea{resize:vertical;min-height:76px}
  .req{color:#e53e3e}

  /* Submit buttons */
  .skc-submit{width:100%;border:none;border-radius:12px;padding:14px;font-size:15px;
    font-weight:700;font-family:Manrope,sans-serif;cursor:pointer;
    transition:opacity .2s,transform .15s;color:#fff}
  .skc-submit.demo-btn{background:linear-gradient(135deg,#0d72ae,#0b2840)}
  .skc-submit.contact-btn{background:linear-gradient(135deg,#52d4df,#0d72ae)}
  .skc-submit:hover{opacity:.9;transform:translateY(-1px)}
  .skc-submit:disabled{opacity:.6;cursor:not-allowed;transform:none}

  /* Error / success */
  .skc-error{display:none;background:#fff5f5;border:1px solid #fca5a5;
    border-radius:10px;padding:10px 14px;font-size:13px;color:#c53030;margin-bottom:14px}
  .skc-success{display:none;text-align:center;padding:16px 0}
  .skc-success .s-tick{font-size:46px;margin-bottom:12px}
  .skc-success h3{color:#0b2840;font-family:Manrope,sans-serif;font-size:20px;margin:0 0 8px}
  .skc-success p{color:#4a5568;font-size:14px;margin:0}

  .skc-hp{position:absolute!important;left:-9999px!important;width:1px;height:1px;opacity:0}
  .skc-consent{display:flex;gap:8px;align-items:flex-start;font-size:12px;color:#4a5568;margin:4px 0 14px;line-height:1.5;font-weight:400}
  .skc-consent input{margin-top:3px;flex-shrink:0;width:16px;height:16px}
  .skc-consent a{color:#0d72ae}

  /* Badge strip */
  .skc-badges{display:flex;gap:10px;flex-wrap:wrap;margin-top:20px;padding-top:16px;
    border-top:1px solid #edf2f7}
  .skc-badge{font-size:11px;color:#4a7fa5;background:#f0f7ff;border-radius:20px;
    padding:4px 10px;font-weight:600}
  `;
  const el = document.createElement('style');
  el.textContent = css;
  document.head.appendChild(el);
})();

/* ══════════════════════════════════════════════════════════════════════
   MODAL HTML
═══════════════════════════════════════════════════════════════════════ */
(function injectModals() {
  const html = `
  <!-- DEMO REQUEST MODAL -->
  <div id="demo-overlay" class="skc-overlay" role="dialog" aria-modal="true" aria-labelledby="dm-title">
    <div class="skc-modal">
      <div class="skc-head demo-head">
        <button class="skc-close" data-close="demo-overlay" aria-label="Close">✕</button>
        <h2 id="dm-title">📅 Book a Product Demo</h2>
        <p>We will reply within one business day to schedule your personalised demo.</p>
      </div>
      <div class="skc-body">
        <form id="demo-form" novalidate>
          <div class="dm-row">
            <div class="dm-field">
              <label for="dm-name">Full Name <span class="req">*</span></label>
              <input type="text" id="dm-name" name="name" placeholder="Dr. Priya Sharma" required/>
            </div>
            <div class="dm-field">
              <label for="dm-org">Organisation / Hospital <span class="req">*</span></label>
              <input type="text" id="dm-org" name="organisation" placeholder="City Hospital" required/>
            </div>
          </div>
          <div class="dm-row">
            <div class="dm-field">
              <label for="dm-phone">Phone Number <span class="req">*</span></label>
              <input type="tel" id="dm-phone" name="phone" placeholder="+91 98765 43210" required/>
            </div>
            <div class="dm-field">
              <label for="dm-email">Email Address <span class="req">*</span></label>
              <input type="email" id="dm-email" name="email" placeholder="you@hospital.com" required/>
            </div>
          </div>
          <div class="dm-field">
            <label for="dm-product">Product(s) of Interest</label>
            <select id="dm-product" name="product">
              <option value="">— Select a product —</option>
              <option>SKCore COMS — Oncology Management</option>
              <option>SKCore PHR — Women's Health</option>
              <option>SKCore MHA — Mental Health</option>
              <option>SKCore LIS — Laboratory</option>
              <option>SKCore RIS — Radiology</option>
              <option>SKCore BCMA — Barcode Medication Administration</option>
              <option>SKCore CyberSecure</option>
              <option>SKCore Connect — Interoperability</option>
              <option>AI Governance</option>
              <option>Compliances</option>
              <option>Full Platform Suite</option>
            </select>
          </div>
          <div class="dm-field">
            <label for="dm-msg">Message (optional)</label>
            <textarea id="dm-msg" name="message" placeholder="Tell us about your current setup or specific requirements…"></textarea>
          </div>
          <input type="text" id="dm-hp" name="website" class="skc-hp" tabindex="-1" autocomplete="off" aria-hidden="true"/>
          <label class="skc-consent"><input type="checkbox" id="dm-consent"/> I agree that SKCore Health Technologies may store these details and contact me about this request, as described in the <a href="#" data-policy="privacy" data-modal="none">Privacy Policy</a>. <span class="req">*</span></label>
          <div class="skc-error" id="dm-error"></div>
          <button type="submit" class="skc-submit demo-btn" id="dm-submit">Request Demo →</button>
        </form>
        <div class="skc-success" id="dm-success">
          <div class="s-tick">✅</div>
          <h3>Demo Requested!</h3>
          <p>Thank you. We will contact you within one business day to schedule your personalised walkthrough.</p>
        </div>
        <div class="skc-badges">
          <span class="skc-badge">🔒 DPDP Act 2023 Privacy-by-Design</span>
          <span class="skc-badge">📋 No obligation</span>
          <span class="skc-badge">⏱ 45-min session</span>
        </div>
      </div>
    </div>
  </div>

  <!-- CONTACT INQUIRY MODAL -->
  <div id="contact-overlay" class="skc-overlay" role="dialog" aria-modal="true" aria-labelledby="ct-title">
    <div class="skc-modal">
      <div class="skc-head contact-head">
        <button class="skc-close" data-close="contact-overlay" aria-label="Close">✕</button>
        <h2 id="ct-title">💬 Get in Touch</h2>
        <p>Send us a message and we'll respond within one business day.</p>
      </div>
      <div class="skc-body">
        <form id="contact-form" novalidate>
          <div class="dm-row">
            <div class="dm-field">
              <label for="ct-name">Full Name <span class="req">*</span></label>
              <input type="text" id="ct-name" name="name" placeholder="Rajesh Kumar" required/>
            </div>
            <div class="dm-field">
              <label for="ct-org">Organisation</label>
              <input type="text" id="ct-org" name="organisation" placeholder="City Hospital" />
            </div>
          </div>
          <div class="dm-row">
            <div class="dm-field">
              <label for="ct-email">Email Address <span class="req">*</span></label>
              <input type="email" id="ct-email" name="email" placeholder="you@example.com" required/>
            </div>
            <div class="dm-field">
              <label for="ct-phone">Phone Number</label>
              <input type="tel" id="ct-phone" name="phone" placeholder="+91 98765 43210"/>
            </div>
          </div>
          <div class="dm-field">
            <label for="ct-subject">Subject <span class="req">*</span></label>
            <select id="ct-subject" name="subject" required>
              <option value="">— Select a subject —</option>
              <option>General Inquiry</option>
              <option>Pricing & Licensing</option>
              <option>Partnership / Integration</option>
              <option>Technical Support</option>
              <option>Consulting Services</option>
              <option>Media & Press</option>
              <option>Careers</option>
              <option>Investor / Incubator Enquiry</option>
              <option>Pilot Partnership</option>
              <option>Grant / Incubation Programme</option>
            </select>
          </div>
          <div class="dm-field">
            <label for="ct-msg">Message <span class="req">*</span></label>
            <textarea id="ct-msg" name="message" placeholder="How can we help you?" required></textarea>
          </div>
          <input type="text" id="ct-hp" name="website" class="skc-hp" tabindex="-1" autocomplete="off" aria-hidden="true"/>
          <label class="skc-consent"><input type="checkbox" id="ct-consent"/> I agree that SKCore Health Technologies may store these details and contact me about this request, as described in the <a href="#" data-policy="privacy" data-modal="none">Privacy Policy</a>. <span class="req">*</span></label>
          <div class="skc-error" id="ct-error"></div>
          <button type="submit" class="skc-submit contact-btn" id="ct-submit">Send Message →</button>
        </form>
        <div class="skc-success" id="ct-success">
          <div class="s-tick">📨</div>
          <h3>Message Sent!</h3>
          <p>Thank you for reaching out. We'll get back to you within one business day.</p>
        </div>
        <div class="skc-badges">
          <span class="skc-badge">🕐 Mon–Sat 9am–6pm IST</span>
        </div>
      </div>
    </div>
  </div>`;

  document.body.insertAdjacentHTML('beforeend', html);
})();

/* ══════════════════════════════════════════════════════════════════════
   OPEN / CLOSE HELPERS
═══════════════════════════════════════════════════════════════════════ */
function openModal(id) {
  document.getElementById(id).classList.add('open');
  document.body.style.overflow = 'hidden';
  var first = document.querySelector('#' + id + ' input:not([type=hidden]):not(.skc-hp)');
  if (first) setTimeout(function () { first.focus(); }, 50);
}
function closeModal(id) {
  document.getElementById(id).classList.remove('open');
  document.body.style.overflow = '';
}

/* Pre-select a <select> option whose text contains the given phrase */
function preselect(selectId, phrase) {
  if (!phrase) return;
  var sel = document.getElementById(selectId);
  if (!sel) return;
  var p = phrase.toLowerCase();
  for (var i = 0; i < sel.options.length; i++) {
    var t = sel.options[i].text.toLowerCase();
    if (t && sel.options[i].value !== '' && (t.indexOf(p) !== -1 || p.indexOf(t.split(' —')[0]) !== -1)) {
      sel.selectedIndex = i;
      return;
    }
  }
}

/* ══════════════════════════════════════════════════════════════════════
   WIRE-UP
═══════════════════════════════════════════════════════════════════════ */
function initForms() {

  document.querySelectorAll('.skc-close').forEach(function (btn) {
    btn.addEventListener('click', function () { closeModal(btn.dataset.close); });
  });

  ['demo-overlay', 'contact-overlay'].forEach(function (id) {
    document.getElementById(id).addEventListener('click', function (e) {
      if (e.target === this) closeModal(id);
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeModal('demo-overlay'); closeModal('contact-overlay'); }
  });

  /* ── Global delegated click router ─────────────────────────────── */
  // Priority: data-modal attribute ("demo" | "contact" | "none"), then
  // demo/contact mailto links and #contact anchors, then button text.
  document.addEventListener('click', function (e) {
    var el = e.target;
    while (el && el !== document.body) {
      if (el.tagName === 'A' || el.tagName === 'BUTTON') break;
      el = el.parentElement;
    }
    if (!el || (el.tagName !== 'A' && el.tagName !== 'BUTTON')) return;
    if (el.closest('#demo-overlay, #contact-overlay, .pol-overlay, #skl-card')) return;

    // Privacy / Security policy links are handled by policies.js
    var linkText = (el.textContent || '').trim().toLowerCase();
    if (el.hasAttribute('data-policy') || /^(privacy( policy)?|security( policy)?)$/.test(linkText)) return;

    var modalAttr = (el.getAttribute('data-modal') || '').toLowerCase();
    if (modalAttr === 'none') return;

    var txt  = (el.textContent || '').trim().toLowerCase();
    var rawHref = el.getAttribute('href') || '';
    var href = rawHref.toLowerCase();
    var subjectFromHref = '';
    try { var m = rawHref.match(/[?&]subject=([^&]+)/i); if (m) subjectFromHref = decodeURIComponent(m[1]); } catch (_) {}

    var isDemo = modalAttr === 'demo' || (!modalAttr && (
      href.indexOf('mailto:demo@') === 0 || href.indexOf('#demo') !== -1 ||
      /\b(book|request|schedule)\b.*\bdemo\b/.test(txt)
    ));
    var isContact = !isDemo && (modalAttr === 'contact' || (!modalAttr && (
      href.indexOf('mailto:info@') === 0 || href.indexOf('mailto:contact@') === 0 ||
      href.indexOf('mailto:consulting@') === 0 || href === '#contact' ||
      /\b(get in touch|talk to us|start a conversation|send us a message)\b/.test(txt)
    )));

    if (isDemo) {
      e.preventDefault();
      preselect('dm-product', el.getAttribute('data-product') || (subjectFromHref.match(/SKCore\s+\w+/i) || [''])[0]);
      openModal('demo-overlay');
    } else if (isContact) {
      e.preventDefault();
      preselect('ct-subject', el.getAttribute('data-subject') || subjectFromHref);
      openModal('contact-overlay');
    }
  });

  /* ── Demo Form submit ───────────────────────────────────────────── */
  document.getElementById('demo-form').addEventListener('submit', function (e) {
    e.preventDefault();
    hideError('dm-error');
    var v = function (id) { return (document.getElementById(id).value || '').trim(); };
    var name = v('dm-name'), org = v('dm-org'), phone = v('dm-phone'), email = v('dm-email');

    if (!name || !org || !phone || !email) return showError('dm-error', 'Please fill in all required fields.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showError('dm-error', 'Please enter a valid email address.');
    if (!/^[+\d][\d\s()-]{6,}$/.test(phone)) return showError('dm-error', 'Please enter a valid phone number.');
    if (!document.getElementById('dm-consent').checked) return showError('dm-error', 'Please tick the consent box so we can contact you.');

    var payload = {
      type: 'demo', timestamp: new Date().toISOString(),
      name: name, organisation: org, phone: phone, email: email,
      product: v('dm-product') || 'Not specified', message: v('dm-msg'),
      consent: 'yes', page: location.pathname, website: v('dm-hp')
    };
    submitForm(payload, 'demo_leads', 'dm-submit', 'dm-error', function () {
      showSuccess('demo-form', 'dm-success', 'demo-overlay', 'dm-submit');
    });
  });

  /* ── Contact Form submit ────────────────────────────────────────── */
  document.getElementById('contact-form').addEventListener('submit', function (e) {
    e.preventDefault();
    hideError('ct-error');
    var v = function (id) { return (document.getElementById(id).value || '').trim(); };
    var name = v('ct-name'), email = v('ct-email'), subject = v('ct-subject'), msg = v('ct-msg'), phone = v('ct-phone');

    if (!name || !email || !subject || !msg) return showError('ct-error', 'Please fill in all required fields.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showError('ct-error', 'Please enter a valid email address.');
    if (phone && !/^[+\d][\d\s()-]{6,}$/.test(phone)) return showError('ct-error', 'Please enter a valid phone number.');
    if (!document.getElementById('ct-consent').checked) return showError('ct-error', 'Please tick the consent box so we can contact you.');

    var payload = {
      type: 'contact', timestamp: new Date().toISOString(),
      name: name, organisation: v('ct-org'), email: email, phone: phone,
      subject: subject, message: msg,
      consent: 'yes', page: location.pathname, website: v('ct-hp')
    };
    submitForm(payload, 'contact_leads', 'ct-submit', 'ct-error', function () {
      showSuccess('contact-form', 'ct-success', 'contact-overlay', 'ct-submit');
    });
  });

  /* ══════════════════════════════════════════════════════════════════
     HELPERS
  ══════════════════════════════════════════════════════════════════ */
  function hideError(boxId) { document.getElementById(boxId).style.display = 'none'; }

  function showError(boxId, msg, withEmail) {
    var box = document.getElementById(boxId);
    box.textContent = msg;
    if (withEmail) {
      box.appendChild(document.createTextNode(' You can also email us at '));
      var a = document.createElement('a');
      a.href = 'mailto:info@skcorehealth.com';
      a.setAttribute('data-modal', 'none');
      a.textContent = 'info@skcorehealth.com';
      a.style.color = '#c53030';
      box.appendChild(a);
      box.appendChild(document.createTextNode('.'));
    }
    box.style.display = 'block';
  }

  function setBtn(btnId, busy) {
    var btn = document.getElementById(btnId);
    btn.disabled = busy;
    btn.textContent = busy ? 'Sending…'
      : (btn.classList.contains('demo-btn') ? 'Request Demo →' : 'Send Message →');
  }

  // Apps Script web apps do not answer CORS pre-flight (OPTIONS) requests,
  // so the body is sent as text/plain (a "simple" request, no pre-flight).
  // The script still receives the JSON in e.postData.contents.
  function submitForm(payload, storageKey, btnId, errId, onSuccess) {
    setBtn(btnId, true);
    try {
      var existing = JSON.parse(localStorage.getItem(storageKey) || '[]');
      existing.push(payload);
      localStorage.setItem(storageKey, JSON.stringify(existing.slice(-20)));
    } catch (_) {}

    var fail = function (detail) {
      setBtn(btnId, false);
      showError(errId, 'Sorry — we could not send your request right now. Please try again in a moment.' +
        (detail ? ' (' + String(detail).slice(0, 120) + ')' : ''), true);
    };
    if (!FORMS_ENDPOINT) return fail();

    var ctrl = (typeof AbortController !== 'undefined') ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, 20000);

    fetch(FORMS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
      redirect: 'follow',
      signal: ctrl ? ctrl.signal : undefined
    })
    .then(function (r) { return r.text(); })
    .then(function (t) {
      clearTimeout(timer);
      var res = null;
      try { res = JSON.parse(t); } catch (_) {}
      if (res && res.status === 'ok') onSuccess(); else fail(res && res.message ? res.message : 'unexpected response');
    })
    .catch(function (e) { clearTimeout(timer); fail(e && e.name === 'AbortError' ? 'timed out' : 'network error'); });
  }

  function showSuccess(formId, successId, overlayId, btnId) {
    document.getElementById(formId).style.display = 'none';
    document.getElementById(successId).style.display = 'block';
    setTimeout(function () {
      closeModal(overlayId);
      setTimeout(function () {
        document.getElementById(formId).reset();
        document.getElementById(formId).style.display = 'block';
        document.getElementById(successId).style.display = 'none';
        setBtn(btnId, false);
      }, 400);
    }, 4000);
  }
}

// Safe init — works whether DOM is already ready or not
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initForms);
} else {
  initForms();
}
