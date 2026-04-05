import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { RichTextContent } from "@/components/ui/RichTextContent";
import { PageBanner } from "@/components/ui/PageBanner";
import { prisma } from "@/lib/db";
import { getSiteImages } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function SizeGuidePage() {
  const [block, images] = await Promise.all([
    prisma.pageContent.findUnique({ where: { pageKey_blockKey: { pageKey: "size-guide", blockKey: "body" } } }),
    getSiteImages("page-size-guide"),
  ]);

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-infld-black">
        <PageBanner title="SIZE GUIDE" bannerUrl={images[0]?.url} />
        <section className="px-4 py-16">
          <div className="max-w-2xl mx-auto">
            {block?.content ? (
              <RichTextContent html={block.content} />
            ) : (
              <p className="text-infld-grey-mid text-sm" style={{ fontFamily: "var(--font-typewriter)" }}>
                Size guide coming soon.
              </p>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
