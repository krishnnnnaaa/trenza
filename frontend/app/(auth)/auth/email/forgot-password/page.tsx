// app/(auth)/auth/email/forget-password/page.tsx
import { AuthShell } from "@/components/auth/Authshell";
import { ForgotPasswordForm } from "@/components/auth/Forgotpasswordform";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Forgot password | Trenza",
  robots: { index: false },
};

export default function ForgotPasswordPage() {
  return (
    <AuthShell>
      <ForgotPasswordForm />
    </AuthShell>
  );
}