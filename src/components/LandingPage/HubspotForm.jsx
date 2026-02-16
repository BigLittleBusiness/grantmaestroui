import React, { useEffect } from 'react'

export default function HubSpotForm() {
  useEffect(() => {
    // Load the HubSpot Forms script
    const script = document.createElement('script')
    script.src = '//js-eu1.hsforms.net/forms/embed/v2.js'
    script.charset = 'utf-8'
    script.type = 'text/javascript'
    script.async = true
    script.onload = () => {
      // Create the HubSpot form once the script has loaded
      if (window.hbspt) {
        window.hbspt.forms.create({
          portalId: '145351162',
          formId: '94db7717-cf32-4af8-8509-37d38a6fe3bb',
          target: '#hubspotForm',
        })
      }
    }

    document.body.appendChild(script)

    // Cleanup function to remove the script when the component unmounts
    return () => {
      document.body.removeChild(script)
    }
  }, [])

  return (
    <div className='container hubspot' id='hubspot'>
      <div className='row'>
        <div className='col-12 col-lg-6 mx-auto p-5'>
          <div id='hubspotForm'></div>
        </div>
      </div>
    </div>
  )
}
