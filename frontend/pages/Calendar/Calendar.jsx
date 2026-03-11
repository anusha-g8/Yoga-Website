import React, { useState, useEffect } from 'react';

const Calendar = () => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingStatus, setBookingStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    fetch('/api/schedule')
      .then(async res => {
        if (!res.ok) {
          let errorDetail = '';
          try {
            const errorJson = await res.json();
            errorDetail = errorJson.message || errorJson.error || '';
          } catch (e) {
            errorDetail = `Status: ${res.status}`;
          }
          throw new Error(errorDetail || `HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setSchedule(data);
        } else {
          console.error('Data is not an array:', data);
          setBookingStatus({ type: 'error', message: 'Failed to load schedule. Invalid data format from server.' });
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching schedule:', err);
        setBookingStatus({ 
          type: 'error', 
          message: `Failed to load schedule: ${err.message}. Please check database connection in staging.` 
        });
        setLoading(false);
      });
  }, []);

  const handleBook = async (classId) => {
    // Simple mock booking for now - would ideally open a modal
    const userName = prompt('Enter your name:');
    const userEmail = prompt('Enter your email:');
    
    if (!userName || !userEmail) return;

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_name: userName, user_email: userEmail, class_id: classId })
      });
      if (response.ok) {
        alert('Booking successful!');
      } else {
        alert('Booking failed.');
      }
    } catch (error) {
      console.error('Booking error:', error);
    }
  };

  if (loading) return <div className="container my-5 text-center">Loading schedule...</div>;

  return (
    <div className="container my-5">
      <h1 className="text-center mb-5" style={{ color: 'var(--lav-600)' }}>Class Schedule</h1>

      {bookingStatus.type === 'error' && (
        <div className="alert alert-danger text-center mb-4">
          {bookingStatus.message}
        </div>
      )}

      <div className="table-responsive shadow-sm rounded">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th>Day</th>
              <th>Time</th>
              <th>Class Name</th>
              <th>Level</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {schedule.length > 0 ? (
              schedule.map((item) => (
                <tr key={item.id}>
                  <td className="fw-bold">{item.day}</td>
                  <td>{item.time}</td>
                  <td>{item.class_name}</td>
                  <td><span className="badge bg-light text-dark border">{item.level}</span></td>
                  <td>
                    <button 
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => handleBook(item.id)}
                    >
                      Book Class
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4 text-muted">
                  {bookingStatus.type === 'error' ? 'Could not load schedule' : 'No classes scheduled for this week.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-muted text-center small">
        * All classes are currently held online via Zoom. Link provided upon booking.
      </p>
    </div>
  );
};

export default Calendar;
