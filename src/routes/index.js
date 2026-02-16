import React from 'react'
import { Route, Routes } from 'react-router-dom'
import ProtectedRoutes from './ProtectedRoutes'
import NonProfitHomePage from 'pages/NonProfitHomePage'
import CouncilsPage from 'pages/CouncilsPage'
import { useSelector } from 'react-redux'
import Home from 'pages/Home'
import LoginPage from 'pages/Auth/LoginPage'
import RegisterPage from 'pages/Auth/RegisterPage'
import UnauthenticatedLayout from 'layouts/UnauthenticatedLayout'
import UniversitiesPage from 'pages/UniversitiesPage'
import ReligiousOrganisationsPage from 'pages/ReligiousOrganisationsPage'
import ForgotPasswordPage from 'pages/Auth/ForgotPasswordPage'
import ResetPasswordPage from 'pages/Auth/ResetPasswordPage'

const AppRoutes = () => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn)

  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/nonprofits' element={<NonProfitHomePage />} />
      <Route path='/universities' element={<UniversitiesPage />} />
      <Route path='/councils' element={<CouncilsPage />} />
      <Route
        path='/religious-organisations'
        element={<ReligiousOrganisationsPage />}
      />
      <Route
        path='/login'
        element={
          <UnauthenticatedLayout>
            <LoginPage />
          </UnauthenticatedLayout>
        }
      />
      <Route
        path='/register'
        element={
          <UnauthenticatedLayout>
            <RegisterPage />
          </UnauthenticatedLayout>
        }
      />
      <Route
        path='/forgot-password'
        element={
          <UnauthenticatedLayout>
            <ForgotPasswordPage />
          </UnauthenticatedLayout>
        }
      />
      <Route
        path='/reset-password'
        element={
          <UnauthenticatedLayout>
            <ResetPasswordPage />
          </UnauthenticatedLayout>
        }
      />
      <Route path='/*' element={<ProtectedRoutes />} />
    </Routes>
  )
}

export default AppRoutes
