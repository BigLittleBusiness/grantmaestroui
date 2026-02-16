import React, { useState, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import Header from '../components/Header'
import SideBar from 'components/SideBar'
import 'assets/css/authenticate.css'
import 'assets/css/feather/feather.css'
import 'layouts/AuthenticatedLayout.css'
import { useNavigate } from 'react-router-dom'
import LoaderComponent from 'components/LoaderComponent'

const AdminAuthenticatedLayout = ({ children }) => {
  const [isSidebarVisible, setSidebarVisible] = useState(true)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const loggedInUser = useSelector((state) => state.auth?.user)
  const isAdmin = useMemo(
    () => loggedInUser?.user_role_id === 2,
    [loggedInUser]
  )
  useEffect(() => {
    if (loggedInUser !== undefined) {
      setLoading(false)
    }
  }, [loggedInUser])

  useEffect(() => {
    if (loggedInUser && !isAdmin) {
      navigate('/dashboard')
    }
  }, [loggedInUser, isAdmin, navigate])

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible)
  }
  if (loading && !loggedInUser) {
    return <LoaderComponent />
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
