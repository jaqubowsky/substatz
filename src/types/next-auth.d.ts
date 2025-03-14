import { Currency } from "@prisma/client";
import "next-auth";
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image?: string;
      provider: string;
      defaultCurrency: Currency;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
  }
}
