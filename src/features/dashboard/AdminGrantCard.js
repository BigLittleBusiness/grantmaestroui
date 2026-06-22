import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

// ---------------------------------------------------------------------------
// Stage definitions — 6 lifecycle stages with colour coding
// ---------------------------------------------------------------------------
const STAGES = [
  { label: 'Grant Found',  pct: 17,  color: '#2e83ff' },
  { label: 'Suitability',  pct: 33,  color: '#7c4dff' },
  { label: 'Submission',   pct: 50,  color: '#00b0ff' },
  { label: 'Outcome',      pct: 67,  color: '#00c853' },
  { label: 'Reporting',    pct: 83,  color: '#e91e63' },
  { label: 'Financials',   pct: 100, color: '#ff6d00' },
]

function deriveStageIndex(grant) {
  if (grant.won_fund_amount || grant.total_amount_spent || grant.received_fund_amount)
    return 5 // Financials
  if (grant.reports && grant.reports.length > 0) return 4 // Reporting
  if (grant.outcome) return 3                             // Outcome
  if (grant.grant_submission_date || grant.submissionDate) return 2 // Submission
  if (grant.determination || grant.decision_date || grant.decisionDate) return 1 // Suitability
  return 0 // Grant Found
}

// ---------------------------------------------------------------------------
// Interactive progress bar — coloured fill + stage label + hover tooltip
// ---------------------------------------------------------------------------
function StageProgressBar({ grant }) {
  const [hovered, setHovered] = useState(false)
  const idx   = deriveStageIndex(grant)
  const stage = STAGES[idx]

  return (
    <div
      style={{ position: 'relative', cursor: 'default' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Track */}
      <div
        style={{
          height: 10,
          borderRadius: 6,
          background: '#e9ecef',
          overflow: 'hidden',
        }}
      >
        {/* Fill */}
        <div
          style={{
            height: '100%',
            width: `${stage.pct}%`,
            background: stage.color,
            borderRadius: 6,
            transition: 'width 0.4s ease',
          }}
        />
      </div>

      {/* Stage label below bar */}
      <div
        style={{
          fontSize: 10,
          color: stage.color,
          fontWeight: 600,
          marginTop: 2,
          letterSpacing: '0.02em',
        }}
      >
        {stage.label}
      </div>

      {/* Hover tooltip */}
      {hovered && (
        <div
          style={{
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#212529',
            color: '#fff',
            fontSize: 11,
            padding: '4px 8px',
            borderRadius: 4,
            whiteSpace: 'nowrap',
            zIndex: 10,
            marginBottom: 4,
            pointerEvents: 'none',
          }}
        >
          {stage.label} — {stage.pct}% complete
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export default function AdminGrantCard() {
  const grants   = useSelector((state) => state.grant?.grants ?? [])
  const navigate = useNavigate()
  const handleViewAllClick = () => {
    navigate('/grant')
  }

  return (
    <div className='col-xl-7 d-flex'>
      <div className='card super-admin-dash-card flex-fill'>
        <div className='card-header'>
          <div className='row align-items-center'>
            <div className='col'>
              <h5 className='card-title mb-0'>Grants Applying For</h5>
            </div>
            <div className='col-auto'>
              <button
                onClick={handleViewAllClick}
                className='btn btn-sm btn-primary'
              >
                View All
              </button>
            </div>
          </div>
        </div>
        <div className='card-body p-0'>
          <div className='table-responsive'>
            <table className='table table-hover mb-0'>
              <thead className='table-light'>
                <tr>
                  <th style={{ fontWeight: 600, fontSize: 12 }}>Grant</th>
                  <th style={{ fontWeight: 600, fontSize: 12, width: '40%' }}>Stage Progress</th>
                  <th style={{ fontWeight: 600, fontSize: 12 }}></th>
                </tr>
              </thead>
              <tbody>
                {grants.length === 0 ? (
                  <tr>
                    <td colSpan={3} className='text-center text-muted py-4' style={{ fontSize: 13 }}>
                      No grants yet.{' '}
                      <Link to='/grant/create'>Add your first grant</Link>
                    </td>
                  </tr>
                ) : (
                  grants.map((grant) => (
                    <tr key={grant.organization_grant_id}>
                      <td style={{ verticalAlign: 'middle' }}>
                        <Link
                          to={`/grant/details/${grant.organization_grant_id}`}
                          style={{ fontWeight: 500, fontSize: 13 }}
                        >
                          {grant.grant_title}
                        </Link>
                      </td>
                      <td style={{ verticalAlign: 'middle', paddingRight: 16 }}>
                        <StageProgressBar grant={grant} />
                      </td>
                      <td style={{ verticalAlign: 'middle' }} className='text-end'>
                        <Link
                          to={`/grant/details/${grant.organization_grant_id}`}
                          className='btn btn-sm btn-outline-primary'
                          style={{ fontSize: 11 }}
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
