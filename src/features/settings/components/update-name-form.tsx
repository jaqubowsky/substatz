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
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useUpdateName } from "../hooks";
import { UpdateNameFormValues, updateNameSchema } from "../schemas/settings";

export function UpdateNameForm() {
  const { updateName, isLoading, error, success, reset } = useUpdateName();

  const form = useForm<UpdateNameFormValues>({
    resolver: zodResolver(updateNameSchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (success) {
      toast.success("Name updated successfully!");
      form.reset();
    }
    if (error) {
      toast.error(error);
    }
  }, [success, error, form]);

  const onSubmit = (data: UpdateNameFormValues) => {
    reset();
    updateName(data);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">Update Name</h3>
        <p className="text-sm text-muted-foreground">
          Change your display name
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Name"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
