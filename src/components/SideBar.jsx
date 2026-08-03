import React, { useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../features/auth/authSlice'
import './SideBar.css'

const SideBar = ({ isSidebarVisible, setSidebarVisible }) => {
  const location = useLocation()
  const loggedInUser = useSelector((state) => state.auth?.user)
  const roleId = loggedInUser?.user_role_id
  const isSuperAdmin = roleId === 2          // Platform operator — Sys Admin only
  const isOrgAdmin   = roleId === 1          // Organisation / Team Admin
  const activeTab = location.pathname
  const sidebarRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setSidebarVisible(false)
      }
    }
    const mediaQuery = window.matchMedia('(max-width: 1024px)')
    if (mediaQuery.matches) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [setSidebarVisible])

  const dispatch = useDispatch()
  const handleLogout = () => {
    dispatch(logout())
  }

  // ─── Super Admin: platform management only ───────────────────────────────
  if (isSuperAdmin) {
    return (
      <div
        ref={sidebarRef}
        className={`sidebar ${isSidebarVisible ? 'sidebar-visible' : 'sidebar-hidden'}`}
        id='sidebar'
      >
        <div className='sidebar-inner slimscroll'>
          <div id='sidebar-menu' className='sidebar-menu'>
            <ul className='sidebar-vertical'>
              <li className='menu-title'><span>PLATFORM MANAGEMENT</span></li>

              <li>
                <Link to='/admin/dashboard' className={`${activeTab === '/admin/dashboard' ? 'active' : ''}`}>
                  <i className='fe fe-bar-chart-2'></i> <span>Platform Overview</span>
                  <span className='menu-arrow'></span>
                </Link>
              </li>

              <li className='menu-title'><span>SUBSCRIPTIONS</span></li>

              <li>
                <Link to='/admin/subscription-plans' className={`${activeTab === '/admin/subscription-plans' ? 'active' : ''}`}>
                  <i className='fa fa-tags'></i> <span>Subscription Plans</span>
                  <span className='menu-arrow'></span>
                </Link>
              </li>
              <li>
                <Link to='/admin/promo-codes' className={`${activeTab === '/admin/promo-codes' ? 'active' : ''}`}>
                  <i className='fa fa-ticket'></i> <span>Promo Codes</span>
                  <span className='menu-arrow'></span>
                </Link>
              </li>

              <li className='menu-title'><span>PLATFORM SETTINGS</span></li>

              <li>
                <Link to='/admin/payment-settings' className={`${activeTab === '/admin/payment-settings' ? 'active' : ''}`}>
                  <i className='fe fe-credit-card'></i> <span>Payment Settings</span>
                  <span className='menu-arrow'></span>
                </Link>
              </li>
              <li>
                <Link to='/admin/email-settings' className={`${activeTab === '/admin/email-settings' ? 'active' : ''}`}>
                  <i className='fa fa-envelope'></i> <span>Email Settings</span>
                  <span className='menu-arrow'></span>
                </Link>
              </li>

              <li>
                <Link
                  onClick={handleLogout}
                  to='/#'
                  className={`sidebar-logout-btn ${activeTab === '/logout' ? 'active' : ''}`}
                >
                  <i className='fe fe-power'></i> <span>Logout</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    )
  }

  // ─── Org Admin / Team Member: tenant-level items ─────────────────────────
  return (
    <div
      ref={sidebarRef}
      className={`sidebar ${isSidebarVisible ? 'sidebar-visible' : 'sidebar-hidden'}`}
      id='sidebar'
    >
      <div className='sidebar-inner slimscroll'>
        <div id='sidebar-menu' className='sidebar-menu'>
          <ul className='sidebar-vertical'>
            <li className='menu-title'><span>GENERAL</span></li>
            <li>
              <Link to='/dashboard' className={`${activeTab === '/dashboard' ? 'active' : ''}`}>
                <i className='fe fe-home'></i> <span>Dashboard</span>
                <span className='menu-arrow'></span>
              </Link>
            </li>

            <li className='menu-title'><span>MANAGEMENT</span></li>
            <li>
              <Link to='/grant' className={`${activeTab === '/grant' ? 'active' : ''}`}>
                <i className='fe fe-list'></i> <span>Grant List</span>
                <span className='menu-arrow'></span>
              </Link>
            </li>
            {isOrgAdmin && (
              <li>
                <Link
                  to='/team-members'
                  className={`${
                    activeTab === '/team-members' || activeTab.startsWith('/view-team-member')
                      ? 'active' : ''
                  }`}
                >
                  <i className='fe fe-users'></i> <span>Team</span>
                  <span className='menu-arrow'></span>
                </Link>
              </li>
            )}
            <li>
              <Link to='/tasks' className={`${activeTab === '/tasks' ? 'active' : ''}`}>
                <i className='fa fa-tasks'></i> <span>Tasks</span>
                <span className='menu-arrow'></span>
              </Link>
            </li>
            <li>
              <Link to='/reports' className={`${activeTab === '/reports' ? 'active' : ''}`}>
                <i className='fe fe-box'></i> <span>Reports</span>
                <span className='menu-arrow'></span>
              </Link>
            </li>

            <li className='menu-title'><span>SETTINGS</span></li>
            <li>
              <Link to='/settings' className={`${activeTab === '/settings' ? 'active' : ''}`}>
                <i className='fe fe-settings'></i> <span>Settings</span>
                <span className='menu-arrow'></span>
              </Link>
            </li>
            <li>
              <Link to='/manage-payment' className={`${activeTab === '/manage-payment' ? 'active' : ''}`}>
                <i className='fe fe-dollar-sign'></i> <span>Payment</span>
                <span className='menu-arrow'></span>
              </Link>
            </li>

            <li>
              <Link
                onClick={handleLogout}
                to='/#'
                className={`sidebar-logout-btn ${activeTab === '/logout' ? 'active' : ''}`}
              >
                <i className='fe fe-power'></i> <span>Logout</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default SideBar
