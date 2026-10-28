import { apiFetch } from "./client";

export interface ContactMessagePayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

/**
 * Submission logic lives here only.
 * ASSUMPTION: backend exposes POST api/contact accepting this payload. That route does NOT exist yet,
 * so until it's built this call fails and the form shows an error (it never pretends the message was sent).
 * Throws on failure; the form handles the error UI.
 */
export async function sendContactMessage(payload: ContactMessagePayload) {
  return apiFetch<{ message: string }>("Send Contact Message", "api/contact", {
    credentials: "include",
    method: "POST",
    body: JSON.stringify(payload),
  });
}