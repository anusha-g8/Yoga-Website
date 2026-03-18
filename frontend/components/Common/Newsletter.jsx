import React, { useState } from 'react';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleSubmit = (e) => {
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
    
    // Simulate API call
    setStatus({ type: 'success', message: 'Thank you for subscribing!' });
    setEmail('');
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
