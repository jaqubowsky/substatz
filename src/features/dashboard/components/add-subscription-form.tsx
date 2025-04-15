"use client";

import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Form,
  FormControl,
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
import {
  addSubscriptionSchema,
  AddSubscriptionValues,
} from "@/features/dashboard/schemas";
import { addSubscriptionAction } from "@/features/dashboard/server/actions";
import { currencySymbols } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { BillingCycle, Currency } from "@prisma/client";
import {
  CalendarIcon,
  CreditCard,
  DollarSign,
  Loader2,
  Tag,
} from "lucide-react";
import { toast } from "sonner";

interface AddSubscriptionFormProps {
  onSuccess: () => void;
}

const defaultValues: AddSubscriptionValues = {
  name: "",
  price: 0,
  currency: Currency.USD,
  category: "",
  billingCycle: BillingCycle.MONTHLY,
  startDate: new Date(),
  isCancelled: false,
};

export const AddSubscriptionForm = ({
  onSuccess,
}: AddSubscriptionFormProps) => {
  const { form, action, handleSubmitWithAction } = useHookFormAction(
    addSubscriptionAction,
    zodResolver(addSubscriptionSchema),
    {
      actionProps: {
        onSuccess: () => {
          toast.success("Subscription added successfully.");

          onSuccess?.();
        },
        onError: (error) => {
          toast.error(error.error.serverError || "Failed to add subscription.");
        },
      },
      formProps: {
        defaultValues,
      },
    }
  );

  const categories = [
    "Entertainment",
    "Productivity",
    "Utilities",
    "Health & Fitness",
    "Education",
    "Food & Drink",
    "Shopping",
    "Other",
  ];

  return (
    <Form {...form}>
      <form onSubmit={handleSubmitWithAction} className="space-y-6">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
            name="currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1">
                  <DollarSign className="h-3.5 w-3.5" />
                  Currency
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a currency" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(currencySymbols).map(([code, symbol]) => (
                      <SelectItem key={code} value={code}>
                        {symbol} {code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
                  {categories.map((category) => (
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

        <div className="pt-4">
          <Button type="submit" className="w-full" disabled={action.isPending}>
            {action.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              "Add Subscription"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
