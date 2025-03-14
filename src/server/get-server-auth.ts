import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export async function getServerAuth() {
  const session = await getServerSession(authOptions);
  return session;
}
