import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { RichTextContent } from "@/components/ui/RichTextContent";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function ReturnsPage() {
  const block = await prisma.pageContent.findUnique({
    where: { pageKey_blockKey: { pageKey: "returns", blockKey: "body" } },
  });
  const html = block?.content ?? "";

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-infld-black pt-16 pb-24 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-infld-white mb-10" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.5rem,8vw,4.5rem)", lineHeight: 1 }}>
            RETURNS
          </h1>
          {html ? (
            <RichTextContent html={html} />
          ) : (
            <p className="text-infld-grey-mid text-sm" style={{ fontFamily: "var(--font-typewriter)" }}>
              Returns policy coming soon.
            </p>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
