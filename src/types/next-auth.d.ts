import { DefaultSession, Provider } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      email: string;
      id: string;
      name: string;
      image: string | null;
      provider: Provider;
    } & DefaultSession["user"];
  }
}
