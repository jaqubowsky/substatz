import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ZodError } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getFirstErrorMessage(error: ZodError): string {
  const formattedErrors = error.format();

  // Try to find the first field-specific error
  for (const [field, fieldError] of Object.entries(formattedErrors)) {
    // Skip the top-level _errors field
    if (field === "_errors") continue;

    // Check if the field error has _errors property
    if (
      fieldError &&
      typeof fieldError === "object" &&
      "_errors" in fieldError
    ) {
      const errors = fieldError._errors;
      if (Array.isArray(errors) && errors.length > 0) {
        return errors[0];
      }
    }
  }

  return "Invalid input data";
}
