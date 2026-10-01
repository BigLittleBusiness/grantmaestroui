// Mirrors the backend role policy in backend/src/utils/routeAccessHelper.js.
export const ROLE = Object.freeze({
  ORGANISATION_ADMIN: 1,
  PLATFORM_SUPER_ADMIN: 2,
  TEAM_MEMBER: 3,
  ACQUITTAL_CONTRIBUTOR: 4,
})

const ORGANISATION_USERS = [ROLE.ORGANISATION_ADMIN, ROLE.TEAM_MEMBER, ROLE.ACQUITTAL_CONTRIBUTOR]
const ALL_USERS = [...ORGANISATION_USERS, ROLE.PLATFORM_SUPER_ADMIN]

// Pages rendered in AdminAuthenticatedLayout, by path prefix. First match wins;
// anything unlisted is for organisation admins only.
const PAGE_ACCESS = [
  ['/admin/', [ROLE.PLATFORM_SUPER_ADMIN]],
  ['/change-password', ALL_USERS],
  ['/tickets', ORGANISATION_USERS],
  ['/submit-ticket', ORGANISATION_USERS],
  ['/update-ticket/', ORGANISATION_USERS],
  ['/privacy-setting', ORGANISATION_USERS],
]

export const isSuperAdmin = (user) => Number(user?.user_role_id) === ROLE.PLATFORM_SUPER_ADMIN

export const canAccessPage = (user, pathname) => {
  const match = PAGE_ACCESS.find(([prefix]) => pathname.startsWith(prefix))
  const allowedRoles = match ? match[1] : [ROLE.ORGANISATION_ADMIN]
  return allowedRoles.includes(Number(user?.user_role_id))
}

/** Where a user lands when they open a page their role cannot use. */
export const homePathFor = (user) => (isSuperAdmin(user) ? '/admin/dashboard' : '/dashboard')

// Pages an Organisation Admin can still open once the subscription has ended.
const PAGES_WHILE_EXPIRED = ['/payment/', '/subscription', '/change-password', '/force-password-reset']

/**
 * The page to send a user to when their organisation's subscription has
 * ended (the API only allows billing calls), or null when no redirect is needed.
 */
export const subscriptionRedirectFor = (user, pathname) => {
  if (!user?.subscription_expired || isSuperAdmin(user)) return null
  return PAGES_WHILE_EXPIRED.some((prefix) => pathname.startsWith(prefix)) ? null : '/payment/checkout'
}
