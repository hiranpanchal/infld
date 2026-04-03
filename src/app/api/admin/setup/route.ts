import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcryptjs from "bcryptjs";

// One-time setup endpoint — seeds admin user and default content
// Call POST /api/admin/setup?secret=SETUP_SECRET after first deploy
export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.SETUP_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const passwordHash = await bcryptjs.hash(
    process.env.ADMIN_PASSWORD || "infld2025",
    12
  );

  await prisma.adminUser.upsert({
    where: { email: process.env.ADMIN_EMAIL || "admin@infld.com" },
    update: { passwordHash },
    create: {
      email: process.env.ADMIN_EMAIL || "admin@infld.com",
      passwordHash,
      name: "INFLD Admin",
    },
  });

  // Seed default page content if not exists
  const contentBlocks = [
    { pageKey: "home", blockKey: "hero_title", content: "UNINFLUENCED" },
    { pageKey: "home", blockKey: "hero_subtitle", content: "Streetwear for the ones who don't follow." },
    { pageKey: "home", blockKey: "hero_overlay_opacity", content: "60" },
    { pageKey: "home", blockKey: "manifesto_stripe", content: "WE'RE NOT SELLING YOU AN IDENTITY. WE'RE TELLING YOU TO FIND YOUR OWN." },
    { pageKey: "about", blockKey: "hero_title", content: "WHO IS INFLD?" },
    { pageKey: "about", blockKey: "hero_annotation", content: "(and why should you care?)" },
    { pageKey: "about", blockKey: "manifesto", content: "You're being sold to.\n\nEvery feed. Every ad. Every \"collab\".\nSomeone's trying to tell you what to wear,\nwhat to think, what to be.\n\nINFLD says: stop.\n\nWe make clothes for kids who see through it.\nWho'd rather draw on their bag than buy a designer one.\nWho choose their own style instead of copying it.\n\nThis is not a lifestyle brand.\nThis is not a culture.\nThis is just a hoodie.\nA really good, really honest hoodie.\n\nWear your own mind." },
    { pageKey: "about", blockKey: "philosophy_heading", content: "THE ANTI-AD IS THE AD" },
    { pageKey: "about", blockKey: "philosophy_body", content: "The irony is intentional. We're a brand that tells you not to listen to brands." },
    { pageKey: "about", blockKey: "philosophy_signoff", content: "— INFLD. Uninfluenced." },
    { pageKey: "lookbook", blockKey: "heading", content: "LOOKBOOK" },
    { pageKey: "lookbook", blockKey: "annotation", content: "no captions. no context. just noise." },
    { pageKey: "lookbook", blockKey: "bottom_line1", content: "this is not a campaign." },
    { pageKey: "lookbook", blockKey: "bottom_line2", content: "THIS IS JUST WHAT WE LOOK LIKE." },
  ];

  for (const block of contentBlocks) {
    await prisma.pageContent.upsert({
      where: { pageKey_blockKey: { pageKey: block.pageKey, blockKey: block.blockKey } },
      update: {},
      create: block,
    });
  }

  return NextResponse.json({ ok: true, message: "Setup complete" });
}
