"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/ui/ProductCard";
import { StarFilled, Lightning } from "@/components/doodles";
import { useCartStore } from "@/lib/cart";

interface Product {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  price: number;
  category: string;
  badge: string | null;
  description: string;
  materialDetails: string;
  sizingDetails: string;
  returnDetails: string;
  images: { url: string; alt: string }[];
  sizes: { label: string; stock: number }[];
}

export default function ProductPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [openDetail, setOpenDetail] = useState<string | null>(null);
  const [mainImage, setMainImage] = useState(0);
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    fetch(`/api/products`)
      .then((r) => r.json())
      .then((products: Product[]) => {
        const found = products.find((p) => p.slug === slug);
        setProduct(found || null);
        if (found) {
          setRelated(products.filter((p) => p.slug !== slug).slice(0, 3));
        }
        setLoading(false);
      });
  }, [slug]);

  const handleAddToCart = () => {
    if (!product || !selectedSize) return;
    addItem({
      productId: product.id,
      productName: product.name,
      slug: product.slug,
      size: selectedSize,
      price: product.price,
      image: product.images[0]?.url || "",
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <><Nav /><main className="min-h-screen bg-infld-black flex items-center justify-center"><p className="text-infld-grey-light">Loading...</p></main><Footer /></>
    );
  }

  if (!product) {
    return (
      <><Nav /><main className="min-h-screen bg-infld-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-display text-infld-white mb-4" style={{ fontSize: "4rem" }}>404</h1>
          <p className="text-infld-grey-light mb-6" style={{ fontFamily: "var(--font-typewriter)" }}>This product doesn&apos;t exist. Yet.</p>
          <Link href="/shop" className="text-label text-infld-yellow hover:text-infld-white transition-colors">&larr; BACK TO SHOP</Link>
        </div>
      </main><Footer /></>
    );
  }

  const details = [
    { key: "materials", label: "MATERIALS", content: product.materialDetails },
    { key: "sizing", label: "SIZING GUIDE", content: product.sizingDetails },
    { key: "returns", label: "RETURNS", content: product.returnDetails },
  ];

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-infld-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <Link href="/shop" className="text-label text-infld-grey-light hover:text-infld-yellow transition-colors">&larr; SHOP</Link>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Image Gallery */}
            <div>
              <div className="aspect-square bg-infld-grey-dark border-2 border-infld-grey-mid overflow-hidden relative mb-3">
                {product.badge && (
                  <span className="absolute top-4 right-4 bg-infld-yellow text-infld-black font-display text-sm px-3 py-1 rotate-3 z-10">{product.badge}</span>
                )}
                {product.images[mainImage] ? (
                  <Image src={product.images[mainImage].url} alt={product.images[mainImage].alt || product.name} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" priority />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-infld-grey-mid" style={{ fontFamily: "var(--font-display)", fontSize: "4rem" }}>INFLD</span>
                  </div>
                )}
              </div>
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.map((img, i) => (
                    <button key={i} onClick={() => setMainImage(i)} className={`aspect-square bg-infld-grey-dark border-2 overflow-hidden relative ${mainImage === i ? "border-infld-white" : "border-infld-grey-mid hover:border-infld-white"} transition-colors`} aria-label={`View image ${i + 1}`}>
                      <Image src={img.url} alt={img.alt || ""} fill className="object-cover" sizes="120px" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <h1 className="text-heading-1 text-infld-white mb-2">{product.name}</h1>
              <p className="text-infld-grey-light mb-4" style={{ fontFamily: "var(--font-typewriter)", fontStyle: "italic" }}>{product.subtitle}</p>
              <p className="text-infld-white text-2xl font-bold mb-6" style={{ fontFamily: "var(--font-body)" }}>&pound;{(product.price / 100).toFixed(0)}</p>
              <p className="text-infld-grey-light mb-8 max-w-md" style={{ fontFamily: "var(--font-typewriter)", lineHeight: 1.8 }}>{product.description}</p>

              {/* Size Selector */}
              <div className="mb-6">
                <p className="text-label text-infld-grey-light mb-3">SIZE</p>
                <div className="flex gap-2 flex-wrap">
                  {product.sizes.map((size) => (
                    <button key={size.label} onClick={() => setSelectedSize(size.label)} className={`min-w-[3rem] h-12 px-3 border-2 font-body text-sm transition-all duration-100 ${
                      selectedSize === size.label ? "bg-infld-white text-infld-black border-infld-white shadow-[3px_3px_0_#FFE600]" : "bg-transparent text-infld-grey-light border-infld-grey-mid hover:border-infld-white hover:text-infld-white"
                    } ${size.stock === 0 ? "opacity-40 cursor-not-allowed" : ""}`} disabled={size.stock === 0}>
                      {size.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={!selectedSize}
                className="w-full bg-infld-yellow text-infld-black font-display text-xl tracking-widest py-4 border-3 border-infld-black shadow-[4px_4px_0_#0A0A0A] hover:shadow-[6px_6px_0_#0A0A0A] hover:-translate-x-0.5 hover:-translate-y-0.5 active:shadow-none active:translate-x-1 active:translate-y-1 transition-all duration-75 mb-3 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {added ? "ADDED ✓" : selectedSize ? "ADD TO CART" : "SELECT A SIZE"}
              </button>

              {/* Details Accordion */}
              <div className="mt-10 border-t border-infld-grey-mid">
                {details.map((detail) => (
                  <div key={detail.key} className="border-b border-infld-grey-mid">
                    <button onClick={() => setOpenDetail(openDetail === detail.key ? null : detail.key)} className="w-full flex items-center justify-between py-4 text-left" aria-expanded={openDetail === detail.key}>
                      <span className="text-label text-infld-white">{detail.label}</span>
                      <span className="text-infld-grey-light text-xl">{openDetail === detail.key ? "\u2212" : "+"}</span>
                    </button>
                    {openDetail === detail.key && (
                      <div className="pb-4">
                        <p className="text-infld-grey-light text-sm leading-relaxed" style={{ fontFamily: "var(--font-typewriter)" }}>{detail.content}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-infld-grey-mid">
            <div className="flex items-center gap-3 mb-8">
              <h2 className="text-heading-1 text-infld-white">MORE NOISE</h2>
              <StarFilled size={20} className="text-infld-yellow" />
              <Lightning size={20} className="text-infld-yellow" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {related.map((p) => (
                <ProductCard key={p.slug} slug={p.slug} name={p.name} subtitle={p.subtitle} price={p.price} badge={p.badge} imageUrl={p.images[0]?.url} />
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
