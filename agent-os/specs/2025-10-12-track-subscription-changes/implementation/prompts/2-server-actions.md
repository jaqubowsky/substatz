We're continuing our implementation of Track Subscription Changes by implementing task group number 2:

## Implement this task and its sub-tasks:

#### Task Group 2: Server Actions
**Assigned implementer:** `server-engineer`
**Dependencies:** Task Group 1

- [ ] 2.0 Complete server-side logic
  - [ ] 2.1 Modify the existing `updateSubscription` server action in `src/features/dashboard/server/actions/subscription.ts`.
  - [ ] 2.2 After a subscription is successfully updated, compare the old and new data to identify which fields have changed.
  - [ ] 2.3 For each changed field, create a new `SubscriptionHistory` record in the database.
  - [ ] 2.4 Create a new server action `getSubscriptionHistory` that takes a `subscriptionId` and returns all history records for that subscription.
  - [ ] 2.5 Create a new server action `deleteSubscriptionHistory` that takes a `historyId` and deletes the corresponding record.
  - [ ] 2.6 Create a new server action `updateSubscriptionHistory` that takes a `historyId` and new data to update a specific history record.

**Acceptance Criteria:**
- Updating a subscription correctly generates history records for all changed fields.
- `getSubscriptionHistory` returns the correct data.
- `deleteSubscriptionHistory` successfully removes a history record.
- `updateSubscriptionHistory` successfully modifies a history record.

## Understand the context

Read @agent-os/specs/2025-10-12-track-subscription-changes/spec.md to understand the context for this spec and where the current task fits into it.

## Perform the implementation

Implement all tasks assigned to you in your task group.

Focus ONLY on implementing the areas that align with **areas of specialization** (your "areas of specialization" are defined above).

Guide your implementation using:
- **The existing patterns** that you've found and analyzed.
- **User Standards & Preferences** which are defined below.

Self-verify and test your work by:
- Running ONLY the tests you've written (if any) and ensuring those tests pass.
- IF your task involves user-facing UI, and IF you have access to browser testing tools, open a browser and use the feature you've implemented as if you are a user to ensure a user can use the feature in the intended way.


## Update tasks.md task status

In the current spec's `tasks.md` find YOUR task group that's been assigned to YOU and update this task group's parent task and sub-task(s) checked statuses to complete for the specific task(s) that you've implemented.

Mark your task group's parent task and sub-task as complete by changing its checkbox to `- [x]`.

DO NOT update task checkboxes for other task groups that were NOT assigned to you for implementation.


## Document your implementation

Using the task number and task title that's been assigned to you, create a file in the current spec's `implementation` folder called `[task-number]-[task-title]-implementation.md`.

For example, if you've been assigned implement the 3rd task from `tasks.md` and that task's title is "Commenting System", then you must create the file: `agent-os/specs/2025-10-12-track-subscription-changes/implementation/2-server-actions-implementation.md`.

Use the following structure for the content of your implementation documentation:

```markdown
# Task 2: Server Actions

## Overview
**Task Reference:** Task #2 from `agent-os/specs/2025-10-12-track-subscription-changes/tasks.md`
**Implemented By:** server-engineer
**Date:** [Implementation Date]
**Status:** ✅ Complete | ⚠️ Partial | 🔄 In Progress

### Task Description
This task involves creating and modifying the server actions required to manage subscription history.

## Implementation Summary
[High-level overview of the solution implemented - 2-3 short paragraphs explaining the approach taken and why]

## Files Changed/Created

### New Files
- `src/features/dashboard/server/actions/subscription-history.ts` - [1 short sentence description of purpose]

### Modified Files
- `src/features/dashboard/server/actions/subscription.ts` - [1 short sentence on what was changed and why]

## Key Implementation Details

### `updateSubscription` Modification
**Location:** `src/features/dashboard/server/actions/subscription.ts`

[Detailed explanation of this implementation aspect]

**Rationale:** [Why this approach was chosen]

### New History Actions
**Location:** `src/features/dashboard/server/actions/subscription-history.ts`

[Detailed explanation of this implementation aspect]

**Rationale:** [Why this approach was chosen]

## User Standards & Preferences Compliance

### product/tech-stack.md
**File Reference:** `agent-os/product/tech-stack.md`
**How Your Implementation Complies:**
[1-2 Sentences to explain specifically how your implementation adheres to the guidelines, patterns, or preferences outlined in this standards file. Include concrete examples from your code.]

### product/folder-structure.md
**File Reference:** `agent-os/product/folder-structure.md`
**How Your Implementation Complies:**
[1-2 Sentences to explain specifically how your implementation adheres to the guidelines, patterns, or preferences outlined in this standards file. Include concrete examples from your code.]

### global/validation.md
**File Reference:** `agent-os/standards/global/validation.md`
**How Your Implementation Complies:**
[1-2 Sentences to explain specifically how your implementation adheres to the guidelines, patterns, or preferences outlined in this standards file. Include concrete examples from your code.]

### global/error-handling.md
**File Reference:** `agent-os/standards/global/error-handling.md`
**How Your Implementation Complies:**
[1-2 Sentences to explain specifically how your implementation adheres to the guidelines, patterns, or preferences outlined in this standards file. Include concrete examples from your code.]

### global/conventions.md
**File Reference:** `agent-os/standards/global/conventions.md`
**How Your Implementation Complies:**
[1-2 Sentences to explain specifically how your implementation adheres to the guidelines, patterns, or preferences outlined in this standards file. Include concrete examples from your code.]
```

## User Standards & Preferences Compliance

IMPORTANT: Ensure that your implementation work is ALIGNED and DOES NOT CONFLICT with the user's preferences and standards as detailed in the following files:

@agent-os/product/tech-stack.md
@agent-os/product/folder-structure.md
@agent-os/standards/global/validation.md
@agent-os/standards/global/error-handling.md
@agent-os/standards/global/conventions.md
