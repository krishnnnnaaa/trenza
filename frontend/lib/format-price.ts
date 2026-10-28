const priceFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
});

/** Formats a decimal price string (e.g. "289.00") for display. */
export function formatPrice(price: string): string {
  const value = Number.parseFloat(price);
  if (Number.isNaN(value)) return price;
  return priceFormatter.format(value);
}
