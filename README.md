# SKCore Health Technologies — Website

**skcorehealth.com** · AI-enabled healthcare products, IT enablement, and consulting services.

## Site Structure

```
skcore-health-site/
├── index.html              ← Main landing page
├── about.html              ← About SKCore
├── services.html           ← IT Enablement & Consulting
├── styles.css              ← Global stylesheet
├── script.js               ← Interactions & animations
├── favicon.svg             ← Logo
├── CNAME                   ← skcorehealth.com (Cloudflare domain)
├── .nojekyll               ← Bypass Jekyll on GitHub Pages
└── products/
    ├── coms.html           ← SKCore COMS (Oncology)
    ├── phr.html            ← SKCore PHR (Personal Health Record)
    ├── mha.html            ← SKCore MHA (Mental Health)
    ├── lis.html            ← SKCore LIS (Laboratory)
    ├── ris.html            ← SKCore RIS (Radiology)
    ├── cybersecure.html    ← SKCore CyberSecure
    ├── connect.html        ← SKCore Connect (Interoperability)
    ├── ai-governance.html  ← SKCore AI Governance
    └── compliances.html    ← SKCore Compliances
```

---

## Deploy to GitHub Pages

### 1. Create GitHub repository

```bash
git init
git add .
git commit -m "Initial website"
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

### 3. Add CNAME record in Cloudflare DNS

| Type | Name | Content | Proxy |
|------|------|---------|-------|
| CNAME | `www` | `YOUR_ORG.github.io` | ✅ Proxied |
| CNAME | `@` | `YOUR_ORG.github.io` | ✅ Proxied |

### 4. Configure GitHub Pages custom domain

- Go to **Settings → Pages → Custom domain**
- Enter: `skcorehealth.com`
- Tick **Enforce HTTPS**

### 5. Cloudflare SSL/TLS settings

- SSL/TLS mode: **Full**
- Always Use HTTPS: **On**
- Automatic HTTPS Rewrites: **On**

The `CNAME` file in the repo root (`skcorehealth.com`) tells GitHub Pages which custom domain to use — do not delete it.

---

## Local preview

Open `index.html` directly in any browser — no build step required. All assets are relative paths, so the site works from the filesystem and from any web server.

```bash
# Optional: quick local server
npx serve .
# or
python -m http.server 8080
```

---

## Technology

- Pure HTML5 / CSS3 / Vanilla JS — no framework, no build step
- Google Fonts: DM Sans + Manrope
- IntersectionObserver for scroll animations
- Fully responsive (mobile, tablet, desktop)
- GitHub Pages + Cloudflare compatible

---

© 2024–2026 SKCore Health Technologies Pvt. Ltd. — CONFIDENTIAL & PROPRIETARY
