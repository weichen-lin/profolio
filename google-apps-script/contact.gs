/**
 * Contact form -> Google Sheet (+ optional email notification).
 *
 * SETUP
 * 1. Create a Google Sheet. First row headers: Timestamp | Email | Message
 * 2. Extensions -> Apps Script. Paste this file in.
 * 3. (Optional) set NOTIFY_EMAIL below to get an email per submission.
 * 4. Deploy -> New deployment -> type "Web app".
 *      - Execute as: Me
 *      - Who has access: Anyone
 *    Copy the /exec URL.
 * 5. Put that URL in the site's .env as PUBLIC_CONTACT_ENDPOINT.
 *
 * NOTE on CORS: the front-end POSTs a JSON *string* with no custom
 * Content-Type (defaults to text/plain), which keeps it a "simple" request
 * and avoids the preflight that Apps Script web apps cannot answer.
 */

const SHEET_NAME = "Contacts";
const NOTIFY_EMAIL = ""; // e.g. "you@ikigai.team" — leave "" to skip email.

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const email = String(data.email || "").trim();
    const message = String(data.message || "").trim();

    if (!email || !message) {
      return json_({ result: "error", reason: "missing fields" });
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    sheet.appendRow([new Date(), email, message]);

    if (NOTIFY_EMAIL) {
      MailApp.sendEmail({
        to: NOTIFY_EMAIL,
        subject: "New contact form message",
        replyTo: email,
        body: "From: " + email + "\n\n" + message,
      });
    }

    return json_({ result: "success" });
  } catch (err) {
    return json_({ result: "error", reason: String(err) });
  }
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
