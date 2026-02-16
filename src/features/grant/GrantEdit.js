import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchGrant, updateGrant } from './grantSlice'
import { useParams } from 'react-router-dom'
import GrantTabs from './GrantTabs'

const GrantEdit = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const grant = useSelector((state) => state.grant.grant)
  const loading = useSelector((state) => state.grant.loading)
  const error = useSelector((state) => state.grant.error)

  useEffect(() => {
    dispatch(fetchGrant(id))
  }, [dispatch, id])

  return (
    <div>
      <div className='row'>
        <div className='card super-admin-dash-card p-2 pt-3 mb-0'>
          <div className='card-body myclass p-0'>
            <GrantTabs />
          </div>
        </div>
      </div>
    </div>
  )
}

export default GrantEdit
