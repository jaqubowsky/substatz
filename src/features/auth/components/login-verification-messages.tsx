import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, Info } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export const VerificationMessages = () => {
  const searchParams = useSearchParams();
  const [messages, setMessages] = useState({
    verification: searchParams.get("verification"),
    error: searchParams.get("error"),
    success: searchParams.get("success"),
  });

  useEffect(() => {
    setMessages({
      verification: searchParams.get("verification"),
      error: searchParams.get("error"),
      success: searchParams.get("success"),
    });
  }, [searchParams]);

  if (!messages.verification && !messages.error && !messages.success) {
    return null;
  }

  let alertContent = null;

  if (messages.verification === "pending") {
    alertContent = (
      <Alert variant="default" className="mb-4">
        <Info className="h-4 w-4" />
        <AlertTitle>Verification Required</AlertTitle>
        <AlertDescription className="!text-foreground/80">
          Please check your email to verify your account before logging in.
        </AlertDescription>
      </Alert>
    );
  }

  if (messages.error) {
    let errorMessage = "";

    switch (messages.error) {
      case "VERIFICATION_TOKEN_EXPIRED":
        errorMessage =
          "Verification link has expired or account already verified. Please try again";
        break;
      case "VERIFICATION_TOKEN_INVALID":
        errorMessage = "Invalid verification link. Please request a new one.";
        break;
      case "SERVER_ERROR":
        errorMessage = "An error occurred. Please try again later.";
        break;
      default:
        errorMessage = "Access denied. Please try again later.";
    }

    alertContent = (
      <Alert
        variant="destructive"
        className="mb-4 border-red-500 bg-red-50 text-red-700"
      >
        <AlertCircle className="h-4 w-4 text-red-500" />
        <AlertTitle>Verification Failed</AlertTitle>
        <AlertDescription className="!text-red-600">
          {errorMessage}
        </AlertDescription>
      </Alert>
    );
  }

  if (messages.success === "EMAIL_VERIFIED") {
    alertContent = (
      <Alert
        variant="default"
        className="mb-4 border-green-500 text-green-700 bg-green-50"
      >
        <CheckCircle className="h-4 w-4 text-green-500" />
        <AlertTitle>Success</AlertTitle>
        <AlertDescription className="!text-green-600">
          Email verified successfully! You can now log in.
        </AlertDescription>
      </Alert>
    );
  }

  return alertContent;
};
