import { useEffect } from 'react'
import GrantFinding from './GrantFinding'
import { createGrant } from './grantSlice'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { crearSingleGrant } from './grantSlice'

const GrantCreate = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  useEffect(() => {
    dispatch(crearSingleGrant())
  }, [])
  const handleGrantFindingSubmit = (values) => {
    dispatch(createGrant({ ...values, note_type: 1 }))
      .unwrap()
      .then((response) => {
        navigate(
          `/grant/edit/${response.data?.grant?.organization_grant_id}?tab=suitability`
        )
      })
      .catch((err) => {
        console.error('Failed to create grant: ', err)
      })
  }

  return (
    <div>
      <div className='row'>
        <GrantFinding onSubmit={handleGrantFindingSubmit} showTitle={false} />
      </div>
    </div>
  )
}

export default GrantCreate
