import React from 'react'
import { Toaster } from 'react-hot-toast'
import 'assets/css/style.css'

const UnauthenticatedLayout = ({ children }) => {
  return (
    <div>
      <Toaster />
      <main>{children}</main>
    </div>
  )
}

export default UnauthenticatedLayout
