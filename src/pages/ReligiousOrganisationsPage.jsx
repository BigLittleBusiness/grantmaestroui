import React from 'react'
import { Helmet } from 'react-helmet-async'
import Header from 'components/LandingPage/Header'
import BannerSection from 'components/LandingPage/BannerSection'
import MainContent from 'components/LandingPage/MainContent'
import TrustingDivComponent from 'components/LandingPage/TrustingDivComponent'
import Footer from 'components/LandingPage/Footer'
import { religiousPText, religiousH1Text } from 'constants/index'
import 'assets/css/home_style.css'

export default function ReligiousOrganisationsPage() {
  return (
    <div className='full-container'>
      <Helmet>
        <title>Grant Management Software for Religious Organisations & Faith Groups | Grant Maestro</title>
        <meta name="description" content="Grant Maestro helps Australian and New Zealand religious organisations, churches, and faith-based groups manage their grant applications, track funding opportunities, and automate compliance reporting. Start your free 14-day trial." />
        <meta name="keywords" content="religious organisation grant management, church grants Australia, faith-based grant management software, grant tracking religious organisations, Australian church grants, faith group funding" />
        <link rel="canonical" href="https://www.grantmaestro.com/religious-organisations" />
        <meta property="og:title" content="Grant Management Software for Religious Organisations | Grant Maestro" />
        <meta property="og:description" content="Purpose-built grant lifecycle management for Australian and New Zealand religious organisations and faith-based groups. Manage funding applications and automate compliance reporting." />
        <meta property="og:url" content="https://www.grantmaestro.com/religious-organisations" />
      </Helmet>
      <Header />
      <BannerSection
        bannerH1Text={religiousH1Text}
        bannerPText={religiousPText}
      />
      <MainContent landingPage='religiousPage' />
      <TrustingDivComponent />
      <Footer />
    </div>
  )
}
