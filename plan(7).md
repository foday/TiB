# MaintainOps — Conveyor Operations & Maintenance

## Project Overview

- **Product:** MaintainOps (working name)
- **Project:** Conveyor Operations & Maintenance
- **Target customers:** Warehouses and distribution centers
- **Release goal:** Functional V1 MVP
- **Development model:** Solo developer, AI-assisted development, managed services
- **Primary outcome:** Deliver a complete, testable fault-to-repair workflow across a web dashboard and mobile technician app.

MaintainOps helps warehouse operations and maintenance teams manage conveyor assets, coordinate repairs, complete required safety documentation, track downtime, manage spare parts and purchasing, and understand maintenance performance.

The product follows principles established during Tortuga planning: safety-first workflows, individual asset histories, traceable resource consumption, and operational efficiency.

## 1. Confirmed Product Decisions

- Target warehouses and distribution centers.
- Build a functional MVP, not merely a visual demo.
- Provide a React web dashboard and a React Native/Expo mobile technician app.
- Use Convex for the backend and database.
- Use Clerk for authentication.
- Support a hierarchical asset registry.
- Use a controlled work-order lifecycle with assignment and authorized closure.
- Require PTP, applicable PPE checks, LOTO verification acknowledgments, and required sign-offs before relevant work transitions.
- Support manual work and calendar-based recurring preventive maintenance.
- Track downtime manually in V1, while keeping a future path open for PLC/SCADA integration.
- Include enterprise-capable records and an internal purchasing workflow.
- Support four roles: administrator, maintenance supervisor, technician, and operations reporter.
- Support multiple customer organizations (multi-tenant SaaS).
- Attach media to work orders and asset records.
- Use invitation-based employee onboarding. The platform provisions an organization and invites its first administrator.
- Enforce role rules and approval boundaries.
- Support limited offline viewing and local drafts, with review before submission and stale-change detection.
- Include in-app and email notifications.
- Archive records rather than routinely deleting them.
- Use Convex file storage.
- Use managed deployment and a documented release checklist.
- Document recovery procedures and test restoration of essential records.
- Use automated core tests plus manual acceptance testing.
- Select service plans and infrastructure based on verified current pricing and requirements; budget is flexible when justified.

## 2. Product Objective and Core Workflow

The primary workflow is:

1. Report a conveyor fault.
2. Create a work order with a unique job number.
3. Review, prioritize, and assign the work.
4. Complete the required safety workflow.
5. Diagnose and document the repair.
6. Record labor, parts consumed, photographs, and downtime.
7. Submit the repair for authorized closure.
8. Update the asset history, inventory, audit trail, and analytics.
9. Notify the relevant users of important actions.

The product is successful when this workflow works end to end across the web and mobile interfaces, including appropriate authorization and failure handling.

## 3. Technology Architecture

| Layer | Selected technology | Responsibility |
|---|---|---|
| Web | React + TypeScript | Administration, work orders, purchasing, reporting |
| Mobile | React Native + Expo + TypeScript | Technician inspections, repairs, notes, and photographs |
| Backend | Convex | Queries, mutations, business rules, reactive data, scheduled functions |
| Authentication | Clerk | Identity, sign-in, invitations, and organization membership |
| Database | Convex database | Operational records and relationships |
| File storage | Convex file storage | Work-order and asset attachments |
| Notifications | Convex records and scheduled functions | In-app notifications and delivery coordination |
| Email | Clerk capabilities where suitable; separate provider if needed | Operational email |
| Testing | TypeScript-aware unit, integration, and end-to-end tests | Business logic and workflow validation |
| Deployment | Managed hosting and Convex deployment | Web and backend delivery |

### Version policy

Before installing packages, check current official documentation for stable versions, peer dependencies, Expo SDK compatibility, Clerk integration, and Convex support. Do not select versions from memory or assume that beta versions are production-ready.

Official references:

- Expo SDK: https://docs.expo.dev/versions/latest/
- Expo with Convex: https://docs.expo.dev/guides/using-convex/
- Convex with Clerk: https://docs.convex.dev/auth/clerk
- Clerk with Expo: https://docs.expo.dev/guides/using-clerk/
- Convex file storage: https://docs.convex.dev/file-storage/upload-files

### Proposed repository structure

```text
maintainops/
  apps/
    web/
    mobile/
  packages/
    shared/
  convex/
    schema.ts
    auth/
    assets/
    workOrders/
    safety/
    preventiveMaintenance/
    inventory/
    procurement/
    downtime/
    analytics/
    notifications/
    audit/
    files/
  tests/
  docs/
  README.md
```

This is a proposed structure, not a requirement to create empty modules up front. Build modules when their implementation phase begins. Share domain types, validation rules, and status definitions where practical; keep platform-specific UI separate.

## 4. Users, Roles, and Authorization

| Role | Responsibilities |
|---|---|
| Administrator | Organization administration, users, configuration, and authorized record management |
| Maintenance supervisor | Maintenance planning, work assignment, repair review, and purchasing approvals within policy |
| Technician | Assigned work, inspections, safety documentation, repairs, labor, parts usage, and notes |
| Operations reporter | Report faults, view permitted operational status, and access authorized reports |

Authorization requirements:

- Every organization-owned record must be associated with the correct tenant.
- Every protected query and mutation must verify identity, organization membership, and permission.
- UI visibility is not an authorization control.
- Purchase approvals must enforce approval rules and prevent prohibited self-approval.
- Work-order closure must require the appropriate permission and completion conditions.
- Safety prerequisites must not be bypassable merely because a user is an administrator.
- Permission changes and sensitive actions must be recorded in the audit trail.

Clerk verifies identity and manages invitations. Convex maintains authoritative application organization records, roles, and operational authorization rules. Organization identifiers must be consistently mapped and verified between the services.

### Onboarding

1. Platform administrator provisions an organization.
2. Platform administrator invites the first organization administrator.
3. The organization administrator joins and invites employees with assigned roles.
4. All membership and role changes are validated server-side and audited.

## 5. Core Data Model

### Organization and access

- **Organizations:** name, status, Clerk organization identifier, configuration.
- **Memberships:** organization, Clerk user identifier, application role, status.
- **Invitations:** organization, invited email, assigned role, invitation status.
- **Audit events:** organization, actor, action, affected record, timestamp, relevant change details.

### Equipment

- **Facilities:** organization, name, address/location details, status.
- **Assets:** facility, parent asset, asset identifier, type, name, location, status.
- **Components:** parent asset, type, manufacturer/model when available, serial number, installation and service history.
- **Maintenance history:** asset, work-order reference, event type, timestamps, findings.

Example hierarchy:

`Organization → Facility → Conveyor Line CV-102 → Drive Motor → Gearbox`

Preserve component history when a component is replaced or moved.

### Work and safety

- **Work orders:** job number, asset, fault description, priority, status, reporter, assigned technician, planned dates, timestamps.
- **Inspections:** asset, checklist, result, technician, findings, timestamp.
- **Safety records:** work order, PTP responses, applicable PPE checks, LOTO verification acknowledgments, required sign-offs, completion time, responsible user.
- **Labor entries:** work order, user, duration or start/end times, work category.
- **Downtime events:** asset, work order, start, restoration time, cause, notes.
- **Preventive maintenance schedules:** asset, recurrence interval, checklist template, next due date, active status.

### Inventory and procurement

- **Parts:** organization, SKU, description, category, unit of measure, reorder threshold, standard cost.
- **Inventory locations:** facility, storage location, status.
- **Inventory balances:** part, location, current quantity.
- **Inventory transactions:** part, location, quantity change, transaction type, work order or receipt reference, actor, timestamp.
- **Suppliers:** organization, supplier details, contacts, status.
- **Purchase requests:** requested parts, quantities, requester, approval status.
- **Purchase orders:** supplier, items, quantities, costs, approval history, status.
- **Goods receipts:** purchase order, quantities received, receiving user, receipt timestamp.
- **Cost records:** labor, parts, purchasing, and work-order totals.

Inventory balances must be reconciled with transaction history. Never silently change stock without a corresponding transaction.

### Media and notifications

- **Attachments:** Convex storage ID, organization, related asset/work order, uploader, file type, upload status, timestamp.
- **Notifications:** organization, recipient, event type, related record, read status, delivery status.
- **Email delivery records:** recipient, notification reference, attempt status, provider identifier when available, failure details.

Authorize file access against the associated organization and record. Knowing a storage identifier must not grant access.

## 6. Work-Order Lifecycle

Implement a controlled state machine, not arbitrary status editing.

Proposed lifecycle:

1. Reported
2. Open / triaged
3. Assigned
4. Safety verification pending
5. In progress
6. Awaiting parts or follow-up, where applicable
7. Repair completed, awaiting authorized closure
8. Closed

Cancellation and reopening require explicit transitions, appropriate permissions, and documented reasons.

### Workflow requirements

- A reporter submits a fault.
- The backend creates a uniquely numbered work order.
- A supervisor reviews priority, asset, and assignment.
- A technician opens the job on mobile.
- Required PTP, PPE, and LOTO-related records are completed before the relevant work transition.
- The technician records findings, repair actions, photographs, labor, and parts used.
- Downtime and restoration details are recorded.
- An authorized reviewer checks completion requirements.
- Closure updates the asset history, inventory, audit trail, and analytics.

Software checklists do not replace physical isolation, testing, or approved site-specific procedures.

## 7. Preventive Maintenance

V1 supports calendar-based recurring maintenance only.

Supervisors can create schedules, select a recurrence interval, specify a checklist, and set the next due date.

The system must:

- Display upcoming and overdue maintenance.
- Generate due work orders.
- Avoid duplicate work for the same schedule occurrence.
- Record completed inspections and service history.
- Update the next due date after completion.
- Preserve schedule history when intervals change or schedules are retired.

Use Convex scheduling facilities where appropriate. Scheduled tasks must be idempotent so retries do not create duplicate work orders or notifications.

Operating-hour triggers, condition-based triggers, predictive maintenance, and live equipment telemetry are outside V1.

## 8. Inventory and Procurement

### Purchase workflow

1. A user creates a purchase request with parts, quantities, and justification.
2. An authorized approver approves or rejects it.
3. An authorized user creates or finalizes the purchase order.
4. The purchase order tracks outstanding quantities and status.
5. A receiving user records actual quantities received.
6. Confirmed receipts create inventory transactions and update stock.
7. The purchase order reflects remaining quantities or completion.
8. The audit trail records relevant approvals and changes.

A purchase request must not increase inventory. Stock increases only after receiving is confirmed.

### Work-order consumption

When a technician records parts used, the backend validates availability and records the transaction. Prevent duplicate consumption and guard against concurrent stock changes. If stock is insufficient, show a clear error or require an authorized adjustment rather than silently allowing a negative balance.

External supplier catalogs, live pricing, and automatic external purchasing are excluded from V1.

## 9. Downtime and Analytics

Downtime is entered manually in V1. Capture start time, restoration time, asset, cause, related work order, and notes. Distinguish equipment outage time from repair start time.

Dashboard metrics:

- Open and overdue work orders.
- Preventive maintenance completion.
- Downtime by asset and cause.
- Recurring failures.
- Asset availability where sufficient data exists.
- Maintenance labor and parts costs.
- Parts consumption and low-stock items.
- Purchase requests awaiting approval.
- Purchase orders awaiting receipt.

MTTR and MTBF may be included only after definitions and source data are validated. Display the reporting period, calculation basis, and data limitations. Do not represent manual downtime as live monitoring.

## 10. Mobile and Offline Behavior

Primary mobile screens:

1. Sign-in and organization access.
2. Assigned jobs.
3. Work-order details.
4. Asset and component history.
5. Required safety checklist.
6. Inspection and repair notes.
7. Labor and parts entry.
8. Photo/document capture.
9. Job completion and submission status.
10. Notifications and account settings.

V1 supports limited offline viewing and local drafts, not a fully offline-first maintenance system.

- Previously loaded information may be viewed when available locally.
- Notes and draft information may be prepared offline.
- Drafts must be reviewed before submission.
- Stale changes must be identified instead of silently overwriting newer server data.
- A submission is not shown as saved until the server confirms it.
- Duplicate submissions are prevented with stable request identifiers or equivalent idempotency controls.
- Safety-critical transitions require appropriate online validation; offline drafts cannot authorize work.

Convex reactive queries alone do not provide all required persistent offline storage and conflict handling. Implement and test local draft persistence explicitly.

## 11. Notifications and Asynchronous Work

V1 supports in-app notifications and email for selected events:

- Work-order assignment.
- Pending approvals.
- Overdue maintenance.
- Purchase requests awaiting action.
- Relevant changes to assigned jobs.

In-app queues remain the visible source for pending actions. Email is supplementary and does not guarantee that a person has seen a notification.

Failure handling:

- Record delivery attempts and outcomes.
- Retry transient email failures with bounded retries.
- Avoid duplicate emails on retry.
- Show delivery failures where relevant.
- Keep the operational record valid if email delivery fails.
- Do not make an external email call inside a mutation that must remain transactional.

Verify Clerk email capabilities for operational notifications. If unsuitable, choose a dedicated provider after reviewing current pricing, limits, and delivery monitoring.

## 12. Security, Privacy, and Audit Trail

- Enforce tenant-scoped queries and mutations.
- Validate permissions on the backend.
- Validate input and status transitions.
- Protect file access.
- Verify invitations and organization membership server-side.
- Audit work-order, safety, inventory, purchasing, asset, and permission changes.
- Restrict access to labor costs and other sensitive records where appropriate.
- Separate secrets and environment configuration.
- Never embed secret keys in the mobile client.
- Archive operational records instead of routinely deleting them.

Audit records should capture actor, timestamp, action, affected entity, and relevant before/after values. Never log passwords, tokens, or unnecessary sensitive information.

Document retention and deletion rules before introducing real customer data.

## 13. Testing and Quality Assurance

Automated core tests plus manual acceptance testing are required.

### Automated test coverage

- Tenant isolation between organizations.
- Role-based access and unauthorized operations.
- Work-order state transitions.
- Required safety gates.
- Duplicate work-order prevention.
- Inventory transactions and concurrent stock changes.
- Purchase approval rules.
- Receiving and inventory updates.
- Audit-event creation.
- Preventive-maintenance recurrence without duplicate work.
- Notification retry and duplicate-delivery handling.
- Attachment authorization.
- Offline draft submission and stale-record conflicts.

### Manual acceptance scenario

1. Provision two organizations and verify isolation.
2. Invite an administrator and operational users.
3. Create a facility, conveyor line, motor, and components.
4. Report a fault and assign work.
5. Verify safety prerequisites.
6. Record repair details, labor, parts, photographs, and downtime.
7. Close the work order through the authorized workflow.
8. Create a purchase request, approve it, create a purchase order, and receive stock.
9. Confirm inventory and asset history.
10. Verify analytics, audit history, and notifications.
11. Test failed requests, duplicate submissions, and connectivity interruptions.

The release is not complete if the workflow works only under ideal conditions.

## 14. Implementation Phases

### Phase 1 — Foundation

- Establish the repository and TypeScript setup.
- Confirm compatible stable package versions.
- Configure React web and Expo mobile applications.
- Connect Clerk and Convex.
- Create development and production configuration.
- Define organization and membership models.
- Implement tenant-scoped authorization helpers.
- Establish baseline automated tests.

**Exit criterion:** Users authenticate, access the correct organization, and cannot access another tenant's records.

### Phase 2 — Assets and Work Orders

- Build the hierarchical asset registry.
- Implement asset and component histories.
- Create work orders and job numbering.
- Implement assignment, priority, status transitions, and authorized closure.
- Build the supervisor dashboard.

**Exit criterion:** A supervisor can create and assign a fault-related work order and see its state reflected in the application.

### Phase 3 — Technician Workflow and Safety

- Build the mobile assigned-jobs view.
- Implement PTP, PPE, and required LOTO verification records.
- Add findings, notes, labor, and completion records.
- Add attachments.
- Enforce required transitions on the backend.

**Exit criterion:** A technician can document the required workflow, and prohibited transitions are rejected by the backend.

### Phase 4 — Inventory and Procurement

- Implement parts and stock locations.
- Add inventory transactions and adjustments.
- Build suppliers, purchase requests, and approval rules.
- Create purchase orders and receiving.
- Connect parts consumption to work orders.
- Add low-stock and pending-purchase indicators.

**Exit criterion:** Repairs and purchase receipts update the correct records without duplicate or inconsistent inventory transactions.

### Phase 5 — Preventive Maintenance and Downtime

- Implement calendar-based schedules.
- Generate due work reliably.
- Track overdue work and maintenance completion.
- Record downtime and restoration times.
- Link events to assets and work orders.

**Exit criterion:** Recurring schedules create the correct work without duplication, and downtime history is reportable.

### Phase 6 — Notifications and Analytics

- Implement the in-app notification center.
- Integrate operational email where appropriate.
- Handle retries and delivery failures.
- Build maintenance and reliability dashboards.
- Validate cost and reliability calculations.

**Exit criterion:** Important actions are visible to the correct users, and dashboard metrics reconcile with source records.

### Phase 7 — Offline Drafts and Release Hardening

- Implement local draft persistence.
- Add stale-record detection and submission review.
- Test duplicate submissions and failed synchronization.
- Complete tenant-isolation and permission testing.
- Verify attachments, audit records, recovery procedures, and release configuration.
- Run the end-to-end acceptance scenario.

**Exit criterion:** The full workflow passes tests, limitations are documented, and the app can be deployed without exposing production data or credentials.

## 15. Deployment and Recovery

Use managed hosting and a documented release checklist. Keep development and production configuration separate; add staging when it materially improves release safety.

Before production use:

- Verify Convex deployment configuration and access controls.
- Verify Clerk settings, organization configuration, and redirect URLs.
- Confirm email delivery configuration.
- Test attachment uploads and access permissions.
- Confirm error and failed-job visibility.
- Document recovery from failed deployments and accidental changes.
- Verify backup/export capabilities and test restoring essential records.
- Keep test data separate from customer data.

Do not assume a specific backup or point-in-time recovery feature is included without verifying the selected plan and current documentation.

## 16. V1 Exclusions

- Live PLC/SCADA integration.
- Automatic conveyor fault detection.
- Autonomous machinery control.
- Predictive or AI-based failure forecasting.
- Condition-based and operating-hour-based maintenance.
- External supplier catalogs and automatic purchasing.
- Full offline-first synchronization.
- Advanced enterprise BI and complex cross-facility analytics.
- A fully configurable permission engine.

These may be reconsidered after the core maintenance workflow is stable.

## 17. Assumptions to Validate

1. Calendar-based maintenance is sufficient for V1.
2. Manual downtime entry is acceptable without live machine telemetry.
3. A fixed four-role permission model meets initial requirements.
4. Convex and Clerk support the required deployment, organization, storage, and access-control needs at acceptable cost.
5. Email notifications can be delivered through Clerk capabilities or a selected dedicated provider.
6. Local drafts can be implemented without unsafe offline work authorization.
7. A simple purchasing approval model meets initial requirements.
8. Managed deployment and recovery options are adequate for initial production use.

## 18. Definition of Done

V1 is complete when:

- All four roles have verified permissions.
- Organization data is isolated.
- Assets and components have traceable histories.
- Work orders follow the controlled lifecycle.
- Required safety checks cannot be bypassed through ordinary application actions.
- Technicians document repairs, labor, parts, and downtime.
- Calendar-based maintenance generates work correctly.
- Procurement and receiving update inventory accurately.
- Attachments are protected and associated with the correct records.
- Audit history is available for critical actions.
- In-app and configured email notifications handle failures visibly.
- Core reliability analytics reconcile with source data.
- Offline drafts are reviewable and stale changes are handled safely.
- Automated and manual acceptance tests pass.
- Deployment and recovery procedures are documented.

**Final principle:** Build the smallest complete version of every required workflow. Do not substitute mock interactions for backend behavior or label excluded functionality as implemented.
