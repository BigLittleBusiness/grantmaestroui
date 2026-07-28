import React from 'react'
import { Helmet } from 'react-helmet-async'
import Header from 'components/LandingPage/Header'
import BannerSection from 'components/LandingPage/BannerSection'
import MainContent from 'components/LandingPage/MainContent'
import TrustingDivComponent from 'components/LandingPage/TrustingDivComponent'
import Footer from 'components/LandingPage/Footer'
import { councilH1Text, councilPText } from 'constants/index'
import 'assets/css/home_style.css'

export default function CouncilsPage() {
  return (
    <div className='full-container'>
      <Helmet>
        <title>Grant Management Software for Local Government Councils | Grant Maestro</title>
        <meta name="description" content="Grant Maestro is purpose-built for Australian and New Zealand local government councils. Manage your entire grant portfolio, automate compliance reporting, and never miss a deadline. Start your free 14-day trial." />
        <meta name="keywords" content="council grant management software, local government grants Australia, grant management platform councils, grant reporting local government, Australian council grants, New Zealand council grants" />
        <link rel="canonical" href="https://www.grantmaestro.com/councils" />
        <meta property="og:title" content="Grant Management Software for Local Government Councils | Grant Maestro" />
        <meta property="og:description" content="Purpose-built grant lifecycle management for Australian and New Zealand local government councils. Automate reporting, track deadlines, and maximise grant success rates." />
        <meta property="og:url" content="https://www.grantmaestro.com/councils" />
      </Helmet>
      <Header />
      <BannerSection
        bannerH1Text={councilH1Text}
        bannerPText={councilPText}
        membershipPreference='starter'
      />
      <MainContent landingPage='councils' />
      <TrustingDivComponent />
      <Footer />
    </div>
  )
}
