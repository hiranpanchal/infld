"use client";

import { useCartStore } from "@/lib/cart";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";

export function CartDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { items, removeItem, updateQuantity, totalPence, clearCart } =
    useCartStore();
  const [{ isPending: paypalLoading }] = usePayPalScriptReducer();
  const [paypalError, setPaypalError] = useState<string | null>(null);
  const router = useRouter();

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
                        className="text-infld-white tracking-wide"
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: "0.95rem",
                        }}
                      >
                        {item.productName}
                      </p>
                      <p
                        className="text-infld-grey-light text-xs mt-0.5"
                        style={{ fontFamily: "var(--font-typewriter)" }}
                      >
                        Size: {item.size}
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item.productId, item.size)}
                      className="text-infld-grey-light hover:text-infld-yellow text-xs"
                      style={{ fontFamily: "var(--font-typewriter)" }}
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
                    <p
                      className="text-infld-white text-sm"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
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
          <div className="border-t border-infld-grey-mid p-4 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-label text-infld-grey-light">TOTAL</span>
              <span
                className="text-infld-white text-xl"
                style={{ fontFamily: "var(--font-body)" }}
              >
                &pound;{(totalPence() / 100).toFixed(2)}
              </span>
            </div>

            {paypalError && (
              <p
                className="text-red-400 text-xs text-center"
                style={{ fontFamily: "var(--font-typewriter)" }}
              >
                {paypalError}
              </p>
            )}

            {paypalLoading ? (
              <div
                className="text-infld-grey-light text-xs text-center py-4"
                style={{ fontFamily: "var(--font-typewriter)" }}
              >
                Loading payment options...
              </div>
            ) : (
              <PayPalButtons
                style={{
                  layout: "vertical",
                  shape: "rect",
                  color: "gold",
                  label: "pay",
                  height: 45,
                }}
                createOrder={async () => {
                  setPaypalError(null);
                  const res = await fetch("/api/checkout/paypal", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ action: "create", items }),
                  });
                  const data = await res.json();
                  if (!data.id) throw new Error("Order creation failed");
                  return data.id;
                }}
                onApprove={async (data) => {
                  setPaypalError(null);
                  const res = await fetch("/api/checkout/paypal", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      action: "capture",
                      orderID: data.orderID,
                      items,
                    }),
                  });
                  const result = await res.json();
                  if (result.success) {
                    clearCart();
                    onClose();
                    router.push(
                      `/checkout/success?order=${result.orderNumber}`
                    );
                  } else {
                    setPaypalError(
                      "Payment capture failed. Please contact support."
                    );
                  }
                }}
                onError={() => {
                  setPaypalError("Payment failed. Please try again.");
                }}
                onCancel={() => {
                  setPaypalError(null);
                }}
              />
            )}

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
