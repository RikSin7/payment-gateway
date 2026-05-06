import { PaymentPayload, PaymentResponse } from "@/types";

export async function submitPayment(
    payload: PaymentPayload, //Payment Information
    signal?: AbortSignal // This allows frontend to cancel the request if needed
): Promise<PaymentResponse> {

    const response = await fetch('/api/pay', {
        method: 'POST',

        headers: {
            'Content-Type': 'application/json',
        },

        body: JSON.stringify(payload),

        signal,
    });

    const data: PaymentResponse = await response.json();

    /**
     * API-level failure
     */
    if (!response.ok) {
        throw new Error(
            data.failureReason || 'Payment failed'
        );
    }

    return data;
}