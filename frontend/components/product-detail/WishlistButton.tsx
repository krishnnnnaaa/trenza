"use client";

import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWishlist } from "@/lib/UseWishlist";

interface WishlistButtonProps {
  productName: string;
  productId: number;
}

export function WishlistButton({ productName, productId }: WishlistButtonProps) {
  // const [isWishlisted, setIsWishlisted] = useState(false);
  const {isWishlisted, toggle} = useWishlist()
  const wishlisted=  isWishlisted(productId)

  async function handleClick() {
    toggle(productId)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={wishlisted}
      aria-label={
        wishlisted
          ? `Remove ${productName} from wishlist`
          : `Add ${productName} to wishlist`
      }
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-sm border border-[#E3DFD8] text-[#17181A] transition-colors duration-150 hover:bg-[#F0EDE7] hover:text-[#454F45] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#454F45] focus-visible:ring-offset-2"
    >
      <Heart
        className={cn("h-5 w-5", wishlisted && "fill-current")}
        aria-hidden="true"
      />
    </button>
  );
}
