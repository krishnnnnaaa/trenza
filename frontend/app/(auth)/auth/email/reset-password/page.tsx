// app/(auth)/auth/email/reset-password/page.tsx
import { AuthShell } from "@/components/auth/Authshell";
import { ResetPasswordForm } from "@/components/auth/Resetpasswordform";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Reset password | Trenza",
  robots: { index: false },
  referrer: "no-referrer", // don't leak the reset token via the Referer header
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string | string[]; error?: string | string[] }>;
}) {
  const { token, error } = await searchParams;

  return (
    <AuthShell>
      <ResetPasswordForm
        token={typeof token === "string" ? token : undefined}
        error={typeof error === "string" ? error : undefined}
      />
    </AuthShell>
  );
}