import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import {
  updateGrant,
  manageGrantExpenses,
  manageGrantReport,
} from './grantSlice'
import GrantFinding from './GrantFinding'
import Suitability from './Suitability'
import Submission from './Submission'
import Outcome from './Outcome'
import GrantReporting from './GrantReporting'
import Financials from './Financials'
import Expenses from './Expenses'

export default function ReportsTab({ viewOnly }) {
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams()
  const goToTab = searchParams.get('tab') || 'grant-finding'
  const [activeSubTab, setActiveSubTab] = useState(goToTab)

  const handleGrantFindingSubmit = (id, values) => {
    dispatch(updateGrant({ id, values }))
    setActiveSubTab('suitability')
  }

  const handleSutabilitySubmit = (id, values) => {
    dispatch(updateGrant({ id, values }))
    setActiveSubTab('submission')
  }

  const handleSubmissiondataSubmit = (id, values) => {
    dispatch(updateGrant({ id, values }))
    setActiveSubTab('outcome')
  }

  const handleOutcomeSubmit = (id, values) => {
    dispatch(updateGrant({ id, values }))
    setActiveSubTab('reporting-content')
  }

  const handleReportSubmit = (values) => {
    dispatch(manageGrantReport({ values }))
    //setActiveSubTab('financials1')
  }

  const handleFinancialSubmit = (id, values) => {
    dispatch(updateGrant({ id, values }))
  }

  const handleExpenseSubmit = (id, values) => {
    values.grant_id = id
    dispatch(manageGrantExpenses({ id, values }))
  }

  return (
    <div className='tab-pane fade show active' id='reporting' role='tabpanel'>
      <ul
        className='nav nav-tabs border-0'
        style={{ gap: '5px', display: 'flex' }}
      >
        <li className='nav-item' style={{ marginRight: '5px' }}>
          <button
            className={`nav-link ${
              activeSubTab === 'grant-finding' ? 'active' : ''
            }`}
            onClick={() => setActiveSubTab('grant-finding')}
            style={{
              borderRadius: '5px',
              padding: '10px 15px',
              backgroundColor:
                activeSubTab === 'grant-finding' ? '#007bff' : '#f8f9fa',
              color: activeSubTab === 'grant-finding' ? '#fff' : '#000',
              border: '1px solid #ddd',
            }}
          >
            Grant Found
          </button>
        </li>
        <li className='nav-item' style={{ marginRight: '5px' }}>
          <button
            className={`nav-link ${
              activeSubTab === 'suitability' ? 'active' : ''
            }`}
            onClick={() => setActiveSubTab('suitability')}
            style={{
              borderRadius: '5px',
              padding: '10px 15px',
              backgroundColor:
                activeSubTab === 'suitability' ? '#007bff' : '#f8f9fa',
              color: activeSubTab === 'suitability' ? '#fff' : '#000',
              border: '1px solid #ddd',
            }}
          >
            Suitability
          </button>
        </li>
        <li className='nav-item' style={{ marginRight: '5px' }}>
          <button
            className={`nav-link ${
              activeSubTab === 'submission' ? 'active' : ''
            }`}
            onClick={() => setActiveSubTab('submission')}
            style={{
              borderRadius: '5px',
              padding: '10px 15px',
              backgroundColor:
                activeSubTab === 'submission' ? '#007bff' : '#f8f9fa',
              color: activeSubTab === 'submission' ? '#fff' : '#000',
              border: '1px solid #ddd',
            }}
          >
            Submission
          </button>
        </li>
        <li className='nav-item' style={{ marginRight: '5px' }}>
          <button
            className={`nav-link ${activeSubTab === 'outcome' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('outcome')}
            style={{
              borderRadius: '5px',
              padding: '10px 15px',
              backgroundColor:
                activeSubTab === 'outcome' ? '#007bff' : '#f8f9fa',
              color: activeSubTab === 'outcome' ? '#fff' : '#000',
              border: '1px solid #ddd',
            }}
          >
            Outcome
          </button>
        </li>
        <li className='nav-item' style={{ marginRight: '5px' }}>
          <button
            className={`nav-link ${
              activeSubTab === 'reporting-content' ? 'active' : ''
            }`}
            onClick={() => setActiveSubTab('reporting-content')}
            style={{
              borderRadius: '5px',
              padding: '10px 15px',
              backgroundColor:
                activeSubTab === 'reporting-content' ? '#007bff' : '#f8f9fa',
              color: activeSubTab === 'reporting-content' ? '#fff' : '#000',
              border: '1px solid #ddd',
            }}
          >
            Grant Reporting
          </button>
        </li>
        <li className='nav-item' style={{ marginRight: '5px' }}>
          <button
            className={`nav-link ${
              activeSubTab === 'financials1' ? 'active' : ''
            }`}
            onClick={() => setActiveSubTab('financials1')}
            style={{
              borderRadius: '5px',
              padding: '10px 15px',
              backgroundColor:
                activeSubTab === 'financials1' ? '#007bff' : '#f8f9fa',
              color: activeSubTab === 'financials1' ? '#fff' : '#000',
              border: '1px solid #ddd',
            }}
          >
            Financial
          </button>
        </li>
      </ul>

      <div className='tab-content mt-3' id='reportingTabsContent'>
        {activeSubTab === 'grant-finding' && (
          <GrantFinding
            onSubmit={handleGrantFindingSubmit}
            viewOnly={viewOnly}
            showSaveButton={true}
          />
        )}
        {activeSubTab === 'suitability' && (
          <Suitability
            onSubmit={handleSutabilitySubmit}
            viewOnly={viewOnly}
            showSaveButton={true}
          />
        )}
        {activeSubTab === 'submission' && (
          <Submission
            onSubmit={handleSubmissiondataSubmit}
            viewOnly={viewOnly}
            showSaveButton={true}
          />
        )}
        {activeSubTab === 'outcome' && (
          <Outcome
            onSubmit={handleOutcomeSubmit}
            viewOnly={viewOnly}
            showSaveButton={true}
          />
        )}
        {activeSubTab === 'reporting-content' && (
          <GrantReporting
            onSubmit={handleReportSubmit}
            viewOnly={viewOnly}
            showSaveButton={true}
          />
        )}
        {activeSubTab === 'financials1' && (
          <Financials
            onSubmit={handleFinancialSubmit}
            viewOnly={viewOnly}
            showSaveButton={true}
          />
        )}
        {activeSubTab === 'expense' && (
          <Expenses
            onSubmit={handleExpenseSubmit}
            viewOnly={viewOnly}
            showSaveButton={true}
          />
        )}
      </div>
    </div>
  )
}
