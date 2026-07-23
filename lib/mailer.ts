import nodemailer from "nodemailer";

function getTransport() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    throw new Error("Missing GMAIL_USER or GMAIL_APP_PASSWORD env vars.");
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
}

export async function sendInviteEmail(opts: {
  to: string;
  aka: string;
  qrBuffer: Buffer;
}) {
  const transport = getTransport();
  const from = process.env.GMAIL_USER;

  const html = `
  <div style="background:#0a0908;padding:40px 24px;font-family:Georgia,serif;color:#f2ecdd;">
    <div style="max-width:480px;margin:0 auto;text-align:center;border:1px solid rgba(201,162,39,0.4);padding:32px 24px;">
      <p style="color:#c9a227;letter-spacing:3px;font-size:12px;margin:0 0 6px;">JULY 31ST &nbsp;|&nbsp; 10PM &nbsp;|&nbsp; LA</p>
      <h1 style="font-size:34px;margin:12px 0 0;color:#f2ecdd;">LET'S GET BUSY</h1>
      <p style="color:#c9a227;font-size:18px;margin:2px 0 20px;">w dabi-balls</p>
      <p style="margin:0 0 20px;">You're on the list, ${escapeHtml(opts.aka)}. Show this code at the door.</p>
      <img src="cid:checkinqr" width="220" height="220" alt="Your check-in QR code" style="display:block;margin:0 auto 20px;border:6px solid #c9a227;" />
      <p style="font-size:12px;letter-spacing:2px;color:#8a7231;margin:0;">DRESS: BB &nbsp;·&nbsp; STRICTLY BY INVITE</p>
    </div>
  </div>`;

  await transport.sendMail({
    from: `LET'S GET BUSY <${from}>`,
    to: opts.to,
    subject: "You're in — LET'S GET BUSY, July 31st",
    html,
    attachments: [
      {
        filename: "checkin-qr.png",
        content: opts.qrBuffer,
        cid: "checkinqr",
      },
    ],
  });
}

function escapeHtml(input: string) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
