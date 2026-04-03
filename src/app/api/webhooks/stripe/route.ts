import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-03-25.dahlia",
  });
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: `Webhook error: ${message}` },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // Check if order already exists
    const existing = await prisma.order.findUnique({
      where: { stripeSessionId: session.id },
    });
    if (existing) {
      return NextResponse.json({ received: true });
    }

    const items = JSON.parse(session.metadata?.items || "[]") as Array<{
      productId: string;
      productName: string;
      size: string;
      quantity: number;
      price: number;
    }>;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const shipping = (session as any).shipping_details as
      | { address?: { line1?: string; city?: string; postal_code?: string; country?: string } }
      | null
      | undefined;
    const orderNumber = `INFLD-${Date.now().toString(36).toUpperCase()}`;

    await prisma.order.create({
      data: {
        orderNumber,
        status: "paid",
        customerEmail: session.customer_details?.email || "",
        customerName: session.customer_details?.name || "",
        shippingAddress: shipping?.address?.line1 || "",
        shippingCity: shipping?.address?.city || "",
        shippingPostcode: shipping?.address?.postal_code || "",
        shippingCountry: shipping?.address?.country || "GB",
        totalPence: session.amount_total || 0,
        stripeSessionId: session.id,
        stripePaymentId: session.payment_intent as string,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            productName: item.productName,
            size: item.size,
            quantity: item.quantity,
            pricePence: item.price,
          })),
        },
      },
    });
  }

  return NextResponse.json({ received: true });
}
