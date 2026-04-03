"use client";

import { useCartStore } from "@/lib/cart";
import { useState } from "react";

export function CartDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { items, removeItem, updateQuantity, totalPence, clearCart } =
    useCartStore();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (items.length === 0) return;
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      alert("Checkout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-infld-black border-l-2 border-infld-grey-mid z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-infld-grey-mid">
          <h2
            className="text-infld-white text-xl tracking-wider"
            style={{ fontFamily: "var(--font-display)" }}
          >
            YOUR CART
          </h2>
          <button
            onClick={onClose}
            className="text-infld-grey-light hover:text-infld-white text-2xl"
            aria-label="Close cart"
          >
            &times;
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <p
                className="text-infld-grey-light"
                style={{ fontFamily: "var(--font-typewriter)" }}
              >
                Nothing here yet.
              </p>
              <p className="text-infld-grey-mid text-xs mt-2">
                Go make some noise.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.size}`}
                  className="border border-infld-grey-mid p-3"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p
                        className="text-infld-white text-sm font-bold"
                        style={{ fontFamily: "var(--font-heading)" }}
                      >
                        {item.productName}
                      </p>
                      <p className="text-infld-grey-light text-xs">
                        Size: {item.size}
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item.productId, item.size)}
                      className="text-infld-grey-light hover:text-infld-yellow text-xs"
                    >
                      REMOVE
                    </button>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.productId,
                            item.size,
                            item.quantity - 1
                          )
                        }
                        className="w-7 h-7 border border-infld-grey-mid text-infld-grey-light hover:text-infld-white text-sm"
                      >
                        -
                      </button>
                      <span className="text-infld-white text-sm w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.productId,
                            item.size,
                            item.quantity + 1
                          )
                        }
                        className="w-7 h-7 border border-infld-grey-mid text-infld-grey-light hover:text-infld-white text-sm"
                      >
                        +
                      </button>
                    </div>
                    <p className="text-infld-white text-sm font-bold">
                      &pound;{((item.price * item.quantity) / 100).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-infld-grey-mid p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-label text-infld-grey-light">TOTAL</span>
              <span
                className="text-infld-white text-xl font-bold"
                style={{ fontFamily: "var(--font-body)" }}
              >
                &pound;{(totalPence() / 100).toFixed(2)}
              </span>
            </div>
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-infld-yellow text-infld-black font-display text-lg tracking-widest py-3 border-3 border-infld-black shadow-[4px_4px_0_#0A0A0A] hover:shadow-[6px_6px_0_#0A0A0A] hover:-translate-x-0.5 hover:-translate-y-0.5 active:shadow-none active:translate-x-1 active:translate-y-1 transition-all duration-75 disabled:opacity-50"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {loading ? "PROCESSING..." : "CHECKOUT"}
            </button>
            <button
              onClick={clearCart}
              className="w-full text-label text-infld-grey-light hover:text-infld-yellow transition-colors py-2"
            >
              CLEAR CART
            </button>
          </div>
        )}
      </div>
    </>
  );
}
