import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchGrants } from 'features/grant/grantSlice'
import { fetchTasks } from 'features/tasks/tasksSlice'
import CardsComponent from 'features/dashboard/CardsComponent'
import AdminGrantCard from 'features/dashboard/AdminGrantCard'
import AdminTeamCard from 'features/dashboard/AdminTeamCard'
import GrantCalendar from 'features/dashboard/GrantCalendar'
import GrantListComponent from 'features/dashboard/GrantListComponent'
import OutstandingTask from 'features/dashboard/OutstandingTask'
import GrantChartsCard from 'features/dashboard/GrantChartsCard'

// ---------------------------------------------------------------------------
// Dashboard — single source of truth for data fetching.
// All child widgets read from the Redux store via useSelector; they do NOT
// dispatch their own fetch calls.  This prevents 3–4 redundant API requests
// firing simultaneously on every dashboard load.
// ---------------------------------------------------------------------------
export default function Dashboard() {
  const dispatch = useDispatch()
  const grants = useSelector((state) => state.grant?.grants ?? [])
  const tasks  = useSelector((state) => state.tasks?.tasks  ?? [])

  useEffect(() => {
    // Only fetch if the store is empty (avoids re-fetching on tab switch)
    if (grants.length === 0) {
      dispatch(fetchGrants())
    }
  }, [dispatch, grants.length])

  useEffect(() => {
    if (tasks.length === 0) {
      dispatch(fetchTasks())
    }
  }, [dispatch, tasks.length])

  return (
    <div className='content container-fluid'>
      <CardsComponent />
      <div className='row'>
        <GrantChartsCard />
        <AdminGrantCard />
        <AdminTeamCard />
        <GrantCalendar />
        <GrantListComponent />
        <OutstandingTask />
      </div>
    </div>
  )
}
