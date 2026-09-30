import React, { useState } from 'react'
import Header from '../components/Header'
import SideBar from 'components/SideBar'
import 'assets/css/authenticate.css'
import 'assets/css/feather/feather.css'
import 'layouts/AuthenticatedLayout.css'
import { Navigate, useLocation } from 'react-router-dom'
import LoaderComponent from 'components/LoaderComponent'
import useCurrentUser from 'hooks/useCurrentUser'
import { canAccessPage, homePathFor } from 'utils/roleAccess'

/**
 * Layout for role-restricted pages: platform admin pages (/admin/*) and
 * organisation admin pages. Waits for the user's role before rendering, so a
 * page refresh never shows another role's screens.
 */
const AdminAuthenticatedLayout = ({ children }) => {
  const [isSidebarVisible, setSidebarVisible] = useState(true)
  const { pathname } = useLocation()
  const { user, loading } = useCurrentUser()

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible)
  }
  if (loading) {
    return <LoaderComponent />
  }
  if (user && !canAccessPage(user, pathname)) {
    return <Navigate to={homePathFor(user)} replace />
  }
  return (
    <div className='main-wrapper'>
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
          {children}
        </div>
      </main>
    </div>
  )
}

export default AdminAuthenticatedLayout
