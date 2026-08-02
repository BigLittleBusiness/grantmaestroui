/**
 * SysAdminDashboard.jsx
 *
 * Platform-wide metrics dashboard for Super Admin (user_type = 1).
 * Shows total organisations, active/expired subscriptions, users, grants,
 * tasks, new sign-ups in the last 30 days, and a recent organisations table.
 */
import React, { useEffect, useState } from 'react'
import api from 'api'

const StatCard = ({ label, value, colour, icon }) => (
  <div style={{ ...styles.statCard, borderTop: `4px solid ${colour}` }}>
    <div style={styles.statIcon}>{icon}</div>
    <div style={styles.statValue}>{value ?? '—'}</div>
    <div style={styles.statLabel}>{label}</div>
  </div>
)

export default function SysAdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .get('/admin/platform-stats', { withCredentials: true })
      .then((res) => {
        if (res.data?.success) setStats(res.data.data)
        else setError('Failed to load platform statistics.')
      })
      .catch(() => setError('Unable to reach the server. Please try again.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div style={styles.centred}>
        <div style={styles.spinner} />
        <p style={{ color: '#6b7280', marginTop: '16px' }}>Loading platform statistics…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div style={styles.centred}>
        <p style={{ color: '#ef4444' }}>{error}</p>
      </div>
    )
  }

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'

  return (
    <div className="content container-fluid">
      {/* Page header */}
      <div className="page-header">
        <div className="content-page-header">
          <h5>Platform Overview</h5>
          <p style={{ color: '#6b7280', fontSize: '14px', margin: '4px 0 0' }}>
            System-wide metrics — visible to Super Admins only
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div style={styles.grid}>
        <StatCard label="Total Organisations" value={stats.totalOrganisations} colour="#2563eb" icon="🏛️" />
        <StatCard label="Active Subscriptions" value={stats.activeSubscriptions} colour="#22c55e" icon="✅" />
        <StatCard label="Expired Subscriptions" value={stats.expiredSubscriptions} colour="#ef4444" icon="⚠️" />
        <StatCard label="Total Users" value={stats.totalUsers} colour="#8b5cf6" icon="👥" />
        <StatCard label="Total Grants" value={stats.totalGrants} colour="#f59e0b" icon="📋" />
        <StatCard label="Total Tasks" value={stats.totalTasks} colour="#06b6d4" icon="✔️" />
        <StatCard label="New Orgs (Last 30 Days)" value={stats.newOrgsLast30Days} colour="#1a3c5e" icon="🆕" />
      </div>

      {/* Recent organisations */}
      <div className="card shadow-sm mt-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 style={{ margin: 0 }}>Recently Registered Organisations</h5>
          <span style={{ fontSize: '13px', color: '#6b7280' }}>Latest 10</span>
        </div>
        <div className="card-body p-0">
          {stats.recentOrgs && stats.recentOrgs.length > 0 ? (
            <table className="table table-hover mb-0">
              <thead style={{ background: '#f9fafb' }}>
                <tr>
                  <th style={styles.th}>#</th>
                  <th style={styles.th}>Organisation Name</th>
                  <th style={styles.th}>Registered</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrgs.map((org, idx) => (
                  <tr key={org.organization_id}>
                    <td style={styles.td}>{idx + 1}</td>
                    <td style={styles.td}>{org.organization_name}</td>
                    <td style={styles.td}>{formatDate(org.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ padding: '20px', color: '#9ca3af', textAlign: 'center' }}>
              No organisations registered yet.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: '16px',
    marginBottom: '8px',
  },
  statCard: {
    background: '#ffffff',
    borderRadius: '8px',
    padding: '20px 16px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
    textAlign: 'center',
  },
  statIcon: { fontSize: '28px', marginBottom: '8px' },
  statValue: { fontSize: '32px', fontWeight: 700, color: '#1a3c5e', lineHeight: 1 },
  statLabel: { fontSize: '13px', color: '#6b7280', marginTop: '6px' },
  centred: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '300px',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #e5e7eb',
    borderTop: '4px solid #1a3c5e',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  th: { padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#374151' },
  td: { padding: '12px 16px', fontSize: '14px', color: '#374151', verticalAlign: 'middle' },
}
