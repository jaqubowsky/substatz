import { verifyPassword } from "@/features/auth/lib/auth";
import {
  createUserFromOAuth,
  getUserByEmail,
} from "@/features/auth/server/db/user";
import { errors } from "@/lib/errorMessages";
import { Currency, Provider } from "@prisma/client";
import {
  type Account,
  type NextAuthOptions,
  type Session,
  type User,
} from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

interface CredentialsType {
  email: string;
  password: string;
}

interface ExtendedUser extends User {
  provider?: string;
  defaultCurrency?: Currency;
}

const credentialsConfig = {
  name: "Credentials",
  credentials: {
    email: { label: "Email", type: "email" },
    password: { label: "Password", type: "password" },
  },
  async authorize(
    credentials: CredentialsType | undefined
  ): Promise<ExtendedUser | null> {
    if (!credentials?.email || !credentials?.password) {
      throw new Error(errors.AUTH.EMAIL_AND_PASSWORD_REQUIRED.message);
    }

    const user = await getUserByEmail(credentials.email);
    if (!user) throw new Error(errors.AUTH.INVALID_CREDENTIALS.message);

    if (user.provider === Provider.GOOGLE && !user.password) {
      throw new Error(errors.AUTH.GOOGLE_ACCOUNT.message);
    }

    const isValid = await verifyPassword(
      credentials.password,
      user.password || ""
    );
    if (!isValid) throw new Error(errors.AUTH.INVALID_CREDENTIALS.message);

    if (!user.emailVerified) {
      throw new Error(errors.AUTH.EMAIL_NOT_VERIFIED.message);
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      provider: user.provider,
    };
  },
};

const googleConfig = {
  clientId: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
};

const authCallbacks = {
  async signIn({
    user,
    account,
  }: {
    user: ExtendedUser;
    account: Account | null;
  }) {
    if (!account || !user.email) return false;

    const existingUser = await getUserByEmail(user.email);
    const normalizedProvider = account.provider.toUpperCase();

    if (!existingUser) {
      const newUser = await createUserFromOAuth({
        email: user.email,
        name: user.name || "",
        image: user.image || "",
        emailVerified: new Date(),
      });

      user.id = newUser.id;
      user.defaultCurrency = newUser.defaultCurrency;
      return true;
    }

    if (existingUser.provider === normalizedProvider) {
      user.id = existingUser.id;
      user.defaultCurrency = existingUser.defaultCurrency;

      return true;
    }

    return false;
  },

  async jwt({
    token,
    user,
    account,
    trigger,
    session,
  }: {
    token: JWT;
    user?: ExtendedUser;
    account?: Account | null;
    trigger?: string;
    session?: Session;
  }) {
    console.log("JWT callback triggered:", { trigger, session });

    if (trigger === "update" && session?.user) {
      console.log("Updating token with:", session.user);
      return { ...token, ...session.user };
    }

    if (user) {
      token.id = user.id;
      token.provider = user.provider;
      token.defaultCurrency = user.defaultCurrency;
    }

    if (account && !token.provider) {
      token.provider = account.provider.toUpperCase();
    }

    return token;
  },

  async session({ session, token }: { session: Session; token: JWT }) {
    if (session.user) {
      session.user.id = token.id as string;
      session.user.provider = token.provider as string;
      session.user.defaultCurrency = token.defaultCurrency as Currency;
    }

    return session;
  },
};

const sessionConfig = {
  strategy: "jwt" as const,
  maxAge: 30 * 24 * 60 * 60, // 30 days
};

const cookieConfig = {
  sessionToken: {
    name:
      process.env.NODE_ENV === "production"
        ? `__Secure-next-auth.session-token`
        : `next-auth.session-token`,
    options: {
      httpOnly: true,
      sameSite: "lax" as const,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    },
  },
  callbackUrl: {
    name:
      process.env.NODE_ENV === "production"
        ? `__Secure-next-auth.callback-url`
        : `next-auth.callback-url`,
    options: {
      sameSite: "lax" as const,
      path: "/",
      secure: process.env.NODE_ENV === "production",
    },
  },
  csrfToken: {
    name:
      process.env.NODE_ENV === "production"
        ? `__Host-next-auth.csrf-token`
        : `next-auth.csrf-token`,
    options: {
      httpOnly: true,
      sameSite: "lax" as const,
      path: "/",
      secure: process.env.NODE_ENV === "production",
    },
  },
};

const pagesConfig = {
  signIn: "/login",
  signOut: "/",
  error: "/login",
};

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider(credentialsConfig),
    GoogleProvider(googleConfig),
  ],
  callbacks: authCallbacks,
  session: sessionConfig,
  pages: pagesConfig,
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
  cookies: cookieConfig,
};
