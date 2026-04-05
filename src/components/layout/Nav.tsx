"use client";

import Link from "next/link";
import { useState } from "react";
import { TickerTape } from "./TickerTape";
import { CartDrawer } from "@/components/ui/CartDrawer";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useCartStore } from "@/lib/cart";

const NAV_LINKS = [
  { href: "/", label: "HOME" },
  { href: "/shop", label: "SHOP" },
  { href: "/about", label: "ABOUT" },
  { href: "/lookbook", label: "LOOKBOOK" },
];

export function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const totalItems = useCartStore((s) => s.totalItems);

  return (
    <>
      <nav className="bg-infld-black border-b border-infld-grey-mid sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              href="/"
              className="font-display text-3xl tracking-wider text-infld-white hover:text-infld-yellow transition-colors"
              style={{ fontFamily: "var(--font-display)" }}
            >
              INFLD
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-label text-infld-grey-light hover:text-infld-white transition-colors relative"
                >
                  {link.label}
                </Link>
              ))}

              {/* Cart button */}
              <button
                onClick={() => setCartOpen(true)}
                className="text-label text-infld-grey-light hover:text-infld-yellow transition-colors relative"
                aria-label="Open cart"
              >
                CART
                {totalItems() > 0 && (
                  <span className="absolute -top-2 -right-4 bg-infld-yellow text-infld-black text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {totalItems()}
                  </span>
                )}
              </button>

              <ThemeToggle />
            </div>

            {/* Mobile: cart + hamburger */}
            <div className="md:hidden flex items-center gap-4">
              <button
                onClick={() => setCartOpen(true)}
                className="text-label text-infld-grey-light hover:text-infld-yellow transition-colors relative"
                aria-label="Open cart"
              >
                CART
                {totalItems() > 0 && (
                  <span className="absolute -top-2 -right-4 bg-infld-yellow text-infld-black text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {totalItems()}
                  </span>
                )}
              </button>

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex flex-col gap-1.5 p-2"
                aria-label="Toggle menu"
                aria-expanded={isOpen}
              >
                <span
                  className={`block w-6 h-0.5 bg-infld-white transition-transform ${
                    isOpen ? "rotate-45 translate-y-2" : ""
                  }`}
                  style={{ transformOrigin: "center" }}
                />
                <span
                  className={`block w-5 h-0.5 bg-infld-white transition-opacity ${
                    isOpen ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`block w-6 h-0.5 bg-infld-white transition-transform ${
                    isOpen ? "-rotate-45 -translate-y-2" : ""
                  }`}
                  style={{ transformOrigin: "center" }}
                />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-infld-black z-40 flex flex-col items-center justify-center gap-8 md:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-display text-infld-white hover:text-infld-yellow transition-colors"
              style={{ fontSize: "clamp(3rem, 12vw, 6rem)" }}
            >
              {link.label}
            </Link>
          ))}
          <ThemeToggle />
        </div>
      )}

      <TickerTape />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
