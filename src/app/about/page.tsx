import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { StarFilled, StarOutline, Lightning, SafetyPin } from "@/components/doodles";
import { getPageContent, getSiteImages } from "@/lib/data";

export const metadata = {
  title: "About — INFLD",
  description:
    "INFLD exists to stop young people getting influenced by mainstream culture. Streetwear for kids who think for themselves.",
};

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const [content, aboutImages] = await Promise.all([
    getPageContent("about"),
    getSiteImages("pages"),
  ]);
  const aboutBannerUrl = aboutImages[0]?.url || null;

  const heroTitle = content.hero_title || "WHO IS INFLD?";
  const heroAnnotation = content.hero_annotation || "(and why should you care?)";
  const manifesto = content.manifesto || "You're being sold to.\n\nEvery feed. Every ad. Every \"collab\".\nSomeone's trying to tell you what to wear,\nwhat to think, what to be.\n\nINFLD says: stop.\n\nWe make clothes for kids who see through it.\nWho'd rather draw on their bag than buy a designer one.\nWho choose their own style instead of copying it.\n\nThis is not a lifestyle brand.\n\nThis is not a culture.\n\nThis is just a hoodie.\nA really good, really honest hoodie.\n\nWear your own mind.";
  const stat1Label = content.stat1_label || "EST.";
  const stat1Value = content.stat1_value || "2025";
  const stat2Label = content.stat2_label || "ONE";
  const stat2Value = content.stat2_value || "BRAND";
  const stat3Label = content.stat3_label || "ZERO";
  const stat3Value = content.stat3_value || "RULES";
  const stat4Label = content.stat4_label || "100%";
  const stat4Value = content.stat4_value || "HONEST";
  const philosophyHeading = content.philosophy_heading || "THE ANTI-AD IS THE AD";
  const philosophyBody = content.philosophy_body || "The irony is intentional. We're a brand that tells you not to listen to brands. We sell you a hoodie that says don't buy what they're selling. And somehow, that's the most honest thing a clothing company has ever done.";
  const philosophySignoff = content.philosophy_signoff || "— INFLD. Uninfluenced.";

  const stats = [
    { label: stat1Label, value: stat1Value },
    { label: stat2Label, value: stat2Value },
    { label: stat3Label, value: stat3Value },
    { label: stat4Label, value: stat4Value },
  ];

  const manifestoParagraphs = manifesto.split("\n\n");

  return (
    <>
      <Nav />

      <main className="min-h-screen bg-infld-black">
        {/* Hero */}
        <section
          className="relative py-20 px-4 overflow-hidden"
          style={aboutBannerUrl ? {
            backgroundImage: `url(${aboutBannerUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          } : undefined}
        >
          {!aboutBannerUrl && <div className="absolute inset-0 section-textured" />}
          {aboutBannerUrl && <div className="absolute inset-0 bg-infld-black/60" />}
          <div className="absolute top-8 right-8 text-infld-yellow opacity-40 rotate-12 z-10">
            <SafetyPin size={48} />
          </div>
          <div className="absolute bottom-12 left-12 text-infld-yellow opacity-30 -rotate-6 z-10">
            <StarOutline size={36} />
          </div>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h1
              className="text-display text-infld-white stencil-text mb-4"
              style={{ fontSize: "clamp(3rem, 14vw, 10rem)" }}
            >
              {heroTitle}
            </h1>
            <p className="text-annotation text-infld-yellow">
              {heroAnnotation}
            </p>
          </div>
        </section>

        {/* Manifesto */}
        <section className="py-16 px-4 bg-infld-black border-t border-infld-grey-mid">
          <div className="max-w-2xl mx-auto">
            <div className="text-manifesto text-infld-white space-y-6 leading-loose">
              {manifestoParagraphs.map((para, i) => {
                const isHighlight = para.startsWith("INFLD says:");
                const isSignoff = i === manifestoParagraphs.length - 1;
                return (
                  <p
                    key={i}
                    className={isHighlight ? "text-infld-yellow font-bold text-xl" : isSignoff ? "text-infld-yellow text-2xl" : ""}
                    style={isSignoff ? { fontFamily: "var(--font-marker)" } : undefined}
                    dangerouslySetInnerHTML={{ __html: para.replace(/\n/g, "<br />") }}
                  />
                );
              })}
            </div>
          </div>
        </section>

        {/* Collage / Visual Break */}
        <section className="relative py-20 px-4 bg-infld-grey-dark overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div
              className="w-full h-full"
              style={{
                backgroundImage:
                  'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'300\' height=\'300\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.75\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'300\' height=\'300\' filter=\'url(%23n)\' opacity=\'0.5\'/%3E%3C/svg%3E")',
              }}
            />
          </div>
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
            {stats.map((stat) => (
              <div
                key={stat.value}
                className="border-2 border-infld-grey-mid p-6 text-center"
              >
                <p className="text-label text-infld-grey-light mb-2">
                  {stat.label}
                </p>
                <p
                  className="text-infld-white"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(2rem, 5vw, 3.5rem)",
                  }}
                >
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Philosophy */}
        <section className="py-16 px-4 bg-infld-black border-t border-infld-grey-mid">
          <div className="max-w-2xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-8">
              <StarFilled size={20} className="text-infld-yellow" />
              <Lightning size={20} className="text-infld-yellow" />
              <StarFilled size={20} className="text-infld-yellow" />
            </div>
            <h2 className="text-heading-1 text-infld-white mb-6">
              {philosophyHeading}
            </h2>
            <p
              className="text-infld-grey-light leading-relaxed"
              style={{ fontFamily: "var(--font-typewriter)" }}
            >
              {philosophyBody}
            </p>
            <div className="mt-10">
              <p className="text-annotation text-infld-yellow text-xl">
                {philosophySignoff}
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
