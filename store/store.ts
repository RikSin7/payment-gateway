import { configureStore, Middleware } from '@reduxjs/toolkit';
import paymentReducer from './slices/paymentSlice';
import { Transaction } from '@/types';

const localStorageMiddleware: Middleware = (storeAPI) => (next) => (action) => {
  const result = next(action);
  try {
    const transactions: Transaction[] = storeAPI.getState().payment.transactions;
    localStorage.setItem('txn_history', JSON.stringify(transactions));
  } catch {
    console.log("Local Storage error")
  }
  return result;
};

export const store = configureStore({
  reducer: {
    payment: paymentReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(localStorageMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;