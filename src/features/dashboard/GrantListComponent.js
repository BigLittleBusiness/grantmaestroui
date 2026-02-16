import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { fetchGrants } from 'features/grant/grantSlice'

const grantsClass = {
  'Opening Soon': 'open',
  'Closing Soon': 'close',
  // 'Upcoming Reporting': 'report due',
}

export default function GrantListComponent() {
  const [activeIndex, setActiveIndex] = useState(0)
  const grants = useSelector((state) => state.grant?.grants)
  const [grantsList, setGrantsList] = useState([])
  const dispatch = useDispatch()

  useEffect(() => {
    if (!grants.length) {
      dispatch(fetchGrants())
    }
  }, [dispatch, grants.length])

  useEffect(() => {
    const today = new Date()
    const twoWeeksFromNow = new Date()
    twoWeeksFromNow.setDate(today.getDate() + 14)
    const openingSoon = grants
      .filter((grant) => {
        const openingDate = new Date(grant.opening_date)
        return openingDate >= today && openingDate <= twoWeeksFromNow
      })
      .map((gr) => {
        return {
          name: gr?.grant_title,
          date: gr?.opening_date,
        }
      })
    const closingSoon = grants
      .filter((grant) => {
        const closingDate = new Date(grant.closingDate)
        return closingDate >= today && closingDate <= twoWeeksFromNow
      })
      .map((gr) => {
        return {
          name: gr?.grant_title,
          date: gr?.closingDate,
        }
      })
    setGrantsList({
      'Opening Soon': openingSoon,
      'Closing Soon': closingSoon,
    })
  }, [grants])

  const toggleCollapse = (index) => {
    setActiveIndex(activeIndex === index ? -1 : index)
  }

  return (
    <div className='col-xl-5 d-flex'>
      <div className='card super-admin-dash-card flex-fill'>
        <div className='card-header'>
          <div className='row align-center'>
            <div className='col'>
              <h5 className='card-title'>Grant List</h5>
            </div>
            <div className='col-auto'>
              <Link
                to='/grant-list'
                className='btn-right btn btn-sm btn-primary'
              >
                View All
              </Link>
            </div>
          </div>
        </div>
        <div className='card-body p-0'>
          <div className='accordion custom-accordion' id='custom-accordion-one'>
            {Object.entries(grantsList).map(([category, items], index) => (
              <div className='card mb-1' key={index}>
                <div className='card-header' id={`heading${index}`}>
                  <h6 className='accordion-faq m-0 position-relative'>
                    <Link
                      className='custom-accordion-title text-reset d-block no-underline'
                      onClick={() => toggleCollapse(index)}
                      aria-expanded={activeIndex === index ? 'true' : 'false'}
                      aria-controls={`collapse${index}`}
                    >
                      {category.replace(/([A-Z])/g, ' $1').trim()}
                      <span
                        className={`badge badge-${grantsClass[category]} ml-2`}
                      >
                        {grantsClass[category]}
                      </span>
                      <i
                        className={`fa fa-chevron-${
                          activeIndex === index ? 'up' : 'down'
                        } accordion-arrow`}
                        style={{ float: 'right' }}
                      ></i>
                    </Link>
                  </h6>
                </div>
                <div
                  id={`collapse${index}`}
                  className={`collapse ${activeIndex === index ? 'show' : ''}`}
                  aria-labelledby={`heading${index}`}
                  data-bs-parent='#custom-accordion-one'
                >
                  {items.map((item, idx) => (
                    <div className='dash-plane-list pt-2 pb-2' key={idx}>
                      <div className='plane-info'>
                        <div className='plane-name'>
                          <strong>{item.name}</strong>
                        </div>
                      </div>
                      <span className='plane-rate'>{item.date}</span>
                    </div>
                  ))}
                  <Link
                    to='/grant-list'
                    className='btn btn-link'
                    style={{ float: 'right' }}
                  >
                    Show More
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
