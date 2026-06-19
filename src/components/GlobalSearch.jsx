import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchGrants } from '../features/grant/grantSlice'
import { fetchTasks } from '../features/tasks/tasksSlice'
import { fetchTeamMembers } from '../features/teamMember/teamMemberSlice'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const highlight = (text, query) => {
  if (!query || !text) return text
  const idx = String(text).toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return text
  const before = String(text).slice(0, idx)
  const match  = String(text).slice(idx, idx + query.length)
  const after  = String(text).slice(idx + query.length)
  return (
    <>
      {before}
      <mark style={{ background: '#fff3cd', padding: 0 }}>{match}</mark>
      {after}
    </>
  )
}

const MAX_PER_SECTION = 5

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
const GlobalSearch = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const grants      = useSelector((state) => state.grant.grants)
  const tasks       = useSelector((state) => state.tasks.tasks)
  const teamMembers = useSelector((state) => state.teamMember?.teamMembers || [])

  const [query, setQuery]       = useState('')
  const [open, setOpen]         = useState(false)
  const wrapperRef              = useRef(null)
  const inputRef                = useRef(null)

  // Ensure data is loaded
  useEffect(() => {
    if (!grants.length)      dispatch(fetchGrants())
    if (!tasks.length)       dispatch(fetchTasks())
    if (!teamMembers.length) dispatch(fetchTeamMembers())
  }, [dispatch, grants.length, tasks.length, teamMembers.length])

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Close on Escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
        setQuery('')
        inputRef.current?.blur()
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  // ---------------------------------------------------------------------------
  // Search logic
  // ---------------------------------------------------------------------------
  const q = query.trim().toLowerCase()

  const matchedGrants = q
    ? grants
        .filter((g) =>
          (g.grant_title || '').toLowerCase().includes(q) ||
          (g.fund_originator || '').toLowerCase().includes(q) ||
          (g.category_name || '').toLowerCase().includes(q)
        )
        .slice(0, MAX_PER_SECTION)
    : []

  const matchedTasks = q
    ? tasks
        .filter((t) =>
          (t.description || t.task_description || '').toLowerCase().includes(q) ||
          (t.grant || '').toLowerCase().includes(q) ||
          (t.assignedTo || '').toLowerCase().includes(q)
        )
        .slice(0, MAX_PER_SECTION)
    : []

  const matchedMembers = q
    ? teamMembers
        .filter((m) =>
          (`${m.first_name || ''} ${m.last_name || ''}`).toLowerCase().includes(q) ||
          (m.email || '').toLowerCase().includes(q) ||
          (m.role || '').toLowerCase().includes(q)
        )
        .slice(0, MAX_PER_SECTION)
    : []

  const hasResults =
    matchedGrants.length > 0 ||
    matchedTasks.length  > 0 ||
    matchedMembers.length > 0

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------
  const handleInput = useCallback((e) => {
    setQuery(e.target.value)
    setOpen(true)
  }, [])

  const handleClear = useCallback(() => {
    setQuery('')
    setOpen(false)
    inputRef.current?.focus()
  }, [])

  const handleGrantClick = useCallback((grant) => {
    navigate(`/grant/${grant.organization_grant_id}`)
    setQuery('')
    setOpen(false)
  }, [navigate])

  const handleTaskClick = useCallback((task) => {
    navigate(`/view-task/${task.id}`)
    setQuery('')
    setOpen(false)
  }, [navigate])

  const handleMemberClick = useCallback((member) => {
    navigate(`/team-member/${member.user_id || member.id}`)
    setQuery('')
    setOpen(false)
  }, [navigate])

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <div className='gm-search-wrapper' ref={wrapperRef}>
      <input
        ref={inputRef}
        type='text'
        className='gm-search-input'
        placeholder='Search grants, tasks, team members…'
        value={query}
        onChange={handleInput}
        onFocus={() => q && setOpen(true)}
        aria-label='Global search'
        aria-haspopup='listbox'
        aria-expanded={open}
        autoComplete='off'
      />

      {query ? (
        <button
          className='gm-search-clear'
          onClick={handleClear}
          aria-label='Clear search'
          tabIndex={-1}
        >
          ✕
        </button>
      ) : (
        <span className='gm-search-icon' aria-hidden='true'>🔍</span>
      )}

      {open && q && (
        <div className='gm-search-results' role='listbox'>
          {!hasResults && (
            <div className='gm-search-no-results'>
              No results found for "<strong>{query}</strong>"
            </div>
          )}

          {/* Grants */}
          {matchedGrants.length > 0 && (
            <>
              <div className='gm-search-section-title'>Grants</div>
              {matchedGrants.map((grant) => (
                <div
                  key={grant.organization_grant_id}
                  className='gm-search-result-item'
                  role='option'
                  tabIndex={0}
                  onClick={() => handleGrantClick(grant)}
                  onKeyDown={(e) => e.key === 'Enter' && handleGrantClick(grant)}
                >
                  <span className='gm-search-result-icon'>🏆</span>
                  <div>
                    <div className='gm-search-result-label'>
                      {highlight(grant.grant_title, query)}
                    </div>
                    {grant.fund_originator && (
                      <div className='gm-search-result-sub'>
                        {highlight(grant.fund_originator, query)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </>
          )}

          {/* Tasks */}
          {matchedTasks.length > 0 && (
            <>
              <div className='gm-search-section-title'>Tasks</div>
              {matchedTasks.map((task) => (
                <div
                  key={task.id}
                  className='gm-search-result-item'
                  role='option'
                  tabIndex={0}
                  onClick={() => handleTaskClick(task)}
                  onKeyDown={(e) => e.key === 'Enter' && handleTaskClick(task)}
                >
                  <span className='gm-search-result-icon'>✅</span>
                  <div>
                    <div className='gm-search-result-label'>
                      {highlight(task.description || task.task_description, query)}
                    </div>
                    {task.grant && (
                      <div className='gm-search-result-sub'>
                        Grant: {highlight(task.grant, query)}
                        {task.assignedTo && ` · ${task.assignedTo}`}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </>
          )}

          {/* Team Members */}
          {matchedMembers.length > 0 && (
            <>
              <div className='gm-search-section-title'>Team Members</div>
              {matchedMembers.map((member) => {
                const fullName = `${member.first_name || ''} ${member.last_name || ''}`.trim()
                const memberId = member.user_id || member.id
                return (
                  <div
                    key={memberId}
                    className='gm-search-result-item'
                    role='option'
                    tabIndex={0}
                    onClick={() => handleMemberClick(member)}
                    onKeyDown={(e) => e.key === 'Enter' && handleMemberClick(member)}
                  >
                    <span className='gm-search-result-icon'>👤</span>
                    <div>
                      <div className='gm-search-result-label'>
                        {highlight(fullName, query)}
                      </div>
                      {member.email && (
                        <div className='gm-search-result-sub'>
                          {highlight(member.email, query)}
                          {member.role && ` · ${member.role}`}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default GlobalSearch
