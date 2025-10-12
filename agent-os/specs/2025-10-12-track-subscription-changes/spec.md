# Specification: Track Subscription Changes

## Goal
To provide users with a historical log of all changes made to a subscription, allowing them to track its evolution over time, including changes in price, billing cycle, and other attributes.

## User Stories
- As a **Budget-Conscious Consumer**, I want to see the history of my subscription price changes so that I can understand how my costs have evolved.
- As a **Busy Professional**, I want to have a record of all changes to my subscriptions so that I can easily recall why a subscription's cost or terms have changed.
- As a **Cost Optimizer**, I want to be able to revert a change I made to a subscription in case I entered it incorrectly.
- As a **User**, I want to be able to delete an incorrect history entry to keep my records clean.

## Core Requirements
### Functional Requirements
- When a user edits an existing subscription, a history record of the changes must be automatically created.
- Users must be able to view a chronological history of all changes for a specific subscription.
- The history should be accessible from the subscription details view.
- Each history entry must detail what was changed (e.g., "Price"), the old value, and the new value.
- Users must have the ability to edit or delete a historical record.
- Changes must be reversible (e.g., by editing the subscription back to its previous state, which would create a new history entry).

### Non-Functional Requirements
- The implementation must be modular and follow the Single Responsibility Principle.
- New components should be composable and have a single clear entry point.
- The feature should integrate seamlessly into the existing dashboard UI.

## Visual Design
No visual mockups were provided. The UI should be built using existing ShadCN UI components to maintain visual consistency with the rest of the application. A dialog or modal triggered from the `SubscriptionCard` seems appropriate.

## Reusable Components
### Existing Code to Leverage
- **Components**:
  - `Dialog`, `Button`, `Card`, `Badge` from `src/components/ui/` will be used to build the history view.
  - `SubscriptionCard` and `SubscriptionCardActions` from `src/features/dashboard/components/subscription-details/` will be modified to include a "View History" action.
  - `SubscriptionForm` from `src/features/dashboard/components/` will be the trigger for creating history records upon a successful update.
- **Server Logic**:
  - The existing `updateSubscription` server action in `src/features/dashboard/server/actions/subscription.ts` will be extended to also create the history record in the database.
- **Schemas**:
  - The `subscriptionSchema` from `src/features/dashboard/schemas/subscription.ts` will be the basis for determining what fields to track.
- **Patterns**:
  - The feature will follow the existing structure of the dashboard feature (`src/features/dashboard`), including the separation of components, server actions, and database logic.

### New Components Required
- **`SubscriptionHistoryView`**: A new component to display the list of historical changes for a subscription. This will likely be a modal/dialog containing a timeline or list of `SubscriptionHistoryCard` components.
- **`SubscriptionHistoryCard`**: A component to display a single historical change, including fields, old values, and new values.
- **`EditHistoryForm` / `DeleteHistoryDialog`**: Components to handle the editing and deletion of a history record.

## Technical Approach
- **Database**:
  - A new `SubscriptionHistory` model will be added to the `prisma/schema.prisma` file.
  - It will have a many-to-one relationship with the `Subscription` model.
  - Fields will include: `id`, `createdAt`, `subscriptionId`, `changedField`, `oldValue`, `newValue`.
- **API / Server Actions**:
  - The existing `updateSubscription` server action will be modified. After successfully updating a subscription, it will iterate through the changed fields and create a `SubscriptionHistory` record for each one.
  - New server actions, `updateSubscriptionHistory` and `deleteSubscriptionHistory`, will be created to manage history records. These actions will perform validation and database operations.
- **Frontend**:
  - A "History" button will be added to `SubscriptionCardActions`.
  - Clicking the button will open the `SubscriptionHistoryView` dialog, which will fetch and display the history for the selected subscription.
  - The `SubscriptionHistoryView` will provide options to edit or delete each history entry, triggering the respective new server actions.
- **Testing**:
  - The new server actions must have test coverage.
  - Manual testing will be required to ensure the end-to-end flow works as expected: editing a subscription, viewing the history, and managing history entries.

## Out of Scope
- Automated detection of subscription changes from external sources. All changes are manually initiated by the user.
- User notifications about historical changes.
- Advanced statistical analysis of historical data within the UI.

## Success Criteria
- A user can successfully edit a subscription, and a corresponding, accurate history record is created.
- A user can view the complete and accurate history of changes for any subscription.
- A user can successfully edit and delete a history record.
- The feature is visually consistent with the existing application and does not introduce any regressions.
