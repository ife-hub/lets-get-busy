import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { appendRsvpRow } from "@/lib/sheets";
import { generateCheckInQr } from "@/lib/qr";
import { sendInviteEmail } from "@/lib/mailer";
import type { RsvpPayload, RsvpResponse } from "@/lib/types";

const REQUIRED_FIELDS: (keyof RsvpPayload)[] = [
  "email",
  "phone",
  "aka",
  "gender",
  "residency",
  "interestedEvent",
  "interestedCommunity",
  "drinks",
  "sexuality",
];

export async function POST(req: NextRequest) {
  let body: Partial<RsvpPayload>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json<RsvpResponse>(
      { ok: false, interested: false, error: "Invalid request body." },
      { status: 400 }
    );
  }

  for (const field of REQUIRED_FIELDS) {
    if (!body[field]) {
      return NextResponse.json<RsvpResponse>(
        { ok: false, interested: false, error: `Missing field: ${field}` },
        { status: 400 }
      );
    }
  }

  const payload = body as RsvpPayload;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(payload.email)) {
    return NextResponse.json<RsvpResponse>(
      { ok: false, interested: false, error: "That email doesn't look right." },
      { status: 400 }
    );
  }

  const interested = payload.interestedEvent === "Yes";
  const checkInToken = uuidv4();

  // 1. Log to Google Sheets — this should not block the confirmation on email failure.
  try {
    await appendRsvpRow({
      ...payload,
      submittedAt: new Date().toISOString(),
      checkInToken,
      checkedIn: false,
    });
  } catch (err) {
    console.error("Google Sheets append failed:", err);
    return NextResponse.json<RsvpResponse>(
      {
        ok: false,
        interested,
        error: "Could not save your response right now. Please try again shortly.",
      },
      { status: 502 }
    );
  }

  // 2. Only generate + email a QR if they're actually interested in attending.
  if (!interested) {
    return NextResponse.json<RsvpResponse>({ ok: true, interested: false });
  }

  try {
    const { dataUrl, buffer } = await generateCheckInQr(checkInToken);
    await sendInviteEmail({ to: payload.email, aka: payload.aka, qrBuffer: buffer });
    return NextResponse.json<RsvpResponse>({ ok: true, interested: true, qrDataUrl: dataUrl });
  } catch (err) {
    console.error("QR/email step failed:", err);
    // Row is already saved — surface a partial success so the UI can say so.
    return NextResponse.json<RsvpResponse>(
      {
        ok: true,
        interested: true,
        error: "You're on the list, but the invite email couldn't be sent — we'll follow up.",
      },
      { status: 200 }
    );
  }
}
