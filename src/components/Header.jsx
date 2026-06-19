import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import logo from 'assets/img/logos/logo.png'
import logoSmall from 'assets/img/logos/logo-small.jpeg'
import ProfileImage from 'assets/img/avatar-07.jpg'
import { logout, viewProfile } from 'features/auth/authSlice'
import './Header.css'
import GlobalSearch from './GlobalSearch'

const Header = ({ toggleSidebar }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const user = useSelector((state) => state.auth.user)
  const hasImage = user?.profile_image
  useEffect(() => {
    if (!user) {
      dispatch(viewProfile())
    }
  }, [])

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen)
  }

  const handleLogout = async () => {
    await dispatch(logout()).then((action) => {
      if (action.type === 'auth/logout/fulfilled') {
        navigate('/login')
      }
    })
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isUserMenuOpen &&
        !event.target.closest('.user-menu') &&
        !event.target.closest('.user-link')
      ) {
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isUserMenuOpen])

  return (
    <div className='header header-one'>
      <Link
        to='/'
        className='d-inline-flex d-sm-inline-flex align-items-center d-md-inline-flex d-lg-none align-items-center device-logo'
      >
        <img
          src={logo}
          className='img-fluid logo2'
          alt='Logo'
          style={{ width: '150px' }}
        />
      </Link>
      <div className='main-logo d-inline float-start d-lg-flex align-items-center d-none d-sm-none d-md-none'>
        <div className='logo-white'>
          <Link to='/'>
            <img
              src={logo}
              className='img-fluid logo-blue'
              alt='Logo'
              style={{ width: '150px' }}
            />
          </Link>
          <Link to='#'>
            <img src={logo} className='img-fluid logo-small' alt='Logo' />
          </Link>
        </div>
        <div className='logo-color'>
          <Link to='#'>
            <img
              src={logo}
              className='img-fluid logo-blue'
              alt='Logo'
              style={{ width: '150px' }}
            />
          </Link>
          <Link to='#'>
            <img src={logoSmall} className='img-fluid logo-small' alt='Logo' />
          </Link>
        </div>
      </div>
      <button
        className='mobile_btn toggle_btn_header btn btn-link'
        id='mobile_btn'
        onClick={toggleSidebar}
      >
        <i className='fa fa-bars'></i>
      </button>

      {/* Global search bar — sits between the hamburger and user avatar */}
      <GlobalSearch />

      <ul className='nav nav-tabs user-menu'>
        <li className='nav-item dropdown'>
          <button
            className='user-link nav-link btn btn-link'
            onClick={toggleUserMenu}
          >
            <span className='user-img'>
              <img
                src={hasImage ? hasImage : ProfileImage}
                alt='img'
                className='profilesidebar'
              />
              <span className='animate-circle'></span>
            </span>
          </button>
          {isUserMenuOpen && (
            <div className='dropdown-menu menu-drop-user show profile-menu'>
              <div className='profilemenu'>
                <div className='subscription-menu'>
                  <ul>
                    <li>
                      <Link className='dropdown-item' to='/profile'>
                        Profile
                      </Link>
                    </li>
                    <li>
                      <Link className='dropdown-item' to='/change-password'>
                        Change Password
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className='subscription-logout'>
                  <ul>
                    <li className='pb-0'>
                      <Link
                        to=''
                        className='dropdown-item'
                        onClick={handleLogout}
                      >
                        Log Out
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </li>
      </ul>
    </div>
  )
}

export default Header
