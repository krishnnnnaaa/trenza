import { colors } from "@/lib/constants/colors";
import { Headphones, Lock, RotateCcw, Truck } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface TrustFeature {
  icon: LucideIcon;
  title: string;
  subtitle: string;
}

const defaultFeatures: TrustFeature[] = [
  {
    icon: Truck,
    title: "Free Shipping",
    subtitle: "On orders over ₹49",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    subtitle: "30 days return policy",
  },
  {
    icon: Lock,
    title: "Secure Payments",
    subtitle: "100% secure checkout",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    subtitle: "We're here to help",
  },
];

interface TrustFeaturesProps {
  features?: TrustFeature[];
}

export function TrustFeatures({ features = defaultFeatures }: TrustFeaturesProps) {
  return (
    <div
    style={{ backgroundColor: colors.background.primary }}
    >
    <div
      className="mx-auto max-w-7xl px-6 lg:px-10"
    >
      <div
        className="grid grid-cols-1 gap-y-6 rounded-xl border px-6 py-6 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 lg:gap-x-0 lg:gap-y-0 lg:divide-x"
        style={{
          backgroundColor: colors.background.surface,
          borderColor: colors.border.default,
        }}
      >
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div
              key={feature.title}
              className="flex items-center gap-4 lg:px-6 lg:first:pl-0 lg:last:pr-0"
              style={
                index > 0
                  ? { borderColor: colors.border.default }
                  : undefined
              }
            >
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: colors.background.secondary }}
              >
                <Icon
                  className="h-5 w-5"
                  style={{ color: colors.icon.primary }}
                  aria-hidden="true"
                  strokeWidth={1.75}
                />
              </span>

              <div className="flex flex-col">
                <span
                  className="text-sm font-medium"
                  style={{ color: colors.text.primary }}
                >
                  {feature.title}
                </span>
                <span
                  className="text-sm"
                  style={{ color: colors.text.secondary }}
                >
                  {feature.subtitle}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
    </div>
  );
}