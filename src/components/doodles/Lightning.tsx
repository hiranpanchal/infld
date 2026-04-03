export function Lightning({ className = "", size = 24 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 32"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M14 0L4 18h6L8 32l12-20h-7L14 0z" />
    </svg>
  );
}
