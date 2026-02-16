import React from 'react'
import 'components/LandingPage/BannerSection.css'
import BackGroundImage from 'assets/img/banner_bg.png'
import { defaultPText, defaultH1Text } from 'constants/index'

export default function BannerSection({
  bannerH1Text = defaultH1Text,
  bannerPText = defaultPText,
}) {
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
            <div className='row'>
              <div className='col-md-8'>
                <div className='banner-center-box text-white'>
                  <h1 className='anim-movebottom-seq'>{bannerH1Text}</h1>
                  <div className='description anim-movebottom-seq'>
                    {bannerPText}
                  </div>
                  <div className='col col-md-7 hb_form'></div>
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
