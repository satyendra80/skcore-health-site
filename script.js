/* ─── SKCore Health Technologies · Global Script ─────────────────────────── */

// ── Nav scroll shadow
const header = document.querySelector('.site-header');
if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

// ── Mobile menu toggle
const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');
if (menuToggle && siteNav) {
  menuToggle.addEventListener('click', () => {
    const open = siteNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', open);
  });
  document.addEventListener('click', (e) => {
    if (!header.contains(e.target)) siteNav.classList.remove('open');
  });
}

// ── Current year in footer
document.querySelectorAll('.js-year').forEach(el => el.textContent = new Date().getFullYear());

// ── Scroll fade-in (IntersectionObserver)
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.fade-up').forEach(el => io.observe(el));

// ── Counter animation
function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';
  const duration = 1600;
  const start = performance.now();
  const isDecimal = target % 1 !== 0;
  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const value = isDecimal ? (target * ease).toFixed(1) : Math.round(target * ease);
    el.textContent = prefix + value + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCounter(e.target);
      counterObs.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-target]').forEach(el => counterObs.observe(el));

// ── Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.site-nav a[href^="#"]');
if (sections.length && navLinks.length) {
  const sectionObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px' });
  sections.forEach(s => sectionObs.observe(s));
}

// ── AI node hover effect (hero)
document.querySelectorAll('.ai-node').forEach(node => {
  node.addEventListener('mouseenter', () => {
    document.querySelector('.ai-core b') && (document.querySelector('.ai-core b').textContent = node.dataset.label || 'AI');
  });
  node.addEventListener('mouseleave', () => {
    document.querySelector('.ai-core b') && (document.querySelector('.ai-core b').textContent = 'SKCore');
  });
});
