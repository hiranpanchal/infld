import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");

  const products = await prisma.product.findMany({
    where: {
      published: true,
      ...(category && category !== "all" ? { category } : {}),
    },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      sizes: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(products);
}
