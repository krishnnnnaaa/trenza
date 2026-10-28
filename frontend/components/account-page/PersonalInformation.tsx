"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/lib/auth-client"; // TODO: point to your existing Better Auth client
import OrderDetailsError from "../order-detail-page/OrderDetailsError"; // generic error UI (title/description/onRetry)
import { PersonalInfoForm } from "./PersonalInfoForm";

const CARD = "rounded-lg border border-[#E3DFD8] bg-[#FAF8F5] p-6 sm:p-8";

function PersonalInfoSkeleton() {
  return (
    <div role="status" aria-label="Loading personal information" className="mt-6 grid max-w-xl gap-5">
      {[0, 1].map((i) => (
        <div key={i} className="grid gap-2">
          <Skeleton className="h-4 w-16 bg-[#F0EDE7]" />
          <Skeleton className="h-11 w-full rounded-sm bg-[#F0EDE7]" />
        </div>
      ))}
      <Skeleton className="h-11 w-36 rounded-sm bg-[#F0EDE7]" />
    </div>
  );
}

export function PersonalInformation() {
  const { data: session, isPending, error, refetch } = authClient.useSession();

  if (error) {
    return (
      <OrderDetailsError
        title="We couldn't load your account"
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <section className={CARD}>
      <h2 className="text-xl font-semibold text-[#17181A]">Personal Information</h2>
      <p className="mt-1 text-sm text-[#857F73]">
        Update your name and review the email linked to your account.
      </p>

      {isPending ? (
        <PersonalInfoSkeleton />
      ) : session?.user ? (
        // key resets form state if the signed-in user ever changes
        <PersonalInfoForm
          key={session.user.id}
          user={{ name: session.user.name, email: session.user.email }}
        />
      ) : (
        <p className="mt-6 text-sm text-[#857F73]">
          Please sign in to view your account information.
        </p>
      )}
    </section>
  );
}