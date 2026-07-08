# GrantMaestro Pre-Launch Manual Testing Guide

This guide provides a structured, end-to-end checklist for manually testing the GrantMaestro platform prior to launch. It covers all routes, features, and edge cases across both the React frontend and the Express/Sequelize backend.

## 1. Authentication & Onboarding

### 1.1 Registration & Onboarding
- [ ] **Sign Up:** Navigate to `/register`. Enter a valid email, password (min 8 chars), and select a subscription plan. Verify successful creation and redirection.
- [ ] **Duplicate Email:** Attempt to register with an email that already exists. Verify the "Email already exist" error appears.
- [ ] **Welcome Email:** Check the inbox of the registered email to confirm the welcome email was received.

### 1.2 Login & Session Management
- [ ] **Valid Login:** Navigate to `/login`. Enter valid credentials. Verify successful login, token generation (access and refresh cookies), and redirection to `/dashboard`.
- [ ] **Invalid Login:** Attempt login with an incorrect password. Verify the "Incorrect Password" error appears.
- [ ] **Session Persistence:** After logging in, refresh the page. Verify the session persists.
- [ ] **Logout:** Click the logout button. Verify redirection to `/login` and that attempting to navigate back to `/dashboard` via the browser back button fails.

### 1.3 Password Recovery
- [ ] **Forgot Password:** Navigate to `/forgot-password`. Enter a registered email. Verify the success message and check the inbox for the reset link.
- [ ] **Reset Password:** Click the link in the email (navigates to `/reset-password?uid=...&code=...`). Enter a new password. Verify successful reset and ability to log in with the new password.
- [ ] **Rate Limiting:** Attempt to request a password reset more than 3 times in one day. Verify the "Max number of attempt has been exceeded" error.

## 2. Dashboard & Global Navigation

### 2.1 Global Search
- [ ] **Search Functionality:** Click the search bar in the header. Type a known grant title, task description, or team member name. Verify results appear grouped by category.
- [ ] **Navigation:** Click a search result. Verify it navigates to the correct detail page (e.g., `/grant/details/:id`).
- [ ] **Clear Search:** Press the `Escape` key or click the clear (X) button. Verify the search dropdown closes and input clears.

### 2.2 Dashboard Widgets
- [ ] **Summary Cards:** Verify the total counts for Grants, Tasks, and Team Members match the actual data.
- [ ] **Grant Charts:** Verify the "Grants by Stage" donut chart and "Closing Pipeline" bar chart render correctly and display tooltips on hover.
- [ ] **Admin Grant Card:** Verify the progress bars display the correct stage colour and label based on the grant's data.
- [ ] **Outstanding Tasks:** Verify overdue tasks are highlighted in red and sorted to the top of the list.

## 3. Grant Management

### 3.1 Grant Creation & Editing
- [ ] **Create Grant:** Navigate to `/grant/create`. Fill out all required fields. Verify successful creation and redirection to the grant list.
- [ ] **Edit Grant:** From the grant list, click the edit icon for a grant. Modify several fields across different tabs (Finding, Suitability, Submission, Outcome, Financials). Save and verify changes persist.
- [ ] **Inline Editing:** On the `/grant` list page, click a cell in the "Max Fund Amount" or "Sought Amount" column. Modify the value, click away (blur), and verify the update saves automatically.

### 3.2 Grant Detail View
- [ ] **View Parity:** Navigate to `/grant/details/:id`. Verify the read-only field cards exactly match the layout and grouping of the edit form.
- [ ] **Currency Formatting:** Verify all financial fields display in the correct format (e.g., `$10,000`).
- [ ] **Outcome Colour Coding:** Verify the Outcome field displays green for "Won" and red for "Lost" or "Declined".

### 3.3 File Vault & Notes
- [ ] **Drag-and-Drop Upload:** On the grant detail page, drag a file onto the File Vault dropzone. Verify the preview appears, then click Upload. Verify the file appears in the list with the correct type icon.
- [ ] **File Download:** Click an uploaded file in the vault. Verify it downloads correctly.
- [ ] **Add Note:** Add a new note in the Grant Notes section. Verify it saves and appears in the timeline.

### 3.4 Grant List Export & Filtering
- [ ] **Filtering:** On the `/grant` list page, apply filters for Status, Category, and Closing Date. Verify the list updates correctly.
- [ ] **Clear Filters:** Click the "Clear Filters" button. Verify all filters reset and the full list returns.
- [ ] **CSV Export:** Click the CSV export button. Open the downloaded file and verify data is formatted correctly, especially fields containing commas or quotes.
- [ ] **Print/PDF:** Click the Print button. Verify the browser print dialog opens with a clean layout.

## 4. Task Management

### 4.1 Task Creation & Editing
- [ ] **Create Task:** Navigate to `/add-task`. Fill out the form, assigning it to a team member and setting a priority (High/Medium/Low). Verify successful creation.
- [ ] **Edit Task:** Navigate to `/edit-task/:id`. Change the status and due date. Verify changes save correctly.
- [ ] **Validation:** Attempt to save a task without a status. Verify the "Status is required" error appears (confirming the `task_sattus` typo fix).

### 4.2 Task List & Detail View
- [ ] **Priority Badges:** On the `/tasks` list page, verify the priority column displays the correct colour-coded badge. Change the priority via the inline dropdown and verify it updates.
- [ ] **Overdue Indicators:** Verify tasks past their due date display a red date and warning icon.
- [ ] **Task Detail:** Navigate to `/view-task/:id`. Verify the read-only view uses the new field card layout and displays an overdue banner if applicable.

## 5. Team Management

### 5.1 Team Member CRUD
- [ ] **Add Member:** Navigate to `/add-team-member`. Fill out the form. Verify successful creation.
- [ ] **Edit Member:** Navigate to `/edit-team-member/:id`. Modify details and save. Verify changes persist.
- [ ] **Remove Member:** On the `/team-members` list page, delete a member. Verify they are removed from the list.

## 6. Settings & Administration

### 6.1 Profile & Security
- [ ] **Update Profile:** Navigate to `/profile`. Update details and upload a new profile image. Verify changes save.
- [ ] **Change Password:** Navigate to `/change-password`. Enter the old password and a new password. Verify successful update and that you are required to log in again.

### 6.2 System Settings (Super Admin Only)
- [ ] **Pin Payments:** Navigate to `/admin/pin-settings`. Verify the webhook URL displays correctly (no hardcoded ports). Test saving new credentials.
- [ ] **Subscription Plans:** Navigate to `/seat-usage` or related subscription pages. Verify plan details load correctly.

## 7. AI Features (If Configured)

*Note: These tests require `OPENAI_API_KEY` to be set in the backend environment.*

- [ ] **Suitability Scoring:** Trigger the AI suitability score for a grant. Verify it returns a score (1-10), rationale, and recommendation.
- [ ] **Task Generation:** Use the AI task description generator. Verify it produces a concise, actionable paragraph based on the grant context.
- [ ] **Note Drafting:** Use the AI note drafter. Verify it produces a structured, professional note appropriate for the selected note type.

## 8. Security & Edge Cases

- [ ] **Rate Limiting:** Rapidly refresh the login page or submit login requests. Verify the `express-rate-limit` blocks excessive requests with a 429 status.
- [ ] **XSS Prevention:** Attempt to enter basic HTML/script tags (e.g., `<script>alert(1)</script>`) into a grant title or task description. Verify it renders as plain text, not executable code.
- [ ] **Unauthorised Access:** Log in as a standard user (not Super Admin). Attempt to navigate directly to `/admin/pin-settings`. Verify access is denied or redirected.
