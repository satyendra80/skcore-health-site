/**
 * SKCore Health Technologies — Lead & Contact Collector
 * Google Apps Script — deploy as a Web App.
 * Handles both Demo Requests and Contact Inquiries in separate sheets.
 *
 * ── SETUP INSTRUCTIONS ──────────────────────────────────────────────────
 * 1. Go to https://sheets.google.com → create a new sheet
 * 2. Click Extensions → Apps Script
 * 3. Paste this entire file, replacing the default code
 * 4. Click Deploy → New Deployment
 *      Type: Web App
 *      Execute as: Me
 *      Who has access: Anyone
 * 5. Click Deploy → copy the Web App URL
 * 6. Open D:\skcore-health-site\demo-modal.js
 *    Paste the URL as the value of FORMS_ENDPOINT on line 8
 * 7. Commit and push — submissions now go to Google Sheets.
 *
 * ── VIEWING / DOWNLOADING DATA ──────────────────────────────────────────
 * Two tabs are created automatically:
 *   "Demo Requests"   — Book a Demo form submissions
 *   "Contact Leads"   — Get in Touch form submissions
 *
 * Download either as CSV: File → Download → Comma Separated Values (.csv)
 * ────────────────────────────────────────────────────────────────────────
 */

var SHEET_DEMO    = 'Demo Requests';
var SHEET_CONTACT = 'Contact Leads';

var HEADERS_DEMO = ['Timestamp','Name','Organisation','Phone','Email','Product','Message'];
var HEADERS_CONTACT = ['Timestamp','Name','Organisation','Email','Phone','Subject','Message'];

/** Handles POST from the website forms */
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

/** Status page for GET requests */
function doGet() {
  var demoCount    = Math.max(0, getOrCreateSheet(SHEET_DEMO, HEADERS_DEMO, '#0b2840').getLastRow() - 1);
  var contactCount = Math.max(0, getOrCreateSheet(SHEET_CONTACT, HEADERS_CONTACT, '#061a2d').getLastRow() - 1);
  return ContentService
    .createTextOutput(
      'SKCore Forms collector is active.\n' +
      'Demo requests: ' + demoCount + '\n' +
      'Contact leads: ' + contactCount
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
