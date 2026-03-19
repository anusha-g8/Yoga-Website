import React, { useState } from 'react';

import { API_BASE_URL } from '../../src/config';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setStatus({ type: 'error', message: 'Email is required.' });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus({ type: 'error', message: 'Please enter a valid email address.' });
      return;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/newsletter/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      if (response.ok) {
        setStatus({ type: 'success', message: 'Thank you for subscribing!' });
        setEmail('');
      } else {
        setStatus({ type: 'error', message: data.message || 'Subscription failed.' });
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Server error. Please try again later.' });
    }
    setTimeout(() => setStatus({ type: '', message: '' }), 5000);
  };

  return (
    <section className="newsletter container center">
      <h3>Join the newsletter</h3>
      <p className="muted">Get updates about new classes, workshops, and offers.</p>
      {status.message && (
        <p style={{ color: status.type === 'success' ? 'green' : 'red', fontSize: '0.9rem' }}>
          {status.message}
        </p>
      )}
      <form className="newsletter-form" onSubmit={handleSubmit}>
        <input 
          type="email" 
          placeholder="your@email.com" 
          aria-label="Email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required 
        />
        <button className="btn-primary" type="submit">Subscribe</button>
      </form>
    </section>
  );
};

export default Newsletter;

/* no props for newsletter component */
