import TransactionHistory from '@/components/history/TransactionHistory';
import PaymentPageClient from '@/components/payment/PaymentPageClient';

export const metadata = {
  title: 'Payment Gateway',
  description: 'Secure payment processing',
};

export default function Page() {
  return (
    <main className="min-h-screen bg-[var(--bg-primary)] py-10 px-4">
      <div className="max-w-5xl mx-auto flex flex-col gap-10">

        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-[var(--text-primary)]">
            Payment Gateway
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Secure, simulated payment processing
          </p>
        </div>

        {/* Main content */}
        <PaymentPageClient />

        {/* Transaction History — always visible below */}
        <section aria-label="Transaction history">
          <TransactionHistory />
        </section>

      </div>
    </main>
  );
}