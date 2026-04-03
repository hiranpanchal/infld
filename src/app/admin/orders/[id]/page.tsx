"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  customerEmail: string;
  customerName: string;
  shippingAddress: string;
  shippingCity: string;
  shippingPostcode: string;
  shippingCountry: string;
  totalPence: number;
  stripePaymentId: string | null;
  createdAt: string;
  items: { id: string; productName: string; size: string; quantity: number; pricePence: number }[];
}

const STATUSES = ["pending", "paid", "processing", "shipped", "delivered", "cancelled"];

export default function AdminOrderDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/orders/${id}`)
      .then((r) => r.json())
      .then(setOrder)
      .finally(() => setLoading(false));
  }, [id]);

  const updateStatus = async (status: string) => {
    setUpdating(true);
    const res = await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      const updated = await res.json();
      setOrder(updated);
    }
    setUpdating(false);
  };

  if (loading) return <p className="text-infld-grey-mid text-sm" style={{ fontFamily: "var(--font-typewriter)" }}>Loading...</p>;
  if (!order) return <p className="text-red-400 text-sm">Order not found.</p>;

  return (
    <div className="max-w-2xl">
      <Link href="/admin/orders"
            className="text-[10px] tracking-[0.2em] text-infld-grey-light hover:text-infld-yellow transition-colors"
            style={{ fontFamily: "var(--font-typewriter)" }}>
        &larr; BACK TO ORDERS
      </Link>

      <div className="mt-6 mb-8">
        <h1 className="text-3xl tracking-wider text-infld-white"
            style={{ fontFamily: "var(--font-display)" }}>
          {order.orderNumber}
        </h1>
        <p className="text-infld-grey-mid text-xs mt-1" style={{ fontFamily: "var(--font-typewriter)" }}>
          {new Date(order.createdAt).toLocaleString()}
        </p>
      </div>

      {/* Status */}
      <div className="border-2 border-infld-grey-mid p-5 mb-4">
        <label className="block text-[10px] tracking-[0.3em] text-infld-grey-light mb-3"
               style={{ fontFamily: "var(--font-typewriter)" }}>
          STATUS
        </label>
        <div className="flex gap-2 flex-wrap">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => updateStatus(s)}
              disabled={updating || order.status === s}
              className={`px-4 py-1.5 text-[10px] tracking-[0.15em] border-2 transition-all duration-100 ${
                order.status === s
                  ? "bg-infld-yellow text-infld-black border-infld-yellow"
                  : "bg-transparent text-infld-grey-light border-infld-grey-mid hover:border-infld-white hover:text-infld-white"
              } disabled:opacity-50`}
              style={{ fontFamily: "var(--font-typewriter)" }}
            >
              {s.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Customer */}
      <div className="border-2 border-infld-grey-mid p-5 mb-4">
        <h2 className="text-[10px] tracking-[0.3em] text-infld-grey-light mb-3"
            style={{ fontFamily: "var(--font-typewriter)" }}>
          CUSTOMER
        </h2>
        <p className="text-infld-white text-sm font-medium">{order.customerName}</p>
        <p className="text-infld-grey-light text-sm">{order.customerEmail}</p>
        <div className="mt-3 text-sm text-infld-grey-light" style={{ fontFamily: "var(--font-typewriter)" }}>
          <p>{order.shippingAddress}</p>
          <p>{order.shippingCity}, {order.shippingPostcode}</p>
          <p>{order.shippingCountry}</p>
        </div>
        {order.stripePaymentId && (
          <p className="text-[10px] text-infld-grey-mid mt-3 font-mono">Stripe: {order.stripePaymentId}</p>
        )}
      </div>

      {/* Items */}
      <div className="border-2 border-infld-grey-mid overflow-hidden mb-4">
        <div className="px-5 pt-4 pb-2">
          <h2 className="text-[10px] tracking-[0.3em] text-infld-grey-light"
              style={{ fontFamily: "var(--font-typewriter)" }}>
            ITEMS
          </h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-y-2 border-infld-grey-mid bg-[#111]">
              <th className="text-left px-5 py-2 text-[10px] tracking-[0.2em] text-infld-grey-light font-normal"
                  style={{ fontFamily: "var(--font-typewriter)" }}>PRODUCT</th>
              <th className="text-left px-4 py-2 text-[10px] tracking-[0.2em] text-infld-grey-light font-normal"
                  style={{ fontFamily: "var(--font-typewriter)" }}>SIZE</th>
              <th className="text-right px-4 py-2 text-[10px] tracking-[0.2em] text-infld-grey-light font-normal"
                  style={{ fontFamily: "var(--font-typewriter)" }}>QTY</th>
              <th className="text-right px-5 py-2 text-[10px] tracking-[0.2em] text-infld-grey-light font-normal"
                  style={{ fontFamily: "var(--font-typewriter)" }}>PRICE</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id} className="border-b border-infld-grey-mid/50">
                <td className="px-5 py-3 text-infld-white">{item.productName}</td>
                <td className="px-4 py-3 text-infld-grey-light">{item.size}</td>
                <td className="px-4 py-3 text-right text-infld-grey-light">{item.quantity}</td>
                <td className="px-5 py-3 text-right font-mono text-infld-white">£{((item.pricePence * item.quantity) / 100).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="border-t-2 border-infld-grey-mid px-5 py-3 text-right">
          <span className="text-infld-grey-light text-xs tracking-wider mr-4"
                style={{ fontFamily: "var(--font-typewriter)" }}>TOTAL</span>
          <span className="text-infld-yellow font-bold text-lg font-mono">
            £{(order.totalPence / 100).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
