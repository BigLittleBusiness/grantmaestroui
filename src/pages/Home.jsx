import React from 'react'
import Header from 'components/LandingPage/Header'
import BannerSection from 'components/LandingPage/BannerSection'
import MainContent from 'components/LandingPage/MainContent'
import TrustingDivComponent from 'components/LandingPage/TrustingDivComponent'
import Footer from 'components/LandingPage/Footer'
import MarketingSeo from 'components/seo/MarketingSeo'
import 'assets/css/home_style.css'

export default function Home() {
  return (
    <div className='full-container'>
      <MarketingSeo pageKey='home' />
      <Header />
      <main id='main-content' tabIndex='-1'>
        <BannerSection />
        <MainContent />
        <TrustingDivComponent />
      </main>
      <Footer />
    </div>
  )
}
