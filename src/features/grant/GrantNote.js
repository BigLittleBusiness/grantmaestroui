import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { addNote } from './grantSlice'

const validationSchema = yup.object({
  note: yup.string().required('Note is required'),
})

const GrantNote = () => {
  const [showForm, setShowForm] = useState(false)
  const dispatch = useDispatch()
  const notes = useSelector((state) => state.grant.notes)

  const formik = useFormik({
    initialValues: {
      note: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      dispatch(addNote(values))
      setShowForm(false)
    },
  })

  return (
    <div className='col-xl-6 col-md-6'>
      <div className='card'>
        <div className='card-body'>
          <h5 className='card-title'>Grant Notes</h5>
          <button className='btn btn-primary' onClick={() => setShowForm(true)}>
            Add Note
          </button>
          {showForm && (
            <form onSubmit={formik.handleSubmit} className='mt-3'>
              <div className='form-group'>
                <label>Note:</label>
                <textarea
                  name='note'
                  className='form-control'
                  onChange={formik.handleChange}
                  value={formik.values.note}
                />
                {formik.errors.note && (
                  <div className='text-danger'>{formik.errors.note}</div>
                )}
              </div>
              <button type='submit' className='btn btn-primary mt-3'>
                Save
              </button>
            </form>
          )}
          <ul className='mt-3'>
            {notes.map((note, index) => (
              <li key={index}>{note.note}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default GrantNote
