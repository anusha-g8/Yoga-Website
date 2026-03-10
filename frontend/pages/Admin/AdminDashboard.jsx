import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Form states
  const [scheduleForm, setScheduleForm] = useState({ day: 'Monday', time: '', class_name: '', level: 'All levels' });
  const [programForm, setProgramForm] = useState({ title: '', description: '', level: 'Beginner', duration: '', price: '', image_url: '/assets/images/yoga1.jpg' });

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
      const [bookingsRes, scheduleRes, programsRes] = await Promise.all([
        fetch('/api/bookings'),
        fetch('/api/schedule'),
        fetch('/api/programs')
      ]);
      const bookingsData = await bookingsRes.json();
      const scheduleData = await scheduleRes.json();
      const programsData = await programsRes.json();
      setBookings(bookingsData);
      setSchedule(scheduleData);
      setPrograms(programsData);
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
      if (response.ok) fetchData();
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleDeleteSchedule = async (id) => {
    if (!window.confirm('Delete this class?')) return;
    try {
      const response = await fetch(`/api/schedule/${id}`, { method: 'DELETE' });
      if (response.ok) fetchData();
    } catch (err) {
      console.error('Error deleting schedule:', err);
    }
  };

  const handleDeleteProgram = async (id) => {
    if (!window.confirm('Delete this program?')) return;
    try {
      const response = await fetch(`/api/programs/${id}`, { method: 'DELETE' });
      if (response.ok) fetchData();
    } catch (err) {
      console.error('Error deleting program:', err);
    }
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scheduleForm)
      });
      if (response.ok) {
        setScheduleForm({ day: 'Monday', time: '', class_name: '', level: 'All levels' });
        fetchData();
      }
    } catch (err) {
      console.error('Error adding schedule:', err);
    }
  };

  const handleProgramSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/programs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(programForm)
      });
      if (response.ok) {
        setProgramForm({ title: '', description: '', level: 'Beginner', duration: '', price: '', image_url: '/assets/images/yoga1.jpg' });
        fetchData();
      }
    } catch (err) {
      console.error('Error adding program:', err);
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
          <button className={`nav-link ${activeTab === 'bookings' ? 'active' : ''}`} onClick={() => setActiveTab('bookings')}>Bookings</button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'schedule' ? 'active' : ''}`} onClick={() => setActiveTab('schedule')}>Schedule</button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'programs' ? 'active' : ''}`} onClick={() => setActiveTab('programs')}>Programs</button>
        </li>
      </ul>

      {/* Bookings Tab */}
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
                    <span className={`badge bg-${
                      b.status === 'confirmed' ? 'success' : 
                      b.status === 'declined' ? 'danger' : 'warning'
                    }`}>
                      {b.status}
                    </span>
                  </td>
                  <td>
                    {b.status === 'pending' && (
                      <div className="btn-group">
                        <button className="btn btn-sm btn-success me-2" onClick={() => handleUpdateStatus(b.id, 'confirmed')}>Accept</button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleUpdateStatus(b.id, 'declined')}>Decline</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Schedule Tab */}
      {activeTab === 'schedule' && (
        <div>
          <form className="card card-body mb-4" onSubmit={handleScheduleSubmit}>
            <h5>Add New Class</h5>
            <div className="row g-3">
              <div className="col-md-3">
                <select className="form-select" value={scheduleForm.day} onChange={(e) => setScheduleForm({...scheduleForm, day: e.target.value})}>
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="col-md-3">
                <input type="text" className="form-control" placeholder="Time (e.g. 08:00 - 09:00)" value={scheduleForm.time} onChange={(e) => setScheduleForm({...scheduleForm, time: e.target.value})} required />
              </div>
              <div className="col-md-3">
                <input type="text" className="form-control" placeholder="Class Name" value={scheduleForm.class_name} onChange={(e) => setScheduleForm({...scheduleForm, class_name: e.target.value})} required />
              </div>
              <div className="col-md-2">
                <input type="text" className="form-control" placeholder="Level" value={scheduleForm.level} onChange={(e) => setScheduleForm({...scheduleForm, level: e.target.value})} required />
              </div>
              <div className="col-md-1">
                <button type="submit" className="btn btn-primary w-100">Add</button>
              </div>
            </div>
          </form>
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
                    <td><button className="btn btn-sm btn-danger" onClick={() => handleDeleteSchedule(s.id)}>Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Programs Tab */}
      {activeTab === 'programs' && (
        <div>
          <form className="card card-body mb-4" onSubmit={handleProgramSubmit}>
            <h5>Add New Program</h5>
            <div className="row g-3">
              <div className="col-md-4">
                <input type="text" className="form-control" placeholder="Title" value={programForm.title} onChange={(e) => setProgramForm({...programForm, title: e.target.value})} required />
              </div>
              <div className="col-md-4">
                <input type="text" className="form-control" placeholder="Duration" value={programForm.duration} onChange={(e) => setProgramForm({...programForm, duration: e.target.value})} required />
              </div>
              <div className="col-md-4">
                <input type="number" className="form-control" placeholder="Price" value={programForm.price} onChange={(e) => setProgramForm({...programForm, price: e.target.value})} required />
              </div>
              <div className="col-md-12">
                <textarea className="form-control" placeholder="Description" value={programForm.description} onChange={(e) => setProgramForm({...programForm, description: e.target.value})} required />
              </div>
              <div className="col-md-6">
                <input type="text" className="form-control" placeholder="Level" value={programForm.level} onChange={(e) => setProgramForm({...programForm, level: e.target.value})} required />
              </div>
              <div className="col-md-6">
                <input type="text" className="form-control" placeholder="Image Path" value={programForm.image_url} onChange={(e) => setProgramForm({...programForm, image_url: e.target.value})} required />
              </div>
              <div className="col-md-2">
                <button type="submit" className="btn btn-primary w-100">Add Program</button>
              </div>
            </div>
          </form>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Level</th>
                  <th>Duration</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {programs.map((p) => (
                  <tr key={p.id}>
                    <td>{p.title}</td>
                    <td>{p.level}</td>
                    <td>{p.duration}</td>
                    <td>${p.price}</td>
                    <td><button className="btn btn-sm btn-danger" onClick={() => handleDeleteProgram(p.id)}>Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
