import QRCode from "qrcode";

/**
 * Encodes a check-in token into a QR code.
 * Returns both a data URL (to embed inline / show on screen) and a PNG
 * buffer (to attach to the confirmation email).
 */
export async function generateCheckInQr(token: string) {
  const payload = JSON.stringify({ t: token });

  const [dataUrl, buffer] = await Promise.all([
    QRCode.toDataURL(payload, {
      margin: 1,
      width: 480,
      color: {
        dark: "#0a0908",
        light: "#f2ecdd",
      },
    }),
    QRCode.toBuffer(payload, {
      margin: 1,
      width: 480,
      color: {
        dark: "#0a0908",
        light: "#f2ecdd",
      },
    }),
  ]);

  return { dataUrl, buffer };
}
