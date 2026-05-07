'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <main className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center px-4">
      <div className="flex flex-col items-center gap-4 text-center max-w-sm">
        <p className="text-lg font-semibold text-[var(--text-primary)]">
          Something went wrong
        </p>
        <p className="text-sm text-[var(--text-muted)]">
          {error.message ?? 'An unexpected error occurred.'}
        </p>
        <button
          onClick={reset}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
        >
          Try again
        </button>
      </div>
    </main>
  );
}