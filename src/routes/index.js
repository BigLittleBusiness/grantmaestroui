import React, { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'

const ProtectedRoutes = lazy(() => import('./ProtectedRoutes'))
const Home = lazy(() => import('pages/Home'))
const NonProfitHomePage = lazy(() => import('pages/NonProfitHomePage'))
const CouncilsPage = lazy(() => import('pages/CouncilsPage'))
const UniversitiesPage = lazy(() => import('pages/UniversitiesPage'))
const ReligiousOrganisationsPage = lazy(() => import('pages/ReligiousOrganisationsPage'))
const LoginPage = lazy(() => import('pages/Auth/LoginPage'))
const RegisterPage = lazy(() => import('pages/Auth/RegisterPage'))
const ForgotPasswordPage = lazy(() => import('pages/Auth/ForgotPasswordPage'))
const ResetPasswordPage = lazy(() => import('pages/Auth/ResetPasswordPage'))
const UnauthenticatedLayout = lazy(() => import('layouts/UnauthenticatedLayout'))
const PrivacyPolicyPage = lazy(() => import('pages/LegalPages').then((module) => ({ default: module.PrivacyPolicyPage })))
const TermsOfServicePage = lazy(() => import('pages/LegalPages').then((module) => ({ default: module.TermsOfServicePage })))
const SupportPage = lazy(() => import('pages/LegalPages').then((module) => ({ default: module.SupportPage })))
const ContactPage = lazy(() => import('pages/ContactPage'))
const PortfolioReadinessPage = lazy(() => import('pages/PortfolioReadinessPage'))

const LoadingPage = () => <main id='main-content' tabIndex='-1' className='gm-route-loading' aria-live='polite'>Loading GrantMaestro…</main>
const publicPage = (element) => <Suspense fallback={<LoadingPage />}>{element}</Suspense>
const authPage = (element) => publicPage(<UnauthenticatedLayout>{element}</UnauthenticatedLayout>)

const AppRoutes = () => (
  <Routes>
    <Route path='/' element={publicPage(<Home />)} />
    <Route path='/nonprofits' element={publicPage(<NonProfitHomePage />)} />
    <Route path='/universities' element={publicPage(<UniversitiesPage />)} />
    <Route path='/councils' element={publicPage(<CouncilsPage />)} />
    <Route path='/privacy-policy' element={publicPage(<PrivacyPolicyPage />)} />
    <Route path='/terms-of-service' element={publicPage(<TermsOfServicePage />)} />
    <Route path='/support' element={publicPage(<SupportPage />)} />
    <Route path='/contact' element={publicPage(<ContactPage />)} />
    <Route path='/grant-portfolio-readiness' element={publicPage(<PortfolioReadinessPage />)} />
    <Route path='/religious-organisations' element={publicPage(<ReligiousOrganisationsPage />)} />
    <Route path='/login' element={authPage(<LoginPage />)} />
    <Route path='/register' element={authPage(<RegisterPage />)} />
    <Route path='/forgot-password' element={authPage(<ForgotPasswordPage />)} />
    <Route path='/reset-password' element={authPage(<ResetPasswordPage />)} />
    <Route path='/*' element={publicPage(<ProtectedRoutes />)} />
  </Routes>
)
export default AppRoutes
