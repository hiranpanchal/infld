"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { StarFilled, Lightning } from "@/components/doodles";
import { useEffect } from "react";
import { useCartStore } from "@/lib/cart";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const clearCart = useCartStore((s) => s.clearCart);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <>
      <div className="flex items-center justify-center gap-3 mb-6">
        <StarFilled size={24} className="text-infld-yellow" />
        <Lightning size={24} className="text-infld-yellow" />
        <StarFilled size={24} className="text-infld-yellow" />
      </div>
      <h1
        className="text-display text-infld-white mb-4"
        style={{ fontSize: "clamp(2.5rem, 10vw, 5rem)" }}
      >
        ORDER CONFIRMED
      </h1>
      <p
        className="text-infld-grey-light mb-2"
        style={{ fontFamily: "var(--font-typewriter)", lineHeight: 1.8 }}
      >
        Your order is in. We&apos;re on it.
      </p>
      <p
        className="text-infld-grey-mid text-sm mb-8"
        style={{ fontFamily: "var(--font-typewriter)" }}
      >
        A confirmation email is on its way.
      </p>
      {sessionId && (
        <p className="text-infld-grey-mid text-xs mb-8 break-all" style={{ fontFamily: "var(--font-body)" }}>
          Ref: {sessionId}
        </p>
      )}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/shop"
          className="inline-block bg-infld-yellow text-infld-black font-display text-lg tracking-widest px-8 py-3 border-3 border-infld-black shadow-[4px_4px_0_#0A0A0A] hover:shadow-[6px_6px_0_#0A0A0A] hover:-translate-x-0.5 hover:-translate-y-0.5 active:shadow-none active:translate-x-1 active:translate-y-1 transition-all duration-75"
          style={{ fontFamily: "var(--font-display)" }}
        >
          KEEP SHOPPING
        </Link>
        <Link
          href="/"
          className="text-label text-infld-grey-light hover:text-infld-yellow transition-colors py-3"
        >
          &larr; HOME
        </Link>
      </div>
    </>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <>
      <Nav />
      <main className="min-h-screen bg-infld-black flex items-center justify-center px-4">
        <div className="max-w-lg text-center">
          <Suspense fallback={<p className="text-infld-grey-light">Loading...</p>}>
            <SuccessContent />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
