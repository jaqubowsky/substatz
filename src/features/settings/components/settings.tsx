"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Billing } from "./billing";
import { ChangePasswordForm } from "./change-password-form";
import { DeleteAccount } from "./delete-account";
import { UpdateNameForm } from "./update-name-form";

export function Settings() {
  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="account">
          <div className="grid gap-8">
            <Card>
              <CardContent className="pt-6">
                <UpdateNameForm />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <ChangePasswordForm />
              </CardContent>
            </Card>

            <Separator className="my-4" />

            <Card className="border-red-200">
              <CardContent className="pt-6">
                <DeleteAccount />
              </CardContent>
            </Card>
          </div>
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
}
