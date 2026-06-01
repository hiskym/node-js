export function parsePrice(price: string): number {
  return Number(price);
}

export function formatPrice(price: string, currency = "CZK"): string {
  return new Intl.NumberFormat("cs-CZ", {
    style: "currency",
    currency,
  }).format(Number(price));
}