import axios from 'axios'
import baseServerUrl from '../config/apiConfig'

const api = axios.create({
  baseURL: baseServerUrl,
  withCredentials: true, // ✅ Ensures cookies are sent with requests
})

// The API answers SUBSCRIPTION_EXPIRED once an organisation's subscription has
// ended: 402 for the Organisation Admin (who may still pay) and 401 for other
// users, whose session has been ended.
api.interceptors.response.use(undefined, (error) => {
  const { status, data } = error?.response || {}
  if (data?.code === 'SUBSCRIPTION_EXPIRED') {
    const { pathname } = window.location
    if (status === 402 && !pathname.startsWith('/payment/')) {
      window.location.assign('/payment/checkout')
    } else if (status === 401 && pathname !== '/login') {
      window.location.assign('/login?reason=subscription-ended')
    }
  }
  return Promise.reject(error)
})

export default api
