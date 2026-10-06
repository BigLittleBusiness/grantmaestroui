import React, { useEffect, useState } from 'react'
import 'components/LandingPage/Header.css'
import BrandLogoFullColour from 'assets/brand/grantmaestro-logo-full-colour-transparent.png'

const primaryLinks = [
  { href: '/', label: 'Home' },
  { href: '/#service-features', label: 'How it works' },
  { href: '/councils', label: 'For councils' },
  { href: '/grant-portfolio-readiness', label: 'Readiness snapshot' },
  { href: '/#pricing_section', label: 'Pricing' },
  { href: '/contact', label: 'Contact' },
]

export default function Header({ noButtons = false }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const menu = document.getElementById('mobile-menu-wrap')
    if (menu) menu.style.display = isMenuOpen ? 'block' : 'none'
  }, [isMenuOpen])

  const closeMenu = () => setIsMenuOpen(false)

  return (
    <header id='header' className='style-1 anim-moveleft text-white sticky' data-scroll-index='0'>
      <a className='skip-to-main' href='#main-content'>Skip to main content</a>
      <div id='header-wrap'>
        <div className='container'>
          <div className='row'>
            <div className='col-md-12'>
              <a className='logo logo-header' href='/' aria-label='GrantMaestro home'>
                <img src={BrandLogoFullColour} data-logo-alt='' alt='GrantMaestro' />
              </a>
              {!noButtons && (
                <div className='header-menu-and-meta'>
                  <nav aria-label='Primary'>
                    <ul id='main-menu' className='main-menu'>
                      {primaryLinks.map((link) => <li key={link.href}><a href={link.href}>{link.label}</a></li>)}
                    </ul>
                  </nav>
                  <div className='header-meta'>
                    <a className='scroll-to btn small colorful hover-white mt-4' href='/register'>Start Free Trial</a>
                    <a className='scroll-to btn small colorful hover-white ml-2 mt-4' href='/login'>Login</a>
                  </div>
                  <button
                    type='button'
                    className={`mobile-menu-btn hamburger hamburger--slider${isMenuOpen ? ' is-active' : ''}`}
                    onClick={() => setIsMenuOpen((current) => !current)}
                    aria-controls='mobile-menu-wrap'
                    aria-expanded={isMenuOpen}
                    aria-label={isMenuOpen ? 'Close main menu' : 'Open main menu'}
                  >
                    <span className='hamburger-box'><span className='hamburger-inner'></span></span>
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
                <nav id='mobile-menu' aria-label='Mobile primary navigation'>
                  <ul className='mobile-menu'>
                    {primaryLinks.map((link) => <li key={link.href}><a href={link.href} onClick={closeMenu}>{link.label}</a></li>)}
                    <li><div className='hm-content'><a className='scroll-to btn small colorful hover-white' href='/register' onClick={closeMenu}>Start Free Trial</a></div></li>
                    <li><div className='hm-content mt-2'><a className='scroll-to btn small colorful hover-white' href='/login' onClick={closeMenu}>Login</a></div></li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
