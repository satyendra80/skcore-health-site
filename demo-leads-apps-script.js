/**
 * SKCore Health Technologies — Lead, Contact & Visitor Tracker
 * Google Apps Script — deploy as a Web App.
 * Handles Demo Requests, Contact Inquiries, and Site Visitor logs.
 *
 * ── SETUP INSTRUCTIONS ──────────────────────────────────────────────────
 * 1. Go to https://sheets.google.com → create a new sheet
 * 2. Click Extensions → Apps Script
 * 3. Paste this entire file, replacing the default code
 * 4. Click Deploy → New Deployment (or "Manage Deployments" to update)
 *      Type: Web App
 *      Execute as: Me
 *      Who has access: Anyone
 * 5. Click Deploy → copy the Web App URL
 * 6. Paste the URL in TWO places:
 *    a) demo-modal.js  → FORMS_ENDPOINT (line 8)   — for form submissions
 *    b) tracker.js     → TRACKER_ENDPOINT (line 13) — for visitor tracking
 * 7. Commit and push — data now flows to Google Sheets automatically.
 *
 * ── THREE SHEETS CREATED AUTOMATICALLY ─────────────────────────────────
 *   "Demo Requests"   — Book a Demo form submissions  (POST)
 *   "Contact Leads"   — Get in Touch form submissions (POST)
 *   "Site Visitors"   — Page view log                 (GET ?type=visit)
 *
 * Download as CSV: File → Download → Comma Separated Values (.csv)
 * ────────────────────────────────────────────────────────────────────────
 */

var SHEET_DEMO    = 'Demo Requests';
var SHEET_CONTACT = 'Contact Leads';
var SHEET_VISITS  = 'Site Visitors';

var HEADERS_DEMO    = ['Timestamp','Name','Organisation','Phone','Email','Product','Message'];
var HEADERS_CONTACT = ['Timestamp','Name','Organisation','Email','Phone','Subject','Message'];
var HEADERS_VISITS  = ['Timestamp','Page Title','URL Path','Referrer','Screen','Language'];

/** Handles POST from the website forms (demo & contact) */
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var type = (data.type || 'demo').toLowerCase();

    if (type === 'contact') {
      var sheet = getOrCreateSheet(SHEET_CONTACT, HEADERS_CONTACT, '#061a2d');
      sheet.appendRow([
        data.timestamp    || new Date().toISOString(),
        data.name         || '',
        data.organisation || '',
        data.email        || '',
        data.phone        || '',
        data.subject      || '',
        data.message      || ''
      ]);
    } else {
      var sheet = getOrCreateSheet(SHEET_DEMO, HEADERS_DEMO, '#0b2840');
      sheet.appendRow([
        data.timestamp    || new Date().toISOString(),
        data.name         || '',
        data.organisation || '',
        data.phone        || '',
        data.email        || '',
        data.product      || '',
        data.message      || ''
      ]);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/** Handles GET — visitor tracking (?type=visit) or status page */
function doGet(e) {
  var params = e && e.parameter ? e.parameter : {};

  if (params.type === 'visit') {
    try {
      var sheet = getOrCreateSheet(SHEET_VISITS, HEADERS_VISITS, '#0d3a1a');
      sheet.appendRow([
        params.t      || new Date().toISOString(),
        params.title  || '',
        params.url    || '/',
        params.ref    || '',
        params.screen || '',
        params.lang   || ''
      ]);
    } catch (err) { /* silently fail — never block page load */ }

    // Return a tiny transparent GIF so no-cors fetch gets a valid response
    return ContentService
      .createTextOutput('ok')
      .setMimeType(ContentService.MimeType.TEXT);
  }

  // Default: status page
  var demoCount    = Math.max(0, getOrCreateSheet(SHEET_DEMO,    HEADERS_DEMO,    '#0b2840').getLastRow() - 1);
  var contactCount = Math.max(0, getOrCreateSheet(SHEET_CONTACT, HEADERS_CONTACT, '#061a2d').getLastRow() - 1);
  var visitCount   = Math.max(0, getOrCreateSheet(SHEET_VISITS,  HEADERS_VISITS,  '#0d3a1a').getLastRow() - 1);
  return ContentService
    .createTextOutput(
      'SKCore collector is active.\n' +
      'Demo requests : ' + demoCount   + '\n' +
      'Contact leads : ' + contactCount + '\n' +
      'Page views    : ' + visitCount
    )
    .setMimeType(ContentService.MimeType.TEXT);
}

/** Returns sheet by name, creating it with styled headers if missing */
function getOrCreateSheet(name, headers, headerBg) {
  var ss    = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(name);

  if (!sheet) {
    sheet = ss.insertSheet(name);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight('bold')
               .setBackground(headerBg)
               .setFontColor('#ffffff');
    sheet.setFrozenRows(1);
    sheet.autoResizeColumns(1, headers.length);
  }

  return sheet;
}
