export type RsvpPayload = {
  email: string;
  phone: string;
  aka: string;
  gender: string;
  residency: "On campus" | "Off campus";
  interestedEvent: "Yes" | "No";
  interestedCommunity: "Yes" | "No";
  drinks: "Hard" | "Soft" | "Both" | "None";
  sexuality: string;
};

export type RsvpResponse = {
  ok: boolean;
  interested: boolean;
  qrDataUrl?: string;
  error?: string;
};
