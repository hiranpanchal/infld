"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  customerEmail: string;
  customerName: string;
  totalPence: number;
  createdAt: string;
  items: { id: string; productName: string; size: string; quantity: number; pricePence: number }[];
}

const STATUSES = ["all", "pending", "paid", "processing", "shipped", "delivered", "cancelled"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const url = filter === "all" ? "/api/admin/orders" : `/api/admin/orders?status=${filter}`;
    setLoading(true);
    fetch(url)
      .then((r) => r.json())
      .then(setOrders)
      .finally(() => setLoading(false));
  }, [filter]);

  return (
    <div>
      <h1 className="text-3xl tracking-wider text-infld-white mb-8"
          style={{ fontFamily: "var(--font-display)" }}>
        ORDERS
      </h1>

      {/* Filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-1.5 text-[10px] tracking-[0.15em] border-2 transition-all duration-100 ${
              filter === s
                ? "bg-infld-yellow text-infld-black border-infld-yellow"
                : "bg-transparent text-infld-grey-light border-infld-grey-mid hover:border-infld-white hover:text-infld-white"
            }`}
            style={{ fontFamily: "var(--font-typewriter)" }}
          >
            {s.toUpperCase()}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-infld-grey-mid text-sm" style={{ fontFamily: "var(--font-typewriter)" }}>Loading...</p>
      ) : orders.length === 0 ? (
        <p className="text-infld-grey-mid text-sm" style={{ fontFamily: "var(--font-typewriter)" }}>No orders found.</p>
      ) : (
        <div className="border-2 border-infld-grey-mid overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-infld-grey-mid bg-[#111]">
                <th className="text-left px-4 py-3 text-[10px] tracking-[0.2em] text-infld-grey-light font-normal"
                    style={{ fontFamily: "var(--font-typewriter)" }}>ORDER</th>
                <th className="text-left px-4 py-3 text-[10px] tracking-[0.2em] text-infld-grey-light font-normal"
                    style={{ fontFamily: "var(--font-typewriter)" }}>CUSTOMER</th>
                <th className="text-left px-4 py-3 text-[10px] tracking-[0.2em] text-infld-grey-light font-normal"
                    style={{ fontFamily: "var(--font-typewriter)" }}>ITEMS</th>
                <th className="text-left px-4 py-3 text-[10px] tracking-[0.2em] text-infld-grey-light font-normal"
                    style={{ fontFamily: "var(--font-typewriter)" }}>STATUS</th>
                <th className="text-right px-4 py-3 text-[10px] tracking-[0.2em] text-infld-grey-light font-normal"
                    style={{ fontFamily: "var(--font-typewriter)" }}>TOTAL</th>
                <th className="text-right px-4 py-3 text-[10px] tracking-[0.2em] text-infld-grey-light font-normal"
                    style={{ fontFamily: "var(--font-typewriter)" }}>DATE</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-infld-grey-mid/50 hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-infld-grey-light">{order.orderNumber}</td>
                  <td className="px-4 py-3 text-infld-white">{order.customerName || order.customerEmail}</td>
                  <td className="px-4 py-3 text-infld-grey-light">{order.items.length} item(s)</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 text-[10px] tracking-wider border ${
                      order.status === "paid" ? "border-green-500/50 text-green-400 bg-green-500/10" :
                      order.status === "shipped" ? "border-blue-500/50 text-blue-400 bg-blue-500/10" :
                      order.status === "processing" ? "border-infld-yellow/50 text-infld-yellow bg-infld-yellow/10" :
                      order.status === "delivered" ? "border-purple-500/50 text-purple-400 bg-purple-500/10" :
                      order.status === "cancelled" ? "border-red-500/50 text-red-400 bg-red-500/10" :
                      "border-infld-grey-mid text-infld-grey-light bg-white/5"
                    }`}>
                      {order.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-infld-white">£{(order.totalPence / 100).toFixed(2)}</td>
                  <td className="px-4 py-3 text-right text-infld-grey-mid text-xs">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/orders/${order.id}`}
                          className="text-infld-yellow hover:text-infld-white text-xs tracking-wider transition-colors">
                      VIEW
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
