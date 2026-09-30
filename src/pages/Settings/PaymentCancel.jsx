import React from 'react'

const PaymentCancel = () => {
  return (
    <div className='content container-fluid'>
      <div className='row justify-content-center mt-5'>
        <div className='col-lg-6 col-md-8 text-center'>
          <div className='card border-0 shadow-sm p-5'>
            <div className='mb-3'>
              <i className='fa fa-info-circle text-secondary' style={{ fontSize: '4rem' }} />
            </div>
            <h4 className='mb-3'>Checkout Cancelled</h4>
            <p className='text-muted mb-4'>
              You left Stripe checkout before paying, so you have not been charged. You can return to checkout whenever you are ready.
            </p>
            <div className='d-flex flex-wrap gap-2 justify-content-center'>
              <a href='/payment/checkout' className='btn btn-primary px-4'>Return to Checkout</a>
              <a href='/dashboard' className='btn btn-outline-secondary px-4'>Go to Dashboard</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentCancel
