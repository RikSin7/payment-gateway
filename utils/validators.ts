import { CardType } from "@/types";

export function validateCardholderName(name: string): string | undefined {
  if (!name.trim()) return 'Cardholder name is required';
  if (name.trim().length < 2) return 'Name is too short';
  if (!/^[a-zA-Z\s'-]+$/.test(name)) return 'Name contains invalid characters';
}

export function validateCardNumber(raw: string): string | undefined {
  const digits = raw.replace(/\s/g, '');
  if (!digits) return 'Card number is required';
  if (!/^\d+$/.test(digits)) return 'Card number must contain only digits';
  if (digits.length < 15 || digits.length > 16) return 'Card number must be 15 or 16 digits';
  // if (!luhn(digits)) return 'Invalid card number';
}

export function validateExpiry(value: string): string | undefined {
  if (!value) return 'Expiry date is required';
  if (!/^\d{2}\/\d{2}$/.test(value)) return 'Use MM/YY format';

  const [mm, yy] = value.split('/').map(Number);

  if (mm < 1 || mm > 12) return 'Invalid month';

  const now = new Date();
  const currentYear = now.getFullYear() % 100;  // 2026 → 26
  const currentMonth = now.getMonth() + 1;       // 1-indexed

  if (yy < currentYear || (yy === currentYear && mm < currentMonth)) {
    return 'Card has expired';
  }
}

export function validateCVV(cvv: string, cardType: CardType): string | undefined {
  if (!cvv) return 'CVV is required';
  const expectedLength = cardType === 'amex' ? 4 : 3;
  if (!/^\d+$/.test(cvv)) return 'CVV must contain only digits';
  if (cvv.length !== expectedLength) {
    return `CVV must be ${expectedLength} digits${cardType === 'amex' ? ' for Amex' : ''}`;
  }
}

export function validateAmount(value: string): string | undefined {
  if (!value) return 'Amount is required';
  const num = parseFloat(value);
  if (isNaN(num)) return 'Amount must be a number';
  if (num <= 0) return 'Amount must be greater than 0';
  if (!/^\d+(\.\d{1,2})?$/.test(value)) return 'Max 2 decimal places allowed';
  if (num > 1_000_000) return 'Amount exceeds maximum limit';
}

// Luhn algorithm — the real card number checksum that eliminate 10% of fake card numbers
function luhn(digits: string): boolean {
  let sum = 0;
  let shouldDouble = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let d = parseInt(digits[i]);
    if (shouldDouble) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
}