import {
  sendPaymentFailedEmail,
  sendSubscriptionThankYouEmail,
} from "@/lib/email";
import { env } from "@/lib/env";
import { stripe } from "@/lib/stripe";
import { updateUserPlan } from "@/server/db/subscription-plan";
import { SubscriptionPlan } from "@prisma/client";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature") as string;

  if (!env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;

        if (!paymentIntent.customer) {
          return NextResponse.json(
            { error: "Invalid payment intent data" },
            { status: 400 }
          );
        }

        const updatedUser = await updateUserPlan(
          paymentIntent.customer as string,
          SubscriptionPlan.PAID
        );

        try {
          if (updatedUser.email && updatedUser.name) {
            await sendSubscriptionThankYouEmail(
              updatedUser.email,
              updatedUser.name
            );
          }
        } catch (error) {
          console.error("Error sending subscription thank you email:", error);
        }

        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;

        if (subscription.status === "active") {
          await updateUserPlan(
            subscription.customer as string,
            SubscriptionPlan.PAID
          );
        }
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        await updateUserPlan(
          subscription.customer as string,
          SubscriptionPlan.FREE
        );

        break;
      }
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;

        try {
          await sendPaymentFailedEmail(invoice.customer_email as string);
        } catch (error) {
          console.error("Error sending payment failed email:", error);
        }

        break;
      }
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true, event: event.type });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Error handling webhook event",
        event: event.type,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
