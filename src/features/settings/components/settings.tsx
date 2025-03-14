import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings as SettingsIcon } from "lucide-react";
import { Billing } from "./billing";
import { ChangePasswordForm } from "./change-password-form";
import { CurrencySettingsForm } from "./currency-settings-form";
import { DeleteAccount } from "./delete-account";

export const Settings = () => {
  return (
    <div className="container mx-auto px-4 h-full">
      <Card className="mb-6 border-none bg-transparent shadow-none">
        <CardHeader className="px-0">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-md">
                <SettingsIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-3xl font-bold text-foreground">
                  Settings
                </CardTitle>
                <CardDescription className="text-muted-foreground mt-1">
                  Manage your account settings and preferences
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="account" className="mt-8">
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
