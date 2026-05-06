'use client';

import { useCallback } from 'react';
import { submitPayment } from '@/services/paymentService';
import { setProcessing, setSuccess, setFailure, setTimeoutStatus } from '@/store/slices/paymentSlice';
import { useAppDispatch } from '@/store/hooks';
import { PaymentPayload, Transaction } from '@/types';
import { maskCardNumber } from '@/utils/cardUtils';

interface SubmitPaymentArgs {
  payload: PaymentPayload;
  attempt: number;
}

export function usePaymentFlow() {
  const dispatch = useAppDispatch();

  const processPayment = useCallback(
    async ({ payload, attempt }: SubmitPaymentArgs) => {
      dispatch(setProcessing());
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      // 1. Establish Base Transaction (DRY Principle)
      const baseTx: Omit<Transaction, 'status' | 'failureReason'> = {
        id: payload.transactionId,
        amount: payload.amount,
        currency: payload.currency,
        timestamp: new Date().toISOString(),
        maskedCard: maskCardNumber(payload.cardNumber),
        attempt,
      };

      try {
        await submitPayment(payload, controller.signal);
        clearTimeout(timeoutId);

        // 2. Success Path
        dispatch(setSuccess({ ...baseTx, status: 'success' }));
        return { success: true, timeout: false };

      } catch (error) {
        clearTimeout(timeoutId);

        const isTimeout = error instanceof DOMException && error.name === 'AbortError';
        const errorMessage = error instanceof Error ? error.message : 'Payment failed';

        // 3. Timeout Path
        if (isTimeout) {
          dispatch(
            setTimeoutStatus({
              transaction: { ...baseTx, status: 'timeout' },
              errorMessage: 'Payment request timed out',
            })
          );
          return { success: false, timeout: true };
        }

        // 4. Failure Path
        dispatch(
          setFailure({
            transaction: { ...baseTx, status: 'failed', failureReason: errorMessage },
            errorMessage,
          })
        );
        return { success: false, timeout: false };
      }
    },
    [dispatch] 
  );

  return { processPayment };
}