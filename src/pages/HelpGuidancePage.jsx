import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import api from 'api'
import './HelpGuidancePage.css'

const topicIdFromParams = (params) => params.get('topic') || ''

const track = (eventType, topicId, source, feedback) => api.post('help-guidance/events', {
  eventType,
  topicId: topicId || undefined,
  source: source || 'help-library',
  feedback: feedback || undefined,
}).catch(() => {
  // Guidance remains usable if metrics collection is briefly unavailable.
})

const EmptySearch = () => <div className='gm-help-empty'><i className='fa fa-search' aria-hidden='true' /><h2>No matching guidance yet</h2><p>Try a short plain-language question, such as “How do I invite a colleague?” or “Why can’t I edit this report?”</p></div>

export default function HelpGuidancePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialTopicId = topicIdFromParams(searchParams)
  const [guidance, setGuidance] = useState(null)
  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState('')
  const [selectedTopicId, setSelectedTopicId] = useState(initialTopicId)
  const [feedbackByTopic, setFeedbackByTopic] = useState({})
  const answerRef = useRef(null)

  const loadGuidance = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await api.get('help-guidance')
      setGuidance(response.data?.data || null)
    } catch (requestError) {
      setError(requestError?.response?.data?.message || 'Help and Guidance could not be loaded. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadGuidance() }, [])

  useEffect(() => {
    const requestedTopic = topicIdFromParams(searchParams)
    if (requestedTopic) setSelectedTopicId(requestedTopic)
  }, [searchParams])

  useEffect(() => {
    const normalised = query.trim()
    if (normalised.length < 2) {
      setSearchResults(null)
      setSearching(false)
      return undefined
    }
    const timer = window.setTimeout(async () => {
      setSearching(true)
      try {
        const response = await api.get('help-guidance', { params: { q: normalised } })
        setSearchResults(response.data?.data?.items || [])
      } catch (_) {
        setSearchResults([])
      } finally {
        setSearching(false)
      }
    }, 300)
    return () => window.clearTimeout(timer)
  }, [query])

  const availableItems = useMemo(() => guidance?.items || [], [guidance])
  const canSubmitSupportTicket = Number(guidance?.role) !== 2
  const selectedTopic = useMemo(
    () => [...availableItems, ...(searchResults || [])].find((item) => item.id === selectedTopicId) || null,
    [availableItems, searchResults, selectedTopicId]
  )
  const displayedItems = query.trim().length >= 2 ? (searchResults || []) : (guidance?.topItems || [])

  useEffect(() => {
    if (!selectedTopic || !answerRef.current) return
    answerRef.current.focus({ preventScroll: true })
  }, [selectedTopic])

  const selectTopic = (topic, source = 'help-library') => {
    setSelectedTopicId(topic.id)
    setSearchParams((current) => {
      const next = new URLSearchParams(current)
      next.set('topic', topic.id)
      next.set('source', source)
      return next
    })
    track('topic_opened', topic.id, source)
  }

  const submitFeedback = (feedback) => {
    if (!selectedTopic) return
    setFeedbackByTopic((current) => ({ ...current, [selectedTopic.id]: feedback }))
    track('answer_feedback', selectedTopic.id, 'help-library', feedback)
  }

  if (loading) return <section className='gm-help-state' aria-live='polite'><div className='spinner-border text-primary' aria-hidden='true' /><h1>Loading Help &amp; Guidance</h1><p>Preparing guidance for your role.</p></section>
  if (error) return <section className='gm-help-state gm-help-state--error' role='alert'><h1>Help &amp; Guidance is unavailable</h1><p>{error}</p><button className='btn btn-primary' type='button' onClick={loadGuidance}>Try again</button></section>

  return (
    <main className='gm-help content container-fluid'>
      <header className='gm-help__header'>
        <div>
          <p>Self-service support</p>
          <h1>Help &amp; Guidance</h1>
          <span>Practical answers for your {guidance?.roleLabel || 'GrantMaestro'} role.</span>
        </div>
        {canSubmitSupportTicket ? <Link className='btn btn-outline-primary' to='/submit-ticket'><i className='fa fa-life-ring me-2' aria-hidden='true' />Contact support</Link> : <Link className='btn btn-outline-primary' to='/admin/help-guidance-insights'><i className='fa fa-bar-chart me-2' aria-hidden='true' />View guidance insights</Link>}
      </header>

      <section className='gm-help__search' aria-label='Search Help and Guidance'>
        <label htmlFor='help-search'>What do you need help with?</label>
        <div className='gm-help__search-control'>
          <i className='fa fa-search' aria-hidden='true' />
          <input id='help-search' type='search' value={query} onChange={(event) => setQuery(event.target.value)} placeholder='e.g. How do I invite a colleague?' autoComplete='off' />
          {query && <button type='button' onClick={() => { setQuery(''); setSearchParams({}) }} aria-label='Clear help search'>Clear</button>}
        </div>
        <p>Your search is matched to guidance available to your role. Search analytics record only broad help categories, not the words you type.</p>
      </section>

      <div className='gm-help__layout'>
        <section className='gm-help__library' aria-labelledby='help-library-title'>
          <div className='gm-help__section-heading'>
            <div><p>{query.trim().length >= 2 ? 'Search results' : 'Top help for your role'}</p><h2 id='help-library-title'>{query.trim().length >= 2 ? `${displayedItems.length} matching ${displayedItems.length === 1 ? 'answer' : 'answers'}` : 'Your Top 10'}</h2></div>
            {searching && <span className='gm-help__loading'>Searching…</span>}
          </div>
          {displayedItems.length ? <ol className='gm-help__question-list'>{displayedItems.map((item, index) => <li key={item.id}><button type='button' className={selectedTopicId === item.id ? 'is-active' : ''} onClick={() => selectTopic(item, query.trim().length >= 2 ? 'help-search' : 'top-10')}><span>{query.trim().length >= 2 ? index + 1 : `Top ${index + 1}`}</span><strong>{item.question}</strong><i className='fa fa-angle-right' aria-hidden='true' /></button></li>)}</ol> : <EmptySearch />}
          {!query.trim() && <p className='gm-help__library-note'>The Top 10 gives you the most relevant starting points. Use search to browse the full guidance library available to your role.</p>}
        </section>

        <section className='gm-help__answer' aria-labelledby='help-answer-title'>
          {selectedTopic ? <div tabIndex='-1' ref={answerRef} className='gm-help__answer-card'>
            <p>Guidance for {guidance?.roleLabel}</p>
            <h2 id='help-answer-title'>{selectedTopic.question}</h2>
            <div className='gm-help__answer-copy'>{selectedTopic.answer}</div>
            <div className='gm-help__feedback' aria-label='Answer feedback'><span>Was this guidance helpful?</span><div><button type='button' className={feedbackByTopic[selectedTopic.id] === 'helpful' ? 'is-selected' : ''} onClick={() => submitFeedback('helpful')}>Yes</button><button type='button' className={feedbackByTopic[selectedTopic.id] === 'not_helpful' ? 'is-selected' : ''} onClick={() => submitFeedback('not_helpful')}>Not yet</button></div>{feedbackByTopic[selectedTopic.id] && <small>Thank you. This feedback helps us improve guidance.</small>}</div>
          </div> : <div className='gm-help__answer-placeholder'><i className='fa fa-compass' aria-hidden='true' /><h2>Choose a question to see the answer</h2><p>Start with the Top 10, or search using the words you would naturally use.</p></div>}
        </section>
      </div>
    </main>
  )
}
