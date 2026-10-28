"use client";

import { CheckCircle2, Loader2, Mail, XCircle } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { AuthLinkButton, AuthStatusCard } from "./Authstatuscard";

interface VerifyEmailStatusProps {
  /** `?error=` that Better Auth appends to the callback URL when verification fails. */
  errorCode?: string;
}

/**
 * Success is NOT inferred from the route being opened.
 * - ?error present            -> failure
 * - session says emailVerified -> success (server-side truth; needs autoSignInAfterVerification on the backend)
 * - otherwise                  -> neutral "couldn't confirm" (never a false success)
 */
export function VerifyEmailStatus({ errorCode }: VerifyEmailStatusProps) {
  const { data: session, isPending } = authClient.useSession();

  if (errorCode) {
    return (
      <AuthStatusCard
        icon={XCircle}
        tone="error"
        title="Verification link isn't valid"
        description="This link is invalid, has expired, or was already used. If you've already verified your email, you can sign in. Otherwise, create your account again."
      >
        <AuthLinkButton href="/login">Back to Sign In</AuthLinkButton>
        <AuthLinkButton href="/signup" variant="secondary">
          Create Account
        </AuthLinkButton>
      </AuthStatusCard>
    );
  }

  if (isPending) {
    return (
      <AuthStatusCard
        icon={Loader2}
        iconClassName="animate-spin motion-reduce:animate-none"
        title="Confirming your email"
        description="Just a moment while we check your verification status."
      />
    );
  }

  if (session?.user?.emailVerified) {
    return (
      <AuthStatusCard
        icon={CheckCircle2}
        tone="success"
        title="Email verified successfully!"
        description="Your email address has been verified and your account is ready to use."
      >
        <AuthLinkButton href="/account">Go to Account</AuthLinkButton>
        <AuthLinkButton href="/" variant="secondary">
          Back to Home
        </AuthLinkButton>
      </AuthStatusCard>
    );
  }

  return (
    <AuthStatusCard
      icon={Mail}
      title="We couldn't confirm your verification"
      description="If you just verified your email, sign in to continue. If you haven't yet, open the verification link from your email."
    >
      <AuthLinkButton href="/login">Continue to Sign In</AuthLinkButton>
      <AuthLinkButton href="/" variant="secondary">
        Back to Home
      </AuthLinkButton>
    </AuthStatusCard>
  );
}