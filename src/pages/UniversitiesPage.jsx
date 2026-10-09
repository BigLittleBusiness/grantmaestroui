import React from 'react'
import Header from 'components/LandingPage/Header'
import BannerSection from 'components/LandingPage/BannerSection'
import MainContent from 'components/LandingPage/MainContent'
import TrustingDivComponent from 'components/LandingPage/TrustingDivComponent'
import Footer from 'components/LandingPage/Footer'
import MarketingSeo from 'components/seo/MarketingSeo'
import {
  UniverSitiesBannerH1Text,
  UniverSitiesBannerPText,
} from 'constants/index'
import 'assets/css/home_style.css'

export default function UniversitiesPage() {
  return (
    <div className='full-container'>
      <MarketingSeo pageKey='universities' />
      <Header />
      <main id='main-content' tabIndex='-1'>
        <BannerSection
          bannerH1Text={UniverSitiesBannerH1Text}
          bannerPText={UniverSitiesBannerPText}
        />
        <MainContent landingPage='universites' />
        <TrustingDivComponent />
      </main>
      <Footer />
    </div>
  )
}
