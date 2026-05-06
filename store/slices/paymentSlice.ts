import { PaymentStatus, Transaction } from '@/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PaymentState {
  status: PaymentStatus;
  currentTransaction: Transaction | null;
  transactions: Transaction[];
  retryCount: number;
  errorMessage: string | null;
}

const initialState: PaymentState = {
  status: 'idle',
  currentTransaction: null,
  transactions: [],
  retryCount: 0,
  errorMessage: null,
};

const paymentSlice = createSlice({
  name: 'payment',
  initialState,

  reducers: {
    setProcessing(state) {
      state.status = 'processing';
      state.errorMessage = null;
    },

    setSuccess(state, action: PayloadAction<Transaction>) {
      state.status = 'success';
      state.currentTransaction = action.payload;
      state.retryCount = action.payload.attempt;

      const existingIndex = state.transactions.findIndex(
        tx => tx.id === action.payload.id
      );

      if (existingIndex >= 0) {
        state.transactions[existingIndex] = action.payload;
      } else {
        state.transactions.unshift(action.payload);
      }
    },

    setFailure(
      state,
      action: PayloadAction<{
        transaction: Transaction;
        errorMessage: string;
      }>
    ) {
      state.status = 'failed';
      state.currentTransaction = action.payload.transaction;
      state.errorMessage = action.payload.errorMessage;
      state.retryCount = action.payload.transaction.attempt;

      const existingIndex = state.transactions.findIndex(
        tx => tx.id === action.payload.transaction.id
      );

      if (existingIndex >= 0) {
        state.transactions[existingIndex] =
          action.payload.transaction;
      } else {
        state.transactions.unshift(action.payload.transaction);
      }
    },

    setTimeoutStatus(
      state,
      action: PayloadAction<{
        transaction: Transaction;
        errorMessage: string;
      }>
    ) {
      state.status = 'timeout';
      state.currentTransaction = action.payload.transaction;
      state.errorMessage = action.payload.errorMessage;
      state.retryCount = action.payload.transaction.attempt;

      const existingIndex = state.transactions.findIndex(
        tx => tx.id === action.payload.transaction.id
      );

      if (existingIndex >= 0) {
        state.transactions[existingIndex] =
          action.payload.transaction;
      } else {
        state.transactions.unshift(action.payload.transaction);
      }
    },

    resetPaymentState(state) {
      state.status = 'idle';
      state.currentTransaction = null;
      state.retryCount = 0;
      state.errorMessage = null;
    },

    loadTransactions(
      state,
      action: PayloadAction<Transaction[]>
    ) {
      state.transactions = action.payload;
    },
  },
});

export const {
  setProcessing,
  setSuccess,
  setFailure,
  setTimeoutStatus,
  resetPaymentState,
  loadTransactions,
} = paymentSlice.actions;

export default paymentSlice.reducer;