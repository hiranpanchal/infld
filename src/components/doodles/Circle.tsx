export function HandCircle({ className = "", size = 48 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M24 4c11 0 20 8.5 20 20s-9 20-20 20S4 35.5 4 24 13 4 24 4z" style={{ strokeDasharray: "3 2" }} />
    </svg>
  );
}
