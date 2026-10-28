"use client";

import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email || !password) {
      toast.add({
        type: "warning",
        description: "Please enter your email and password.",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await authClient.signIn.email({
        email,
        password,
        callbackURL: "/",
      });

      if (error) {
          if (error.code === "EMAIL_NOT_VERIFIED") {
          await authClient.sendVerificationEmail({
            email,
            callbackURL: `${process.env.NEXT_PUBLIC_APP_URL}/auth/email/verify-email`,
          });
          toast.add({
            type: "warning",
            description: "Please verify your email first. We've sent you a new verification link.",
          });
          return;
        }
        toast.add({ type: "error", description: error.message });
        return;
      }

      toast.add({
        type: "success",
        description: "You have logged in successfully.",
      });
    } catch (error) {
      toast.add({
        type: "error",
        description:
          error instanceof Error ? error.message : "Unable to log in. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="flex flex-col gap-6" onSubmit={handleLogin} noValidate>
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          placeholder="you@example.com"
          required
          className="h-11 rounded-sm border-[#E3DFD8] bg-white focus-visible:ring-[#454F45]"
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Link
            href="auth/email/forgot-password"
            className="text-sm text-[#857F73] underline-offset-4 hover:text-[#17181A] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#454F45] focus-visible:ring-offset-2"
          >
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            placeholder="Enter your password"
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

      <Button
        type="submit"
        disabled={loading}
        className="h-11 rounded-sm bg-[#17181A] text-white hover:bg-[#454F45]"
      >
        {loading ? <Spinner /> : "Log in"}
      </Button>

      {/* <div className="flex items-center gap-4">
        <Separator className="flex-1 bg-[#E3DFD8]" />
        <span className="text-xs text-[#857F73]">or</span>
        <Separator className="flex-1 bg-[#E3DFD8]" />
      </div>

      <Button
        type="button"
        variant="outline"
        className="h-11 rounded-sm border-[#E3DFD8] bg-transparent text-[#17181A] hover:bg-[#F0EDE7]"
      >
        Continue as guest
      </Button> */}

      <p className="text-center text-sm text-[#857F73]">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="text-[#17181A] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#454F45] focus-visible:ring-offset-2"
        >
          Create account
        </Link>
      </p>
    </form>
  );
}