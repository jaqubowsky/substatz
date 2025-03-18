import { auth } from "@/auth";
import { User } from "@prisma/client";
import * as Sentry from "@sentry/nextjs";

/**
 * Sets the Sentry user context from the current session
 * Call this in layouts or protected routes to ensure Sentry
 * has user context for error reporting
 */
export async function setSentryUserFromSession() {
  const session = await auth();

  if (session?.user) {
    Sentry.setUser({
      id: session.user.id,
      email: session.user.email || undefined,
      username: session.user.name || undefined,
    });
    return true;
  } else {
    Sentry.setUser(null);
    return false;
  }
}

/**
 * Sets the Sentry user context from a user object
 */
export async function setSentryUserContext(user: Partial<User>) {
  Sentry.setUser({
    id: user.id,
    email: user.email,
    username: user.name,
  });
}

/**
 * Clear the Sentry user context
 */
export function clearSentryUser() {
  Sentry.setUser(null);
}
