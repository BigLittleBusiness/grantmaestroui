import React, { useState } from 'react'

export const PASSWORD_POLICY = 'Use at least 8 characters, including one uppercase letter and one special character.'

export function FieldError({ id, error }) {
  return error ? <p id={id} className='gm-field-error' role='alert'>{error}</p> : null
}

export function PasswordField({
  id,
  name,
  label,
  value,
  onChange,
  onBlur,
  error,
  autoComplete = 'new-password',
  required = true,
  helperText = PASSWORD_POLICY,
}) {
  const [visible, setVisible] = useState(false)
  const errorId = `${id}-error`
  const helpId = `${id}-help`
  const describedBy = [helperText ? helpId : '', error ? errorId : ''].filter(Boolean).join(' ') || undefined

  return (
    <div className='form-group gm-auth-field'>
      <label htmlFor={id} className='form-label float-start'>
        {label}{required && <span className='gm-required-mark' aria-hidden='true'> *</span>}
      </label>
      <div className='gm-password-control'>
        <input
          name={name}
          type={visible ? 'text' : 'password'}
          className={`form-control${error ? ' is-invalid' : ''}`}
          autoComplete={autoComplete}
          id={id}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          required={required}
          aria-required={required || undefined}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
        />
        <button
          type='button'
          className='gm-password-toggle'
          onClick={() => setVisible((current) => !current)}
          aria-label={`${visible ? 'Hide' : 'Show'} ${label.toLowerCase()}`}
          aria-pressed={visible}
        >
          {visible ? 'Hide' : 'Show'}
        </button>
      </div>
      {helperText && <p id={helpId} className='gm-field-help'>{helperText}</p>}
      <FieldError id={errorId} error={error} />
    </div>
  )
}

export function FormErrorSummary({ errors, label = 'Please correct the highlighted fields.' }) {
  const messages = Object.values(errors || {}).filter(Boolean)
  if (!messages.length) return null

  return (
    <div className='gm-form-error-summary' role='alert' tabIndex='-1' id='form-error-summary'>
      <strong>{label}</strong>
      <ul>{messages.map((message) => <li key={message}>{message}</li>)}</ul>
    </div>
  )
}
