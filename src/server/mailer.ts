import { env } from "@/lib/env";
import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  host: env.EMAIL_SERVER_HOST,
  port: Number(env.EMAIL_SERVER_PORT),
  auth: {
    user: env.EMAIL_SERVER_USER,
    pass: env.EMAIL_SERVER_PASSWORD,
  },
  secure: env.NODE_ENV === "production",
});
