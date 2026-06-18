import React, { useMemo, useRef, useState, useCallback } from 'react'
import { useTable } from 'react-table'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { updateGrant } from './grantSlice'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const TAB_MAP = {
  actionsGrantFinding:      'grant-finding',
  actionsSuitability:       'suitability',
  actionsGrantSubmission:   'submission',
  actionsSubmissionOutcome: 'outcome',
  actionsGrantReporting:    'reporting',
  actionsFinancials:        'financials',
}

const COLUMN_GROUPS = [
  { key: 'grantFinding',      label: 'Grant Found',  btnClass: 'header-blue' },
  { key: 'suitabilityGrants', label: 'Suitability',  btnClass: 'card-purple' },
  { key: 'grantSubmission',   label: 'Submission',   btnClass: 'card-blue'   },
  { key: 'submissionOutcome', label: 'Outcome',      btnClass: 'card-green'  },
  { key: 'grantReporting',    label: 'Reporting',    btnClass: 'card-pink'   },
  { key: 'financials',        label: 'Financials',   btnClass: 'card-orange' },
]

// ---------------------------------------------------------------------------
// Inline-editable cell
// ---------------------------------------------------------------------------
//
// Clicking the cell value turns it into a text input.
// Pressing Enter or blurring the input saves the change via updateGrant.
// Pressing Escape cancels without saving.

const EditableCell = ({ value: initialValue, row, fieldName, dispatch, inputType = 'text' }) => {
  const [editing, setEditing]   = useState(false)
  const [localVal, setLocalVal] = useState(initialValue ?? '')
  const inputRef                = useRef(null)

  const startEdit = () => {
    setLocalVal(initialValue ?? '')
    setEditing(true)
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  const save = useCallback(() => {
    setEditing(false)
    if (localVal === (initialValue ?? '')) return
    dispatch(updateGrant({
      id:     row.original.organization_grant_id,
      values: { [fieldName]: localVal },
    }))
  }, [localVal, initialValue, row.original.organization_grant_id, fieldName, dispatch])

  const cancel = () => {
    setEditing(false)
    setLocalVal(initialValue ?? '')
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter')  save()
    if (e.key === 'Escape') cancel()
  }

  if (editing) {
    return (
      <input
        ref={inputRef}
        type={inputType}
        className='gm-cell-input'
        value={localVal}
        onChange={(e) => setLocalVal(e.target.value)}
        onBlur={save}
        onKeyDown={onKeyDown}
      />
    )
  }

  return (
    <div className='gm-cell-editable' onClick={startEdit} title='Click to edit'>
      {initialValue || <span className='text-muted'>—</span>}
      <span className='gm-cell-edit-hint'>✎</span>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Action buttons cell
// ---------------------------------------------------------------------------

const ActionCell = ({ row, column }) => (
  <div className='d-flex align-items-center'>
    <Link
      to={`/grant/details/${row.original.organization_grant_id}`}
      className='btn-action-icon'
      title='View'
    >
      <i className='fa fa-eye'></i>
    </Link>
    <Link
      to={`/grant/edit/${row.original.organization_grant_id}?tab=${TAB_MAP[column.id] ?? 'grant-finding'}`}
      className='btn-action-icon ms-2'
      title='Edit'
    >
      <i className='fa fa-edit'></i>
    </Link>
    <Link
      to='javascript:void(0);'
      className='btn-action-icon ms-2'
      data-bs-toggle='modal'
      data-bs-target='#add_modal'
      title='Add Task'
    >
      <i className='fa fa-tasks'></i>
    </Link>
  </div>
)

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

const GrantList = () => {
  const grants   = useSelector((state) => state.grant.grants)
  const dispatch = useDispatch()

  const scrollContainerRef = useRef(null)
  const groupHeaderRefs    = useRef({})

  const scrollToGroup = (groupKey) => {
    const container = scrollContainerRef.current
    const targetTh  = groupHeaderRefs.current[groupKey]
    if (!container || !targetTh) return
    const containerRect = container.getBoundingClientRect()
    const targetRect    = targetTh.getBoundingClientRect()
    const scrollOffset  = targetRect.left - containerRect.left + container.scrollLeft - 8
    container.scrollTo({ left: scrollOffset, behavior: 'smooth' })
  }

  // Factory: returns an EditableCell bound to a specific field and input type
  const editable = useCallback(
    (fieldName, inputType = 'text') =>
      ({ value, row }) => (
        <EditableCell
          value={value}
          row={row}
          fieldName={fieldName}
          dispatch={dispatch}
          inputType={inputType}
        />
      ),
    [dispatch]
  )

  const columns = useMemo(() => [
    {
      Header: 'Grant Found',
      headerClassName: 'header-blue firstLevelHeader',
      trClassName: 'grantFinding',
      columns: [
        {
          Header: 'Grant Title',
          accessor: 'grant_title',
          headerClassName: 'header-blue secondLevelHeader',
          Cell: ({ value, row }) => (
            <EditableCell value={value} row={row} fieldName='grant_title' dispatch={dispatch} />
          ),
        },
        {
          Header: 'Opening Date',
          accessor: 'opening_date',
          headerClassName: 'header-blue secondLevelHeader',
          Cell: editable('opening_date', 'date'),
        },
        {
          Header: 'Closing Date',
          accessor: 'closingDate',
          headerClassName: 'header-blue secondLevelHeader',
          Cell: editable('closing_date', 'date'),
        },
        {
          Header: 'Max Funds',
          accessor: 'max_fund_amount',
          headerClassName: 'header-blue secondLevelHeader',
          Cell: editable('max_fund_amount', 'number'),
        },
        {
          Header: 'Category',
          accessor: 'category_name',
          headerClassName: 'header-blue secondLevelHeader',
          // Read-only — category is a FK lookup; edit via full form
        },
        {
          Header: 'Funding Originator',
          accessor: 'fund_originator',
          headerClassName: 'header-blue secondLevelHeader',
          Cell: editable('fund_originator'),
        },
        {
          Header: 'Actions',
          id: 'actionsGrantFinding',
          Cell: ActionCell,
          headerClassName: 'header-blue secondLevelHeader',
        },
      ],
    },
    {
      Header: 'Suitability of Grants',
      headerClassName: 'card-purple firstLevelHeader',
      trClassName: 'suitabilityGrants',
      columns: [
        {
          Header: 'Internal Decision Date',
          accessor: 'decisionDate',
          headerClassName: 'card-purple secondLevelHeader',
          Cell: editable('decision_date', 'date'),
        },
        {
          Header: 'Determination On',
          accessor: 'determination',
          headerClassName: 'card-purple secondLevelHeader',
          Cell: editable('determination'),
        },
        {
          Header: 'Rationale for Decision',
          accessor: 'rationale',
          headerClassName: 'card-purple secondLevelHeader',
          Cell: editable('rationale'),
        },
        {
          Header: 'Assessment Outcome Date',
          accessor: 'assessment_outcome_date',
          headerClassName: 'card-purple secondLevelHeader',
          Cell: editable('assessment_outcome_date', 'date'),
        },
        {
          Header: 'Actions',
          id: 'actionsSuitability',
          Cell: ActionCell,
          headerClassName: 'card-purple secondLevelHeader',
        },
      ],
    },
    {
      Header: 'Grant Submission',
      headerClassName: 'card-blue firstLevelHeader',
      trClassName: 'grantSubmission',
      columns: [
        {
          Header: 'Submission Date',
          accessor: 'submissionDate',
          headerClassName: 'card-blue secondLevelHeader',
          Cell: editable('submission_date', 'date'),
        },
        {
          Header: 'Funding Sought Amount',
          accessor: 'funding_sought_amount',
          headerClassName: 'card-blue secondLevelHeader',
          Cell: editable('funding_sought_amount', 'number'),
        },
        {
          Header: 'Submitted By',
          accessor: 'submittedBy',
          headerClassName: 'card-blue secondLevelHeader',
          Cell: editable('submitted_by'),
        },
        {
          Header: 'Department',
          accessor: 'submission_department',
          headerClassName: 'card-blue secondLevelHeader',
          Cell: editable('submission_department'),
        },
        {
          Header: 'Department Representative',
          accessor: 'submission_department_representative',
          headerClassName: 'card-blue secondLevelHeader',
          Cell: editable('submission_department_representative'),
        },
        {
          Header: 'Project Name',
          accessor: 'submission_project_name',
          headerClassName: 'card-blue secondLevelHeader',
          Cell: editable('submission_project_name'),
        },
        {
          Header: 'Reasoning',
          accessor: 'submission_reasoning',
          headerClassName: 'card-blue secondLevelHeader',
          Cell: editable('submission_reasoning'),
        },
        {
          Header: 'Co Contribution',
          accessor: 'submission_co_contributor',
          headerClassName: 'card-blue secondLevelHeader',
          Cell: editable('submission_co_contributor'),
        },
        {
          Header: 'Actions',
          id: 'actionsGrantSubmission',
          Cell: ActionCell,
          headerClassName: 'card-blue secondLevelHeader',
        },
      ],
    },
    {
      Header: 'Submission Outcome',
      headerClassName: 'card-green firstLevelHeader',
      trClassName: 'submissionOutcome',
      columns: [
        {
          Header: 'Outcome',
          accessor: 'outcome',
          headerClassName: 'card-green secondLevelHeader',
          Cell: editable('outcome'),
        },
        {
          Header: 'Decision Date',
          accessor: 'decisionDate2',
          headerClassName: 'card-green secondLevelHeader',
          Cell: editable('outcome_decision_date', 'date'),
        },
        {
          Header: 'Agreement Signed',
          accessor: 'agreement_signed',
          headerClassName: 'card-green secondLevelHeader',
          Cell: editable('agreement_signed'),
        },
        {
          Header: 'Learning',
          accessor: 'learning',
          headerClassName: 'card-green secondLevelHeader',
          Cell: editable('learning'),
        },
        {
          Header: 'Actions',
          id: 'actionsSubmissionOutcome',
          Cell: ActionCell,
          headerClassName: 'card-green secondLevelHeader',
        },
      ],
    },
    {
      Header: 'Grant Reporting',
      headerClassName: 'card-pink firstLevelHeader',
      trClassName: 'grantReporting',
      columns: [
        {
          Header: 'Report Title',
          accessor: 'reportTitle',
          headerClassName: 'card-pink secondLevelHeader',
          Cell: editable('report_title'),
        },
        {
          Header: 'Submission Date',
          accessor: 'reportSubmissionDate',
          headerClassName: 'card-pink secondLevelHeader',
          Cell: editable('report_submission_date', 'date'),
        },
        {
          Header: 'Status',
          accessor: 'reportStatus',
          headerClassName: 'card-pink secondLevelHeader',
          Cell: editable('report_status'),
        },
        {
          Header: 'Actions',
          id: 'actionsGrantReporting',
          Cell: ActionCell,
          headerClassName: 'card-pink secondLevelHeader',
        },
      ],
    },
    {
      Header: 'Financials',
      headerClassName: 'card-orange firstLevelHeader',
      trClassName: 'financials',
      columns: [
        {
          Header: 'Allocated Funds',
          accessor: 'allocatedFunds',
          headerClassName: 'card-orange secondLevelHeader',
          Cell: editable('allocated_funds', 'number'),
        },
        {
          Header: 'Spent Amount',
          accessor: 'spentAmount',
          headerClassName: 'card-orange secondLevelHeader',
          Cell: editable('spent_amount', 'number'),
        },
        {
          Header: 'Remaining Funds',
          accessor: 'remainingFunds',
          headerClassName: 'card-orange secondLevelHeader',
          // Read-only — calculated server-side
        },
        {
          Header: 'Actions',
          id: 'actionsFinancials',
          Cell: ActionCell,
          headerClassName: 'card-orange secondLevelHeader',
        },
      ],
    },
  // editable is stable (useCallback with [dispatch]) so this is safe
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [editable, dispatch])

  const emptyData = useMemo(() => [{
    id: '', grant_title: '', origination_url: '', max_fund_amount: '',
    funding_sought_amount: '', fund_originator: '', closingDate: '',
    decisionDate: '', determination: '', rationale: '',
  }], [])

  const data = useMemo(
    () => (grants.length > 0 ? grants : emptyData),
    [grants, emptyData]
  )

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data })

  // Empty state
  if (grants.length === 0) {
    return (
      <div className='gm-empty-state'>
        <div className='gm-empty-state__icon'>📋</div>
        <div className='gm-empty-state__title'>No grants yet</div>
        <p className='gm-empty-state__body'>
          Start tracking your first grant opportunity. Click <strong>Add New</strong> above to get started.
        </p>
      </div>
    )
  }

  return (
    <div className='mt-2'>
      {/* Navigation buttons */}
      <div className='mb-2 d-flex flex-wrap gap-1'>
        {COLUMN_GROUPS.map(({ key, label, btnClass }) => (
          <button
            key={key}
            className={`btn ${btnClass} btn-sm`}
            onClick={() => scrollToGroup(key)}
            type='button'
          >
            {label}
          </button>
        ))}
      </div>

      {/* Horizontally-scrollable table container */}
      <div className='table-responsive scrollable' ref={scrollContainerRef}>
        <table
          {...getTableProps()}
          className='table table-center table-bordered table-hover datatable no-footer grantTable'
        >
          <thead className='thead-light'>
            {headerGroups.map((headerGroup, hgIndex) => (
              <tr
                {...headerGroup.getHeaderGroupProps()}
                className={headerGroup.headers[0]?.headerClassName}
                key={hgIndex}
              >
                {headerGroup.headers.map((column, colIndex) => {
                  const isTopLevelRow = hgIndex === 0
                  const groupKey = COLUMN_GROUPS[colIndex]?.key

                  return (
                    <th
                      {...column.getHeaderProps()}
                      className={column.headerClassName}
                      key={column.id}
                      ref={
                        isTopLevelRow && groupKey
                          ? (el) => { groupHeaderRefs.current[groupKey] = el }
                          : undefined
                      }
                    >
                      {column.render('Header')}
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row)
              return (
                <tr {...row.getRowProps()} className='table-row' key={row.id}>
                  {row.cells.map((cell) => (
                    <td
                      {...cell.getCellProps()}
                      key={cell.column.id}
                      className={cell.column.parent?.trClassName}
                    >
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default GrantList
