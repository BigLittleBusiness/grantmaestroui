import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik'
import * as yup from 'yup'
import toast from 'react-hot-toast'
import { saveGrantNote } from './grantSlice'
import AIDraftPanel from 'components/AIDraftPanel'
import './grant-note.css'

const NOTE_TYPES = [
  { value: 1, label: 'Opportunity / finding', aiType: 'finding' },
  { value: 2, label: 'Suitability assessment', aiType: 'suitability' },
  { value: 3, label: 'Submission preparation', aiType: 'submission' },
  { value: 4, label: 'Outcome / decision', aiType: 'outcome' },
  { value: 6, label: 'Financial / acquittal', aiType: 'financial' },
]
const formatDate = (value) => value ? new Date(value).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recorded just now'

export default function GrantNote() {
  const [showForm, setShowForm] = useState(false)
  const dispatch = useDispatch()
  const grant = useSelector((state) => state.grant.grant || {})
  const notes = grant.notes || []
  const grantId = grant.organization_grant_id || grant.id
  const formik = useFormik({
    initialValues: { note: '', note_type: 2 },
    validationSchema: yup.object({ note: yup.string().trim().required('Add a factual internal note before saving.'), note_type: yup.number().required() }),
    onSubmit: async (values, helpers) => {
      if (!grantId) { toast.error('Open a grant record before adding a note.'); return }
      try {
        await dispatch(saveGrantNote({ grant_id: grantId, note_type: Number(values.note_type), note: values.note.trim() })).unwrap()
        helpers.resetForm(); setShowForm(false)
      } catch (error) { toast.error(error?.message || 'The note could not be saved. Please try again.') }
    },
  })
  const selectedType = NOTE_TYPES.find((item) => Number(item.value) === Number(formik.values.note_type)) || NOTE_TYPES[1]

  return <section className='gm-grant-notes'>
    <header><div><p>Internal record</p><h2>Grant notes</h2><span>Capture decisions, evidence and context that colleagues can rely on later.</span></div><button type='button' className='btn btn-primary' onClick={() => setShowForm((value) => !value)} disabled={!grantId}>{showForm ? 'Close note editor' : 'Add internal note'}</button></header>
    {showForm && <form onSubmit={formik.handleSubmit} className='gm-grant-notes__editor' noValidate><label htmlFor='grant-note-type'>Note purpose<select id='grant-note-type' name='note_type' value={formik.values.note_type} onChange={formik.handleChange}>{NOTE_TYPES.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}</select></label><label htmlFor='grant-note-text'>Internal note<textarea id='grant-note-text' name='note' rows='5' value={formik.values.note} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder='Record the decision, relevant facts, source or next step. Avoid sensitive personal information unless authorised.' aria-describedby='grant-note-error' /></label><AIDraftPanel type='note' disabled={!grant?.grant_title} payload={{ grant_title: grant?.grant_title, fund_originator: grant?.fund_originator, note_type: selectedType.aiType }} onInsert={(note) => formik.setFieldValue('note', note)} />{formik.touched.note && formik.errors.note && <div id='grant-note-error' role='alert' className='gm-grant-notes__error'>{formik.errors.note}</div>}<div className='gm-grant-notes__editor-actions'><button type='button' className='btn btn-outline-secondary' onClick={() => setShowForm(false)}>Cancel</button><button type='submit' className='btn btn-primary' disabled={formik.isSubmitting}>{formik.isSubmitting ? 'Saving…' : 'Save internal note'}</button></div></form>}
    <div className='gm-grant-notes__history'>{notes.length ? notes.map((note) => { const type = NOTE_TYPES.find((item) => Number(item.value) === Number(note.note_type)); return <article key={note.note_id || `${note.note}-${note.created_at}`}><header><span>{type?.label || 'Internal note'}</span><time dateTime={note.created_at}>{formatDate(note.created_at)}</time></header><p>{note.note}</p></article> }) : <div className='gm-grant-notes__empty'><strong>No internal notes yet</strong><span>Use notes to retain decisions, evidence locations and handover context as the grant progresses.</span></div>}</div>
  </section>
}
