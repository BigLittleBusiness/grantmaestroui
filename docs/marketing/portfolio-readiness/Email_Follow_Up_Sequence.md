# GrantMaestro — Grant Portfolio Readiness Action Plan Email Sequence

## Voice and operating rules

GrantMaestro’s voice is **clear, practical and accountable**. Each email should help a council or public-purpose grants team see one useful next step—not create pressure, promise outcomes or overstate risk.

- **Trigger only after explicit consent** from the snapshot form.
- Every subject begins with **`GrantMaestro -`**.
- Write in plain, direct language: shared view, visible next action, accountable owner, supporting evidence and practical next step.
- Use a branded transactional template and form-only support links. Do not display a public support email address.
- Personalise only with information the person supplied or generated in the assessment.
- Do not imply a formal audit, certification, benchmark, financial saving, security guarantee or compliance outcome.
- Include a working unsubscribe link in every non-essential follow-up. Email 1 fulfils the requested action plan; Emails 2–5 are marketing follow-up.
- Deliver the detailed PDF from a signed, time-limited link where the production workflow supports it. Avoid direct file attachments where possible.
- Suppress the remaining sequence when a trial starts, a walkthrough is booked, the recipient unsubscribes, or a sales-qualified response is recorded.

## Recommended merge fields

| Field | Source |
|---|---|
| `{{first_name}}` | Form submission |
| `{{organisation}}` | Form submission |
| `{{overall_score}}` | Assessment calculation |
| `{{readiness_label}}` | Assessment calculation |
| `{{priority_1_title}}` / `{{priority_1_detail}}` | Lowest-scoring category |
| `{{priority_2_title}}` / `{{priority_2_detail}}` | Second-lowest category |
| `{{action_plan_url}}` | Signed PDF URL |
| `{{assessment_url}}` | Public snapshot URL with UTM source |
| `{{walkthrough_url}}` | Booking or form page—never a displayed email address |
| `{{trial_url}}` | GrantMaestro registration URL with relevant UTM source |
| `{{privacy_url}}` | Published privacy-policy URL |
| `{{unsubscribe_url}}` | Consent platform or CRM |

---

## Email 1 — Immediate action-plan delivery

**Send:** Immediately after a valid form submission, server-side Turnstile verification and consent confirmation.
**Purpose:** Deliver the promised action plan, establish relevance and leave the recipient with one clear first step.
**Subject:** `GrantMaestro - Your Grant Portfolio Readiness Action Plan`
**Preheader:** `Your practical priorities are ready to review.`

### Body

Hi {{first_name}},

Thank you for completing the Grant Portfolio Risk & Readiness Snapshot for {{organisation}}.

Your snapshot result is **{{overall_score}}/100 — {{readiness_label}}**.

Your detailed action plan is ready. It sets out three practical priorities to help make deadlines, ownership and supporting evidence easier to see and coordinate.

**Start here**
**{{priority_1_title}}**
{{priority_1_detail}}

[**Download my detailed action plan**]({{action_plan_url}})

Use the plan as a prompt for your next grants, finance or leadership discussion. It is a practical working aid—not a compliance assessment or certification.

If you would like to see what a shared grant workspace could look like for your team, [view a council-focused GrantMaestro walkthrough]({{walkthrough_url}}).

Regards,
**GrantMaestro**

Footer: [Privacy]({{privacy_url}}) · [Unsubscribe]({{unsubscribe_url}})

---

## Email 2 — Put the next seven days in view

**Send:** 2 business days after Email 1, unless a walkthrough is booked or a trial has started.
**Purpose:** Turn the result into a manageable operating change.
**Subject:** `GrantMaestro - Put one grant action in clear view this week`
**Preheader:** `A practical seven-day starting point for your team.`

### Body

Hi {{first_name}},

You do not need to redesign every grant process to make progress.

For the next seven days, choose the three active grants or acquittals with the closest material dates. For each one, make four things visible:

1. The next due date
2. The accountable owner
3. The next action
4. The evidence or documents still needed

Then review that list with the people who need to contribute.

Your snapshot identified **{{priority_1_title}}** as the first area to strengthen. A short, shared view of the work is often the most useful place to begin.

[**Re-open my action plan**]({{action_plan_url}})

GrantMaestro is designed to bring those dates, actions, owners and records into one current workspace.

[**See the council workflow in practice**]({{walkthrough_url}})

Regards,
**GrantMaestro**

Footer: [Privacy]({{privacy_url}}) · [Unsubscribe]({{unsubscribe_url}})

---

## Email 3 — Get ahead of the next acquittal

**Send:** 5 business days after Email 1, unless a walkthrough is booked or a trial has started.
**Purpose:** Address acquittal and evidence readiness with a practical prompt.
**Subject:** `GrantMaestro - Three questions before the next acquittal date`
**Preheader:** `Bring requirements, owners and evidence into view early.`

### Body

Hi {{first_name}},

Acquittal work is easier to coordinate when requirements, evidence and contributors are visible before the deadline becomes urgent.

Before the next material reporting or acquittal date, ask:

- **What must be submitted or evidenced?**
- **Who is accountable for each open item?**
- **Where is the latest approved evidence held?**

If any answer takes time to find, begin with a grant-level checklist. List each requirement, assign an owner and record what evidence is still outstanding.

Your snapshot highlighted **{{priority_2_title}}** as an area to strengthen.

[**Review the relevant action in my plan**]({{action_plan_url}})

GrantMaestro’s acquittal centre is designed for this shared checklist, evidence and deadline view.

[**Request a focused walkthrough**]({{walkthrough_url}})

Regards,
**GrantMaestro**

Footer: [Privacy]({{privacy_url}}) · [Unsubscribe]({{unsubscribe_url}})

---

## Email 4 — Make continuity practical

**Send:** 9 business days after Email 1, unless a walkthrough is booked or a trial has started.
**Purpose:** Show managers and leadership the value of visible grant context and handover-ready work.
**Subject:** `GrantMaestro - Could another authorised colleague continue the work?`
**Preheader:** `A practical continuity check for every active grant.`

### Body

Hi {{first_name}},

A useful continuity check is straightforward:

> If the usual grant coordinator was unavailable tomorrow, could another authorised colleague quickly see the current status, next action, upcoming commitment and supporting evidence?

For every active grant, make these four items current and visible:

1. Accountable owner
2. Current lifecycle stage
3. Next action and due date
4. Supporting documents and key decisions

This is not process for process’ sake. It reduces avoidable reliance on individual memory, inboxes and ad hoc handovers.

[**Use my action plan in a team discussion**]({{action_plan_url}})

[**Explore GrantMaestro for shared grant workflows**]({{walkthrough_url}})

Regards,
**GrantMaestro**

Footer: [Privacy]({{privacy_url}}) · [Unsubscribe]({{unsubscribe_url}})

---

## Email 5 — Choose the next useful step

**Send:** 14 business days after Email 1. Suppress if the recipient has unsubscribed, started a trial, booked a walkthrough or provided a sales-qualified response.
**Purpose:** Offer a relevant next step without pressure.
**Subject:** `GrantMaestro - Choose a practical next step for your grant portfolio`
**Preheader:** `Keep the action plan, start a trial or request a walkthrough.`

### Body

Hi {{first_name}},

You completed the Grant Portfolio Risk & Readiness Snapshot two weeks ago.

If clearer visibility, accountable ownership or stronger acquittal readiness is a current priority, choose the next step that suits your team:

- [**Start a 14-day GrantMaestro trial**]({{trial_url}}) — explore the workflows with your own team.
- [**Request a council-focused walkthrough**]({{walkthrough_url}}) — discuss the areas highlighted in your snapshot.

If the timing is not right, keep the action plan as a useful prompt for your next grants, governance or leadership discussion.

[**Download my action plan again**]({{action_plan_url}})

Regards,
**GrantMaestro**

Footer: [Privacy]({{privacy_url}}) · [Unsubscribe]({{unsubscribe_url}})

---

## Automation and measurement notes

| Event | Action |
|---|---|
| Valid assessment, valid Turnstile and explicit consent | Create the lead record, retain the assessment result, generate action-plan data and send Email 1. |
| PDF link clicked | Record engagement only; do not automatically change sales status. |
| Walkthrough link clicked | Attribute intent; suppress the remaining sequence only when a booking is completed. |
| Trial starts | Stop this sequence and enter the product onboarding sequence. |
| Unsubscribe | Stop Emails 2–5 immediately; retain only essential service communications as permitted. |
| Email hard bounce | Suppress the address and flag the lead record. |

Use distinct UTM values for LinkedIn company posts, founder posts, partner posts and paid campaigns. Compare assessment starts, action-plan requests, walkthrough bookings and trial starts—not subjective social metrics alone.
