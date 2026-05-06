export type PaymentStatus = 'idle' | 'processing' | 'success' | 'failed' | 'timeout';

export type CardType = 'visa' | 'mastercard' | 'amex' | 'unknown';

export type Currency = 'INR' | 'USD';

export interface PaymentPayload {
  cardholderName: string;
  cardNumber: string;       // raw, no spaces
  expiry: string;           // MM/YY
  cvv: string;
  amount: number;
  currency: Currency;
  transactionId: string;
}

export interface Transaction {
  id: string;
  amount: number;
  currency: Currency;
  status: Exclude<PaymentStatus, 'idle' | 'processing'>;
  timestamp: string;        // ISO string
  failureReason?: string;
  maskedCard: string;       // **** **** **** 4242
  attempt: number;
}

export interface PaymentResponse {
  success: boolean;
  status: 'success' | 'failed';
  failureReason?: string;
}

export interface FormFields {
  cardholderName: string;
  cardNumber: string;       // formatted with spaces
  expiry: string;
  cvv: string;
  amount: string;           // string because it's a controlled input
  currency: Currency;
}

export interface FormErrors {
  cardholderName?: string;
  cardNumber?: string;
  expiry?: string;
  cvv?: string;
  amount?: string;
}