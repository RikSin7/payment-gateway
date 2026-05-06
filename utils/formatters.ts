import { Currency } from "@/types";

export function formatCardNumber(raw: string): string {
  // Strip non-digits, then insert space every 4 chars
  const digits = raw.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(.{4})/g, '$1 ').trim();
}

export function formatExpiry(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 4); //removes non digits and limits to 4 digits
  if (digits.length >= 3) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }
  return digits;
}

export function maskCardNumber(raw: string): string {
  const digits = raw.replace(/\s/g, ''); //removes spaces
  const last4 = digits.slice(-4); //takes last 4 digits
  return `**** **** **** ${last4}`; //returns masked card number
}

export function formatCurrency(amount: number, currency: Currency): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatTimestamp(iso: string): string {
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(iso));
}

export function formatAmountInput(value: string): string {
  // Allow digits and at most one decimal with 2 places
  const cleaned = value.replace(/[^\d.]/g, '');
  const parts = cleaned.split('.');
  if (parts.length > 2) return parts[0] + '.' + parts[1];
  if (parts[1]?.length > 2) return parts[0] + '.' + parts[1].slice(0, 2);
  return cleaned;
}