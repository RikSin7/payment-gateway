import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center px-4">
      <div className="flex flex-col items-center gap-4 text-center">
        <p className="text-4xl font-semibold text-[var(--text-primary)]">404</p>
        <p className="text-sm text-[var(--text-muted)]">Page not found.</p>
        <Link
          href="/"
          className="px-4 py-2 rounded-lg border border-[var(--border-subtle)] text-sm text-[var(--text-primary)] hover:bg-[var(--bg-glass-hover)] transition-colors"
        >
          Back to payment
        </Link>
      </div>
    </main>
  );
}