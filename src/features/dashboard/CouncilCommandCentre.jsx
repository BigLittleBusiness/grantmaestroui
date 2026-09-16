import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchGrants } from 'features/grant/grantSlice'
import { fetchTasks } from 'features/tasks/tasksSlice'
import { fetchTeamMembers } from 'features/teamMember/teamMemberSlice'
import './council-command-centre.css'

const DAY = 24 * 60 * 60 * 1000

const normaliseDate = (value) => {
  if (!value) return null
  const date = new Date(`${String(value).slice(0, 10)}T12:00:00`)
  return Number.isNaN(date.getTime()) ? null : date
}

const daysUntil = (value) => {
  const date = normaliseDate(value)
  if (!date) return null
  const today = new Date()
  today.setHours(12, 0, 0, 0)
  return Math.round((date.getTime() - today.getTime()) / DAY)
}

const formatDate = (value) => {
  const date = normaliseDate(value)
  if (!date) return 'No date set'
  return date.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })
}

const formatMoney = (value) =>
  new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0)

const relativeDue = (days) => {
  if (days === null) return 'No due date'
  if (days < 0) return `${Math.abs(days)} day${Math.abs(days) === 1 ? '' : 's'} overdue`
  if (days === 0) return 'Due today'
  if (days === 1) return 'Due tomorrow'
  return `Due in ${days} days`
}

const lifecycleStage = (grant) => {
  const outcome = String(grant.outcome || '').toLowerCase()
  if (outcome === 'won' && grant.acquittal_date) return 'Acquittal'
  if (outcome) return 'Outcome'
  if (grant.is_grant_submitted || grant.submissionDate || grant.grant_submission_date) return 'Submitted'
  if (grant.is_suitable || grant.determination || grant.decisionDate || grant.decision_date) return 'Suitability'
  return 'Opportunity'
}

const stageOrder = ['Opportunity', 'Suitability', 'Submitted', 'Outcome', 'Acquittal']

const nextGrantAction = (grant, tasks) => {
  const outstanding = tasks
    .filter((task) => Number(task.grant_id) === Number(grant.organization_grant_id || grant.id))
    .filter((task) => String(task.status || task.task_status || '').toLowerCase() !== 'completed')
    .sort((a, b) => (daysUntil(a.targeted_completion_date) ?? 9999) - (daysUntil(b.targeted_completion_date) ?? 9999))

  if (outstanding[0]) return outstanding[0].description || outstanding[0].task_description
  const stage = lifecycleStage(grant)
  if (stage === 'Opportunity') return 'Complete suitability assessment'
  if (stage === 'Suitability') return 'Confirm application decision'
  if (stage === 'Submitted') return 'Record funder outcome'
  if (stage === 'Outcome') return 'Confirm delivery and reporting obligations'
  return 'Prepare acquittal evidence'
}

const healthForGrant = (grant, tasks) => {
  const grantId = grant.organization_grant_id || grant.id
  const openTaskDays = tasks
    .filter((task) => Number(task.grant_id) === Number(grantId))
    .filter((task) => String(task.status || task.task_status || '').toLowerCase() !== 'completed')
    .map((task) => daysUntil(task.targeted_completion_date))
    .filter((days) => days !== null)

  const deadlineDays = lifecycleStage(grant) === 'Acquittal'
    ? daysUntil(grant.acquittal_date)
    : daysUntil(grant.closingDate || grant.closing_date)

  if (openTaskDays.some((days) => days < 0) || deadlineDays < 0) return { label: 'At risk', tone: 'risk' }
  if (openTaskDays.some((days) => days <= 7) || (deadlineDays !== null && deadlineDays <= 14)) {
    return { label: 'Needs attention', tone: 'attention' }
  }
  if (!grant.grant_submitted_by && !grant.submitted_by && !grant.submission_department_representative) {
    return { label: 'Owner required', tone: 'neutral' }
  }
  return { label: 'On track', tone: 'good' }
}

const Metric = ({ label, value, helper, tone = 'blue' }) => (
  <article className={`gm-metric gm-metric--${tone}`}>
    <p className='gm-metric__label'>{label}</p>
    <p className='gm-metric__value'>{value}</p>
    <p className='gm-metric__helper'>{helper}</p>
  </article>
)

const EmptyState = ({ title, body, actionLabel, onAction }) => (
  <div className='gm-command-empty'>
    <div className='gm-command-empty__icon' aria-hidden='true'>✓</div>
    <h3>{title}</h3>
    <p>{body}</p>
    {actionLabel && <button type='button' className='btn btn-primary' onClick={onAction}>{actionLabel}</button>}
  </div>
)

export default function CouncilCommandCentre() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const grants = useSelector((state) => state.grant?.grants ?? [])
  const tasks = useSelector((state) => state.tasks?.tasks ?? [])
  const user = useSelector((state) => state.auth?.user)
  const teamMembers = useSelector((state) => state.teamMember?.teamMembers ?? [])
  const isOrganisationAdmin = Number(user?.user_type) === 1
  const [focus, setFocus] = useState(() => {
    const saved = window.localStorage.getItem('gm_dashboard_focus')
    return saved || (Number(user?.user_type) === 1 ? 'team' : 'mine')
  })

  useEffect(() => {
    dispatch(fetchGrants({}))
    dispatch(fetchTasks())
    if (Number(user?.user_type) === 1) dispatch(fetchTeamMembers())
  }, [dispatch, user?.user_type])

  useEffect(() => {
    window.localStorage.setItem('gm_dashboard_focus', focus)
  }, [focus])

  const view = useMemo(() => {
    const activeTasks = tasks.filter((task) => String(task.status || task.task_status || '').toLowerCase() !== 'completed')
    const myId = Number(user?.user_id || user?.id)
    const myTasks = myId ? activeTasks.filter((task) => Number(task.task_assigned_to_id || task.task_assigned_to) === myId) : activeTasks
    const actionTasks = focus === 'mine' ? myTasks : activeTasks

    const enrichedGrants = grants.map((grant) => ({
      ...grant,
      stage: lifecycleStage(grant),
      health: healthForGrant(grant, activeTasks),
      nextAction: nextGrantAction(grant, activeTasks),
      deadline: lifecycleStage(grant) === 'Acquittal' ? grant.acquittal_date : (grant.closingDate || grant.closing_date),
    }))

    const allDeadlines = enrichedGrants
      .map((grant) => ({ ...grant, days: daysUntil(grant.deadline) }))
      .filter((grant) => grant.days !== null)

    const overdueTasks = actionTasks.filter((task) => (daysUntil(task.targeted_completion_date) ?? 0) < 0)
    const dueSoonTasks = actionTasks.filter((task) => {
      const days = daysUntil(task.targeted_completion_date)
      return days !== null && days >= 0 && days <= 7
    })
    const atRiskGrants = enrichedGrants.filter((grant) => grant.health.tone === 'risk' || grant.health.tone === 'attention')
    const dueSoonGrants = allDeadlines.filter((grant) => grant.days >= 0 && grant.days <= 30)
    const unownedGrants = enrichedGrants.filter((grant) => grant.health.label === 'Owner required')
    const applied = enrichedGrants.filter((grant) => ['Submitted', 'Outcome', 'Acquittal'].includes(grant.stage))
    const secured = enrichedGrants.filter((grant) => String(grant.outcome || '').toLowerCase() === 'won')
    const pipelineValue = enrichedGrants
      .filter((grant) => ['Opportunity', 'Suitability', 'Submitted'].includes(grant.stage))
      .reduce((sum, grant) => sum + Number(grant.funding_sought_amount || grant.max_fund_amount || 0), 0)
    const securedValue = secured.reduce((sum, grant) => sum + Number(grant.won_fund_amount || grant.allocatedFunds || grant.funding_sought_amount || 0), 0)

    const actions = [
      ...overdueTasks.map((task) => ({ type: 'task', priority: 1, title: task.description || task.task_description, grant: task.grant, due: task.targeted_completion_date, days: daysUntil(task.targeted_completion_date), task })),
      ...dueSoonTasks.map((task) => ({ type: 'task', priority: 2, title: task.description || task.task_description, grant: task.grant, due: task.targeted_completion_date, days: daysUntil(task.targeted_completion_date), task })),
      ...atRiskGrants.map((grant) => ({ type: 'grant', priority: grant.health.tone === 'risk' ? 1 : 2, title: grant.nextAction, grant: grant.grant_title, due: grant.deadline, days: daysUntil(grant.deadline), record: grant })),
      ...unownedGrants.map((grant) => ({ type: 'grant', priority: 3, title: 'Assign accountable officer', grant: grant.grant_title, due: grant.deadline, days: daysUntil(grant.deadline), record: grant })),
    ]
      .filter((action, index, list) => list.findIndex((item) => `${item.type}-${item.title}-${item.grant}` === `${action.type}-${action.title}-${action.grant}`) === index)
      .sort((a, b) => a.priority - b.priority || (a.days ?? 9999) - (b.days ?? 9999))

    const stageSummary = stageOrder.map((stage) => {
      const records = enrichedGrants.filter((grant) => grant.stage === stage)
      return {
        stage,
        count: records.length,
        value: records.reduce((sum, grant) => sum + Number(grant.funding_sought_amount || grant.won_fund_amount || grant.max_fund_amount || 0), 0),
      }
    })

    return {
      actionTasks,
      overdueTasks,
      dueSoonTasks,
      atRiskGrants,
      dueSoonGrants,
      applied,
      secured,
      pipelineValue,
      securedValue,
      actions,
      stageSummary,
      enrichedGrants,
    }
  }, [focus, grants, tasks, user])

  const onboardingSteps = [
    { key: 'grant', complete: grants.length > 0, title: 'Add your first live or target grant', body: 'Create the record, confirm the deadline and capture the funding opportunity.', action: 'Add grant', path: '/grant/create' },
    { key: 'team', complete: teamMembers.length > 0, title: 'Invite the people who will contribute', body: 'Give grants, finance and project staff a defined role in the shared workflow.', action: 'Invite team', path: '/add-team-member' },
    { key: 'work', complete: tasks.length > 0, title: 'Assign the first next action', body: 'Create a clear owner, due date and checklist so work is visible from day one.', action: 'Assign task', path: '/add-task' },
  ]

  const openAction = (action) => {
    if (action.type === 'task') return navigate(`/view-task/${action.task.id || action.task.task_id}`)
    return navigate(`/grant/details/${action.record.organization_grant_id || action.record.id}`)
  }

  return (
    <main className='gm-command-centre content container-fluid'>
      <header className='gm-command-header'>
        <div>
          <p className='gm-command-header__eyebrow'>Council inward grants</p>
          <h1>Grant portfolio command centre</h1>
          <p>Prioritise the work that protects funding, compliance and community outcomes.</p>
        </div>
        <div className='gm-command-header__actions'>
          <button type='button' className='btn btn-outline-primary' onClick={() => navigate('/grant')}>View portfolio</button>
          <button type='button' className='btn btn-primary' onClick={() => navigate('/grant/create')}>Add grant</button>
        </div>
      </header>

      {isOrganisationAdmin && onboardingSteps.some((step) => !step.complete) && <section className='gm-onboarding-card' aria-labelledby='onboarding-title'><header><div><p>Recommended first week</p><h2 id='onboarding-title'>Set up your grant operating rhythm</h2><span>Complete these three practical steps to make GrantMaestro useful for your team immediately.</span></div><strong>{onboardingSteps.filter((step) => step.complete).length} of {onboardingSteps.length} complete</strong></header><ol>{onboardingSteps.map((step, index) => <li key={step.key} className={step.complete ? 'is-complete' : ''}><span className='gm-onboarding-card__number' aria-hidden='true'>{step.complete ? '✓' : index + 1}</span><div><h3>{step.title}</h3><p>{step.body}</p></div>{step.complete ? <span className='gm-onboarding-card__done'>Complete</span> : <button className='btn btn-outline-primary btn-sm' type='button' onClick={() => navigate(step.path)}>{step.action}</button>}</li>)}</ol></section>}

      <section className='gm-focus-switcher' aria-label='Dashboard focus'>
        <span className='gm-focus-switcher__label'>Show:</span>
        <div role='group' aria-label='Select dashboard focus'>
          <button type='button' className={focus === 'mine' ? 'is-active' : ''} aria-pressed={focus === 'mine'} onClick={() => setFocus('mine')}>My work</button>
          <button type='button' className={focus === 'team' ? 'is-active' : ''} aria-pressed={focus === 'team'} onClick={() => setFocus('team')}>Team work</button>
          {Number(user?.user_type) === 1 && <button type='button' className={focus === 'leadership' ? 'is-active' : ''} aria-pressed={focus === 'leadership'} onClick={() => setFocus('leadership')}>Leadership view</button>}
        </div>
      </section>

      <section className='gm-metrics-grid' aria-label='Portfolio summary'>
        <Metric label='Needs attention' value={view.atRiskGrants.length + view.overdueTasks.length} helper={`${view.overdueTasks.length} overdue task${view.overdueTasks.length === 1 ? '' : 's'}`} tone='red' />
        <Metric label='Due in 30 days' value={view.dueSoonGrants.length} helper='Grant and acquittal deadlines' tone='amber' />
        <Metric label='Pipeline value' value={formatMoney(view.pipelineValue)} helper={`${view.applied.length} submitted or decided`} tone='blue' />
        <Metric label='Funding secured' value={formatMoney(view.securedValue)} helper={`${view.secured.length} grant${view.secured.length === 1 ? '' : 's'} won`} tone='green' />
      </section>

      <section className='gm-command-grid'>
        <article className='gm-panel gm-panel--actions'>
          <div className='gm-panel__header'>
            <div>
              <p className='gm-panel__eyebrow'>Action centre</p>
              <h2>{focus === 'mine' ? 'Your next actions' : focus === 'leadership' ? 'Portfolio decisions to unblock' : 'Team actions requiring attention'}</h2>
            </div>
            <button type='button' className='btn btn-link' onClick={() => navigate('/tasks')}>View all tasks</button>
          </div>
          {view.actions.length === 0 ? (
            <EmptyState title='No urgent actions' body='Your current work queue is clear. Add a grant or review the portfolio to keep records current.' actionLabel='Add a grant' onAction={() => navigate('/grant/create')} />
          ) : (
            <div className='gm-action-list'>
              {view.actions.slice(0, 8).map((action, index) => (
                <button className={`gm-action-row gm-action-row--p${action.priority}`} type='button' onClick={() => openAction(action)} key={`${action.type}-${index}-${action.title}`}>
                  <span className='gm-action-row__marker' aria-hidden='true'>{action.priority === 1 ? '!' : action.priority === 2 ? '•' : '→'}</span>
                  <span className='gm-action-row__content'>
                    <strong>{action.title}</strong>
                    <span>{action.grant || 'Portfolio action'}</span>
                  </span>
                  <span className='gm-action-row__due'>{action.due ? `${relativeDue(action.days)} · ${formatDate(action.due)}` : 'Owner required'}</span>
                </button>
              ))}
            </div>
          )}
        </article>

        <article className='gm-panel gm-panel--portfolio'>
          <div className='gm-panel__header'>
            <div>
              <p className='gm-panel__eyebrow'>Portfolio flow</p>
              <h2>Where your grants are now</h2>
            </div>
          </div>
          <div className='gm-stage-list'>
            {view.stageSummary.map((stage) => (
              <button key={stage.stage} type='button' className='gm-stage-row' onClick={() => navigate(`/grant?stage=${encodeURIComponent(stage.stage)}`)}>
                <span className='gm-stage-row__dot' aria-hidden='true' />
                <span className='gm-stage-row__name'>{stage.stage}</span>
                <span className='gm-stage-row__count'>{stage.count}</span>
                <span className='gm-stage-row__value'>{formatMoney(stage.value)}</span>
              </button>
            ))}
          </div>
          <div className='gm-panel__footer'>
            <button type='button' className='btn btn-outline-primary btn-sm' onClick={() => navigate('/grant?view=attention')}>Open at-risk grants</button>
            <button type='button' className='btn btn-outline-primary btn-sm' onClick={() => navigate('/acquittals')}>Open acquittals</button>
          </div>
        </article>
      </section>

      <section className='gm-panel gm-deadline-panel'>
        <div className='gm-panel__header'>
          <div>
            <p className='gm-panel__eyebrow'>Planning window</p>
            <h2>Upcoming external deadlines</h2>
          </div>
          <button type='button' className='btn btn-link' onClick={() => navigate('/grant?view=deadlines')}>View portfolio</button>
        </div>
        {view.dueSoonGrants.length === 0 ? (
          <p className='gm-muted-copy'>No grant or acquittal deadlines are recorded within the next 30 days.</p>
        ) : (
          <div className='gm-deadline-list'>
            {view.dueSoonGrants.sort((a, b) => a.days - b.days).slice(0, 6).map((grant) => (
              <button type='button' className='gm-deadline-row' key={grant.organization_grant_id || grant.id} onClick={() => navigate(`/grant/details/${grant.organization_grant_id || grant.id}`)}>
                <span><strong>{grant.grant_title}</strong><small>{grant.stage} · {grant.health.label}</small></span>
                <span className={grant.days <= 7 ? 'gm-due gm-due--near' : 'gm-due'}>{relativeDue(grant.days)}<small>{formatDate(grant.deadline)}</small></span>
              </button>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
