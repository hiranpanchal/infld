import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // --- Admin User ---
  const passwordHash = await bcryptjs.hash(
    process.env.ADMIN_PASSWORD || "infld2025",
    12
  );
  await prisma.adminUser.upsert({
    where: { email: process.env.ADMIN_EMAIL || "admin@infld.com" },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL || "admin@infld.com",
      passwordHash,
      name: "INFLD Admin",
    },
  });
  console.log("✓ Admin user seeded");

  // --- Products ---
  const productsData = [
    {
      slug: "infld-oversized-hoodie-black",
      name: "INFLD OVERSIZED HOODIE",
      subtitle: '"UNINFLUENCED"',
      price: 6000,
      category: "hoodies",
      badge: "NEW DROP",
      description:
        "Heavyweight 400gsm organic cotton. Oversized fit. Screen-printed front and back. This hoodie doesn't try to be anything. It just is.",
      materialDetails:
        "400gsm organic cotton fleece. Brushed interior. Reinforced seams. YKK hardware.",
      sizingDetails:
        "Oversized fit — we recommend your usual size for the intended baggy look. Age 7-8 (128cm), 9-10 (140cm), 11-12 (152cm), 13-14 (164cm), 15 (170cm).",
      returnDetails:
        "30-day returns. Unworn, tags attached. We'll sort it. No drama.",
      sizes: ["7-8", "9-10", "11-12", "13-14", "15"],
    },
    {
      slug: "infld-oversized-hoodie-white",
      name: "INFLD OVERSIZED HOODIE",
      subtitle: '"WEAR YOUR OWN MIND"',
      price: 6000,
      category: "hoodies",
      badge: null,
      description:
        "Same heavyweight build. Different statement. Off-white colourway with black screen print.",
      materialDetails:
        "400gsm organic cotton fleece. Brushed interior. Reinforced seams. YKK hardware.",
      sizingDetails:
        "Oversized fit — we recommend your usual size. Age 7-8 (128cm), 9-10 (140cm), 11-12 (152cm), 13-14 (164cm), 15 (170cm).",
      returnDetails:
        "30-day returns. Unworn, tags attached. We'll sort it. No drama.",
      sizes: ["7-8", "9-10", "11-12", "13-14", "15"],
    },
    {
      slug: "infld-graphic-tee-black",
      name: "INFLD GRAPHIC TEE",
      subtitle: '"NOT YOUR BRAND"',
      price: 4500,
      category: "tees",
      badge: "NEW DROP",
      description:
        "200gsm organic cotton tee. Boxy fit. Bold graphic front, minimal back.",
      materialDetails:
        "200gsm organic cotton jersey. Pre-shrunk. Screen-printed.",
      sizingDetails:
        "Boxy/relaxed fit. Age 7-8 (128cm), 9-10 (140cm), 11-12 (152cm), 13-14 (164cm), 15 (170cm).",
      returnDetails:
        "30-day returns. Unworn, tags attached. We'll sort it. No drama.",
      sizes: ["7-8", "9-10", "11-12", "13-14", "15"],
    },
    {
      slug: "infld-graphic-tee-white",
      name: "INFLD GRAPHIC TEE",
      subtitle: '"THINK FOR YOURSELF"',
      price: 4500,
      category: "tees",
      badge: null,
      description:
        "Same boxy cut. Off-white colourway. High-contrast print.",
      materialDetails:
        "200gsm organic cotton jersey. Pre-shrunk. Screen-printed.",
      sizingDetails:
        "Boxy/relaxed fit. Age 7-8 (128cm), 9-10 (140cm), 11-12 (152cm), 13-14 (164cm), 15 (170cm).",
      returnDetails:
        "30-day returns. Unworn, tags attached. We'll sort it. No drama.",
      sizes: ["7-8", "9-10", "11-12", "13-14", "15"],
    },
    {
      slug: "rebel-edition-hoodie",
      name: "REBEL EDITION HOODIE",
      subtitle: '"REBEL EDITION"',
      price: 7500,
      category: "rebel-edition",
      badge: "LIMITED",
      description:
        "Limited run. Hand-numbered. Once they're gone, they're gone.",
      materialDetails:
        "450gsm heavyweight organic cotton. Hand-distressed details. Numbered label sewn in.",
      sizingDetails:
        "Oversized fit. Age 9-10 (140cm), 11-12 (152cm), 13-14 (164cm), 15 (170cm). Limited sizes.",
      returnDetails:
        "Final sale on Rebel Edition. Choose carefully. That's the point.",
      sizes: ["9-10", "11-12", "13-14", "15"],
    },
    {
      slug: "rebel-edition-tee",
      name: "REBEL EDITION TEE",
      subtitle: '"REBEL EDITION"',
      price: 5500,
      category: "rebel-edition",
      badge: "LIMITED",
      description:
        "Limited edition graphic tee with hand-finished details. Numbered.",
      materialDetails:
        "220gsm organic cotton. Hand-distressed collar. Numbered interior label.",
      sizingDetails:
        "Boxy fit. Age 9-10 (140cm), 11-12 (152cm), 13-14 (164cm), 15 (170cm).",
      returnDetails:
        "Final sale on Rebel Edition. Choose carefully. That's the point.",
      sizes: ["9-10", "11-12", "13-14", "15"],
    },
  ];

  for (const p of productsData) {
    const { sizes, ...productData } = p;
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: productData,
    });

    const existingSizes = await prisma.productSize.count({
      where: { productId: product.id },
    });
    if (existingSizes === 0) {
      await prisma.productSize.createMany({
        data: sizes.map((label) => ({
          productId: product.id,
          label,
          stock: 50,
        })),
      });
    }
  }
  console.log("✓ Products seeded");

  // --- Page Content ---
  const contentBlocks = [
    { pageKey: "home", blockKey: "hero_title", content: "UNINFLUENCED" },
    { pageKey: "home", blockKey: "hero_subtitle", content: "Streetwear for the ones who don't follow." },
    { pageKey: "home", blockKey: "hero_overlay_opacity", content: "60" },
    { pageKey: "home", blockKey: "manifesto_stripe", content: "WE'RE NOT SELLING YOU AN IDENTITY. WE'RE TELLING YOU TO FIND YOUR OWN." },
    { pageKey: "home", blockKey: "zine_annotation", content: "the anti-ad is the ad" },
    { pageKey: "home", blockKey: "zine_heading", content: "NOT YOUR BRAND.\nYOUR BRAND." },
    { pageKey: "home", blockKey: "email_heading", content: "JOIN THE REBELLION" },
    { pageKey: "home", blockKey: "email_subtitle", content: "New drops. No spam. Just noise." },
    { pageKey: "about", blockKey: "hero_title", content: "WHO IS INFLD?" },
    { pageKey: "about", blockKey: "hero_annotation", content: "(and why should you care?)" },
    { pageKey: "about", blockKey: "manifesto", content: "You're being sold to.\n\nEvery feed. Every ad. Every \"collab\".\nSomeone's trying to tell you what to wear,\nwhat to think, what to be.\n\nINFLD says: stop.\n\nWe make clothes for kids who see through it.\nWho'd rather draw on their bag than buy a designer one.\nWho choose their own style instead of copying it.\n\nThis is not a lifestyle brand.\nThis is not a culture.\nThis is just a hoodie.\nA really good, really honest hoodie.\n\nWear your own mind." },
    { pageKey: "about", blockKey: "philosophy_heading", content: "THE ANTI-AD IS THE AD" },
    { pageKey: "about", blockKey: "philosophy_body", content: "The irony is intentional. We're a brand that tells you not to listen to brands. We sell you a hoodie that says don't buy what they're selling. And somehow, that's the most honest thing a clothing company has ever done." },
    { pageKey: "about", blockKey: "philosophy_signoff", content: "— INFLD. Uninfluenced." },
    { pageKey: "about", blockKey: "stat1_label", content: "EST." },
    { pageKey: "about", blockKey: "stat1_value", content: "2025" },
    { pageKey: "about", blockKey: "stat2_label", content: "ONE" },
    { pageKey: "about", blockKey: "stat2_value", content: "BRAND" },
    { pageKey: "about", blockKey: "stat3_label", content: "ZERO" },
    { pageKey: "about", blockKey: "stat3_value", content: "RULES" },
    { pageKey: "about", blockKey: "stat4_label", content: "100%" },
    { pageKey: "about", blockKey: "stat4_value", content: "HONEST" },
    { pageKey: "lookbook", blockKey: "heading", content: "LOOKBOOK" },
    { pageKey: "lookbook", blockKey: "annotation", content: "no captions. no context. just noise." },
    { pageKey: "lookbook", blockKey: "bottom_line1", content: "this is not a campaign." },
    { pageKey: "lookbook", blockKey: "bottom_line2", content: "THIS IS JUST WHAT WE LOOK LIKE." },
    { pageKey: "coming-soon", blockKey: "subtitle", content: "We're getting ready. You should too." },
    { pageKey: "coming-soon", blockKey: "bottom_text", content: "NOT YOUR BRAND. NOT EVEN CLOSE." },
    { pageKey: "social", blockKey: "instagram", content: "" },
    { pageKey: "social", blockKey: "tiktok", content: "" },
    { pageKey: "social", blockKey: "youtube", content: "" },
  ];

  for (const block of contentBlocks) {
    await prisma.pageContent.upsert({
      where: { pageKey_blockKey: { pageKey: block.pageKey, blockKey: block.blockKey } },
      update: {},
      create: block,
    });
  }
  console.log("✓ Page content seeded");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
