// app/(auth)/auth/email/verify-email/page.tsx
import { AuthShell } from "@/components/auth/Authshell";
import { VerifyEmailStatus } from "@/components/auth/Verifyemailstatus";
import type { Metadata } from "next";
 
 
export const metadata: Metadata = {
  title: "Verify email | Trenza",
  robots: { index: false },
};
 
export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string | string[] }>;
}) {
  const { error } = await searchParams;
 
  return (
    <AuthShell>
      <VerifyEmailStatus errorCode={typeof error === "string" ? error : undefined} />
    </AuthShell>
  );
}