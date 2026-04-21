export default function LoadingSpinner({ className = 'h-8 w-8' }: { className?: string }) {
  return (
    <div
      className={`${className} animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600`}
      aria-label="Loading"
      role="status"
    />
  );
}