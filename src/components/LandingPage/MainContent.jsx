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
  return <div className='d-flex justify-content-center p-4'><button className='btn btn-primary px-4 py-2' onClick={() => navigate('/register')}>Start your free 14-day trial</button></div>
}

export default function MainContent({ landingPage = 'homepage' }) {
  const navigate = useNavigate()
  return <section id='content'><div id='content-wrap'>
    <FunFacts />
    {landingPage === 'councils' ? <><TrialButton /><CouncilServiceFeatures /></> : <ServiceFeatures />}
    <section className='gm-readiness-promo' aria-labelledby='readiness-promo-title'><div className='container'><div className='gm-readiness-promo__grid'><div><p className='gm-readiness-promo__eyebrow'>Free council diagnostic</p><h2 id='readiness-promo-title'>See where your grant portfolio needs attention first.</h2><p>In three practical minutes, assess whether upcoming deadlines, acquittal evidence, accountable owners and handover context are visible to the people who need them.</p><p>You will receive clear, on-screen priorities to guide the next grants, finance or leadership discussion—without entering grant, funder or financial details.</p><a className='gm-readiness-promo__button' href='/grant-portfolio-readiness'>Take the Grant Portfolio Risk &amp; Readiness Snapshot</a></div><aside aria-label='Snapshot outcomes'><p>What you will leave with</p><ul><li><span>01</span> A clearer view of deadline and reporting visibility</li><li><span>02</span> A practical prompt for acquittal and evidence readiness</li><li><span>03</span> One useful next step for shared ownership and continuity</li></ul><small>Designed as a practical discussion aid—not a compliance assessment or certification.</small></aside></div></div></section>
    <section className='flat-section gm-council-proof' aria-labelledby='council-workflow-title'><div className='section-content'><div className='container'><div className='row'><div className='col-md-12'><div className='section-title text-center'><p className='section-subtitle'>Designed for practical grant operations</p><h2 id='council-workflow-title'>A shared workspace for the work around every grant</h2><p>GrantMaestro is structured around the operational work that makes inward funding successful: clear ownership, visible deadlines, shared evidence, internal decisions and a managed path to acquittal.</p><p>It gives grants, finance and delivery teams the same current record—so handovers and leadership reviews do not rely on a single spreadsheet or inbox.</p></div></div></div></div></div></section>
    <FeatureSection landingPage={landingPage} />
    <MembershipPricing />
    <section id='final-cta' className='final-cta-section'><div className='final-cta-inner'><h2 className='final-cta-heading'>Ready to take control of your grant portfolio?</h2><p className='final-cta-sub'>Give your team a clearer, more accountable way to manage grant opportunities, application work and acquittals.</p><button className='btn final-cta-btn' onClick={() => navigate('/register')}>Start your free 14-day trial</button><p className='final-cta-note'>No credit card required. Choose or change your plan during registration.</p><div className='final-cta-badges'><span><i className='fa fa-shield' aria-hidden='true'></i> Email verification</span><span><i className='fa fa-map-marker' aria-hidden='true'></i> Australian-hosted infrastructure</span><span><i className='fa fa-calendar' aria-hidden='true'></i> 14-day free trial</span></div></div></section>
  </div></section>
}
