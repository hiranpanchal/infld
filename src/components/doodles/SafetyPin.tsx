export function SafetyPin({ className = "", size = 32 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size * 1.5}
      viewBox="0 0 20 30"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M6 2v18a4 4 0 0 0 8 0V8" />
      <path d="M14 8V5a4 4 0 0 0-8 0" />
      <circle cx="14" cy="8" r="1.5" fill="currentColor" />
    </svg>
  );
}
