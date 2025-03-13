export const errors = {
  AUTH: {
    GOOGLE_ACCOUNT: {
      message: "Account is using Google. Please use Google to login.",
    },
    INVALID_CREDENTIALS: {
      message:
        "Invalid credentials provided. Please check your email and password.",
    },
    EMAIL_IN_USE: {
      message: "Email is already in use. Please use a different email.",
    },
    EMAIL_AND_PASSWORD_REQUIRED: {
      message: "Email and password are required. Please provide both.",
    },
    UNAUTHORIZED: {
      message: "Unauthorized. Please log in to continue.",
    },
    EMAIL_NOT_VERIFIED: {
      message: "Email not verified. Please verify your email to continue.",
    },
    USER_NOT_FOUND: {
      message: "User not found. Please check your credentials.",
    },
    VERIFICATION_TOKEN_EXPIRED: {
      message:
        "Verification token expired or account already verified. Please try again",
    },
    VERIFICATION_TOKEN_INVALID: {
      message: "Verification token invalid. Please request a new one.",
    },
    VERIFICATION_EMAIL_ERROR: {
      message: "Failed to send verification email. Please try again later.",
    },
  },
  SUBSCRIPTION: {
    INVALID_SUBSCRIPTION_DATA: {
      message: "Invalid subscription data provided. Please check your input.",
    },
    NO_SUBSCRIPTION: {
      message: "No subscription found. Please add a subscription to continue.",
    },
    NO_UPCOMING_PAYMENTS: {
      message:
        "No upcoming payments found. Please add a subscription to continue.",
    },
    NO_SUBSCRIPTIONS: {
      message: "No subscriptions found. Please add a subscription to continue.",
    },
    PERMISSION_ERROR: {
      message: "Permission error. Please check your permissions.",
    },
  },
  USER: {
    NOT_FOUND: {
      message: "User not found. Please check your credentials.",
    },
    INVALID_PASSWORD: {
      message: "Invalid password. Please check your credentials.",
    },
  },
  GENERAL: {
    NETWORK_ERROR: {
      message: "Network error. Please check your connection and try again.",
    },
    SERVER_ERROR: {
      message: "An unexpected error occurred. Please try again later.",
    },
    VALIDATION_ERROR: {
      message: "Invalid data provided. Please check your input.",
    },
  },
};
