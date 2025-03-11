"use client";

import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { Subscription } from "@prisma/client";
import {
  CalendarIcon,
  CreditCard,
  DollarSign,
  Loader2,
  Tag,
} from "lucide-react";
import { toast } from "sonner";
import {
  editSubscriptionSchema,
  EditSubscriptionValues,
} from "../schemas/subscription";
import { updateSubscriptionAction } from "../server/actions/subscription";

interface EditSubscriptionFormProps {
  subscription: Subscription;
  onSuccess: () => void;
}

const CATEGORIES = [
  "Entertainment",
  "Productivity",
  "Utilities",
  "Health & Fitness",
  "Education",
  "Food & Drink",
  "Shopping",
  "Other",
];

export const EditSubscriptionForm = ({
  subscription,
  onSuccess,
}: EditSubscriptionFormProps) => {
  const { form, action } = useHookFormAction(
    updateSubscriptionAction,
    zodResolver(editSubscriptionSchema),
    {
      actionProps: {
        onSuccess: () => {
          toast.success("Subscription updated successfully.");

          onSuccess?.();
        },
        onError: (error) => {
          toast.error(
            error.error.serverError || "Failed to update subscription."
          );
        },
      },
      formProps: {
        defaultValues: {
          ...subscription,
        },
      },
    }
  );

  const handleSubmitForm = (data: EditSubscriptionValues) => {
    action.execute({ ...data, id: subscription.id });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmitForm)}
        className="space-y-6"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1">
                <CreditCard className="h-3.5 w-3.5" />
                Subscription Name
              </FormLabel>
              <FormControl>
                <Input placeholder="Netflix, Spotify, etc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1">
                <DollarSign className="h-3.5 w-3.5" />
                Price
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="9.99"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1">
                <Tag className="h-3.5 w-3.5" />
                Category
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField
            control={form.control}
            name="billingCycle"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1">
                  <CreditCard className="h-3.5 w-3.5" />
                  Billing Cycle
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select billing cycle" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="MONTHLY">Monthly</SelectItem>
                    <SelectItem value="QUARTERLY">Quarterly</SelectItem>
                    <SelectItem value="BIANNUALLY">Biannually</SelectItem>
                    <SelectItem value="ANNUALLY">Annually</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1">
                  <CalendarIcon className="h-3.5 w-3.5" />
                  Start Date
                </FormLabel>
                <FormControl>
                  <DatePicker
                    date={field.value}
                    onSelect={(date) => {
                      if (date) {
                        field.onChange(date);
                      } else {
                        field.onChange("");
                      }
                    }}
                    placeholder="Select start date"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="isCancelled"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                  className="h-4 w-4 mt-1"
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Cancelled</FormLabel>
                <FormDescription>
                  Mark this subscription as cancelled
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={action.isPending}>
          {action.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            "Update Subscription"
          )}
        </Button>
      </form>
    </Form>
  );
};
