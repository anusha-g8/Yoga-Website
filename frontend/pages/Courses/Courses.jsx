import { API_BASE_URL, STRIPE_PUBLISHABLE_KEY } from '../../src/config';
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '../../components/Payment/CheckoutForm';
import { trackActivity } from '../../src/utils/tracker';

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Stripe state
  const [clientSecret, setClientSecret] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [enrollmentDetails, setEnrollmentDetails] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/programs`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setCourses(data);
        } else {
          console.error('Data is not an array:', data);
          setError('Invalid data format received from server.');
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching programs:', err);
        setError('Failed to load courses. Please check if the backend is running.');
        setLoading(false);
      });
    }, []);

    const handleEnroll = async (programId) => {
    const course = courses.find(c => c.id === programId);
    const token = localStorage.getItem('memberToken');
    const storedName = localStorage.getItem('memberName');
    const storedEmail = localStorage.getItem('memberEmail');

    let userName = storedName;
    let userEmail = storedEmail;

    if (!token || !userName || !userEmail) {
      userName = prompt('Enter your name:', storedName || '');
      if (!userName) {
        alert('Name is required for enrollment');
        return;
      }
      userEmail = prompt('Enter your email:', storedEmail || '');
      if (!userEmail) {
        alert('Email is required for enrollment');
        return;
      }
    }

    setEnrollmentDetails({ userName, userEmail, programId });
    setSelectedCourse(course);

    try {
      // Create PaymentIntent on the server
      const response = await fetch(`${API_BASE_URL}/payments/create-intent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ program_id: programId, user_email: userEmail })
      });
      
      const data = await response.json();
      if (response.ok) {
        setClientSecret(data.clientSecret);
        setShowCheckout(true);
        trackActivity({
          type: 'PAYMENT_INITIATED',
          description: `Started enrollment for ${course.title}`,
          metadata: { programId, courseTitle: course.title }
        });
      } else {
        alert(data.message || 'Failed to initialize payment.');
      }
    } catch (error) {
      console.error('Payment initialization error:', error);
      alert('An error occurred during payment setup.');
    }
  };

  const handlePaymentSuccess = async (paymentIntentId) => {
    const { userName, userEmail, programId } = enrollmentDetails;
    const token = localStorage.getItem('memberToken');

    try {
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['x-auth-token'] = token;

      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ 
          user_name: userName, 
          user_email: userEmail, 
          program_id: programId,
          stripe_payment_intent_id: paymentIntentId,
          payment_status: 'paid'
        })
      });
      
      if (response.ok) {
        alert('Enrollment successful! You can now access the course in your dashboard.');
        setShowCheckout(false);
        setClientSecret("");
        trackActivity({
          type: 'ENROLLMENT_SUCCESS',
          description: `Successfully enrolled in ${selectedCourse?.title}`,
          metadata: { programId, courseTitle: selectedCourse?.title, paymentIntentId }
        });
      } else {
        alert('Payment confirmed but enrollment record failed. Please contact support.');
      }
    } catch (error) {
      console.error('Enrollment error:', error);
    }
  };


  if (loading) return <div className='container my-5 text-center'>Loading courses...</div>;

  return (
    <div className='container my-5'>
      <h1 className='text-center mb-5' style={{ color: 'var(--lav-600)' }}>Online Courses & Packages</h1>
      
      {showCheckout && clientSecret && (
        <div className="row justify-content-center mb-5">
          <div className="col-md-6">
            <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
              <CheckoutForm 
                amount={selectedCourse?.price} 
                onCancel={() => setShowCheckout(false)}
                onSuccess={handlePaymentSuccess}
              />
            </Elements>
          </div>
        </div>
      )}

      {error && (
        <div className='alert alert-danger text-center mb-4'>
          {error}
        </div>
      )}

      <div className='row g-4'>
        {courses.length > 0 ? (
          courses.map((course) => (
            <div key={course.id} className='col-12 col-md-4'>
              <div className='card h-100 shadow-sm border-0'>
                <img src={course.image_url} className='card-img-top' alt={course.title} style={{ height: '180px', objectFit: 'cover' }} />
                <div className='card-body'>
                  <h5 className='card-title fw-bold'>{course.title}</h5>
                  <p className='card-text text-muted small'>{course.description}</p>
                  <div className='mt-3 d-flex justify-content-between align-items-center'>
                    <span className='text-muted small'><i className='bi bi-clock me-1'></i>{course.duration}</span>
                    <span className='fw-bold text-primary fs-5'>€{course.price}</span>
                  </div>
                </div>
                <div className='card-footer bg-transparent border-0 pb-3'>
                  <button 
                    className='btn btn-primary w-100'
                    onClick={() => handleEnroll(course.id)}
                  >
                    Enroll Now
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className='col-12 text-center py-5'>
            <p className='text-muted'>
              {error ? 'Could not load courses' : 'No courses currently available. Please check back later!'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
