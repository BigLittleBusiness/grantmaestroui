import React from 'react'
import Header from 'components/LandingPage/Header'
import BannerSection from 'components/LandingPage/BannerSection'
import MainContent from 'components/LandingPage/MainContent'
import TrustingDivComponent from 'components/LandingPage/TrustingDivComponent'
import Footer from 'components/LandingPage/Footer'
import {
  UniverSitiesBannerH1Text,
  UniverSitiesBannerPText,
} from 'constants/index'
import 'assets/css/home_style.css'

export default function UniversitiesPage() {
  return (
    <div className='full-container'>
      <Header />
      <BannerSection
        bannerH1Text={UniverSitiesBannerH1Text}
        bannerPText={UniverSitiesBannerPText}
      />
      <MainContent landingPage='universites' />
      <TrustingDivComponent />
      <Footer />
    </div>
  )
}
