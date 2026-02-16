import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from 'pages/Home'
import LoginPage from 'pages/Auth/LoginPage'
import RegisterPage from 'pages/Auth/RegisterPage'
import UnauthenticatedLayout from 'layouts/UnauthenticatedLayout'

const UnprotectedRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
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
    </Routes>
  )
}

export default UnprotectedRoutes
