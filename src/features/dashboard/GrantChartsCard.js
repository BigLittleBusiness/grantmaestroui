/**
 * GrantChartsCard
 *
 * Dashboard component that renders two recharts visualisations:
 *   1. Donut chart — grants by lifecycle stage (Grant Found → Financials)
 *   2. Bar chart   — grants closing per month (next 6 months pipeline)
 *
 * Both charts derive data entirely from the existing `state.grant.grants`
 * Redux slice — no new API endpoints required.
 */

import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts'

// ---------------------------------------------------------------------------
// Stage colour palette — matches the existing card-* CSS classes
// ---------------------------------------------------------------------------
const STAGE_COLOURS = {
  'Grant Found':  '#2e83ff',
  'Suitability':  '#7c4dff',
  'Submission':   '#00b0ff',
  'Outcome':      '#00c853',
  'Reporting':    '#e91e63',
  'Financials':   '#ff6d00',
}

// Determine which lifecycle stage a grant is currently in based on available data
function deriveStage(grant) {
  if (grant.allocatedFunds || grant.spentAmount)          return 'Financials'
  if (grant.reportTitle    || grant.reportStatus)         return 'Reporting'
  if (grant.outcome        || grant.agreement_signed)     return 'Outcome'
  if (grant.submissionDate || grant.funding_sought_amount) return 'Submission'
  if (grant.determination  || grant.rationale)            return 'Suitability'
  return 'Grant Found'
}

// ---------------------------------------------------------------------------
// Stage donut chart
// ---------------------------------------------------------------------------
function StageDonutChart({ grants }) {
  const stageData = useMemo(() => {
    const counts = {}
    grants.forEach((g) => {
      const stage = deriveStage(g)
      counts[stage] = (counts[stage] || 0) + 1
    })
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  }, [grants])

  if (!stageData.length) {
    return (
      <div className='gm-empty-state' style={{ padding: '24px 0' }}>
        <div className='gm-empty-state__icon' style={{ fontSize: 32 }}>📊</div>
        <p className='gm-empty-state__body mb-0'>No grant data yet</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width='100%' height={240}>
      <PieChart>
        <Pie
          data={stageData}
          cx='50%'
          cy='50%'
          innerRadius={55}
          outerRadius={85}
          paddingAngle={3}
          dataKey='value'
          label={({ name, percent }) =>
            `${name} ${(percent * 100).toFixed(0)}%`
          }
          labelLine={false}
        >
          {stageData.map((entry) => (
            <Cell
              key={entry.name}
              fill={STAGE_COLOURS[entry.name] || '#8884d8'}
            />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`${value} grant${value !== 1 ? 's' : ''}`, 'Count']} />
        <Legend iconType='circle' iconSize={10} />
      </PieChart>
    </ResponsiveContainer>
  )
}

// ---------------------------------------------------------------------------
// Monthly closing pipeline bar chart (next 6 months)
// ---------------------------------------------------------------------------
function MonthlyPipelineChart({ grants }) {
  const monthData = useMemo(() => {
    const now   = new Date()
    const months = []

    for (let i = 0; i < 6; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() + i, 1)
      months.push({
        label: d.toLocaleString('en-AU', { month: 'short', year: '2-digit' }),
        year:  d.getFullYear(),
        month: d.getMonth(),
        count: 0,
        value: 0,
      })
    }

    grants.forEach((g) => {
      const closing = g.closingDate ? new Date(g.closingDate) : null
      if (!closing) return
      const bucket = months.find(
        (m) => m.year === closing.getFullYear() && m.month === closing.getMonth()
      )
      if (bucket) {
        bucket.count += 1
        bucket.value += parseFloat(g.max_fund_amount) || 0
      }
    })

    return months.map((m) => ({
      name:  m.label,
      Grants: m.count,
      Value: Math.round(m.value / 1000),   // display in $k
    }))
  }, [grants])

  return (
    <ResponsiveContainer width='100%' height={240}>
      <BarChart data={monthData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
        <XAxis dataKey='name' tick={{ fontSize: 11 }} />
        <YAxis
          yAxisId='left'
          orientation='left'
          tick={{ fontSize: 11 }}
          label={{ value: 'Grants', angle: -90, position: 'insideLeft', offset: 10, style: { fontSize: 11 } }}
        />
        <YAxis
          yAxisId='right'
          orientation='right'
          tick={{ fontSize: 11 }}
          label={{ value: '$k', angle: 90, position: 'insideRight', offset: 10, style: { fontSize: 11 } }}
        />
        <Tooltip
          formatter={(value, name) =>
            name === 'Value' ? [`$${value}k`, 'Max Funds'] : [value, 'Grants Closing']
          }
        />
        <Legend iconSize={10} />
        <Bar yAxisId='left'  dataKey='Grants' fill='#2e83ff' radius={[3, 3, 0, 0]} />
        <Bar yAxisId='right' dataKey='Value'  fill='#00c853' radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

// ---------------------------------------------------------------------------
// Exported card
// ---------------------------------------------------------------------------
export default function GrantChartsCard() {
  const grants = useSelector((state) => state.grant?.grants ?? [])

  return (
    <div className='col-xl-12'>
      <div className='row'>
        {/* Stage breakdown donut */}
        <div className='col-xl-5 col-md-6 d-flex mb-3'>
          <div className='card super-admin-dash-card flex-fill'>
            <div className='card-body'>
              <h5 className='card-title mb-3'>Grants by Stage</h5>
              <StageDonutChart grants={grants} />
            </div>
          </div>
        </div>

        {/* Monthly pipeline bar */}
        <div className='col-xl-7 col-md-6 d-flex mb-3'>
          <div className='card super-admin-dash-card flex-fill'>
            <div className='card-body'>
              <h5 className='card-title mb-3'>Closing Pipeline — Next 6 Months</h5>
              <MonthlyPipelineChart grants={grants} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
