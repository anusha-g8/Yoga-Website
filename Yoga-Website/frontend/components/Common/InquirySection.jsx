import { API_BASE_URL } from '../../src/config';
import React, { useState } from 'react';

const InquirySection = () => {
  const [formData, setFormData] = useState({
    user_name: '',
    user_email: '',
    message: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { user_name, user_email, message } = formData;

    if (!user_name.trim() || !user_email.trim() || !message.trim()) {
      setStatus({ type: 'danger', message: 'All fields are required.' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user_email)) {
      setStatus({ type: 'danger', message: 'Please enter a valid email address.' });
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setStatus({ type: 'success', message: 'Inquiry sent successfully!' });
        setFormData({ user_name: '', user_email: '', message: '' });
        setTimeout(() => setStatus({ type: '', message: '' }), 5000);
      } else {
        setStatus({ type: 'danger', message: 'Failed to send inquiry.' });
      }
    } catch (error) {
      setStatus({ type: 'danger', message: 'Error connecting to server.' });
    }
  };

  return (
    <section className="inquiry-section py-5 bg-light">
      <div className="container">
        <div className="row justify-content-center text-center mb-4">
          <div className="col-md-8">
            <h2 className="fw-bold" style={{ color: 'var(--lav-600)' }}>Have Questions?</h2>
            <p className="text-muted">Send us an inquiry and we'll get back to you as soon as possible.</p>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-md-6">
            {status.message && (
              <div className={`alert alert-${status.type} text-center`} role="alert">
                {status.message}
              </div>
            )}
            <form onSubmit={handleSubmit} className="p-4 rounded shadow bg-white border">
              <div className="row g-3">
                <div className="col-md-6 mb-3">
                  <label htmlFor="inquiry_name" className="form-label">Name</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="inquiry_name" 
                    name="user_name" 
                    value={formData.user_name} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="inquiry_email" className="form-label">Email</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    id="inquiry_email" 
                    name="user_email" 
                    value={formData.user_email} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                <div className="col-12 mb-3">
                  <label htmlFor="inquiry_message" className="form-label">Message</label>
                  <textarea 
                    className="form-control" 
                    id="inquiry_message" 
                    name="message" 
                    rows="3" 
                    value={formData.message} 
                    onChange={handleChange} 
                    required
                  ></textarea>
                </div>
                <div className="col-12">
                  <button type="submit" className="btn btn-primary w-100">Send Inquiry</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InquirySection;
