import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const content = await prisma.pageContent.findMany({
    orderBy: [{ pageKey: "asc" }, { blockKey: "asc" }],
  });
  return NextResponse.json(content);
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { pageKey, blockKey, content } = await req.json();

  if (!pageKey || !blockKey || content === undefined) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const updated = await prisma.pageContent.upsert({
    where: { pageKey_blockKey: { pageKey, blockKey } },
    update: { content },
    create: { pageKey, blockKey, content },
  });

  return NextResponse.json(updated);
}
