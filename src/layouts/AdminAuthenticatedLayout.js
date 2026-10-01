import React from 'react'
import AuthenticatedLayout from './AuthenticatedLayout'

/**
 * Role-restricted pages: platform admin pages (/admin/*) and organisation
 * admin pages. Access per path is defined in utils/roleAccess.js.
 */
const AdminAuthenticatedLayout = ({ children }) => (
  <AuthenticatedLayout restricted>{children}</AuthenticatedLayout>
)

export default AdminAuthenticatedLayout
