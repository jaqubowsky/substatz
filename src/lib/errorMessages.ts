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
    RATE_LIMIT: {
      message: "Too many requests. Please try again later.",
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
    PASSWORD_RESET_EMAIL_ERROR: {
      message: "Failed to send password reset email. Please try again later.",
    },
    RESET_TOKEN_INVALID: {
      message: "Reset token invalid or expired. Please request a new one.",
    },
    CSRF_ERROR: {
      message:
        "Security verification failed. Please refresh the page and try again.",
    },
    SESSION_EXPIRED: {
      message: "Your session has expired. Please log in again to continue.",
    },
  },
  SUBSCRIPTION: {
    INVALID_SUBSCRIPTION_DATA: {
      message: "Invalid subscription data provided. Please check your input.",
    },
    NO_SUBSCRIPTION: {
      message: "No subscription found. Please add a subscription to continue.",
    },
    ALREADY_PAID: {
      message:
        "You already have a paid subscription. Please relogin if error persists.",
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
    CHECKOUT_SESSION_NOT_FOUND: {
      message: "Checkout session not found. Please provide a valid session ID.",
    },
    CHECKOUT_SESSION_NOT_BELONG_TO_USER: {
      message: "Checkout session does not belong to this user.",
    },
    PAYMENT_STATUS_IS: {
      message:
        "Payment status is {{status}}. Please try again or contact support.",
    },
    NO_SUBSCRIPTIONS_TO_EXPORT: {
      message:
        "No subscriptions found to export. Please add subscriptions first.",
    },
    EXPORT_GENERATION_FAILED: {
      message: "Failed to generate export file. Please try again later.",
    },
    EXPORT_PREMIUM_ONLY: {
      message:
        "Export feature is only available for premium users. Please upgrade your plan.",
    },
  },
  USER: {
    GOOGLE_PROVIDER: {
      message:
        "Google provider not supported. Please use a different provider.",
    },
    NO_STRIPE_CUSTOMER_ID: {
      message:
        "No Stripe customer ID found. Please add a subscription to continue.",
    },
    NOT_FOUND: {
      message: "User not found. Please check your credentials.",
    },
    INVALID_PASSWORD: {
      message: "Invalid password. Please check your credentials.",
    },
    NO_PASSWORD: {
      message:
        "No password set up for this account. Use your provider to login.",
    },
  },
  MIGRATION: {
    LOCK_ACQUISITION_FAILED: {
      message: "Another migration is currently in progress. Please wait and try again.",
    },
    DATABASE_CONNECTION_ERROR: {
      message: "Failed to connect to database. Please check your configuration and try again.",
    },
    MIGRATION_FILE_NOT_FOUND: {
      message: "Migration file not found. Please check your migration files.",
    },
    MIGRATION_SQL_INVALID: {
      message: "Invalid migration SQL syntax. Please check your migration file.",
    },
    MIGRATION_ALREADY_APPLIED: {
      message: "Migration has already been applied to the database.",
    },
    MIGRATION_FAILED: {
      message: "Migration failed to execute. Please check the migration SQL and try again.",
    },
    DATABASE_RESET_FAILED: {
      message: "Failed to reset database. Please check your permissions and try again.",
    },
    NO_MIGRATIONS_FOUND: {
      message: "No migration files found. Please create migration files first.",
    },
    ROLLBACK_NOT_SUPPORTED: {
      message: "Rollback functionality is not yet implemented.",
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
    RATE_LIMIT: {
      message: "Too many requests. Please try again later.",
    },
    MAINTENANCE: {
      message:
        "The system is currently under maintenance. Please try again later.",
    },
    FORBIDDEN: {
      message: "You don't have permission to perform this action.",
    },
  },
};
