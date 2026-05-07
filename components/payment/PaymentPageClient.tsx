'use client';

import { useAppSelector } from '@/store/hooks';
import PaymentForm from './PaymentForm';
import StatusScreen from './StatusScreen';

export default function PaymentPageClient() {
    const status = useAppSelector((s) => s.payment.status);
    const showForm = status === 'idle' || status === 'processing';

    return (
        <section aria-label="Payment form">
            {showForm ? (
                <PaymentForm />
            ) : (
                <StatusScreen />
            )}
        </section>
    );
}