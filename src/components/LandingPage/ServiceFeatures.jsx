import React, { useEffect } from 'react'

export default function ServiceFeatures() {
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
                  <i className='fa fa-clipboard' style={{ color: 'white' }}></i>
                </div>
                <div className='box-content'>
                  <h4 className='capitalized'>One Platform for Every Grant</h4>
                  <p>
                    Consolidate every application, deadline, and document into a
                    single workspace — so your team stops juggling spreadsheets
                    and starts winning more funding.
                  </p>
                </div>
              </div>
            </div>
            <div className='col-md-4'>
              <div className='box-info box-info-1 text-white mb-50 anim-scaledown-seq'>
                <div className='box-icon icon x2 colorful-icon mr-20'>
                  <i className='fa fa-calendar-check-o' style={{ color: 'white' }}></i>
                </div>
                <div className='box-content'>
                  <h4 className='capitalized'>Never Miss a Critical Deadline</h4>
                  <p>
                    Automated reminders for closing dates, milestone reports, and
                    acquittals keep your team ahead of schedule — protecting every
                    funding opportunity you have worked to secure.
                  </p>
                </div>
              </div>
            </div>
            <div className='col-md-4'>
              <div className='box-info box-info-1 text-white mb-50 anim-scaledown-seq'>
                <div className='box-icon icon x2 colorful-icon mr-20'>
                  <i className='fa fa-users' style={{ color: 'white' }}></i>
                </div>
                <div className='box-content'>
                  <h4 className='capitalized'>Keep Your Whole Team in Sync</h4>
                  <p>
                    Assign tasks, track progress, and collaborate across
                    departments in real time — so everyone knows exactly what
                    needs to happen and when.
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
                  <h4 className='capitalized'>Focus Effort Where It Matters Most</h4>
                  <p>
                    Clear dashboards and reporting give you an instant view of
                    grant health, team workload, and upcoming priorities — so
                    nothing important slips through the cracks.
                  </p>
                </div>
              </div>
            </div>
            <div className='col-md-4'>
              <div className='box-info box-info-1 text-white mb-md-50 anim-scaledown-seq'>
                <div className='box-icon icon x2 colorful-icon mr-20'>
                  <i className='fa fa-bell' style={{ color: 'white' }}></i>
                </div>
                <div className='box-content'>
                  <h4 className='capitalized'>Automated Reminders, Zero Surprises</h4>
                  <p>
                    Set it once and let Grant Maestro handle the follow-up.
                    Deadline alerts, reporting reminders, and renewal notifications
                    are sent automatically — to the right people, at the right time.
                  </p>
                </div>
              </div>
            </div>
            <div className='col-md-4'>
              <div className='box-info box-info-1 text-white anim-scaledown-seq'>
                <div className='box-icon icon x2 colorful-icon mr-20'>
                  <i className='fa fa-folder-open' style={{ color: 'white' }}></i>
                </div>
                <div className='box-content'>
                  <h4 className='capitalized'>Every File, Instantly Accessible</h4>
                  <p>
                    Securely store all grant documents, correspondence, and
                    evidence in one central location — searchable, organised, and
                    always ready for audit or acquittal.
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
