import axios from 'axios'
import baseServerUrl from '../config/apiConfig'

const api = axios.create({
  baseURL: baseServerUrl,
  withCredentials: true, // ✅ Ensures cookies are sent with requests
})

export default api
