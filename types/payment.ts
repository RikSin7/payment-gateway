export interface PaymentPayload {
  amount: number;
  cardNumber: string;
}

export interface Transaction {
  id: string;
  status: string;
}
