import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { viewProfile } from 'features/auth/authSlice'

/**
 * Returns the signed-in user, re-fetching the profile after a page refresh
 * (the Redux store is not persisted). `loading` stays true until the user,
 * and therefore their role, is known.
 */
export default function useCurrentUser() {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)
  const profileChecked = useSelector((state) => state.auth.profileChecked)

  useEffect(() => {
    if (!user && !profileChecked) dispatch(viewProfile())
  }, [user, profileChecked, dispatch])

  return { user, loading: !user && !profileChecked }
}
