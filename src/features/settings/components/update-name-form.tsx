"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useClientAuth } from "@/hooks/use-client-auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { toast } from "sonner";
import { UpdateNameFormValues, updateNameSchema } from "../schemas/settings";
import { updateNameAction } from "../server/actions/settings";

const defaultValues: UpdateNameFormValues = {
  name: "",
};

export function UpdateNameForm() {
  const { updateSession } = useClientAuth();

  const { form, handleSubmitWithAction } = useHookFormAction(
    updateNameAction,
    zodResolver(updateNameSchema),
    {
      actionProps: {
        onSuccess: ({ data }) => {
          toast.success("Name updated successfully!");

          updateSession({
            name: data.name,
          });
        },
        onError: (data) => {
          toast.error(data.error.serverError || "An error occurred");
        },
      },
      formProps: {
        defaultValues,
      },
    }
  );
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">Update Name</h3>
        <p className="text-sm text-muted-foreground">
          Change your display name
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={handleSubmitWithAction} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Updating..." : "Update Name"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
