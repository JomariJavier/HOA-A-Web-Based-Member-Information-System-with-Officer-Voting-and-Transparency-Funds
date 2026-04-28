# HOA System Integration Plan

This document outlines the multi-phase plan to integrate advanced features from the **OLD SYSTEM** into the current **NEW SYSTEM** (HOA-A-Web-Based-Member-Information-System). 

It highlights the critical gaps by contrasting what the old system successfully implemented against the current shortcomings of the new system.

---

## Phase 1: RBAC & Authentication (Foundation)

### State Comparison
*   **OLD SYSTEM:**
    *   **Has:** Robust `SecurityConfig` with `BCryptPasswordEncoder`, a well-defined `User` entity (UUID, roles: MEMBER/ADMIN/SUPERADMIN, status), a `DataInitializer` for seeding default accounts, and a fully styled `Login.jsx` frontend.
    *   **Hasn't:** Full integration with the new system's routing structure.
*   **NEW SYSTEM:**
    *   **Does:** Have a basic `User` entity structure.
    *   **Doesn't:** Have secure access (currently set to `permitAll()`), lacks `BCrypt` hashing, lacks data initialization (no way to log in initially), and has no functional `AuthContext` or Login UI.

### Integration Action Plan (For AI Agent Execution)

**1. Backend Execution:**
*   **Entities:** Verify `com.hoa.backend.auth.User` has `UUID id`, `String username`, `String password_hash`, `String role`, and `String status`.
*   **Security Configuration:** Open `SecurityConfig.java`. Replace `permitAll()` on sensitive endpoints. Add a `@Bean` for `BCryptPasswordEncoder`. Configure the `SecurityFilterChain` to restrict `/api/members`, `/api/finance`, etc., while allowing `/api/auth/login`.
*   **Data Seeding:** Copy `DataInitializer.java` from `OLD SYSTEM/Backend/src/main/java/com/hoa/backend/auth/` to the new backend. Ensure it seeds a `SUPERADMIN` and a regular `MEMBER` if the `users` table is empty.

**2. Frontend Execution:**
*   **Authentication Context:** Create `src/contexts/AuthContext.jsx` to manage the JWT token, user roles, and login/logout functions. Wrap the app in this context inside `App.jsx` or `main.jsx`.
*   **Login UI:** Copy `Login.jsx` and `Login.css` from the OLD SYSTEM to `src/components/Auth/`. Wire the form to submit credentials to the backend auth endpoint and save the resulting token to `AuthContext`.
*   **Routing/Layout:** Update `BaseLayout.jsx` and `App.jsx` to implement protected routes. If a user is not logged in, redirect them to `/login`. Conditionally render sidebar links based on the user's role (e.g., hide "Audit Dashboard" from regular members).

**3. Database Execution:**
*   **Verification:** Ensure `application.properties` uses `spring.jpa.hibernate.ddl-auto=update`. Run the backend to allow Hibernate to generate the constraints for `role` (MEMBER, ADMIN, SUPERADMIN) and `status` (ACTIVE, INACTIVE).

---

## Phase 2: Personal Information System (PIS)

### State Comparison
*   **OLD SYSTEM:**
    *   **Has:** A comprehensive `Member` entity including detailed fields (`email`, `contactNumber`, `maritalStatus`, `gender`, `familyMembers`). A robust `MemberList.jsx` frontend featuring search, filtering, detailed profile views, and registration forms.
    *   **Hasn't:** Strict backend role-locking on all mutation endpoints.
*   **NEW SYSTEM:**
    *   **Does:** Have a simplified `Member` entity and basic REST endpoints.
    *   **Doesn't:** Have the detailed personal fields (e.g., missing `email` and `contactNumber`), lacks the advanced frontend components (Directory, Profile, Form separation).

### Integration Action Plan (For AI Agent Execution)

**1. Backend Execution:**
*   **Entity Expansion:** Open `Member.java`. Add the missing fields from the old system: `String email`, `String contactNumber`, `String maritalStatus`, `String gender`, `String familyMembers`. Add validation annotations (e.g., `@Email`).
*   **Service Layer Extraction:** Create `MemberService.java`. Move business logic from `MemberController.java` to this service. Implement methods for `createMember`, `updateMemberProfile`, and `deactivateMember` (soft delete).
*   **Endpoint Security:** Open `MemberController.java`. Add `@PreAuthorize("hasRole('ADMIN')")` to `POST`, `PUT`, and `DELETE` endpoints. Ensure `GET` endpoints are restricted to authenticated users.

**2. Frontend Execution:**
*   **Component Breakdown:** The old system had a monolithic `MemberList.jsx`. You must extract this into modular components in the new `src/components/Member/` directory:
    *   Create `MemberDirectory.jsx` (for the data table and search/filter logic).
    *   Create `MemberProfile.jsx` (for viewing a specific member's details).
    *   Create `MemberRegistration.jsx` (for the Add/Edit form).
*   **State & API Wiring:** Create a parent `MemberHub.jsx` (or similar) to orchestrate view switching between the Directory, Profile, and Registration forms. Wire the API calls to `http://localhost:8081/api/members`.
*   **UI Features:** Implement the role-based filter chips ('All', 'Officer', 'Member') and the text search bar on the Directory view to filter the fetched array before rendering.

**3. Database Execution:**
*   **Verification:** Running the Spring Boot application with `ddl-auto=update` will alter the `members` table to include the new columns. Verify no data is lost during this transition.

---

## Phase 3: Voting System (Election Integrity)

### State Comparison
*   **OLD SYSTEM:**
    *   **Has:** A sophisticated "Double-Blind" voting schema using `VoteTracker` (who voted) and `Vote` (what the vote was) to ensure anonymity. Strict time-based constraints preventing voting after elections end. Polished `VotingBallot.jsx` and `ElectionManagement.jsx`.
    *   **Hasn't:** Automated charting/graphing of final results.
*   **NEW SYSTEM:**
    *   **Does:** Have basic `Election` and `Candidate` entities.
    *   **Doesn't:** Have the anonymity logic (`VoteTracker`/`Vote` are missing or incomplete). Lacks time-based validation in the controllers. Frontend voting interface is incomplete.

### Integration Action Plan (For AI Agent Execution)

**1. Backend Execution:**
*   **Double-Blind Logic:** Copy the `Vote.java` and `VoteTracker.java` entities from the OLD SYSTEM to `com.hoa.backend.voting`. Create `VoteRepository` and `VoteTrackerRepository`. 
*   **Voting Controller Validation:** Open `VotingController.java`. In the method that handles cast votes (e.g., `POST /api/voting/elections/{id}/vote`), add logic to:
    1. Verify `LocalDateTime.now()` is between the election's `startDate` and `endDate`.
    2. Check `VoteTrackerRepository` to ensure the current authenticated `User` hasn't already voted in this election.
*   **Role Enforcement:** Add `@PreAuthorize("hasRole('MEMBER')")` to the voting endpoint to prevent Admins from tampering or voting.

**2. Frontend Execution:**
*   **Component Porting:** Copy `VotingRoom.jsx`, `ElectionList.jsx`, `VotingBallot.jsx`, and `ElectionManagement.jsx` from the OLD SYSTEM to `src/components/Voting/`.
*   **API Wiring & Routing:** Update all `fetch` or `axios` calls in these components to point to `http://localhost:8081`. 
*   **UI Constraints:** In `VotingRoom.jsx`, ensure the "Create Poll" Floating Action Button (FAB) and `ElectionManagement` view are only rendered if the user's role is `ADMIN` or `SUPERADMIN`.

**3. Database Execution:**
*   **Schema Generation:** Rely on Hibernate's `ddl-auto=update` to generate the new `votes` and `vote_tracker` tables. 
*   **Integrity Check:** Verify the `vote_tracker` table successfully creates a unique constraint combining `member_id` and `election_id` to enforce the one-vote-per-person rule.

---

## Phase 4: Financial Auditing & Project Management

### State Comparison
*   **OLD SYSTEM:**
    *   **Has:** `AuditRecord` acting as a strict financial ledger with `amount` (using `BigDecimal` for precision), transaction type, and linked to the `recorded_by` User. Implements a "Soft Delete" pattern (`isDeleted`). Comprehensive `FinanceService`.
    *   **Hasn't:** Real-time data visualization dashboards.
*   **NEW SYSTEM:**
    *   **Does:** Have a basic `Project` entity and a simplified `AuditRecord` class.
    *   **Doesn't:** Have an `amount` field in `AuditRecord` (which previously caused database startup crashes due to null constraints). Lacks `BigDecimal` precision, soft-delete logic, and frontend financial dashboards.

### Integration Action Plan (For AI Agent Execution)

**1. Backend Execution:**
*   **Ledger Refactoring:** Open `AuditRecord.java` in `com.hoa.backend.audit`. Ensure the following fields exist and are typed correctly: `BigDecimal amount`, `String type` (INCOME/EXPENSE), `boolean isDeleted` (defaults to false), and a `@ManyToOne` relationship `User recordedBy`.
*   **Soft Delete Implementation:** In `FinanceService.java` (or equivalent), rewrite the delete logic. Instead of `repository.delete(record)`, set `record.setDeleted(true)` and save it.
*   **Security:** In the Finance/Audit controller, lock the `POST`, `PUT`, and `DELETE` endpoints with `@PreAuthorize("hasRole('ADMIN')")`. `GET` endpoints can remain accessible to members for transparency.

**2. Frontend Execution:**
*   **Dashboard Porting:** Copy `AuditRoom.jsx` and `BudgetDashboard.jsx` (if available) from the OLD SYSTEM to `src/components/Audit/`.
*   **Filtering Logic:** Update the frontend data fetching logic to filter out records where `isDeleted === true` so they don't appear in the main active ledger, but remain available for specific "Admin Archive" views.
*   **API Target:** Ensure all requests map to `http://localhost:8081`.

**3. Database Execution:**
*   **Precision constraints:** When running with `ddl-auto=update`, verify that the `amount` column in `audit_records` is created with a `NUMERIC(15,2)` precision. 
*   **Data Integrity:** Ensure the `is_deleted` column successfully defaults to `false` for existing rows if any data migration occurs.

---

## Phase 5: Public Relations (Announcements & Complaints)

### State Comparison
*   **OLD SYSTEM:**
    *   **Has:** Fully functional `Announcement` (with pinning/archiving) and `Complaint` entities. A complete resolution workflow (OPEN -> IN_PROGRESS -> RESOLVED). Polished `PRRoom.jsx` and `PRAdminWorkspace.jsx`.
    *   **Hasn't:** Deep integration with the new unified layout.
*   **NEW SYSTEM:**
    *   **Does:** Have placeholder packages.
    *   **Doesn't:** Have actual implementations for Announcements or Complaints. No backend logic or frontend views.

### Integration Action Plan (For AI Agent Execution)

**1. Backend Execution:**
*   **Entity Porting:** Copy `Announcement.java` and `Complaint.java` entities from the OLD SYSTEM to `com.hoa.backend.publicrelations`. Ensure `Complaint` contains an ENUM or String constraint for `status` (OPEN, IN_PROGRESS, RESOLVED) and a mapping to the `Member` entity.
*   **Service & Controller Implementation:** Create `PRService.java`. Implement the `resolveComplaint` method to set `status = "RESOLVED"`, `respondedAt = OffsetDateTime.now()`, and link the `respondedBy` User. Create `PRController.java` with necessary endpoints.
*   **Security Restrictions:** Use `@PreAuthorize("hasRole('ADMIN')")` on the endpoints for creating announcements and resolving complaints. Ensure members can only GET complaints associated with their own `MemberID`.

**2. Frontend Execution:**
*   **Component Porting:** Copy `PRRoom.jsx` and `PRAdminWorkspace.jsx` from the OLD SYSTEM to `src/components/PR/` in the new frontend.
*   **API Wiring:** Update all fetch/axios calls to target `http://localhost:8081/api/pr/...`. 
*   **UI Workflows:** Implement the ticket history filter in the Admin Workspace so officers can easily toggle between viewing 'OPEN' and 'RESOLVED' complaints. Bind the member complaint submission form to the authenticated user's ID.

**3. Database Execution:**
*   **Schema Generation:** Run the application with `ddl-auto=update` to generate the `announcements` and `complaints` tables.
*   **Relationship Verification:** Verify the database created a foreign key on `complaints.member_id` referencing `members.id`.

---

## Phase 6: System Security & Access Auditing (Black Box)

### State Comparison
*   **OLD SYSTEM:**
    *   **Has:** An `AuditLogService` that automatically captures IP addresses, User-Agents, and action details for non-repudiation.
    *   **Hasn't:** Advanced query filtering UI for the Superadmin.
*   **NEW SYSTEM:**
    *   **Does:** Nothing in this domain.
    *   **Doesn't:** Have any footprinting or centralized action logging.

### Integration Action Plan (For AI Agent Execution)

**1. Backend Execution:**
*   **Core Logic:** Copy `AuditLog.java` and `AuditLogService.java` from the OLD SYSTEM to `com.hoa.backend.audit`. Ensure the service uses `HttpServletRequest` to capture the client's IP address and `User-Agent`.
*   **System-Wide Wiring:** Inject `AuditLogService` into the controllers or services of the other modules (`MemberService`, `VotingController`, `FinanceService`, `PRService`). Add explicit calls to `logAction(userId, "ACTION_TYPE", "Details")` whenever a POST, PUT, or DELETE request successfully processes.
*   **API Security:** Create a GET endpoint to retrieve the logs and lock it tightly with `@PreAuthorize("hasRole('SUPERADMIN')")` (or `ADMIN` if appropriate for your governance model).

**2. Frontend Execution:**
*   **Dashboard Creation:** Create `src/components/Audit/SecurityDashboard.jsx`. 
*   **Routing Lock:** In `App.jsx` or your router, ensure the route to the Security Dashboard is strictly protected and only renders if the `AuthContext` confirms the user has the required admin role.
*   **Data Display:** Build a searchable and filterable data table that fetches from `http://localhost:8081/api/audit/logs`. Color code the action types (e.g., Red for deletions, Green for creations).

**3. Database Execution:**
*   **Table Generation:** `ddl-auto=update` will create the `audit_logs` table.
*   **Indexing:** Because this table will grow infinitely, add `@Table(indexes = { @Index(...) })` in `AuditLog.java` to index the `created_at` and `user_id` columns, ensuring fast query performance for the dashboard.
