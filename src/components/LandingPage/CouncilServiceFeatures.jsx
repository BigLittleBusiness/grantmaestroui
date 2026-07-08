import React, { useEffect } from 'react'

export default function CouncilServiceFeatures() {
  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll('.anim-scaledown-seq')
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect()
        if (rect.top <= window.innerHeight && rect.bottom >= 0) {
          el.classList.add('anim-scaledown-seq-visible')
        }
      })
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      id='service-features'
      className='parallax-section'
      data-scroll-index='1'
      data-parallax-bg-img='img-37.jpg'
      data-stellar-background-ratio='0.2'
    >
      <div
        className='overlay-colored'
        data-bg-color='#000'
        data-bg-color-opacity='0.4'
      ></div>
      <div className='section-content'>
        <div className='container'>
          <div className='row'>
            <div className='col-md-4'>
              <div className='box-info box-info-1 text-white mb-50 anim-scaledown-seq'>
                <div className='box-icon icon x2 colorful-icon mr-20'>
                  <i className='fa fa-calendar-times-o' style={{ color: 'white' }}></i>
                </div>
                <div className='box-content'>
                  <h4 className='capitalized'>Never Miss a Grant Deadline Again</h4>
                  <p>
                    Automated deadline reminders and a centralised grant calendar
                    ensure your team is always ahead of closing dates — protecting
                    your community's funding opportunities.
                  </p>
                </div>
              </div>
            </div>
            <div className='col-md-4'>
              <div className='box-info box-info-1 text-white mb-50 anim-scaledown-seq'>
                <div className='box-icon icon x2 colorful-icon mr-20'>
                  <i className='fa fa-table' style={{ color: 'white' }}></i>
                </div>
                <div className='box-content'>
                  <h4 className='capitalized'>Replace Spreadsheet Chaos with Clarity</h4>
                  <p>
                    Move every grant out of scattered spreadsheets and into a
                    single, structured platform — so your team always knows the
                    current status, who is responsible, and what is due next.
                  </p>
                </div>
              </div>
            </div>
            <div className='col-md-4'>
              <div className='box-info box-info-1 text-white mb-50 anim-scaledown-seq'>
                <div className='box-icon icon x2 colorful-icon mr-20'>
                  <i className='fa fa-folder-open' style={{ color: 'white' }}></i>
                </div>
                <div className='box-content'>
                  <h4 className='capitalized'>All Grant Documents in One Secure Place</h4>
                  <p>
                    Store requirement documents, images, reports, and
                    correspondence against each grant — accessible to the right
                    team members, always audit-ready.
                  </p>
                </div>
              </div>
            </div>
            <div className='col-md-4'>
              <div className='box-info box-info-1 text-white mb-md-50 anim-scaledown-seq'>
                <div className='box-icon icon x2 colorful-icon mr-20'>
                  <i className='fa fa-users' style={{ color: 'white' }}></i>
                </div>
                <div className='box-content'>
                  <h4 className='capitalized'>Align Every Department on Every Grant</h4>
                  <p>
                    Assign tasks across departments — from procurement and finance
                    to communications and project management — so every stakeholder
                    contributes without duplicating effort.
                  </p>
                </div>
              </div>
            </div>
            <div className='col-md-4'>
              <div className='box-info box-info-1 text-white mb-md-50 anim-scaledown-seq'>
                <div className='box-icon icon x2 colorful-icon mr-20'>
                  <i className='fa fa-bar-chart' style={{ color: 'white' }}></i>
                </div>
                <div className='box-content'>
                  <h4 className='capitalized'>Report to Council with Confidence</h4>
                  <p>
                    Generate clear progress reports for elected members and senior
                    management in minutes — not hours. Demonstrate accountability
                    and the value of every grant dollar secured.
                  </p>
                </div>
              </div>
            </div>
            <div className='col-md-4'>
              <div className='box-info box-info-1 text-white anim-scaledown-seq'>
                <div className='box-icon icon x2 colorful-icon mr-20'>
                  <i className='fa fa-shield' style={{ color: 'white' }}></i>
                </div>
                <div className='box-content'>
                  <h4 className='capitalized'>Built for Public Sector Transparency</h4>
                  <p>
                    Maintain a complete, timestamped audit trail of every grant
                    action — meeting the transparency and accountability standards
                    expected of Australian and New Zealand local governments.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
