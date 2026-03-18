import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../src/config';

const MemberDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('memberToken');
      if (!token) {
        navigate('/member/portal');
        return;
      }

      try {
        const apiUrl = API_BASE_URL || '/api';
        const headers = { 'x-auth-token': token };

        // Fetch profile and bookings in parallel
        const [profRes, bookRes] = await Promise.all([
          fetch(`${apiUrl}/members/profile`, { headers }),
          fetch(`${apiUrl}/api/bookings`, { headers })
        ]);

        if (profRes.ok) {
          const profData = await profRes.json();
          setProfile(profData);
        } else {
          // If profile fails, session is likely expired
          localStorage.removeItem('memberToken');
          navigate('/member/portal');
          return;
        }

        if (bookRes.ok) {
          const bookData = await bookRes.json();
          setBookings(bookData);
        }
      } catch (err) {
        console.error('Dashboard Load Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('memberToken');
    localStorage.removeItem('memberName');
    navigate('/member/portal');
  };

  if (loading) return <div className="container my-5 text-center">Loading Dashboard...</div>;

  return (
    <div className="container my-5">
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
        <div>
          <h1 className="mb-0" style={{ color: '#6f42c1' }}>Member Dashboard</h1>
          <p className="text-muted mb-0">Welcome back, {profile?.name}!</p>
        </div>
        <button className="btn btn-outline-danger" onClick={handleLogout}>Logout</button>
      </div>

      <div className="row g-4">
        {/* Profile Card */}
        <div className="col-md-4">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body">
              <h5 className="card-title fw-bold mb-3">My Profile</h5>
              <p className="mb-1"><strong>Email:</strong> {profile?.email}</p>
              <p className="mb-0 text-muted small">
                Member since {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
              </p>
              <button className="btn btn-sm btn-link p-0 mt-3 text-decoration-none">Edit Profile</button>
            </div>
          </div>
        </div>

        {/* Dynamic Bookings Section */}
        <div className="col-md-8">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body">
              <h5 className="card-title fw-bold mb-3">Upcoming Classes</h5>
              
              {bookings.length > 0 ? (
                <div className="list-group list-group-flush">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="list-group-item px-0 border-0 mb-2">
                      <div className="d-flex w-100 justify-content-between align-items-center p-3 bg-light rounded">
                        <div>
                          <h6 className="mb-1 fw-bold text-dark">{booking.class_name || 'Yoga Session'}</h6>
                          <p className="mb-0 small text-muted">
                            <i className="bi bi-calendar-event me-2"></i>
                            {new Date(booking.class_date).toLocaleDateString()} at {booking.class_time}
                          </p>
                        </div>
                        <span className="badge rounded-pill bg-success px-3">Confirmed</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="alert alert-light border-dashed text-center py-5">
                  <i className="bi bi-calendar2-x fs-1 text-muted mb-3 d-block"></i>
                  <p className="text-muted">You haven't booked any classes yet.</p>
                  <button className="btn btn-primary btn-sm mt-2" onClick={() => navigate('/calendar')}>
                    Browse Schedule
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Video Section (Existing) */}
        <div className="col-12">
          <div className="card shadow-sm border-0 mt-2">
            <div className="card-body">
              <h5 className="card-title fw-bold mb-4">Class Recordings</h5>
              <div className="row g-3">
                {/* Static placeholders for now */}
                {[1, 2, 3].map(i => (
                  <div key={i} className="col-md-4">
                    <div className="bg-light rounded p-4 text-center border hover-shadow transition">
                      <div className="mb-3 text-primary"><i className="bi bi-play-circle-fill fs-1"></i></div>
                      <h6 className="fw-bold mb-1">Session {i}</h6>
                      <p className="small text-muted mb-0">Level: All Levels</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;