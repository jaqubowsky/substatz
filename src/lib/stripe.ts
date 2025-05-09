import Stripe from "stripe";
import { env } from "./env";

export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  // @ts-expect-error Valid Stripe API version
  apiVersion: env.STRIPE_API_VER,
  typescript: true,
});
