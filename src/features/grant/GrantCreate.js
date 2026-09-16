import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import GrantFinding from './GrantFinding'
import { createGrant, crearSingleGrant } from './grantSlice'
import './grant-create.css'

export default function GrantCreate() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  useEffect(() => { dispatch(crearSingleGrant()) }, [dispatch])

  const handleGrantFindingSubmit = async (values) => {
    try {
      const response = await dispatch(createGrant({ ...values, note_type: 1 })).unwrap()
      const id = response.data?.grant?.organization_grant_id || response.grant?.organization_grant_id
      if (!id) throw new Error('The grant was created but its workspace could not be opened.')
      navigate(`/grant/edit/${id}?tab=suitability`)
    } catch (error) {
      toast.error(error?.message || 'The grant could not be created. Please review the details and try again.')
    }
  }

  return <main className='gm-grant-create content container-fluid'>
    <header className='gm-grant-create__header'><div><p>New grant workflow</p><h1>Add a grant</h1><span>Step 1 of 3 · Capture the opportunity, then assess suitability and plan the application.</span></div></header>
    <section className='gm-grant-create__guide' aria-label='Grant creation guidance'><div><strong>Start with what you know</strong><span>Record the funding opportunity, its source, value and key dates. You can expand the record after it is saved.</span></div><ol><li><b>1</b> Capture opportunity</li><li><b>2</b> Assess suitability</li><li><b>3</b> Assign application work</li></ol></section>
    <section className='gm-grant-create__form'><GrantFinding onSubmit={handleGrantFindingSubmit} showTitle={false} /></section>
  </main>
}
