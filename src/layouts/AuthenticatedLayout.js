import React, { useState } from 'react'
import { Toaster } from 'react-hot-toast'
import Header from '../components/Header'
import SideBar from 'components/SideBar'
import 'assets/css/authenticate.css'
import 'assets/css/feather/feather.css'
import 'layouts/AuthenticatedLayout.css'

const AuthenticatedLayout = ({ children }) => {
  const [isSidebarVisible, setSidebarVisible] = useState(true)

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible)
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
