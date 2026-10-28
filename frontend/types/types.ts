import { LucideIcon } from "lucide-react";
import type { StaticImageData } from "next/image";
import React, { ReactNode } from "react";

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  isPrimary: boolean;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  categoryId: string;
  slug: string;
  description: string;
  price: number;
  brand?: string,
  tags: string[],
  stock: number;
  createdAt: string;
  updatedAt: string;
}

/** Shape ProductCard actually consumes: a Product with its related images. */
export interface ProductWithImages extends Product {
  images: ProductImage[];
}

/** Picks the image flagged isPrimary, falling back to the first available image. */
export function getPrimaryImage(product: ProductWithImages): ProductImage | undefined {
  return product.images.find((image) => image.isPrimary) ?? product.images[0];
}

export interface ProductSection {
  title: string,
  id: "newest" | "featured",
  subtitle: string,
}

export interface ProductTile {
  id: string;
  label: string,
  title: string;
  imageSrc: string;
  cta: string,
  imageAlt: string;
  href: string;
}

export interface Pagination{
    page: number;
    limit: number;
    total: string;
    totalPages: number;
}
export interface Category {
  id: number;
  name: string;
  description: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  totalProducts: string;
}

export interface CategoryApiResponse {
  data: Category[];
  pagination: Pagination
}
export interface ProductApiResponse {
  data: ProductWithImages[],
  pagination: Pagination
}
export interface CategoryCircularCard{
  id: number,
  name: string,
  url?: string,
  icon: LucideIcon,
  slug: string
}


export interface SearchResultType {
  view: "grid" | "list"
    sort: "newest" | "low-to-high" | "high-to-low",
    products?: ProductApiResponse,
    pagination: Pagination,
    openToggle?: boolean,
    setOpenToggle?: React.Dispatch<React.SetStateAction<boolean>>,
    onViewChange: React.Dispatch<React.SetStateAction<"grid" | "list">>,
    onSortChange: React.Dispatch<React.SetStateAction<"newest" | "low-to-high" | "high-to-low">>,
    onPageChange?: (page: number)=> void,
    searchQueryState:  "blank" | "notfound" | "loading" | "ready"
}

export interface FiltersProps{
  openToggle?: boolean,
  setOpenToggle?: React.Dispatch<React.SetStateAction<boolean>>,
}

export interface FilterSearchComponent{
  categoryFilter: string,
  setCategoryFilter: React.Dispatch<React.SetStateAction<string>>,
  priceRange: [number, number],
  setPriceRange: React.Dispatch<React.SetStateAction<[number, number]>>,
}

export interface ProductDetailResponse extends ProductWithImages{
  categorySlug: string,
  categoryName: string
}


export interface CartItem {
  id: number;
  cartId: number;
  productId: number;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Shape CartItem/CartItems actually consume: a cart_items row joined
 * with its product and product_images.
 */
export interface CartItemResponse {
  id: number;
  quantity: number;
  product: Product;
  images: ProductImage[];
}

export interface CartResponse {
  data: {
    id?: number;
    userId?: string;
    createdAt?: string;
    updatedAt?: string;
    items: CartItemResponse[];
  };
}


export interface AddressApiResponse {
    createdAt: Date;
    updatedAt: Date;
    id: number;
    userId: string;
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2: string | null;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
}
export interface addressFormType {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2: string | null;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
}
export type CheckoutStep = "address" | "review" | "payment" | "confirmation";

export interface CheckoutStepperProps {
  currentStep: CheckoutStep;
  onStepChange?: (step: CheckoutStep) => void;
  className?: string;
}

export type PaymentMethod =
  "online"
  | "cash-on-delivery";

  export type PostPaymentStatus = "paid" | "failure" | "pending";

export interface paymentMethodType {
  id: string,
		title: string,
		subtitle: string,
		icon: StaticImageData | LucideIcon,
		subIcons?: StaticImageData[] | LucideIcon[],
		note?: string
}

export interface createOrderApiResponse{
  data: {
    orderId: number;
    razorpayOrderId?: string;
    amount?: number;
    currency?: string;
    totalAmount: number;
    orderDate?: string;
  };
}
export interface RazorpayPaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface PostPaymentResponse {
  orderId: number;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  orderDate?: string;
  paidAt?: string;
  paymentStatus: PostPaymentStatus;
  totalAmount: number;
}

export interface verifyPaymentApiResponse {
  status: number;
  message: string;
  data: PostPaymentResponse;
}


export interface OrderPaymentSummary{
  currency: string;
  subtotal: number;
  shipping: number;
  totalAmount: number;
}

export interface ConfirmationStepProps {
  items: CartItemResponse[];
  postPaymentResponse: PostPaymentResponse | null;
  orderPaymentSummary: OrderPaymentSummary | null;
  address: AddressApiResponse;
  paymentMethod: string;
}


export interface CheckoutStateResponse {
  state: CheckoutStep | "empty" | "invalid";
  message: string;
  addressId: number;
  cartId?: number;
  orderId?: number;
}

export interface CheckoutStateApiResponse {
  data: CheckoutStateResponse;
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: string;
  productName: string;
  productImage?: string;
  productSlug: string;
}

export interface Order {
  id: number;
  userId: string;
  addressId: number;
  status: string;
  totalAmount: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

export interface OrdersResponse {
  data: Order[];
  pagination: Pagination;
}

export interface OrderAddress {
  id: number;
  userId: string;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface OrderPayment {
  id: number;
  orderId: number;
  provider: string;
  providerOrderId: string;
  providerPaymentId?: string | null;
  amount: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderDetail extends Order {
  address: OrderAddress;
  payment: OrderPayment | null;
}

export interface OrderDetailResponse {
  data: OrderDetail;
}

export interface WishlistItem {
  id: number;
  createdAt: string;
  updatedAt: string;
  product: Product;
  images: ProductImage[];
}

export interface WishlistItemMutationResponse {
  id: number;
  wishlistId: number;
  productId: number;
  createdAt: string;
  updatedAt: string;
}

export interface WishlistApiResponse {
  data: {
    id?: number;
    userId?: string;
    createdAt?: string;
    updatedAt?: string;
    items: WishlistItem[];
  };
}

export interface AddWishlistItemApiResponse {
  data: WishlistItemMutationResponse;
}

export interface DeleteWishlistItemApiResponse {
  message: string;
}


export interface ShopContextType {
  wishlistCount: number;
  setWishlistCount: (count: number) => void;
  cartCount: number;
  setCartCount: (count: number) => void;
  fetchWishlistCount?: () => Promise<void>;
  fetchCartCount?: () => Promise<void>;
}

export interface PolicySectionData {
  id: string;
  number: string;
  title: string;
  content: ReactNode;
}
 
export interface PolicySummaryItem {
  icon: LucideIcon;
  title: string;
  text: string;
  confirm?: string;
}