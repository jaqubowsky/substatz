"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useClientAuth } from "@/hooks/use-client-auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { Currency } from "@prisma/client";
import { DollarSign, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { currencySymbols } from "../../dashboard/schemas/subscription";
import { updateCurrencySchema } from "../schemas/currency";
import { updateCurrencyAction } from "../server/actions/currency";

export const CurrencySettingsForm = () => {
  const { user } = useClientAuth();
  const { update } = useSession();

  const { form, handleSubmitWithAction } = useHookFormAction(
    updateCurrencyAction,
    zodResolver(updateCurrencySchema),
    {
      actionProps: {
        onSuccess: ({ input }) => {
          toast.success("Default currency updated successfully.");

          update({
            user: {
              defaultCurrency: input.defaultCurrency,
            },
          });
        },
        onError: (error) => {
          toast.error(
            error.error.serverError || "Failed to update default currency."
          );
        },
      },
      formProps: {
        defaultValues: {
          defaultCurrency: user?.defaultCurrency || Currency.USD,
        },
      },
    }
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Currency Settings</CardTitle>
        <CardDescription>
          Set your default currency for displaying subscription costs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            id="currency-form"
            onSubmit={handleSubmitWithAction}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="defaultCurrency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    <DollarSign className="h-3.5 w-3.5" />
                    Default Currency
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
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <Button
          type="submit"
          form="currency-form"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            "Update Currency"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
