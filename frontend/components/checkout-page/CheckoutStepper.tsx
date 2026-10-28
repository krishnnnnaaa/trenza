"use client";

import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { CheckoutStep } from "@/types/types";


type StepStatus = "completed" | "current" | "upcoming";

interface StepDefinition {
  id: CheckoutStep;
  label: string;
}

const STEPS: StepDefinition[] = [
  { id: "address", label: "Address" },
  { id: "review", label: "Review" },
  { id: "payment", label: "Payment" },
  { id: "confirmation", label: "Confirmation" },
];

function getStepStatus(index: number, currentIndex: number): StepStatus {
  if (index < currentIndex) return "completed";
  if (index === currentIndex) return "current";
  return "upcoming";
}

interface CheckoutStepperProps {
  currentStep: CheckoutStep;
  /**
   * Omit to render a non-interactive stepper (e.g. on the confirmation
   * screen, where going back no longer makes sense). When provided,
   * only completed steps become clickable — upcoming steps are never
   * jumpable since their data may not exist yet.
   */
  onStepChange?: (step: CheckoutStep) => void;
  className?: string;
}

export function CheckoutStepper({
  currentStep,
  onStepChange,
  className,
}: CheckoutStepperProps) {
  const currentIndex = STEPS.findIndex((step) => step.id === currentStep);

  return (
    <ol
      aria-label="Checkout progress"
      className={cn("flex w-full items-start", className)}
    >
      {STEPS.map((step, index) => {
        const status = getStepStatus(index, currentIndex);
        const isLast = index === STEPS.length - 1;
        const isClickable = status === "completed" && Boolean(onStepChange);

        const circleBase =
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-medium transition-colors duration-150";

        return (
          <li
            key={step.id}
            className={cn("flex items-start", !isLast && "flex-1")}
          >
            <div className="flex flex-col items-center gap-2 px-1">
              {isClickable ? (
                <button
                  type="button"
                  aria-label={`Go back to ${step.label}`}
                  className={cn(
                    circleBase,
                    "bg-[#17181A] text-white hover:bg-[#454F45] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#454F45] focus-visible:ring-offset-2",
                  )}
                >
                  <Check className="h-4 w-4" aria-hidden="true" />
                </button>
              ) : (
                <span
                  aria-current={status === "current" ? "step" : undefined}
                  className={cn(
                    circleBase,
                    status === "completed" && "bg-[#17181A] text-white",
                    status === "current" &&
                      "bg-[#17181A] text-white ring-2 ring-[#454F45] ring-offset-2",
                    status === "upcoming" &&
                      "border border-[#E3DFD8] bg-transparent text-[#857F73]",
                  )}
                >
                  {status === "completed" ? (
                    <Check className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    index + 1
                  )}
                </span>
              )}

              <span
                className={cn(
                  "whitespace-nowrap text-[11px] font-medium sm:text-sm",
                  status === "upcoming" ? "text-[#857F73]" : "text-[#17181A]",
                )}
              >
                {step.label}
              </span>
            </div>

            {!isLast && (
              <div
                aria-hidden="true"
                className={cn(
                  "mt-4 h-px flex-1",
                  index < currentIndex ? "bg-[#17181A]" : "bg-[#E3DFD8]",
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}