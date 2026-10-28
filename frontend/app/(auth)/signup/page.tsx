import type { Metadata } from "next";

import { AuthLayout } from "@/components/auth/auth-layout";
import { SignupForm } from "@/components/auth/signup";
import image from '@/assets/auth-banner.png'

export const metadata: Metadata = {
  title: "Create account — Trenza",
};

export default function SignupPage() {
  return (
    <AuthLayout
      heading="Create your account"
      imageSrc={image.src}
      imageAlt="Editorial fashion photograph"
    >
      <SignupForm />
    </AuthLayout>
  );
}