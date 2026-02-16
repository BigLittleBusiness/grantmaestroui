import { useEffect, useState, useRef } from 'react'
import api from 'api'

function useAuth() {
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  const hasCalledRef = useRef(false)

  useEffect(() => {
    if (hasCalledRef.current) return
    hasCalledRef.current = true

    const verifyAuth = async () => {
      try {
        await api.post('/auth/verify', {}, { withCredentials: true })
        setAuthenticated(true)
      } catch (error) {
        setAuthenticated(false)
      } finally {
        setLoading(false)
      }
    }

    verifyAuth()
  }, [])

  return { authenticated, loading }
}

export default useAuth
