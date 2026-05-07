'use client';

import { Transaction } from '@/types';
import { formatCurrency, formatTimestamp } from '@/utils/formatters';

interface HistoryItemProps {
  transaction: Transaction;
  isSelected: boolean;
  onClick: () => void;
}

const statusConfig = {
  success: {
    label: 'Success',
    dot: 'bg-green-500',
    badge: 'bg-green-100 text-green-700',
    border: 'border-green-200',
  },
  failed: {
    label: 'Failed',
    dot: 'bg-red-500',
    badge: 'bg-red-100 text-red-700',
    border: 'border-red-200',
  },
  timeout: {
    label: 'Timeout',
    dot: 'bg-amber-500',
    badge: 'bg-amber-100 text-amber-700',
    border: 'border-amber-200',
  },
};

export default function HistoryItem({ transaction, isSelected, onClick }: HistoryItemProps) {
  const config = statusConfig[transaction.status];

  return (
    <div
      role="button"
      tabIndex={0}
      aria-expanded={isSelected}
      aria-label={`Transaction ${transaction.id}, ${transaction.status}, ${formatCurrency(transaction.amount, transaction.currency)}`}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      className={`
        w-full rounded-lg border p-4 cursor-pointer
        bg-[var(--bg-surface)] hover:bg-[var(--bg-glass-hover)]
        transition-all duration-200 text-left
        focus:outline-none focus:ring-2 focus:ring-blue-500
        ${isSelected ? config.border : 'border-[var(--border-subtle)]'}
      `}
    >
      {/* Top row */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 min-w-0">
          {/* Status dot */}
          <span className={`w-2 h-2 rounded-full shrink-0 ${config.dot}`} />

          {/* Transaction ID */}
          <span className="font-mono text-xs text-[var(--text-muted)] truncate">
            {transaction.id}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Amount */}
          <span className="text-sm font-semibold text-[var(--text-primary)]">
            {formatCurrency(transaction.amount, transaction.currency)}
          </span>

          {/* Status badge */}
          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${config.badge}`}>
            {config.label}
          </span>
        </div>
      </div>

      {/* Second row — card + timestamp */}
      <div className="flex items-center justify-between mt-2">
        <span className="font-mono text-xs text-[var(--text-muted)]">
          {transaction.maskedCard}
        </span>
        <span className="text-xs text-[var(--text-muted)]">
          {formatTimestamp(transaction.timestamp)}
        </span>
      </div>

      {/* Expanded detail panel */}
      {isSelected && (
        <div className="mt-4 pt-4 border-t border-[var(--border-subtle)] space-y-2 text-xs">
          <DetailRow label="Full ID" value={transaction.id} mono />
          <DetailRow label="Attempt" value={`${transaction.attempt} of 3`} />
          <DetailRow label="Status" value={config.label} />
          {transaction.failureReason && (
            <DetailRow label="Failure reason" value={transaction.failureReason} />
          )}
          <DetailRow label="Card" value={transaction.maskedCard} mono />
          <DetailRow label="Amount" value={formatCurrency(transaction.amount, transaction.currency)} />
          <DetailRow label="Timestamp" value={formatTimestamp(transaction.timestamp)} />
        </div>
      )}
    </div>
  );
}

function DetailRow({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-[var(--text-muted)] shrink-0">{label}</span>
      <span className={`text-[var(--text-primary)] text-right break-all ${mono ? 'font-mono' : ''}`}>
        {value}
      </span>
    </div>
  );
}