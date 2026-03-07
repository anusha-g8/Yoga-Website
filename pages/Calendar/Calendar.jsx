import React from 'react';

const Calendar = () => {
  const upcoming = [
    { id: 1, date: 'Mar 8', title: 'Morning Flow — 9:00 AM' },
    { id: 2, date: 'Mar 10', title: 'Slow Hatha — 6:30 PM' },
    { id: 3, date: 'Mar 12', title: 'Vinyasa Build — 7:30 AM' },
  ];

  return (
    <main className="container py-5">
      <h1 className="mb-3">Class Calendar</h1>
      <p className="text-muted">This is a temporary calendar page with upcoming classes.</p>

      <div className="row g-3 mt-4">
        {upcoming.map((ev) => (
          <div key={ev.id} className="col-12 col-md-4">
            <div className="card h-100">
              <div className="card-body">
                <div className="d-flex align-items-center gap-3">
                  <div style={{ fontSize: 18, fontWeight: 700 }}>{ev.date}</div>
                  <div>
                    <h5 className="card-title mb-1">{ev.title}</h5>
                    <p className="text-muted mb-0">Location: Studio A</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 text-center text-muted">(Calendar integration and booking will be added later.)</div>
    </main>
  );
};

export default Calendar;
