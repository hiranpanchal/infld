import { getOrderStats } from "@/lib/data";
import { prisma } from "@/lib/db";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const stats = await getOrderStats();
  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });
  const productCount = await prisma.product.count();

  return (
    <div>
      <h1 className="text-3xl tracking-wider text-infld-white mb-8"
          style={{ fontFamily: "var(--font-display)" }}>
        DASHBOARD
      </h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: "TOTAL ORDERS", value: stats.total, accent: false },
          { label: "PENDING", value: stats.pending, accent: false },
          { label: "PROCESSING", value: stats.processing, accent: false },
          { label: "REVENUE", value: `£${(stats.revenuePence / 100).toFixed(2)}`, accent: true },
          { label: "PRODUCTS", value: productCount, accent: false },
          { label: "PAID", value: stats.paid, accent: false },
          { label: "SHIPPED", value: stats.shipped, accent: false },
          { label: "DELIVERED", value: stats.delivered, accent: false },
        ].map((stat) => (
          <div key={stat.label} className={`border-2 ${stat.accent ? "border-infld-yellow bg-infld-yellow/5" : "border-infld-grey-mid bg-[#111]"} p-4`}>
            <p className="text-[10px] tracking-[0.2em] text-infld-grey-light mb-2"
               style={{ fontFamily: "var(--font-typewriter)" }}>
              {stat.label}
            </p>
            <p className={`text-2xl font-bold ${stat.accent ? "text-infld-yellow" : "text-infld-white"}`}
               style={{ fontFamily: "var(--font-display)" }}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg tracking-wider text-infld-white"
            style={{ fontFamily: "var(--font-display)" }}>
          RECENT ORDERS
        </h2>
        <Link href="/admin/orders"
              className="text-[10px] tracking-[0.2em] text-infld-grey-light hover:text-infld-yellow transition-colors"
              style={{ fontFamily: "var(--font-typewriter)" }}>
          VIEW ALL &rarr;
        </Link>
      </div>
      {recentOrders.length === 0 ? (
        <p className="text-infld-grey-mid text-sm" style={{ fontFamily: "var(--font-typewriter)" }}>
          No orders yet.
        </p>
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
                    style={{ fontFamily: "var(--font-typewriter)" }}>STATUS</th>
                <th className="text-right px-4 py-3 text-[10px] tracking-[0.2em] text-infld-grey-light font-normal"
                    style={{ fontFamily: "var(--font-typewriter)" }}>TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-infld-grey-mid/50 hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-infld-grey-light">{order.orderNumber}</td>
                  <td className="px-4 py-3 text-infld-white text-sm">{order.customerName || order.customerEmail}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 text-[10px] tracking-wider border ${
                      order.status === "paid" ? "border-green-500/50 text-green-400 bg-green-500/10" :
                      order.status === "shipped" ? "border-blue-500/50 text-blue-400 bg-blue-500/10" :
                      order.status === "processing" ? "border-infld-yellow/50 text-infld-yellow bg-infld-yellow/10" :
                      order.status === "delivered" ? "border-purple-500/50 text-purple-400 bg-purple-500/10" :
                      "border-infld-grey-mid text-infld-grey-light bg-white/5"
                    }`}>
                      {order.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-infld-white">
                    £{(order.totalPence / 100).toFixed(2)}
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
