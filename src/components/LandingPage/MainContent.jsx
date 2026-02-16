import React from 'react'
import { useNavigate } from 'react-router-dom'
import FunFacts from 'components/LandingPage/FunFacts'
import ServiceFeatures from 'components/LandingPage/ServiceFeatures'
import 'components/LandingPage/MainContent.css'
import ColorLogo from 'assets/img/color_logo.png'
import CtaTitleShape1 from 'assets/img/cta-title-shape-1.png'
import CtaTitleShape2 from 'assets/img/cta-title-shape-2.png'
import CtaTitleShape3 from 'assets/img/cta-title-shape-3.png'
import CtaTitleShape4 from 'assets/img/cta-title-shape-4.png'
import FeatureSection from 'components/LandingPage/FeatureSection'
import CouncilServiceFeatures from 'components/LandingPage/CouncilServiceFeatures'
// import HubSpotForm from 'components/LandingPage/HubspotForm'
import MembershipPricing from 'components/MembershipPricing'

const TiralButton = () => {
  const navigate = useNavigate()

  return (
    <div className='d-flex justify-content-center p-4'>
      <button
        className='btn btn-primary px-4 py-2'
        onClick={() => navigate('/register')}
      >
        Start Your Free 14-Day Trial
      </button>
    </div>
  )
}

export default function MainContent({ landingPage = 'homepage' }) {
  return (
    <section id='content'>
      <div id='content-wrap'>
        <FunFacts />
        {landingPage === 'councils' ? (
          <>
            <TiralButton />
            <CouncilServiceFeatures />
          </>
        ) : (
          <ServiceFeatures />
        )}
        <div
          id='clients-testmonials'
          className='flat-section'
          data-scroll-index='3'
        >
          <div className='section-content'>
            <div className='container'>
              <div className='row'>
                <div className='col-md-12'>
                  <div className='section-title text-center'>
                    <p className='testimonial'>
                      Our founding team and advisors have spoken to over 400
                      talented individuals in the 'grant space', who have
                      provided what they need and what some key features would
                      be to help make their job easier. We have attended Eco Dev
                      conferences and listed to the frustrations of this cohort,
                      and implemented functionality to help them to do this part
                      of their job quicker and more efficiently!
                    </p>
                    <br />
                    <br />
                    <p className='testimonial'>
                      In addition, we are in constant contact with our early
                      registrants, as well as key people in the middle of 'all
                      things grants' across Australia and New Zealand.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <FeatureSection landingPage={landingPage} />
        <MembershipPricing />
        <div id='cta-title-1' className='flat-section' data-scroll-index='4'>
          <div className='section-content'>
            <div className='container'>
              <div className='row'>
                <div className='col-md-12'>
                  <div className='box-cta text-center'>
                    <img src={ColorLogo} alt='' />
                    <div className='row contact_row'>
                      <div className='col col-md-8 contact_form'></div>
                    </div>
                    <img
                      className='shape-1 anim-moveleft-seq'
                      src={CtaTitleShape1}
                      alt=''
                      data-move-duration='2000'
                    />
                    <img
                      className='shape-2 anim-moveright-seq'
                      src={CtaTitleShape2}
                      alt=''
                      data-move-duration='2000'
                    />
                    <img
                      className='shape-3 anim-moveleft-seq'
                      src={CtaTitleShape3}
                      alt=''
                      data-move-duration='2000'
                    />
                    <img
                      className='shape-4 anim-moveright-seq'
                      src={CtaTitleShape4}
                      alt=''
                      data-move-duration='2000'
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
