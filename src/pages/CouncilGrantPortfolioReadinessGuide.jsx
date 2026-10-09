import React from 'react'
import Header from 'components/LandingPage/Header'
import Footer from 'components/LandingPage/Footer'
import MarketingSeo from 'components/seo/MarketingSeo'
import './ResourcesPage.css'

const dimensions = [
  ['1. Deadline visibility', 'A reliable view covers opportunity deadlines, active delivery milestones, reports and final acquittals. The question is not whether one person can find a date, but whether the people responsible can see the next material commitments before they become urgent.'],
  ['2. Forward planning', 'A practical forward view helps teams balance immediate submissions with the next 60 to 90 days of delivery, reporting and evidence work. It makes resourcing conversations possible before work becomes an escalation.'],
  ['3. Leadership reporting', 'Leaders need a current view of the portfolio: significant dates, stage, risk, accountable owner and next action. A useful view should reduce manual collation rather than create another monthly spreadsheet exercise.'],
  ['4. Acquittal checklists', 'For each funded grant, make the required deliverables, financial reconciliation, evidence, approvals and submission path visible early. Start with the highest-risk or nearest-due grants, then establish a repeatable approach.'],
  ['5. Evidence control', 'Store the working evidence with the grant record where possible. That includes agreements, approvals, invoices, progress evidence, reports and important correspondence. The goal is not a perfect file structure; it is reducing time spent reconstructing what is complete.'],
  ['6. Requirements visibility', 'Reporting and evidence requirements should be identified at the point a grant is accepted or confirmed, reviewed at planned checkpoints and kept visible to the contributors who need to act.'],
  ['7. Accountable ownership', 'Every active grant and material action benefits from one accountable owner. Contributors can be shared, but someone needs a visible responsibility to coordinate the next action and surface a risk.'],
  ['8. Continuity', 'A team can test continuity with a simple question: if an owner is unexpectedly away, can another authorised person find the current status, latest decision, documents and next action without searching through a personal inbox?'],
  ['9. Shared tasks', 'Grant work often depends on finance, procurement, delivery, executives and specialist contributors. Shared tasks should show an owner, due date, dependency and the evidence or decision that defines completion.'],
]

export default function CouncilGrantPortfolioReadinessGuide() {
  return (
    <div className='full-container gm-resource-page'>
      <MarketingSeo pageKey='readinessGuide' />
      <Header />
      <main id='main-content' tabIndex='-1'>
        <article className='gm-guide'>
          <header className='gm-guide__hero'>
            <div className='gm-resource-shell'>
              <p className='gm-resource-eyebrow'>Practical guide</p>
              <h1>Council Grant Portfolio Readiness: a practical guide</h1>
              <p>A clear portfolio is not only a list of grant opportunities. It is a shared operating view of commitments, evidence, accountable people and next actions from opportunity through acquittal.</p>
              <div className='gm-guide__meta'><span>For Australian and New Zealand council teams</span><span>8-minute read</span><span>Updated 9 October 2026</span></div>
            </div>
          </header>
          <div className='gm-resource-shell gm-guide__content'>
            <aside className='gm-guide__summary' aria-labelledby='guide-summary-title'>
              <h2 id='guide-summary-title'>The practical outcome</h2>
              <p>Give the relevant people a calmer, current view of what is due, who owns it, what evidence is missing and what needs attention next.</p>
              <a href='/grant-portfolio-readiness'>Take the free Readiness Snapshot</a>
            </aside>
            <section>
              <h2>What “ready” looks like in day-to-day work</h2>
              <p>Readiness is not a certification or a claim that every grant is risk-free. It is an operating habit: the team can see the portfolio, identify a priority before it becomes urgent and coordinate the work required to deliver or report with confidence.</p>
              <p>A useful first review needs only a manageable starting scope. Select the three nearest material commitments. For each, confirm the due date, accountable owner, next action and the latest evidence or decision still required. The aim is to create a reliable shared view, not to redesign every process at once.</p>
              <h2>The nine dimensions of grant portfolio readiness</h2>
              <div className='gm-guide__dimensions'>
                {dimensions.map(([title, body]) => <section key={title}><h3>{title}</h3><p>{body}</p></section>)}
              </div>
              <h2>A 30-day improvement rhythm</h2>
              <ol className='gm-guide__steps'>
                <li><strong>Week 1 — establish the current view.</strong> Bring the next 90 days of opportunities, reports and acquittals into one current portfolio view. Identify anything that is incomplete, uncertain or not clearly owned.</li>
                <li><strong>Week 2 — secure the nearest commitments.</strong> For the three nearest material dates, confirm requirements, name an accountable owner and identify the evidence, decision or dependency that may block completion.</li>
                <li><strong>Week 3 — create a repeatable checkpoint.</strong> Agree a short operating review with grants, finance and delivery contributors. Use the same fields: date, stage, owner, risk, next action and evidence status.</li>
                <li><strong>Week 4 — strengthen continuity.</strong> Test whether another authorised colleague can understand the status of a priority grant from the shared record alone. Close the most material gaps in context, documents or task visibility.</li>
              </ol>
              <h2>Use the right level of control</h2>
              <p>Not every opportunity requires the same level of process. Teams should apply proportionate control: a smaller opportunity may need a simple owner, deadline and decision record; a complex funded grant may need structured tasks, evidence, financial reconciliation and an acquittal checklist. The important point is that the required level of control is visible and agreed.</p>
              <h2>Start the conversation</h2>
              <p>Use the Grant Portfolio Risk &amp; Readiness Snapshot to reflect on the current position and generate initial priorities. It does not ask for grant, funder or financial details, and it is intended as a practical discussion aid rather than an audit or compliance assessment.</p>
              <div className='gm-guide__actions'><a href='/grant-portfolio-readiness'>Take the Readiness Snapshot</a><a className='gm-guide__text-link' href='/councils'>Explore GrantMaestro for councils</a></div>
            </section>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  )
}
