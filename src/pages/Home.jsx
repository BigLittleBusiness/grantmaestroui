import React from 'react'
import Header from 'components/LandingPage/Header'
import BannerSection from 'components/LandingPage/BannerSection'
import MainContent from 'components/LandingPage/MainContent'
import TrustingDivComponent from 'components/LandingPage/TrustingDivComponent'
import Footer from 'components/LandingPage/Footer'
import 'assets/css/home_style.css'

export default function Home() {
  return (
    <div className='full-container'>
      <Header />
      <BannerSection />
      <MainContent />
      <TrustingDivComponent />
      <Footer />
    </div>
  )
}
