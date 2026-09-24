import React, { useEffect, useRef } from 'react'

const TURNSTILE_SCRIPT_ID = 'grantmaestro-turnstile-script'

const loadTurnstile = () => new Promise((resolve, reject) => {
  if (window.turnstile) {
    resolve(window.turnstile)
    return
  }

  const existing = document.getElementById(TURNSTILE_SCRIPT_ID)
  if (existing) {
    existing.addEventListener('load', () => resolve(window.turnstile), { once: true })
    existing.addEventListener('error', () => reject(new Error('Unable to load verification service.')), { once: true })
    return
  }

  const script = document.createElement('script')
  script.id = TURNSTILE_SCRIPT_ID
  script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
  script.async = true
  script.defer = true
  script.onload = () => resolve(window.turnstile)
  script.onerror = () => reject(new Error('Unable to load verification service.'))
  document.head.appendChild(script)
})

/**
 * Cloudflare Turnstile is rendered explicitly so tokens are never trusted by the
 * browser alone. The API verifies every token before it accepts a contact form.
 */
export default function TurnstileWidget({ siteKey, onVerify, onExpire, onError }) {
  const elementRef = useRef(null)
  const widgetIdRef = useRef(null)
  const callbacksRef = useRef({ onVerify, onExpire, onError })

  useEffect(() => {
    callbacksRef.current = { onVerify, onExpire, onError }
  }, [onVerify, onExpire, onError])

  useEffect(() => {
    let active = true

    if (!siteKey || !elementRef.current) return undefined

    loadTurnstile()
      .then((turnstile) => {
        if (!active || !turnstile || !elementRef.current) return

        widgetIdRef.current = turnstile.render(elementRef.current, {
          sitekey: siteKey,
          action: 'contact',
          theme: 'light',
          callback: (token) => callbacksRef.current.onVerify?.(token),
          'expired-callback': () => callbacksRef.current.onExpire?.(),
          'error-callback': () => callbacksRef.current.onError?.(),
        })
      })
      .catch(() => {
        if (active) callbacksRef.current.onError?.()
      })

    return () => {
      active = false
      if (widgetIdRef.current !== null && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current)
      }
      widgetIdRef.current = null
    }
  }, [siteKey])

  return <div ref={elementRef} aria-label='Human verification' />
}
