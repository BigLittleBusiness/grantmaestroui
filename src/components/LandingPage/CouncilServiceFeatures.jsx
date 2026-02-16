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
                  <i className='fa fa-clipboard' style={{ color: 'white' }}></i>
                </div>
                <div className='box-content'>
                  <h4 className='capitalized'>
                    Missing Grant Deadlines Costs Your Community
                  </h4>
                  <p>
                    Juggling grants? Manage every application in one place and
                    let your team contribute with ease.
                  </p>
                </div>
              </div>
            </div>
            <div className='col-md-4'>
              <div className='box-info box-info-1 text-white mb-50 anim-scaledown-seq'>
                <div className='box-icon icon x2 colorful-icon mr-20'>
                  <i
                    className='fa fa-line-chart'
                    style={{ color: 'white' }}
                  ></i>
                </div>
                <div className='box-content'>
                  <h4 className='capitalized'>
                    Spreadsheet Chaos Slowing Down Your Team
                  </h4>
                  <p>
                    Excel has been a great tool for years but now you have
                    something better, much better!
                  </p>
                </div>
              </div>
            </div>
            <div className='col-md-4'>
              <div className='box-info box-info-1 text-white mb-50 anim-scaledown-seq'>
                <div className='box-icon icon x2 colorful-icon mr-20'>
                  <i className='fa fa-share-alt'></i>
                </div>
                <div className='box-content'>
                  <h4 className='capitalized'>
                    Missing documentation for each grant
                  </h4>
                  <p>
                    Team out of sync? Work together in real time so everyone
                    knows grant progress and what’s due next.
                  </p>
                </div>
              </div>
            </div>
            <div className='col-md-4'>
              <div className='box-info box-info-1 text-white mb-md-50 anim-scaledown-seq'>
                <div className='box-icon icon x2 colorful-icon mr-20'>
                  <i className='fa fa-lightbulb-o'></i>
                </div>
                <div className='box-content'>
                  <h4 className='capitalized'>Team Members Working in Silos</h4>
                  <p>
                    Unclear on priorities? Use clear reports and insights to
                    focus your efforts where they matter most.
                  </p>
                </div>
              </div>
            </div>
            <div className='col-md-4'>
              <div className='box-info box-info-1 text-white mb-md-50 anim-scaledown-seq'>
                <div className='box-icon icon x2 colorful-icon mr-20'>
                  <i className='fa fa-bell'></i>
                </div>
                <div className='box-content'>
                  <h4 className='capitalized'>
                    Reporting to Council Taking Too Long
                  </h4>
                  <p>
                    Forgetting key dates? Automate reminders for deadlines,
                    reports, and renewals so nothing is missed.
                  </p>
                </div>
              </div>
            </div>
            <div className='col-md-4'>
              <div className='box-info box-info-1 text-white anim-scaledown-seq'>
                <div className='box-icon icon x2 colorful-icon mr-20'>
                  <i className='fa fa-folder'></i>
                </div>
                <div className='box-content'>
                  <h4 className='capitalized'>
                    Public Transparency Requirements Overwhelming
                  </h4>
                  <p>
                    Lost in paperwork? Securely store all grant files and emails
                    for quick, easy access when you need them.
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
