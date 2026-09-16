import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchGrant } from './grantSlice'
import { useParams, Link } from 'react-router-dom'
import GeneralInformation from 'features/grant/grantDetailsFeature/GeneralInformation'
import WonLost from 'features/grant/grantDetailsFeature/WonLost'
import Internal from 'features/grant/grantDetailsFeature/Internal'
import TeamTask from 'features/grant/grantDetailsFeature/TeamTask'
import GrantNote from 'features/grant/GrantNote'
import GrantFileVault from 'features/grant/GrantFileVault'
import GrantTabs from 'features/grant/GrantTabs'
import GrantControlPanel from 'features/grant/GrantControlPanel'
import './grant-workspace.css'

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
    return <section className='gm-workspace-state' aria-live='polite'><div className='spinner-border text-primary' aria-hidden='true' /><h2>Loading grant workspace</h2><p>Preparing the grant record, tasks, evidence and reporting details.</p></section>
  }

  if (error || !grant) {
    return <section className='gm-workspace-state gm-workspace-state--error' role='alert'><h2>We could not open this grant</h2><p>{error || 'The grant may have been removed or you may not have access to it.'}</p><Link to='/grant' className='btn btn-primary'>Return to portfolio</Link></section>
  }

  return (
    <div className='gm-grant-workspace'>
      <div className='gm-grant-workspace__breadcrumb'><Link to='/grant'>Grant portfolio</Link><span aria-hidden='true'>/</span><span>{grant.grant_title}</span></div>
      <GrantControlPanel grantId={id} fallbackGrant={grant} />
      <div className='row'>
        <GeneralInformation grant={grant} />
        <WonLost grant={grant} />
        <Internal grant={grant} />
      </div>
      <div className='row'>
        <div className='col-xl-8 col-md-8'>
          <div className='card super-admin-dash-card p-2 pt-3'>
            <GrantTabs viewOnly={true} />
          </div>
        </div>
        <TeamTask />
      </div>
      <div className='row'>
        <GrantNote />
        <GrantFileVault />
      </div>
    </div>
  )
}

export default GrantDetails
