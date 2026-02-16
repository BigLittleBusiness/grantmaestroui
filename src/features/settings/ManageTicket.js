import React, {useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { manageTicket } from 'features/settings/settingsSlice'
import { useFormik } from 'formik'
import * as yup from 'yup'

const validationSchema = yup.object({
  ticket_title: yup.string().required('Subject is required'),
  ticket_description: yup.string().required('description is required'),
  support_ticket_file: yup.string().optional()
})

const ManageTicket = () => {
    const dispatch = useDispatch();
    const ticketInfo = useSelector((state) => state.settings.ticketInfo)
    // console.log(ticketInfo)
    const [supportFile, setSupportFile] = useState(null)
    
    const formik = useFormik({
        initialValues: {
            ticket_id: ticketInfo?.ticket_id || '',
            ticket_title: ticketInfo?.ticket_title || '',
            ticket_description: ticketInfo?.ticket_description || ''
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
        //   console.log(values)
          const formData = new FormData()
          formData.append('ticket_id', values.ticket_id)
          formData.append('ticket_title', values.ticket_title)
          formData.append('ticket_description', values.ticket_description)
          formData.append('support_ticket_file', supportFile)
          console.log(formData)
          
          dispatch(manageTicket(formData))
          formik.resetForm()
          setSupportFile(null)
        },
        enableReinitialize: true,
    })
    const handleReset = () => {
        formik.resetForm()
    }
    
    return (
        <>
        <div className='col-sm-12'>
            <div className='card'>
                <div className='card-body'>
                <form onSubmit={formik.handleSubmit}>
                    {/* Subject */}
                    <div className='mb-3'>
                    <label htmlFor='ticketTitle' className='form-label'>
                        Subject
                    </label>
                    <input
                        type='text'
                        className='form-control'
                        id='ticketTitle'
                        name='ticket_title'
                        placeholder='Enter subject'
                        value={formik.values.ticket_title}
                        onChange={formik.handleChange}
                        aria-describedby='ticket_title_error'
                    />
                    {formik.errors.ticket_title && (
                        <div id='ticket_title_error' className='text-danger'>
                        {formik.errors.ticket_title}
                        </div>
                    )}
                    </div>

                    {/* Description */}
                    <div className='mb-3'>
                        <label htmlFor='description' className='form-label'>
                            Description
                        </label>
                        <textarea
                            className='form-control'
                            id='description'
                            name='ticket_description'
                            rows='4'
                            placeholder='Describe your issue'
                            value={formik.values.ticket_description}
                            onChange={formik.handleChange}
                            aria-describedby='ticket_description_error'
                        ></textarea>
                        {formik.errors.ticket_description && (
                            <div id='ticket_description_error' className='text-danger'>
                            {formik.errors.ticket_description}
                            </div>
                        )}
                    </div>

                    {/* Attach File */}
                    <div className='mb-3'>
                        <label htmlFor='fileUpload' className='form-label'>
                            Attach File
                        </label>
                        <input
                            type='file'
                            name='support_ticket_file'
                            className='form-control'
                            id='fileUpload'
                            onChange={(event) => setSupportFile(event.target.files[0])}
                        />
                        {formik.errors.support_ticket_file && (
                            <div className='text-danger'>{formik.errors.support_ticket_file}</div>
                        )}
                    </div>

                    {/* Buttons */}
                    <div className='text-end'>
                        <button type='submit' className='btn btn-primary'>
                            Submit
                        </button>
                        <button
                            type='button'
                            className='btn btn-secondary ms-2'
                            onClick={handleReset}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
                </div>
            </div>
        </div>
        </>
    )
}

export default ManageTicket