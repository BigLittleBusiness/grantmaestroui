import React from 'react'
import { Helmet } from 'react-helmet-async'
import Header from 'components/LandingPage/Header'
import BannerSection from 'components/LandingPage/BannerSection'
import MainContent from 'components/LandingPage/MainContent'
import TrustingDivComponent from 'components/LandingPage/TrustingDivComponent'
import Footer from 'components/LandingPage/Footer'
import 'assets/css/home_style.css'

export default function Home() {
  return (
    <div className='full-container'>
      <Helmet>
        <title>Grant Maestro | Grant Management Platform for Australian Organisations</title>
        <meta name="description" content="Grant Maestro is the all-in-one grant lifecycle management platform for Australian and New Zealand councils, non-profits, and universities. Start your free 14-day trial." />
        <meta name="keywords" content="grant management software, Australian grants, grant lifecycle management, grant tracking, grant reporting, NFP grants, local government grants" />
        <link rel="canonical" href="https://www.grantmaestro.com/" />
        <meta property="og:title" content="Grant Maestro | Grant Management Platform for Australian Organisations" />
        <meta property="og:description" content="The all-in-one grant lifecycle management platform for Australian and New Zealand councils, non-profits, and universities. Start your free 14-day trial." />
        <meta property="og:url" content="https://www.grantmaestro.com/" />
      </Helmet>
      <Header />
      <BannerSection />
      <MainContent />
      <TrustingDivComponent />
      <Footer />
    </div>
  )
}
