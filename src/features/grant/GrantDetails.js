import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchGrant } from './grantSlice'
import { useParams } from 'react-router-dom'
import GeneralInformation from 'features/grant/grantDetailsFeature/GeneralInformation'
import WonLost from 'features/grant/grantDetailsFeature/WonLost'
import Internal from 'features/grant/grantDetailsFeature/Internal'
import TeamTask from 'features/grant/grantDetailsFeature/TeamTask'
import GrantNote from 'features/grant/GrantNote'
import GrantFileVault from 'features/grant/GrantFileVault'
import GrantTabs from 'features/grant/GrantTabs'

const GrantDetails = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const grant = useSelector((state) => state.grant.grant)
  const loading = useSelector((state) => state.grant.loading)
  const error = useSelector((state) => state.grant.error)

  useEffect(() => {
    dispatch(fetchGrant(id))
  }, [dispatch, id])

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  if (!grant) {
    return <div>No grant found</div>
  }
  console.log('grant', grant)
  return (
    <div>
      <div className='row'>
        <GeneralInformation grant={grant} />
        <WonLost grant={grant} />
        <Internal grant={grant} />
      </div>
      <div className='row'>
        <div className='col-xl-8 col-md-8'>
          <div
            className='card super-admin-dash-card p-2 pt-3'
            style={{ overflowY: 'auto', overflowX: 'hidden' }}
          >
            <GrantTabs viewOnly={true} />
          </div>
        </div>
        <TeamTask />
      </div>
      {/* <div className='row'>
        <GrantNote />
        <GrantFileVault />
      </div> */}
    </div>
  )
}

export default GrantDetails
