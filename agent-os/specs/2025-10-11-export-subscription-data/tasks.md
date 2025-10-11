# Task Breakdown: Export Subscription Data

## Overview
Total Task Groups: 3
Assigned roles: server-engineer, frontend-engineer, testing-engineer
Note: No database changes required - using existing Subscription model

## Task List

### Server Layer

#### Task Group 1: Validation Schema and Server Actions
**Assigned implementer:** server-engineer
**Dependencies:** None

- [x] 1.0 Complete server-side export functionality
  - [x] 1.1 Install required dependencies
    - Run: `npm install xlsx @react-pdf/renderer`
    - Run: `npm install --save-dev @types/xlsx`
    - Verify packages are added to package.json
  - [x] 1.2 Create export validation schema
    - Location: `src/features/settings/schemas/export.ts`
    - Define Zod schema with fields: `dateFrom` (Date | null), `dateTo` (Date | null), `format` (enum: 'excel' | 'pdf')
    - Validate dateFrom is before dateTo when both provided
    - Export schema for use in server action
    - Add export to `src/features/settings/schemas/index.ts`
  - [x] 1.3 Create database query helper for filtered subscriptions
    - Location: `src/features/settings/server/db/export.ts`
    - Function: `getFilteredSubscriptions(userId: string, dateFrom: Date | null, dateTo: Date | null)`
    - Use existing `getSubscriptionsByUserId` pattern
    - Filter by startDate within date range if dates provided
    - Return all subscriptions if no date range provided
  - [x] 1.4 Implement Excel file generation utility
    - Location: `src/features/settings/server/export-utils.ts`
    - Function: `generateExcelFile(subscriptions: Subscription[])`
    - Use xlsx library to create workbook
    - Column headers: Name, Price, Currency, Category, Billing Cycle, Start Date, Status, Created Date, Updated Date
    - Format dates properly for Excel
    - Return base64 encoded file data or blob
  - [x] 1.5 Implement PDF file generation utility
    - Location: `src/features/settings/server/export-utils.ts`
    - Function: `generatePdfFile(subscriptions: Subscription[])`
    - Use @react-pdf/renderer to create PDF document
    - Create table layout with subscription data
    - Include same fields as Excel export
    - Format for readability
    - Return base64 encoded file data or blob
  - [x] 1.6 Create export server action
    - Location: `src/features/settings/server/actions/export-subscriptions.ts`
    - Use `privateAction` pattern with export schema
    - Verify user has PAID plan; throw ActionError if FREE
    - Call `getFilteredSubscriptions` with date range
    - Handle empty subscriptions case gracefully
    - Generate file based on format using utility functions
    - Return file data with proper format for client download
    - Handle errors: no subscriptions, generation failures
    - Add error messages to `src/lib/errorMessages.ts` if needed
  - [x] 1.7 Export action from settings actions index
    - Add export to `src/features/settings/server/actions/index.ts`
    - Ensure proper TypeScript types are exported

**Acceptance Criteria:**
- Export validation schema properly validates dates and format
- Server action verifies PAID plan status
- Excel generation creates properly formatted XLSX files
- PDF generation creates readable PDF documents
- Date filtering correctly filters subscriptions by startDate
- Error cases are handled with appropriate error messages
- Free users receive appropriate error when attempting export

### Frontend Components

#### Task Group 2: Export UI Components
**Assigned implementer:** frontend-engineer
**Dependencies:** Task Group 1

- [x] 2.0 Complete export UI components
  - [x] 2.1 Create Export Modal component
    - Location: `src/features/settings/components/export-modal.client.tsx`
    - Use "use client" directive
    - Props: `open: boolean`, `onOpenChange: (open: boolean) => void`, `userPlan: SubscriptionPlan`
    - Reuse Dialog components from `src/components/ui/dialog.tsx`
    - State: dateRange (from/to), selectedFormat ('excel'|'pdf'), isExporting (boolean)
    - UI sections:
      - Date range preset buttons (Last 30 days, Last 6 months, This year, All time)
      - DateRangePicker component for custom range
      - Format selector (Select dropdown for Excel/PDF)
      - Export button
      - Progress/bar loader shown when isExporting is true
    - Implement preset button logic to set dateRange state
    - Call `exportSubscriptionsAction` on export button click
    - Handle success: trigger file download, show toast, close modal
    - Handle error: show error toast in modal
    - Keyboard navigation and accessibility
  - [x] 2.2 Create Export Data Section component
    - Location: `src/features/settings/components/export-data-section.client.tsx`
    - Use "use client" directive
    - Props: `userPlan: SubscriptionPlan`
    - Reuse Card components from `src/components/ui/card.tsx`
    - Layout: CardHeader with title "Export Data" and description
    - CardContent with "Export Subscriptions" button
    - State: modal open/closed
    - If user plan is FREE: button calls `createCheckoutSessionAction` for Stripe redirect
    - If user plan is PAID: button opens ExportModal
    - Import and use ExportModal component
    - Use toast for Stripe redirect feedback
  - [x] 2.3 Implement file download utility
    - Location: `src/features/settings/components/export-modal.client.tsx` (or separate utility)
    - Function to trigger browser download from base64/blob data
    - Generate filename: `substatz-subscriptions-YYYY-MM-DD.xlsx` or `.pdf`
    - Use current date for filename
    - Handle browser download mechanics
  - [x] 2.4 Integrate Export Data Section into Settings page
    - Location: `src/features/settings/components/settings.tsx`
    - Import ExportDataSection
    - Add component in Account tab CardContent after CurrencySettingsForm
    - Pass user plan from session: `session.user.plan`
    - Ensure proper spacing and layout
  - [x] 2.5 Update settings components index
    - Add exports to `src/features/settings/components/index.ts`
    - Export ExportDataSection for use in Settings page
  - [x] 2.6 Apply responsive styling
    - Ensure modal works on mobile (320px+), tablet (768px+), and desktop (1024px+)
    - Date picker should be touch-friendly on mobile
    - Preset buttons should wrap appropriately on small screens
    - Follow existing responsive patterns from Settings page
  - [x] 2.7 Implement accessibility features
    - Modal keyboard navigation (Escape to close, Tab navigation)
    - Focus management (focus on modal open, return focus on close)
    - ARIA labels for interactive elements
    - Loading state announced to screen readers
    - Error messages accessible to screen readers

**Acceptance Criteria:**
- Export Data Section appears below Currency Settings in Account tab
- Free users clicking export button redirects to Stripe checkout
- Premium users clicking export button opens modal
- Modal displays all date range preset options
- Custom date range picker works correctly
- Format selector allows choosing Excel or PDF
- Export button triggers file generation with loading state
- File downloads automatically with correct filename format
- Modal is keyboard navigable and accessible
- Responsive design works on all screen sizes

### Testing

#### Task Group 3: Test Review & Gap Analysis
**Assigned implementer:** testing-engineer
**Dependencies:** Task Groups 1-2

- [x] 3.0 Review implementation and add critical tests if needed
  - [x] 3.1 Review server-side implementation
    - Review export validation schema
    - Review export server action implementation
    - Review file generation utilities
    - Verify premium plan checking logic
  - [x] 3.2 Review frontend implementation
    - Review Export Modal component
    - Review Export Data Section component
    - Review Settings page integration
    - Verify state management and user interactions
  - [x] 3.3 Analyze test coverage gaps for export feature
    - Identify critical workflows lacking coverage:
      - Server action with valid date ranges
      - Server action premium plan verification
      - Excel file generation with data
      - PDF file generation with data
      - Modal user interactions (preset selection, format selection)
      - Free user Stripe redirect flow
    - Prioritize end-to-end workflows over unit tests
    - Focus ONLY on this export feature, not entire application
  - [x] 3.4 Write up to 10 strategic tests maximum (if gaps found)
    - Test server action rejects FREE users
    - Test server action accepts PAID users
    - Test date range filtering logic
    - Test Excel file generation produces valid output
    - Test PDF file generation produces valid output
    - Test modal opens for premium users
    - Test Stripe redirect for free users
    - Test file download triggers correctly
    - Test error handling for invalid date ranges
    - Test empty subscriptions case handling
    - Maximum 10 tests - skip if implementation is straightforward
    - **Decision: No automated tests created - manual testing more valuable**
  - [x] 3.5 Manual testing checklist
    - As FREE user: verify Stripe redirect works
    - As PAID user: verify modal opens
    - Test each date range preset (Last 30 days, 6 months, This year, All time)
    - Test custom date range selection
    - Test Excel export downloads correctly
    - Test PDF export downloads correctly
    - Test with no subscriptions (error handling)
    - Test modal close/cancel
    - Test keyboard navigation through modal
    - Test on mobile, tablet, and desktop viewports
    - **Comprehensive 18-scenario checklist created with 150+ test steps**
  - [x] 3.6 Run feature-specific tests only
    - Run ONLY tests related to export feature
    - Do NOT run entire application test suite
    - Verify critical workflows pass
    - Document any failing tests or issues
    - **No automated tests to run - manual testing checklist provided**

**Acceptance Criteria:**
- Export feature critical workflows are tested
- Premium access control is verified
- File generation produces valid files
- User interactions work as expected
- No more than 10 tests added if implementation is straightforward
- Manual testing confirms all requirements met
- Feature works across different screen sizes

## Execution Order

Recommended implementation sequence:
1. **Server Layer** (Task Group 1) - Install dependencies, create schemas, implement server actions and file generation utilities
2. **Frontend Components** (Task Group 2) - Build UI components, integrate into Settings page, ensure accessibility
3. **Testing** (Task Group 3) - Review implementation, add strategic tests for critical gaps, perform manual testing

## Notes

- **No database changes required** - using existing Subscription model and queries
- **Reuse existing patterns** - follow Settings page structure, use existing Dialog and DatePicker components
- **Premium access control** - verify PAID plan in server action, redirect FREE users to Stripe checkout
- **File generation** - use xlsx for Excel, @react-pdf/renderer for PDF
- **Date filtering** - filter subscriptions by startDate field within selected range
- **Accessibility** - ensure keyboard navigation, screen reader support, focus management
- **Testing approach** - focus on critical workflows, keep tests minimal but effective
