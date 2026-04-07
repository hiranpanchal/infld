import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { RichTextContent } from "@/components/ui/RichTextContent";
import { PageBanner } from "@/components/ui/PageBanner";
import { prisma } from "@/lib/db";
import { getSiteImages } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function ReturnsPage() {
  const [blocks, images] = await Promise.all([
    prisma.pageContent.findMany({ where: { pageKey: "returns" } }),
    getSiteImages("page-returns"),
  ]);

  const html = blocks.find((b) => b.blockKey === "body")?.content ?? "";
  const bannerTitle = blocks.find((b) => b.blockKey === "banner_title")?.content ?? "RETURNS";
  const bannerFontSize = blocks.find((b) => b.blockKey === "banner_title_size")?.content;

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-infld-black">
        <PageBanner title={bannerTitle} bannerUrl={images[0]?.url} fontSize={bannerFontSize} />
        <section className="px-4 py-16">
          <div className="max-w-2xl mx-auto">
            {html ? (
              <RichTextContent html={html} />
            ) : (
              <p className="text-infld-grey-mid text-sm" style={{ fontFamily: "var(--font-typewriter)" }}>
                Returns policy coming soon.
              </p>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
