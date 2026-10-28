"use client";

import { colors } from "@/lib/constants/colors";
import { Mail, ShieldCheck } from "lucide-react";
import { useState } from "react";

/**
 * Portfolio-only component: the form is visually functional (controlled
 * input, focus/disabled states) but does not submit anywhere — there is
 * no real subscription backend for this project.
 */
export function Newsletter() {
  const [email, setEmail] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    // No backend wired up — this is a design-only showcase component.
    event.preventDefault();
  }

  return (
    <div className="mx-auto max-w-7xl px-6 pb-6 lg:px-10">
      <div
        className="flex flex-col gap-8 rounded-2xl px-6 py-8 sm:px-8 md:flex-row md:items-center md:justify-between md:gap-10 md:py-10"
        style={{ backgroundColor: colors.dark.background }}
      >
        {/* Left: icon + heading + subtext */}
        <div className="flex items-start gap-4 md:max-w-sm">
          <span
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
            style={{ backgroundColor: colors.background.surface }}
          >
            <Mail
              className="h-5 w-5"
              style={{ color: colors.ink }}
              aria-hidden="true"
              strokeWidth={1.75}
            />
          </span>

          <div className="flex flex-col gap-1.5">
            <h2
              className="font-serif text-xl font-normal sm:text-2xl"
              style={{ color: colors.dark.text.primary }}
            >
              Stay in the Loop
            </h2>
            <p
              className="text-sm leading-relaxed"
              style={{ color: colors.dark.text.secondary }}
            >
              Get exclusive deals, new arrivals and style inspiration
              straight to your inbox.
            </p>
          </div>
        </div>

        {/* Right: form + privacy note */}
        <div className="flex flex-col gap-2.5 md:w-full md:max-w-md">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-2.5 sm:flex-row sm:gap-2"
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="Enter your email address"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-11 w-full rounded-full border-0 px-4 text-sm outline-none ring-1 ring-inset ring-transparent placeholder:text-[#857F73] focus-visible:ring-2"
              style={{
                backgroundColor: colors.background.surface,
                color: colors.ink,
              }}
            />
            <button
              type="submit"
              className="h-11 shrink-0 rounded-full px-6 text-sm font-medium transition-opacity duration-150 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              style={{
                backgroundColor: colors.dark.accent,
                color: colors.ink,
              }}
            >
              Subscribe
            </button>
          </form>

          <p
            className="flex items-center gap-1.5 text-xs"
            style={{ color: colors.dark.text.muted }}
          >
            <ShieldCheck className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            We respect your privacy. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </div>
  );
}