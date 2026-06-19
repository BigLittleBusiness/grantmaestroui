# Grant Maestro UI Assessment Notes

Source: `/home/ubuntu/upload/grantmaestro_ui_assessment.pdf`

## Priority 2 — High Impact, High Effort (Core UX Overhaul)

### 1. Implement Inline Table Editing
- **Rationale:** Users coming from Excel expect to click a cell and type. The current flow requires navigating to a separate edit page.
- **Implementation approach:** Upgrade the `react-table` implementation to support inline cell editing for basic fields such as status, dates, and amounts. This should reduce clicks and make the app feel familiar to Excel users.

### 2. Redesign the Dashboard
- **Rationale:** The current dashboard is functional but not insightful.
- **Implementation approach:** Introduce charting libraries such as Recharts or Chart.js to visualize “Grants Won vs Lost” and “Funding Pipeline” instead of only listing numbers. Make the progress bars interactive.

### 3. Streamline the Grant Detail View
- **Rationale:** The tabbed interface is good, but the forms are too long.
- **Implementation approach:** Group related fields into visual cards within tabs. Use a 2-column grid for forms on desktop to reduce vertical scrolling. Ensure the `viewOnly` state matches the edit state layout.

## Priority 3 noted in assessment for future reference
- Enhance Task Management
- Refine the File Vault
- Global Search

## Excel-to-Web transition notes from assessment
- Density is okay; do not oversimplify tables with excessive padding.
- Improve keyboard navigation and tab order through forms.
- Add bulk actions to GrantList and TaskList in future work.

## Status relative to previously completed work
- Inline table editing: already completed in `src/features/grant/GrantList.js`.
- Dashboard charts: already completed in `src/features/dashboard/GrantChartsCard.js` and `src/pages/Dashboard.jsx`.
- Remaining likely Priority 2 item to implement now: streamline the Grant Detail View.
