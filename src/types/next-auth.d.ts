import { DefaultSession, Provider } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      email: string;
      id: string;
      name: string;
      image: string | null;
      provider: Provider;
      isAdmin: boolean;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    image?: string;
    provider?: Provider;
    isAdmin?: boolean;
  }
}
