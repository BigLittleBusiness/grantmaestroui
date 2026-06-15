import React from 'react'
import { Navigate } from 'react-router-dom'
import { Route, Routes } from 'react-router-dom'
import TaskListPage from 'pages/Tasks/TaskListPage'
import TaskAddPage from 'pages/Tasks/TaskAddPage'
import TaskEditPage from 'pages/Tasks/TaskEditPage'
import TaskViewPage from 'pages/Tasks/TaskViewPage'
import TeamMemberListPage from 'pages/TeamMember/TeamMemberListPage'
import TeamMemberAddPage from 'pages/TeamMember/TeamMemberAddPage'
import TeamMemberEditPage from 'pages/TeamMember/TeamMemberEditPage'
import AuthenticatedLayout from 'layouts/AuthenticatedLayout'
import AdminAuthenticatedLayout from 'layouts/AdminAuthenticatedLayout'
import PrivateRoute from './PrivateRoute'
import Dashboard from 'pages/Dashboard'
import ProfilePage from 'pages/Auth/ProfilePage'
import GrantListPage from 'pages/Grant/GrantListPage'
import GrantCreatePage from 'pages/Grant/GrantCreatePage'
import GrantEditPage from 'pages/Grant/GrantEditPage'
import GrantDetailPage from 'pages/Grant/GrantDetailPage'
import ReportPage from 'pages/ReportPage'
import SettingsPage from 'pages/Settings/SettingsPage'
import ManagePaymentPage from 'pages/Settings/ManagePaymentPage'
import PinPaymentsSettingsPage from 'pages/Settings/PinPaymentsSettingsPage'
import SubmitTicketPage from 'pages/Settings/SubmitTicketPage'
import UpdateTicketPage from 'pages/Settings/UpdateTicketPage'
import TicketListPage from 'pages/Settings/TicketListPage'
import useAuth from 'hooks/useAuth'
import PrivacySettingPage from 'pages/Settings/PrivacySettingPage'
import SeatUsagePage from 'pages/Settings/SeatUsagePage'
import PaymentSuccess from 'pages/Settings/PaymentSuccess'
import PaymentCancel from 'pages/Settings/PaymentCancel'
import PaymentCheckoutPage from 'pages/Settings/PaymentCheckoutPage'
import ChangePassword from 'features/auth/ChangePassword'

const ProtectedRoutes = () => {
  const { authenticated, loading } = useAuth()

  if (loading) {
    return <div>Loading...</div> // or a spinner
  }

  if (!authenticated) {
    return <Navigate to='/login' replace />
  }
  return (
    <Routes>
      <Route
        path='/dashboard'
        element={
          <PrivateRoute>
            <AuthenticatedLayout>
              <Dashboard />
            </AuthenticatedLayout>
          </PrivateRoute>
        }
      />
      <Route
        path='/profile'
        element={
          <AuthenticatedLayout>
            <ProfilePage />
          </AuthenticatedLayout>
        }
      />
      <Route
        path='/tasks'
        element={
          <AuthenticatedLayout>
            <TaskListPage />
          </AuthenticatedLayout>
        }
      />
      <Route
        path='/add-task'
        element={
          <AuthenticatedLayout>
            <TaskAddPage />
          </AuthenticatedLayout>
        }
      />
      <Route
        path='/edit-task/:task_id'
        element={
          <AuthenticatedLayout>
            <TaskEditPage />
          </AuthenticatedLayout>
        }
      />
      <Route
        path='/view-task/:task_id'
        element={
          <AuthenticatedLayout>
            <TaskViewPage />
          </AuthenticatedLayout>
        }
      />
      <Route
        path='/team-members'
        element={
          <AdminAuthenticatedLayout>
            <TeamMemberListPage />
          </AdminAuthenticatedLayout>
        }
      />
      <Route
        path='/add-team-member'
        element={
          <AdminAuthenticatedLayout>
            <TeamMemberAddPage />
          </AdminAuthenticatedLayout>
        }
      />
      <Route
        path='/edit-team-member/:user_id'
        element={
          <AdminAuthenticatedLayout>
            <TeamMemberEditPage />
          </AdminAuthenticatedLayout>
        }
      />
      <Route
        path='/grant'
        element={
          <AuthenticatedLayout>
            <GrantListPage />
          </AuthenticatedLayout>
        }
      />
      <Route
        path='/grant/create'
        element={
          <AuthenticatedLayout>
            <GrantCreatePage />
          </AuthenticatedLayout>
        }
      />
      <Route
        path='/grant/edit/:id'
        element={
          <AuthenticatedLayout>
            <GrantEditPage />
          </AuthenticatedLayout>
        }
      />
      <Route
        path='/grant/details/:id'
        element={
          <AuthenticatedLayout>
            <GrantDetailPage />
          </AuthenticatedLayout>
        }
      />
      <Route
        path='/reports'
        element={
          <AdminAuthenticatedLayout>
            <ReportPage />
          </AdminAuthenticatedLayout>
        }
      />
      <Route
        path='/settings'
        element={
          <AdminAuthenticatedLayout>
            <SettingsPage />
          </AdminAuthenticatedLayout>
        }
      />
      <Route
        path='/manage-payment'
        element={
          <AdminAuthenticatedLayout>
            <ManagePaymentPage />
          </AdminAuthenticatedLayout>
        }
      />
      <Route
        path='/admin/pin-settings'
        element={
          <AdminAuthenticatedLayout>
            <PinPaymentsSettingsPage />
          </AdminAuthenticatedLayout>
        }
      />
      <Route
        path='/payment/checkout'
        element={
          <AdminAuthenticatedLayout>
            <PaymentCheckoutPage />
          </AdminAuthenticatedLayout>
        }
      />
      <Route
        path='/tickets'
        element={
          <AdminAuthenticatedLayout>
            <TicketListPage />
          </AdminAuthenticatedLayout>
        }
      />
      <Route
        path='/submit-ticket'
        element={
          <AdminAuthenticatedLayout>
            <SubmitTicketPage />
          </AdminAuthenticatedLayout>
        }
      />
      <Route
        path='/update-ticket/:ticket_id'
        element={
          <AdminAuthenticatedLayout>
            <UpdateTicketPage />
          </AdminAuthenticatedLayout>
        }
      />
      <Route
        path='/privacy-setting'
        element={
          <AdminAuthenticatedLayout>
            <PrivacySettingPage />
          </AdminAuthenticatedLayout>
        }
      />
      <Route
        path='/seat-usage'
        element={
          <AdminAuthenticatedLayout>
            <SeatUsagePage />
          </AdminAuthenticatedLayout>
        }
      />
      <Route
        path='/success'
        element={
          <AdminAuthenticatedLayout>
            <PaymentSuccess />
          </AdminAuthenticatedLayout>
        }
      />
      <Route
        path='/cancel'
        element={
          <AdminAuthenticatedLayout>
            <PaymentCancel />
          </AdminAuthenticatedLayout>
        }
      />
      <Route
        path='/change-password'
        element={
          <AdminAuthenticatedLayout>
            <ChangePassword />
          </AdminAuthenticatedLayout>
        }
      />
    </Routes>
  )
}

export default ProtectedRoutes
