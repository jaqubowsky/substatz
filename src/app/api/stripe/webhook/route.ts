import {
  sendPaymentFailedEmail,
  sendRefundFeedbackEmail,
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

      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;

        try {
          await sendRefundFeedbackEmail(charge.receipt_email as string);
        } catch (error) {
          Sentry.captureException(error, {
            level: "error",
            tags: {
              origin: "stripe_webhook_charge_refunded",
            },
          });
        }

        await updateUserPlan(charge.customer as string, SubscriptionPlan.FREE);
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        await updateUserPlan(
          subscription.customer as string,
          SubscriptionPlan.FREE
        );

        break;
      }
      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;

        try {
          await sendPaymentFailedEmail(paymentIntent.customer as string);
        } catch (error) {
          Sentry.captureException(error, {
            level: "error",
            tags: {
              origin: "stripe_webhook_payment_intent_payment_failed",
            },
          });
        }

        break;
      }
      default:
        break;
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
