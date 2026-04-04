import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("stripe-signature");

    // Placeholder: real implementation requires STRIPE_WEBHOOK_SECRET
    console.log(
      "Stripe webhook received. Configure STRIPE_WEBHOOK_SECRET for production.",
      { bodyLength: rawBody.length, hasSignature: !!signature }
    );

    return NextResponse.json(
      {
        received: true,
        message:
          "Webhook endpoint ready. Configure STRIPE_WEBHOOK_SECRET for production.",
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
