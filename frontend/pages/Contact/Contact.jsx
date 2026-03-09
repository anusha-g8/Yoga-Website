import React, { useState } from 'react';

const Contact = () => {
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
    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setStatus({ type: 'success', message: 'Inquiry sent successfully!' });
        setFormData({ user_name: '', user_email: '', message: '' });
      } else {
        setStatus({ type: 'danger', message: 'Failed to send inquiry.' });
      }
    } catch (error) {
      setStatus({ type: 'danger', message: 'Error connecting to server.' });
    }
  };

  return (
    <div className="container my-5">
      <h1 className="text-center mb-5" style={{ color: 'var(--lav-600)' }}>Contact Us</h1>
      <div className="row justify-content-center">
        <div className="col-12 col-md-6">
          {status.message && (
            <div className={`alert alert-${status.type}`} role="alert">
              {status.message}
            </div>
          )}
          <form onSubmit={handleSubmit} className="shadow p-4 rounded bg-white">
            <div className="mb-3">
              <label htmlFor="user_name" className="form-label">Name</label>
              <input type="text" className="form-control" id="user_name" name="user_name" value={formData.user_name} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label htmlFor="user_email" className="form-label">Email</label>
              <input type="email" className="form-control" id="user_email" name="user_email" value={formData.user_email} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label htmlFor="message" className="form-label">Message</label>
              <textarea className="form-control" id="message" name="message" rows="4" value={formData.message} onChange={handleChange} required></textarea>
            </div>
            <button type="submit" className="btn btn-primary w-100">Send Inquiry</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
