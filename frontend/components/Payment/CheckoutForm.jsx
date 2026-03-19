import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';

const CheckoutForm = ({ amount, onCancel, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      return;
    }

    setIsLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });

    if (error) {
      if (error.type === "card_error" || error.type === "validation_error") {
        setMessage(error.message);
      } else {
        setMessage("An unexpected error occurred.");
      }
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      setMessage("Payment succeeded!");
      onSuccess(paymentIntent.id);
    }

    setIsLoading(false);
  };

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body p-4">
        <h5 className="card-title fw-bold mb-4">Complete Payment</h5>
        <p className="text-muted small mb-4">Total Amount: €{amount}</p>
        
        <form id="payment-form" onSubmit={handleSubmit}>
          <PaymentElement id="payment-element" options={{ layout: 'tabs' }} />
          
          {message && (
            <div className={`alert mt-3 ${message.includes('succeeded') ? 'alert-success' : 'alert-danger'}`} role="alert">
              {message}
            </div>
          )}

          <div className="d-flex gap-2 mt-4">
            <button 
              disabled={isLoading || !stripe || !elements} 
              id="submit" 
              className="btn btn-primary flex-grow-1"
            >
              <span id="button-text">
                {isLoading ? <span className="spinner-border spinner-border-sm me-2"></span> : null}
                Pay Now
              </span>
            </button>
            <button 
              type="button" 
              className="btn btn-outline-secondary" 
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutForm;
