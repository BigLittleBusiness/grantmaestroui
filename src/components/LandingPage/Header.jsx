import React, { useEffect, useState } from 'react'
import 'components/LandingPage/Header.css'
import ColorLogo from 'assets/img/color_logo.png'

export default function Header({ noButtons = false }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  useEffect(() => {
    if (isMenuOpen) {
      document.getElementById('mobile-menu-wrap').style.display = 'block'
    } else {
      document.getElementById('mobile-menu-wrap').style.display = 'none'
    }
  }, [isMenuOpen])

  return (
    <header
      id='header'
      className='style-1 anim-moveleft text-white sticky'
      data-scroll-index='0'
    >
      <div id='header-wrap'>
        <div className='container'>
          <div className='row'>
            <div className='col-md-12'>
              <a className='logo logo-header' href='#'>
                <img src={ColorLogo} data-logo-alt='' alt='' />
                <h3>
                  <span className='colored'>Grant Maestro</span>
                </h3>
              </a>
              {!noButtons && (
                <div className='header-menu-and-meta'>
                  <ul id='main-menu' className='main-menu'>
                    <li>
                      <a data-scroll-nav='0' href='#header'>
                        Home
                      </a>
                    </li>
                    <li>
                      <a data-scroll-nav='1' href='#fun-facts'>
                        About Us
                      </a>
                    </li>
                    <li>
                      <a data-scroll-nav='2' href='#service-features'>
                        Our Services
                      </a>
                    </li>
                    <li>
                      <a data-scroll-nav='3' href='#clients-testmonials'>
                        Our Clients
                      </a>
                    </li>
                    <li>
                      <a data-scroll-nav='4' href='#pricing_section'>
                        Get It Now
                      </a>
                    </li>
                  </ul>
                  <div className='header-meta'>
                    <a
                      className='scroll-to btn small colorful hover-white mt-4'
                      href='#pricing_section'
                    >
                      Sign Up
                    </a>
                    <a
                      className='scroll-to btn small colorful hover-white ml-2 mt-4'
                      href='/login'
                    >
                      Login
                    </a>
                  </div>
                  <div
                    className='mobile-menu-btn hamburger hamburger--slider'
                    onClick={toggleMenu}
                  >
                    <span className='hamburger-box'>
                      <span className='hamburger-inner'></span>
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div id='mobile-menu-wrap'>
          <div className='container'>
            <div className='row'>
              <div className='col-md-12'>
                <div id='mobile-menu'>
                  <ul className='mobile-menu'>
                    <li>
                      <a
                        data-scroll-nav='0'
                        href='#header'
                        onClick={() => {
                          setIsMenuOpen(false)
                        }}
                      >
                        Home
                      </a>
                    </li>
                    <li>
                      <a
                        data-scroll-nav='1'
                        href='#fun-facts'
                        onClick={() => {
                          setIsMenuOpen(false)
                        }}
                      >
                        About Us
                      </a>
                    </li>
                    <li>
                      <a
                        data-scroll-nav='2'
                        href='#service-features'
                        onClick={() => {
                          setIsMenuOpen(false)
                        }}
                      >
                        Our Services
                      </a>
                    </li>
                    <li>
                      <a
                        data-scroll-nav='3'
                        href='#clients-testmonials'
                        onClick={() => {
                          setIsMenuOpen(false)
                        }}
                      >
                        Our Clients
                      </a>
                    </li>
                    <li>
                      <a
                        data-scroll-nav='4'
                        href='#cta-title-1'
                        onClick={() => {
                          setIsMenuOpen(false)
                        }}
                      >
                        Get It Now
                      </a>
                    </li>
                    <li>
                      <div className='hm-content'>
                        <a
                          className='scroll-to btn small colorful hover-white'
                          href='/register'
                          onClick={() => {
                            setIsMenuOpen(false)
                          }}
                        >
                          Sign Up
                        </a>
                      </div>
                    </li>
                    <li>
                      <div className='hm-content mt-2'>
                        <a
                          className='scroll-to btn small colorful hover-white'
                          href='/login'
                          onClick={() => {
                            setIsMenuOpen(false)
                          }}
                        >
                          Sign In
                        </a>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
