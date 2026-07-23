import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import type { RsvpPayload } from "./types";

function getClient() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GOOGLE_PRIVATE_KEY;
  const sheetId = process.env.GOOGLE_SHEET_ID;

  if (!email || !key || !sheetId) {
    throw new Error(
      "Missing Google Sheets env vars. Check GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_SHEET_ID."
    );
  }

  const jwt = new JWT({
    email,
    // .env files can't hold real newlines, so the key is stored with literal \n
    key: key.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return new GoogleSpreadsheet(sheetId, jwt);
}

/**
 * Appends one RSVP as a new row on the first tab of the sheet.
 * The header row (see README) must already exist and match these keys.
 */
export async function appendRsvpRow(
  payload: RsvpPayload & { submittedAt: string; checkInToken: string; checkedIn: boolean }
) {
  const doc = getClient();
  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[0];

  await sheet.addRow({
    "Submitted At": payload.submittedAt,
    Email: payload.email,
    Phone: payload.phone,
    "Generally Known As": payload.aka,
    Gender: payload.gender,
    Residency: payload.residency,
    "Interested In Event": payload.interestedEvent,
    "Interested In Community/Rave": payload.interestedCommunity,
    Drinks: payload.drinks,
    Sexuality: payload.sexuality,
    "Check-in Token": payload.checkInToken,
    "Checked In": payload.checkedIn ? "TRUE" : "FALSE",
  });
}
