import { auth } from "@/auth";
import { getMigrations, MigrationPanel } from "@/features/admin";
import { isAdmin } from "@/lib/admin";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user?.email || !isAdmin(session.user.email)) {
    redirect("/dashboard");
  }

  const { migrations } = await getMigrations();

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
        <p className="text-muted-foreground">
          Manage database migrations and system administration
        </p>
      </div>

      <MigrationPanel initialMigrations={migrations} />
    </div>
  );
}
