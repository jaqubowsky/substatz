import { env } from "./env";

export function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  return email.toLowerCase() === env.ADMIN_EMAIL.toLowerCase();
}

export function getAdminEmail(): string {
  return env.ADMIN_EMAIL;
}
