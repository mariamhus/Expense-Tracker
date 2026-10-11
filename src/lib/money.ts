export const CURRENCIES = ["USD", "EUR", "GBP", "EGP", "SAR", "AED", "INR", "JPY"] as const;
export type Currency = (typeof CURRENCIES)[number];

const formatters = new Map<string, Intl.NumberFormat>();

function formatter(currency: Currency, compact: boolean) {
  const key = `${currency}-${compact}`;
  let format = formatters.get(key);
  if (!format) {
    format = new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: compact ? 0 : undefined,
    });
    formatters.set(key, format);
  }
  return format;
}

export function formatMoney(cents: number, currency: Currency, compact = false): string {
  return formatter(currency, compact).format(cents / 100);
}

export function parseAmount(input: string): number | null {
  const normalized = input.replace(/\s/g, "").replace(",", ".");
  if (!/^\d+(\.\d{0,2})?$/.test(normalized)) return null;
  const cents = Math.round(Number(normalized) * 100);
  return cents > 0 ? cents : null;
}

export function amountInput(cents: number): string {
  return (cents / 100).toFixed(2).replace(/\.00$/, "");
}
