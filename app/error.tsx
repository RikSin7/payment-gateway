'use client';
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return <div>Error occurred. <button onClick={reset}>Try again</button></div>;
}
