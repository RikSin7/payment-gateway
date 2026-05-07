'use client';

import { useEffect, useRef } from 'react';
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { resetPaymentState } from '@/store/slices/paymentSlice';
import { formatCurrency, formatTimestamp } from '@/utils/formatters';
import RetryTracker from './RetryTracker';
import { cn } from '@/utils/cn';

export default function StatusScreen() {
  const dispatch = useAppDispatch();
  const { status, currentTransaction, errorMessage } = useAppSelector((s) => s.payment);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status !== 'idle' && status !== 'processing') {
      containerRef.current?.focus();
    }
  }, [status]);

  if (status === 'idle' || status === 'processing') return null;

  const handleNewPayment = () => dispatch(resetPaymentState());

  const config = {
    success: {
      icon: <CheckCircle2 className="w-10 h-10" />,
      title: 'Payment Successful',
      subtitle: 'Your transaction was completed.',
      iconBg: 'bg-success/10 text-success',
      border: 'border-success/30',
    },
    failed: {
      icon: <XCircle className="w-10 h-10" />,
      title: 'Payment Failed',
      subtitle: errorMessage ?? 'Your payment could not be processed.',
      iconBg: 'bg-error/10 text-error',
      border: 'border-error/30',
    },
    timeout: {
      icon: <AlertTriangle className="w-10 h-10" />,
      title: 'Request Timed Out',
      subtitle: 'The payment gateway did not respond in time.',
      iconBg: 'bg-warning/10 text-warning',
      border: 'border-warning/30',
    },
  }[status];

  const canRetry = status === 'failed' || status === 'timeout';

  return (
    <div
      ref={containerRef}
      tabIndex={-1}
      role="status"
      aria-live="polite"
      className={cn(
        'w-full max-w-md mx-auto rounded-xl border p-8',
        'flex flex-col items-center gap-5',
        'bg-bg-surface focus:outline-none',
        config.border
      )}
    >
      <div className={cn(
        'w-16 h-16 rounded-full flex items-center justify-center',
        config.iconBg,
      )}>
        {config.icon}
      </div>

      <div className="text-center">
        <h2 className="text-xl font-bold text-text-primary">
          {config.title}
        </h2>
        <p className="text-sm text-text-secondary mt-1 min-h-10">
          {config.subtitle}
        </p>
      </div>

      {currentTransaction && (
        <div className="w-full bg-bg-primary border border-scrollbar-thumb/10 rounded-lg p-5 space-y-3 text-sm">
          <Row label="Amount" value={formatCurrency(currentTransaction.amount, currentTransaction.currency)} />
          <Row label="Card" value={currentTransaction.maskedCard} mono />
          <Row label="Time" value={formatTimestamp(currentTransaction.timestamp)} />
          <div className="pt-3 mt-3 border-t border-scrollbar-thumb/20">
            <Row label="ID" value={currentTransaction.id} mono />
          </div>
        </div>
      )}

      <div className="w-full mt-2">
        {canRetry ? (
          <RetryTracker />
        ) : (
          <button
            onClick={handleNewPayment}
            className="w-full cursor-pointer py-3 rounded-lg bg-accent hover:bg-accent-hover text-accent-text text-sm font-bold transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-accent/50 focus-visible:ring-offset-1 focus-visible:ring-offset-bg-surface"
          >
            Make Another Payment
          </button>
        )}
      </div>
    </div>
  );
}

function Row({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-text-secondary shrink-0">{label}</span>
      <span className={`text-text-primary text-right break-all ${mono ? 'font-mono text-xs' : 'font-medium'}`}>
        {value}
      </span>
    </div>
  );
}