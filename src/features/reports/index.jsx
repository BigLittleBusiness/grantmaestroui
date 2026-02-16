import React, { useMemo } from 'react'
import { useTable, useSortBy, usePagination, useFilters } from 'react-table'

const GrantAppliedFor = ({ appliedGrants }) => {
  const columns = useMemo(
    () => [
      {
        Header: 'Grant Title',
        accessor: 'grant_title',
      },
      {
        Header: 'Grant URL',
        accessor: 'origination_url',
      },
      {
        Header: 'Opening Date',
        accessor: 'opening_date',
      },
      {
        Header: 'Funding Sought',
        accessor: 'funding_sought_amount',
      },
      {
        Header: 'Outcome Status',
        accessor: 'outcome',
        Cell: ({ value }) => {
          let color = 'black'
          if (value?.toLowerCase() === 'won') color = 'green'
          else if (value?.toLowerCase() === 'lost') color = 'red'
          else if (value?.toLowerCase() === 'declined') color = 'orange'
          else {
            color = 'transparent'
            value = ''
          }
          return (
            <span style={{ background: color, padding: '5px' }}>
              {value ? value : ''}
            </span>
          )
        },
      },
      {
        Header: 'Closing Date',
        accessor: 'closingDate',
      },
    ],
    []
  )

  // Initialize the table instance
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
      data: appliedGrants, // Use the grants data from Redux
      initialState: { pageIndex: 0 },
    },
    useFilters,
    useSortBy,
    usePagination
  )

  // Helper function to get the page range for pagination
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
    <div className='col-sm-12'>
      <div className='card-table mt-2'>
        <div className='card-body'>Grants Applied For:</div>
      </div>
      <div className='card-table'>
        <div className='card-body'>
          {/* Table */}
          <div id='1' className='tabcontent'>
            <table
              {...getTableProps()}
              className='table table-striped table-hover datatable team-member-table'
            >
              <thead>
                {headerGroups.map((headerGroup) => (
                  <tr
                    {...headerGroup.getHeaderGroupProps()}
                    key={headerGroup.id}
                  >
                    {headerGroup.headers.map((column) => (
                      <th
                        {...column.getHeaderProps(
                          column.getSortByToggleProps()
                        )}
                        key={column.id}
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
                    <tr {...row.getRowProps()} key={row.id}>
                      {row.cells.map((cell) => (
                        <td key={cell.column.id} {...cell.getCellProps()}>
                          {cell.render('Cell')}
                        </td>
                      ))}
                    </tr>
                  )
                })}
              </tbody>
            </table>

            {/* Pagination */}
            <nav aria-label='Page navigation example'>
              <ul className='pagination justify-content-end'>
                <li
                  className={`page-item ${!canPreviousPage ? 'disabled' : ''}`}
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
                    {[10, 20, 30, 40, 50].map((size) => (
                      <option key={size} value={size}>
                        Show {size}
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
  )
}

export default GrantAppliedFor
