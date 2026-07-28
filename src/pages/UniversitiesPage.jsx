import React from 'react'
import { Helmet } from 'react-helmet-async'
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
      <Helmet>
        <title>Grant Management Software for Universities & Higher Education | Grant Maestro</title>
        <meta name="description" content="Grant Maestro helps Australian and New Zealand universities and higher education institutions manage research grants, government funding, and philanthropic grants from a single platform. Start your free 14-day trial." />
        <meta name="keywords" content="university grant management software, research grant management Australia, higher education grants, grant tracking university, grant reporting university, Australian university grants" />
        <link rel="canonical" href="https://www.grantmaestro.com/universities" />
        <meta property="og:title" content="Grant Management Software for Universities & Higher Education | Grant Maestro" />
        <meta property="og:description" content="Purpose-built grant lifecycle management for Australian and New Zealand universities. Manage research grants, government funding, and philanthropic grants from one platform." />
        <meta property="og:url" content="https://www.grantmaestro.com/universities" />
      </Helmet>
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
