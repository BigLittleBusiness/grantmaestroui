import React, { useMemo, useState, useEffect, useRef } from 'react'
import { useTable } from 'react-table'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
// import { fetchGrants } from './grantSlice'

const ActionCell = ({ row, column }) => {
  const tabs = {
    actionsGrantFinding: 'grant-finding',
    actionsSuitability: 'suitability',
    actionsGrantSubmission: 'submission',
    actionsSubmissionOutcome: 'outcome',
    actionsGrantReporting: 'reporting',
    actionsFinancials: 'financials',
  }
  return (
    <div className='d-flex align-items-center'>
      <Link
        to={`/grant/details/${row.original.organization_grant_id}`}
        className='btn-action-icon'
      >
        <i className='fa fa-eye'></i>
      </Link>
      <Link
        to={`/grant/edit/${row.original.organization_grant_id}?tab=${
          tabs[column.id]
        }`}
        className='btn-action-icon ms-2'
      >
        <i className='fa fa-edit'></i>
      </Link>
      <Link
        to='javascript:void(0);'
        className='btn-action-icon ms-2'
        data-bs-toggle='modal'
        data-bs-target='#add_modal'
      >
        <i className='fa fa-tasks'></i>
      </Link>
    </div>
  )
}

const GrantList = () => {
  const dispatch = useDispatch()
  const grants = useSelector((state) => state.grant.grants)
  console.log('grants', grants)
  const columns = useMemo(
    () => [
      {
        Header: 'Grant Found',
        headerClassName: 'header-blue firstLevelHeader',
        trClassName: 'grantFinding',
        columns: [
          {
            Header: 'Grant Title',
            accessor: 'grant_title',
            headerClassName: 'header-blue secondLevelHeader',
            Cell: ({ row }) => (
              <a
                href={row.original.origination_url}
                target='_blank'
                rel='noopener noreferrer'
              >
                {row.original.grant_title}
              </a>
            ),
          },
          {
            Header: 'Grant Opening Date',
            accessor: 'opening_date',
            headerClassName: 'header-blue secondLevelHeader',
          },
          {
            Header: 'Grant Closing Date',
            accessor: 'closingDate',
            headerClassName: 'header-blue secondLevelHeader',
          },
          {
            Header: 'Max Funds',
            accessor: 'max_fund_amount',
            headerClassName: 'header-blue secondLevelHeader',
          },
          {
            Header: 'Category',
            accessor: 'category_name',
            headerClassName: 'header-blue secondLevelHeader',
          },
          {
            Header: 'Funding Originator',
            accessor: 'fund_originator',
            headerClassName: 'header-blue secondLevelHeader',
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
          },
          {
            Header: 'Determination On',
            accessor: 'determination',
            headerClassName: 'card-purple secondLevelHeader',
          },
          {
            Header: 'Rationale for Decision',
            accessor: 'rationale',
            headerClassName: 'card-purple secondLevelHeader',
          },
          {
            Header: 'Assessment Outcome Date',
            accessor: 'assessment_outcome_date',
            headerClassName: 'card-purple secondLevelHeader',
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
          },
          {
            Header: 'Funding Sought Amount',
            accessor: 'funding_sought_amount',
            headerClassName: 'card-blue secondLevelHeader',
          },
          {
            Header: 'Submitted By',
            accessor: 'submittedBy',
            headerClassName: 'card-blue secondLevelHeader',
          },
          {
            Header: 'Department',
            accessor: 'submission_department',
            headerClassName: 'card-blue secondLevelHeader',
          },
          {
            Header: 'Department Representative',
            accessor: 'submission_department_representative',
            headerClassName: 'card-blue secondLevelHeader',
          },
          {
            Header: 'Project Name',
            accessor: 'submission_project_name',
            headerClassName: 'card-blue secondLevelHeader',
          },
          {
            Header: 'Reasoning',
            accessor: 'submission_reasoning',
            headerClassName: 'card-blue secondLevelHeader',
          },
          {
            Header: 'Co Contribution',
            accessor: 'submission_co_contributor',
            headerClassName: 'card-blue secondLevelHeader',
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
          },
          {
            Header: 'Decision Date',
            accessor: 'decisionDate2',
            headerClassName: 'card-green secondLevelHeader',
          },
          {
            Header: 'Agreement Signed',
            accessor: 'agreement_signed',
            headerClassName: 'card-green secondLevelHeader',
          },
          {
            Header: 'Learning',
            accessor: 'learning',
            headerClassName: 'card-green secondLevelHeader',
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
          },
          {
            Header: 'Submission Date',
            accessor: 'reportSubmissionDate',
            headerClassName: 'card-pink secondLevelHeader',
          },
          {
            Header: 'Status',
            accessor: 'reportStatus',
            headerClassName: 'card-pink secondLevelHeader',
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
          },
          {
            Header: 'Spent Amount',
            accessor: 'spentAmount',
            headerClassName: 'card-orange secondLevelHeader',
          },
          {
            Header: 'Remaining Funds',
            accessor: 'remainingFunds',
            headerClassName: 'card-orange secondLevelHeader',
          },
          {
            Header: 'Actions',
            id: 'actionsFinancials',
            Cell: ActionCell,
            headerClassName: 'card-orange secondLevelHeader',
          },
        ],
      },
    ],
    []
  )
  const emptyData = {
    id: '',
    grant_title: '',
    origination_url: '',
    max_fund_amount: '',
    funding_sought_amount: '',
    fund_originator: '',
    closingDate: '',
    decisionDate: '',
    determination: '',
    rationale: '',
  }
  const data = useMemo(() => {
    return grants.length > 0 ? grants : [emptyData]
  }, [grants])

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data })

  return (
    <div className='mt-2'>
      <div className='mb-2'>
        <button
          className='btn header-blue btn-sm me-2 '
          onClick={() => {
            document
              .querySelector('.grantFinding > *:first-child')
              .scrollIntoView({ behavior: 'smooth', block: 'nearest' })
          }}
        >
          Grant Found
        </button>
        <button
          className='btn  btn-sm me-2 card-purple'
          onClick={() => {
            document
              .querySelector('.suitabilityGrants > *:last-child')
              .scrollIntoView({ behavior: 'smooth', block: 'nearest' })
          }}
        >
          Suitability
        </button>
        <button
          className='btn card-blue btn-sm me-2'
          onClick={() => {
            document
              .querySelector('.grantSubmission > *:last-child')
              .scrollIntoView({ behavior: 'smooth', block: 'start' })
          }}
        >
          Submission
        </button>
        <button
          className='btn card-green btn-sm me-2'
          onClick={() => {
            document
              .querySelector('.submissionOutcome > *:last-child')
              .scrollIntoView({ behavior: 'smooth', block: 'nearest' })
          }}
        >
          Outcome
        </button>
        <button
          className='btn card-pink btn-sm me-2'
          onClick={() => {
            document
              .querySelector('.grantReporting > *:last-child')
              .scrollIntoView({ behavior: 'smooth', block: 'nearest' })
          }}
        >
          Reporting
        </button>
        <button
          className='btn card-orange btn-sm mr-2'
          onClick={() => {
            document
              .querySelector('.financials > *:last-child')
              .scrollIntoView({ behavior: 'smooth', block: 'nearest' })
          }}
        >
          Financials
        </button>
      </div>
      <div className='table-responsive scrollable'>
        <table
          {...getTableProps()}
          className='table table-center table-bordered table-hover datatable no-footer grantTable'
        >
          <thead className='thead-light'>
            {headerGroups.map((headerGroup) => (
              <tr
                {...headerGroup.getHeaderGroupProps()}
                className={headerGroup.headers[0].headerClassName}
              >
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps()}
                    className={column.headerClassName}
                    style={{ fontSize: '18px', textTransform: 'uppercase' }}
                    key={column.id}
                  >
                    {column.render('Header')}
                  </th>
                ))}
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
                      className={cell.column.parent.trClassName}
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
