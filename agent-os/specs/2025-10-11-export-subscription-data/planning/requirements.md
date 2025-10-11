# Spec Requirements: Export Subscription Data

## Initial Description
I would like to implement a feature where we can export our all existing subscription data we've added, this feature should be only after purchasing subscription, it should be allowed to export to excel or pdf where these options should be available to select after modal opens, it should be placed in the settings tab

## Requirements Discussion

### First Round Questions

**Q1:** I assume we should export all subscription fields (name, price, currency, category, billing cycle, start date, status). Should we also include calculated fields like "next payment date" and "monthly cost equivalent", or just the raw data?
**Answer:** All subscription fields, no manually calculated

**Q2:** I'm thinking we should add a new "Export Data" button or section within the Settings page's "Account" tab (below Currency Settings). Should this be a standalone section, or would you prefer it in the "Billing" tab since it's premium-only?
**Answer:** Below currency tab

**Q3:** I assume the flow is: Click "Export Data" → Modal opens with two options (Excel/PDF) as radio buttons or separate action buttons → User selects format → Download begins. Should there be any preview or confirmation step, or is direct download after selection acceptable?
**Answer:** Direct download ok

**Q4:** Since this is premium-only, I assume free users should see the button but get the existing paywall/upgrade prompt when clicking it. Or should we hide the button entirely for free users?
**Answer:** When user is not paid it should redirect to stripe

**Q5:** I'm thinking the filename should be something like `substatz-subscriptions-2025-10-11.xlsx` or `.pdf`. Should we include the user's name or any other identifier in the filename?
**Answer:** That's fine

**Q6:** For the PDF export, should it be a simple table layout similar to Excel, or would you like a more formatted report-style document with summary statistics (total monthly cost, categories breakdown)?
**Answer:** We can use react-pdf

**Q7:** Should we include cancelled subscriptions in the export, or only active ones? Or perhaps give users a filter option in the modal?
**Answer:** All of the subs

**Q8:** I assume we need a loading spinner in the modal while generating the file (especially for PDF). Is that correct?
**Answer:** It can be like bar loader

**Q9:** Is there anything explicitly out of scope for this first version? (e.g., date range filtering, custom field selection, email delivery of export, scheduled exports)
**Answer:** Date range filtering will be ok

### Existing Code to Reference

**Similar Features Identified:**
- Feature: Settings Components - Path: `src/features/settings/`
- UI Components to reuse: `src/components/`
- Modal patterns: `src/components/ui/dialog.tsx`, `src/components/ui/confirmation-dialog.tsx`
- Paywall component: `src/components/paywall.tsx`
- Settings layout: `src/features/settings/components/settings.tsx`
- Subscription data queries: `src/features/dashboard/server/db/subscription.ts`

### Follow-up Questions

**Follow-up 1:** You mentioned date range filtering is okay to include. Should the date range filter be in the export modal, and should it filter based on the subscription's start date or created date? Should there be preset options like "Last 30 days", "Last 6 months", etc.?
**Answer:** Based on sub start date, we can add preset options

## Visual Assets

### Files Provided:
No visual assets provided.

## Requirements Summary

### Functional Requirements

**Export Feature:**
- Export all user subscription data to Excel or PDF format
- Include all subscription fields from database:
  - Name
  - Price
  - Currency
  - Category
  - Billing Cycle
  - Start Date
  - Status (isCancelled)
  - Created Date
  - Updated Date
- Export includes ALL subscriptions (both active and cancelled)
- No calculated/derived fields (e.g., next payment date, monthly equivalent)

**User Interface:**
- Add "Export Data" section in Settings page, Account tab
- Position below the Currency Settings component
- Export button triggers modal with format selection
- Modal contains:
  - Date range filter with preset options (Last 30 days, Last 6 months, This year, All time)
  - Custom date range picker
  - Format selection (Excel or PDF)
  - Export button
- Date filtering based on subscription **start date**
- Direct download after format selection (no preview step)
- Bar loader indicator during export generation

**Access Control:**
- Feature is premium-only (requires PAID subscription plan)
- Free users: redirect to Stripe checkout when attempting to export
- Paid users: full access to export functionality

**File Generation:**
- Excel format: Standard spreadsheet with column headers
- PDF format: Use react-pdf library for generation
- Filename format: `substatz-subscriptions-YYYY-MM-DD.xlsx` or `.pdf`
- Date in filename is the export date (current date)

### Non-Functional Requirements

**Performance:**
- Show loading indicator during file generation
- Handle large datasets efficiently (consider user could have many subscriptions)

**Security:**
- Verify user authentication before allowing export
- Verify premium subscription status via server-side check
- Only export data belonging to authenticated user

**User Experience:**
- Clear visual feedback during export process (bar loader)
- Instant download after generation
- Modal can be closed/cancelled at any time

### Reusability Opportunities

**Existing Components to Leverage:**
- `Dialog` component for modal UI (`src/components/ui/dialog.tsx`)
- `DatePicker` component for date range selection (`src/components/ui/date-picker.tsx`)
- Settings page layout structure (`src/features/settings/components/settings.tsx`)
- Subscription data queries (`src/features/dashboard/server/db/subscription.ts`)
- Authentication check patterns (`@/hooks/get-server-auth`)
- User plan verification logic (from `@prisma/client` SubscriptionPlan enum)

**Existing Patterns to Follow:**
- Feature-based architecture in `src/features/settings/`
- Server Actions for backend operations
- Client components for interactive UI ("use client")
- Zod schemas for validation (`src/features/settings/schemas/`)

### Scope Boundaries

**In Scope:**
- Export to Excel (XLSX) format
- Export to PDF format
- Date range filtering with presets
- Premium access control with Stripe redirect
- UI in Settings > Account tab
- Loading states
- Direct file download

**Out of Scope (Future Enhancements):**
- Custom field selection (choosing which columns to export)
- Email delivery of exports
- Scheduled/automatic exports
- Export history/tracking
- Export templates or custom formatting
- Currency conversion in exports
- Summary statistics in export files
- Sharing exports with other users

### Technical Considerations

**Technology Stack:**
- Use react-pdf library for PDF generation
- Use a library for Excel generation -> XLSX library
- Server Action for export generation (`src/features/settings/server/actions/`)
- Feature organized within `src/features/settings/`
- Follow Next.js App Router patterns with Server Components where possible
- Client component for modal interaction

**Integration Points:**
- Fetch subscriptions using existing `getSubscriptionsByUserId` query
- Check user plan status via session (`session.user.plan === SubscriptionPlan.PAID`)
- Redirect to Stripe using existing Stripe integration patterns
- Use server auth via `getServerAuth` hook

**Data Model:**
- Use existing Subscription model from Prisma schema
- Filter subscriptions by startDate for date range filtering
- No database schema changes required

**Date Range Preset Options:**
- Last 30 days
- Last 6 months
- This year
- All time
- Custom range (date picker)

**Libraries to Add:**
- `@react-pdf/renderer` for PDF generation
- `xlsx` for Excel generation

**Error Handling:**
- Handle cases where user has no subscriptions
- Handle file generation failures gracefully
- Show error messages in modal if export fails
- Validate date range inputs

**Accessibility:**
- Modal should be keyboard navigable
- Loading states announced to screen readers
- Proper focus management when modal opens/closes
