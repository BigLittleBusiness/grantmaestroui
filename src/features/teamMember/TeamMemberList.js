import React, { useEffect, useMemo, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTable, useSortBy, usePagination, useFilters } from 'react-table'
import {
  fetchTeamMembers,
  setSelectedTeamMember,
  filterTeamMembers,
  deleteTeamMember
} from './teamMemberSlice'
import { createCheckoutSession } from '../settings/settingsSlice'
import { useNavigate } from 'react-router-dom'
import ErrorBoundary from '../../components/ErrorBoundary'
import './teamMember.css'

const TeamMemberList = () => {
  const teamMembers = useSelector((state) => state.teamMember.teamMembers)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('All')

  useEffect(() => {
    dispatch(fetchTeamMembers())
  }, [])

  const data = useMemo(() => teamMembers, [teamMembers])

  const columns = useMemo(
    () => [
      {
        Header: 'Full Name',
        accessor: 'full_name',
      },
      {
        Header: 'Email',
        accessor: 'email',
      },
      {
        Header: 'Role',
        accessor: 'user_type',
      },
      {
        Header: 'Location',
        accessor: 'address',
      },
      {
        Header: 'Position',
        accessor: 'position_text',
      },
      {
        Header: 'Status',
        accessor: 'subscription_status_display_text',
      },
      {
        Header: 'Actions',
        accessor: 'actions',
        Cell: ({ row }) => (
          <div>
            {row.original.subscription_status === false && (
              <button
                onClick={() => makePayment(row.original.user_id, row.original.preferred_subscription_plan_id)}
                className='btn btn-sm btn-success me-2'
              >
                <i className='fa fa-check'></i>
              </button>
            )}
            <button
              onClick={() =>
                navigate(`/edit-team-member/${row.original.user_id}`)
              }
              className='btn btn-sm btn-warning me-2'
            >
              <i className='fa fa-edit'></i>
            </button>
            {row.original.user_role_id !== 2 && (
              <button
                onClick={() => handleDelete(row.original.user_id)}
                className='btn btn-sm btn-danger'
              >
                <i className='fa fa-trash'></i>
              </button>
            )}
            
          </div>
        ),
      },
    ],
    [navigate]
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    nextPage,
    previousPage,
    setPageSize,
    gotoPage,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
    },
    useFilters,
    useSortBy,
    usePagination
  )

  const handleTeamRoleClick = (role) => {
    setActiveTab(role)
    dispatch(filterTeamMembers(role))
  }

  const handleTeamMemberClick = (teamMember) => {
    dispatch(setSelectedTeamMember(teamMember))
  }

  const handleDelete = (teamMemberId) => {
    console.log('Delete member with ID:', teamMemberId)
    dispatch(deleteTeamMember(teamMemberId))
    // Handle delete action
  }

  const makePayment = (teamMemberId, preferredPlanId) => {
    console.log('Make payment for user with ID:', preferredPlanId)
    dispatch(createCheckoutSession({'stripe_plan_id' : preferredPlanId, 'preferred_plan_id' : preferredPlanId , 'payment_made_for':teamMemberId}))
  }

  const getPageRange = (current, total) => {
    const range = []
    const maxPagesToShow = 4
    const start = Math.max(0, current - Math.floor(maxPagesToShow / 2))
    const end = Math.min(total, start + maxPagesToShow)
    for (let i = start; i < end; i++) {
      range.push(i)
    }
    return range
  }

  return (
    <ErrorBoundary>
      <div className='col-sm-12'>
        <div className='card-table'>
          <div className='card-body'>
            <div className='tab'>
              <button
                className={`tablinks ${activeTab === 'All' ? 'active' : ''}`}
                onClick={() => handleTeamRoleClick('all')}
              >
                All
              </button>
              <button
                className={`tablinks ${
                  activeTab === 'Administrator' ? 'active' : ''
                }`}
                onClick={() => handleTeamRoleClick('admin')}
              >
                Administrator
              </button>
              <button
                className={`tablinks ${
                  activeTab === 'Team Member' ? 'active' : ''
                }`}
                onClick={() => handleTeamRoleClick('team_member')}
              >
                Team Member
              </button>
            </div>
            <div id='1' className='tabcontent'>
              <table
                {...getTableProps()}
                className='table table-striped table-hover datatable team-member-table'
              >
                <thead>
                  {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column, index) => (
                        <th
                          {...column.getHeaderProps(
                            column.getSortByToggleProps()
                          )}
                          key={index}
                        >
                          {column.render('Header')}
                          <span>
                            {column.isSorted
                              ? column.isSortedDesc
                                ? ' 🔽'
                                : ' 🔼'
                              : ' ⬍'}
                          </span>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                  {page.map((row) => {
                    prepareRow(row)
                    return (
                      <tr
                        {...row.getRowProps()}
                        onClick={() => handleTeamMemberClick(row.original)}
                      >
                        {row.cells.map((cell, index) => (
                          <td key={index} {...cell.getCellProps()}>
                            {cell.render('Cell')}
                          </td>
                        ))}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              <nav aria-label='Page navigation example'>
                <ul className='pagination justify-content-end'>
                  <li
                    className={`page-item ${
                      !canPreviousPage ? 'disabled' : ''
                    }`}
                  >
                    <button
                      className='page-link'
                      onClick={() => previousPage()}
                      disabled={!canPreviousPage}
                    >
                      Previous
                    </button>
                  </li>
                  {getPageRange(pageIndex, pageOptions.length).map(
                    (pageNumber) => (
                      <li
                        key={pageNumber}
                        className={`page-item ${
                          pageNumber === pageIndex ? 'active' : ''
                        }`}
                      >
                        <button
                          className='page-link'
                          onClick={() => gotoPage(pageNumber)}
                        >
                          {pageNumber + 1}
                        </button>
                      </li>
                    )
                  )}
                  <li className={`page-item ${!canNextPage ? 'disabled' : ''}`}>
                    <button
                      className='page-link'
                      onClick={() => nextPage()}
                      disabled={!canNextPage}
                    >
                      Next
                    </button>
                  </li>
                  <li className='page-item'>
                    <select
                      className='form-select'
                      value={pageSize}
                      onChange={(e) => setPageSize(Number(e.target.value))}
                    >
                      {[10, 20, 30, 40, 50].map((pageSize) => (
                        <option key={pageSize} value={pageSize}>
                          Show {pageSize}
                        </option>
                      ))}
                    </select>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}

export default TeamMemberList
