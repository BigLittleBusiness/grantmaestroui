import React, { useState } from 'react'

const MembershipPricing = () => {
  const [isAnnually, setIsAnnually] = useState(true)

  const togglePlan = () => {
    setIsAnnually(!isAnnually)
  }

  return (
    <div className='container my-5' id='pricing_section'>
      <h2 className='text-center mb-4'>Membership Plans</h2>
      <div className='text-center mb-4'>
        <button
          className={`btn ${
            isAnnually ? 'btn-primary' : 'btn-outline-primary'
          } mx-2`}
          onClick={togglePlan}
        >
          Annually - save 10%
        </button>
        <button
          className={`btn ${
            !isAnnually ? 'btn-primary' : 'btn-outline-primary'
          } mx-2`}
          onClick={togglePlan}
        >
          Monthly
        </button>
      </div>
      <div className='row'>
        {/* Basic Plan */}
        <div className='col-md-4'>
          <div className='card text-center plan-card'>
            <div className='card-header bg-primary text-white'>
              Seat-by-Seat
            </div>
            <div className='card-body'>
              <h3 className='card-title' style={{ color: 'deepskyblue' }}>
                {isAnnually ? '$45/pm per Admin' : '$49/pm per Admin'}
              </h3>
              <h5 className='card-title'>
                {isAnnually
                  ? '$26/pm per Team Member'
                  : '$29/pm per Team Member'}
              </h5>
              <ul className='list-group list-group-flush'>
                <li
                  className='list-group-item'
                  style={{ background: 'skyblue', fontWeight: 'bold' }}
                >
                  Start Free Trial
                </li>
                <li
                  className='list-group-item'
                  style={{ color: 'black', fontWeight: 'bold' }}
                >
                  Great for ...
                </li>
                <li className='list-group-item'>✅ Starting out </li>
                <li className='list-group-item'>
                  ✅ Small teams and smaller budgets
                </li>
                <li className='list-group-item'>
                  ✅ Full functionality that can grow with you
                </li>
                <li
                  className='list-group-item'
                  style={{ color: 'black', fontWeight: 'bold' }}
                >
                  Key features ...
                </li>
                <li className='list-group-item'>✅ smart Small</li>
                <li className='list-group-item'>
                  ✅ Grow as you need when you need
                </li>
                <li className='list-group-item'>
                  ✅ Only pay for team members actively contributing
                </li>
                <li className='list-group-item'>
                  ✅ Bring all departments in at a low per-seat cost
                </li>
                <li className='list-group-item'>
                  ✅ Perfect for Org’s with tight budgets
                </li>
                <li className='list-group-item'>
                  ✅ Finance can be emailed upon each successful application
                </li>
                <li className='list-group-item'>
                  ✅Email support - 48 hour response time
                </li>
                <li className='list-group-item'>❌ No Phone Support</li>
              </ul>
              <a
                href='/register?membership-preference=seat-by-seat'
                className='btn btn-primary mt-3'
              >
                Choose Plan
              </a>
            </div>
          </div>
        </div>
        {/* Pro Plan */}
        <div className='col-md-4'>
          <div className='card text-center plan-card'>
            <div className='card-header bg-success text-white'>Pro</div>
            <div className='card-body'>
              <h3 className='card-title' style={{ color: 'deepskyblue' }}>
                {isAnnually ? '$275/pm' : '$299/pm'}
              </h3>
              <h5 className='card-title'>2 Admins + 10 Team Members</h5>
              <ul className='list-group list-group-flush'>
                <li
                  className='list-group-item'
                  style={{ background: 'skyblue', fontWeight: 'bold' }}
                >
                  Start Free Trial
                </li>
                <li
                  className='list-group-item'
                  style={{ color: 'black', fontWeight: 'bold' }}
                >
                  Made for ...
                </li>
                <li className='list-group-item'>✅ Advisors and Consultants</li>
                <li
                  className='list-group-item'
                  style={{ color: 'black', fontWeight: 'bold' }}
                >
                  Key features ...
                </li>
                <li className='list-group-item'>
                  ✅Advisors can be Admins and assign seats to clients
                </li>
                <li className='list-group-item'>
                  ✅Seats can be charged back to clients or bundled into service
                </li>
                <li className='list-group-item'>
                  ✅Each client will only see the grants and tasks they have
                  been added to by the Admin
                </li>
                <li className='list-group-item'>
                  ✅You can have up to 3 Admins of staff, ensuring greater
                  monitoring
                </li>
                <li className='list-group-item'>
                  ✅As you grow, you can purchase extra Admin seats and add
                  staff as Seat users to complete tasks
                </li>
                <li className='list-group-item'>
                  ✅Improve your grant service offering without the expected
                  time overheads
                </li>
                <li className='list-group-item'>
                  ✅Onboarding and Training session included
                </li>
                <li className='list-group-item'>
                  ✅Email Support – 24-hour reply
                </li>
                <li className='list-group-item'>❌ Phone Support</li>
              </ul>
              <a
                href='/register?membership-preference=pro'
                className='btn btn-success mt-3'
              >
                Choose Plan
              </a>
            </div>
          </div>
        </div>
        {/* Enterprise Plan */}
        <div className='col-md-4'>
          <div className='card text-center plan-card'>
            <div className='card-header bg-dark text-white'>Enterprise</div>
            <div className='card-body'>
              <h3 className='card-title' style={{ color: 'deepskyblue' }}>
                {isAnnually ? '$625/pm' : '$699/pm'}
              </h3>
              <h5 className='card-title'>5 Admins + 20 Team Members </h5>
              <ul className='list-group list-group-flush'>
                <li
                  className='list-group-item'
                  style={{ background: 'skyblue', fontWeight: 'bold' }}
                >
                  Start Free Trial
                </li>
                <li
                  className='list-group-item'
                  style={{ color: 'black', fontWeight: 'bold' }}
                >
                  Perfect for ...
                </li>
                <li className='list-group-item'>✅ Larger organisations </li>
                <li className='list-group-item'>
                  ✅ Org’s with multiple departments involved and each Dept has
                  an Admin
                </li>
                <li
                  className='list-group-item'
                  style={{ color: 'black', fontWeight: 'bold' }}
                >
                  Key features ...
                </li>
                <li className='list-group-item'>
                  ✅ Everything in other plans, and…
                </li>
                <li className='list-group-item'>
                  ✅ Allows for clear ownership and accountability on grant
                  actions
                </li>
                <li className='list-group-item'>
                  ✅ Enables procurement, finance, comms, and project managers
                  to be looped in at a lower cost per seat.
                </li>
                <li className='list-group-item'>
                  ✅Finance can be emailed upon each successful application
                </li>
                <li className='list-group-item'>
                  ✅ Onboarding and Training session included
                </li>
                <li className='list-group-item'>
                  ✅Email Support – 24-hour reply
                </li>
                <li className='list-group-item'>✅ Phone Support</li>
              </ul>
              <a
                href='/register?membership-preference=enterprise'
                className='btn btn-dark mt-3'
              >
                Choose Plan
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MembershipPricing
