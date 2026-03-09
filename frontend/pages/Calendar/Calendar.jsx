import React, { useState, useEffect } from 'react';

const Calendar = () => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingStatus, setBookingStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    fetch('/api/schedule')
      .then(res => res.json())
      .then(data => {
        setSchedule(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching schedule:', err);
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
            {schedule.map((item) => (
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
            ))}
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
