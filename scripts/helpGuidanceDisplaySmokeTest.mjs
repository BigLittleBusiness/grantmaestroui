import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const read = (path) => readFile(new URL(path, import.meta.url), 'utf8')
const [page, pageStyles, analyticsPage, analyticsStyles, contextualLink, routes, sideBar, access, invitationPage, invitationForm, taskForm, acquittals, reports, subscription, payments, emailSettings] = await Promise.all([
  read('../src/pages/HelpGuidancePage.jsx'),
  read('../src/pages/HelpGuidancePage.css'),
  read('../src/pages/HelpGuidanceAnalyticsPage.jsx'),
  read('../src/pages/HelpGuidanceAnalyticsPage.css'),
  read('../src/components/help/ContextualHelpLink.jsx'),
  read('../src/routes/ProtectedRoutes.js'),
  read('../src/components/SideBar.jsx'),
  read('../src/utils/roleAccess.js'),
  read('../src/pages/TeamMember/TeamMemberAddPage.js'),
  read('../src/features/teamMember/TeamMemberAdd.js'),
  read('../src/features/tasks/TaskAdd.js'),
  read('../src/features/grant/AcquittalCentre.jsx'),
  read('../src/pages/ReportPage.jsx'),
  read('../src/pages/Settings/SubscriptionPage.jsx'),
  read('../src/pages/Settings/PaymentSettingsPage.jsx'),
  read('../src/pages/Settings/EmailSettingsPage.jsx'),
])

assert.match(page, /Top help for your role/)
assert.match(page, /Your Top 10/)
assert.match(page, /help-guidance/)
assert.match(page, /search.*guidance available to your role/i)
assert.match(page, /track\('answer_feedback', selectedTopic\.id/)
assert.match(pageStyles, /gm-help__question-list/)
assert.match(contextualLink, /contextual_link_opened/)
assert.match(contextualLink, /encodeURIComponent\(topicId\)/)
assert.match(routes, /path='\/help-guidance'/)
assert.match(routes, /path='\/admin\/help-guidance-insights'/)
assert.match(sideBar, /Help &amp; Guidance/)
assert.match(sideBar, /Guidance insights/)
assert.match(access, /'\/help-guidance'/)
assert.match(analyticsPage, /zeroResultSearches/)
assert.match(analyticsPage, /defaultViewsByRole/)
assert.match(analyticsPage, /commonSearchIntents/)
assert.match(analyticsPage, /raw private text/i)
assert.match(analyticsStyles, /gm-help-analytics__metrics/)

const contextualTopics = [
  [invitationPage, 'team-invitations'],
  [invitationForm, 'team-invitations'],
  [taskForm, 'collaboration-controls'],
  [acquittals, 'acquittal-checklists'],
  [reports, 'quarterly-report-inclusion'],
  [subscription, 'subscription-changes'],
  [payments, 'payment-provider-configuration'],
  [emailSettings, 'email-configuration'],
]
for (const [source, topic] of contextualTopics) {
  assert.match(source, new RegExp(`topicId=['\"]${topic}['\"]|topic=${topic}`), `Expected contextual help topic ${topic}`)
}
assert.match(taskForm, /isOrganisationAdmin && <ContextualHelpLink topicId='collaboration-controls'/)

// Platform-only routes stay nested under /admin/, which the existing role guard
// restricts to Platform Super Admins. Organisation users still have a safe
// post-expiry path to subscription guidance.
assert.match(access, /\['\/admin\/', \[ROLE\.PLATFORM_SUPER_ADMIN\]\]/)
assert.match(access, /'\/help-guidance'/)

console.log('Help and Guidance UI routes, Top 10, contextual links and insights smoke tests passed.')
