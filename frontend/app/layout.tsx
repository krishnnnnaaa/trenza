import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toast";
import { InitialLoader } from "@/components/initial-loader";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Trenza | Fashion & Lifestyle",
  description:
    "Discover thoughtfully selected fashion and lifestyle essentials at Trenza.",
  applicationName: "Trenza",
  keywords: ["Trenza", "fashion", "lifestyle", "online store"],
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    type: "website",
    siteName: "Trenza",
    title: "Trenza | Fashion & Lifestyle",
    description:
      "Discover thoughtfully selected fashion and lifestyle essentials at Trenza.",
  },
  twitter: {
    card: "summary",
    title: "Trenza | Fashion & Lifestyle",
    description:
      "Discover thoughtfully selected fashion and lifestyle essentials at Trenza.",
  },
};


export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      suppressHydrationWarning
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        inter.variable
      )}
    >
      <body className="min-h-full flex flex-col">
        <InitialLoader>
        {children}
        </InitialLoader>
        <Toaster />
      </body>
    </html>
  );
}