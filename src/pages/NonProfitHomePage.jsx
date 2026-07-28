import React from 'react'
import { Helmet } from 'react-helmet-async'
import Header from 'components/LandingPage/Header'
import BannerSection from 'components/LandingPage/BannerSection'
import MainContent from 'components/LandingPage/MainContent'
import TrustingDivComponent from 'components/LandingPage/TrustingDivComponent'
import Footer from 'components/LandingPage/Footer'
import { nonprofitH1Text, nonprofitPText } from 'constants/index'
import 'assets/css/home_style.css'

export default function NonProfitHomePage() {
  return (
    <div className='full-container'>
      <Helmet>
        <title>Grant Management Software for Non-Profits & NFPs | Grant Maestro</title>
        <meta name="description" content="Grant Maestro helps Australian and New Zealand non-profit organisations manage their entire grant lifecycle — from opportunity discovery to acquittal reporting. Start your free 14-day trial." />
        <meta name="keywords" content="NFP grant management software, non-profit grants Australia, charity grant management, grant tracking non-profit, grant reporting NFP, Australian non-profit grants" />
        <link rel="canonical" href="https://www.grantmaestro.com/nonprofits" />
        <meta property="og:title" content="Grant Management Software for Non-Profits & NFPs | Grant Maestro" />
        <meta property="og:description" content="Purpose-built grant lifecycle management for Australian and New Zealand non-profit organisations. Discover opportunities, manage applications, and automate acquittal reporting." />
        <meta property="og:url" content="https://www.grantmaestro.com/nonprofits" />
      </Helmet>
      <Header />
      <BannerSection
        bannerH1Text={nonprofitH1Text}
        bannerPText={nonprofitPText}
      />
      <MainContent landingPage='nonProfit' />
      <TrustingDivComponent />
      <Footer />
    </div>
  )
}
