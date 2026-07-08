import React, { useState } from 'react'

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    headerClass: 'bg-primary',
    btnClass: 'btn-primary',
    monthlyPrice: '$99',
    annualPrice: '$89',
    seats: '1 Admin + 3 Team Members',
    overage: '$20/pm per extra seat',
    tagline: 'Perfect for smaller councils and teams getting started.',
    idealFor: [
      'Councils managing a small grant portfolio',
      'Teams new to structured grant management',
      'Organisations with tight budgets needing full functionality',
    ],
    features: [
      'Full grant lifecycle management',
      'Centralised document storage',
      'Automated deadline reminders',
      'Task assignment and tracking',
      'Grant progress dashboard',
      'Finance notification on successful applications',
      'Email support — 48-hour response',
    ],
    noFeatures: ['Phone support'],
    highlight: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    headerClass: 'bg-success',
    btnClass: 'btn-success',
    monthlyPrice: '$275',
    annualPrice: '$249',
    seats: '2 Admins + 10 Team Members',
    overage: '$18/pm per extra seat',
    tagline: 'Ideal for mid-sized councils and grant consultants.',
    idealFor: [
      'Mid-sized councils with multiple active grants',
      'Grant consultants managing multiple clients',
      'Teams requiring stronger oversight and reporting',
    ],
    features: [
      'Everything in Starter, plus…',
      'Up to 2 Admin accounts for senior oversight',
      'Advisors can assign tasks directly to client seats',
      'Each client sees only their own grants and tasks',
      'Scalable — add extra seats as your team grows',
      'Onboarding and training session included',
      'Email support — 24-hour response',
    ],
    noFeatures: ['Phone support'],
    highlight: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    headerClass: 'bg-dark',
    btnClass: 'btn-dark',
    monthlyPrice: '$625',
    annualPrice: '$562',
    seats: '5 Admins + 20 Team Members',
    overage: '$15/pm per extra seat',
    tagline: 'Built for larger councils with multi-department grant operations.',
    idealFor: [
      'Larger councils with complex, multi-department grant programmes',
      'Organisations requiring clear ownership and accountability',
      'Teams where procurement, finance, and comms all contribute',
    ],
    features: [
      'Everything in Pro, plus…',
      'Up to 5 Admin accounts — one per department if needed',
      'Clear ownership and accountability across all grant actions',
      'Finance automatically notified on successful applications',
      'Full audit trail for public sector transparency requirements',
      'Onboarding and training session included',
      'Priority email support — 24-hour response',
      'Phone support',
    ],
    noFeatures: [],
    highlight: false,
  },
]

const MembershipPricing = () => {
  const [isAnnually, setIsAnnually] = useState(true)

  return (
    <div className='container my-5' id='pricing_section'>
      <h2 className='text-center mb-2'>Simple, Transparent Pricing</h2>
      <p className='text-center text-muted mb-4'>
        All plans include a <strong>14-day free trial</strong>. No credit card required.
      </p>
      <div className='text-center mb-4'>
        <button
          className={`btn ${isAnnually ? 'btn-primary' : 'btn-outline-primary'} mx-2`}
          onClick={() => setIsAnnually(true)}
        >
          Annual — Save 10%
        </button>
        <button
          className={`btn ${!isAnnually ? 'btn-primary' : 'btn-outline-primary'} mx-2`}
          onClick={() => setIsAnnually(false)}
        >
          Monthly
        </button>
      </div>
      <div className='row'>
        {plans.map((plan) => (
          <div className='col-md-4 mb-4' key={plan.id}>
            <div
              className='card text-center h-100 plan-card'
              style={plan.highlight ? { border: '2px solid #28a745', boxShadow: '0 4px 20px rgba(40,167,69,0.2)' } : {}}
            >
              {plan.highlight && (
                <div
                  style={{
                    background: '#28a745',
                    color: '#fff',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '4px 0',
                    letterSpacing: '0.05em',
                  }}
                >
                  MOST POPULAR
                </div>
              )}
              <div className={`card-header ${plan.headerClass} text-white`}>
                <strong>{plan.name}</strong>
              </div>
              <div className='card-body d-flex flex-column'>
                <div className='mb-1'>
                  <h3 className='card-title mb-0' style={{ color: '#0d6efd', fontWeight: 700 }}>
                    {isAnnually ? plan.annualPrice : plan.monthlyPrice}
                    <span style={{ fontSize: '1rem', fontWeight: 400, color: '#555' }}>/pm</span>
                  </h3>
                  {isAnnually && (
                    <small className='text-muted'>Billed annually — 10% saving</small>
                  )}
                </div>
                <p className='text-muted small mb-1'>{plan.seats}</p>
                <p className='text-muted small mb-3'>
                  <em>+ {plan.overage}</em>
                </p>
                <p className='text-secondary small mb-3'>{plan.tagline}</p>

                <div className='text-start mb-3'>
                  <p className='fw-bold small mb-1'>Ideal for:</p>
                  <ul className='list-unstyled small'>
                    {plan.idealFor.map((item, i) => (
                      <li key={i} className='mb-1'>✅ {item}</li>
                    ))}
                  </ul>
                </div>

                <div className='text-start mb-3'>
                  <p className='fw-bold small mb-1'>Key features:</p>
                  <ul className='list-unstyled small'>
                    {plan.features.map((item, i) => (
                      <li key={i} className='mb-1'>✅ {item}</li>
                    ))}
                    {plan.noFeatures.map((item, i) => (
                      <li key={i} className='mb-1 text-muted'>❌ {item}</li>
                    ))}
                  </ul>
                </div>

                <div className='mt-auto'>
                  <a
                    href={`/register?membership-preference=${plan.id}`}
                    className={`btn ${plan.btnClass} w-100`}
                  >
                    Start Free Trial
                  </a>
                  <p className='text-muted mt-2' style={{ fontSize: '0.75rem' }}>
                    No credit card required
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MembershipPricing
