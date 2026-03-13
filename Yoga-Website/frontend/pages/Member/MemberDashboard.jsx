import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../src/config';

const MemberDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('memberToken');
      if (!token) {
        navigate('/member/portal');
        return;
      }

      try {
        const apiUrl = API_BASE_URL || '/api';
        const response = await fetch(`${apiUrl}/members/profile`, {
          headers: { 'x-auth-token': token }
        });

        if (response.ok) {
          const data = await response.json();
          setProfile(data);
        } else {
          console.warn(`Profile fetch failed with status ${response.status}`);
          localStorage.removeItem('memberToken');
          navigate('/member/portal');
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        // If it's a connection error, we might want to stay on the page but show an error
        // For now, let's just log it as it usually means the session is invalid or server is down
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('memberToken');
    localStorage.removeItem('memberName');
    navigate('/member/portal');
  };

  if (loading) return <div className="container my-5 text-center">Loading Member Dashboard...</div>;

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
        <div>
          <h1 className="mb-0" style={{ color: 'var(--lav-600)' }}>Member Dashboard</h1>
          <p className="text-muted mb-0">Welcome back, {profile?.name}!</p>
        </div>
        <button className="btn btn-outline-danger" onClick={handleLogout}>Logout</button>
      </div>

      <div className="row g-4">
        {/* Profile Summary */}
        <div className="col-md-4">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body">
              <h5 className="card-title fw-bold mb-3">My Profile</h5>
              <p className="mb-1"><strong>Email:</strong> {profile?.email}</p>
              <p className="mb-0 text-muted small">Member since {new Date(profile?.created_at).toLocaleDateString()}</p>
              <button className="btn btn-sm btn-link p-0 mt-3">Edit Profile</button>
            </div>
          </div>
        </div>

        {/* My Bookings Placeholder */}
        <div className="col-md-8">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body">
              <h5 className="card-title fw-bold mb-3">My Upcoming Classes</h5>
              <div className="alert alert-light border-dashed text-center py-4">
                <i className="bi bi-calendar2-week fs-2 text-muted mb-2 d-block"></i>
                <p className="mb-0 text-muted">You have no upcoming bookings.</p>
                <button className="btn btn-primary btn-sm mt-3" onClick={() => navigate('/calendar')}>Book a Class</button>
              </div>
            </div>
          </div>
        </div>

        {/* Member Exclusive Content */}
        <div className="col-12">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h5 className="card-title fw-bold mb-4">Full-length Class Recordings</h5>
              <div className="row g-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="col-md-4">
                    <div className="bg-light rounded p-4 text-center border">
                      <div className="mb-3 text-primary"><i className="bi bi-play-circle-fill fs-1"></i></div>
                      <h6 className="fw-bold mb-1">Advanced Vinyasa Flow</h6>
                      <p className="small text-muted mb-0">60 mins • Level: Intermediate</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center mt-4">
                <button className="btn btn-outline-primary" onClick={() => navigate('/videos')}>Watch Sample Videos</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;
