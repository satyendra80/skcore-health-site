# SKCore Health Technologies — Website

**skcorehealth.com** · AI-enabled healthcare products, IT enablement, and consulting services.

---

## Site Structure

```
skcore-health-site/
├── index.html                      ← Main landing page
├── about.html                      ← About SKCore
├── services.html                   ← IT Enablement & Consulting
├── styles.css                      ← Global stylesheet (brand tokens, all components)
├── script.js                       ← Scroll animations, nav, counter animations
├── demo-modal.js                   ← Demo Request + Contact + Consulting modals
├── policies.js                     ← Privacy Policy + Security Policy modals
├── demo-leads-apps-script.js       ← Google Apps Script for lead CSV collection
├── OrgLogo.png                     ← Organisation logo (1024×1024px)
├── favicon.svg                     ← Browser favicon
├── CNAME                           ← skcorehealth.com (Cloudflare custom domain)
├── .nojekyll                       ← Bypass Jekyll on GitHub Pages
└── products/
    ├── coms.html                   ← SKCore COMS (Oncology Management)
    ├── phr.html                    ← SKCore PHR (Personal Health Record)
    ├── mha.html                    ← SKCore MHA (Mental Health)
    ├── lis.html                    ← SKCore LIS (Laboratory)
    ├── ris.html                    ← SKCore RIS (Radiology)
    ├── cybersecure.html            ← SKCore CyberSecure
    ├── connect.html                ← SKCore Connect (Interoperability)
    ├── ai-governance.html          ← SKCore AI Governance
    └── compliances.html            ← SKCore Compliances
```

---

## Interactive Forms

Three modal forms are active sitewide via `demo-modal.js`:

| Trigger | Form | Fields |
|---------|------|--------|
| "Book Demo" / "Book a Demo" buttons | **Demo Request** | Name, Organisation, Phone, Email, Product interest, Message |
| "Contact" / "Get in Touch" links | **Contact Inquiry** | Name, Organisation, Email, Phone, Subject, Message |
| "Start a Consulting Engagement" / "Start an Engagement" links | **Contact Inquiry** (Consulting subject) | Same as Contact |

All form submissions are:
1. Saved to **browser localStorage** immediately as a backup
2. Posted to **Google Apps Script** (when configured) → written to Google Sheets → downloadable as CSV

### Setting up lead collection (Google Sheets)

1. Go to [sheets.google.com](https://sheets.google.com) → create a blank spreadsheet
2. Click **Extensions → Apps Script**
3. Paste the contents of `demo-leads-apps-script.js`, replacing the default code
4. Click **Deploy → New Deployment**
   - Type: **Web App**
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Click **Deploy** → copy the **Web App URL**
6. Open `demo-modal.js` → paste the URL as the value of `FORMS_ENDPOINT` on **line 8**
7. Commit and push

Two tabs are created automatically in the spreadsheet:
- **Demo Requests** — Book a Demo submissions
- **Contact Leads** — Contact / Consulting submissions

Download either as CSV: **File → Download → Comma Separated Values (.csv)**

---

## Policy Modals

`policies.js` injects two scrollable modal documents active on all 12 pages:

| Link text / href | Modal |
|-----------------|-------|
| "Privacy Policy" · `mailto:privacy@skcorehealth.com` | **Privacy Policy** — DPDP Act 2023, ISO 27701, data rights, ABHA consent |
| "Security" · `mailto:security@skcorehealth.com` | **Security Policy** — ISO 27001/27701/9001/13485/14001/27799, IEC 62304, NIST CSF |

Both modals close via the ✕ button, backdrop click, or Escape key.

---

## Deploy to GitHub Pages

### 1. Create GitHub repository

```bash
git init
git add .
git commit -m "Initial website — SKCore Health Technologies"
git remote add origin https://github.com/YOUR_ORG/skcore-health-site.git
git push -u origin main
```

### 2. Enable GitHub Pages

- Go to **Settings → Pages**
- Source: **Deploy from a branch**
- Branch: `main` · Folder: `/ (root)`
- Click **Save**

GitHub will publish at: `https://YOUR_ORG.github.io/skcore-health-site/`

---

## Connect Cloudflare Domain (skcorehealth.com)

### 3. Add DNS records in Cloudflare

| Type | Name | Content | Proxy |
|------|------|---------|-------|
| CNAME | `www` | `YOUR_ORG.github.io` | ✅ Proxied |
| CNAME | `@` | `YOUR_ORG.github.io` | ✅ Proxied |

### 4. Configure custom domain in GitHub Pages

- **Settings → Pages → Custom domain** → enter `skcorehealth.com` → Save
- Tick **Enforce HTTPS**

### 5. Cloudflare SSL/TLS settings

- SSL/TLS mode: **Full**
- Always Use HTTPS: **On**
- Automatic HTTPS Rewrites: **On**

> The `CNAME` file in the repo root tells GitHub Pages which custom domain to serve — do not delete it.

---

## Local Preview

Open `index.html` directly in any browser — no build step required. All paths are relative.

```bash
# Optional: quick local server
npx serve .
# or
python -m http.server 8080
```

Then open: `http://localhost:8080`

---

## Technology

| Concern | Approach |
|---------|----------|
| HTML/CSS/JS | Pure vanilla — no framework, no build step |
| Fonts | Google Fonts: DM Sans + Manrope |
| Animations | IntersectionObserver (scroll fade-up, counter animation) |
| Forms | Self-contained modal JS — localStorage + Google Apps Script |
| Policy docs | Inline modal JS — no external CMS dependency |
| Responsive | Mobile-first CSS, tested across 320px–1440px |
| Deployment | GitHub Pages + Cloudflare (static, no server required) |
| Compliance | ABDM Compliant · DPDP 2023 · ISO 27001/27701/9001/13485/14001 |

---

## Compliance Posture

The website and products are aligned with:

- **DPDP Act 2023** — consent, data rights, breach notification
- **ISO/IEC 27001:2022** — Information Security Management System
- **ISO/IEC 27701:2019** — Privacy Information Management System
- **ISO 9001:2015** — Quality Management System
- **ISO 13485:2016** — Medical Device QMS (SaMD)
- **ISO 14001:2015** — Environmental Management System
- **ISO/IEC 27799:2016** — Health Informatics Security
- **IEC 62304** — Medical Device Software Lifecycle
- **ABDM** — HIU/HIP compliant, ABHA integration
- **NABH / NABL / NCG / CDSCO SaMD** — sector-specific requirements

---

## Key Contacts

| Purpose | Email |
|---------|-------|
| Demo requests | demo@skcorehealth.com |
| General inquiries | info@skcorehealth.com |
| Consulting | consulting@skcorehealth.com |
| Privacy / DPO | privacy@skcorehealth.com |
| Security / CISO | security@skcorehealth.com |

---

© 2024–2026 SKCore Health Technologies Pvt. Ltd. — CONFIDENTIAL & PROPRIETARY
