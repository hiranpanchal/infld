import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { unlink } from "fs/promises";
import path from "path";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const location = searchParams.get("location");

  const images = await prisma.siteImage.findMany({
    where: location ? { location } : undefined,
    orderBy: [{ location: "asc" }, { sortOrder: "asc" }],
  });

  return NextResponse.json(images);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { location, url, alt, label, sortOrder } = body;

  const image = await prisma.siteImage.create({
    data: {
      location,
      url,
      alt: alt || "",
      label: label || "",
      sortOrder: sortOrder ?? 0,
    },
  });

  return NextResponse.json(image, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const image = await prisma.siteImage.findUnique({ where: { id } });
  if (!image) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Try to delete the file from disk
  try {
    const filepath = path.join(process.cwd(), "public", image.url);
    await unlink(filepath);
  } catch {
    // File may not exist on disk, that's fine
  }

  await prisma.siteImage.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
