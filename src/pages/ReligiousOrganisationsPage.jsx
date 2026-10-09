import React from 'react'
import Header from 'components/LandingPage/Header'
import BannerSection from 'components/LandingPage/BannerSection'
import MainContent from 'components/LandingPage/MainContent'
import TrustingDivComponent from 'components/LandingPage/TrustingDivComponent'
import Footer from 'components/LandingPage/Footer'
import MarketingSeo from 'components/seo/MarketingSeo'
import { religiousPText, religiousH1Text } from 'constants/index'
import 'assets/css/home_style.css'

export default function ReligiousOrganisationsPage() {
  return (
    <div className='full-container'>
      <MarketingSeo pageKey='religiousOrganisations' />
      <Header />
      <main id='main-content' tabIndex='-1'>
        <BannerSection
          bannerH1Text={religiousH1Text}
          bannerPText={religiousPText}
        />
        <MainContent landingPage='religiousPage' />
        <TrustingDivComponent />
      </main>
      <Footer />
    </div>
  )
}
