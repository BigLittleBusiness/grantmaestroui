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

  const scrollToPricing = (e) => {
    e.preventDefault()
    const el = document.getElementById('pricing_section')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    } else {
      // If we are not on the home page, navigate to home with hash
      window.location.href = '/#pricing_section'
    }
    setIsMenuOpen(false)
  }

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
              <a className='logo logo-header' href='/'>
                <img src={ColorLogo} data-logo-alt='' alt='Grant Maestro logo' />
                <h3>
                  <span className='colored'>Grant Maestro</span>
                </h3>
              </a>
              {!noButtons && (
                <div className='header-menu-and-meta'>
                  <ul id='main-menu' className='main-menu' aria-label='Primary navigation'>
                    <li>
                      <a href='/'>Home</a>
                    </li>
                    <li>
                      <a data-scroll-nav='2' href='/#service-features'>
                        How it works
                      </a>
                    </li>
                    <li>
                      <a href='/councils'>For councils</a>
                    </li>
                    <li>
                      <a data-scroll-nav='4' href='#pricing_section' onClick={scrollToPricing}>
                        Pricing
                      </a>
                    </li>
                  </ul>
                  <div className='header-meta'>
                    <a
                      className='scroll-to btn small colorful hover-white mt-4'
                      href='#pricing_section'
                      onClick={scrollToPricing}
                    >
                      Start Free Trial
                    </a>
                    <a
                      className='scroll-to btn small colorful hover-white ml-2 mt-4'
                      href='/login'
                    >
                      Login
                    </a>
                  </div>
                  <button
                    type='button'
                    className='mobile-menu-btn hamburger hamburger--slider'
                    onClick={toggleMenu}
                    aria-controls='mobile-menu-wrap'
                    aria-expanded={isMenuOpen}
                    aria-label='Toggle main menu'
                  >
                    <span className='hamburger-box'>
                      <span className='hamburger-inner'></span>
                    </span>
                  </button>
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
                  <ul className='mobile-menu' aria-label='Mobile primary navigation'>
                    <li>
                      <a href='/' onClick={() => setIsMenuOpen(false)}>Home</a>
                    </li>
                    <li>
                      <a href='/#service-features' onClick={() => setIsMenuOpen(false)}>How it works</a>
                    </li>
                    <li>
                      <a href='/councils' onClick={() => setIsMenuOpen(false)}>For councils</a>
                    </li>
                    <li>
                      <a
                        data-scroll-nav='4'
                        href='#pricing_section'
                        onClick={scrollToPricing}
                      >
                        Pricing
                      </a>
                    </li>
                    <li>
                      <div className='hm-content'>
                        <a
                          className='scroll-to btn small colorful hover-white'
                          href='#pricing_section'
                          onClick={scrollToPricing}
                        >
                          Start Free Trial
                        </a>
                      </div>
                    </li>
                    <li>
                      <div className='hm-content mt-2'>
                        <a
                          className='scroll-to btn small colorful hover-white'
                          href='/login'
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Login
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
