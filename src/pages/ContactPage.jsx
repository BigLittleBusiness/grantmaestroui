import React, { useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import api from 'api'
import Header from 'components/LandingPage/Header'
import Footer from 'components/LandingPage/Footer'
import TurnstileWidget from 'components/contact/TurnstileWidget'
import './ContactPage.css'

const enquiryTypes = [
  { value: 'sales', label: 'Sales enquiry' },
  { value: 'demo', label: 'Request a demonstration' },
  { value: 'partnership', label: 'Partnership enquiry' },
  { value: 'support', label: 'Account or technical support' },
  { value: 'privacy', label: 'Privacy enquiry' },
  { value: 'general', label: 'General enquiry' },
]

const topicValues = new Set(enquiryTypes.map((type) => type.value))

const initialForm = (enquiryType) => ({
  name: '',
  organisation: '',
  email: '',
  phone: '',
  enquiryType,
  message: '',
  website: '',
})

export default function ContactPage() {
  const requestedTopic = useMemo(() => new URLSearchParams(window.location.search).get('topic'), [])
  const defaultTopic = topicValues.has(requestedTopic) ? requestedTopic : 'general'
  const [form, setForm] = useState(() => initialForm(defaultTopic))
  const [siteKey, setSiteKey] = useState('')
  const [captchaToken, setCaptchaToken] = useState('')
  const [captchaError, setCaptchaError] = useState('')
  const [configLoading, setConfigLoading] = useState(true)
  const [configError, setConfigError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    let mounted = true

    api.get('public/contact/config')
      .then((response) => {
        if (!mounted) return
        const configuredSiteKey = response.data?.data?.turnstileSiteKey
        if (!configuredSiteKey) {
          setConfigError('The contact form is temporarily unavailable. Please try again later.')
          return
        }
        setSiteKey(configuredSiteKey)
      })
      .catch(() => {
        if (mounted) setConfigError('The contact form is temporarily unavailable. Please try again later.')
      })
      .finally(() => {
        if (mounted) setConfigLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [])

  const updateField = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setFormError('')

    if (!captchaToken) {
      setCaptchaError('Please complete the security check before sending your enquiry.')
      return
    }

    setSubmitting(true)
    try {
      await api.post('public/contact', {
        ...form,
        captchaToken,
        sourceUrl: window.location.href,
      })
      setSubmitted(true)
      setForm(initialForm(form.enquiryType))
      setCaptchaToken('')
    } catch (error) {
      setFormError(error.response?.data?.message || 'Your enquiry could not be sent. Please try again shortly.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className='full-container'>
      <Helmet>
        <title>Contact GrantMaestro</title>
        <meta name='description' content='Contact GrantMaestro through our secure enquiry form.' />
        <meta name='robots' content='noindex,follow' />
      </Helmet>
      <Header />
      <main className='contact-page'>
        <section className='contact-hero'>
          <div className='contact-shell'>
            <p className='contact-eyebrow'>GrantMaestro enquiries</p>
            <h1>How can we help?</h1>
            <p>Use this secure form for sales, demonstrations, support, partnership or privacy enquiries. We do not publish contact email addresses on this site.</p>
          </div>
        </section>

        <section className='contact-shell contact-content'>
          {submitted ? (
            <div className='contact-confirmation' role='status' aria-live='polite'>
              <h2>Thank you — your enquiry has been sent.</h2>
              <p>Our team will review it and respond using the contact details you provided.</p>
              <button type='button' className='contact-secondary-button' onClick={() => setSubmitted(false)}>
                Send another enquiry
              </button>
            </div>
          ) : (
            <form className='contact-card' onSubmit={handleSubmit} noValidate>
              <div className='contact-card-heading'>
                <h2>Send an enquiry</h2>
                <p>Fields marked with an asterisk are required. Please do not include passwords, card details or other credentials.</p>
              </div>

              <div className='contact-grid'>
                <label>
                  Your name <span aria-hidden='true'>*</span>
                  <input name='name' value={form.name} onChange={updateField} autoComplete='name' maxLength='120' required />
                </label>
                <label>
                  Organisation
                  <input name='organisation' value={form.organisation} onChange={updateField} autoComplete='organization' maxLength='160' />
                </label>
                <label>
                  Email address <span aria-hidden='true'>*</span>
                  <input name='email' type='email' value={form.email} onChange={updateField} autoComplete='email' maxLength='254' required />
                </label>
                <label>
                  Phone number
                  <input name='phone' type='tel' value={form.phone} onChange={updateField} autoComplete='tel' maxLength='40' />
                </label>
                <label className='contact-full-width'>
                  Enquiry type <span aria-hidden='true'>*</span>
                  <select name='enquiryType' value={form.enquiryType} onChange={updateField} required>
                    {enquiryTypes.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}
                  </select>
                </label>
                <label className='contact-full-width'>
                  How can we help? <span aria-hidden='true'>*</span>
                  <textarea name='message' value={form.message} onChange={updateField} rows='7' maxLength='5000' required />
                </label>
              </div>

              <div className='contact-honeypot' aria-hidden='true'>
                <label>
                  Website
                  <input name='website' value={form.website} onChange={updateField} tabIndex='-1' autoComplete='off' />
                </label>
              </div>

              <div className='contact-verification'>
                <p className='contact-verification-label'>Security check <span aria-hidden='true'>*</span></p>
                {configLoading && <p>Loading security check…</p>}
                {configError && <p className='contact-error' role='alert'>{configError}</p>}
                {siteKey && !configError && (
                  <TurnstileWidget
                    key={submitted ? 'submitted' : 'contact'}
                    siteKey={siteKey}
                    onVerify={(token) => { setCaptchaToken(token); setCaptchaError('') }}
                    onExpire={() => { setCaptchaToken(''); setCaptchaError('The security check expired. Please complete it again.') }}
                    onError={() => { setCaptchaToken(''); setCaptchaError('The security check could not be completed. Please refresh and try again.') }}
                  />
                )}
                {captchaError && <p className='contact-error' role='alert'>{captchaError}</p>}
              </div>

              {formError && <p className='contact-error contact-form-error' role='alert'>{formError}</p>}
              <button className='contact-submit-button' type='submit' disabled={submitting || configLoading || Boolean(configError)}>
                {submitting ? 'Sending enquiry…' : 'Send enquiry'}
              </button>
            </form>
          )}
        </section>
      </main>
      <Footer />
    </div>
  )
}
