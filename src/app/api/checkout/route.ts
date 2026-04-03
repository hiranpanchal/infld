import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

interface CheckoutItem {
  productId: string;
  productName: string;
  size: string;
  quantity: number;
  price: number; // pence
  image: string;
}

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-03-25.dahlia",
  });

  const { items } = (await req.json()) as { items: CheckoutItem[] };

  if (!items || items.length === 0) {
    return NextResponse.json({ error: "No items" }, { status: 400 });
  }

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map(
    (item) => ({
      price_data: {
        currency: "gbp",
        product_data: {
          name: `${item.productName} (${item.size})`,
        },
        unit_amount: item.price,
      },
      quantity: item.quantity,
    })
  );

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: lineItems,
    shipping_address_collection: {
      allowed_countries: ["GB"],
    },
    metadata: {
      items: JSON.stringify(
        items.map((i) => ({
          productId: i.productId,
          productName: i.productName,
          size: i.size,
          quantity: i.quantity,
          price: i.price,
        }))
      ),
    },
    success_url: `${req.nextUrl.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${req.nextUrl.origin}/checkout/cancelled`,
  });

  return NextResponse.json({ url: session.url });
}
