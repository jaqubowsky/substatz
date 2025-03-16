import {
  sendPaymentFailedEmail,
  sendSubscriptionThankYouEmail,
} from "@/lib/email";
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

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error("Stripe webhook secret is not set in environment variables");
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
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error("Error verifying webhook signature:", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;

        if (!paymentIntent.customer) {
          console.error("Payment intent has no customer ID");
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

        console.log(
          `User ${updatedUser.email} upgraded to paid plan via payment intent ${paymentIntent.id}`
        );
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

          console.log(
            `User with customer ID ${subscription.customer} upgraded to paid plan via subscription ${subscription.id}`
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

        console.log(
          `User with customer ID ${subscription.customer} downgraded to free plan via subscription ${subscription.id}`
        );
        break;
      }
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;

        console.log(
          `Payment failed for invoice ${invoice.id}, customer ${invoice.customer}`
        );

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
    console.error(`Error handling webhook event ${event.type}:`, error);
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
