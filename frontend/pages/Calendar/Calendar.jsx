import React from 'react';

const Calendar = () => {
  const schedule = [
    { day: 'Monday', time: '08:00 - 09:00', class: 'Morning Flow', level: 'All levels' },
    { day: 'Wednesday', time: '18:00 - 19:15', class: 'Hatha Yoga', level: 'Beginner' },
    { day: 'Friday', time: '07:30 - 08:30', class: 'Vinyasa Flow', level: 'Intermediate' },
    { day: 'Saturday', time: '10:00 - 11:30', class: 'Weekend Workshop', level: 'Advanced' },
  ];

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
            {schedule.map((item, index) => (
              <tr key={index}>
                <td className="fw-bold">{item.day}</td>
                <td>{item.time}</td>
                <td>{item.class}</td>
                <td><span className="badge bg-light text-dark border">{item.level}</span></td>
                <td><button className="btn btn-sm btn-outline-primary">Book Class</button></td>
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
