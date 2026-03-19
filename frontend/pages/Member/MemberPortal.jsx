import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../src/config';

const MemberPortal = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isLogin ? '/members/login' : '/members/register';
    const apiUrl = API_BASE_URL || '/api';
    
    // Normalize email before sending
    const submissionData = {
      ...formData,
      email: formData.email.toLowerCase()
    };
    
    try {
      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData)
      });

      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        // Handle non-JSON response (e.g. 404 or 500 HTML page)
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }

      if (response.ok) {
        localStorage.setItem('memberToken', data.token);
        localStorage.setItem('memberName', data.member?.name || 'Member');
        localStorage.setItem('memberEmail', data.member?.email || '');
        navigate('/member/dashboard');
      } else {
        setError(data.message || 'Authentication failed');
      }
    } catch (err) {
      console.error('Portal error:', err);
      setError(err.message === 'Failed to fetch' 
        ? 'Cannot connect to server. Please ensure the backend is running.' 
        : `Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow border-0">
            <div className="card-body p-5">
              <h2 className="text-center mb-4" style={{ color: 'var(--lav-600)' }}>
                {isLogin ? 'Member Login' : 'Join Our Community'}
              </h2>
              
              {error && <div className="alert alert-danger">{error}</div>}

              <form onSubmit={handleSubmit}>
                {!isLogin && (
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required={!isLogin}
                    />
                  </div>
                )}
                <div className="mb-3">
                  <label className="form-label">Email address</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required 
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label">Password</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required 
                  />
                </div>
                <button 
                  type="submit" 
                  className="btn btn-primary w-100 mb-3"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : (isLogin ? 'Login' : 'Register')}
                </button>
              </form>

              <div className="text-center">
                <button 
                  className="btn btn-link text-decoration-none"
                  onClick={() => setIsLogin(!isLogin)}
                >
                  {isLogin ? "Don't have an account? Register here" : "Already a member? Login here"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberPortal;
