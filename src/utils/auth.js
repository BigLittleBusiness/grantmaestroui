import axios from 'axios'
import { logout } from '../features/auth/authSlice'

export const validateAuthToken = async (dispatch) => {
  const token = localStorage.getItem('authToken')
  if (!token || token === 'undefined') {
    return false
  }
  return true
}
