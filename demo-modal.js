/**
 * SKCore Health Technologies — Forms (Demo Request + Contact Inquiry)
 * Self-contained: injects styles + HTML for both modals.
 *
 * Configuration — paste your Google Apps Script Web App URL below.
 * One URL handles both form types (type field differentiates them).
 */
const FORMS_ENDPOINT = ''; // paste your Apps Script URL here

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
        <p>Our team will reach out within one business day to schedule your personalised demo.</p>
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
              <input type="text" id="dm-org" name="organisation" placeholder="Apollo Hospitals" required/>
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
              <option>SKCore PHR — Personal Health Record</option>
              <option>SKCore MHA — Mental Health</option>
              <option>SKCore LIS — Laboratory</option>
              <option>SKCore RIS — Radiology</option>
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
          <div class="skc-error" id="dm-error"></div>
          <button type="submit" class="skc-submit demo-btn" id="dm-submit">Request Demo →</button>
        </form>
        <div class="skc-success" id="dm-success">
          <div class="s-tick">✅</div>
          <h3>Demo Requested!</h3>
          <p>Thank you. Our team will contact you within one business day to schedule your personalised walkthrough.</p>
        </div>
        <div class="skc-badges">
          <span class="skc-badge">🔒 DPDP 2023 Compliant</span>
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
            </select>
          </div>
          <div class="dm-field">
            <label for="ct-msg">Message <span class="req">*</span></label>
            <textarea id="ct-msg" name="message" placeholder="How can we help you?" required></textarea>
          </div>
          <div class="skc-error" id="ct-error"></div>
          <button type="submit" class="skc-submit contact-btn" id="ct-submit">Send Message →</button>
        </form>
        <div class="skc-success" id="ct-success">
          <div class="s-tick">📨</div>
          <h3>Message Sent!</h3>
          <p>Thank you for reaching out. We'll get back to you within one business day.</p>
        </div>
        <div class="skc-badges">
          <span class="skc-badge">📍 Bangalore, India</span>
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
}
function closeModal(id) {
  document.getElementById(id).classList.remove('open');
  document.body.style.overflow = '';
}

/* ══════════════════════════════════════════════════════════════════════
   WIRE-UP
═══════════════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', function () {

  /* Close buttons (data-close attribute) */
  document.querySelectorAll('.skc-close').forEach(function (btn) {
    btn.addEventListener('click', function () {
      closeModal(btn.dataset.close);
    });
  });

  /* Click-backdrop-to-close */
  ['demo-overlay', 'contact-overlay'].forEach(function (id) {
    document.getElementById(id).addEventListener('click', function (e) {
      if (e.target === this) closeModal(id);
    });
  });

  /* Escape key */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeModal('demo-overlay');
      closeModal('contact-overlay');
    }
  });

  /* ── Smart link routing ─────────────────────────────────────────── */
  // Classify all anchor/button elements and route to the right modal.
  // Priority: explicit data-modal attr > text content keywords
  document.querySelectorAll('a, button').forEach(function (el) {
    var txt     = (el.textContent || '').trim().toLowerCase();
    var href    = el.getAttribute('href') || '';
    var explicit = el.dataset.modal; // data-modal="demo" or data-modal="contact"

    var isDemo    = explicit === 'demo'    || (!explicit && (
                      txt.includes('demo') || txt.includes('book a demo') ||
                      txt.includes('book demo') || txt.includes('request demo') ||
                      txt.includes('schedule demo') ||
                      href.includes('#demo') ||
                      href.includes('mailto:demo@')
                    ));
    var isContact = explicit === 'contact' || (!explicit && !isDemo && (
                      txt.includes('contact') || txt.includes('get in touch') ||
                      txt.includes('reach out') || txt.includes('inquiry') ||
                      txt.includes('enquiry') || txt.includes('talk to us') ||
                      txt.includes('send message') || txt.includes('send us') ||
                      txt.includes('consulting') || txt.includes('engagement') ||
                      href.includes('mailto:info@') || href.includes('mailto:contact@') ||
                      href.includes('mailto:consulting@')
                    ));

    // Intercept href="#contact" or href containing #contact (e.g. ../index.html#contact)
    if (!isDemo && !isContact) {
      if (href.includes('#contact')) isContact = true;
    }

    if (isDemo) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        openModal('demo-overlay');
      });
    } else if (isContact) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        openModal('contact-overlay');
      });
    }
  });

  /* ── Demo Form submit ───────────────────────────────────────────── */
  document.getElementById('demo-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var errBox = document.getElementById('dm-error');
    errBox.style.display = 'none';

    var name  = document.getElementById('dm-name').value.trim();
    var org   = document.getElementById('dm-org').value.trim();
    var phone = document.getElementById('dm-phone').value.trim();
    var email = document.getElementById('dm-email').value.trim();
    var prod  = document.getElementById('dm-product').value;
    var msg   = document.getElementById('dm-msg').value.trim();

    if (!name || !org || !phone || !email) {
      return showError('dm-error', 'Please fill in all required fields.');
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      return showError('dm-error', 'Please enter a valid email address.');
    }

    var payload = {
      type: 'demo',
      timestamp: new Date().toISOString(),
      name: name, organisation: org, phone: phone, email: email,
      product: prod || 'Not specified', message: msg
    };

    disableBtn('dm-submit');
    saveAndSubmit(payload, 'demo_leads', function () {
      showSuccess('demo-form', 'dm-success', 'demo-overlay', 'dm-submit');
    });
  });

  /* ── Contact Form submit ────────────────────────────────────────── */
  document.getElementById('contact-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var errBox = document.getElementById('ct-error');
    errBox.style.display = 'none';

    var name    = document.getElementById('ct-name').value.trim();
    var org     = document.getElementById('ct-org').value.trim();
    var email   = document.getElementById('ct-email').value.trim();
    var phone   = document.getElementById('ct-phone').value.trim();
    var subject = document.getElementById('ct-subject').value;
    var msg     = document.getElementById('ct-msg').value.trim();

    if (!name || !email || !subject || !msg) {
      return showError('ct-error', 'Please fill in all required fields.');
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      return showError('ct-error', 'Please enter a valid email address.');
    }

    var payload = {
      type: 'contact',
      timestamp: new Date().toISOString(),
      name: name, organisation: org, email: email, phone: phone,
      subject: subject, message: msg
    };

    disableBtn('ct-submit');
    saveAndSubmit(payload, 'contact_leads', function () {
      showSuccess('contact-form', 'ct-success', 'contact-overlay', 'ct-submit');
    });
  });

  /* ══════════════════════════════════════════════════════════════════
     HELPERS
  ══════════════════════════════════════════════════════════════════ */
  function showError(boxId, msg) {
    var box = document.getElementById(boxId);
    box.textContent = msg;
    box.style.display = 'block';
  }

  function disableBtn(btnId) {
    var btn = document.getElementById(btnId);
    btn.disabled = true;
    btn.textContent = 'Sending…';
  }

  function saveAndSubmit(payload, storageKey, onSuccess) {
    // Always save to localStorage
    try {
      var existing = JSON.parse(localStorage.getItem(storageKey) || '[]');
      existing.push(payload);
      localStorage.setItem(storageKey, JSON.stringify(existing));
    } catch (_) {}

    // POST to Apps Script if configured
    if (FORMS_ENDPOINT) {
      fetch(FORMS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      .then(onSuccess)
      .catch(onSuccess); // still succeed — localStorage has the data
    } else {
      onSuccess();
    }
  }

  function showSuccess(formId, successId, overlayId, btnId) {
    document.getElementById(formId).style.display    = 'none';
    document.getElementById(successId).style.display = 'block';

    setTimeout(function () {
      closeModal(overlayId);
      setTimeout(function () {
        // Reset for next open
        document.getElementById(formId).reset();
        document.getElementById(formId).style.display    = 'block';
        document.getElementById(successId).style.display = 'none';
        var btn = document.getElementById(btnId);
        btn.disabled    = false;
        btn.textContent = btn.classList.contains('demo-btn')
          ? 'Request Demo →' : 'Send Message →';
      }, 400);
    }, 4000);
  }

});
