import React from 'react';

const Courses = () => {
  const courses = [
    {
      title: 'Foundations of Yoga',
      desc: 'Perfect for beginners to learn basic poses, alignment, and breathwork.',
      duration: '4 weeks',
      price: '$59',
      img: '/assets/images/yoga1.jpg'
    },
    {
      title: 'Vinyasa Mastery',
      desc: 'Build strength and mobility with this intermediate flow sequence.',
      duration: '6 weeks',
      price: '$89',
      img: '/assets/images/yoga2.jpg'
    },
    {
      title: 'Restorative Weekend',
      desc: 'A gentle series focused on relaxation and stress reduction.',
      duration: 'Single Workshop',
      price: '$25',
      img: '/assets/images/yoga3.jpg'
    }
  ];

  return (
    <div className="container my-5">
      <h1 className="text-center mb-5" style={{ color: 'var(--lav-600)' }}>Online Courses & Packages</h1>
      <div className="row g-4">
        {courses.map((course, idx) => (
          <div key={idx} className="col-12 col-md-4">
            <div className="card h-100 shadow-sm border-0">
              <img src={course.img} className="card-img-top" alt={course.title} style={{ height: '180px', objectFit: 'cover' }} />
              <div className="card-body">
                <h5 className="card-title fw-bold">{course.title}</h5>
                <p className="card-text text-muted small">{course.desc}</p>
                <div className="mt-3 d-flex justify-content-between align-items-center">
                  <span className="text-muted small"><i className="bi bi-clock me-1"></i>{course.duration}</span>
                  <span className="fw-bold text-primary fs-5">{course.price}</span>
                </div>
              </div>
              <div className="card-footer bg-transparent border-0 pb-3">
                <button className="btn btn-primary w-100">Enroll Now</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Courses;
