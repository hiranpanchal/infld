"use client";

export function EmailForm({ buttonText = "NOTIFY ME" }: { buttonText?: string }) {
  return (
    <form
      className="flex flex-col sm:flex-row gap-3"
      onSubmit={(e) => e.preventDefault()}
    >
      <input
        type="email"
        placeholder="YOUR EMAIL"
        className="email-input flex-1 sm:text-center"
        required
        aria-label="Email address"
      />
      <button
        type="submit"
        className="bg-infld-yellow text-infld-black font-display text-lg tracking-widest px-6 py-3 border-3 border-infld-black shadow-[4px_4px_0_#0A0A0A] hover:shadow-[6px_6px_0_#0A0A0A] hover:-translate-x-0.5 hover:-translate-y-0.5 active:shadow-none active:translate-x-1 active:translate-y-1 transition-all duration-75"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {buttonText}
      </button>
    </form>
  );
}
