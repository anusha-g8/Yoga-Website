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
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Form states
  const [scheduleForm, setScheduleForm] = useState({ day: 'Monday', time: '', class_name: '', level: 'All levels' });
  const [programForm, setProgramForm] = useState({ title: '', description: '', level: 'Beginner', duration: '', price: '', image_url: '/assets/images/yoga1.jpg' });
  const [videoForm, setVideoForm] = useState({ title: '', description: '', level: 'Beginner', duration: '', youtube_id: '', url: '' });

  const [selectedBookings, setSelectedBookings] = useState([]);
  const [selectedSchedules, setSelectedSchedules] = useState([]);
  const [selectedPrograms, setSelectedPrograms] = useState([]);
  const [selectedInquiries, setSelectedInquiries] = useState([]);
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);

  // Editing state
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

  // Clear selections when switching tabs
  useEffect(() => {
    setSelectedBookings([]);
    setSelectedSchedules([]);
    setSelectedPrograms([]);
    setSelectedInquiries([]);
    setSelectedVideos([]);
    setSelectedMembers([]);
    setEditingScheduleId(null); // Clear editing on tab switch
    setEditingProgramId(null);
    setEditingVideoId(null);
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const endpoints = ['bookings', 'schedule', 'programs', 'inquiries', 'videos', 'members'];
      
      const results = await Promise.allSettled(
        endpoints.map(ep => fetch(`${API_BASE_URL}/${ep}`, {
          headers: { 'x-auth-token': localStorage.getItem('adminToken') }
        }).then(async res => {
          if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
          return res.json();
        }))
      );

      const data = results.map((result, idx) => {
        if (result.status === 'fulfilled') {
          return result.value;
        } else {
          console.error(`Failed to fetch ${endpoints[idx]}:`, result.reason);
          return [];
        }
      });

      const [bookingsData, scheduleData, programsData, inquiriesData, videosData, membersData] = data;
      
      setBookings(Array.isArray(bookingsData) ? bookingsData : []);
      setSchedule(Array.isArray(scheduleData) ? scheduleData : []);
      setPrograms(Array.isArray(programsData) ? programsData : []);
      setInquiries(Array.isArray(inquiriesData) ? inquiriesData : []);
      setVideos(Array.isArray(videosData) ? videosData : []);
      setMembers(Array.isArray(membersData) ? membersData : []);
      
    } catch (err) {
      console.error('Critical error in fetchData:', err);
    } finally {
      setSelectedBookings([]);
      setSelectedSchedules([]);
      setSelectedPrograms([]);
      setSelectedInquiries([]);
      setSelectedVideos([]);
      setSelectedMembers([]);
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${id}/status`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('adminToken')
        },
        body: JSON.stringify({ status })
      });
      if (response.ok) {
        fetchData();
      } else {
        alert('Failed to update status');
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleBulkUpdate = async (ids, status) => {
    if (!ids.length) return;
    const confirmMsg = ids.length === bookings.length 
      ? `Are you sure you want to ${status} ALL bookings?`
      : `Are you sure you want to ${status} ${ids.length} selected bookings?`;
    
    if (!window.confirm(confirmMsg)) return;

    try {
      // Process updates in parallel
      const updatePromises = ids.map(id => 
        fetch(`${API_BASE_URL}/bookings/${id}/status`, {
          method: 'PATCH',
          headers: { 
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('adminToken')
        },
          body: JSON.stringify({ status })
        })
      );
      
      await Promise.all(updatePromises);
      fetchData();
    } catch (err) {
      console.error('Bulk update error:', err);
      alert('Error during bulk update');
    }
  };

  const handleSelectOne = (id) => {
    setSelectedBookings(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedBookings.length === bookings.length) {
      setSelectedBookings([]);
    } else {
      setSelectedBookings(bookings.map(b => b.id));
    }
  };

  const handleSelectOneSchedule = (id) => {
    setSelectedSchedules(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllSchedule = () => {
    if (selectedSchedules.length === schedule.length) {
      setSelectedSchedules([]);
    } else {
      setSelectedSchedules(schedule.map(s => s.id));
    }
  };

  const handleSelectOneProgram = (id) => {
    setSelectedPrograms(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllProgram = () => {
    if (selectedPrograms.length === programs.length) {
      setSelectedPrograms([]);
    } else {
      setSelectedPrograms(programs.map(p => p.id));
    }
  };

  const handleSelectOneInquiry = (id) => {
    setSelectedInquiries(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllInquiry = () => {
    if (selectedInquiries.length === inquiries.length) {
      setSelectedInquiries([]);
    } else {
      setSelectedInquiries(inquiries.map(i => i.id));
    }
  };

  const handleSelectOneVideo = (id) => {
    setSelectedVideos(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllVideo = () => {
    if (selectedVideos.length === videos.length) {
      setSelectedVideos([]);
    } else {
      setSelectedVideos(videos.map(v => v.id));
    }
  };

  const startEditingSchedule = (s) => {
    setEditingScheduleId(s.id);
    setEditScheduleForm({ day: s.day, time: s.time, class_name: s.class_name, level: s.level });
  };

  const cancelEditingSchedule = () => {
    setEditingScheduleId(null);
    setEditScheduleForm({ day: 'Monday', time: '', class_name: '', level: '' });
  };

  const handleUpdateSchedule = async (id) => {
    if (!editScheduleForm.time.trim() || !editScheduleForm.class_name.trim() || !editScheduleForm.level.trim()) {
      alert('All fields are required');
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/schedule/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('adminToken')
        },
        body: JSON.stringify(editScheduleForm)
      });
      if (response.ok) {
        setEditingScheduleId(null);
        fetchData();
      } else {
        const errorData = await response.json();
        alert(`Update failed: ${errorData.message}`);
      }
    } catch (err) {
      console.error('Error updating schedule:', err);
    }
  };

  const startEditingProgram = (p) => {
    setEditingProgramId(p.id);
    setEditProgramForm({ 
      title: p.title, 
      description: p.description, 
      level: p.level, 
      duration: p.duration, 
      price: p.price, 
      image_url: p.image_url 
    });
  };

  const cancelEditingProgram = () => {
    setEditingProgramId(null);
    setEditProgramForm({ title: '', description: '', level: '', duration: '', price: '', image_url: '' });
  };

  const handleUpdateProgram = async (id) => {
    const { title, description, duration, price, level, image_url } = editProgramForm;
    if (!title.trim() || !description.trim() || !duration.trim() || !price || !level.trim() || !image_url.trim()) {
      alert('All fields are required');
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/programs/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('adminToken')
        },
        body: JSON.stringify(editProgramForm)
      });
      if (response.ok) {
        setEditingProgramId(null);
        fetchData();
      } else {
        const errorData = await response.json();
        alert(`Update failed: ${errorData.message}`);
      }
    } catch (err) {
      console.error('Error updating program:', err);
    }
  };

  const startEditingVideo = (v) => {
    setEditingVideoId(v.id);
    setEditVideoForm({ 
      title: v.title, 
      description: v.description, 
      level: v.level, 
      duration: v.duration, 
      youtube_id: v.youtube_id, 
      url: v.url 
    });
  };

  const cancelEditingVideo = () => {
    setEditingVideoId(null);
    setEditVideoForm({ title: '', description: '', level: '', duration: '', youtube_id: '', url: '' });
  };

  const handleUpdateVideo = async (id) => {
    const { title, level, duration, youtube_id } = editVideoForm;
    if (!title.trim() || !level.trim() || !duration.trim() || !youtube_id.trim()) {
      alert('Title, Level, Duration and YouTube ID are required');
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/videos/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('adminToken')
        },
        body: JSON.stringify(editVideoForm)
      });
      if (response.ok) {
        setEditingVideoId(null);
        fetchData();
      } else {
        const errorData = await response.json();
        alert(`Update failed: ${errorData.message}`);
      }
    } catch (err) {
      console.error('Error updating video:', err);
    }
  };

  const handleBulkDeleteSchedule = async (ids) => {
    if (!ids.length) return;
    const confirmMsg = ids.length === schedule.length 
      ? `WARNING: This will delete ALL ${ids.length} classes AND their associated bookings. Proceed?`
      : `Delete ${ids.length} selected classes and their associated bookings?`;
    
    if (!window.confirm(confirmMsg)) return;

    try {
      const deletePromises = ids.map(id => 
        fetch(`${API_BASE_URL}/schedule/${id}`, { 
          method: 'DELETE',
          headers: { 'x-auth-token': localStorage.getItem('adminToken') }
        })
      );
      await Promise.all(deletePromises);
      alert('Classes deleted successfully');
      fetchData();
    } catch (err) {
      console.error('Bulk delete error:', err);
      alert('Error during bulk deletion');
    }
  };

  const handleBulkDeleteProgram = async (ids) => {
    if (!ids.length) return;
    const confirmMsg = ids.length === programs.length 
      ? `WARNING: This will delete ALL ${ids.length} programs AND their associated bookings. Proceed?`
      : `Delete ${ids.length} selected programs and their associated bookings?`;
    
    if (!window.confirm(confirmMsg)) return;

    try {
      const deletePromises = ids.map(id => 
        fetch(`${API_BASE_URL}/programs/${id}`, { 
          method: 'DELETE',
          headers: { 'x-auth-token': localStorage.getItem('adminToken') }
        })
      );
      await Promise.all(deletePromises);
      alert('Programs deleted successfully');
      fetchData();
    } catch (err) {
      console.error('Bulk delete error:', err);
      alert('Error during bulk deletion');
    }
  };

  const handleBulkDeleteInquiry = async (ids) => {
    if (!ids.length) return;
    const confirmMsg = ids.length === inquiries.length 
      ? `Delete ALL ${ids.length} inquiries?`
      : `Delete ${ids.length} selected inquiries?`;
    
    if (!window.confirm(confirmMsg)) return;

    try {
      const deletePromises = ids.map(id => 
        fetch(`${API_BASE_URL}/inquiries/${id}`, { 
          method: 'DELETE',
          headers: { 'x-auth-token': localStorage.getItem('adminToken') }
        })
      );
      await Promise.all(deletePromises);
      alert('Inquiries deleted successfully');
      fetchData();
    } catch (err) {
      console.error('Bulk delete error:', err);
      alert('Error during bulk deletion');
    }
  };

  const handleBulkDeleteVideo = async (ids) => {
    if (!ids.length) return;
    const confirmMsg = ids.length === videos.length 
      ? `Delete ALL ${ids.length} videos?`
      : `Delete ${ids.length} selected videos?`;
    
    if (!window.confirm(confirmMsg)) return;

    try {
      const deletePromises = ids.map(id => 
        fetch(`${API_BASE_URL}/videos/${id}`, { 
          method: 'DELETE',
          headers: { 'x-auth-token': localStorage.getItem('adminToken') }
        })
      );
      await Promise.all(deletePromises);
      alert('Videos deleted successfully');
      fetchData();
    } catch (err) {
      console.error('Bulk delete error:', err);
      alert('Error during bulk deletion');
    }
  };

  const handleDeleteBooking = async (id) => {
    if (!window.confirm('Delete this booking record?')) return;
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${id}`, { 
          method: 'DELETE',
          headers: { 'x-auth-token': localStorage.getItem('adminToken') }
        });
      if (response.ok) {
        alert('Booking deleted successfully');
        fetchData();
      } else {
        alert('Failed to delete booking');
      }
    } catch (err) {
      console.error('Error deleting booking:', err);
    }
  };

  const handleDeleteSchedule = async (id) => {
    if (!window.confirm('Delete this class? This will also delete associated bookings.')) return;
    try {
      const response = await fetch(`${API_BASE_URL}/schedule/${id}`, { 
          method: 'DELETE',
          headers: { 'x-auth-token': localStorage.getItem('adminToken') }
        });
      if (response.ok) {
        alert('Schedule item deleted successfully');
        fetchData();
      } else {
        const errorData = await response.json();
        alert(`Failed to delete schedule: ${errorData.message}\nError: ${errorData.error || 'Unknown'}\nDetail: ${errorData.detail || 'None'}`);
      }
    } catch (err) {
      console.error('Error deleting schedule:', err);
      alert('Error connecting to the server: ' + err.message);
    }
  };

  const handleDeleteProgram = async (id) => {
    if (!window.confirm('Delete this program? This will also delete associated bookings.')) return;
    try {
      const response = await fetch(`${API_BASE_URL}/programs/${id}`, { 
          method: 'DELETE',
          headers: { 'x-auth-token': localStorage.getItem('adminToken') }
        });
      if (response.ok) {
        alert('Program deleted successfully');
        fetchData();
      } else {
        alert('Failed to delete program');
      }
    } catch (err) {
      console.error('Error deleting program:', err);
    }
  };

  const handleDeleteInquiry = async (id) => {
    if (!window.confirm('Delete this inquiry?')) return;
    try {
      const response = await fetch(`${API_BASE_URL}/inquiries/${id}`, { 
          method: 'DELETE',
          headers: { 'x-auth-token': localStorage.getItem('adminToken') }
        });
      if (response.ok) {
        alert('Inquiry deleted successfully');
        fetchData();
      } else {
        alert('Failed to delete inquiry');
      }
    } catch (err) {
      console.error('Error deleting inquiry:', err);
    }
  };

  const handleDeleteVideo = async (id) => {
    if (!window.confirm('Delete this video?')) return;
    try {
      const response = await fetch(`${API_BASE_URL}/videos/${id}`, { 
          method: 'DELETE',
          headers: { 'x-auth-token': localStorage.getItem('adminToken') }
        });
      if (response.ok) {
        alert('Video deleted successfully');
        fetchData();
      } else {
        alert('Failed to delete video');
      }
    } catch (err) {
      console.error('Error deleting video:', err);
    }
  };

  const handleDeleteMember = async (id) => {
    if (!window.confirm('Delete this member?')) return;
    try {
      const response = await fetch(`${API_BASE_URL}/members/${id}`, { 
          method: 'DELETE',
          headers: { 'x-auth-token': localStorage.getItem('adminToken') }
        });
      if (response.ok) {
        alert('Member deleted successfully');
        fetchData();
      } else {
        alert('Failed to delete member');
      }
    } catch (err) {
      console.error('Error deleting member:', err);
    }
  };

  const handleSelectOneMember = (id) => {
    setSelectedMembers(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllMember = () => {
    if (selectedMembers.length === members.length) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers(members.map(m => m.id));
    }
  };

  const handleBulkDeleteMember = async (ids) => {
    if (!ids.length) return;
    const confirmMsg = ids.length === members.length 
      ? `Delete ALL ${ids.length} members?`
      : `Delete ${ids.length} selected members?`;
    
    if (!window.confirm(confirmMsg)) return;

    try {
      const deletePromises = ids.map(id => 
        fetch(`${API_BASE_URL}/members/${id}`, { 
          method: 'DELETE',
          headers: { 'x-auth-token': localStorage.getItem('adminToken') }
        })
      );
      await Promise.all(deletePromises);
      alert('Members deleted successfully');
      fetchData();
    } catch (err) {
      console.error('Bulk delete error:', err);
      alert('Error during bulk deletion');
    }
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    const { time, class_name, level } = scheduleForm;
    if (!time.trim() || !class_name.trim() || !level.trim()) {
      alert('All fields are required');
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/schedule`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('adminToken')
        },
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
    const { title, description, duration, price, level, image_url } = programForm;
    if (!title.trim() || !description.trim() || !duration.trim() || !price || !level.trim() || !image_url.trim()) {
      alert('All fields are required');
      return;
    }
    if (parseFloat(price) <= 0) {
      alert('Price must be greater than 0');
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/programs`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('adminToken')
        },
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

  const handleVideoSubmit = async (e) => {
    e.preventDefault();
    const { title, description, level, duration, youtube_id, url } = videoForm;
    if (!title.trim() || !level.trim() || !duration.trim() || !youtube_id.trim()) {
      alert('Title, Level, Duration and YouTube ID are required');
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/videos`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('adminToken')
        },
        body: JSON.stringify({ title, description, level, duration, youtube_id, url })
      });
      if (response.ok) {
        setVideoForm({ title: '', description: '', level: 'Beginner', duration: '', youtube_id: '', url: '' });
        fetchData();
      }
    } catch (err) {
      console.error('Error adding video:', err);
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
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'inquiries' ? 'active' : ''}`} onClick={() => setActiveTab('inquiries')}>Inquiries</button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'videos' ? 'active' : ''}`} onClick={() => setActiveTab('videos')}>Videos</button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'members' ? 'active' : ''}`} onClick={() => setActiveTab('members')}>Members</button>
        </li>
      </ul>

      {/* Bookings Tab */}
      {activeTab === 'bookings' && (
        <div>
          {/* Bulk Actions Header */}
          <div className="d-flex flex-wrap gap-2 mb-3 align-items-center bg-light p-3 rounded border">
            <div className="me-auto">
              <span className="fw-bold">{selectedBookings.length}</span> bookings selected
            </div>
            <div className="btn-group">
              <button 
                className="btn btn-sm btn-success" 
                disabled={selectedBookings.length === 0}
                onClick={() => handleBulkUpdate(selectedBookings, 'confirmed')}
              >
                Accept Selected
              </button>
              <button 
                className="btn btn-sm btn-danger" 
                disabled={selectedBookings.length === 0}
                onClick={() => handleBulkUpdate(selectedBookings, 'declined')}
              >
                Decline Selected
              </button>
            </div>
            <div className="vr mx-2 d-none d-md-block"></div>
            <div className="btn-group">
              <button 
                className="btn btn-sm btn-outline-success" 
                disabled={bookings.length === 0}
                onClick={() => handleBulkUpdate(bookings.map(b => b.id), 'confirmed')}
              >
                Accept All
              </button>
              <button 
                className="btn btn-sm btn-outline-danger" 
                disabled={bookings.length === 0}
                onClick={() => handleBulkUpdate(bookings.map(b => b.id), 'declined')}
              >
                Decline All
              </button>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead>
                <tr>
                  <th style={{ width: '40px' }}>
                    <input 
                      type="checkbox" 
                      className="form-check-input"
                      checked={bookings.length > 0 && selectedBookings.length === bookings.length}
                      onChange={handleSelectAll}
                    />
                  </th>
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
                  <tr key={b.id} className={selectedBookings.includes(b.id) ? 'table-primary' : ''}>
                    <td>
                      <input 
                        type="checkbox" 
                        className="form-check-input"
                        checked={selectedBookings.includes(b.id)}
                        onChange={() => handleSelectOne(b.id)}
                      />
                    </td>
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
                      <div className="btn-group">
                        {b.status === 'pending' && (
                          <>
                            <button className="btn btn-sm btn-success me-2" onClick={() => handleUpdateStatus(b.id, 'confirmed')}>Accept</button>
                            <button className="btn btn-sm btn-danger me-2" onClick={() => handleUpdateStatus(b.id, 'declined')}>Decline</button>
                          </>
                        )}
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteBooking(b.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {bookings.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-muted">No bookings found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Schedule Tab */}
      {activeTab === 'schedule' && (
        <div>
          <form className="card card-body mb-4 shadow-sm" onSubmit={handleScheduleSubmit}>
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

          {/* Bulk Actions for Schedule */}
          <div className="d-flex flex-wrap gap-2 mb-3 align-items-center bg-light p-3 rounded border">
            <div className="me-auto">
              <span className="fw-bold">{selectedSchedules.length}</span> classes selected
            </div>
            <button 
              className="btn btn-sm btn-danger" 
              disabled={selectedSchedules.length === 0}
              onClick={() => handleBulkDeleteSchedule(selectedSchedules)}
            >
              Delete Selected
            </button>
            <div className="vr mx-2 d-none d-md-block"></div>
            <button 
              className="btn btn-sm btn-outline-danger" 
              disabled={schedule.length === 0}
              onClick={() => handleBulkDeleteSchedule(schedule.map(s => s.id))}
            >
              Delete All
            </button>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead>
                <tr>
                  <th style={{ width: '40px' }}>
                    <input 
                      type="checkbox" 
                      className="form-check-input"
                      checked={schedule.length > 0 && selectedSchedules.length === schedule.length}
                      onChange={handleSelectAllSchedule}
                    />
                  </th>
                  <th>Day</th>
                  <th>Time</th>
                  <th>Class</th>
                  <th>Level</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {schedule.map((s) => (
                  <tr key={s.id} className={selectedSchedules.includes(s.id) ? 'table-danger-light' : ''}>
                    <td>
                      <input 
                        type="checkbox" 
                        className="form-check-input"
                        checked={selectedSchedules.includes(s.id)}
                        onChange={() => handleSelectOneSchedule(s.id)}
                        disabled={editingScheduleId === s.id}
                      />
                    </td>
                    {editingScheduleId === s.id ? (
                      <>
                        <td>
                          <select 
                            className="form-select form-select-sm" 
                            value={editScheduleForm.day} 
                            onChange={(e) => setEditScheduleForm({...editScheduleForm, day: e.target.value})}
                          >
                            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => <option key={d} value={d}>{d}</option>)}
                          </select>
                        </td>
                        <td>
                          <input 
                            type="text" 
                            className="form-control form-control-sm" 
                            value={editScheduleForm.time} 
                            onChange={(e) => setEditScheduleForm({...editScheduleForm, time: e.target.value})} 
                          />
                        </td>
                        <td>
                          <input 
                            type="text" 
                            className="form-control form-control-sm" 
                            value={editScheduleForm.class_name} 
                            onChange={(e) => setEditScheduleForm({...editScheduleForm, class_name: e.target.value})} 
                          />
                        </td>
                        <td>
                          <input 
                            type="text" 
                            className="form-control form-control-sm" 
                            value={editScheduleForm.level} 
                            onChange={(e) => setEditScheduleForm({...editScheduleForm, level: e.target.value})} 
                          />
                        </td>
                        <td>
                          <div className="btn-group">
                            <button className="btn btn-sm btn-success me-1" onClick={() => handleUpdateSchedule(s.id)}>Save</button>
                            <button className="btn btn-sm btn-secondary" onClick={cancelEditingSchedule}>Cancel</button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{s.day}</td>
                        <td>{s.time}</td>
                        <td>{s.class_name}</td>
                        <td>{s.level}</td>
                        <td>
                          <div className="btn-group">
                            <button className="btn btn-sm btn-outline-primary me-1" onClick={() => startEditingSchedule(s)}>Edit</button>
                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteSchedule(s.id)}>Delete</button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
                {schedule.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-muted">No classes found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Programs Tab */}
      {activeTab === 'programs' && (
        <div>
          <form className="card card-body mb-4 shadow-sm" onSubmit={handleProgramSubmit}>
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

          {/* Bulk Actions for Programs */}
          <div className="d-flex flex-wrap gap-2 mb-3 align-items-center bg-light p-3 rounded border">
            <div className="me-auto">
              <span className="fw-bold">{selectedPrograms.length}</span> programs selected
            </div>
            <button 
              className="btn btn-sm btn-danger" 
              disabled={selectedPrograms.length === 0}
              onClick={() => handleBulkDeleteProgram(selectedPrograms)}
            >
              Delete Selected
            </button>
            <div className="vr mx-2 d-none d-md-block"></div>
            <button 
              className="btn btn-sm btn-outline-danger" 
              disabled={programs.length === 0}
              onClick={() => handleBulkDeleteProgram(programs.map(p => p.id))}
            >
              Delete All
            </button>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead>
                <tr>
                  <th style={{ width: '40px' }}>
                    <input 
                      type="checkbox" 
                      className="form-check-input"
                      checked={programs.length > 0 && selectedPrograms.length === programs.length}
                      onChange={handleSelectAllProgram}
                    />
                  </th>
                  <th>Title</th>
                  <th>Level</th>
                  <th>Duration</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {programs.map((p) => (
                  <tr key={p.id} className={selectedPrograms.includes(p.id) ? 'table-danger-light' : ''}>
                    <td>
                      <input 
                        type="checkbox" 
                        className="form-check-input"
                        checked={selectedPrograms.includes(p.id)}
                        onChange={() => handleSelectOneProgram(p.id)}
                        disabled={editingProgramId === p.id}
                      />
                    </td>
                    {editingProgramId === p.id ? (
                      <>
                        <td>
                          <input 
                            type="text" 
                            className="form-control form-control-sm mb-1" 
                            placeholder="Title"
                            value={editProgramForm.title} 
                            onChange={(e) => setEditProgramForm({...editProgramForm, title: e.target.value})} 
                          />
                          <textarea 
                            className="form-control form-control-sm mb-1" 
                            placeholder="Description"
                            value={editProgramForm.description} 
                            onChange={(e) => setEditProgramForm({...editProgramForm, description: e.target.value})} 
                          />
                          <input 
                            type="text" 
                            className="form-control form-control-sm" 
                            placeholder="Image Path"
                            value={editProgramForm.image_url} 
                            onChange={(e) => setEditProgramForm({...editProgramForm, image_url: e.target.value})} 
                          />
                        </td>
                        <td>
                          <input 
                            type="text" 
                            className="form-control form-control-sm" 
                            value={editProgramForm.level} 
                            onChange={(e) => setEditProgramForm({...editProgramForm, level: e.target.value})} 
                          />
                        </td>
                        <td>
                          <input 
                            type="text" 
                            className="form-control form-control-sm" 
                            value={editProgramForm.duration} 
                            onChange={(e) => setEditProgramForm({...editProgramForm, duration: e.target.value})} 
                          />
                        </td>
                        <td>
                          <input 
                            type="number" 
                            className="form-control form-control-sm" 
                            value={editProgramForm.price} 
                            onChange={(e) => setEditProgramForm({...editProgramForm, price: e.target.value})} 
                          />
                        </td>
                        <td>
                          <div className="btn-group">
                            <button className="btn btn-sm btn-success me-1" onClick={() => handleUpdateProgram(p.id)}>Save</button>
                            <button className="btn btn-sm btn-secondary" onClick={cancelEditingProgram}>Cancel</button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{p.title}</td>
                        <td>{p.level}</td>
                        <td>{p.duration}</td>
                        <td>${p.price}</td>
                        <td>
                          <div className="btn-group">
                            <button className="btn btn-sm btn-outline-primary me-1" onClick={() => startEditingProgram(p)}>Edit</button>
                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteProgram(p.id)}>Delete</button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
                {programs.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-muted">No programs found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}


      {/* Inquiries Tab */}
      {activeTab === 'inquiries' && (
        <div>
          {/* Bulk Actions for Inquiries */}
          <div className="d-flex flex-wrap gap-2 mb-3 align-items-center bg-light p-3 rounded border">
            <div className="me-auto">
              <span className="fw-bold">{selectedInquiries.length}</span> inquiries selected
            </div>
            <button 
              className="btn btn-sm btn-danger" 
              disabled={selectedInquiries.length === 0}
              onClick={() => handleBulkDeleteInquiry(selectedInquiries)}
            >
              Delete Selected
            </button>
            <div className="vr mx-2 d-none d-md-block"></div>
            <button 
              className="btn btn-sm btn-outline-danger" 
              disabled={inquiries.length === 0}
              onClick={() => handleBulkDeleteInquiry(inquiries.map(i => i.id))}
            >
              Delete All
            </button>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead>
                <tr>
                  <th style={{ width: '40px' }}>
                    <input 
                      type="checkbox" 
                      className="form-check-input"
                      checked={inquiries.length > 0 && selectedInquiries.length === inquiries.length}
                      onChange={handleSelectAllInquiry}
                    />
                  </th>
                  <th>Date</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Message</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.map((i) => (
                  <tr key={i.id} className={selectedInquiries.includes(i.id) ? 'table-danger-light' : ''}>
                    <td>
                      <input 
                        type="checkbox" 
                        className="form-check-input"
                        checked={selectedInquiries.includes(i.id)}
                        onChange={() => handleSelectOneInquiry(i.id)}
                      />
                    </td>
                    <td>{new Date(i.created_at).toLocaleDateString()}</td>
                    <td>{i.user_name}</td>
                    <td>{i.user_email}</td>
                    <td>{i.message}</td>
                    <td>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteInquiry(i.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {inquiries.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-muted">No inquiries found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Videos Tab */}
      {activeTab === 'videos' && (
        <div>
          <form className="card card-body mb-4 shadow-sm" onSubmit={handleVideoSubmit}>
            <h5>Add New Practice Video</h5>
            <div className="row g-3">
              <div className="col-md-6">
                <input type="text" className="form-control" placeholder="Title" value={videoForm.title} onChange={(e) => setVideoForm({...videoForm, title: e.target.value})} required />
              </div>
              <div className="col-md-3">
                <input type="text" className="form-control" placeholder="YouTube ID (e.g. Y2RcO6TKO4s)" value={videoForm.youtube_id} onChange={(e) => setVideoForm({...videoForm, youtube_id: e.target.value})} required />
              </div>
              <div className="col-md-3">
                <input type="text" className="form-control" placeholder="Duration (e.g. 15:00)" value={videoForm.duration} onChange={(e) => setVideoForm({...videoForm, duration: e.target.value})} required />
              </div>
              <div className="col-md-12">
                <textarea className="form-control" placeholder="Description" value={videoForm.description} onChange={(e) => setVideoForm({...videoForm, description: e.target.value})} />
              </div>
              <div className="col-md-4">
                <input type="text" className="form-control" placeholder="Level (e.g. Beginner)" value={videoForm.level} onChange={(e) => setVideoForm({...videoForm, level: e.target.value})} required />
              </div>
              <div className="col-md-6">
                <input type="text" className="form-control" placeholder="YouTube URL (optional)" value={videoForm.url} onChange={(e) => setVideoForm({...videoForm, url: e.target.value})} />
              </div>
              <div className="col-md-2">
                <button type="submit" className="btn btn-primary w-100">Add Video</button>
              </div>
            </div>
          </form>

          {/* Bulk Actions for Videos */}
          <div className="d-flex flex-wrap gap-2 mb-3 align-items-center bg-light p-3 rounded border">
            <div className="me-auto">
              <span className="fw-bold">{selectedVideos.length}</span> videos selected
            </div>
            <button 
              className="btn btn-sm btn-danger" 
              disabled={selectedVideos.length === 0}
              onClick={() => handleBulkDeleteVideo(selectedVideos)}
            >
              Delete Selected
            </button>
            <div className="vr mx-2 d-none d-md-block"></div>
            <button 
              className="btn btn-sm btn-outline-danger" 
              disabled={videos.length === 0}
              onClick={() => handleBulkDeleteVideo(videos.map(v => v.id))}
            >
              Delete All
            </button>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead>
                <tr>
                  <th style={{ width: '40px' }}>
                    <input 
                      type="checkbox" 
                      className="form-check-input"
                      checked={videos.length > 0 && selectedVideos.length === videos.length}
                      onChange={handleSelectAllVideo}
                    />
                  </th>
                  <th>Title</th>
                  <th>Level</th>
                  <th>Duration</th>
                  <th>YouTube ID</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {videos.map((v) => (
                  <tr key={v.id} className={selectedVideos.includes(v.id) ? 'table-danger-light' : ''}>
                    <td>
                      <input 
                        type="checkbox" 
                        className="form-check-input"
                        checked={selectedVideos.includes(v.id)}
                        onChange={() => handleSelectOneVideo(v.id)}
                        disabled={editingVideoId === v.id}
                      />
                    </td>
                    {editingVideoId === v.id ? (
                      <>
                        <td>
                          <input 
                            type="text" 
                            className="form-control form-control-sm mb-1" 
                            placeholder="Title"
                            value={editVideoForm.title} 
                            onChange={(e) => setEditVideoForm({...editVideoForm, title: e.target.value})} 
                          />
                          <textarea 
                            className="form-control form-control-sm mb-1" 
                            placeholder="Description"
                            value={editVideoForm.description} 
                            onChange={(e) => setEditVideoForm({...editVideoForm, description: e.target.value})} 
                          />
                          <input 
                            type="text" 
                            className="form-control form-control-sm" 
                            placeholder="YouTube URL"
                            value={editVideoForm.url} 
                            onChange={(e) => setEditVideoForm({...editVideoForm, url: e.target.value})} 
                          />
                        </td>
                        <td>
                          <input 
                            type="text" 
                            className="form-control form-control-sm" 
                            value={editVideoForm.level} 
                            onChange={(e) => setEditVideoForm({...editVideoForm, level: e.target.value})} 
                          />
                        </td>
                        <td>
                          <input 
                            type="text" 
                            className="form-control form-control-sm" 
                            value={editVideoForm.duration} 
                            onChange={(e) => setEditVideoForm({...editVideoForm, duration: e.target.value})} 
                          />
                        </td>
                        <td>
                          <input 
                            type="text" 
                            className="form-control form-control-sm" 
                            value={editVideoForm.youtube_id} 
                            onChange={(e) => setEditVideoForm({...editVideoForm, youtube_id: e.target.value})} 
                          />
                        </td>
                        <td>
                          <div className="btn-group">
                            <button className="btn btn-sm btn-success me-1" onClick={() => handleUpdateVideo(v.id)}>Save</button>
                            <button className="btn btn-sm btn-secondary" onClick={cancelEditingVideo}>Cancel</button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{v.title}</td>
                        <td>{v.level}</td>
                        <td>{v.duration}</td>
                        <td><code>{v.youtube_id}</code></td>
                        <td>
                          <div className="btn-group">
                            <button className="btn btn-sm btn-outline-primary me-1" onClick={() => startEditingVideo(v)}>Edit</button>
                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteVideo(v.id)}>Delete</button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
                {videos.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-muted">No videos found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Members Tab */}
      {activeTab === 'members' && (
        <div>
          {/* Bulk Actions for Members */}
          <div className="d-flex flex-wrap gap-2 mb-3 align-items-center bg-light p-3 rounded border">
            <div className="me-auto">
              <span className="fw-bold">{selectedMembers.length}</span> members selected
            </div>
            <button 
              className="btn btn-sm btn-danger" 
              disabled={selectedMembers.length === 0}
              onClick={() => handleBulkDeleteMember(selectedMembers)}
            >
              Delete Selected
            </button>
            <div className="vr mx-2 d-none d-md-block"></div>
            <button 
              className="btn btn-sm btn-outline-danger" 
              disabled={members.length === 0}
              onClick={() => handleBulkDeleteMember(members.map(m => m.id))}
            >
              Delete All
            </button>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead>
                <tr>
                  <th style={{ width: '40px' }}>
                    <input 
                      type="checkbox" 
                      className="form-check-input"
                      checked={members.length > 0 && selectedMembers.length === members.length}
                      onChange={handleSelectAllMember}
                    />
                  </th>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Joined Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.map((m) => (
                  <tr key={m.id} className={selectedMembers.includes(m.id) ? 'table-danger-light' : ''}>
                    <td>
                      <input 
                        type="checkbox" 
                        className="form-check-input"
                        checked={selectedMembers.includes(m.id)}
                        onChange={() => handleSelectOneMember(m.id)}
                      />
                    </td>
                    <td>{m.id}</td>
                    <td>{m.name}</td>
                    <td>{m.email}</td>
                    <td>{new Date(m.created_at).toLocaleDateString()}</td>
                    <td>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteMember(m.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {members.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-muted">No members found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
