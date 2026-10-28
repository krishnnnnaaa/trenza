import { MapPin } from "lucide-react";
import { DetailCard } from "./DetailCard";
import type { OrderAddress } from "@/types/types";

export function ShippingAddressCard({ address }: { address: OrderAddress }) {
  if (!address) {
    return (
      <DetailCard title="Shipping Address" icon={MapPin}>
        <p className="text-sm text-muted-foreground">Address information unavailable.</p>
      </DetailCard>
    );
  }

  return (
    <DetailCard title="Shipping Address" icon={MapPin}>
      <address className="space-y-0.5 wrap-break-word text-sm not-italic">
        <p className="font-medium">{address.name}</p>
        <p className="text-muted-foreground">{address.phone}</p>
        <p className="pt-2">{address.addressLine1}</p>
        {address.addressLine2 && <p>{address.addressLine2}</p>}
        <p>
          {address.city}, {address.state} {address.postalCode}
        </p>
        <p>{address.country}</p>
      </address>
    </DetailCard>
  );
}