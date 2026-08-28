/**
 * SKCore Health Technologies — Site Visitor Tracker
 * Sends anonymous page-view data to Google Sheets via Apps Script.
 *
 * ── SETUP ───────────────────────────────────────────────────────────────
 * 1. Deploy the updated demo-leads-apps-script.js (same Web App URL)
 * 2. Paste your Apps Script Web App URL below as TRACKER_ENDPOINT
 * ────────────────────────────────────────────────────────────────────────
 */
(function () {
  var TRACKER_ENDPOINT = 'https://script.google.com/macros/s/AKfycbxPfV_QZW-HqkLugKqLFAY09XXIs6NIaan8JP0HMyrknyzRIerHh6LTA8OAxlpXc6hC/exec';

  if (!TRACKER_ENDPOINT) return;

  try {
    var params = new URLSearchParams({
      type   : 'visit',
      t      : new Date().toISOString(),
      title  : document.title || '',
      url    : location.pathname || '/',
      ref    : document.referrer || '',
      screen : (screen.width || '') + 'x' + (screen.height || ''),
      lang   : navigator.language || ''
    }).toString();

    // fetch with no-cors — fire and forget, no response needed
    fetch(TRACKER_ENDPOINT + '?' + params, {
      method   : 'GET',
      mode     : 'no-cors',
      keepalive: true
    }).catch(function () {});

  } catch (e) {}
})();
