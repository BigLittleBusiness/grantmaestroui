import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import GrantList from 'features/grant/GrantList'
import filterIcon from 'assets/img/icons/filter-icon.svg'
import { fetchGrants } from '../../features/grant/grantSlice'

// import 'react-date-range/dist/styles.css'; // main style file
// import 'react-date-range/dist/theme/default.css'; // theme css file
// import {Calendar} from 'react-date-range'
// import { addDays } from 'date-fns';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const GrantListPage = () => {
  const dispatch = useDispatch()
  const [isFilterVisible, setIsFilterVisible] = useState(false)
  const [grantTitle, setGrantTitle] = useState('')
  const [maxFundAmount, setMaxFundAmount] = useState(null)
  const [grantSoughtAmount, setGrantSoughtAmount] = useState(null)
  const [openingDateRang, setOpeningDateRange] = useState("");
  const [openingStartDate, setOpeningStartDate] = useState(new Date());
  const [openingEndDate, setOpeningEndDate] = useState(new Date());
  const [closingDateRang, setClosingDateRange] = useState("");
  const [closingStartDate, setClosingStartDate] = useState(new Date());
  const [closingEndDate, setClosingEndDate] = useState(new Date());
  // const [closingDate, setClosingDate] = useState('')
  const [grantStatus, setGrantStatus] = useState('')
  const [grantOutcome, setGrantOutcome] = useState('')

  // console.log(closingDate)
  console.log(grantStatus)

  const onChangeOpeningDate = (dates) =>{
    const [openingStartDate, openingEndDate] = dates
    setOpeningStartDate(openingStartDate)
    setOpeningEndDate(openingEndDate)
  }

  const onChangeClosingDate = (dates) =>{
    const [openingStartDate, openingEndDate] = dates
    setOpeningStartDate(openingStartDate)
    setOpeningEndDate(openingEndDate)
  }

  useEffect(()=>{
    if(openingStartDate && openingEndDate){
      setOpeningDateRange(`Selected opening date range: ${openingStartDate.toDateString()} - ${openingEndDate.toDateString()}`)
    } else if(openingStartDate){
      setOpeningDateRange(`Selected opening start date: ${openingStartDate.toDateString()}`)
    }else{
      setOpeningDateRange("")
    }
    if(closingStartDate && closingEndDate){
      setClosingDateRange(`Selected closing date range: ${closingStartDate.toDateString()} - ${closingEndDate.toDateString()}`)
    } else if(closingStartDate){
      setClosingDateRange(`Selected closing start date: ${closingStartDate.toDateString()}`)
    }else{
      setClosingDateRange("")
    }
  }, [openingStartDate, openingEndDate, closingStartDate, closingEndDate])

  const toggleFilterSection = () => {
    setIsFilterVisible(!isFilterVisible)
  }

  useEffect(() => {
    dispatch(fetchGrants({ }))
  }, [])

  const applyFilter = ()=>{
    if(grantTitle || maxFundAmount || grantSoughtAmount || openingStartDate || openingEndDate || closingStartDate || closingEndDate || grantStatus || grantOutcome){
      dispatch(fetchGrants({ grantTitle, maxFundAmount, grantSoughtAmount, openingStartDate, openingEndDate, closingStartDate, closingEndDate, grantStatus, grantOutcome}))
    }
  }

  const clearFilter = () => {
    setGrantTitle('')
    setMaxFundAmount(null)
    setGrantSoughtAmount(null)
    // setClosingDate('')
    setGrantStatus('')
    setGrantOutcome('')
  }

  return (
    <div className='content container-fluid grantList'>
      <div className='page-header mb-0'>
        <div className='content-page-header mb-0'>
          <h5>Grant Management</h5>
          <div className='list-btn' style={{ justifySelf: 'end' }}>
            <ul className='filter-list'>
              <li>
                <a
                  className='btn btn-filters w-auto'
                  id='filterToggle'
                  onClick={toggleFilterSection}
                >
                  <span className='me-2'>
                    <img src={filterIcon} alt='filter' />
                  </span>
                  Filter{' '}
                </a>
              </li>
              <li>
                <div
                  className='dropdown dropdown-action'
                  data-bs-toggle='tooltip'
                  data-bs-placement='bottom'
                  title='Download'
                >
                  <a
                    href='#'
                    className='btn-filters'
                    data-bs-toggle='dropdown'
                    aria-expanded='false'
                  >
                    <span>
                      <i className='fe fe-download'></i>
                    </span>
                  </a>
                  <div className='dropdown-menu dropdown-menu-end'>
                    <ul className='d-block'>
                      <li>
                        <a
                          className='d-flex align-items-center download-item'
                          href='#'
                          download
                        >
                          <i className='far fa-file-pdf me-2'></i>PDF
                        </a>
                      </li>
                      <li>
                        <a
                          className='d-flex align-items-center download-item'
                          href='#'
                          download
                        >
                          <i className='far fa-file-text me-2'></i>CSV
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </li>
              <li>
                <a
                  className='btn-filters'
                  href='#'
                  data-bs-toggle='tooltip'
                  data-bs-placement='bottom'
                  title='Print'
                >
                  <span>
                    <i className='fe fe-printer'></i>
                  </span>{' '}
                </a>
              </li>
              <li>
                <Link to='/grant/create' className='btn btn-primary'>
                  <i className='fa fa-plus-circle me-2' aria-hidden='true'></i>
                  Add New
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className='row'>
        <div className='col-sm-12'>
          <div className='card-table'>
            <div className='card-body'>
              {isFilterVisible && (
                <div
                  className='col-lg-12 filter-section mt-3'
                  id='filterSection'
                >
                  
                    <div className='row g-3'>
                      <div className='col-md-4'>
                        <label className='form-label'>Grant Title</label>
                        <input type='text' className='form-control' name='grant_title' onChange={(e) => setGrantTitle(e.target.value)} value={grantTitle}/>
                      </div>
                      <div className='col-md-4'>
                        <label htmlFor='max-funds' className='form-label'>
                          Max Funds
                        </label>
                        <input
                          type='number'
                          id='max-funds'
                          className='form-control'
                          placeholder='Enter amount'
                          onChange={(e) => setMaxFundAmount(e.target.value)}
                          value={maxFundAmount}
                        />
                      </div>
                      <div className='col-md-4'>
                        <label className='form-label'>Funding Sought</label>
                        <input type='number' className='form-control' onChange={(e) => setGrantSoughtAmount(e.target.value)} value={grantSoughtAmount}/>
                      </div>
                      <div className='col-md-6'>
                        <label className='form-label'>Opening date</label>
                        <p>{openingDateRang}</p>
                        <DatePicker 
                        selected={openingStartDate} 
                        onChange={onChangeOpeningDate} 
                        selectsStart
                        startDate={openingStartDate} 
                        endDate={openingEndDate}
                        selectsRange={true}
                        isClearable={true}
                        />
                      </div>
                      <div className='col-md-6'>
                        <label className='form-label'>Closing date</label>
                        <p>{closingDateRang}</p>
                        <DatePicker 
                        selected={closingStartDate} 
                        onChange={onChangeClosingDate} 
                        selectsStart
                        startDate={closingStartDate} 
                        endDate={closingEndDate}
                        selectsRange={true}
                        isClearable={true}
                        />
                      </div>
                      
                      <div className='col-md-4'>
                        <label className='form-label'>Status</label>
                        <input type='text' className='form-control' onChange={(e) => setGrantStatus(e.target.value)} value={grantStatus}/>
                      </div>
                      <div className='col-md-4'>
                        <label className='form-label'>Outcome</label>
                        <input type='text' className='form-control' onChange={(e) => setGrantOutcome(e.target.value)} value={grantOutcome}/>
                      </div>
                    </div>
                    <div className='filter-actions mt-3'>
                      <button type='reset' className='btn btn-secondary' onClick={clearFilter}>
                        Reset
                      </button>
                      <button type='submit' className='btn btn-primary' onClick={applyFilter}>
                        Apply Filters
                      </button>
                    </div>
                  
                </div>
              )}
              <GrantList grantTitle={grantTitle}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GrantListPage
