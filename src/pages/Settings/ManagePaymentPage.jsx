import React, { useState } from 'react'
import './settings.css'
import { loadStripe } from '@stripe/stripe-js'
import axios from 'axios'

export default function ManagePaymentPage() {
  const [paymentMethods, setPaymentMethods] = useState([
    { id: 1, type: 'Visa', last4: '1234', expiry: '12/26' },
    { id: 2, type: 'MasterCard', last4: '5678', expiry: '07/25' },
  ])

  const [newPayment, setNewPayment] = useState({
    cardNumber: '',
    expiryDate: '',
    cardholderName: '',
    cvv: '',
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewPayment((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAddPayment = (e) => {
    e.preventDefault()
    if (
      newPayment.cardNumber &&
      newPayment.expiryDate &&
      newPayment.cardholderName &&
      newPayment.cvv
    ) {
      const newMethod = {
        id: paymentMethods.length + 1,
        type: 'Card',
        last4: newPayment.cardNumber.slice(-4),
        expiry: newPayment.expiryDate,
      }
      setPaymentMethods((prev) => [...prev, newMethod])
      setNewPayment({
        cardNumber: '',
        expiryDate: '',
        cardholderName: '',
        cvv: '',
      })
      alert('Payment method added successfully!')
    } else {
      alert('Please fill in all fields.')
    }
  }

  const handleDeletePayment = (id) => {
    setPaymentMethods((prev) => prev.filter((method) => method.id !== id))
    alert('Payment method deleted successfully!')
  }

  const makePayment = async()=>{
    console.log(localStorage.getItem('authToken'))

    
    const headers = {
        "Content-Type":"application/json",
        "Authorization": `Bearer ${localStorage.getItem('authToken')}`,
    }
    const response = await axios.post("http://localhost:3005/v1/subscription/create-checkout-session",{'preferred_plan_id' : 'price_1RHMucRNoNos9SpYyb6Vrear', 'payment_made_for':2}, {
      headers:headers
    });

    console.log(response)

    const session = response?.data?.data;

    window.location.href = session.url

    // const result = stripe.redirectToCheckout({
    //     sessionId:session.id
    // });
    
    // if(result.error){
    //     console.log(result.error);
    // }
}

  return (
    <div className='content container-fluid'>
      {/* Page Header */}
      <div className='page-header'>
        <div className='content-page-header'>
          <h5>Manage Payment Methods</h5>
        </div>
      </div>
      {/* /Page Header */}

      <div className='row'>
        <div className='col-sm-12'>
          {/* Saved Payment Methods */}
          <div className='card mb-3'>
            <div className='card-header'>
              <h5>Saved Payment Methods</h5>
            </div>
            <div className='card-body'>
              {paymentMethods.map((method) => (
                <div className='payment-method mb-3' key={method.id}>
                  <span>
                    {method.type} **** {method.last4} (Exp: {method.expiry})
                  </span>
                  <div className='btn-group'>
                    <button
                      className='btn btn-sm btn-danger'
                      onClick={() => handleDeletePayment(method.id)}
                    >
                      Delete <i className='fa fa-close'></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add New Payment Method */}
          <div className='card'>
            <div className='card-header'>
              <h5>Add New Payment Method</h5>
            </div>
            <div className='card-body'>
              <form onSubmit={handleAddPayment}>
                <div className='mb-3'>
                  <label className='form-label'>Card Number</label>
                  <input
                    type='text'
                    className='form-control'
                    name='cardNumber'
                    placeholder='Enter card number'
                    value={newPayment.cardNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className='mb-3'>
                  <label className='form-label'>Expiry Date</label>
                  <input
                    type='month'
                    className='form-control'
                    name='expiryDate'
                    value={newPayment.expiryDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className='mb-3'>
                  <label className='form-label'>Cardholder Name</label>
                  <input
                    type='text'
                    className='form-control'
                    name='cardholderName'
                    placeholder='Enter cardholder name'
                    value={newPayment.cardholderName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className='mb-3'>
                  <label className='form-label'>CVV</label>
                  <input
                    type='password'
                    className='form-control'
                    name='cvv'
                    placeholder='Enter CVV'
                    value={newPayment.cvv}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <button type='submit' className='btn btn-primary mt-3'>
                  Add Payment Method
                </button>
              </form>
            </div>
          </div>
          <div className='card'>
            <button type='submit' className='btn btn-primary mt-3' onClick={makePayment}>Test Subscription</button>
          </div>
        </div>
      </div>
    </div>
  )
}
