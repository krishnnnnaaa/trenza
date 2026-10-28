"use client";

import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { ChangeEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "../ui/toast";
import { authClient } from "@/lib/auth-client";
import { Spinner } from "../ui/spinner";


interface formState {
  name: string,
  email: string,
  password: string,
  confirmPassword: string, 
}

export function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [form, setForm] = useState<formState>({confirmPassword: "", email:"", name:"", password:""})


 
async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();

  if (loading) return;

  if (
    !form.name.trim() ||
    !form.email.trim() ||
    !form.password ||
    !form.confirmPassword
  ) {
    toast.add({
      type: "warning",
      description: "Please fill all the required fields.",
    });
    return;
  }

  if (form.password !== form.confirmPassword) {
    toast.add({
      type: "warning",
      description: "Passwords do not match.",
    });
    return;
  }

  setLoading(true);

  try {
    const { data, error } = await authClient.signUp.email({
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      callbackURL: `${process.env.NEXT_PUBLIC_APP_URL}/auth/email/verify-email`,
    });
    

    if (error) {
      toast.add({
        type: "error",
        description: error.message || "Unable to create your account.",
      });
      return;
    }

    if (!data) {
      toast.add({
        type: "error",
        description: "We couldn't confirm your signup. Please try again.",
      });
      return;
    }

   toast.add({
  type: "success",
  description:
    "If this email can be registered, check your inbox. Already have an account? Try logging in instead.",
});
  } catch (error) {
    console.error("Signup request failed:", error);

    toast.add({
      type: "error",
      description: "Something went wrong. Please try again.",
    });
  } finally {
    setLoading(false);
  }
}



  function handleConfirmPassword(e: ChangeEvent<HTMLInputElement, HTMLInputElement>){
    setForm({...form, confirmPassword: e.target.value})
  }


  return (
    <form
  className="flex flex-col gap-6"
  noValidate
  onSubmit={handleSignup}
>
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Full name</Label>
        <Input
        value={form.name}
          id="name"
          name="name"
          type="text"
          onChange={(e)=> setForm({...form, name: e.target.value})}
          autoComplete="name"
          placeholder="Jane Doe"
          required
          className="h-11 rounded-sm border-[#E3DFD8] bg-white focus-visible:ring-[#454F45]"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          value={form.email}
          onChange={(e)=> setForm({...form, email: e.target.value})}
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          required
          className="h-11 rounded-sm border-[#E3DFD8] bg-white focus-visible:ring-[#454F45]"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            value={form.password}
            onChange={(e)=> setForm({...form, password: e.target.value})}
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Create a password"
            required
            className="h-11 rounded-sm border-[#E3DFD8] bg-white pr-11 focus-visible:ring-[#454F45]"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}

            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-[#857F73] hover:text-[#17181A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#454F45] focus-visible:ring-offset-2"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Eye className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="confirm-password">Confirm password</Label>
        <div className="relative">
          <Input
            id="confirm-password"
            name="confirmPassword"
            onChange={(e)=> handleConfirmPassword(e)}
            value={form.confirmPassword}
            type={showConfirmPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Re-enter your password"
            required
            className="h-11 rounded-sm border-[#E3DFD8] bg-white pr-11 focus-visible:ring-[#454F45]"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            aria-label={
              showConfirmPassword ? "Hide password" : "Show password"
            }
            aria-pressed={showConfirmPassword}
            className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-[#857F73] hover:text-[#17181A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#454F45] focus-visible:ring-offset-2"
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Eye className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </div>
        {
          form.confirmPassword.length > 0 &&
          <small className="text-red-600 text-xs select-none">{form.password !== form.confirmPassword ? "Confirm Password must match with the password." : null}</small>
        }
      </div>

      <Button
  type="submit"
  disabled={
    loading ||
    !form.name.trim() ||
    !form.email.trim() ||
    !form.password ||
    !form.confirmPassword ||
    form.password !== form.confirmPassword
  }
  className="h-11 rounded-sm bg-[#17181A] text-white hover:bg-[#454F45]"
>
  {loading ? <Spinner /> : "Create account"}
</Button>

      <p className="text-center text-sm text-[#857F73]">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-[#17181A] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#454F45] focus-visible:ring-offset-2"
        >
          Log in
        </Link>
      </p>
    </form>
  );
}