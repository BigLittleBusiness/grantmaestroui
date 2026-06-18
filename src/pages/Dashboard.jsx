import React from 'react'
import CardsComponent from 'features/dashboard/CardsComponent'
import AdminGrantCard from 'features/dashboard/AdminGrantCard'
import AdminTeamCard from 'features/dashboard/AdminTeamCard'
import GrantCalendar from 'features/dashboard/GrantCalendar'
import GrantListComponent from 'features/dashboard/GrantListComponent'
import OutstandingTask from 'features/dashboard/OutstandingTask'
import GrantChartsCard from 'features/dashboard/GrantChartsCard'

export default function Dashboard() {
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
