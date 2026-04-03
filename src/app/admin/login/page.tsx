"use client";

import { Suspense } from "react";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password.");
    } else {
      router.push(callbackUrl);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-500/10 border-2 border-red-500/30 px-4 py-2">
          <p className="text-red-400 text-xs tracking-wider text-center"
             style={{ fontFamily: "var(--font-typewriter)" }}>
            {error}
          </p>
        </div>
      )}
      <div>
        <label className="block text-[10px] tracking-[0.3em] text-infld-grey-light mb-2"
               style={{ fontFamily: "var(--font-typewriter)" }}>
          EMAIL
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-[#111] border-2 border-infld-grey-mid text-infld-white px-4 py-3 text-sm focus:border-infld-yellow focus:outline-none transition-colors"
          style={{ fontFamily: "var(--font-typewriter)" }}
          required
        />
      </div>
      <div>
        <label className="block text-[10px] tracking-[0.3em] text-infld-grey-light mb-2"
               style={{ fontFamily: "var(--font-typewriter)" }}>
          PASSWORD
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-[#111] border-2 border-infld-grey-mid text-infld-white px-4 py-3 text-sm focus:border-infld-yellow focus:outline-none transition-colors"
          style={{ fontFamily: "var(--font-typewriter)" }}
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-infld-yellow text-infld-black text-lg tracking-[0.2em] py-3 border-2 border-infld-black shadow-[4px_4px_0_#FFE600] hover:shadow-[6px_6px_0_#FFE600] hover:-translate-x-0.5 hover:-translate-y-0.5 active:shadow-none active:translate-x-1 active:translate-y-1 transition-all duration-75 disabled:opacity-50"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {loading ? "..." : "LOG IN"}
      </button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-infld-black flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-[0.03]"
           style={{
             backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'300\' height=\'300\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.75\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'300\' height=\'300\' filter=\'url(%23n)\' opacity=\'0.5\'/%3E%3C/svg%3E")',
           }}
      />

      <div className="w-full max-w-sm relative z-10">
        {/* Logo */}
        <div className="text-center mb-10">
          <h1
            className="text-infld-yellow mb-1"
            style={{ fontFamily: "var(--font-display)", fontSize: "4rem", letterSpacing: "0.1em" }}
          >
            INFLD
          </h1>
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-12 bg-infld-grey-mid" />
            <p className="text-[10px] tracking-[0.4em] text-infld-grey-light"
               style={{ fontFamily: "var(--font-typewriter)" }}>
              BACK OFFICE
            </p>
            <div className="h-px w-12 bg-infld-grey-mid" />
          </div>
        </div>

        {/* Form card */}
        <div className="border-2 border-infld-grey-mid p-6 bg-infld-black/80">
          <Suspense fallback={
            <div className="text-infld-grey-light text-center text-xs"
                 style={{ fontFamily: "var(--font-typewriter)" }}>
              Loading...
            </div>
          }>
            <LoginForm />
          </Suspense>
        </div>

        <p className="text-center text-infld-grey-mid text-[10px] mt-6 tracking-[0.2em]"
           style={{ fontFamily: "var(--font-typewriter)" }}>
          ADMIN ACCESS ONLY
        </p>
      </div>
    </div>
  );
}
