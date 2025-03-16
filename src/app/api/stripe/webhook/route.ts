import { sendSubscriptionThankYouEmail } from "@/lib/email";
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
    return NextResponse.json(
      { error: "Stripe webhook secret is not set" },
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

        const updatedUser = await updateUserPlan(
          paymentIntent.customer as string,
          SubscriptionPlan.PAID
        );

        try {
          await sendSubscriptionThankYouEmail(
            updatedUser.email as string,
            updatedUser.name as string
          );
        } catch (error) {
          console.error("Error sending subscription thank you email:", error);
        }

        console.log(
          `User ${updatedUser.email} upgraded to paid plan via subscription`
        );
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        if (!subscription.metadata?.userId) {
          console.error("Subscription has no user ID metadata");
          break;
        }

        await updateUserPlan(
          subscription.customer as string,
          SubscriptionPlan.FREE
        );

        console.log(
          `User ${subscription.metadata.userId} downgraded to free plan via subscription`
        );
      }
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error handling webhook event:", error);
    return NextResponse.json(
      { error: "Error handling webhook event" },
      { status: 500 }
    );
  }
}
