# GrantMaestro UI/UX Audit Report — Minimum Awesome Product (MAP)

**Date:** 22 June 2026  
**Author:** Manus AI  
**Scope:** Complete codebase reassessment for MAP readiness

## Executive Summary

Following the successful implementation of Priority 1, 2, and 3 items from the initial assessment, GrantMaestro has achieved a significantly higher baseline of usability. The introduction of the design system, inline editing, visual field cards, drag-and-drop file vault, and global search have transformed the core workflows.

However, a deep-dive reassessment of the entire React codebase reveals several remaining friction points, technical debt, and UX inconsistencies that must be addressed to achieve a true "Minimum Awesome Product" (MAP). This report categorises these findings into High Priority (blocking MAP), Medium Priority (UX polish), and Low Priority (technical debt).

---

## 1. High Priority: Blocking MAP Readiness

These items directly impact core user workflows, cause confusion, or represent broken functionality that users will encounter during standard operations.

### 1.1 Grant List Filtering is Broken
The filter panel on the Grant List page (`GrantListPage.js`) contains a critical state management bug. The `onChangeClosingDate` handler incorrectly calls `setOpeningStartDate` instead of `setClosingStartDate`. As a result, users cannot filter grants by closing date, and attempting to do so overwrites their opening date filter.
**Recommendation:** Fix the state setter in `onChangeClosingDate`.

### 1.2 Grant Details Page Layout & Missing Components
The `GrantDetails.js` page has commented out the `GrantNote` and `GrantFileVault` components at the bottom of the file. While the File Vault was polished in Priority 3, it is currently invisible on the actual details page. Furthermore, the layout uses a mix of `col-xl-8` and `col-xl-4` grids that break on smaller screens, and the "Team & Tasks" card has a hardcoded height (`430px`) that causes awkward scrolling.
**Recommendation:** Uncomment the Note and File Vault components, integrate them into the grid layout properly, and remove hardcoded heights in favour of flexbox `flex-fill`.

### 1.3 Dashboard "Grant List" Widget Broken Link
The `GrantListComponent.js` widget on the dashboard contains "View All" and "Show More" links that point to `/grant-list`. However, the actual route defined in `ProtectedRoutes.js` is `/grant`. Clicking these links results in a 404 or blank page.
**Recommendation:** Update all `to='/grant-list'` references in the dashboard to `to='/grant'`.

### 1.4 Hardcoded Navigation & Anti-Patterns
Several components bypass React Router and force full page reloads using `window.location.href`. This destroys the Redux state and creates a jarring, slow experience. Examples include:
- `AdminGrantCard.js` (`window.location.href = '/grant'`)
- `OutstandingTask.js` (`window.location.href = '/tasks'`)
- `TeamTask.jsx` (`window.location.href = '/add-team'` and `/add-task`)
**Recommendation:** Replace all instances of `window.location.href` with React Router's `useNavigate` hook or `<Link>` components.

---

## 2. Medium Priority: UX Polish & Consistency

These items do not break the application but create a disjointed or unpolished experience that detracts from the "Awesome" in MAP.

### 2.1 Form Validation & Error Messages
Several forms have typos in their validation logic or display raw error keys. For example, in `TaskAdd.js` and `TaskEdit.js`, the error block checks for `formik.errors.task_sattus` (typo) instead of `task_status`. Additionally, the `TaskDetail.js` component uses disabled inputs instead of the new visual field cards (`.gm-field-card`) introduced in Priority 2.
**Recommendation:** Fix the typo in the task forms. Rewrite `TaskDetail.js` to use the `.gm-field-grid` and `.gm-field-card` classes for consistency with the Grant Details view.

### 2.2 Task List Filtering UI
The `TaskListPage.jsx` uses native `<select>` dropdowns for filtering by Grant, Assigned To, and Status. These dropdowns are large, unstyled, and take up significant vertical space above the table. They also lack a "Clear Filters" button.
**Recommendation:** Move the task filters into a collapsible filter panel (similar to the Grant List) or style them as compact inline dropdowns. Add a clear button.

### 2.3 Report Page Data Export
The `ReportPage.jsx` includes a `downloadExcel` function that manually constructs a CSV string. This approach fails if grant titles contain commas or quotes, leading to corrupted CSV files. Furthermore, the "Download PDF" and "Download CSV" buttons on the Grant List page are currently dummy links (`href='#'`).
**Recommendation:** Use a robust CSV parsing library (or proper escaping logic) for the Report export. Implement the actual export logic for the Grant List buttons, or hide them for the MAP release if out of scope.

### 2.4 Console Logs in Production
There are 49 instances of `console.log`, `console.warn`, or `console.error` scattered across the features and pages directories. Many of these log sensitive Redux state or API responses (e.g., `console.log('grant', grant)` in `GrantDetails.js`).
**Recommendation:** Remove all debugging `console.log` statements. Ensure `console.error` is only used for actual error boundaries or API failures, preferably wrapped in a logging utility.

---

## 3. Low Priority: Technical Debt & Code Quality

These items are invisible to the user but will slow down future development if left unaddressed.

### 3.1 JSX Class Attribute Errors
There are several instances where standard HTML `class=` is used instead of React's `className=`. This throws warnings in the console and can cause styling issues. Examples found in:
- `GrantCreatePage.js`
- `ReportPage.jsx`
**Recommendation:** Global search and replace `class='` with `className='` in all `.js` and `.jsx` files.

### 3.2 Redundant API Calls
In `CardsComponent.js` (Dashboard), the component fetches grants on mount. However, the `Dashboard.jsx` parent also renders `GrantChartsCard`, `AdminGrantCard`, and `GrantListComponent`, all of which independently check `if (!grants.length) dispatch(fetchGrants())`. While Redux prevents infinite loops, this pattern is fragile.
**Recommendation:** Centralise data fetching at the layout or page level (e.g., in `Dashboard.jsx`) rather than having every widget attempt to fetch data independently.

### 3.3 Hardcoded API URLs
In `PinPaymentsSettingsPage.jsx`, the webhook URL is constructed using `window.location.origin.replace(':5173', ':3005')`. This assumes the frontend is running on port 5173 and the backend on 3005, which will break in staging or production environments.
**Recommendation:** Use an environment variable (e.g., `process.env.REACT_APP_API_URL`) to construct the webhook URL dynamically.

---

## Conclusion

GrantMaestro has a solid foundation. By addressing the High Priority routing and state bugs, applying the new design system consistently across the Task and Team views, and cleaning up the technical debt, the application will confidently meet the criteria for a Minimum Awesome Product.
