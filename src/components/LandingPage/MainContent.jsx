import React from 'react'
import { useNavigate } from 'react-router-dom'
import FunFacts from 'components/LandingPage/FunFacts'
import ServiceFeatures from 'components/LandingPage/ServiceFeatures'
import 'components/LandingPage/MainContent.css'
import FeatureSection from 'components/LandingPage/FeatureSection'
import CouncilServiceFeatures from 'components/LandingPage/CouncilServiceFeatures'
import MembershipPricing from 'components/MembershipPricing'
import workflowVisual from 'assets/marketing/grantmaestro-workflow-visual.jpg'
import portfolioReviewVisual from 'assets/marketing/grantmaestro-portfolio-review.jpg'
import readinessPulseVisual from 'assets/marketing/grantmaestro-readiness-pulse.jpg'

const audienceContext = {
  nonProfit: {
    eyebrow: 'For not-for-profit teams',
    title: 'Keep funding work connected across your organisation.',
    copy: 'Coordinate opportunities, contributors, supporting records and reporting work in one shared workspace—so funding activity does not depend on one spreadsheet, inbox or staff member.',
    outcomes: ['Shared contributors', 'Visible records', 'Clear reporting work'],
  },
  universites: {
    eyebrow: 'For university teams',
    title: 'Coordinate research and funding work across the right people.',
    copy: 'Give research-office, investigator, finance and delivery contributors a clearer shared view of funding opportunities, actions, records and reporting commitments.',
    outcomes: ['Connected contributors', 'Clear funding records', 'Visible commitments'],
  },
  religiousPage: {
    eyebrow: 'For religious and community organisations',
    title: 'Keep funding opportunities and obligations organised.',
    copy: 'Create a practical shared record for funding opportunities, tasks, documents and reporting work—making it easier for the right people to contribute and continue the work.',
    outcomes: ['Shared context', 'Visible tasks', 'Organised records'],
  },
}

const TrialButton = () => {
  const navigate = useNavigate()
  return <div className='d-flex justify-content-center p-4'><button className='btn btn-primary px-4 py-2' onClick={() => navigate('/register')}>Start your free 14-day trial</button></div>
}

const CouncilReadinessPromotion = () => (
  <section className='gm-readiness-promo' aria-labelledby='readiness-promo-title'><div className='container'><div className='gm-readiness-promo__grid'>
    <div>
      <p className='gm-readiness-promo__eyebrow'>Free council diagnostic</p>
      <h2 id='readiness-promo-title'>See where your grant portfolio needs attention first.</h2>
      <p>In three practical minutes, assess whether upcoming deadlines, acquittal evidence, accountable owners and handover context are visible to the people who need them.</p>
      <p>You will receive clear, on-screen priorities to guide the next grants, finance or leadership discussion—without entering grant, funder or financial details.</p>
      <a className='gm-readiness-promo__button' href='/grant-portfolio-readiness'>Take the Grant Portfolio Risk &amp; Readiness Snapshot</a>
    </div>
    <aside aria-label='Snapshot outcomes'>
      <img className='gm-readiness-promo__visual' src={readinessPulseVisual} alt='Abstract portfolio readiness visual representing deadlines, evidence and accountable ownership.' loading='lazy' decoding='async' />
      <div className='gm-readiness-promo__outcomes'>
        <p>What you will leave with</p>
        <ul><li><span>01</span> A clearer view of deadline and reporting visibility</li><li><span>02</span> A practical prompt for acquittal and evidence readiness</li><li><span>03</span> One useful next step for shared ownership and continuity</li></ul>
        <small>Designed as a practical discussion aid—not a compliance assessment or certification.</small>
      </div>
    </aside>
  </div></div></section>
)

const AudienceContext = ({ context }) => (
  <section className='flat-section gm-council-proof gm-audience-context' aria-labelledby='audience-workflow-title'><div className='section-content'><div className='container'>
    <div className='gm-council-proof__grid'>
      <figure className='gm-council-proof__image'><img src={portfolioReviewVisual} alt='A cross-functional team reviewing funding work together.' loading='lazy' decoding='async' /></figure>
      <div className='gm-council-proof__copy'>
        <p className='section-subtitle'>{context.eyebrow}</p>
        <h2 id='audience-workflow-title'>{context.title}</h2>
        <p>{context.copy}</p>
        <div className='gm-council-proof__outcomes'>{context.outcomes.map((outcome) => <span key={outcome}>{outcome}</span>)}</div>
      </div>
    </div>
  </div></div></section>
)

const CouncilWorkflow = () => (
  <>
    <section className='flat-section gm-council-proof' aria-labelledby='council-workflow-title'><div className='section-content'><div className='container'>
      <div className='gm-council-proof__grid'>
        <figure className='gm-council-proof__image'><img src={portfolioReviewVisual} alt='A cross-functional grants team reviewing portfolio materials together.' loading='lazy' decoding='async' /></figure>
        <div className='gm-council-proof__copy'>
          <p className='section-subtitle'>Designed for practical grant operations</p>
          <h2 id='council-workflow-title'>A shared workspace for the work around every grant</h2>
          <p>GrantMaestro is structured around the operational work that makes inward funding successful: clear ownership, visible deadlines, shared evidence, internal decisions and a managed path to acquittal.</p>
          <p>It gives grants, finance and delivery teams the same current record—so handovers and leadership reviews do not rely on a single spreadsheet or inbox.</p>
          <div className='gm-council-proof__outcomes'><span>Visible ownership</span><span>Clear evidence paths</span><span>Earlier action</span></div>
        </div>
      </div>
    </div></div></section>
    <section className='gm-lifecycle-visual' aria-labelledby='lifecycle-title'><div className='container'><div className='gm-lifecycle-visual__grid'>
      <div className='gm-lifecycle-visual__copy'>
        <p className='gm-readiness-promo__eyebrow'>One operating rhythm</p>
        <h2 id='lifecycle-title'>Follow the work from opportunity to acquittal.</h2>
        <p>Bring the decisions, tasks, evidence and reporting work around each grant into one connected, accountable workflow.</p>
        <ol><li><span>01</span> Opportunity and eligibility</li><li><span>02</span> Application and shared actions</li><li><span>03</span> Delivery, reporting and acquittal</li></ol>
      </div>
      <figure className='gm-lifecycle-visual__image'><img src={workflowVisual} alt='A visual representation of a connected grant workflow from opportunity through reporting.' loading='lazy' decoding='async' /></figure>
    </div></div></section>
  </>
)

export default function MainContent({ landingPage = 'homepage' }) {
  const navigate = useNavigate()
  const isCouncilPage = landingPage === 'councils' || landingPage === 'homepage'
  const context = audienceContext[landingPage]

  return <section id='content'><div id='content-wrap'>
    <FunFacts />
    {landingPage === 'councils' ? <><TrialButton /><CouncilServiceFeatures /></> : <ServiceFeatures />}
    {isCouncilPage ? <CouncilReadinessPromotion /> : context && <AudienceContext context={context} />}
    {isCouncilPage ? <CouncilWorkflow /> : <section className='gm-lifecycle-visual' aria-labelledby='lifecycle-title'><div className='container'><div className='gm-lifecycle-visual__grid'><div className='gm-lifecycle-visual__copy'><p className='gm-readiness-promo__eyebrow'>One connected workflow</p><h2 id='lifecycle-title'>Keep the work around funding opportunities connected.</h2><p>Bring the decisions, tasks, records and reporting work into one shared, practical workflow.</p></div><figure className='gm-lifecycle-visual__image'><img src={workflowVisual} alt='A visual representation of a connected grant workflow from opportunity through reporting.' loading='lazy' decoding='async' /></figure></div></div></section>}
    <FeatureSection landingPage={landingPage} />
    <MembershipPricing />
    <section id='final-cta' className='final-cta-section'><div className='final-cta-inner'><h2 className='final-cta-heading'>Ready to take control of your grant portfolio?</h2><p className='final-cta-sub'>Give your team a clearer, more accountable way to manage grant opportunities, application work and acquittals.</p><button className='btn final-cta-btn' onClick={() => navigate('/register')}>Start your free 14-day trial</button><p className='final-cta-note'>No credit card required. Choose or change your plan during registration.</p><div className='final-cta-badges'><span><i className='fa fa-shield' aria-hidden='true'></i> Email verification</span><span><i className='fa fa-users' aria-hidden='true'></i> Shared workspace</span><span><i className='fa fa-calendar' aria-hidden='true'></i> 14-day free trial</span></div></div></section>
  </div></section>
}
