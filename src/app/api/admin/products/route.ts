import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const products = await prisma.product.findMany({
    include: { images: { orderBy: { sortOrder: "asc" } }, sizes: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { images, sizes, ...productData } = body;

  const product = await prisma.product.create({
    data: {
      ...productData,
      images: images?.length
        ? { create: images.map((img: { url: string; alt?: string }, i: number) => ({ url: img.url, alt: img.alt || "", sortOrder: i })) }
        : undefined,
      sizes: sizes?.length
        ? { create: sizes.map((s: { label: string; stock?: number }) => ({ label: s.label, stock: s.stock ?? 0 })) }
        : undefined,
    },
    include: { images: true, sizes: true },
  });

  return NextResponse.json(product, { status: 201 });
}
