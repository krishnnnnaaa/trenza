"use client";

import { Loader2 } from "lucide-react";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";
import { authClient } from "@/lib/auth-client"; // TODO: point to your existing Better Auth client

const MAX_NAME_LENGTH = 80;

// trim + collapse repeated inner spaces
const normalizeName = (value: string) => value.trim().replace(/\s+/g, " ");

interface PersonalInfoFormProps {
  user: { name: string; email: string };
}

export function PersonalInfoForm({ user }: PersonalInfoFormProps) {
  const [name, setName] = useState(user.name);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const cleanedName = normalizeName(name);
  const isDirty = cleanedName !== user.name;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSaving) return; // block duplicate submissions

    if (!cleanedName) {
      setFieldError("Name is required.");
      return;
    }
    if (cleanedName.length > MAX_NAME_LENGTH) {
      setFieldError(`Name must be ${MAX_NAME_LENGTH} characters or fewer.`);
      return;
    }
    if (!isDirty) return;

    setFieldError(null);
    setIsSaving(true);
    try {
      const { error } = await authClient.updateUser({ name: cleanedName });
      if (error) {
        toast.add({
          type: "error",
          title: "Couldn't update profile",
          description: error.message || "Something went wrong",
        });
        return;
      }
      setName(cleanedName);
      toast.add({ type: "success", description: "Your information has been updated" });
    } catch {
      toast.add({ type: "error", description: "Something went wrong" });
    } finally {
      setIsSaving(false);
    }
  }

  const inputClass =
    "h-11 rounded-sm border-[#E3DFD8] bg-[#FAF8F5] text-[#17181A] focus-visible:ring-[#454F45]";

  return (
    <form onSubmit={handleSubmit} noValidate className="mt-6 grid max-w-xl gap-5">
      <div className="grid gap-2">
        <Label htmlFor="account-name" className="text-sm font-medium text-[#17181A]">
          Name
        </Label>
        <Input
          id="account-name"
          name="name"
          autoComplete="name"
          maxLength={MAX_NAME_LENGTH + 20}
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (fieldError) setFieldError(null);
          }}
          aria-invalid={fieldError ? true : undefined}
          aria-describedby={fieldError ? "account-name-error" : undefined}
          disabled={isSaving}
          className={inputClass}
        />
        {fieldError && (
          <p id="account-name-error" role="alert" className="text-sm text-destructive">
            {fieldError}
          </p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="account-email" className="text-sm font-medium text-[#17181A]">
          Email
        </Label>
        <Input
          id="account-email"
          name="email"
          type="email"
          autoComplete="email"
          value={user.email}
          readOnly
          aria-describedby="account-email-hint"
          className={`${inputClass} cursor-not-allowed bg-[#F0EDE7] text-[#857F73]`}
        />
        <p id="account-email-hint" className="text-xs text-[#857F73]">
          Your email is used to sign in and can&apos;t be changed here.
        </p>
      </div>

      <div>
        <Button
          type="submit"
          disabled={isSaving || !isDirty}
          aria-busy={isSaving}
          className="h-11 gap-2 rounded-sm bg-[#17181A] px-6 text-white hover:bg-[#454F45] disabled:pointer-events-none disabled:opacity-40"
        >
          {isSaving && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
          {isSaving ? "Saving..." : "Update Changes"}
        </Button>
      </div>
    </form>
  );
}