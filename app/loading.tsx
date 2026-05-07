export default function Loading() {
  return (
    <main className="min-h-screen bg-bg-primary flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-text-muted border-t-blue-500 rounded-full animate-spin" />
        <p className="text-sm text-text-muted">Loading...</p>
      </div>
    </main>
  );
}