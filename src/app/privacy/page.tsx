import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { RichTextContent } from "@/components/ui/RichTextContent";
import { PageBanner } from "@/components/ui/PageBanner";
import { prisma } from "@/lib/db";
import { getSiteImages } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function PrivacyPage() {
  const [block, images] = await Promise.all([
    prisma.pageContent.findUnique({ where: { pageKey_blockKey: { pageKey: "privacy", blockKey: "body" } } }),
    getSiteImages("page-privacy"),
  ]);

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-infld-black">
        <PageBanner title="PRIVACY POLICY" bannerUrl={images[0]?.url} />
        <section className="px-4 py-16">
          <div className="max-w-2xl mx-auto">
            {block?.content ? (
              <RichTextContent html={block.content} />
            ) : (
              <p className="text-infld-grey-mid text-sm" style={{ fontFamily: "var(--font-typewriter)" }}>
                Privacy policy coming soon.
              </p>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
