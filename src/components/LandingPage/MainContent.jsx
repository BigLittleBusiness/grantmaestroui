import React from 'react'
import { useNavigate } from 'react-router-dom'
import FunFacts from 'components/LandingPage/FunFacts'
import ServiceFeatures from 'components/LandingPage/ServiceFeatures'
import 'components/LandingPage/MainContent.css'
import FeatureSection from 'components/LandingPage/FeatureSection'
import CouncilServiceFeatures from 'components/LandingPage/CouncilServiceFeatures'
import MembershipPricing from 'components/MembershipPricing'

const TrialButton = () => {
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
  const navigate = useNavigate()

  return (
    <section id='content'>
      <div id='content-wrap'>
        <FunFacts />
        {landingPage === 'councils' ? (
          <>
            <TrialButton />
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

        {/* ── Final CTA Block ── replaces the flat-lay brand strip ── */}
        <div id='final-cta' className='final-cta-section'>
          <div className='final-cta-inner'>
            <h2 className='final-cta-heading'>
              Ready to take control of your grant portfolio?
            </h2>
            <p className='final-cta-sub'>
              Join councils and organisations across Australia and New Zealand
              who are winning more funding with less effort.
            </p>
            <button
              className='btn final-cta-btn'
              onClick={() => navigate('/register')}
            >
              Start Your Free 14-Day Trial
            </button>
            <p className='final-cta-note'>No credit card required. Cancel anytime.</p>
            <div className='final-cta-badges'>
              <span>🔒 Secure &amp; Encrypted</span>
              <span>🇦🇺 Australian Hosted</span>
              <span>✅ 14-Day Free Trial</span>
            </div>
          </div>
        </div>
        {/* ── End Final CTA Block ── */}
      </div>
    </section>
  )
}
