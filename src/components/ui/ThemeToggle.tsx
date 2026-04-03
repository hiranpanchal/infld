"use client";

import { useTheme } from "@/lib/theme";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isLight = theme === "light";

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${isLight ? "dark" : "light"} mode`}
      className="flex items-center gap-2 group"
    >
      {/* Sun icon */}
      <svg
        width="13" height="13" viewBox="0 0 24 24" fill="none"
        className={`transition-opacity duration-200 ${isLight ? "opacity-100 text-infld-black" : "opacity-30 text-infld-grey-light"}`}
        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
      >
        <circle cx="12" cy="12" r="4" />
        <line x1="12" y1="2" x2="12" y2="5" />
        <line x1="12" y1="19" x2="12" y2="22" />
        <line x1="2" y1="12" x2="5" y2="12" />
        <line x1="19" y1="12" x2="22" y2="12" />
        <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" />
        <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" />
        <line x1="19.78" y1="4.22" x2="17.66" y2="6.34" />
        <line x1="6.34" y1="17.66" x2="4.22" y2="19.78" />
      </svg>

      {/* Track */}
      <div
        className={`relative w-10 h-5 border-2 transition-colors duration-200 ${
          isLight
            ? "bg-infld-yellow border-infld-yellow"
            : "bg-transparent border-infld-grey-mid group-hover:border-infld-grey-light"
        }`}
      >
        {/* Thumb — square, slides left/right */}
        <div
          className={`absolute top-[1px] w-3.5 h-3.5 transition-all duration-200 ${
            isLight
              ? "translate-x-[18px] bg-infld-black"
              : "translate-x-[1px] bg-infld-grey-light group-hover:bg-infld-white"
          }`}
        />
      </div>

      {/* Moon icon */}
      <svg
        width="11" height="11" viewBox="0 0 24 24" fill="none"
        className={`transition-opacity duration-200 ${!isLight ? "opacity-100 text-infld-white" : "opacity-30 text-infld-grey-light"}`}
        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    </button>
  );
}
