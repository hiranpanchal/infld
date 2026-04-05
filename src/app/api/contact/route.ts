import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const { name, email, subject, message } = await req.json();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const msg = await prisma.contactMessage.create({
    data: { name, email, subject: subject ?? "", message },
  });

  return NextResponse.json({ success: true, id: msg.id });
}
