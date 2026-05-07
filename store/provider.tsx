'use client';

import { useEffect, useRef } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { loadTransactions } from './slices/paymentSlice';
import { Transaction } from '@/types';

function StoreHydrator({ children }: { children: React.ReactNode }) {
  const hydrated = useRef(false);

  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;

    try {
      const raw = localStorage.getItem('txn_history');
      if (raw) {
        const transactions = JSON.parse(raw) as Transaction[];
        store.dispatch(loadTransactions(transactions));
      }
    } catch (error) {
      console.log("Error Occured during Local Storage Retrival : ", error);
    }
  }, []);

  return <>{children}</>;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <StoreHydrator>{children}</StoreHydrator>
    </Provider>
  );
}