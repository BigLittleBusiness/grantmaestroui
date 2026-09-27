import React, { useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import Header from 'components/LandingPage/Header'
import Footer from 'components/LandingPage/Footer'
import TurnstileWidget from 'components/contact/TurnstileWidget'
import api from 'api'
import './PortfolioReadinessPage.css'

const questions = [
  {
    category: 'visibility',
    question: 'How reliably can your team see every upcoming grant deadline in one shared place?',
    helper: 'Think about opportunities, submissions, milestone reports and acquittal dates—not individual inboxes.',
    options: [
      ['Not reliably', 'Dates sit across inboxes, personal calendars or separate spreadsheets.', 0],
      ['Partly visible', 'We have a list, but it is not consistently complete or current.', 1],
      ['Mostly visible', 'Most key dates are shared, but checking them still requires manual follow-up.', 2],
      ['Consistently visible', 'The whole team can see and act on current deadlines in one workflow.', 3],
    ],
  },
  {
    category: 'visibility',
    question: 'How far ahead can you confidently identify grants, reports and acquittals that need action?',
    helper: 'This is about meaningful forward visibility, not only the next urgent deadline.',
    options: [
      ['Less than 30 days', 'Our view is reactive and focused on the immediate queue.', 0],
      ['About 30 days', 'We can usually see next-month priorities.', 1],
      ['60–90 days', 'We can plan most short-term actions with reasonable confidence.', 2],
      ['More than 90 days', 'We use a reliable forward view for planning and resourcing.', 3],
    ],
  },
  {
    category: 'visibility',
    question: 'When leadership asks about the portfolio, how easy is it to produce a current status view?',
    helper: 'Include deadlines, progress, risk and upcoming reporting commitments.',
    options: [
      ['Difficult', 'Information must be collated manually from several people or files.', 0],
      ['Possible but manual', 'We can produce it, but it takes significant time to prepare.', 1],
      ['Mostly available', 'A view exists, although some data needs checking before it is shared.', 2],
      ['Readily available', 'Current status, risk and next actions are visible without manual collation.', 3],
    ],
  },
  {
    category: 'acquittal',
    question: 'How confident are you that every funded grant has a clear acquittal or reporting checklist?',
    helper: 'Consider deliverables, financial evidence, milestone reports, approvals and final submission requirements.',
    options: [
      ['Low confidence', 'Requirements are interpreted late or tracked informally.', 0],
      ['Some coverage', 'Important grants have checklists, but the approach is inconsistent.', 1],
      ['Good coverage', 'Most grants have a structured checklist, with a few gaps.', 2],
      ['High confidence', 'Every funded grant has a current, owned checklist and evidence path.', 3],
    ],
  },
  {
    category: 'acquittal',
    question: 'Where are the documents and evidence needed for applications and acquittals kept?',
    helper: 'Think about agreements, approvals, invoices, progress evidence, reports and correspondence.',
    options: [
      ['Scattered', 'They are spread through personal drives, inboxes or general folders.', 0],
      ['Partly organised', 'Some files are centralised, but it can be hard to tell what is complete.', 1],
      ['Mostly centralised', 'Documents are generally together, with occasional version or access gaps.', 2],
      ['Structured by grant', 'The relevant evidence and decisions are organised with each grant record.', 3],
    ],
  },
  {
    category: 'acquittal',
    question: 'How often are reporting or evidence requirements discovered later than you would like?',
    helper: 'Choose the closest operational reality, not an ideal future state.',
    options: [
      ['Often', 'This creates regular rushed work or avoidable escalation.', 0],
      ['Sometimes', 'We generally cope, but surprises still occur.', 1],
      ['Rarely', 'The team usually identifies requirements in time.', 2],
      ['Very rarely', 'We routinely work from visible requirements and planned checkpoints.', 3],
    ],
  },
  {
    category: 'ownership',
    question: 'How clear is the accountable owner for each active grant, report and acquittal action?',
    helper: 'An owner is someone who can see the next action and coordinate the necessary contributors.',
    options: [
      ['Usually unclear', 'Ownership depends on informal knowledge or who happens to notice an issue.', 0],
      ['Somewhat clear', 'Owners exist for major grants, but not for all actions.', 1],
      ['Mostly clear', 'Responsibilities are visible for most active work.', 2],
      ['Explicit and shared', 'Every active item has a visible owner, next action and supporting contributors.', 3],
    ],
  },
  {
    category: 'ownership',
    question: 'If a key staff member was away unexpectedly, how easily could another person continue their grant work?',
    helper: 'Consider access to context, decisions, documents, contacts and next actions.',
    options: [
      ['With difficulty', 'Critical context is held in personal files, inboxes or memory.', 0],
      ['With a handover', 'Someone could continue after time-consuming searching or briefing.', 1],
      ['Reasonably easily', 'Most material is accessible, though some context may be missing.', 2],
      ['Easily', 'The grant record, evidence and next actions provide enough context to continue.', 3],
    ],
  },
  {
    category: 'ownership',
    question: 'How consistently are tasks and follow-ups tracked across departments or contributors?',
    helper: 'Include finance, procurement, delivery teams and people providing acquittal evidence.',
    options: [
      ['Inconsistently', 'Follow-up is mainly by email, meetings or individual reminders.', 0],
      ['For major work only', 'We track significant items but not all dependencies.', 1],
      ['Mostly consistent', 'Most teams can see tasks, although some work still happens offline.', 2],
      ['Consistently shared', 'Tasks, ownership, due dates and completion evidence are visible to the right people.', 3],
    ],
  },
]

const categories = {
  visibility: {
    title: 'Portfolio visibility',
    description: 'Deadlines, forward view and leadership reporting.',
    action: {
      title: 'Create one live portfolio view',
      detail: 'Bring opportunities, reports and acquittal dates into one shared, action-led view. Review the next 90 days with the relevant owners.',
    },
  },
  acquittal: {
    title: 'Acquittal readiness',
    description: 'Requirements, evidence and reporting control.',
    action: {
      title: 'Standardise your acquittal checklist',
      detail: 'Start with the three highest-risk funded grants: confirm requirements, assign ownership and bring the missing evidence into view.',
    },
  },
  ownership: {
    title: 'Ownership and continuity',
    description: 'Accountable officers, handovers and shared tasks.',
    action: {
      title: 'Make next actions and owners visible',
      detail: 'For each active grant, record one accountable owner, the next action, contributors and what completion evidence is required.',
    },
  },
}

const roles = [
  'Grants or programme manager',
  'Finance or governance leader',
  'Executive or director',
  'Project or delivery team member',
  'Other',
]

const initialForm = {
  firstName: '',
  email: '',
  organisation: '',
  role: '',
  consent: false,
  website: '',
}

const calculateResult = (answers) => {
  const totals = Object.fromEntries(Object.keys(categories).map((key) => [key, 0]))
  const maxima = Object.fromEntries(Object.keys(categories).map((key) => [key, 0]))

  questions.forEach((question, index) => {
    totals[question.category] += answers[index]?.score || 0
    maxima[question.category] += 3
  })

  const total = Object.values(totals).reduce((sum, value) => sum + value, 0)
  const maximum = Object.values(maxima).reduce((sum, value) => sum + value, 0)
  const score = Math.round((total / maximum) * 100)
  const breakdown = Object.entries(totals)
    .map(([key, value]) => ({
      key,
      ...categories[key],
      score: Math.round((value / maxima[key]) * 100),
    }))
    .sort((left, right) => left.score - right.score)

  if (score < 50) {
    return {
      score,
      label: 'High coordination risk',
      risk: 'Higher operational risk',
      note: 'Your snapshot suggests that deadlines, requirements or handover context may be harder to see than they need to be. Start with one shared, manageable view of the work closest to due.',
      tone: 'risk',
      categories: breakdown,
    }
  }

  if (score < 75) {
    return {
      score,
      label: 'Developing control',
      risk: 'Moderate operational risk',
      note: 'Useful foundations are in place. Strengthening the lowest-scoring area can make portfolio visibility, acquittal readiness and shared ownership more consistent.',
      tone: 'developing',
      categories: breakdown,
    }
  }

  return {
    score,
    label: 'Strong foundations',
    risk: 'Lower operational risk',
    note: 'Your team has useful operating foundations. Keep the rhythm visible and use the priority actions below to strengthen resilience and reporting readiness.',
    tone: 'strong',
    categories: breakdown,
  }
}

const buildPayload = (form, result, captchaToken) => ({
  firstName: form.firstName.trim(),
  email: form.email.trim(),
  organisation: form.organisation.trim(),
  role: form.role,
  marketingConsent: form.consent,
  website: form.website,
  captchaToken,
  sourceUrl: window.location.href,
  assessment: {
    score: result.score,
    label: result.label,
    categories: result.categories.map((category) => ({ key: category.key, score: category.score })),
  },
})

export default function PortfolioReadinessPage() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [selectionError, setSelectionError] = useState('')
  const [result, setResult] = useState(null)
  const [form, setForm] = useState(initialForm)
  const [formConfig, setFormConfig] = useState({ loading: true, siteKey: '', message: '' })
  const [captchaToken, setCaptchaToken] = useState('')
  const [captchaError, setCaptchaError] = useState('')
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const currentQuestion = questions[step]
  const progress = ((step + 1) / questions.length) * 100
  const assessmentUrl = useMemo(() => `${window.location.origin}/grant-portfolio-readiness`, [])

  useEffect(() => {
    let mounted = true

    api.get('public/portfolio-readiness/config')
      .then((response) => {
        if (!mounted) return
        const siteKey = response.data?.data?.turnstileSiteKey || ''
        const message = response.data?.data?.message || ''
        setFormConfig({ loading: false, siteKey, message })
      })
      .catch(() => {
        if (mounted) setFormConfig({
          loading: false,
          siteKey: '',
          message: 'Action-plan email delivery is temporarily unavailable. You can still use the on-screen priorities below.',
        })
      })

    return () => { mounted = false }
  }, [])

  const selectAnswer = (option) => {
    setAnswers((current) => ({ ...current, [step]: { title: option[0], score: option[2] } }))
    setSelectionError('')
  }

  const moveForward = () => {
    if (!answers[step]) {
      setSelectionError('Select the option that best reflects your current operating reality.')
      return
    }

    if (step === questions.length - 1) {
      setResult(calculateResult(answers))
      window.setTimeout(() => document.getElementById('snapshot-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0)
      return
    }

    setStep((current) => current + 1)
  }

  const restart = () => {
    setStep(0)
    setAnswers({})
    setSelectionError('')
    setResult(null)
    setForm(initialForm)
    setCaptchaToken('')
    setCaptchaError('')
    setFormError('')
    setEmailSent(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const updateForm = (event) => {
    const { name, value, checked, type } = event.target
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleLeadSubmit = async (event) => {
    event.preventDefault()
    setFormError('')

    if (!form.consent) {
      setFormError('Please confirm consent before requesting your action plan.')
      return
    }
    if (!captchaToken) {
      setCaptchaError('Please complete the security check before requesting your action plan.')
      return
    }

    setSubmitting(true)
    try {
      await api.post('public/portfolio-readiness', buildPayload(form, result, captchaToken))
      setEmailSent(true)
      setCaptchaToken('')
    } catch (error) {
      setFormError(error.response?.data?.message || 'Your action plan could not be emailed right now. Please try again shortly.')
    } finally {
      setSubmitting(false)
    }
  }

  const copyShareCaption = async () => {
    const caption = `Grant teams: how visible are your deadlines, acquittals and grant ownership? Take GrantMaestro’s free three-minute Grant Portfolio Risk & Readiness Snapshot for practical next steps.\n\n${assessmentUrl}`
    try {
      await navigator.clipboard.writeText(caption)
      const button = document.getElementById('copy-share-caption')
      if (button) {
        button.textContent = 'Caption copied'
        window.setTimeout(() => { button.textContent = 'Copy LinkedIn caption' }, 1800)
      }
    } catch {
      window.prompt('Copy this LinkedIn caption:', caption)
    }
  }

  return (
    <div className='full-container portfolio-readiness-page'>
      <Helmet>
        <title>Grant Portfolio Risk & Readiness Snapshot | GrantMaestro</title>
        <meta name='description' content='Take GrantMaestro’s free three-minute Grant Portfolio Risk & Readiness Snapshot for a practical view of deadline visibility, acquittal readiness and shared grant ownership.' />
        <meta name='keywords' content='council grant portfolio readiness, grant acquittal checklist, grant management diagnostic, local government grant management' />
        <link rel='canonical' href='https://www.grantmaestro.com/grant-portfolio-readiness' />
        <meta property='og:title' content='Grant Portfolio Risk & Readiness Snapshot | GrantMaestro' />
        <meta property='og:description' content='A practical three-minute diagnostic for council and public-purpose grant teams.' />
        <meta property='og:url' content='https://www.grantmaestro.com/grant-portfolio-readiness' />
      </Helmet>
      <Header />
      <main>
        <section className='readiness-hero' aria-labelledby='readiness-heading'>
          <div className='readiness-shell readiness-hero__grid'>
            <div className='readiness-hero__copy'>
              <p className='readiness-eyebrow'>Council grant management diagnostic</p>
              <h1 id='readiness-heading'>How ready is your grant portfolio?</h1>
              <p className='readiness-hero__intro'>Take a practical three-minute snapshot of deadline visibility, acquittal readiness, accountable ownership and evidence control across your grant portfolio.</p>
              <div className='readiness-chips' aria-label='Assessment details'>
                <span>3 minutes</span>
                <span>9 practical questions</span>
                <span>Instant priorities</span>
              </div>
            </div>
            <aside className='readiness-hero__panel' aria-label='Assessment focus areas'>
              <p>You will assess</p>
              <ol>
                <li><span>01</span> Deadline and opportunity visibility</li>
                <li><span>02</span> Acquittal and evidence readiness</li>
                <li><span>03</span> Ownership and portfolio reporting</li>
              </ol>
              <div>No grant, funder or financial details are requested.</div>
            </aside>
          </div>
        </section>

        {!result ? (
          <section className='readiness-assessment' aria-labelledby='assessment-title'>
            <div className='readiness-shell readiness-assessment__shell'>
              <div className='readiness-progress-label'>Step {step + 1} of {questions.length}</div>
              <h2 id='assessment-title'>A clearer view of grant operations starts here.</h2>
              <div className='readiness-progress' aria-hidden='true'><span style={{ width: `${progress}%` }} /></div>
              <form className='readiness-question-card' onSubmit={(event) => { event.preventDefault(); moveForward() }}>
                <fieldset>
                  <legend>{currentQuestion.question}</legend>
                  <p className='readiness-question-help'>{currentQuestion.helper}</p>
                  <div className='readiness-options'>
                    {currentQuestion.options.map((option) => (
                      <label className={`readiness-option ${answers[step]?.score === option[2] ? 'is-selected' : ''}`} key={option[0]}>
                        <input
                          type='radio'
                          name={`question-${step}`}
                          checked={answers[step]?.score === option[2]}
                          onChange={() => selectAnswer(option)}
                        />
                        <span className='readiness-option__copy'><strong>{option[0]}</strong><small>{option[1]}</small></span>
                      </label>
                    ))}
                  </div>
                </fieldset>
                {selectionError && <p className='readiness-error' role='alert'>{selectionError}</p>}
                <div className='readiness-question-actions'>
                  <button type='button' className='readiness-back' onClick={() => setStep((current) => Math.max(current - 1, 0))} disabled={step === 0}>Back</button>
                  <button type='submit' className='readiness-primary'>{step === questions.length - 1 ? 'See my snapshot' : 'Continue'}</button>
                </div>
              </form>
            </div>
          </section>
        ) : (
          <section className='readiness-results' id='snapshot-results' aria-labelledby='results-title'>
            <div className='readiness-shell'>
              <div className='readiness-results__intro'>
                <div className='readiness-results__score' data-tone={result.tone} style={{ '--score-progress': `${result.score * 3.6}deg` }}>
                  <div><strong>{result.score}</strong><span>/100</span></div>
                </div>
                <div>
                  <p className='readiness-eyebrow readiness-eyebrow--ink'>Your portfolio snapshot</p>
                  <h2 id='results-title'>{result.label}</h2>
                  <p>{result.note}</p>
                  <span className={`readiness-risk readiness-risk--${result.tone}`}>{result.risk}</span>
                </div>
              </div>

              <div className='readiness-priorities'>
                <div className='readiness-section-heading'>
                  <p className='readiness-eyebrow readiness-eyebrow--ink'>Three practical priorities</p>
                  <h3>Start with the work that will make the clearest difference.</h3>
                </div>
                <ol>
                  {result.categories.map((category, index) => (
                    <li key={category.key}>
                      <span className='readiness-priority__number'>0{index + 1}</span>
                      <div><h4>{category.action.title}</h4><p>{category.action.detail}</p></div>
                    </li>
                  ))}
                </ol>
              </div>

              <div className='readiness-breakdown'>
                {result.categories.map((category) => (
                  <article key={category.key}>
                    <div><h4>{category.title}</h4><span>{category.score}/100</span></div>
                    <div className='readiness-meter'><span style={{ width: `${category.score}%` }} /></div>
                    <p>{category.description}</p>
                  </article>
                ))}
              </div>

              <section className='readiness-email-card' aria-labelledby='email-plan-title'>
                {emailSent ? (
                  <div className='readiness-confirmation' role='status'>
                    <span aria-hidden='true'>✓</span>
                    <div><h3 id='email-plan-title'>Your action plan is on its way.</h3><p>Check the inbox you provided. Use the priorities above as a practical prompt for your next internal discussion.</p></div>
                  </div>
                ) : (
                  <>
                    <div className='readiness-email-card__heading'>
                      <p className='readiness-eyebrow readiness-eyebrow--ink'>Keep the priorities moving</p>
                      <h3 id='email-plan-title'>Email my action plan</h3>
                      <p>Receive a copy of these priorities to use in your next grants, finance or leadership discussion.</p>
                    </div>
                    <form onSubmit={handleLeadSubmit} noValidate>
                      <div className='readiness-email-grid'>
                        <label>First name <span aria-hidden='true'>*</span><input name='firstName' value={form.firstName} onChange={updateForm} autoComplete='given-name' maxLength='120' required /></label>
                        <label>Work email <span aria-hidden='true'>*</span><input name='email' type='email' value={form.email} onChange={updateForm} autoComplete='email' maxLength='254' required /></label>
                        <label>Organisation <span aria-hidden='true'>*</span><input name='organisation' value={form.organisation} onChange={updateForm} autoComplete='organization' maxLength='160' required /></label>
                        <label>Role <span aria-hidden='true'>*</span><select name='role' value={form.role} onChange={updateForm} required><option value=''>Select your role</option>{roles.map((role) => <option value={role} key={role}>{role}</option>)}</select></label>
                      </div>
                      <div className='readiness-honeypot' aria-hidden='true'><label>Website<input name='website' value={form.website} onChange={updateForm} tabIndex='-1' autoComplete='off' /></label></div>
                      <label className='readiness-consent'><input type='checkbox' name='consent' checked={form.consent} onChange={updateForm} required /><span>I consent to GrantMaestro using my information to send this action plan and occasional relevant follow-up. I can unsubscribe at any time.</span></label>
                      <div className='readiness-verification'>
                        {formConfig.loading && <p>Loading security check…</p>}
                        {formConfig.message && <p className='readiness-form-note'>{formConfig.message}</p>}
                        {formConfig.siteKey && <TurnstileWidget siteKey={formConfig.siteKey} onVerify={(token) => { setCaptchaToken(token); setCaptchaError('') }} onExpire={() => { setCaptchaToken(''); setCaptchaError('The security check expired. Please complete it again.') }} onError={() => { setCaptchaToken(''); setCaptchaError('The security check could not be completed. Please refresh and try again.') }} />}
                        {captchaError && <p className='readiness-error' role='alert'>{captchaError}</p>}
                      </div>
                      {formError && <p className='readiness-error' role='alert'>{formError}</p>}
                      <button type='submit' className='readiness-primary' disabled={submitting || formConfig.loading || !formConfig.siteKey}>{submitting ? 'Emailing your action plan…' : 'Email my action plan'}</button>
                    </form>
                  </>
                )}
              </section>

              <div className='readiness-share' aria-label='Share this assessment'>
                <div><h3>Start a useful grant portfolio conversation.</h3><p>Share the snapshot with colleagues or other grant teams who may find a practical first step useful.</p></div>
                <div className='readiness-share__actions'><button type='button' id='copy-share-caption' onClick={copyShareCaption}>Copy LinkedIn caption</button><a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(assessmentUrl)}`} target='_blank' rel='noreferrer'>Share on LinkedIn</a></div>
              </div>

              <div className='readiness-next-step'>
                <div><p className='readiness-eyebrow'>When you are ready</p><h3>Bring the work into one shared grant workspace.</h3><p>GrantMaestro helps teams make deadlines, next actions, evidence and acquittal work visible to the right people.</p></div>
                <div><a className='readiness-primary readiness-primary--light' href='/register'>Start your free 14-day trial</a><a className='readiness-text-link' href='/contact?topic=demo'>Request a walkthrough</a></div>
              </div>
              <button type='button' className='readiness-restart' onClick={restart}>Restart the snapshot</button>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  )
}
