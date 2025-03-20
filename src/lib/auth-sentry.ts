import { User } from "@prisma/client";
import * as Sentry from "@sentry/nextjs";

export async function setSentryUserContext(user: Partial<User>) {
  Sentry.setUser({
    id: user.id,
    email: user.email,
  });
}

export function clearSentryUser() {
  Sentry.setUser(null);
}
