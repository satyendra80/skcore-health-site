/**
 * SKCore Health Technologies — Privacy Policy & Security Policy Modals
 * Injects both policy documents as scrollable modal windows.
 * Effective date: August 2026
 */

/* ══════════════════════════════════════════════════════════════════════
   STYLES
═══════════════════════════════════════════════════════════════════════ */
(function injectPolicyStyles() {
  var css = `
  .pol-overlay{position:fixed;inset:0;z-index:10000;display:flex;align-items:center;
    justify-content:center;background:rgba(6,26,45,.82);backdrop-filter:blur(8px);
    opacity:0;pointer-events:none;transition:opacity .25s}
  .pol-overlay.open{opacity:1;pointer-events:all}

  .pol-modal{background:#fff;border-radius:20px;width:min(780px,96vw);
    max-height:90vh;display:flex;flex-direction:column;
    box-shadow:0 32px 100px rgba(0,0,0,.35);
    transform:translateY(32px) scale(.97);
    transition:transform .3s cubic-bezier(.34,1.56,.64,1)}
  .pol-overlay.open .pol-modal{transform:translateY(0) scale(1)}

  .pol-head{padding:26px 36px 22px;border-radius:20px 20px 0 0;
    display:flex;align-items:flex-start;justify-content:space-between;
    gap:16px;flex-shrink:0}
  .pol-head.privacy-head{background:linear-gradient(135deg,#0b2840,#0d72ae)}
  .pol-head.security-head{background:linear-gradient(135deg,#061a2d,#7c3aed)}
  .pol-head-copy h2{color:#fff;font-family:Manrope,sans-serif;font-size:20px;
    font-weight:800;margin:0 0 4px}
  .pol-head-copy p{color:rgba(255,255,255,.65);font-size:12.5px;margin:0}
  .pol-close-btn{background:rgba(255,255,255,.15);border:none;color:#fff;
    width:34px;height:34px;border-radius:50%;font-size:18px;cursor:pointer;
    flex-shrink:0;display:flex;align-items:center;justify-content:center;
    transition:background .2s;margin-top:2px}
  .pol-close-btn:hover{background:rgba(255,255,255,.3)}

  .pol-body{overflow-y:auto;padding:32px 36px 36px;flex:1;
    scrollbar-width:thin;scrollbar-color:#c3d4e8 transparent}
  .pol-body::-webkit-scrollbar{width:5px}
  .pol-body::-webkit-scrollbar-thumb{background:#c3d4e8;border-radius:10px}

  /* Typography inside policy */
  .pol-body h3{font-family:Manrope,sans-serif;font-size:15px;font-weight:800;
    color:#0b2840;margin:28px 0 8px;padding-bottom:6px;
    border-bottom:1.5px solid #edf2f7}
  .pol-body h3:first-child{margin-top:0}
  .pol-body p{font-size:13.5px;color:#374151;line-height:1.7;margin:0 0 10px}
  .pol-body ul{margin:6px 0 12px 0;padding-left:20px}
  .pol-body ul li{font-size:13px;color:#374151;line-height:1.6;margin-bottom:4px}
  .pol-body strong{color:#0b2840}
  .pol-body a{color:#0d72ae;text-decoration:none}
  .pol-body a:hover{text-decoration:underline}

  .pol-badge-row{display:flex;flex-wrap:wrap;gap:8px;margin:16px 0 0}
  .pol-badge{font-size:11px;font-weight:700;padding:4px 12px;border-radius:20px}
  .pol-badge.blue{background:#e8f4ff;color:#0d72ae}
  .pol-badge.green{background:#f0fff4;color:#166534}
  .pol-badge.purple{background:#f5f3ff;color:#6d28d9}

  .pol-footer-bar{background:#f8fafc;border-top:1px solid #edf2f7;
    padding:14px 36px;border-radius:0 0 20px 20px;
    display:flex;align-items:center;justify-content:space-between;
    flex-shrink:0;flex-wrap:wrap;gap:10px}
  .pol-footer-bar span{font-size:12px;color:#6b7280}
  .pol-footer-bar a{font-size:12px;color:#0d72ae;font-weight:600;text-decoration:none}
  `;
  var el = document.createElement('style');
  el.textContent = css;
  document.head.appendChild(el);
})();

/* ══════════════════════════════════════════════════════════════════════
   MODAL HTML
═══════════════════════════════════════════════════════════════════════ */
(function injectPolicyModals() {
  var html = `

  <!-- ── PRIVACY POLICY MODAL ───────────────────────────────────────── -->
  <div id="privacy-overlay" class="pol-overlay" role="dialog" aria-modal="true" aria-labelledby="priv-title">
    <div class="pol-modal">
      <div class="pol-head privacy-head">
        <div class="pol-head-copy">
          <h2 id="priv-title">🔒 Privacy Policy</h2>
          <p>SKCore Health Technologies Pvt. Ltd. · Effective: August 2026 · Version 1.0</p>
        </div>
        <button class="pol-close-btn" data-pol-close="privacy-overlay" aria-label="Close">✕</button>
      </div>
      <div class="pol-body">

        <p>SKCore Health Technologies Pvt. Ltd. (<strong>"SKCore"</strong>, <strong>"we"</strong>, <strong>"us"</strong>) is committed to protecting your personal data and health information. This Privacy Policy describes how we collect, use, share, and safeguard information when you interact with our products, website (<strong>skcorehealth.com</strong>), and services, in compliance with the <strong>Digital Personal Data Protection Act, 2023 (DPDP Act)</strong> and applicable healthcare regulations in India.</p>

        <div class="pol-badge-row">
          <span class="pol-badge blue">DPDP Act 2023 Compliant</span>
          <span class="pol-badge purple">ISO/IEC 27701:2019 PIMS</span>
          <span class="pol-badge blue">ABDM Compliant</span>
          <span class="pol-badge green">FHIR R4 Consent-Based Exchange</span>
          <span class="pol-badge green">No Data Sale</span>
        </div>

        <h3>1. Data We Collect</h3>
        <p>We collect personal and health data only to the extent necessary to deliver our services:</p>
        <ul>
          <li><strong>Identity data</strong> — name, designation, organisation, phone number, email address submitted via demo or contact forms on this website.</li>
          <li><strong>Health records</strong> (via hospital deployments) — patient demographics, diagnosis, treatment plans, lab results, prescriptions, and imaging metadata processed within our clinical products (COMS, PHR, LIS, RIS, MHA, etc.) on your organisation's infrastructure.</li>
          <li><strong>ABHA-linked data</strong> — health records accessed or shared through the Ayushman Bharat Health Account (ABHA) system with explicit patient consent under ABDM's Consent Manager framework.</li>
          <li><strong>Usage data</strong> — anonymised product usage analytics, error logs, and performance metrics collected within deployed instances.</li>
          <li><strong>Website data</strong> — browser type, IP address, pages visited, and session duration collected via standard web server logs.</li>
        </ul>

        <h3>2. How We Use Your Data</h3>
        <ul>
          <li>To respond to demo requests and sales enquiries.</li>
          <li>To deliver, maintain, and improve SKCore products deployed at your organisation.</li>
          <li>To enable ABDM-based health record exchange with patient consent.</li>
          <li>To send product updates, security advisories, and compliance notifications (with opt-out in every communication).</li>
          <li>To fulfil legal obligations under the DPDP Act 2023, IT Act 2000, and applicable healthcare regulations.</li>
        </ul>
        <p>We do <strong>not</strong> use health data for advertising, profiling, or any purpose beyond the contracted clinical service.</p>

        <h3>3. Lawful Bases for Processing</h3>
        <p>We process personal data on the following lawful bases under the DPDP Act 2023:</p>
        <ul>
          <li><strong>Consent</strong> — obtained explicitly before processing sensitive personal data, including health records. Consent is granular, informed, and revocable.</li>
          <li><strong>Contractual necessity</strong> — processing required to fulfil a software deployment or service agreement with your organisation.</li>
          <li><strong>Legal obligation</strong> — processing required by applicable Indian law.</li>
          <li><strong>Legitimate interests</strong> — improving product security, fraud prevention, and product analytics (always balanced against your interests).</li>
        </ul>

        <h3>4. Data Sharing</h3>
        <p>We do not sell, rent, or trade your personal data. We may share data only in these circumstances:</p>
        <ul>
          <li><strong>Within your organisation</strong> — SKCore products are deployed on your infrastructure; patient data stays within your controlled environment.</li>
          <li><strong>ABDM ecosystem</strong> — health records shared via ABHA only with explicit patient consent through the Consent Manager.</li>
          <li><strong>Service providers</strong> — sub-processors (hosting, monitoring) under data processing agreements that enforce equivalent protections.</li>
          <li><strong>Legal requirement</strong> — when required by a court order, regulatory authority, or applicable law, we will notify you to the extent legally permitted.</li>
        </ul>

        <h3>5. Data Retention</h3>
        <ul>
          <li><strong>Website enquiry data</strong> — retained for 24 months, then permanently deleted.</li>
          <li><strong>Clinical data in hospital deployments</strong> — retained per your organisation's data retention policy and applicable MCI/NMC guidelines (minimum 5 years for medical records).</li>
          <li><strong>Audit logs</strong> — retained for 7 years to meet regulatory requirements.</li>
          <li><strong>ABHA-linked records</strong> — subject to ABDM Health Data Retention Policy.</li>
        </ul>

        <h3>6. Your Rights (DPDP Act 2023)</h3>
        <p>As a Data Principal under the DPDP Act, you have the right to:</p>
        <ul>
          <li><strong>Access</strong> — request a summary of personal data we hold about you.</li>
          <li><strong>Correction</strong> — request correction of inaccurate or incomplete data.</li>
          <li><strong>Erasure</strong> — request deletion of personal data (subject to legal retention obligations).</li>
          <li><strong>Grievance redressal</strong> — raise a complaint with our Data Protection Officer; we will respond within 72 hours.</li>
          <li><strong>Nominate</strong> — nominate another individual to exercise rights on your behalf in the event of death or incapacity.</li>
        </ul>
        <p>To exercise any right, email: <a href="mailto:privacy@skcorehealth.com">privacy@skcorehealth.com</a></p>

        <h3>7. Security of Your Data</h3>
        <p>We implement administrative, technical, and physical safeguards including AES-256 encryption at rest, TLS 1.3 in transit, role-based access control, and continuous security monitoring. Please refer to our <strong>Security Policy</strong> for full details.</p>

        <h3>8. Cookies</h3>
        <p>Our website uses strictly necessary cookies for session management and no third-party tracking or advertising cookies. You may disable cookies in your browser without affecting core website functionality.</p>

        <h3>9. Children's Data</h3>
        <p>Our products are not directed to individuals under 18. Where paediatric health data is processed in clinical deployments, it is handled with enhanced safeguards and parental/guardian consent in accordance with the DPDP Act 2023.</p>

        <h3>10. Changes to This Policy</h3>
        <p>We will notify registered contacts and post a notice on this website at least 30 days before material changes take effect. Continued use of our products after the effective date constitutes acceptance.</p>

        <h3>11. Contact & Grievance Officer</h3>
        <p>
          <strong>Data Protection Officer</strong><br/>
          SKCore Health Technologies Pvt. Ltd.<br/>
          Bangalore, Karnataka, India<br/>
          Email: <a href="mailto:privacy@skcorehealth.com">privacy@skcorehealth.com</a><br/>
          Response time: within 72 hours of receipt.
        </p>
        <p>If you are not satisfied with our response, you may lodge a complaint with the <strong>Data Protection Board of India</strong> once it is constituted under the DPDP Act 2023.</p>

      </div>
      <div class="pol-footer-bar">
        <span>© 2026 SKCore Health Technologies Pvt. Ltd. All rights reserved.</span>
        <a href="mailto:privacy@skcorehealth.com">privacy@skcorehealth.com</a>
      </div>
    </div>
  </div>

  <!-- ── SECURITY POLICY MODAL ──────────────────────────────────────── -->
  <div id="security-overlay" class="pol-overlay" role="dialog" aria-modal="true" aria-labelledby="sec-title">
    <div class="pol-modal">
      <div class="pol-head security-head">
        <div class="pol-head-copy">
          <h2 id="sec-title">🛡️ Security Policy</h2>
          <p>SKCore Health Technologies Pvt. Ltd. · Effective: August 2026 · Version 1.0</p>
        </div>
        <button class="pol-close-btn" data-pol-close="security-overlay" aria-label="Close">✕</button>
      </div>
      <div class="pol-body">

        <p>SKCore Health Technologies Pvt. Ltd. treats the security of clinical and personal data as a fundamental obligation. This Security Policy outlines the controls, practices, and standards we apply across all SKCore products and infrastructure to protect patient health information, organisational data, and system integrity.</p>

        <div class="pol-badge-row">
          <span class="pol-badge purple">ISO/IEC 27001:2022</span>
          <span class="pol-badge purple">ISO/IEC 27701:2019</span>
          <span class="pol-badge purple">ISO 9001:2015</span>
          <span class="pol-badge purple">ISO 13485:2016</span>
          <span class="pol-badge purple">ISO 14001:2015</span>
          <span class="pol-badge blue">AES-256 Encryption</span>
          <span class="pol-badge blue">TLS 1.3 In Transit</span>
          <span class="pol-badge green">Zero Trust Architecture</span>
          <span class="pol-badge green">24×7 SOC Monitoring</span>
        </div>

        <h3>1. Security &amp; Quality Framework</h3>
        <p>Our security and quality programme is aligned with internationally recognised standards and healthcare-specific frameworks:</p>
        <ul>
          <li><strong>ISO/IEC 27001:2022</strong> — Information Security Management System (ISMS). The foundation of our security controls: risk assessment, asset management, access control, incident management, and continuous improvement.</li>
          <li><strong>ISO/IEC 27701:2019</strong> — Privacy Information Management System (PIMS). Extends ISO 27001 with privacy-specific controls for personally identifiable information (PII), including health data, ABHA records, and patient consent workflows.</li>
          <li><strong>ISO 9001:2015</strong> — Quality Management System (QMS). Governs our software development lifecycle, release processes, change management, supplier evaluation, and customer satisfaction measurement.</li>
          <li><strong>ISO 13485:2016</strong> — Medical Device Quality Management. Applicable to SKCore products qualifying as Software as a Medical Device (SaMD) under CDSCO guidelines. Covers design controls, risk management, validation, and post-market surveillance.</li>
          <li><strong>ISO 14001:2015</strong> — Environmental Management System. We are committed to minimising the environmental impact of our operations — responsible e-waste disposal, energy-efficient infrastructure, and paperless processes in our offices.</li>
          <li><strong>ISO/IEC 27799:2016</strong> — Health Informatics Security. Sector-specific extension of ISO 27001 addressing the unique security requirements of health information systems, including clinical data access patterns, patient privacy, and continuity of care.</li>
          <li><strong>IEC 62304:2006+AMD1:2015</strong> — Medical Device Software Lifecycle. Governs our software development, maintenance, and risk management processes for SaMD-classified modules.</li>
          <li><strong>ISO 80001-1:2021</strong> — Risk management for IT networks incorporating medical devices. Applied within our CyberSecure IoMT monitoring product.</li>
          <li><strong>NIST Cybersecurity Framework 2.0</strong> and <strong>CERT-In guidelines</strong> for incident response, vulnerability management, and threat intelligence.</li>
        </ul>
        <ul>
          <li><strong>Confidentiality</strong> — health data is accessible only to authorised users with a legitimate clinical need.</li>
          <li><strong>Integrity</strong> — every data modification is immutably logged with user identity, timestamp, and change details.</li>
          <li><strong>Availability</strong> — systems are designed for 99.9% uptime with automated failover and tested disaster recovery.</li>
        </ul>

        <h3>2. Data Encryption</h3>
        <ul>
          <li><strong>At rest</strong> — AES-256 encryption for all databases, file stores, and backups. Encryption keys are rotated quarterly and managed via a Hardware Security Module (HSM).</li>
          <li><strong>In transit</strong> — TLS 1.3 enforced for all API endpoints, web interfaces, and inter-service communication. TLS 1.0/1.1 are disabled.</li>
          <li><strong>ABHA/FHIR exchange</strong> — end-to-end encrypted per ABDM security specifications using patient consent-bound tokens.</li>
          <li><strong>Backup data</strong> — encrypted with separate keys stored in geographically distinct vaults.</li>
        </ul>

        <h3>3. Access Control</h3>
        <ul>
          <li><strong>Role-based access control (RBAC)</strong> — every user is assigned a minimum-privilege role (Provider, Nurse, Pharmacist, Admin). Role changes require dual-approval.</li>
          <li><strong>Multi-factor authentication (MFA)</strong> — mandatory for all administrative accounts and recommended for all clinical users.</li>
          <li><strong>Zero Trust model</strong> — every request is authenticated and authorised regardless of network origin; no implicit trust inside the perimeter.</li>
          <li><strong>Session management</strong> — automatic session expiry after inactivity; concurrent session limits enforced per role.</li>
          <li><strong>Privileged access management</strong> — production system access by SKCore engineers requires just-in-time approval, is time-limited, and fully audited.</li>
        </ul>

        <h3>4. Audit Trail & Logging</h3>
        <ul>
          <li>Every data access, modification, export, and authentication event is recorded in a tamper-evident audit log.</li>
          <li>Logs capture: user ID, role, timestamp (UTC), action, affected record, source IP, and session ID.</li>
          <li>Audit logs are write-once, retained for 7 years, and exportable for regulatory review.</li>
          <li>AI-generated suggestions are logged with a separate flag distinguishing them from clinician-entered data.</li>
        </ul>

        <h3>5. Vulnerability Management</h3>
        <ul>
          <li><strong>Patch management</strong> — critical vulnerabilities patched within 24 hours; high within 72 hours; medium within 14 days.</li>
          <li><strong>Dependency scanning</strong> — automated scanning of all third-party libraries in the CI/CD pipeline via OWASP Dependency-Check and Trivy.</li>
          <li><strong>Penetration testing</strong> — annual third-party penetration test; results and remediation tracked to closure.</li>
          <li><strong>Static code analysis</strong> — SAST tools run on every pull request; no high-severity findings merge to main.</li>
          <li><strong>Container security</strong> — all Docker images scanned before deployment; distroless base images used where possible.</li>
        </ul>

        <h3>6. Network & Infrastructure Security</h3>
        <ul>
          <li>Web application firewall (WAF) protecting all public-facing endpoints.</li>
          <li>DDoS mitigation at the edge layer.</li>
          <li>Network segmentation — clinical data networks isolated from corporate and internet-facing zones.</li>
          <li>IoMT device monitoring — SKCore CyberSecure continuously monitors medical device traffic for anomalies and policy violations.</li>
          <li>HL7 and FHIR API anomaly detection with automated alerting.</li>
        </ul>

        <h3>7. Incident Response</h3>
        <p>We maintain a documented Incident Response Plan tested via tabletop exercises twice a year:</p>
        <ul>
          <li><strong>Detection</strong> — 24×7 SIEM monitoring with automated alerting for indicators of compromise.</li>
          <li><strong>Containment</strong> — affected systems isolated within 15 minutes of confirmed incident.</li>
          <li><strong>Notification</strong> — affected organisations notified within 6 hours of a confirmed breach; CERT-In notified within 6 hours per IT Amendment Rules 2022.</li>
          <li><strong>Recovery</strong> — RTO (Recovery Time Objective) of 4 hours; RPO (Recovery Point Objective) of 1 hour for clinical data.</li>
          <li><strong>Post-incident review</strong> — root cause analysis and remediation completed within 30 days.</li>
        </ul>

        <h3>8. AI & Clinical Decision Support Security</h3>
        <ul>
          <li>All AI-generated clinical suggestions are <strong>advisory only</strong> — no AI recommendation is auto-saved or enacted without explicit clinician approval.</li>
          <li>AI model inputs and outputs are logged and auditable.</li>
          <li>PHI is de-identified before any AI processing where technically feasible.</li>
          <li>AI Governance module enforces bias monitoring, model drift detection, and explainability requirements.</li>
          <li>Anthropic API key used for AI features is stored encrypted, never exposed in API responses, and redacted in all logs.</li>
        </ul>

        <h3>9. Third-Party & Supply Chain Security</h3>
        <ul>
          <li>All third-party vendors handling personal data sign a Data Processing Agreement (DPA) before onboarding.</li>
          <li>Vendor security assessments conducted annually; critical vendors reviewed quarterly.</li>
          <li>Open-source components reviewed against known CVE databases before inclusion.</li>
        </ul>

        <h3>10. Physical Security</h3>
        <p>SKCore products are deployed on customer-controlled infrastructure or approved cloud providers. Where SKCore operates shared infrastructure, physical access controls include biometric entry, CCTV, and visitor logs.</p>

        <h3>11. Compliance &amp; Certifications</h3>
        <p><strong>ISO Standards (aligned / in-progress certification):</strong></p>
        <ul>
          <li><strong>ISO/IEC 27001:2022</strong> — Information Security Management System</li>
          <li><strong>ISO/IEC 27701:2019</strong> — Privacy Information Management System (PIMS)</li>
          <li><strong>ISO 9001:2015</strong> — Quality Management System</li>
          <li><strong>ISO 13485:2016</strong> — Medical Device Quality Management (for SaMD-classified modules)</li>
          <li><strong>ISO 14001:2015</strong> — Environmental Management System</li>
          <li><strong>ISO/IEC 27799:2016</strong> — Health Informatics Information Security</li>
          <li><strong>IEC 62304:2006+AMD1</strong> — Medical Device Software Lifecycle Processes</li>
          <li><strong>ISO 80001-1:2021</strong> — Risk Management for IT Networks with Medical Devices</li>
        </ul>
        <p><strong>Regulatory &amp; Statutory Compliance:</strong></p>
        <ul>
          <li><strong>DPDP Act 2023</strong> — data fiduciary obligations, consent management, breach notification to Data Protection Board of India.</li>
          <li><strong>IT Act 2000 &amp; IT (Amendment) Rules 2022</strong> — reasonable security practices (RBAC, encryption, audit logs), 6-hour CERT-In breach reporting.</li>
          <li><strong>ABDM Security Guidelines</strong> — HIU/HIP data handling, ABHA consent-bound token exchange, PHR security.</li>
          <li><strong>CDSCO SaMD Guidelines</strong> — software risk classification, design validation, post-market surveillance for AI-assisted clinical decision support.</li>
          <li><strong>NABH Standards</strong> — information security requirements for hospital accreditation (MOM.5, HIC standards).</li>
          <li><strong>NABL ISO 15189</strong> — quality and competence requirements for medical laboratories; applicable to SKCore LIS.</li>
          <li><strong>NCG Guidelines</strong> — National Cancer Grid data security, protocol integrity, and multi-centre trial data governance; applicable to COMS.</li>
          <li><strong>NIST CSF 2.0</strong> — Identify, Protect, Detect, Respond, Recover functions used as the operational framework for our SOC.</li>
        </ul>

        <h3>12. Responsible Disclosure</h3>
        <p>We welcome security researchers to responsibly disclose vulnerabilities. If you discover a security issue in any SKCore product, please email <a href="mailto:security@skcorehealth.com">security@skcorehealth.com</a> with details. We commit to acknowledging your report within 24 hours and providing a remediation timeline within 72 hours. We do not pursue legal action against good-faith security research.</p>

        <h3>13. Contact</h3>
        <p>
          <strong>Chief Information Security Officer (CISO)</strong><br/>
          SKCore Health Technologies Pvt. Ltd.<br/>
          Bangalore, Karnataka, India<br/>
          Email: <a href="mailto:security@skcorehealth.com">security@skcorehealth.com</a><br/>
          PGP key available on request.
        </p>

      </div>
      <div class="pol-footer-bar">
        <span>© 2026 SKCore Health Technologies Pvt. Ltd. All rights reserved.</span>
        <a href="mailto:security@skcorehealth.com">security@skcorehealth.com</a>
      </div>
    </div>
  </div>`;

  document.body.insertAdjacentHTML('beforeend', html);
})();

/* ══════════════════════════════════════════════════════════════════════
   OPEN / CLOSE
═══════════════════════════════════════════════════════════════════════ */
function openPolicy(id) {
  document.getElementById(id).classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closePolicy(id) {
  document.getElementById(id).classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('DOMContentLoaded', function () {

  /* Close buttons */
  document.querySelectorAll('[data-pol-close]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      closePolicy(btn.dataset.polClose);
    });
  });

  /* Click backdrop */
  ['privacy-overlay', 'security-overlay'].forEach(function (id) {
    document.getElementById(id).addEventListener('click', function (e) {
      if (e.target === this) closePolicy(id);
    });
  });

  /* Escape key */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closePolicy('privacy-overlay');
      closePolicy('security-overlay');
    }
  });

  /* ── Smart link routing ─────────────────────────────────────────── */
  document.querySelectorAll('a').forEach(function (el) {
    var txt  = (el.textContent || '').trim().toLowerCase();
    var href = (el.getAttribute('href') || '').toLowerCase();

    var isPrivacy  = txt === 'privacy policy' || txt === 'privacy' ||
                     href.includes('mailto:privacy@') || href.includes('#privacy');
    var isSecurity = !isPrivacy && (
                     txt === 'security policy' || txt === 'security' ||
                     href.includes('mailto:security@') || href.includes('#security'));

    if (isPrivacy) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        openPolicy('privacy-overlay');
      });
    } else if (isSecurity) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        openPolicy('security-overlay');
      });
    }
  });

});
