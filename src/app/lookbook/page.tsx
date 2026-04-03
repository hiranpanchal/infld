import Image from "next/image";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { StarFilled, Lightning, SafetyPin } from "@/components/doodles";
import { getSiteImages, getPageContent } from "@/lib/data";

export const metadata = {
  title: "Lookbook — INFLD",
  description: "INFLD lookbook. Zine-style visuals for the uninfluenced generation.",
};

export const dynamic = "force-dynamic";

const ROTATIONS = ["-rotate-1", "rotate-1", "rotate-0.5", "-rotate-0.5", "rotate-1", "-rotate-1", "rotate-0.5", "-rotate-0.5", "rotate-1"];
const ASPECTS = ["aspect-[3/4]", "aspect-square", "aspect-[4/5]", "aspect-[3/4]", "aspect-square", "aspect-[4/3]", "aspect-[3/4]", "aspect-square", "aspect-[4/5]"];

export default async function LookbookPage() {
  const [images, content] = await Promise.all([
    getSiteImages("lookbook"),
    getPageContent("lookbook"),
  ]);

  const heading = content.heading || "LOOKBOOK";
  const annotation = content.annotation || "no captions. no context. just noise.";
  const bottomLine1 = content.bottom_line1 || "this is not a campaign.";
  const bottomLine2 = content.bottom_line2 || "THIS IS JUST WHAT WE LOOK LIKE.";

  return (
    <>
      <Nav />

      <main className="min-h-screen bg-infld-black">
        {/* Header */}
        <section className="py-16 px-4 section-textured relative overflow-hidden">
          <div className="absolute top-6 right-10 text-infld-yellow opacity-40 rotate-12">
            <SafetyPin size={36} />
          </div>
          <div className="absolute bottom-8 left-8 text-infld-grey-light opacity-20 -rotate-12">
            <Lightning size={28} />
          </div>
          <div className="max-w-6xl mx-auto relative z-10">
            <h1
              className="text-display text-infld-white stencil-text"
              style={{ fontSize: "clamp(3rem, 14vw, 10rem)" }}
            >
              {heading}
            </h1>
            <p className="text-annotation text-infld-yellow mt-2">
              {annotation}
            </p>
          </div>
        </section>

        {/* Masonry Grid */}
        <section className="px-3 sm:px-6 py-8">
          <div className="columns-2 md:columns-3 gap-3 sm:gap-4 max-w-6xl mx-auto">
            {images.length > 0 ? (
              images.map((img, i) => (
                <div
                  key={img.id}
                  className={`break-inside-avoid mb-3 sm:mb-4 ${ROTATIONS[i % ROTATIONS.length]} relative group`}
                >
                  {i % 3 === 0 && (
                    <div className="tape-strip absolute top-0 left-1/2 -translate-x-1/2 z-10 w-0 h-0" />
                  )}

                  <div
                    className={`${ASPECTS[i % ASPECTS.length]} bg-infld-grey-dark border-2 border-infld-grey-mid overflow-hidden relative`}
                  >
                    <Image
                      src={img.url}
                      alt={img.alt || `Lookbook ${i + 1}`}
                      fill
                      className="object-cover photocopy-img"
                      sizes="(max-width: 768px) 50vw, 33vw"
                    />
                    <div
                      className="absolute inset-0 opacity-15 mix-blend-overlay pointer-events-none"
                      style={{
                        backgroundImage:
                          'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3CfeColorMatrix type=\'saturate\' values=\'0\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.4\'/%3E%3C/svg%3E")',
                      }}
                    />
                  </div>

                  {i === 2 && (
                    <div className="absolute -bottom-3 -right-2 text-infld-yellow opacity-60 rotate-12 z-10">
                      <StarFilled size={20} />
                    </div>
                  )}
                  {i === 5 && (
                    <div className="absolute -top-2 -left-2 text-infld-yellow opacity-50 -rotate-6 z-10">
                      <Lightning size={22} />
                    </div>
                  )}
                </div>
              ))
            ) : (
              /* Placeholder grid when no images uploaded yet */
              Array.from({ length: 9 }).map((_, i) => (
                <div
                  key={i}
                  className={`break-inside-avoid mb-3 sm:mb-4 ${ROTATIONS[i]} relative group`}
                >
                  {i % 3 === 0 && (
                    <div className="tape-strip absolute top-0 left-1/2 -translate-x-1/2 z-10 w-0 h-0" />
                  )}
                  <div
                    className={`${ASPECTS[i]} bg-infld-grey-dark border-2 border-infld-grey-mid overflow-hidden relative`}
                  >
                    <div className="absolute inset-0 flex items-center justify-center photocopy-img">
                      <div className="text-center">
                        <span
                          className="text-infld-grey-mid block"
                          style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "clamp(1.5rem, 4vw, 3rem)",
                          }}
                        >
                          INFLD
                        </span>
                        <span
                          className="text-infld-grey-mid text-xs block mt-1"
                          style={{ fontFamily: "var(--font-body)" }}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </div>
                    </div>
                  </div>
                  {i === 2 && (
                    <div className="absolute -bottom-3 -right-2 text-infld-yellow opacity-60 rotate-12 z-10">
                      <StarFilled size={20} />
                    </div>
                  )}
                  {i === 5 && (
                    <div className="absolute -top-2 -left-2 text-infld-yellow opacity-50 -rotate-6 z-10">
                      <Lightning size={22} />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </section>

        {/* Bottom callout */}
        <section className="py-16 px-4 text-center border-t border-infld-grey-mid">
          <p className="text-annotation text-infld-yellow text-xl mb-2">
            {bottomLine1}
          </p>
          <p className="text-label text-infld-grey-light">
            {bottomLine2}
          </p>
        </section>
      </main>

      <Footer />
    </>
  );
}
