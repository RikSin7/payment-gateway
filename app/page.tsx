import TransactionHistory from '@/components/history/TransactionHistory';
import PaymentPageClient from '@/components/payment/PaymentPageClient';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export const metadata = {
  title: 'Payment Gateway',
  description: 'Secure payment processing',
};

export default function Page() {
  return (
    <main className="min-h-screen bg-bg-primary text-text-primary transition-colors duration-300 py-10 px-4">
      <div className="max-w-5xl mx-auto flex flex-col gap-10">

        {/* Header with Theme Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex-1" />
          <div className="text-center flex-1">
            <h1 className="text-2xl font-semibold text-text-primary sm:w-auto w-60">
              Payment Gateway
            </h1>
            <p className="text-sm text-text-muted mt-1">
              Secure, simulated payment processing
            </p>
          </div>
          <div className="flex-1 flex justify-end">
            <ThemeToggle />
          </div>
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