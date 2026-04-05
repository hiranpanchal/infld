import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { RichTextContent } from "@/components/ui/RichTextContent";
import { PageBanner } from "@/components/ui/PageBanner";
import { prisma } from "@/lib/db";
import { getSiteImages } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function ShippingPage() {
  const [block, images] = await Promise.all([
    prisma.pageContent.findUnique({ where: { pageKey_blockKey: { pageKey: "shipping", blockKey: "body" } } }),
    getSiteImages("page-shipping"),
  ]);

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-infld-black">
        <PageBanner title="SHIPPING INFO" bannerUrl={images[0]?.url} />
        <section className="px-4 py-16">
          <div className="max-w-2xl mx-auto">
            {block?.content ? (
              <RichTextContent html={block.content} />
            ) : (
              <p className="text-infld-grey-mid text-sm" style={{ fontFamily: "var(--font-typewriter)" }}>
                Shipping information coming soon.
              </p>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
