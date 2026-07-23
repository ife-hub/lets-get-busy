# LET'S GET BUSY — RSVP

A themed Next.js RSVP form for the July 31st event. Submissions are logged to a
Google Sheet, and anyone who says they're interested in attending gets an
emailed invite with a unique check-in QR code.

## 1. Install

```bash
npm install
cp .env.example .env.local
```

You'll fill in `.env.local` in the two steps below. Never commit it.

## 2. Set up Google Sheets (service account — no login flow needed)

A "service account" is a robot Google identity your server uses to write to
the sheet directly, without any user having to click through an OAuth screen.

1. Go to <https://console.cloud.google.com/> and create a project (or reuse one).
2. In the left sidebar: **APIs & Services → Library** → search **Google Sheets API** → **Enable**.
3. **APIs & Services → Credentials → Create Credentials → Service account**.
   Give it any name (e.g. `rsvp-bot`) and click through the remaining steps
   (no extra roles needed).
4. Open the service account you just created → **Keys** tab → **Add Key →
   Create new key → JSON**. This downloads a `.json` file — keep it private,
   don't commit it anywhere.
5. From that JSON file, copy:
   - `client_email` → paste into `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `private_key` → paste into `GOOGLE_PRIVATE_KEY` (keep the quotes and the
     `\n` sequences exactly as they appear in the JSON file — don't convert
     them to real line breaks)
6. Create a new Google Sheet. In row 1, add these exact headers, in this order:

   ```
   Submitted At | Email | Phone | Generally Known As | Gender | Residency | Interested In Event | Interested In Community/Rave | Drinks | Sexuality | Check-in Token | Checked In
   ```

7. Click **Share** on the sheet and share it with the `client_email` address
   from step 5 (Editor access). This is the step people usually forget — the
   robot account needs to be invited just like a person would.
8. Copy the Sheet ID from its URL:
   `https://docs.google.com/spreadsheets/d/`**`THIS_PART`**`/edit` → paste into
   `GOOGLE_SHEET_ID`.

## 3. Set up Gmail sending (App Password)

Gmail won't accept your normal password from a script — you need an "app
password," a one-time code tied only to this app.

1. Turn on 2-Step Verification on the sending Gmail account if it isn't on
   already: <https://myaccount.google.com/security>.
2. Go to <https://myaccount.google.com/apppasswords>.
3. Create a new app password (name it anything, e.g. "RSVP site"). Google
   shows you a 16-character code — copy it with no spaces.
4. Put the sending address in `GMAIL_USER` and the 16-character code in
   `GMAIL_APP_PASSWORD`.

## 4. Run it

```bash
npm run dev
```

Visit `http://localhost:3000`. Fill the form as a test guest and check that:
- a new row appears in the Sheet
- if you answered "Yes" to interested in the event, an email with a QR image
  arrives at the address you entered

## 5. Before you go live

- Swap the placeholder bank details on the confirmation screen
  (`app/page.tsx` → `Confirmation` component → `PlaceholderLine` rows) for
  your real ones.
- Deploy anywhere that supports Next.js (Vercel is the path of least
  resistance) and set the same four env vars in that platform's dashboard.

## About check-in scanning (not built yet)

Each interested guest's row gets a `Check-in Token` (a random ID) and a
`Checked In` column, currently always `FALSE`. When you're ready for door
scanning, that's a separate small page: a camera-based QR reader (e.g. the
`html5-qrcode` library) that reads the token back out of the code, looks up
the matching row, and flips `Checked In` to `TRUE` — flagging it if that
token's already been used. Happy to build that when you're ready.
