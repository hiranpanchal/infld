import Link from "next/link";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/ui/ProductCard";
import { EmailForm } from "@/components/ui/EmailForm";
import { StarFilled, StarOutline, Lightning, SafetyPin } from "@/components/doodles";
import { getPublishedProducts, getPageContent, getSiteImages } from "@/lib/data";
import { HeroSlideshow } from "@/components/ui/HeroSlideshow";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [products, content, heroImages] = await Promise.all([
    getPublishedProducts(),
    getPageContent("home"),
    getSiteImages("hero"),
  ]);
  const heroImageUrls = heroImages.map((img) => img.url);
  const heroOverlayOpacity = Math.min(100, Math.max(0, parseInt(content.hero_overlay_opacity || "60", 10)));
  const featuredProducts = products.slice(0, 3);

  const heroTitle = content.hero_title || "UNINFLUENCED";
  const heroSubtitle = content.hero_subtitle || "Streetwear for the ones who don't follow.";
  const manifestoStripe = content.manifesto_stripe || "WE'RE NOT SELLING YOU AN IDENTITY. WE'RE TELLING YOU TO FIND YOUR OWN.";
  const zineAnnotation = content.zine_annotation || "the anti-ad is the ad";
  const zineHeading = content.zine_heading || "NOT YOUR BRAND.\nYOUR BRAND.";
  const emailHeading = content.email_heading || "JOIN THE REBELLION";
  const emailSubtitle = content.email_subtitle || "New drops. No spam. Just noise.";

  const zineLines = zineHeading.split("\n");

  return (
    <>
      <Nav />
      <main>
        {/* HERO */}
        <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden torn-edge-bottom">
          <HeroSlideshow images={heroImageUrls} overlayOpacity={heroOverlayOpacity} />
          <div className="absolute top-12 left-8 text-infld-yellow opacity-60 rotate-12 z-10"><StarFilled size={28} /></div>
          <div className="absolute top-24 right-12 text-infld-yellow opacity-40 -rotate-6 z-10"><Lightning size={32} /></div>
          <div className="absolute bottom-32 left-16 text-infld-grey-light opacity-30 rotate-45 z-10"><SafetyPin size={40} /></div>
          <div className="absolute top-1/3 right-8 text-infld-grey-mid opacity-20 rotate-12 z-10"><StarOutline size={48} /></div>
          <div className="absolute bottom-48 right-24 text-infld-yellow opacity-50 -rotate-12 z-10"><StarFilled size={20} /></div>

          <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
            <h1 className="text-display text-infld-white stencil-text mb-4" style={{ fontSize: "clamp(4rem, 18vw, 14rem)" }}>
              {heroTitle}
            </h1>
            <p className="text-infld-grey-light max-w-md mx-auto mb-10" style={{ fontFamily: "var(--font-typewriter)", fontSize: "1.1rem" }}>
              {heroSubtitle}
            </p>
            <Link href="/shop" className="inline-block bg-infld-yellow text-infld-black font-display text-xl tracking-widest px-8 py-4 border-3 border-infld-black shadow-[4px_4px_0_#0A0A0A] hover:shadow-[6px_6px_0_#0A0A0A] hover:-translate-x-0.5 hover:-translate-y-0.5 active:shadow-none active:translate-x-1 active:translate-y-1 transition-all duration-75" style={{ fontFamily: "var(--font-display)" }}>
              SHOP THE DROP
            </Link>
          </div>
        </section>

        {/* MANIFESTO STRIPE */}
        <section className="bg-infld-yellow py-6 px-4 overflow-hidden">
          <p className="text-infld-black text-center whitespace-nowrap" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1rem, 3vw, 2rem)", letterSpacing: "0.05em" }}>
            {manifestoStripe}
          </p>
        </section>

        {/* FEATURED DROP */}
        <section className="bg-infld-black py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-10">
              <h2 className="text-heading-1 text-infld-white">LATEST DROP</h2>
              <Lightning size={24} className="text-infld-yellow" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {featuredProducts.map((product) => (
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
            <div className="mt-8 text-center">
              <Link href="/shop" className="text-label text-infld-grey-light hover:text-infld-yellow transition-colors inline-flex items-center gap-2">
                VIEW ALL DROPS &rarr;
              </Link>
            </div>
          </div>
        </section>

        {/* ZINE CALLOUT */}
        <section className="relative bg-infld-grey-dark py-24 px-4 overflow-hidden">
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <div className="tape-strip inline-block mb-6">
              <StarFilled size={16} className="text-infld-yellow inline-block mr-2" />
              <span className="text-annotation text-infld-yellow">{zineAnnotation}</span>
              <StarFilled size={16} className="text-infld-yellow inline-block ml-2" />
            </div>
            <h2 className="text-display text-infld-white mb-4" style={{ fontSize: "clamp(2.5rem, 10vw, 8rem)" }}>
              {zineLines[0]}
              {zineLines[1] && <><br /><span className="text-infld-yellow">{zineLines[1]}</span></>}
            </h2>
          </div>
        </section>

        {/* EMAIL CAPTURE */}
        <section className="bg-infld-black py-20 px-4 border-t border-infld-grey-mid">
          <div className="max-w-lg mx-auto text-center">
            <h2 className="text-display text-infld-white mb-3" style={{ fontSize: "clamp(2rem, 8vw, 5rem)" }}>
              {emailHeading}
            </h2>
            <p className="text-label text-infld-grey-light mb-8">{emailSubtitle}</p>
            <EmailForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
