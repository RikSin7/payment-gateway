'use client';

import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setSelectedTransaction } from '@/store/slices/paymentSlice';
import { Transaction } from '@/types';
import HistoryItem from './HistoryItem';

export default function TransactionHistory() {
  const dispatch = useAppDispatch();
  const { transactions, selectedTransaction } = useAppSelector((s) => s.payment);

  const handleSelect = (tx: Transaction) => {
    // Toggle — clicking same row closes the detail view
    const isSame = selectedTransaction?.id === tx.id && selectedTransaction?.attempt === tx.attempt;
    dispatch(setSelectedTransaction(isSame ? null : tx));
  };

  if (transactions.length === 0) {
    return (
      <div className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-8 flex flex-col items-center gap-2">
        <p className="text-sm font-medium text-[var(--text-primary)]">No transactions yet</p>
        <p className="text-xs text-[var(--text-muted)] text-center">
          Your payment history will appear here after your first transaction.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-sm font-semibold text-[var(--text-primary)]">
          Transaction History
        </h2>
        <span className="text-xs text-[var(--text-muted)]">
          {transactions.length} {transactions.length === 1 ? 'record' : 'records'}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {transactions.map((tx) => {
          const isSelected =
            selectedTransaction?.id === tx.id &&
            selectedTransaction?.attempt === tx.attempt;

          return (
            <HistoryItem
              key={`${tx.id}-${tx.attempt}`}
              transaction={tx}
              isSelected={isSelected}
              onClick={() => handleSelect(tx)}
            />
          );
        })}
      </div>
    </div>
  );
}