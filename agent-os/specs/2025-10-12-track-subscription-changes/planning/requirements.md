# Spec Requirements: Track Subscription Changes

## Initial Description
i want a feature that will save operations that I made on existing subscription, for example

i have cursor subscription which costs $20 and it has started for example at 2023, now the Cursor subscription is worth $25, I would like to track all of these changes. Also It should track currency changes, billing cycle changes, price changes.

## Requirements Discussion

### First Round Questions

**Q1:** How should changes be recorded?
**Answer:** Ye users will automatically fill up these changes via edit form of the subscription, but every change should be reversible.

**Q2:** Where should the history be displayed?
**Answer:** yup that's nice idea.

**Q3:** What specific changes should be tracked?
**Answer:** ye we can track everything.

**Q4:** How should this affect spending calculations?
**Answer:** always current subscription, but for statistics it should get relevant subscription data for certain time period.

**Q5:** Can historical records be edited?
**Answer:** yes it can be, also it can be deleted.

**Q6:** What information should be stored for each change?
**Answer:** every change of the subscription that has occured

**Q7:** Is there anything we should explicitly not build?
**Answer:** [No answer provided]

### Existing Code to Reference

**Similar Features Identified:**
- The new feature will be built on top of the existing dashboard feature: `@dashboard/`
- We can reuse general components, hooks, schemas, and libraries.
- Paths provided by user:
  - `@components/` (especially shadcn components)
  - `@hooks/`
  - `@server/`
  - `@schemas/`
  - `@lib/`

### Follow-up Questions
No follow-up questions were needed.

## Visual Assets

No visual assets provided.

## Requirements Summary

### Functional Requirements
- Users can edit a subscription, and every change will be saved as a historical record.
- All changes must be reversible.
- A "View History" feature will be available on the subscription details page, likely in a modal or separate view.
- The history will display a timeline of all changes.
- All subscription fields are eligible for tracking (price, currency, billing cycle, name, etc.).
- Historical records can be edited and deleted.
- Dashboard calculations for spending should use the *current* subscription data.
- Statistics (e.g., historical reports) should be able to use subscription data from specific time periods.

### Non-Functional Requirements
- Implementation should be granular and composable, following the Single Responsibility Principle.
- Components should be built like "LEGO building blocks" with a single entry point for features.

### Reusability Opportunities
- Leverage existing shadcn components from `src/components/ui`.
- Utilize shared hooks from `src/hooks`.
- Reuse server actions and database logic from `src/server`.
- Employ existing Zod schemas from `src/schemas`.
- Use utility functions from `src/lib`.
- Build upon the existing dashboard feature located in `src/features/dashboard`.

### Scope Boundaries
**In Scope:**
- Creating a `SubscriptionHistory` or similar model to store changes.
- Modifying the subscription "edit" form/action to create a history record for each change.
- Building a UI to display the timeline of changes for a subscription.
- Implementing functionality to edit and delete historical records.
- Ensuring dashboard calculations use the current state of a subscription.

**Out of Scope:**
- Automated detection of subscription changes (changes are user-initiated).
- Notifications to users about historical changes being recorded.
- Complex historical statistical analysis beyond providing the data for it.

### Technical Considerations
- A new database table (e.g., `SubscriptionHistory`) will be needed, linked to the `Subscription` table.
- Server actions for editing subscriptions must be updated to also create history entries.
- New server actions will be needed to edit/delete history entries.
- The implementation should follow the UNIX philosophy and SRP, promoting composability.
