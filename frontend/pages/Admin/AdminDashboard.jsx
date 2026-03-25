import { API_BASE_URL } from '../../src/config';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [videos, setVideos] = useState([]);
  const [members, setMembers] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [monitoring, setMonitoring] = useState({ activities: [], traffic: { totalVisits: 0, topPages: [], recentVisits: [] } });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [newSchedule, setNewSchedule] = useState({ day: 'Monday', time: '', class_name: '', level: 'All levels' });
  const [newProgram, setNewProgram] = useState({ title: '', description: '', level: 'Beginner', duration: '', price: '', image_url: '/assets/images/yoga1.jpg' });
  const [newVideo, setNewVideo] = useState({ title: '', description: '', level: 'Beginner', duration: '', youtube_id: '', url: '' });
  const [broadcast, setBroadcast] = useState({ subject: '', message: '' });

  const [selectedBookings, setSelectedBookings] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState([]);
  const [selectedPrograms, setSelectedPrograms] = useState([]);
  const [selectedInquiries, setSelectedInquiries] = useState([]);
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [selectedSubscribers, setSelectedSubscribers] = useState([]);

  const [editingScheduleId, setEditingScheduleId] = useState(null);
  const [editScheduleForm, setEditScheduleForm] = useState({ day: 'Monday', time: '', class_name: '', level: '' });

  const [editingProgramId, setEditingProgramId] = useState(null);
  const [editProgramForm, setEditProgramForm] = useState({ title: '', description: '', level: '', duration: '', price: '', image_url: '' });

  const [editingVideoId, setEditingVideoId] = useState(null);
  const [editVideoForm, setEditVideoForm] = useState({ title: '', description: '', level: '', duration: '', youtube_id: '', url: '' });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin');
    } else {
      fetchData();
    }
  }, []);

  useEffect(() => {
    // Clear selections when switching tabs
    setSelectedBookings([]);
    setSelectedSchedule([]);
    setSelectedPrograms([]);
    setSelectedInquiries([]);
    setSelectedVideos([]);
    setSelectedMembers([]);
    setSelectedSubscribers([]);
    setEditingScheduleId(null);
    setEditingProgramId(null);
    setEditingVideoId(null);
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const endpoints = ['bookings', 'schedule', 'programs', 'inquiries', 'videos', 'members', 'newsletter/subscribers', 'monitoring/stats'];
      const results = await Promise.allSettled(endpoints.map(path => 
        fetch(`${API_BASE_URL}/${path}`, {
          headers: { 'x-auth-token': localStorage.getItem('adminToken') }
        }).then(async res => {
          if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
          return res.json();
        })
      ));

      const [bookData, schedData, progData, inqData, vidData, memData, subData, monData] = results.map((res, idx) => {
        if (res.status === 'fulfilled') return res.value;
        console.error(`Failed to fetch ${endpoints[idx]}:`, res.reason);
        return idx === 7 ? { activities: [], traffic: { totalVisits: 0, topPages: [], recentVisits: [] } } : [];
      });

      setBookings(Array.isArray(bookData) ? bookData : []);
      setSchedule(Array.isArray(schedData) ? schedData : []);
      setPrograms(Array.isArray(progData) ? progData : []);
      setInquiries(Array.isArray(inqData) ? inqData : []);
      setVideos(Array.isArray(vidData) ? vidData : []);
      setMembers(Array.isArray(memData) ? memData : []);
      setSubscribers(Array.isArray(subData) ? subData : []);
      setMonitoring(monData);
    } catch (error) {
      console.error('Critical error in fetchData:', error);
    } finally {
      setSelectedBookings([]);
      setSelectedSchedule([]);
      setSelectedPrograms([]);
      setSelectedInquiries([]);
      setSelectedVideos([]);
      setSelectedMembers([]);
      setSelectedSubscribers([]);
      setLoading(false);
    }
  };

  const updateBookingStatus = async (id, status) => {
    try {
      const res = await fetch(`${API_BASE_URL}/bookings/${id}/status`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('adminToken')
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) fetchData();
      else alert('Failed to update status');
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleBulkUpdateStatus = async (ids, status) => {
    if (!ids.length) return;
    const confirmMsg = ids.length === bookings.length 
      ? `Are you sure you want to ${status} ALL bookings?`
      : `Are you sure you want to ${status} ${ids.length} selected bookings?`;
    
    if (window.confirm(confirmMsg)) {
      try {
        const promises = ids.map(id => 
          fetch(`${API_BASE_URL}/bookings/${id}/status`, {
            method: 'PATCH',
            headers: { 
              'Content-Type': 'application/json',
              'x-auth-token': localStorage.getItem('adminToken')
            },
            body: JSON.stringify({ status })
          })
        );
        await Promise.all(promises);
        fetchData();
      } catch (error) {
        console.error('Bulk update error:', error);
        alert('Error during bulk update');
      }
    }
  };

  // Toggle selection functions
  const toggleBookingSelection = (id) => {
    setSelectedBookings(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };
  const toggleAllBookings = () => {
    selectedBookings.length === bookings.length ? setSelectedBookings([]) : setSelectedBookings(bookings.map(b => b.id));
  };

  const toggleScheduleSelection = (id) => {
    setSelectedSchedule(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };
  const toggleAllSchedule = () => {
    selectedSchedule.length === schedule.length ? setSelectedSchedule([]) : setSelectedSchedule(schedule.map(s => s.id));
  };

  const toggleProgramSelection = (id) => {
    setSelectedPrograms(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };
  const toggleAllPrograms = () => {
    selectedPrograms.length === programs.length ? setSelectedPrograms([]) : setSelectedPrograms(programs.map(p => p.id));
  };

  const toggleInquirySelection = (id) => {
    setSelectedInquiries(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };
  const toggleAllInquiries = () => {
    selectedInquiries.length === inquiries.length ? setSelectedInquiries([]) : setSelectedInquiries(inquiries.map(i => i.id));
  };

  const toggleVideoSelection = (id) => {
    setSelectedVideos(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };
  const toggleAllVideos = () => {
    selectedVideos.length === videos.length ? setSelectedVideos([]) : setSelectedVideos(videos.map(v => v.id));
  };

  // Edit Handlers
  const handleEditSchedule = (item) => {
    setEditingScheduleId(item.id);
    setEditScheduleForm({ day: item.day, time: item.time, class_name: item.class_name, level: item.level });
  };

  const cancelEditSchedule = () => {
    setEditingScheduleId(null);
    setEditScheduleForm({ day: 'Monday', time: '', class_name: '', level: '' });
  };

  const saveEditSchedule = async (id) => {
    if (!editScheduleForm.time.trim() || !editScheduleForm.class_name.trim() || !editScheduleForm.level.trim()) {
      alert('All fields are required');
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/schedule/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('adminToken')
        },
        body: JSON.stringify(editScheduleForm)
      });
      if (res.ok) {
        setEditingScheduleId(null);
        fetchData();
      } else {
        const data = await res.json();
        alert(`Update failed: ${data.message}`);
      }
    } catch (error) {
      console.error('Error updating schedule:', error);
    }
  };

  const handleEditProgram = (item) => {
    setEditingProgramId(item.id);
    setEditProgramForm({ title: item.title, description: item.description, level: item.level, duration: item.duration, price: item.price, image_url: item.image_url });
  };

  const cancelEditProgram = () => {
    setEditingProgramId(null);
    setEditProgramForm({ title: '', description: '', level: '', duration: '', price: '', image_url: '' });
  };

  const saveEditProgram = async (id) => {
    const { title, description, duration, price, level, image_url } = editProgramForm;
    if (!title.trim() || !description.trim() || !duration.trim() || !price || !level.trim() || !image_url.trim()) {
      alert('All fields are required');
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/programs/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('adminToken')
        },
        body: JSON.stringify(editProgramForm)
      });
      if (res.ok) {
        setEditingProgramId(null);
        fetchData();
      } else {
        const data = await res.json();
        alert(`Update failed: ${data.message}`);
      }
    } catch (error) {
      console.error('Error updating program:', error);
    }
  };

  const handleEditVideo = (item) => {
    setEditingVideoId(item.id);
    setEditVideoForm({ title: item.title, description: item.description, level: item.level, duration: item.duration, youtube_id: item.youtube_id, url: item.url });
  };

  const cancelEditVideo = () => {
    setEditingVideoId(null);
    setEditVideoForm({ title: '', description: '', level: '', duration: '', youtube_id: '', url: '' });
  };

  const saveEditVideo = async (id) => {
    const { title, level, duration, youtube_id } = editVideoForm;
    if (!title.trim() || !level.trim() || !duration.trim() || !youtube_id.trim()) {
      alert('Title, Level, Duration and YouTube ID are required');
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/videos/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('adminToken')
        },
        body: JSON.stringify(editVideoForm)
      });
      if (res.ok) {
        setEditingVideoId(null);
        fetchData();
      } else {
        const data = await res.json();
        alert(`Update failed: ${data.message}`);
      }
    } catch (error) {
      console.error('Error updating video:', error);
    }
  };

  // Bulk Delete Handlers
  const handleBulkDeleteSchedule = async (ids) => {
    if (!ids.length) return;
    const confirmMsg = ids.length === schedule.length 
      ? `WARNING: This will delete ALL ${ids.length} classes AND their associated bookings. Proceed?`
      : `Delete ${ids.length} selected classes and their associated bookings?`;
    
    if (window.confirm(confirmMsg)) {
      try {
        const promises = ids.map(id => 
          fetch(`${API_BASE_URL}/schedule/${id}`, {
            method: 'DELETE',
            headers: { 'x-auth-token': localStorage.getItem('adminToken') }
          })
        );
        await Promise.all(promises);
        alert('Classes deleted successfully');
        fetchData();
      } catch (error) {
        console.error('Bulk delete error:', error);
        alert('Error during bulk deletion');
      }
    }
  };

  const handleBulkDeletePrograms = async (ids) => {
    if (!ids.length) return;
    const confirmMsg = ids.length === programs.length 
      ? `WARNING: This will delete ALL ${ids.length} programs AND their associated bookings. Proceed?`
      : `Delete ${ids.length} selected programs and their associated bookings?`;
    
    if (window.confirm(confirmMsg)) {
      try {
        const promises = ids.map(id => 
          fetch(`${API_BASE_URL}/programs/${id}`, {
            method: 'DELETE',
            headers: { 'x-auth-token': localStorage.getItem('adminToken') }
          })
        );
        await Promise.all(promises);
        alert('Programs deleted successfully');
        fetchData();
      } catch (error) {
        console.error('Bulk delete error:', error);
        alert('Error during bulk deletion');
      }
    }
  };

  const handleBulkDeleteInquiries = async (ids) => {
    if (!ids.length) return;
    const confirmMsg = ids.length === inquiries.length 
      ? `Delete ALL ${ids.length} inquiries?`
      : `Delete ${ids.length} selected inquiries?`;
    
    if (window.confirm(confirmMsg)) {
      try {
        const promises = ids.map(id => 
          fetch(`${API_BASE_URL}/inquiries/${id}`, {
            method: 'DELETE',
            headers: { 'x-auth-token': localStorage.getItem('adminToken') }
          })
        );
        await Promise.all(promises);
        alert('Inquiries deleted successfully');
        fetchData();
      } catch (error) {
        console.error('Bulk delete error:', error);
        alert('Error during bulk deletion');
      }
    }
  };

  const handleBulkDeleteVideos = async (ids) => {
    if (!ids.length) return;
    const confirmMsg = ids.length === videos.length 
      ? `Delete ALL ${ids.length} videos?`
      : `Delete ${ids.length} selected videos?`;
    
    if (window.confirm(confirmMsg)) {
      try {
        const promises = ids.map(id => 
          fetch(`${API_BASE_URL}/videos/${id}`, {
            method: 'DELETE',
            headers: { 'x-auth-token': localStorage.getItem('adminToken') }
          })
        );
        await Promise.all(promises);
        alert('Videos deleted successfully');
        fetchData();
      } catch (error) {
        console.error('Bulk delete error:', error);
        alert('Error during bulk deletion');
      }
    }
  };

  const deleteBooking = async (id) => {
    if (window.confirm('Delete this booking record?')) {
      try {
        const res = await fetch(`${API_BASE_URL}/bookings/${id}`, {
          method: 'DELETE',
          headers: { 'x-auth-token': localStorage.getItem('adminToken') }
        });
        if (res.ok) {
          alert('Booking deleted successfully');
          fetchData();
        } else {
          alert('Failed to delete booking');
        }
      } catch (error) {
        console.error('Error deleting booking:', error);
      }
    }
  };

  const deleteScheduleItem = async (id) => {
    if (window.confirm('Delete this class? This will also delete associated bookings.')) {
      try {
        const res = await fetch(`${API_BASE_URL}/schedule/${id}`, {
          method: 'DELETE',
          headers: { 'x-auth-token': localStorage.getItem('adminToken') }
        });
        if (res.ok) {
          alert('Schedule item deleted successfully');
          fetchData();
        } else {
          const data = await res.json();
          alert(`Failed to delete schedule: ${data.message}`);
        }
      } catch (error) {
        console.error('Error deleting schedule:', error);
      }
    }
  };

  const deleteProgram = async (id) => {
    if (window.confirm('Delete this program? This will also delete associated bookings.')) {
      try {
        const res = await fetch(`${API_BASE_URL}/programs/${id}`, {
          method: 'DELETE',
          headers: { 'x-auth-token': localStorage.getItem('adminToken') }
        });
        if (res.ok) {
          alert('Program deleted successfully');
          fetchData();
        } else {
          const data = await res.json();
          alert(`Failed to delete program: ${data.message}`);
        }
      } catch (error) {
        console.error('Error deleting program:', error);
      }
    }
  };

  const deleteVideo = async (id) => {
    if (window.confirm('Delete this video?')) {
      try {
        const res = await fetch(`${API_BASE_URL}/videos/${id}`, {
          method: 'DELETE',
          headers: { 'x-auth-token': localStorage.getItem('adminToken') }
        });
        if (res.ok) {
          alert('Video deleted successfully');
          fetchData();
        } else {
          const data = await res.json();
          alert(`Failed to delete video: ${data.message}`);
        }
      } catch (error) {
        console.error('Error deleting video:', error);
      }
    }
  };

  const handleAddSchedule = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/schedule`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('adminToken')
        },
        body: JSON.stringify(newSchedule)
      });
      if (res.ok) {
        setNewSchedule({ day: 'Monday', time: '', class_name: '', level: 'All levels' });
        fetchData();
      } else {
        const data = await res.json();
        alert(data.message || 'Error adding schedule');
      }
    } catch (error) {
      console.error('Add schedule error:', error);
    }
  };

  const handleAddProgram = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/programs`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('adminToken')
        },
        body: JSON.stringify(newProgram)
      });
      if (res.ok) {
        setNewProgram({ title: '', description: '', level: 'Beginner', duration: '', price: '', image_url: '/assets/images/yoga1.jpg' });
        fetchData();
      } else {
        const data = await res.json();
        alert(data.message || 'Error adding program');
      }
    } catch (error) {
      console.error('Add program error:', error);
    }
  };

  const handleAddVideo = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/videos`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('adminToken')
        },
        body: JSON.stringify(newVideo)
      });
      if (res.ok) {
        setNewVideo({ title: '', description: '', level: 'Beginner', duration: '', youtube_id: '', url: '' });
        fetchData();
      } else {
        const data = await res.json();
        alert(data.message || 'Error adding video');
      }
    } catch (error) {
      console.error('Add video error:', error);
    }
  };

  const handleSendBroadcast = async (e) => {
    e.preventDefault();
    if (!broadcast.subject.trim() || !broadcast.message.trim()) {
      alert('Subject and Message are required');
      return;
    }
    if (window.confirm(`Send this broadcast to ${subscribers.length} subscribers?`)) {
      try {
        const res = await fetch(`${API_BASE_URL}/newsletter/broadcast`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'x-auth-token': localStorage.getItem('adminToken')
          },
          body: JSON.stringify(broadcast)
        });
        if (res.ok) {
          const data = await res.json();
          alert(`Broadcast successful! Sent to ${data.successCount} subscribers.`);
          setBroadcast({ subject: '', message: '' });
        } else {
          alert('Broadcast failed');
        }
      } catch (error) {
        console.error('Broadcast error:', error);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin');
  };

  if (loading) return <div className="container mt-5 text-center">Loading dashboard data...</div>;

  return (
    <div className="container-fluid mt-4 px-4 pb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Admin Dashboard</h2>
        <button onClick={handleLogout} className="btn btn-outline-danger">Logout</button>
      </div>

      <ul className="nav nav-pills mb-4 gap-2">
        {['bookings', 'schedule', 'programs', 'videos', 'inquiries', 'members', 'subscribers', 'monitoring'].map(tab => (
          <li key={tab} className="nav-item">
            <button 
              className={`nav-link text-capitalize px-4 ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          </li>
        ))}
      </ul>

      {/* MONITORING TAB */}
      {activeTab === 'monitoring' && (
        <div>
          <div className="row g-4 mb-4">
            <div className="col-md-4">
              <div className="card shadow-sm border-0 bg-primary text-white h-100">
                <div className="card-body text-center p-4">
                  <h6 className="text-uppercase mb-2 opacity-75">Total Site Visits</h6>
                  <h2 className="display-4 fw-bold mb-0">{monitoring.traffic.totalVisits}</h2>
                </div>
              </div>
            </div>
            <div className="col-md-8">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-header bg-white py-3">
                  <h5 className="mb-0 fw-bold">Top Pages</h5>
                </div>
                <div className="card-body p-0">
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead>
                        <tr>
                          <th>Path</th>
                          <th className="text-end">Visits</th>
                        </tr>
                      </thead>
                      <tbody>
                        {monitoring.traffic.topPages.map((page, idx) => (
                          <tr key={idx}>
                            <td><code>{page.path}</code></td>
                            <td className="text-end fw-bold">{page.visit_count}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card shadow-sm border-0">
            <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-bold">User Activity Log</h5>
              <button className="btn btn-sm btn-outline-primary" onClick={fetchData}>Refresh</button>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive" style={{ maxHeight: '600px' }}>
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light sticky-top">
                    <tr>
                      <th>Time</th>
                      <th>Type</th>
                      <th>Description</th>
                      <th>User</th>
                      <th>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monitoring.activities.length > 0 ? (
                      monitoring.activities.map((act) => (
                        <tr key={act.id}>
                          <td className="small text-muted">{new Date(act.created_at).toLocaleString()}</td>
                          <td><span className={`badge ${act.activity_type === 'API_REQUEST' ? 'bg-info' : 'bg-success'}`}>{act.activity_type}</span></td>
                          <td>{act.description}</td>
                          <td>
                            {act.member_name ? (
                              <div>
                                <strong>{act.member_name}</strong>
                                <br/><span className="small text-muted">{act.member_email}</span>
                              </div>
                            ) : (
                              <span className="text-muted italic">Guest</span>
                            )}
                          </td>
                          <td className="small">
                            {act.metadata && (
                              <div className="text-muted" style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {JSON.stringify(act.metadata)}
                              </div>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan="5" className="text-center py-4">No activities logged yet</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'bookings' && (
        <div className="card shadow-sm border-0">
          <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
            <h5 className="mb-0 fw-bold">Recent Bookings</h5>
            <div className="d-flex gap-2">
              <button 
                className="btn btn-sm btn-success" 
                disabled={!selectedBookings.length}
                onClick={() => handleBulkUpdateStatus(selectedBookings, 'confirmed')}
              >
                Confirm Selected ({selectedBookings.length})
              </button>
              <button 
                className="btn btn-sm btn-danger" 
                disabled={!selectedBookings.length}
                onClick={() => handleBulkUpdateStatus(selectedBookings, 'cancelled')}
              >
                Cancel Selected
              </button>
            </div>
          </div>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th width="40"><input type="checkbox" onChange={toggleAllBookings} checked={selectedBookings.length === bookings.length && bookings.length > 0} /></th>
                  <th>User</th>
                  <th>Class/Program</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(b => (
                  <tr key={b.id}>
                    <td><input type="checkbox" checked={selectedBookings.includes(b.id)} onChange={() => toggleBookingSelection(b.id)} /></td>
                    <td>
                      <div className="fw-bold">{b.user_name}</div>
                      <div className="small text-muted">{b.user_email}</div>
                    </td>
                    <td>{b.class_name || b.program_title}</td>
                    <td>
                      <span className={`badge rounded-pill ${b.payment_status === 'paid' ? 'bg-success-subtle text-success border border-success-subtle' : 'bg-warning-subtle text-warning border border-warning-subtle'}`}>
                        {b.payment_status}
                      </span>
                    </td>
                    <td>
                      <span className={`badge rounded-pill ${b.status === 'confirmed' ? 'bg-success' : b.status === 'cancelled' ? 'bg-danger' : 'bg-secondary'}`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="text-end">
                      <div className="dropdown">
                        <button className="btn btn-sm btn-light border dropdown-toggle" type="button" data-bs-toggle="dropdown">
                          Update
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end">
                          <li><button className="dropdown-item" onClick={() => updateBookingStatus(b.id, 'confirmed')}>Confirm</button></li>
                          <li><button className="dropdown-item" onClick={() => updateBookingStatus(b.id, 'cancelled')}>Cancel</button></li>
                          <li><hr className="dropdown-divider" /></li>
                          <li><button className="dropdown-item text-danger" onClick={() => deleteBooking(b.id)}>Delete</button></li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'schedule' && (
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card shadow-sm border-0 sticky-top" style={{ top: '2rem' }}>
              <div className="card-body p-4">
                <h5 className="fw-bold mb-4">{editingScheduleId ? 'Edit Class' : 'Add New Class'}</h5>
                <form onSubmit={editingScheduleId ? (e) => { e.preventDefault(); saveEditSchedule(editingScheduleId); } : handleAddSchedule}>
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted">Day</label>
                    <select className="form-select" value={editingScheduleId ? editScheduleForm.day : newSchedule.day} 
                      onChange={e => editingScheduleId ? setEditScheduleForm({...editScheduleForm, day: e.target.value}) : setNewSchedule({...newSchedule, day: e.target.value})}>
                      {['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted">Time</label>
                    <input type="text" className="form-control" placeholder="e.g. 08:00 - 09:00" 
                      value={editingScheduleId ? editScheduleForm.time : newSchedule.time} 
                      onChange={e => editingScheduleId ? setEditScheduleForm({...editScheduleForm, time: e.target.value}) : setNewSchedule({...newSchedule, time: e.target.value})} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted">Class Name</label>
                    <input type="text" className="form-control" placeholder="e.g. Hatha Yoga" 
                      value={editingScheduleId ? editScheduleForm.class_name : newSchedule.class_name} 
                      onChange={e => editingScheduleId ? setEditScheduleForm({...editScheduleForm, class_name: e.target.value}) : setNewSchedule({...newSchedule, class_name: e.target.value})} required />
                  </div>
                  <div className="mb-4">
                    <label className="form-label small fw-bold text-muted">Level</label>
                    <input type="text" className="form-control" placeholder="e.g. Beginner" 
                      value={editingScheduleId ? editScheduleForm.level : newSchedule.level} 
                      onChange={e => editingScheduleId ? setEditScheduleForm({...editScheduleForm, level: e.target.value}) : setNewSchedule({...newSchedule, level: e.target.value})} required />
                  </div>
                  <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-primary flex-grow-1">{editingScheduleId ? 'Save Changes' : 'Add Class'}</button>
                    {editingScheduleId && <button type="button" className="btn btn-light border" onClick={cancelEditSchedule}>Cancel</button>}
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="col-md-8">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-bold">Weekly Schedule</h5>
                <button 
                  className="btn btn-sm btn-outline-danger" 
                  disabled={!selectedSchedule.length}
                  onClick={() => handleBulkDeleteSchedule(selectedSchedule)}
                >
                  Delete Selected ({selectedSchedule.length})
                </button>
              </div>
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th width="40"><input type="checkbox" onChange={toggleAllSchedule} checked={selectedSchedule.length === schedule.length && schedule.length > 0} /></th>
                      <th>Day</th>
                      <th>Time</th>
                      <th>Class</th>
                      <th>Level</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schedule.map(item => (
                      <tr key={item.id} className={editingScheduleId === item.id ? 'table-primary' : ''}>
                        <td><input type="checkbox" checked={selectedSchedule.includes(item.id)} onChange={() => toggleScheduleSelection(item.id)} /></td>
                        <td><span className="badge bg-light text-dark border">{item.day}</span></td>
                        <td>{item.time}</td>
                        <td className="fw-bold">{item.class_name}</td>
                        <td><span className="small text-muted">{item.level}</span></td>
                        <td className="text-end text-nowrap">
                          <button className="btn btn-sm btn-light border me-2" onClick={() => handleEditSchedule(item)}>
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => deleteScheduleItem(item.id)}>
                            <i className="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'programs' && (
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card shadow-sm border-0 sticky-top" style={{ top: '2rem' }}>
              <div className="card-body p-4">
                <h5 className="fw-bold mb-4">{editingProgramId ? 'Edit Program' : 'Add New Program'}</h5>
                <form onSubmit={editingProgramId ? (e) => { e.preventDefault(); saveEditProgram(editingProgramId); } : handleAddProgram}>
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted">Title</label>
                    <input type="text" className="form-control" value={editingProgramId ? editProgramForm.title : newProgram.title} 
                      onChange={e => editingProgramId ? setEditProgramForm({...editProgramForm, title: e.target.value}) : setNewProgram({...newProgram, title: e.target.value})} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted">Price (€)</label>
                    <input type="number" step="0.01" className="form-control" value={editingProgramId ? editProgramForm.price : newProgram.price} 
                      onChange={e => editingProgramId ? setEditProgramForm({...editProgramForm, price: e.target.value}) : setNewProgram({...newProgram, price: e.target.value})} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted">Duration</label>
                    <input type="text" className="form-control" placeholder="e.g. 4 weeks" value={editingProgramId ? editProgramForm.duration : newProgram.duration} 
                      onChange={e => editingProgramId ? setEditProgramForm({...editProgramForm, duration: e.target.value}) : setNewProgram({...newProgram, duration: e.target.value})} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted">Description</label>
                    <textarea className="form-control" rows="3" value={editingProgramId ? editProgramForm.description : newProgram.description} 
                      onChange={e => editingProgramId ? setEditProgramForm({...editProgramForm, description: e.target.value}) : setNewProgram({...newProgram, description: e.target.value})} required />
                  </div>
                  <div className="mb-4">
                    <label className="form-label small fw-bold text-muted">Image Path</label>
                    <input type="text" className="form-control" value={editingProgramId ? editProgramForm.image_url : newProgram.image_url} 
                      onChange={e => editingProgramId ? setEditProgramForm({...editProgramForm, image_url: e.target.value}) : setNewProgram({...newProgram, image_url: e.target.value})} required />
                  </div>
                  <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-primary flex-grow-1">{editingProgramId ? 'Save Changes' : 'Add Program'}</button>
                    {editingProgramId && <button type="button" className="btn btn-light border" onClick={cancelEditProgram}>Cancel</button>}
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="col-md-8">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-bold">Active Programs</h5>
                <button 
                  className="btn btn-sm btn-outline-danger" 
                  disabled={!selectedPrograms.length}
                  onClick={() => handleBulkDeletePrograms(selectedPrograms)}
                >
                  Delete Selected ({selectedPrograms.length})
                </button>
              </div>
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th width="40"><input type="checkbox" onChange={toggleAllPrograms} checked={selectedPrograms.length === programs.length && programs.length > 0} /></th>
                      <th>Program</th>
                      <th>Details</th>
                      <th>Price</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {programs.map(p => (
                      <tr key={p.id} className={editingProgramId === p.id ? 'table-primary' : ''}>
                        <td><input type="checkbox" checked={selectedPrograms.includes(p.id)} onChange={() => toggleProgramSelection(p.id)} /></td>
                        <td className="fw-bold">{p.title}</td>
                        <td className="small text-muted">{p.duration} • {p.level}</td>
                        <td className="fw-bold text-primary">€{p.price}</td>
                        <td className="text-end text-nowrap">
                          <button className="btn btn-sm btn-light border me-2" onClick={() => handleEditProgram(p)}>
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => deleteProgram(p.id)}>
                            <i className="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'videos' && (
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card shadow-sm border-0 sticky-top" style={{ top: '2rem' }}>
              <div className="card-body p-4">
                <h5 className="fw-bold mb-4">{editingVideoId ? 'Edit Video' : 'Add New Video'}</h5>
                <form onSubmit={editingVideoId ? (e) => { e.preventDefault(); saveEditVideo(editingVideoId); } : handleAddVideo}>
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted">Title</label>
                    <input type="text" className="form-control" value={editingVideoId ? editVideoForm.title : newVideo.title} 
                      onChange={e => editingVideoId ? setEditVideoForm({...editVideoForm, title: e.target.value}) : setNewVideo({...newVideo, title: e.target.value})} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted">YouTube ID</label>
                    <input type="text" className="form-control" placeholder="e.g. Y2RcO6TKO4s" value={editingVideoId ? editVideoForm.youtube_id : newVideo.youtube_id} 
                      onChange={e => editingVideoId ? setEditVideoForm({...editVideoForm, youtube_id: e.target.value}) : setNewVideo({...newVideo, youtube_id: e.target.value})} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted">Duration</label>
                    <input type="text" className="form-control" placeholder="e.g. 15:00" value={editingVideoId ? editVideoForm.duration : newVideo.duration} 
                      onChange={e => editingVideoId ? setEditVideoForm({...editVideoForm, duration: e.target.value}) : setNewVideo({...newVideo, duration: e.target.value})} required />
                  </div>
                  <div className="mb-4">
                    <label className="form-label small fw-bold text-muted">Level</label>
                    <select className="form-select" value={editingVideoId ? editVideoForm.level : newVideo.level} 
                      onChange={e => editingVideoId ? setEditVideoForm({...editVideoForm, level: e.target.value}) : setNewVideo({...newVideo, level: e.target.value})}>
                      {['Beginner', 'Intermediate', 'Advanced', 'All levels'].map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                  <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-primary flex-grow-1">{editingVideoId ? 'Save Changes' : 'Add Video'}</button>
                    {editingVideoId && <button type="button" className="btn btn-light border" onClick={cancelEditVideo}>Cancel</button>}
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="col-md-8">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-bold">Sample Videos</h5>
                <button 
                  className="btn btn-sm btn-outline-danger" 
                  disabled={!selectedVideos.length}
                  onClick={() => handleBulkDeleteVideos(selectedVideos)}
                >
                  Delete Selected ({selectedVideos.length})
                </button>
              </div>
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th width="40"><input type="checkbox" onChange={toggleAllVideos} checked={selectedVideos.length === videos.length && videos.length > 0} /></th>
                      <th>Video</th>
                      <th>YouTube ID</th>
                      <th>Level</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {videos.map(v => (
                      <tr key={v.id} className={editingVideoId === v.id ? 'table-primary' : ''}>
                        <td><input type="checkbox" checked={selectedVideos.includes(v.id)} onChange={() => toggleVideoSelection(v.id)} /></td>
                        <td className="fw-bold">{v.title}</td>
                        <td><code>{v.youtube_id}</code></td>
                        <td><span className="badge bg-light text-primary border border-primary-subtle">{v.level}</span></td>
                        <td className="text-end text-nowrap">
                          <button className="btn btn-sm btn-light border me-2" onClick={() => handleEditVideo(v)}>
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => deleteVideo(v.id)}>
                            <i className="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'inquiries' && (
        <div className="card shadow-sm border-0">
          <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
            <h5 className="mb-0 fw-bold">Contact Inquiries</h5>
            <button 
              className="btn btn-sm btn-outline-danger" 
              disabled={!selectedInquiries.length}
              onClick={() => handleBulkDeleteInquiries(selectedInquiries)}
            >
              Delete Selected ({selectedInquiries.length})
            </button>
          </div>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th width="40"><input type="checkbox" onChange={toggleAllInquiries} checked={selectedInquiries.length === inquiries.length && inquiries.length > 0} /></th>
                  <th>Date</th>
                  <th>User</th>
                  <th>Message</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.map(i => (
                  <tr key={i.id}>
                    <td><input type="checkbox" checked={selectedInquiries.includes(i.id)} onChange={() => toggleInquirySelection(i.id)} /></td>
                    <td className="small text-muted">{new Date(i.created_at).toLocaleDateString()}</td>
                    <td>
                      <div className="fw-bold">{i.user_name}</div>
                      <div className="small text-muted">{i.user_email}</div>
                    </td>
                    <td><div className="small" style={{ maxWidth: '400px' }}>{i.message}</div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'members' && (
        <div className="card shadow-sm border-0">
          <div className="card-header bg-white py-3">
            <h5 className="mb-0 fw-bold">Registered Members</h5>
          </div>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Joined</th>
                  <th>Name</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {members.map(m => (
                  <tr key={m.id}>
                    <td className="small text-muted">{new Date(m.created_at).toLocaleDateString()}</td>
                    <td className="fw-bold">{m.name}</td>
                    <td>{m.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'subscribers' && (
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card shadow-sm border-0 sticky-top" style={{ top: '2rem' }}>
              <div className="card-body p-4">
                <h5 className="fw-bold mb-4">Send Broadcast Email</h5>
                <form onSubmit={handleSendBroadcast}>
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted">Subject</label>
                    <input type="text" className="form-control" value={broadcast.subject} 
                      onChange={e => setBroadcast({...broadcast, subject: e.target.value})} required />
                  </div>
                  <div className="mb-4">
                    <label className="form-label small fw-bold text-muted">Message</label>
                    <textarea className="form-control" rows="6" value={broadcast.message} 
                      onChange={e => setBroadcast({...broadcast, message: e.target.value})} required />
                  </div>
                  <button type="submit" className="btn btn-primary w-100" disabled={!subscribers.length}>
                    <i className="bi bi-send me-2"></i>Send to {subscribers.length} Subscribers
                  </button>
                </form>
              </div>
            </div>
          </div>
          <div className="col-md-8">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-white py-3">
                <h5 className="mb-0 fw-bold">Newsletter Subscribers</h5>
              </div>
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Joined</th>
                      <th>Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscribers.map(s => (
                      <tr key={s.id}>
                        <td className="small text-muted">{new Date(s.subscribed_at).toLocaleDateString()}</td>
                        <td className="fw-bold">{s.email}</td>
                      </tr>
                    ))}
                    {subscribers.length === 0 && (
                      <tr>
                        <td colSpan="2" className="text-center py-4 text-muted">No subscribers found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
