import React from 'react'
import 'components/LandingPage/BannerSection.css'
import BackGroundImage from 'assets/img/banner_bg.png'
import { defaultPText, defaultH1Text } from 'constants/index'
import { useNavigate } from 'react-router-dom'

export default function BannerSection({
  bannerH1Text = defaultH1Text,
  bannerPText = defaultPText,
  membershipPreference = '',
}) {
  const navigate = useNavigate()

  const handleTrialClick = () => {
    const query = membershipPreference
      ? `/register?membership-preference=${membershipPreference}`
      : '#pricing_section'
    if (membershipPreference) {
      navigate(query)
    } else {
      const el = document.getElementById('pricing_section')
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section id='banner' className='rounded-bottom' data-scroll-index='0'>
      <div className='banner-parallax'>
        <div
          className='bg-element'
          data-stellar-background-ratio='0.2'
          style={{
            backgroundImage: `url(${BackGroundImage})`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'top center',
            backgroundSize: 'cover',
          }}
        ></div>
        <div
          className='overlay-colored'
          data-bg-color='#000'
          data-bg-color-opacity='0.3'
        ></div>
        <div className='slide-content'>
          <div className='container'>
            <div className='row align-items-center'>
              <div className='col-md-7'>
                <div className='banner-center-box text-white'>
                  <h1 className='anim-movebottom-seq'>{bannerH1Text}</h1>
                  <div className='description anim-movebottom-seq'>
                    {bannerPText}
                  </div>
                  <div className='banner-cta mt-4 anim-movebottom-seq'>
                    <button
                      className='btn btn-primary btn-lg banner-trial-btn'
                      onClick={handleTrialClick}
                    >
                      Start Your Free 14-Day Trial
                    </button>
                    <span className='banner-cta-note'>
                      No credit card required
                    </span>
                  </div>
                </div>
              </div>
              <div className='col-md-5 d-none d-md-block'>
                <div className='banner-product-visual anim-movebottom-seq'>
                  <div className='product-visual-frame'>
                    <div className='product-visual-bar'>
                      <span></span><span></span><span></span>
                    </div>
                    <div className='product-visual-body'>
                      <div className='pv-header'>
                        <div className='pv-title'>Grant Dashboard</div>
                        <div className='pv-badge pv-badge-green'>14 Active</div>
                        <div className='pv-badge pv-badge-orange'>3 Due Soon</div>
                      </div>
                      <div className='pv-row'>
                        <div className='pv-label'>Infrastructure Grant</div>
                        <div className='pv-progress'>
                          <div className='pv-bar' style={{ width: '72%' }}></div>
                        </div>
                        <div className='pv-pct'>72%</div>
                      </div>
                      <div className='pv-row'>
                        <div className='pv-label'>Community Development</div>
                        <div className='pv-progress'>
                          <div className='pv-bar pv-bar-orange' style={{ width: '45%' }}></div>
                        </div>
                        <div className='pv-pct'>45%</div>
                      </div>
                      <div className='pv-row'>
                        <div className='pv-label'>Environmental Fund</div>
                        <div className='pv-progress'>
                          <div className='pv-bar pv-bar-green' style={{ width: '91%' }}></div>
                        </div>
                        <div className='pv-pct'>91%</div>
                      </div>
                      <div className='pv-row'>
                        <div className='pv-label'>Youth Services Grant</div>
                        <div className='pv-progress'>
                          <div className='pv-bar' style={{ width: '28%' }}></div>
                        </div>
                        <div className='pv-pct'>28%</div>
                      </div>
                      <div className='pv-tasks'>
                        <div className='pv-task-title'>Upcoming Tasks</div>
                        <div className='pv-task'><span className='pv-dot pv-dot-red'></span> Submit acquittal — 3 days</div>
                        <div className='pv-task'><span className='pv-dot pv-dot-orange'></span> Upload milestone report — 7 days</div>
                        <div className='pv-task'><span className='pv-dot pv-dot-green'></span> Review application draft — 14 days</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='separator-bottom'></div>
      </div>
    </section>
  )
}
