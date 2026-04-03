"use client";

import Link from "next/link";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { SafetyPin } from "@/components/doodles";

export default function CheckoutCancelledPage() {
  return (
    <>
      <Nav />
      <main className="min-h-screen bg-infld-black flex items-center justify-center px-4">
        <div className="max-w-lg text-center">
          <div className="flex items-center justify-center mb-6">
            <SafetyPin size={40} className="text-infld-grey-light" />
          </div>
          <h1
            className="text-display text-infld-white mb-4"
            style={{ fontSize: "clamp(2rem, 8vw, 4rem)" }}
          >
            CHECKOUT CANCELLED
          </h1>
          <p
            className="text-infld-grey-light mb-8"
            style={{ fontFamily: "var(--font-typewriter)", lineHeight: 1.8 }}
          >
            No worries. Your cart is still waiting.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/shop"
              className="inline-block bg-infld-yellow text-infld-black font-display text-lg tracking-widest px-8 py-3 border-3 border-infld-black shadow-[4px_4px_0_#0A0A0A] hover:shadow-[6px_6px_0_#0A0A0A] hover:-translate-x-0.5 hover:-translate-y-0.5 active:shadow-none active:translate-x-1 active:translate-y-1 transition-all duration-75"
              style={{ fontFamily: "var(--font-display)" }}
            >
              BACK TO SHOP
            </Link>
            <Link
              href="/"
              className="text-label text-infld-grey-light hover:text-infld-yellow transition-colors py-3"
            >
              &larr; HOME
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
