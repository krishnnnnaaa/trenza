import type { Metadata } from "next";

import { AuthLayout } from "@/components/auth/auth-layout";
import { LoginForm } from "@/components/auth/login";
import image from '@/assets/auth-banner.png'

export const metadata: Metadata = {
  title: "Log in — Trenza",
};

export default function LoginPage() {
  return (
    <AuthLayout
      heading="Welcome back"
      imageSrc={image.src}
      imageAlt="Editorial fashion photograph"
    >
      <LoginForm />
    </AuthLayout>
  );
}