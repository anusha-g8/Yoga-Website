import { API_BASE_URL } from '../../src/config';
import React, { useState, useEffect } from 'react';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/programs`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setCourses(data);
        } else {
          console.error('Data is not an array:', data);
          setError('Invalid data format received from server.');
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching programs:', err);
        setError('Failed to load courses. Please check if the backend is running.');
        setLoading(false);
      });
    }, []);

    const handleEnroll = async (programId) => {
    const userName = prompt('Enter your name:');
    if (!userName) {
      alert('Name is required for enrollment');
      return;
    }
    const userEmail = prompt('Enter your email:');
    if (!userEmail) {
      alert('Email is required for enrollment');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_name: userName, user_email: userEmail, program_id: programId })
      });
      if (response.ok) {
        alert('Enrollment request sent successfully!');
      } else {
        alert('Enrollment failed.');
      }
    } catch (error) {
      console.error('Enrollment error:', error);
      alert('An error occurred during enrollment.');
    }
  };


  if (loading) return <div className="container my-5 text-center">Loading courses...</div>;

  return (
    <div className="container my-5">
      <h1 className="text-center mb-5" style={{ color: 'var(--lav-600)' }}>Online Courses & Packages</h1>
      
      {error && (
        <div className="alert alert-danger text-center mb-4">
          {error}
        </div>
      )}

      <div className="row g-4">
        {courses.length > 0 ? (
          courses.map((course) => (
            <div key={course.id} className="col-12 col-md-4">
              <div className="card h-100 shadow-sm border-0">
                <img src={course.image_url} className="card-img-top" alt={course.title} style={{ height: '180px', objectFit: 'cover' }} />
                <div className="card-body">
                  <h5 className="card-title fw-bold">{course.title}</h5>
                  <p className="card-text text-muted small">{course.description}</p>
                  <div className="mt-3 d-flex justify-content-between align-items-center">
                    <span className="text-muted small"><i className="bi bi-clock me-1"></i>{course.duration}</span>
                    <span className="fw-bold text-primary fs-5">${course.price}</span>
                  </div>
                </div>
                <div className="card-footer bg-transparent border-0 pb-3">
                  <button 
                    className="btn btn-primary w-100"
                    onClick={() => handleEnroll(course.id)}
                  >
                    Enroll Now
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center py-5">
            <p className="text-muted">
              {error ? 'Could not load courses' : 'No courses currently available. Please check back later!'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
