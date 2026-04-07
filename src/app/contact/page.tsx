import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { ContactForm } from "./ContactForm";
import { prisma } from "@/lib/db";
import { getSiteImages } from "@/lib/data";
import { StarFilled, Lightning } from "@/components/doodles";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const [blocks, images] = await Promise.all([
    prisma.pageContent.findMany({ where: { pageKey: "contact" } }),
    getSiteImages("page-contact"),
  ]);

  const heading = blocks.find((b) => b.blockKey === "heading")?.content ?? "GET IN TOUCH";
  const headingSize = blocks.find((b) => b.blockKey === "heading_size")?.content ?? "7rem";
  const subheading =
    blocks.find((b) => b.blockKey === "subheading")?.content ?? "Questions? Collabs? Noise? We're here.";
  const bannerUrl = images[0]?.url;

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-infld-black">
        {/* Banner with overlaid heading */}
        <section
          className="relative overflow-hidden flex items-center justify-center text-center px-4"
          style={{
            height: "600px",
            ...(bannerUrl
              ? { backgroundImage: `url(${bannerUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
              : undefined),
          }}
        >
          {!bannerUrl && <div className="absolute inset-0 section-textured" />}
          {bannerUrl && <div className="absolute inset-0 bg-infld-black/60" />}
          <div className="relative z-10">
            <div className="flex items-center justify-center gap-3 mb-6">
              <StarFilled size={16} className="text-infld-yellow" />
              <Lightning size={16} className="text-infld-yellow" />
              <StarFilled size={16} className="text-infld-yellow" />
            </div>
            <h1
              className="text-infld-white stencil-text mb-4"
              style={{ fontFamily: "var(--font-display)", fontSize: headingSize, lineHeight: 0.9 }}
            >
              {heading}
            </h1>
            <p
              className="text-infld-white/80 max-w-sm mx-auto"
              style={{ fontFamily: "var(--font-typewriter)", lineHeight: 1.8 }}
            >
              {subheading}
            </p>
          </div>
        </section>

        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
