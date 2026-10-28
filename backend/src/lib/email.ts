
import emailjs from "@emailjs/nodejs";

type AuthEmailParams = {
  to: string;
  userName: string;
  link: string;
};

const serviceId = process.env.EMAILJS_SERVICE_ID!;
const publicKey = process.env.EMAILJS_PUBLIC_KEY!;
const privateKey = process.env.EMAILJS_PRIVATE_KEY!;

async function sendAuthEmail(
  templateId: string,
  { to, userName, link }: AuthEmailParams,
) {
  const response = await emailjs.send(
    serviceId,
    templateId,
    {
      email: to,
      user_name: userName || "there",
      link,
    },
    {
      publicKey,
      privateKey,
    },
  );

  return response;
}

export async function sendVerificationEmail(
  params: AuthEmailParams,
) {
  
  return sendAuthEmail(
    process.env.EMAILJS_VERIFY_TEMPLATE_ID!,
    params,
  );
}

export async function sendPasswordResetEmail(
  params: AuthEmailParams,
) {
  return sendAuthEmail(
    process.env.EMAILJS_RESET_TEMPLATE_ID!,
    params,
  );
}
