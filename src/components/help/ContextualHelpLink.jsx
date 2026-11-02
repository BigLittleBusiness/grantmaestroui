import React from 'react'
import { Link } from 'react-router-dom'
import api from 'api'
import './help-guidance.css'

/**
 * A contextual link is intentionally only placed on a screen whose audience is
 * allowed to use the topic. The API independently verifies the topic at event
 * time, so altering a URL cannot make a restricted article available.
 */
export default function ContextualHelpLink({ topicId, source, children = 'Need help?' }) {
  const handleClick = () => {
    api.post('help-guidance/events', {
      eventType: 'contextual_link_opened',
      topicId,
      source,
    }).catch(() => {
      // Help navigation should never fail merely because anonymous telemetry fails.
    })
  }

  return (
    <Link
      className='gm-contextual-help-link'
      to={`/help-guidance?topic=${encodeURIComponent(topicId)}&source=${encodeURIComponent(source || 'contextual-link')}`}
      onClick={handleClick}
    >
      <i className='fa fa-question-circle' aria-hidden='true' /> {children}
    </Link>
  )
}
