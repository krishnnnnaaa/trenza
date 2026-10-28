"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { authClient } from "@/lib/auth-client"; // TODO: point to your existing Better Auth client

/** Only place that knows HOW to sign out. Swap internals here if your app already has a helper. */
export function useLogout() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const logout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/");
            router.refresh();
          },
        },
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  return { logout, isLoggingOut };
}