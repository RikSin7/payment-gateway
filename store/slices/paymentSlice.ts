import { PaymentStatus, Transaction, PaymentPayload } from '@/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PaymentState {
  status: PaymentStatus;
  currentTransaction: Transaction | null;
  lastPayload: PaymentPayload | null;
  selectedTransaction: Transaction | null;
  transactions: Transaction[];
  retryCount: number;
  errorMessage: string | null;
}

const initialState: PaymentState = {
  status: 'idle',
  currentTransaction: null,
  lastPayload: null,
  selectedTransaction: null,
  transactions: [],
  retryCount: 0,
  errorMessage: null,
};

function upsertTransaction(transactions: Transaction[], incoming: Transaction) {
  const idx = transactions.findIndex(tx => tx.id === incoming.id);
  if (idx >= 0) {
    transactions[idx] = incoming;
  } else {
    transactions.unshift(incoming);
  }
}

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    setProcessing(state) {
      state.status = 'processing';
      state.errorMessage = null;
    },

    setLastPayload(state, action: PayloadAction<PaymentPayload>) {
      state.lastPayload = action.payload;
    },

    setSuccess(state, action: PayloadAction<Transaction>) {
      state.status = 'success';
      state.currentTransaction = action.payload;
      state.retryCount = action.payload.attempt;
      upsertTransaction(state.transactions, action.payload);
    },

    setFailure(state, action: PayloadAction<{ transaction: Transaction; errorMessage: string }>) {
      state.status = 'failed';
      state.currentTransaction = action.payload.transaction;
      state.errorMessage = action.payload.errorMessage;
      state.retryCount = action.payload.transaction.attempt;
      upsertTransaction(state.transactions, action.payload.transaction);
    },

    setTimeoutStatus(state, action: PayloadAction<{ transaction: Transaction; errorMessage: string }>) {
      state.status = 'timeout';
      state.currentTransaction = action.payload.transaction;
      state.errorMessage = action.payload.errorMessage;
      state.retryCount = action.payload.transaction.attempt;
      upsertTransaction(state.transactions, action.payload.transaction);
    },

    setSelectedTransaction(state, action: PayloadAction<Transaction | null>) {
      state.selectedTransaction = action.payload;
    },

    resetPaymentState(state) {
      state.status = 'idle';
      state.currentTransaction = null;
      state.lastPayload = null;
      state.selectedTransaction = null;
      state.retryCount = 0;
      state.errorMessage = null;
    },

    loadTransactions(state, action: PayloadAction<Transaction[]>) {
      state.transactions = action.payload;
    },
  },
});

export const {
  setProcessing,
  setLastPayload,
  setSuccess,
  setFailure,
  setTimeoutStatus,
  setSelectedTransaction,
  resetPaymentState,
  loadTransactions,
} = paymentSlice.actions;

export default paymentSlice.reducer;