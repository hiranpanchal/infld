"use client";

import { useState, useEffect } from "react";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/ui/ProductCard";
import { Lightning } from "@/components/doodles";

interface Product {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  price: number;
  category: string;
  badge: string | null;
  images: { url: string }[];
}

const FILTERS = [
  { key: "all", label: "ALL" },
  { key: "hoodies", label: "HOODIES" },
  { key: "tees", label: "TEES" },
  { key: "rebel-edition", label: "REBEL EDITION" },
];

export default function ShopPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/products?category=${activeFilter}`)
      .then((r) => r.json())
      .then(setProducts)
      .finally(() => setLoading(false));
  }, [activeFilter]);

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-infld-black">
        <div className="pt-16 pb-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="flex items-end gap-4">
            <h1 className="text-display text-infld-white" style={{ fontSize: "clamp(3rem, 12vw, 8rem)" }}>
              SHOP ALL
            </h1>
            <Lightning size={32} className="text-infld-yellow mb-4" />
          </div>
        </div>

        <div className="border-y border-infld-grey-mid px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto flex gap-2 py-3 overflow-x-auto">
            {FILTERS.map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`text-label px-4 py-2 border-2 whitespace-nowrap transition-all duration-100 ${
                  activeFilter === filter.key
                    ? "bg-infld-white text-infld-black border-infld-white"
                    : "bg-transparent text-infld-grey-light border-infld-grey-mid hover:bg-infld-white hover:text-infld-black hover:border-infld-white"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {loading ? (
            <p className="text-infld-grey-light text-center py-12">Loading...</p>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-heading-2 text-infld-grey-light">NOTHING HERE YET.</p>
              <p className="text-infld-grey-mid mt-2" style={{ fontFamily: "var(--font-typewriter)" }}>Check back soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
              {products.map((product) => (
                <ProductCard
                  key={product.slug}
                  slug={product.slug}
                  name={product.name}
                  subtitle={product.subtitle}
                  price={product.price}
                  badge={product.badge}
                  imageUrl={product.images[0]?.url}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
