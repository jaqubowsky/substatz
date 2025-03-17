import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Billing } from "./billing";
import { ChangePasswordForm } from "./change-password-form";
import { CurrencySettingsForm } from "./currency-settings-form";
import { DeleteAccount } from "./delete-account";

export const Settings = () => {
  return (
    <div className="container mx-auto px-4 py-6 h-full">
      <Tabs defaultValue="account">
        <TabsList className="mb-6">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="account">
          <Card>
            <CardContent className="pt-6">
              <ChangePasswordForm />
            </CardContent>
            <CardContent className="pt-6">
              <CurrencySettingsForm />
            </CardContent>
            <CardContent className="pt-6">
              <DeleteAccount />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card>
            <CardContent className="pt-6">
              <Billing />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
