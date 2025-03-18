import {
  sendPaymentFailedEmail,
  sendSubscriptionThankYouEmail,
} from "@/lib/email";
import { env } from "@/lib/env";
import { stripe } from "@/lib/stripe";
import { updateUserPlan } from "@/server/db/subscription-plan";
import { SubscriptionPlan } from "@prisma/client";
import * as Sentry from "@sentry/nextjs";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    Sentry.captureException(error, {
      level: "error",
      tags: {
        origin: "stripe_webhook_invalid_signature",
      },
    });

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
          const emailResult = await sendSubscriptionThankYouEmail(
            updatedUser.email,
            updatedUser.name
          );

          if (!emailResult?.success) {
            throw new Error("Failed to send subscription thank you email");
          }
        } catch (error) {
          Sentry.captureException(error, {
            level: "error",
            tags: {
              origin: "stripe_webhook_payment_succeeded",
            },
          });
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
          Sentry.captureException(error, {
            level: "error",
            tags: {
              origin: "stripe_webhook_invoice_payment_failed",
            },
          });
        }

        break;
      }
      default:
        Sentry.captureMessage(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true, event: event.type });
  } catch (error) {
    Sentry.captureException(error, {
      level: "error",
      tags: {
        origin: "stripe_webhook_unhandled_event",
      },
    });

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
