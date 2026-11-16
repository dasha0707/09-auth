'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div role="alert">
      <p>Could not fetch the list of notes. {error.message}</p>
      <button type="button" onClick={reset}>Try again</button>
    </div>
  );
}
