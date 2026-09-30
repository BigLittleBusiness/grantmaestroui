import React from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import CouncilCommandCentre from 'features/dashboard/CouncilCommandCentre'
import { isSuperAdmin } from 'utils/roleAccess'

export default function Dashboard() {
  const user = useSelector((state) => state.auth.user)
  // The platform admin has no organisation dashboard of their own.
  if (isSuperAdmin(user)) return <Navigate to='/admin/dashboard' replace />
  return <CouncilCommandCentre />
}
