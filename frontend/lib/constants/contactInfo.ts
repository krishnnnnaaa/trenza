// Single place for business contact details.
// TODO: values below are PLACEHOLDERS taken from the design mockup. Replace with real details.
// Set a field to null to hide that row/section automatically.

export interface ContactInfoConfig {
  email: { value: string; note?: string } | null;
  phone: { value: string; note?: string } | null;
  address: { lines: string[] } | null;
  liveChat: { description: string; note?: string } | null; // keep null until live chat actually exists
  mapsUrl: string | null; // verified Google Maps link; shows the "Visit us" card when set
}

export const CONTACT_INFO: ContactInfoConfig = {
  email: {
    value: "support.trenza@gmail.com",
    note: "We usually respond within 24-48 hours.",
  },
  phone: {
    value: "+91 98765 43210",
    note: "Mon - Sat, 10:00 AM - 6:00 PM (IST)",
  },
  address: {
    lines: ["Prem Nagar", "Dehradun", "Uttarakhand 248007", "India"],
  },
  liveChat: null,
  mapsUrl: null,
};