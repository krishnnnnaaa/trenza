"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import { AuthLinkButton, AuthStatusCard } from "./Authstatuscard";
import { PasswordField } from "./Passwordfield";

// Better Auth defaults (your auth config doesn't override them): 8..128 characters.
// The server enforces these too; this only gives instant feedback.
const MIN_LENGTH = 8;
const MAX_LENGTH = 128;

// Server messages that are safe & useful to show to the user. Everything else -> generic text.
const SAFE_SERVER_CODES = new Set(["PASSWORD_TOO_SHORT", "PASSWORD_TOO_LONG"]);

interface ResetPasswordFormProps {
  token?: string; // from ?token=
  error?: string; // from ?error= (Better Auth adds this when the link is invalid/expired)
}

function validate(password: string, confirm: string) {
  const errors: { password?: string; confirm?: string } = {};

  if (!password) errors.password = "Please enter a new password.";
  else if (password.length < MIN_LENGTH) errors.password = `Password must be at least ${MIN_LENGTH} characters.`;
  else if (password.length > MAX_LENGTH) errors.password = `Password must be ${MAX_LENGTH} characters or fewer.`;

  if (!confirm) errors.confirm = "Please confirm your new password.";
  else if (password !== confirm) errors.confirm = "Passwords do not match.";

  return errors;
}

export function ResetPasswordForm({ token: initialToken, error: linkError }: ResetPasswordFormProps) {
  const [token] = useState(initialToken); // kept in memory only, never in storage
  const [linkInvalid, setLinkInvalid] = useState(Boolean(linkError) || !initialToken);
  const [done, setDone] = useState(false);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [touched, setTouched] = useState({ password: false, confirm: false });
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Remove ?token=... from the address bar so it doesn't linger in history / get copied around.
  useEffect(() => {
    if (initialToken || linkError) {
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, [initialToken, linkError]);

  const errors = validate(password, confirm);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading || !token) return; // block duplicate submits

    setTouched({ password: true, confirm: true });
    if (errors.password || errors.confirm) return;

    setLoading(true);
    setFormError(null);

    try {
      const { error } = await authClient.resetPassword({ newPassword: password, token });

      if (error) {
        if (error.code === "INVALID_TOKEN") {
          setLinkInvalid(true); // invalid / expired / already used
          return;
        }
        setFormError(
          error.code && SAFE_SERVER_CODES.has(error.code) && error.message
            ? error.message
            : "We couldn't update your password. Please try again.",
        );
        return;
      }

      setPassword("");
      setConfirm("");
      setDone(true); // only after Better Auth confirms
    } catch {
      setFormError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <AuthStatusCard
        icon={CheckCircle2}
        tone="success"
        title="Password updated"
        description="Your password has been changed. You can now sign in with your new password."
      >
        <AuthLinkButton href="/login">Continue to Sign In</AuthLinkButton>
      </AuthStatusCard>
    );
  }

  if (linkInvalid) {
    return (
      <AuthStatusCard
        icon={XCircle}
        tone="error"
        title="This reset link isn't valid"
        description="The link is invalid, has expired, or was already used. Request a new one to continue."
      >
        <AuthLinkButton href="/auth/email/forgot-password">Request a New Link</AuthLinkButton>
        <AuthLinkButton href="/login" variant="secondary">
          Back to Sign In
        </AuthLinkButton>
      </AuthStatusCard>
    );
  }

  return (
    <div>
      <div className="text-center">
        <h1 className="font-serif text-2xl font-normal text-[#17181A] sm:text-3xl">
          Create a new password
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[#857F73]">
          Choose a new password for your account. You&apos;ll use it the next time you sign in.
        </p>
      </div>

      <form className="mt-7 flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
        <PasswordField
          id="new-password"
          label="New password"
          value={password}
          onChange={setPassword}
          onBlur={() => setTouched((t) => ({ ...t, password: true }))}
          autoComplete="new-password"
          placeholder="Enter a new password"
          hint={`At least ${MIN_LENGTH} characters.`}
          error={touched.password ? errors.password : undefined}
          disabled={loading}
        />

        <PasswordField
          id="confirm-new-password"
          label="Confirm password"
          value={confirm}
          onChange={setConfirm}
          onBlur={() => setTouched((t) => ({ ...t, confirm: true }))}
          autoComplete="new-password"
          placeholder="Re-enter your new password"
          error={touched.confirm ? errors.confirm : undefined}
          disabled={loading}
        />

        {formError && (
          <p role="alert" className="rounded-sm border border-[#E5C7C4] bg-[#FAEFEE] px-3 py-2 text-sm text-[#843B36]">
            {formError}
          </p>
        )}

        <Button
          type="submit"
          disabled={loading}
          aria-busy={loading}
          className="h-11 gap-2 rounded-sm bg-[#17181A] text-white hover:bg-[#454F45]"
        >
          {loading && <Spinner className="h-4 w-4" />}
          {loading ? "Updating..." : "Update Password"}
        </Button>

        <Link
          href="/login"
          className="text-center text-sm text-[#857F73] underline-offset-4 hover:text-[#17181A] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#454F45] focus-visible:ring-offset-2"
        >
          Back to Sign In
        </Link>
      </form>
    </div>
  );
}