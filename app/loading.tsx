export default function Loading() {
  return (
    <main className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-[var(--text-muted)] border-t-blue-500 rounded-full animate-spin" />
        <p className="text-sm text-[var(--text-muted)]">Loading...</p>
      </div>
    </main>
  );
}