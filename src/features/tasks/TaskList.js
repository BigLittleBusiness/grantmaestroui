import React, { useEffect, useMemo, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTable, useSortBy, usePagination, useFilters } from 'react-table'
import { fetchTasks, setSelectedTask, deleteTask } from './tasksSlice'
import ErrorBoundary from '../../components/ErrorBoundary'
import './task.css'
import { useNavigate } from 'react-router-dom'

const TaskList = ({ filterData }) => {
  const tasks = useSelector((state) => state.tasks.tasks)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState(null)

  useEffect(() => {
    if (!tasks.length) {
      dispatch(fetchTasks())
    }
  }, [dispatch, tasks.length])

  const data = useMemo(() => {
    if (!tasks.length) {
      return [
        {
          id: '',
        },
      ]
    }

    return tasks.filter((task) => {
      let matchesGrant = true
      let matchedTeamMember = true
      let matchesStatus = true
      if (filterData.grant_id) {
        matchesGrant =
          task.grant_id.toString() === filterData.grant_id.toString()
      }
      if (filterData.teamMember_id) {
        matchedTeamMember =
          task.task_assigned_to_id.toString() ===
          filterData.teamMember_id.toString()
      }
      if (filterData.status) {
        matchesStatus = task.status.toString() === filterData.status.toString()
      }

      return matchesGrant && matchedTeamMember && matchesStatus
    })
  }, [tasks, filterData])

  const columns = useMemo(
    () => [
      {
        Header: 'Grant',
        accessor: 'grant',
        Cell: ({ value }) => (
          <span
            className='grant-link'
            onClick={() => navigate(`/grant/${value}`, { replace: true })}
          >
            {value}
          </span>
        ),
      },
      {
        Header: 'Assigned To',
        accessor: 'assignedTo',
      },
      {
        Header: 'Status',
        accessor: 'status',
        Cell: ({ value }) => (
          <span
            className={`badge ${
              value === 'Completed'
                ? 'bg-success'
                : value === 'Outstanding'
                ? 'bg-danger'
                : 'bg-warning'
            }`}
          >
            {value}
          </span>
        ),
      },
      {
        Header: 'Description',
        accessor: 'description',
      },
      {
        Header: 'Actions',
        accessor: 'actions',
        Cell: ({ row }) => (
          <div>
            <button
              onClick={() => navigate(`/edit-task/${row.original.id}`)}
              className='btn btn-sm btn-primary me-2'
            >
              <i className='fa fa-edit'></i>
            </button>
            <button
              onClick={() => handleDeleteClick(row.original.id)}
              className='btn btn-sm btn-danger me-2'
            >
              <i className='fa fa-trash'></i>
            </button>
            <button
              onClick={() => navigate(`/view-task/${row.original.id}`)}
              className='btn btn-sm btn-info'
            >
              <i className='fa fa-eye'></i>
            </button>
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

  const handleTaskClick = (task) => {
    dispatch(setSelectedTask(task))
  }

  const handleDeleteClick = (taskId) => {
    console.log('Delete task with ID:', taskId)
    dispatch(deleteTask(taskId))
    // setTaskToDelete(taskId)
    // setShowDeleteModal(true)
  }

  // const confirmDelete = () => {
  //   if (taskToDelete) {
  //     dispatch(deleteTask(taskToDelete))
  //     setShowDeleteModal(false)
  //     setTaskToDelete(null)
  //   }
  // }

  // const cancelDelete = () => {
  //   setShowDeleteModal(false)
  //   setTaskToDelete(null)
  // }

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
      {/* {showDeleteModal && (
        <>
          <div className='modal fade show'></div>
          <div className='modal-content'>
            <p>Are you sure you want to delete this task?</p>
            <button onClick={confirmDelete} className='btn btn-danger'>
              Confirm
            </button>
            <button onClick={cancelDelete} className='btn btn-secondary'>
              Cancel
            </button>
          </div>
        </>
      )} */}
      <div className='col-sm-12'>
        <div className='card-table'>
          <div className='card-body'>
            <div class='table-responsive'>
              <table
                {...getTableProps()}
                className='table task-table table-striped table-hover datatable task-table'
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
                        onClick={() => handleTaskClick(row.original)}
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

export default TaskList
