import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin');
    } else {
      fetchData();
    }
  }, []);

  const fetchData = async () => {
    try {
      const [bookingsRes, scheduleRes] = await Promise.all([
        fetch('/api/bookings'),
        fetch('/api/schedule')
      ]);
      const bookingsData = await bookingsRes.json();
      const scheduleData = await scheduleRes.json();
      setBookings(bookingsData);
      setSchedule(scheduleData);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching admin data:', err);
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const response = await fetch(`/api/bookings/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (response.ok) {
        fetchData();
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleDeleteSchedule = async (id) => {
    if (!window.confirm('Delete this class?')) return;
    try {
      const response = await fetch(`/api/schedule/${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchData();
      }
    } catch (err) {
      console.error('Error deleting schedule:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin');
  };

  if (loading) return <div className="container my-5 text-center">Loading Admin Dashboard...</div>;

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Admin Dashboard</h1>
        <button className="btn btn-outline-danger" onClick={handleLogout}>Logout</button>
      </div>

      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'bookings' ? 'active' : ''}`} onClick={() => setActiveTab('bookings')}>Bookings & Enrollments</button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'schedule' ? 'active' : ''}`} onClick={() => setActiveTab('schedule')}>Manage Schedule</button>
        </li>
      </ul>

      {activeTab === 'bookings' && (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Date</th>
                <th>Name</th>
                <th>Email</th>
                <th>Item</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id}>
                  <td>{new Date(b.booking_date).toLocaleDateString()}</td>
                  <td>{b.user_name}</td>
                  <td>{b.user_email}</td>
                  <td>{b.class_title || b.program_title}</td>
                  <td>
                    <span className={`badge bg-${b.status === 'confirmed' ? 'success' : 'warning'}`}>
                      {b.status}
                    </span>
                  </td>
                  <td>
                    {b.status === 'pending' && (
                      <button className="btn btn-sm btn-success" onClick={() => handleUpdateStatus(b.id, 'confirmed')}>Accept</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'schedule' && (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Day</th>
                <th>Time</th>
                <th>Class</th>
                <th>Level</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((s) => (
                <tr key={s.id}>
                  <td>{s.day}</td>
                  <td>{s.time}</td>
                  <td>{s.class_name}</td>
                  <td>{s.level}</td>
                  <td>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDeleteSchedule(s.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
