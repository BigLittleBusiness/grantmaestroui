import React, { useState } from 'react'
import { Toaster } from 'react-hot-toast'
import { Navigate, useLocation } from 'react-router-dom'
import Header from '../components/Header'
import SideBar from 'components/SideBar'
import TrialBanner from 'components/TrialBanner'
import LoaderComponent from 'components/LoaderComponent'
import useCurrentUser from 'hooks/useCurrentUser'
import { canAccessPage, homePathFor, subscriptionRedirectFor } from 'utils/roleAccess'
import 'assets/css/authenticate.css'
import 'assets/css/feather/feather.css'
import 'layouts/AuthenticatedLayout.css'

/**
 * Layout for signed-in pages. Waits for the user's role after a page refresh
 * so another role's screens are never shown, sends an Organisation Admin whose
 * subscription has ended to checkout, and, when `restricted`, applies the
 * per-page role rules in utils/roleAccess.js.
 */
const AuthenticatedLayout = ({ children, restricted = false }) => {
  const [isSidebarVisible, setSidebarVisible] = useState(true)
  const { pathname } = useLocation()
  const { user, loading } = useCurrentUser()

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible)
  }

  if (loading) {
    return <LoaderComponent />
  }

  const subscriptionRedirect = subscriptionRedirectFor(user, pathname)
  if (subscriptionRedirect) {
    return <Navigate to={subscriptionRedirect} replace />
  }
  if (restricted && user && !canAccessPage(user, pathname)) {
    return <Navigate to={homePathFor(user)} replace />
  }

  return (
    <div className='main-wrapper'>
      <Toaster />
      <Header toggleSidebar={toggleSidebar} />
      <SideBar
        isSidebarVisible={isSidebarVisible}
        setSidebarVisible={setSidebarVisible}
      />
      <main>
        <div
          className={`page-wrapper main-content ${
            isSidebarVisible ? '' : 'main-content-expand'
          }`}
        >
          <TrialBanner user={user} />
          {children}
        </div>
      </main>
    </div>
  )
}

export default AuthenticatedLayout
