import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

interface CartItem {
  productId: string;
  productName: string;
  size: string;
  quantity: number;
  price: number; // pence
}

const PAYPAL_BASE =
  process.env.PAYPAL_ENV === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

async function getAccessToken(): Promise<string> {
  const creds = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString("base64");

  const res = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${creds}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });

  const data = await res.json();
  if (!data.access_token) throw new Error("Failed to get PayPal token");
  return data.access_token as string;
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { action } = body as { action: string };

  try {
    if (action === "create") {
      return await createOrder(body.items as CartItem[], req);
    }
    if (action === "capture") {
      return await captureOrder(body.orderID as string, body.items as CartItem[]);
    }
    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (err) {
    console.error("[PayPal]", err);
    return NextResponse.json({ error: "PayPal error" }, { status: 500 });
  }
}

async function createOrder(items: CartItem[], req: NextRequest) {
  const token = await getAccessToken();

  const totalGBP = (
    items.reduce((sum, i) => sum + i.price * i.quantity, 0) / 100
  ).toFixed(2);

  const origin = req.nextUrl.origin;

  const res = await fetch(`${PAYPAL_BASE}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "GBP",
            value: totalGBP,
            breakdown: {
              item_total: { currency_code: "GBP", value: totalGBP },
            },
          },
          items: items.map((i) => ({
            name: `${i.productName} — ${i.size}`,
            quantity: String(i.quantity),
            unit_amount: {
              currency_code: "GBP",
              value: (i.price / 100).toFixed(2),
            },
          })),
        },
      ],
      application_context: {
        brand_name: "INFLD",
        shipping_preference: "GET_FROM_FILE",
        user_action: "PAY_NOW",
        return_url: `${origin}/checkout/success`,
        cancel_url: `${origin}/checkout/cancelled`,
      },
    }),
  });

  const order = await res.json();
  if (!order.id) {
    console.error("[PayPal create]", JSON.stringify(order));
    throw new Error("Order creation failed");
  }

  return NextResponse.json({ id: order.id });
}

async function captureOrder(orderID: string, items: CartItem[]) {
  const token = await getAccessToken();

  const res = await fetch(
    `${PAYPAL_BASE}/v2/checkout/orders/${orderID}/capture`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  const capture = await res.json();

  if (capture.status !== "COMPLETED") {
    console.error("[PayPal capture]", JSON.stringify(capture));
    return NextResponse.json({ error: "Payment not completed" }, { status: 400 });
  }

  const unit = capture.purchase_units?.[0];
  const payer = capture.payer;
  const shipping = unit?.shipping;
  const captureId = unit?.payments?.captures?.[0]?.id ?? orderID;

  const orderNumber = `INFLD-${Date.now().toString(36).toUpperCase()}`;

  const order = await prisma.order.create({
    data: {
      orderNumber,
      status: "paid",
      customerEmail: payer?.email_address ?? "",
      customerName:
        shipping?.name?.full_name ??
        `${payer?.name?.given_name ?? ""} ${payer?.name?.surname ?? ""}`.trim(),
      shippingAddress: shipping?.address?.address_line_1 ?? "",
      shippingCity: shipping?.address?.admin_area_2 ?? "",
      shippingPostcode: shipping?.address?.postal_code ?? "",
      shippingCountry: shipping?.address?.country_code ?? "GB",
      totalPence: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      paypalOrderId: captureId,
      items: {
        create: items.map((i) => ({
          productId: i.productId,
          productName: i.productName,
          size: i.size,
          quantity: i.quantity,
          pricePence: i.price,
        })),
      },
    },
  });

  return NextResponse.json({ success: true, orderNumber: order.orderNumber });
}
