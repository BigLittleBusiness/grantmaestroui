import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { fetchEvents } from 'features/grant/grantSlice'

const localizer = momentLocalizer(moment)

export default function GrantCalendar() {
  const dispatch = useDispatch()
  const events = useSelector((state) => state.grant.events)
  useEffect(() => {
    if (!events.length) {
      dispatch(fetchEvents())
    }
  }, [dispatch, events.length])
  return (
    <div className='col-xl-7 d-flex'>
      <div className='card flex-fill'>
        <div className='card-header'>
          <div className='d-flex justify-content-between align-items-center'>
            <h5 className='card-title'>Calendar</h5>
          </div>
        </div>
        <div className='card-body'>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor='start'
            endAccessor='end'
            style={{ height: 500 }}
          />
        </div>
      </div>
    </div>
  )
}
