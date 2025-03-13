import { verifyPassword } from "@/features/auth/lib/auth";
import {
  createUserFromOAuth,
  getUserByEmail,
  updateUserLastLogin,
} from "@/features/auth/server/db/user";
import { errors } from "@/lib/errorMessages";
import NextAuth, {
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
      image: user.image,
      provider: user.password ? "credentials" : "google",
    };
  },
};

const googleConfig = {
  clientId: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  authorization: {
    params: {
      prompt: "consent",
      access_type: "offline",
      response_type: "code",
    },
  },
};

const authCallbacks = {
  async signIn({ user, account }: { user: User; account: Account | null }) {
    if (account?.provider === "credentials") return true;
    if (!account || !user.email) return false;

    const existingUser = await getUserByEmail(user.email);
    if (existingUser) {
      await updateUserLastLogin(existingUser.id);
      return existingUser;
    }

    await createUserFromOAuth({
      email: user.email,
      name: user.name || "",
      image: user.image || "",
      emailVerified: new Date(),
    });

    return user;
  },

  async jwt({ token, user }: { token: JWT; user?: ExtendedUser }) {
    if (!user) return token;
    token.id = user.id;
    token.provider = user.provider;
    return token;
  },

  async session({ session, token }: { session: Session; token: JWT }) {
    if (!session.user) return session;
    session.user.id = token.id as string;
    session.user.provider = token.provider as string;
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

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
