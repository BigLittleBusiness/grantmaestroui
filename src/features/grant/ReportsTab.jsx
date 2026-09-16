import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { updateGrant, manageGrantExpenses, manageGrantReport } from './grantSlice'
import GrantFinding from './GrantFinding'
import Suitability from './Suitability'
import Submission from './Submission'
import Outcome from './Outcome'
import GrantReporting from './GrantReporting'
import Financials from './Financials'
import Expenses from './Expenses'
import './grant-lifecycle-tabs.css'

const TABS = [
  ['grant-finding', 'Grant found'],
  ['suitability', 'Suitability'],
  ['submission', 'Submission'],
  ['outcome', 'Outcome'],
  ['reporting-content', 'Reporting'],
  ['financials1', 'Financials'],
]

export default function ReportsTab({ viewOnly = false }) {
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams()
  const initialTab = TABS.some(([key]) => key === searchParams.get('tab')) ? searchParams.get('tab') : 'grant-finding'
  const [activeTab, setActiveTab] = useState(initialTab)

  const saveGrantSection = (id, values) => dispatch(updateGrant({ id, values }))
  const saveReport = (values) => dispatch(manageGrantReport({ values }))
  const saveExpense = (id, values) => dispatch(manageGrantExpenses({ id, values: { ...values, grant_id: id } }))

  return (
    <section className='gm-lifecycle-tabs' aria-labelledby='grant-record-sections'>
      <div className='gm-lifecycle-tabs__header'>
        <div>
          <p className='gm-lifecycle-tabs__eyebrow'>Grant record</p>
          <h2 id='grant-record-sections'>Record sections</h2>
        </div>
        {!viewOnly && <p>Saving a section updates the record. Use the workspace control panel to deliberately move the grant through its lifecycle.</p>}
      </div>
      <div className='gm-lifecycle-tabs__scroll' role='tablist' aria-label='Grant record sections'>
        {TABS.map(([key, label]) => <button key={key} type='button' role='tab' id={`tab-${key}`} aria-selected={activeTab === key} aria-controls={`panel-${key}`} className={activeTab === key ? 'is-active' : ''} onClick={() => setActiveTab(key)}>{label}</button>)}
      </div>
      <div className='gm-lifecycle-tabs__content'>
        {activeTab === 'grant-finding' && <div id='panel-grant-finding' role='tabpanel' aria-labelledby='tab-grant-finding'><GrantFinding onSubmit={saveGrantSection} viewOnly={viewOnly} showSaveButton /></div>}
        {activeTab === 'suitability' && <div id='panel-suitability' role='tabpanel' aria-labelledby='tab-suitability'><Suitability onSubmit={saveGrantSection} viewOnly={viewOnly} showSaveButton /></div>}
        {activeTab === 'submission' && <div id='panel-submission' role='tabpanel' aria-labelledby='tab-submission'><Submission onSubmit={saveGrantSection} viewOnly={viewOnly} showSaveButton /></div>}
        {activeTab === 'outcome' && <div id='panel-outcome' role='tabpanel' aria-labelledby='tab-outcome'><Outcome onSubmit={saveGrantSection} viewOnly={viewOnly} showSaveButton /></div>}
        {activeTab === 'reporting-content' && <div id='panel-reporting-content' role='tabpanel' aria-labelledby='tab-reporting-content'><GrantReporting onSubmit={saveReport} viewOnly={viewOnly} showSaveButton /></div>}
        {activeTab === 'financials1' && <div id='panel-financials1' role='tabpanel' aria-labelledby='tab-financials1'><Financials onSubmit={saveGrantSection} viewOnly={viewOnly} showSaveButton /></div>}
        {activeTab === 'expense' && <div id='panel-expense' role='tabpanel'><Expenses onSubmit={saveExpense} viewOnly={viewOnly} showSaveButton /></div>}
      </div>
    </section>
  )
}
