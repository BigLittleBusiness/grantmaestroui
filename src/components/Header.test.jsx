import React from 'react'
import { render, screen } from '@testing-library/react'
import Footer from './LandingPage/Footer'

test('footer exposes public legal links', () => {
  render(<Footer />)
  expect(screen.getAllByRole('link', { name: 'Privacy Policy' })[0]).toHaveAttribute('href', '/privacy-policy')
  expect(screen.getAllByRole('link', { name: 'Terms of Service' })[0]).toHaveAttribute('href', '/terms-of-service')
})
