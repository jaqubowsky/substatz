import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DeleteAccountButton } from "./delete-account-button";

export function DeleteAccount() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Delete Account</CardTitle>
        <CardDescription>
          Permanently delete your account and all of your data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DeleteAccountButton />
      </CardContent>
    </Card>
  );
}
