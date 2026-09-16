import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchTask, updateTask } from './tasksSlice'
import { useFormik } from 'formik'
import * as yup from 'yup'
import toast from 'react-hot-toast'
import { fetchTeamMembers } from '../teamMember/teamMemberSlice'
import { fetchGrants } from '../grant/grantSlice'
import './task-work-form.css'
import AIDraftPanel from 'components/AIDraftPanel'

const TASK_TYPES = ['research', 'application', 'evidence', 'finance', 'review', 'approval', 'communication', 'other']
const STAGES = ['opportunity', 'suitability', 'submitted', 'outcome', 'acquittal']
const labelise = (value) => value.replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
const dateInput = (value) => value ? String(value).slice(0, 10) : ''
const validationSchema = yup.object({
  grant_id: yup.number().required('Select the related grant.'),
  task_assigned_to: yup.number().required('Select the person accountable for this work.'),
  task_description: yup.string().trim().max(5000).required('Describe the work to be completed.'),
  task_status: yup.string().required('Select a task status.'),
  task_priority: yup.string().required('Select a priority.'),
  targeted_completion_date: yup.date().required('Select a due date.'),
  estimated_effort_hours: yup.number().min(0, 'Enter zero or more hours.').max(9999, 'Enter a realistic effort estimate.').nullable(),
})
const FieldError = ({ id, error }) => error ? <div id={id} className='invalid-feedback d-block' role='alert'>{error}</div> : null

export default function TaskEdit() {
  const { task_id } = useParams()
  const selectedTask = useSelector((state) => state.tasks.selectedTask)
  const grants = useSelector((state) => state.grant.grants || [])
  const teamMembers = useSelector((state) => state.teamMember.teamMembers || [])
  const isLoading = useSelector((state) => state.tasks.isLoading)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => { if (task_id) dispatch(fetchTask(task_id)) }, [dispatch, task_id])
  useEffect(() => { dispatch(fetchTeamMembers()); dispatch(fetchGrants({})) }, [dispatch])

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      grant_id: selectedTask?.grant_id || '',
      task_description: selectedTask?.task_description || selectedTask?.description || '',
      task_status: selectedTask?.task_status || selectedTask?.status || 'assigned',
      task_priority: selectedTask?.priority || 'medium',
      task_type: selectedTask?.task_type || 'application',
      grant_stage: selectedTask?.grant_stage || '',
      task_assigned_to: selectedTask?.task_assigned_to_id || '',
      targeted_completion_date: dateInput(selectedTask?.targeted_completion_date),
      estimated_effort_hours: selectedTask?.estimated_effort_hours ?? '',
      dependency_note: selectedTask?.dependency_note || '',
      checklist_text: (selectedTask?.checklist_items || []).map((item) => item.text || item.item_text || '').filter(Boolean).join('\n'),
      completion_evidence: selectedTask?.completion_evidence || '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const { checklist_text, estimated_effort_hours, ...rest } = values
        await dispatch(updateTask({
          ...rest,
          task_id,
          estimated_effort_hours: estimated_effort_hours === '' ? null : Number(estimated_effort_hours),
          checklist_items: checklist_text.split('\n').map((line) => line.trim()).filter(Boolean),
        })).unwrap()
        navigate('/tasks')
      } catch (error) {
        toast.error(error?.message || 'The task could not be updated. Please review the details and try again.')
      } finally { setSubmitting(false) }
    },
  })

  const selectedGrant = grants.find((grant) => String(grant.organization_grant_id || grant.id) === String(formik.values.grant_id))
  const selectedAssignee = teamMembers.find((member) => String(member.user_id) === String(formik.values.task_assigned_to))

  if (isLoading && !selectedTask) return <section className='gm-workspace-state' aria-live='polite'><div className='spinner-border text-primary' aria-hidden='true' /><h2>Loading task</h2><p>Preparing the shared work details.</p></section>

  return (
    <main className='gm-task-work-form content container-fluid pb-0 p-0'>
      <header className='gm-task-work-form__header'><div><p>Team work planning</p><h1>Update grant task</h1><span>Keep the action, owner and completion evidence clear for the whole grant team.</span></div></header>
      <form onSubmit={formik.handleSubmit} noValidate>
        <section className='gm-task-work-form__card'>
          <div className='gm-task-work-form__section'><h2>Context and ownership</h2><p>Changes are shared with the task owner and the grant record.</p></div>
          <div className='gm-task-work-form__grid'>
            <label className='gm-task-field gm-task-field--wide' htmlFor='task-grant'><span>Related grant <b aria-hidden='true'>*</b></span><select id='task-grant' name='grant_id' value={formik.values.grant_id} onChange={formik.handleChange} onBlur={formik.handleBlur}><option value=''>Select a grant</option>{grants.map((grant) => <option value={grant.organization_grant_id || grant.id} key={grant.organization_grant_id || grant.id}>{grant.grant_title}</option>)}</select><FieldError id='task-grant-error' error={formik.touched.grant_id && formik.errors.grant_id} /></label>
            <label className='gm-task-field' htmlFor='task-assignee'><span>Accountable person <b aria-hidden='true'>*</b></span><select id='task-assignee' name='task_assigned_to' value={formik.values.task_assigned_to} onChange={formik.handleChange} onBlur={formik.handleBlur}><option value=''>Select a team member</option>{teamMembers.map((member) => <option value={member.user_id} key={member.user_id}>{member.full_name || `${member.first_name || ''} ${member.last_name || ''}`.trim() || member.email}</option>)}</select><FieldError id='task-assignee-error' error={formik.touched.task_assigned_to && formik.errors.task_assigned_to} /></label>
            <label className='gm-task-field' htmlFor='task-stage'><span>Related grant stage</span><select id='task-stage' name='grant_stage' value={formik.values.grant_stage} onChange={formik.handleChange}><option value=''>Not stage-specific</option>{STAGES.map((stage) => <option value={stage} key={stage}>{labelise(stage)}</option>)}</select></label>
          </div>
          <div className='gm-task-work-form__section'><h2>Work to complete</h2><p>Keep the task outcome focused and document the evidence that proves it is complete.</p></div>
          <div className='gm-task-work-form__grid'>
            <div className='gm-task-field gm-task-field--full'><label htmlFor='task-description'><span>Task description <b aria-hidden='true'>*</b></span></label><textarea id='task-description' name='task_description' value={formik.values.task_description} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder='Describe the deliverable and result.' rows='3' /><AIDraftPanel type='task' disabled={!selectedGrant?.grant_title} payload={{ grant_title: selectedGrant?.grant_title, task_type: formik.values.task_type, assignee_role: selectedAssignee?.user_role || 'Grant team member', due_date: formik.values.targeted_completion_date }} onInsert={(description) => formik.setFieldValue('task_description', description)} /><FieldError id='task-description-error' error={formik.touched.task_description && formik.errors.task_description} /></div>
            <label className='gm-task-field' htmlFor='task-type'><span>Work type</span><select id='task-type' name='task_type' value={formik.values.task_type} onChange={formik.handleChange}>{TASK_TYPES.map((type) => <option key={type} value={type}>{labelise(type)}</option>)}</select></label>
            <label className='gm-task-field' htmlFor='task-priority'><span>Priority <b aria-hidden='true'>*</b></span><select id='task-priority' name='task_priority' value={formik.values.task_priority} onChange={formik.handleChange}><option value='high'>High — time critical or material risk</option><option value='medium'>Medium — planned work</option><option value='low'>Low — useful, not urgent</option></select></label>
            <label className='gm-task-field' htmlFor='task-status'><span>Status <b aria-hidden='true'>*</b></span><select id='task-status' name='task_status' value={formik.values.task_status} onChange={formik.handleChange}><option value='assigned'>Assigned</option><option value='pending'>Waiting / pending</option><option value='inprogress'>In progress</option><option value='completed'>Completed</option></select></label>
            <label className='gm-task-field' htmlFor='task-due-date'><span>Due date <b aria-hidden='true'>*</b></span><input id='task-due-date' type='date' name='targeted_completion_date' value={formik.values.targeted_completion_date} onChange={formik.handleChange} onBlur={formik.handleBlur} /><FieldError id='task-date-error' error={formik.touched.targeted_completion_date && formik.errors.targeted_completion_date} /></label>
            <label className='gm-task-field' htmlFor='task-effort'><span>Estimated effort (hours)</span><input id='task-effort' type='number' min='0' step='0.5' name='estimated_effort_hours' value={formik.values.estimated_effort_hours} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder='e.g. 2.5' /></label>
            <label className='gm-task-field gm-task-field--wide' htmlFor='task-dependency'><span>Dependency or blocker</span><input id='task-dependency' type='text' name='dependency_note' value={formik.values.dependency_note} onChange={formik.handleChange} placeholder='e.g. Awaiting a finance approval.' maxLength='5000' /></label>
            <label className='gm-task-field gm-task-field--full' htmlFor='task-checklist'><span>Checklist items</span><textarea id='task-checklist' name='checklist_text' value={formik.values.checklist_text} onChange={formik.handleChange} placeholder={'One item per line\nE.g. Obtain approval email\nAttach approved budget'} rows='4' /><small>Saving this field updates the shared checklist. One concise action per line.</small></label>
            {formik.values.task_status === 'completed' && <label className='gm-task-field gm-task-field--full' htmlFor='task-completion-evidence'><span>Completion evidence</span><textarea id='task-completion-evidence' name='completion_evidence' value={formik.values.completion_evidence} onChange={formik.handleChange} placeholder='Record the completed outcome, link or evidence location.' rows='3' /><small>This supports the grant audit trail and lets the owner verify completion.</small></label>}
          </div>
          <div className='gm-task-work-form__actions'><button type='button' className='btn btn-outline-secondary' onClick={() => navigate('/tasks')}>Cancel</button><button type='submit' className='btn btn-primary' disabled={formik.isSubmitting}>{formik.isSubmitting ? 'Saving…' : 'Save task'}</button></div>
        </section>
      </form>
    </main>
  )
}
