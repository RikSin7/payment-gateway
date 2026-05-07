'use client';

import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { resetPaymentState } from '@/store/slices/paymentSlice';
import { usePaymentFlow } from '@/hooks/usePaymentFlow';
import { cn } from '@/utils/cn';

const MAX_RETRIES = 3;

export default function RetryTracker() {
  const dispatch = useAppDispatch();
  const { processPayment } = usePaymentFlow();
  const { retryCount, lastPayload } = useAppSelector((s) => s.payment);

  const attemptsUsed = retryCount;
  const attemptsLeft = MAX_RETRIES - attemptsUsed;
  const isExhausted = attemptsLeft <= 0;

  const handleRetry = async () => {
    if (!lastPayload || isExhausted) return;
    await processPayment({ payload: lastPayload, attempt: attemptsUsed + 1 });
  };

  const handleNewPayment = () => dispatch(resetPaymentState());

  if (isExhausted) {
    return (
      <div className="w-full flex flex-col items-center gap-3 mt-4">
        <p className="text-sm text-red-500 font-medium text-center">Maximum retry attempts reached.</p>
        <p className="text-xs text-text-secondary text-center">Please try a different card or contact your bank.</p>
        <button
          onClick={handleNewPayment}
          className="w-full py-2.5 mt-2 rounded-lg border border-scrollbar-thumb/50 text-text-primary text-sm font-medium hover:bg-bg-primary transition-colors"
        >
          Start New Payment
        </button>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-3 mt-4">
      <div className="flex items-center justify-between text-xs text-text-secondary">
        <span>Attempt {attemptsUsed} of {MAX_RETRIES}</span>
        <span className={attemptsLeft === 1 ? 'text-red-500 font-bold' : 'text-text-secondary'}>
          {attemptsLeft} {attemptsLeft === 1 ? 'attempt' : 'attempts'} remaining
        </span>
      </div>

      {/* Visual Progress Dots */}
      <div className="flex gap-1.5">
        {Array.from({ length: MAX_RETRIES }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'h-1.5 flex-1 rounded-full transition-colors',
              i < attemptsUsed ? 'bg-red-400' : 'bg-[var(--border-subtle)]'
            )}
          />
        ))}
      </div>

      <button
        onClick={handleRetry}
        className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
      >
        Retry Payment
      </button>

      <button
        onClick={handleNewPayment}
        className="w-full py-2 text-xs text-text-secondary hover:text-text-primary transition-colors"
      >
        Cancel and start over
      </button>
    </div>
  );
}