import React, { useEffect, useRef, useState } from 'react'
import api from 'api'
import './AIDraftPanel.css'

const COPY = {
  task: { button: 'Draft task description with AI', title: 'Draft a task description', fieldLabel: 'Additional context for the draft', placeholder: 'Optional: include the expected outcome, specific evidence or internal context.', endpoint: 'ai/task-description', resultKey: 'description', action: 'Insert into task description' },
  note: { button: 'Draft internal note with AI', title: 'Draft an internal grant note', fieldLabel: 'Additional context for the draft', placeholder: 'Optional: capture facts, decisions, risks or evidence that should be reflected.', endpoint: 'ai/draft-note', resultKey: 'note', action: 'Insert into note' },
}

export default function AIDraftPanel({ type, payload, disabled, onInsert }) {
  const copy = COPY[type]
  const [open, setOpen] = useState(false)
  const [context, setContext] = useState('')
  const [draft, setDraft] = useState('')
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const closeButtonRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    closeButtonRef.current?.focus()
    const onKeyDown = (event) => { if (event.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  const start = () => { setOpen(true); setDraft(''); setError(''); setStatus('idle') }
  const generate = async () => {
    setStatus('loading'); setError(''); setDraft('')
    try {
      const response = await api.post(copy.endpoint, { ...payload, context: type === 'note' ? context : undefined })
      if (!response.data?.success || !response.data?.data?.[copy.resultKey]) throw new Error(response.data?.message || 'No draft was returned.')
      setDraft(response.data.data[copy.resultKey]); setStatus('ready')
    } catch (requestError) {
      const serverMessage = requestError?.response?.data?.message || requestError.message || ''
      const serviceUnavailable = requestError?.response?.status >= 500 || /not configured|api.?key/i.test(serverMessage)
      setStatus('error')
      setError(serviceUnavailable ? 'AI drafting is not available at the moment. You can continue by writing the record manually or contact your system administrator.' : (serverMessage || 'The draft could not be generated. Please try again.'))
    }
  }
  const insert = () => { onInsert(draft); setOpen(false) }

  return <>
    <button type='button' className='gm-ai-draft-trigger' onClick={start} disabled={disabled} title={disabled ? 'Select a grant before drafting with AI.' : copy.button}><i className='fa fa-magic' aria-hidden='true' /> {copy.button}</button>
    {open && <div className='gm-ai-draft-backdrop' role='presentation'><section className='gm-ai-draft-dialog' role='dialog' aria-modal='true' aria-labelledby='ai-draft-title'><header><div><p>AI-assisted drafting</p><h2 id='ai-draft-title'>{copy.title}</h2></div><button ref={closeButtonRef} type='button' aria-label='Close AI drafting' className='gm-ai-draft-close' onClick={() => setOpen(false)}>×</button></header><p className='gm-ai-draft-notice'>This is a working draft, not advice or a final record. Review it for accuracy, remove sensitive information and apply your organisation’s approval process before saving.</p><label htmlFor={`ai-context-${type}`}>{copy.fieldLabel}<textarea id={`ai-context-${type}`} value={context} onChange={(event) => setContext(event.target.value)} placeholder={copy.placeholder} rows='3' disabled={status === 'loading'} /></label><div className='gm-ai-draft-actions'><button type='button' className='btn btn-outline-secondary' onClick={() => setOpen(false)} disabled={status === 'loading'}>Cancel</button><button type='button' className='btn btn-primary' onClick={generate} disabled={status === 'loading'}>{status === 'loading' ? 'Drafting…' : 'Generate draft'}</button></div>{status === 'error' && <div role='alert' aria-live='assertive' className='gm-ai-draft-error'>{error}</div>}{status === 'ready' && <section className='gm-ai-draft-result' aria-live='polite'><div><p>Generated draft</p><h3>Review before inserting</h3></div><textarea value={draft} onChange={(event) => setDraft(event.target.value)} rows='8' aria-label='Generated draft' /><div><button type='button' className='btn btn-outline-secondary' onClick={generate}>Regenerate</button><button type='button' className='btn btn-primary' onClick={insert}>{copy.action}</button></div></section>}</section></div>}
  </>
}
