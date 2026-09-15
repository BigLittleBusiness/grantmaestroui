import React from 'react'
import { render, screen } from '@testing-library/react'
import { PrivacyPolicyPage, TermsOfServicePage } from './pages/LegalPages'

jest.mock('components/LandingPage/Header', () => () => <header>GrantMaestro navigation</header>)
jest.mock('components/LandingPage/Footer', () => () => <footer>GrantMaestro footer</footer>)

test('renders the public privacy policy content', () => {
  render(<PrivacyPolicyPage />)
  expect(screen.getByRole('heading', { name: 'Privacy Policy' })).toBeInTheDocument()
  expect(screen.getByText(/We do not sell personal information/i)).toBeInTheDocument()
})

test('renders the public terms of service content', () => {
  render(<TermsOfServicePage />)
  expect(screen.getByRole('heading', { name: 'Terms of Service' })).toBeInTheDocument()
  expect(screen.getByText(/does not provide legal, financial, tax, funding or professional advice/i)).toBeInTheDocument()
})
