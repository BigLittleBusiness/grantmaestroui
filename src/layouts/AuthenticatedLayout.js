import React, { useState } from 'react'
import { Toaster } from 'react-hot-toast'
import Header from '../components/Header'
import SideBar from 'components/SideBar'
import 'assets/css/authenticate.css'
import 'assets/css/feather/feather.css'
import 'layouts/AuthenticatedLayout.css'
import LoaderComponent from 'components/LoaderComponent'
import useCurrentUser from 'hooks/useCurrentUser'

const AuthenticatedLayout = ({ children }) => {
  const [isSidebarVisible, setSidebarVisible] = useState(true)
  // Wait for the user's role after a page refresh so the correct menu renders.
  const { loading } = useCurrentUser()

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible)
  }

  if (loading) {
    return <LoaderComponent />
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
          {children}
        </div>
      </main>
    </div>
  )
}

export default AuthenticatedLayout
