# Specification: Export Subscription Data

## Goal
Enable premium users to export their subscription data to Excel or PDF format with date range filtering, providing users control over their data and supporting their financial planning needs.

## User Stories
- As a premium user, I want to export all my subscription data to Excel so that I can analyze it in spreadsheet software
- As a premium user, I want to export my subscriptions to PDF so that I can share or archive a readable record
- As a premium user, I want to filter exports by date range so that I can export only relevant subscriptions
- As a free user, I want to be redirected to upgrade when I try to export so that I understand this is a premium feature

## Core Requirements

### Functional Requirements
- Export all subscription fields: name, price, currency, category, billing cycle, start date, status (isCancelled), created date, updated date
- Support two export formats: Excel (XLSX) and PDF
- Include date range filtering with preset options: Last 30 days, Last 6 months, This year, All time, and custom range
- Filter based on subscription start date
- Include all subscriptions (active and cancelled) in exports
- Generate filename with format: `substatz-subscriptions-YYYY-MM-DD.xlsx` or `.pdf` (date = export date)
- Trigger direct download after format selection
- Redirect free users to Stripe checkout when attempting export
- Display bar loader during export generation
- Allow modal to be closed/cancelled at any time

### Non-Functional Requirements
- Verify user authentication and premium status server-side before export
- Only export data belonging to authenticated user
- Handle large datasets efficiently (users may have many subscriptions)
- Ensure modal is keyboard navigable with proper focus management
- Announce loading states to screen readers
- Handle cases where user has no subscriptions gracefully
- Validate date range inputs and show error messages in modal if export fails

## Visual Design
No mockups provided. Follow existing Settings page patterns:
- Use Card layout consistent with Currency Settings and other settings components
- Position Export Data section below Currency Settings in Account tab
- Use Dialog component for modal UI
- Use ShadCN UI components for consistency with application design
- Implement responsive layout that works on mobile and desktop

## Reusable Components

### Existing Code to Leverage
**UI Components:**
- `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription` from `src/components/ui/dialog.tsx`
- `DateRangePicker` from `src/components/ui/date-picker.tsx`
- `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent` from `src/components/ui/card.tsx`
- `Button` from `src/components/ui/button.tsx`
- `Select` components from `src/components/ui/select.tsx` for format selection
- Bar loader indicator component (if available) or implement using progress component

**Authentication & Authorization:**
- `getServerAuth` from `@/hooks/get-server-auth` for server-side auth check
- `SubscriptionPlan` enum from `@prisma/client` for plan verification
- `createCheckoutSessionAction` from `@/server/actions/subscription-plan` for Stripe redirect
- `useAction` hook from `next-safe-action/hooks` for client-side action handling

**Data Access:**
- `getSubscriptionsByUserId` from `src/features/dashboard/server/db/subscription.ts` for fetching subscriptions
- `Subscription` model from Prisma schema (no changes needed)

**Patterns to Follow:**
- Server Actions pattern from `src/features/settings/server/actions/index.ts` using `privateAction`
- Feature-based architecture in `src/features/settings/`
- Client component pattern with "use client" directive for interactive UI
- Form validation with Zod schemas in `src/features/settings/schemas/`
- Toast notifications using `sonner` for success/error messages
- Settings page layout from `src/features/settings/components/settings.tsx`

### New Components Required
**Export Data Section Component:**
- New Card-based section component in settings to display "Export Data" feature
- Wraps export button and triggers modal
- Needs client interactivity for button click and modal state management

**Export Modal Component:**
- Dialog containing date range filter, preset options, format selection, and export button
- Manages local state for date range and selected format
- Handles export action execution with loading state
- Shows bar loader during export processing
- Cannot reuse ConfirmationDialog as it has different UI requirements (filters + format selection)

**Export Server Action:**
- New server action to handle export generation
- Fetches user subscriptions with date filtering
- Generates Excel file using xlsx library
- Generates PDF file using @react-pdf/renderer
- Returns file blob or download URL
- Required because no existing action handles file generation/export

**Export Schema:**
- Zod schema for validating export request (date range, format)
- Ensures date range is valid (from date before to date)
- Validates format is either 'excel' or 'pdf'

## Technical Approach

### Database
- No schema changes required
- Use existing `Subscription` model from Prisma
- Query subscriptions filtered by `startDate` within selected date range
- Filter by `userId` to ensure data isolation

### API / Server Actions
**New Server Action: `exportSubscriptionsAction`**
- Location: `src/features/settings/server/actions/export-subscriptions.ts`
- Use `privateAction` pattern for authentication
- Accept schema: `{ dateFrom: Date | null, dateTo: Date | null, format: 'excel' | 'pdf' }`
- Verify user has PAID plan; throw ActionError if FREE
- Fetch subscriptions using `getSubscriptionsByUserId` with date filtering
- Generate file based on format:
  - Excel: Use xlsx library to create workbook with subscription data
  - PDF: Use @react-pdf/renderer to generate table layout
- Return file blob or base64 encoded data for download
- Handle errors: no subscriptions, invalid date range, file generation failures

**Validation Schema:**
- Location: `src/features/settings/schemas/export.ts`
- Define Zod schema for export request validation
- Validate dates are valid Date objects or null
- Ensure dateFrom is before dateTo if both provided
- Validate format is 'excel' or 'pdf' enum

### Frontend
**Component Structure:**
```
src/features/settings/components/
  ├── export-data-section.client.tsx    # Card wrapper with export button
  ├── export-modal.client.tsx           # Dialog with filters and format selection
  └── index.ts                          # Export barrel file
```

**Export Data Section (`export-data-section.client.tsx`):**
- Client component
- Check user plan from session prop
- If FREE: clicking button calls `createCheckoutSessionAction` to redirect to Stripe
- If PAID: clicking button opens export modal
- Display Card with title "Export Data", description, and "Export Subscriptions" button

**Export Modal (`export-modal.client.tsx`):**
- Client component with Dialog
- State: `dateRange` (from/to), `selectedFormat` ('excel'|'pdf'), `isExporting` (boolean)
- UI elements:
  - Date range preset buttons (Last 30 days, Last 6 months, This year, All time)
  - DateRangePicker for custom range
  - Format selector (Select or radio buttons for Excel/PDF)
  - Export button
  - Bar loader shown when `isExporting` is true
- On export button click:
  - Call `exportSubscriptionsAction` with selected params
  - Show bar loader
  - On success: trigger file download, show success toast, close modal
  - On error: show error toast in modal
- Handle no subscriptions case: show message in modal

**Integration in Settings Page:**
- Update `src/features/settings/components/settings.tsx`
- Add `<ExportDataSection />` in Account tab CardContent after CurrencySettingsForm
- Pass user session data as prop for plan checking

### Libraries
**Add New Dependencies:**
- `xlsx` - For Excel file generation
- `@react-pdf/renderer` - For PDF document generation

**Package Installation:**
```bash
npm install xlsx @react-pdf/renderer
npm install --save-dev @types/xlsx
```

### Testing
While no automated tests are required initially, manual testing should cover:
- Premium users can open modal and see all options
- Free users are redirected to Stripe checkout
- Date range presets correctly filter subscriptions
- Custom date range filtering works correctly
- Excel export downloads with correct data and format
- PDF export downloads with correct data and formatting
- Loading state shows during export generation
- Error handling for no subscriptions, invalid dates, and generation failures
- Modal can be closed at any time
- Keyboard navigation works throughout

## Out of Scope
- Custom field selection (choosing which columns to export)
- Email delivery of exports
- Scheduled or automatic exports
- Export history or tracking
- Export templates or custom formatting options
- Currency conversion in exports
- Summary statistics or calculated fields in export files
- Sharing exports with other users
- CSV export format
- Bulk export for multiple users (admin feature)

## Success Criteria
- Premium users can successfully export subscription data to Excel format
- Premium users can successfully export subscription data to PDF format
- Date range filtering accurately filters subscriptions by start date
- Free users are redirected to Stripe checkout when attempting export
- Export files have proper naming convention with current date
- All subscription fields are included in export (no data loss)
- Loading states provide clear feedback during export generation
- Modal is accessible via keyboard navigation
- Export feature integrates seamlessly with existing Settings page layout
- Error states are handled gracefully with user-friendly messages
