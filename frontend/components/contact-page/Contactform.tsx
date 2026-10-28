"use client";

import { CheckCircle2, ChevronDown, Send } from "lucide-react";
import { useState, type FormEvent, type ReactNode } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { sendContactMessage } from "@/lib/api/contact";

const MAX_MESSAGE = 500;
const SUBJECTS = [
  "Order inquiry",
  "Shipping and delivery",
  "Returns and refunds",
  "Payment issue",
  "Product inquiry",
  "Other",
] as const;

type Subject = (typeof SUBJECTS)[number];
interface Fields {
  name: string;
  email: string;
  subject: "" | Subject;
  message: string;
}
type FieldName = keyof Fields;
type Errors = Partial<Record<FieldName, string>>;
type Status = "idle" | "submitting" | "success" | "error";

const EMPTY: Fields = { name: "", email: "", subject: "", message: "" };
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const fieldClass =
  "w-full rounded-md border border-[#E3DFD8] bg-[#FCFBF9] px-3 text-sm text-[#332F2A] outline-none placeholder:text-[#A39D92] focus-visible:border-[#454F45] focus-visible:ring-2 focus-visible:ring-[#454F45]/20 disabled:opacity-60";

function validate(v: Fields): Errors {
  const e: Errors = {};
  if (!v.name.trim()) e.name = "Please enter your full name.";
  if (!v.email.trim()) e.email = "Please enter your email address.";
  else if (!EMAIL_PATTERN.test(v.email.trim())) e.email = "Please enter a valid email address.";
  if (!v.subject) e.subject = "Please select a subject.";
  if (!v.message.trim()) e.message = "Please write a message.";
  return e;
}

function Field({
  id,
  label,
  error,
  children,
  className,
}: {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Label htmlFor={id} className="text-sm font-medium text-[#17181A]">
        {label} <span className="text-red-600" aria-hidden="true">*</span>
      </Label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export function ContactForm() {
  const [values, setValues] = useState<Fields>(EMPTY);
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
  const [status, setStatus] = useState<Status>("idle");

  const errors = validate(values);
  const show = (name: FieldName) => (touched[name] ? errors[name] : undefined);
  const submitting = status === "submitting";

  const set = <K extends FieldName>(name: K, value: Fields[K]) =>
    setValues((prev) => ({ ...prev, [name]: value }));
  const blur = (name: FieldName) => () => setTouched((t) => ({ ...t, [name]: true }));
  const aria = (name: FieldName) => ({
    "aria-invalid": show(name) ? true : undefined,
    "aria-describedby": show(name) ? `contact-${name}-error` : undefined,
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return; // block duplicate submits

    setTouched({ name: true, email: true, subject: true, message: true });
    if (Object.keys(errors).length > 0) return;

    setStatus("submitting");
    try {
      await sendContactMessage({
        name: values.name.trim(),
        email: values.email.trim(),
        subject: values.subject,
        message: values.message.trim(),
      });
      setValues(EMPTY);
      setTouched({});
      setStatus("success"); // only after the request actually succeeded
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <section className="flex flex-col items-center justify-center rounded-lg border border-[#E3DFD8] bg-[#FCFBF9] p-8 text-center sm:p-10">
        <div role="status">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#EEF4EF]">
            <CheckCircle2 className="h-6 w-6 text-[#3F6B4F]" aria-hidden="true" />
          </span>
          <h2 className="mt-5 font-serif text-2xl text-[#17181A] sm:text-3xl">Message sent</h2>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#857F73]">
            Thanks for reaching out. We&rsquo;ll get back to you as soon as possible, usually within 24–48 hours.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 h-11 rounded-md border border-[#E3DFD8] px-6 text-sm font-medium text-[#17181A] transition-colors hover:bg-[#F0EDE7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#454F45] focus-visible:ring-offset-2"
        >
          Send another message
        </button>
      </section>
    );
  }

  return (
    <section className="rounded-lg border border-[#E3DFD8] bg-[#FCFBF9] p-6 sm:p-8">
      <h2 className="font-serif text-2xl font-normal text-[#17181A] sm:text-3xl">Send us a message</h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-[#857F73]">
        Fill out the form below and we&rsquo;ll get back to you as soon as possible, usually within 24–48 hours.
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-6 grid gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="contact-name" label="Full name" error={show("name")}>
            <Input
              id="contact-name"
              name="name"
              autoComplete="name"
              placeholder="Jane Doe"
              value={values.name}
              onChange={(e) => set("name", e.target.value)}
              onBlur={blur("name")}
              disabled={submitting}
              required
              className={cn(fieldClass, "h-11")}
              {...aria("name")}
            />
          </Field>
          <Field id="contact-email" label="Email address" error={show("email")}>
            <Input
              id="contact-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={values.email}
              onChange={(e) => set("email", e.target.value)}
              onBlur={blur("email")}
              disabled={submitting}
              required
              className={cn(fieldClass, "h-11")}
              {...aria("email")}
            />
          </Field>
        </div>

        <Field id="contact-subject" label="Subject" error={show("subject")}>
          <div className="relative">
            <select
              id="contact-subject"
              name="subject"
              value={values.subject}
              onChange={(e) => set("subject", e.target.value as Fields["subject"])}
              onBlur={blur("subject")}
              disabled={submitting}
              required
              className={cn(fieldClass, "h-11 appearance-none pr-10", !values.subject && "text-[#A39D92]")}
              {...aria("subject")}
            >
              <option value="" disabled>
                Select a subject
              </option>
              {SUBJECTS.map((subject) => (
                <option key={subject} value={subject} className="text-[#332F2A]">
                  {subject}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#857F73]"
              aria-hidden="true"
            />
          </div>
        </Field>

        <Field id="contact-message" label="Message" error={show("message")}>
          <textarea
            id="contact-message"
            name="message"
            rows={5}
            maxLength={MAX_MESSAGE}
            placeholder="Write your message here..."
            value={values.message}
            onChange={(e) => set("message", e.target.value)}
            onBlur={blur("message")}
            disabled={submitting}
            required
            className={cn(fieldClass, "min-h-32 resize-y py-3")}
            {...aria("message")}
          />
          <p
            className={cn(
              "text-right text-xs",
              values.message.length >= MAX_MESSAGE ? "text-red-600" : "text-[#857F73]",
            )}
            aria-live="polite"
          >
            {values.message.length}/{MAX_MESSAGE}
          </p>
        </Field>

        {status === "error" && (
          <p role="alert" className="rounded-md border border-[#E5C7C4] bg-[#FAEFEE] px-3 py-2 text-sm text-[#843B36]">
            We couldn&rsquo;t send your message. Please try again in a moment.
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          aria-busy={submitting}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[#454F45] px-5 text-sm font-medium text-white transition-colors hover:bg-[#332F2A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#454F45]/40 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60"
        >
          {submitting ? <Spinner className="h-4 w-4" /> : <Send className="h-4 w-4" aria-hidden="true" />}
          {submitting ? "Sending..." : "Send message"}
        </button>
      </form>
    </section>
  );
}