import React from 'react';

const Courses = () => {
  const courses = [
    { id: 1, title: 'Foundations: 4-week Series', length: '4 weeks', level: 'Beginner' },
    { id: 2, title: 'Deepen Your Practice', length: '6 weeks', level: 'Intermediate' },
    { id: 3, title: 'Restorative Weekend', length: '2 days', level: 'All levels' },
  ];

  return (
    <main className="container py-5">
      <h1 className="mb-3">Courses</h1>
      <p className="text-muted">Temporary listing of sample course offerings.</p>

      <div className="row g-4 mt-4">
        {courses.map((c) => (
          <div key={c.id} className="col-12 col-md-6 col-lg-4">
            <div className="card h-100">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{c.title}</h5>
                <p className="text-muted">{c.length} • {c.level}</p>
                <p className="mt-2">A short description about what the course offers and who it is for. This is placeholder text.</p>
                <div className="mt-auto">
                  <button className="btn btn-outline-primary">Learn more</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Courses;
