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
 * ── IMPORTANT WHEN YOU CHANGE THIS SCRIPT ───────────────────────────────
 *  Saving is not enough. Use Deploy → Manage deployments → ✏️ Edit →
 *  Version: "New version" → Deploy. This keeps the SAME /exec URL.
 *  ("New deployment" creates a NEW URL, which must then be pasted into
 *  demo-modal.js and tracker.js.)
 *  First run: in the editor choose the function "setup" and click Run once
 *  to grant Sheets/Mail permissions.
 *
 * ── FOUR SHEETS CREATED AUTOMATICALLY ──────────────────────────────────
 *   "Demo Requests"   — Book a Demo form submissions  (POST)
 *   "Contact Leads"   — Get in Touch form submissions (POST)
 *   "Site Visitors"   — Page view log                 (GET ?type=visit)
 *   "Visitor Leads"   — Stay-in-touch prompt          (POST)
 *
 * Download as CSV: File → Download → Comma Separated Values (.csv)
 * ────────────────────────────────────────────────────────────────────────
 */

// Optional: paste the Google Sheet ID here if this script is NOT created from
// inside the sheet (Extensions → Apps Script). Leave '' for a bound script.
var SHEET_ID = '';

var SHEET_DEMO    = 'Demo Requests';
var SHEET_CONTACT = 'Contact Leads';
var SHEET_VISITS  = 'Site Visitors';
var SHEET_LEADS   = 'Visitor Leads';

var HEADERS_DEMO    = ['Timestamp','Name','Organisation','Phone','Email','Product','Message','Consent','Page'];
var HEADERS_CONTACT = ['Timestamp','Name','Organisation','Email','Phone','Subject','Message','Consent','Page'];
var HEADERS_VISITS  = ['Timestamp','Page Title','URL Path','Referrer','Screen','Language'];
var HEADERS_LEADS   = ['Timestamp','Name','Email','Phone','Organisation','Interest','Consent','Page','Referrer'];

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/** Stops spreadsheet formula injection and trims over-long input. */
function clean_(v, max) {
  var s = String(v == null ? '' : v).slice(0, max || 2000);
  return /^[=+\-@\t\r]/.test(s) ? "'" + s : s;
}

/** Handles POST from the website forms (demo & contact).
 *  The site sends JSON as text/plain to avoid a CORS pre-flight. */
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    if (!e || !e.postData || !e.postData.contents) return json_({ status: 'error', message: 'Empty request' });
    var data = JSON.parse(e.postData.contents);

    // Honeypot: real visitors never fill the hidden "website" field.
    if (data.website) return json_({ status: 'ok' });

    var type = String(data.type || '').toLowerCase();
    if (type !== 'demo' && type !== 'contact' && type !== 'lead') return json_({ status: 'error', message: 'Unknown form type' });
    if (!data.name || !data.email) return json_({ status: 'error', message: 'Missing required fields' });

    lock.waitLock(10000);
    var ts = Utilities.formatDate(new Date(), 'Asia/Kolkata', 'yyyy-MM-dd HH:mm:ss') + ' IST';
    var row, sheet;
    var headersUsed;
    if (type === 'lead') {
      sheet = getOrCreateSheet(SHEET_LEADS, HEADERS_LEADS, '#0d72ae');
      headersUsed = HEADERS_LEADS;
      row = [ts, clean_(data.name, 200), clean_(data.email, 200), clean_(data.phone, 50),
             clean_(data.organisation, 200), clean_(data.interest, 100), clean_(data.consent, 10),
             clean_(data.page, 200), clean_(data.referrer, 300)];
    } else if (type === 'contact') {
      headersUsed = HEADERS_CONTACT;
      sheet = getOrCreateSheet(SHEET_CONTACT, HEADERS_CONTACT, '#061a2d');
      row = [ts, clean_(data.name, 200), clean_(data.organisation, 200), clean_(data.email, 200),
             clean_(data.phone, 50), clean_(data.subject, 200), clean_(data.message), clean_(data.consent, 10), clean_(data.page, 200)];
    } else {
      headersUsed = HEADERS_DEMO;
      sheet = getOrCreateSheet(SHEET_DEMO, HEADERS_DEMO, '#0b2840');
      row = [ts, clean_(data.name, 200), clean_(data.organisation, 200), clean_(data.phone, 50),
             clean_(data.email, 200), clean_(data.product, 200), clean_(data.message), clean_(data.consent, 10), clean_(data.page, 200)];
    }
    var tabName = type === 'lead' ? SHEET_LEADS : (type === 'contact' ? SHEET_CONTACT : SHEET_DEMO);
    try {
      sheet.appendRow(row);
    } catch (writeErr) {
      // The main tab could not be written (e.g. protected range, table or
      // data-validation rules on an older tab). Never lose the lead: save it
      // to a fresh backup tab and note why.
      var backup = getOrCreateSheet(tabName + ' (backup)', headersUsed.concat(['Note']), '#8a1c1c');
      backup.appendRow(row.concat(['Main tab write failed: ' + writeErr.message]));
    }
    SpreadsheetApp.flush();

    return json_({ status: 'ok' });

  } catch (err) {
    return json_({ status: 'error', message: err.message });
  } finally {
    try { lock.releaseLock(); } catch (_) {}
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
  var leadCount    = Math.max(0, getOrCreateSheet(SHEET_LEADS,   HEADERS_LEADS,   '#0d72ae').getLastRow() - 1);
  return ContentService
    .createTextOutput(
      'SKCore collector is active.\n' +
      'Demo requests : ' + demoCount   + '\n' +
      'Contact leads : ' + contactCount + '\n' +
      'Visitor leads : ' + leadCount    + '\n' +
      'Page views    : ' + visitCount
    )
    .setMimeType(ContentService.MimeType.TEXT);
}

/** Returns sheet by name, creating it with styled headers if missing */
function getOrCreateSheet(name, headers, headerBg) {
  var ss    = SHEET_ID ? SpreadsheetApp.openById(SHEET_ID) : SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error('No spreadsheet: set SHEET_ID or create the script from inside the sheet');
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
  } else if (sheet.getLastColumn() < headers.length) {
    // Older sheet: add any new header columns (e.g. Consent, Page).
    // Best effort only — never block a submission because of formatting.
    try {
      if (sheet.getMaxColumns() < headers.length) {
        sheet.insertColumnsAfter(sheet.getMaxColumns(), headers.length - sheet.getMaxColumns());
      }
      sheet.getRange(1, 1, 1, headers.length).setValues([headers])
           .setFontWeight('bold').setBackground(headerBg).setFontColor('#ffffff');
    } catch (hdrErr) { /* ignore */ }
  }

  return sheet;
}

/** Run once from the Apps Script editor to authorise and create the tabs. */
function setup() {
  getOrCreateSheet(SHEET_DEMO, HEADERS_DEMO, '#0b2840');
  getOrCreateSheet(SHEET_CONTACT, HEADERS_CONTACT, '#061a2d');
  getOrCreateSheet(SHEET_VISITS, HEADERS_VISITS, '#0d3a1a');
  getOrCreateSheet(SHEET_LEADS, HEADERS_LEADS, '#0d72ae');
  Logger.log('SKCore collector ready.');
}
