"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  category: string;
  badge: string | null;
  published: boolean;
  images: { url: string }[];
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/products")
      .then((r) => r.json())
      .then(setProducts)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl tracking-wider text-infld-white"
            style={{ fontFamily: "var(--font-display)" }}>
          PRODUCTS
        </h1>
        <Link
          href="/admin/products/new"
          className="bg-infld-yellow text-infld-black text-xs tracking-[0.15em] px-5 py-2.5 border-2 border-infld-black shadow-[3px_3px_0_#FFE600] hover:shadow-[5px_5px_0_#FFE600] hover:-translate-x-0.5 hover:-translate-y-0.5 active:shadow-none active:translate-x-1 active:translate-y-1 transition-all duration-75"
          style={{ fontFamily: "var(--font-display)" }}
        >
          + ADD PRODUCT
        </Link>
      </div>

      {loading ? (
        <p className="text-infld-grey-mid text-sm" style={{ fontFamily: "var(--font-typewriter)" }}>Loading...</p>
      ) : products.length === 0 ? (
        <p className="text-infld-grey-mid text-sm" style={{ fontFamily: "var(--font-typewriter)" }}>No products yet.</p>
      ) : (
        <div className="border-2 border-infld-grey-mid overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-infld-grey-mid bg-[#111]">
                <th className="text-left px-4 py-3 text-[10px] tracking-[0.2em] text-infld-grey-light font-normal"
                    style={{ fontFamily: "var(--font-typewriter)" }}>PRODUCT</th>
                <th className="text-left px-4 py-3 text-[10px] tracking-[0.2em] text-infld-grey-light font-normal"
                    style={{ fontFamily: "var(--font-typewriter)" }}>CATEGORY</th>
                <th className="text-right px-4 py-3 text-[10px] tracking-[0.2em] text-infld-grey-light font-normal"
                    style={{ fontFamily: "var(--font-typewriter)" }}>PRICE</th>
                <th className="text-center px-4 py-3 text-[10px] tracking-[0.2em] text-infld-grey-light font-normal"
                    style={{ fontFamily: "var(--font-typewriter)" }}>STATUS</th>
                <th className="text-right px-4 py-3 text-[10px] tracking-[0.2em] text-infld-grey-light font-normal"
                    style={{ fontFamily: "var(--font-typewriter)" }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-infld-grey-mid/50 hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3">
                    <span className="text-infld-white font-medium">{product.name}</span>
                    {product.badge && (
                      <span className="ml-2 bg-infld-yellow/10 text-infld-yellow text-[10px] tracking-wider px-2 py-0.5 border border-infld-yellow/30">
                        {product.badge}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-infld-grey-light text-xs tracking-wider uppercase">{product.category}</td>
                  <td className="px-4 py-3 text-right font-mono text-infld-white">
                    £{(product.price / 100).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-[10px] tracking-wider ${product.published ? "text-green-400" : "text-infld-grey-mid"}`}>
                      {product.published ? "LIVE" : "DRAFT"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-3">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="text-infld-yellow hover:text-infld-white text-xs tracking-wider transition-colors"
                    >
                      EDIT
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-400 hover:text-red-300 text-xs tracking-wider transition-colors"
                    >
                      DELETE
                    </button>
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
