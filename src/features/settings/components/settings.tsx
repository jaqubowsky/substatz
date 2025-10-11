import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getServerAuth } from "@/hooks/get-server-auth";
import { Provider, SubscriptionPlan } from "@prisma/client";
import { CurrencySettingsForm } from "./currency-settings-form";
import { DeleteAccount } from "./delete-account";
import { Billing } from "./billing";
import dynamic from "next/dynamic";

const DynamicChangePasswordForm = dynamic(() =>
  import("./change-password-form").then((mod) => mod.ChangePasswordForm)
);

const DynamicExportDataSection = dynamic(() =>
  import("./export-data-section.client").then((mod) => mod.ExportDataSection)
);

export const Settings = async () => {
  const session = await getServerAuth();
  if (!session) throw new Error("User not found");

  return (
    <div className="container mx-auto px-4 py-6 h-full">
      <Tabs defaultValue="account">
        <TabsList className="mb-6">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="account">
          <Card>
            {session.user.provider === Provider.CREDENTIALS && (
              <CardContent className="pt-6">
                <DynamicChangePasswordForm />
              </CardContent>
            )}
            <CardContent className="pt-6">
              <CurrencySettingsForm
                defaultCurrency={session.user.defaultCurrency}
              />
            </CardContent>
            <CardContent className="pt-6">
              <DynamicExportDataSection userPlan={session.user.plan} />
            </CardContent>
            <CardContent className="pt-6">
              <DeleteAccount />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card>
            <CardContent className="pt-6">
              <Billing isPro={session.user.plan === SubscriptionPlan.PAID} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
