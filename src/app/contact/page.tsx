import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { PageBanner } from "@/components/ui/PageBanner";
import { ContactForm } from "./ContactForm";
import { prisma } from "@/lib/db";
import { getSiteImages } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const [blocks, images] = await Promise.all([
    prisma.pageContent.findMany({ where: { pageKey: "contact" } }),
    getSiteImages("page-contact"),
  ]);

  const heading = blocks.find((b) => b.blockKey === "heading")?.content ?? "GET IN TOUCH";
  const subheading =
    blocks.find((b) => b.blockKey === "subheading")?.content ?? "Questions? Collabs? Noise? We're here.";

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-infld-black">
        <PageBanner title="CONTACT" bannerUrl={images[0]?.url} />
        <ContactForm heading={heading} subheading={subheading} />
      </main>
      <Footer />
    </>
  );
}
