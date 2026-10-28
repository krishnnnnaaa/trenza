"use client";

import { ArrowLeft, Mail, MailCheck } from "lucide-react";
import Link from "next/link";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import { AuthLinkButton, AuthStatusCard } from "./Authstatuscard";

type Status = "idle" | "submitting" | "sent";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Same env var your signup form already uses; falls back to the current origin (no hardcoded localhost).
function getResetRedirectUrl() {
  const base = (process.env.NEXT_PUBLIC_APP_URL ?? window.location.origin).replace(/\/$/, "");
  return `${base}/auth/email/reset-password`;
}

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return; // block duplicate submits

    const value = email.trim();
    if (!value) {
      setFieldError("Please enter your email address.");
      return;
    }
    if (!EMAIL_PATTERN.test(value)) {
      setFieldError("Please enter a valid email address.");
      return;
    }

    setFieldError(null);
    setFormError(null);
    setStatus("submitting");

    try {
      const { error } = await authClient.requestPasswordReset({
        email: value,
        redirectTo: getResetRedirectUrl(),
      });

      if (error) {
        setFormError(
          error.status === 429
            ? "Too many attempts. Please wait a moment and try again."
            : "We couldn't send the reset link right now. Please try again.",
        );
        setStatus("idle");
        return;
      }
      setStatus("sent");
    } catch {
      setFormError("Network error. Please check your connection and try again.");
      setStatus("idle");
    }
  }

  if (status === "sent") {
    return (
      <AuthStatusCard
        icon={MailCheck}
        tone="success"
        title="Check your email"
        description="If an account exists for this email address, you'll receive a password reset link shortly."
      >
        <AuthLinkButton href="/login">Back to Sign In</AuthLinkButton>
        <button
          type="button"
          onClick={() => {
            setEmail("");
            setStatus("idle");
          }}
          className="text-sm text-[#857F73] underline-offset-4 hover:text-[#17181A] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#454F45] focus-visible:ring-offset-2"
        >
          Use a different email
        </button>
      </AuthStatusCard>
    );
  }

  const submitting = status === "submitting";

  return (
    <div>
      <div className="text-center">
        <h1 className="font-serif text-2xl font-normal text-[#17181A] sm:text-3xl">
          Forgot your password?
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[#857F73]">
          No worries. Enter your email address and we&apos;ll send you a link to reset your password.
        </p>
      </div>

      <form className="mt-7 flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
        <div className="flex flex-col gap-2">
          <Label htmlFor="forgot-email">Email</Label>
          <div className="relative">
            <Mail
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#857F73]"
              aria-hidden="true"
            />
            <Input
              id="forgot-email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (fieldError) setFieldError(null);
              }}
              autoComplete="email"
              placeholder="you@example.com"
              disabled={submitting}
              aria-invalid={fieldError ? true : undefined}
              aria-describedby={fieldError ? "forgot-email-error" : undefined}
              className="h-11 rounded-sm border-[#E3DFD8] bg-white pl-10 focus-visible:ring-[#454F45]"
            />
          </div>
          {fieldError && (
            <p id="forgot-email-error" role="alert" className="text-xs text-red-600">
              {fieldError}
            </p>
          )}
        </div>

        {formError && (
          <p role="alert" className="rounded-sm border border-[#E5C7C4] bg-[#FAEFEE] px-3 py-2 text-sm text-[#843B36]">
            {formError}
          </p>
        )}

        <Button
          type="submit"
          disabled={submitting}
          aria-busy={submitting}
          className="h-11 gap-2 rounded-sm bg-[#17181A] text-white hover:bg-[#454F45]"
        >
          {submitting && <Spinner className="h-4 w-4" />}
          {submitting ? "Sending..." : "Send Reset Link"}
        </Button>

        <Link
          href="/login"
          className="inline-flex items-center justify-center gap-1.5 text-sm text-[#857F73] underline-offset-4 hover:text-[#17181A] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#454F45] focus-visible:ring-offset-2"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to Sign In
        </Link>
      </form>
    </div>
  );
}