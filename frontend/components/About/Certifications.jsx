import React from 'react';

const Certifications = () => {
  const items = [
    { title: '200hr Yoga Teacher Training', body: 'Yoga Alliance Certified' },
    { title: 'Ashtanga and Vinyasa', body: 'Advanced Flow Certification' },
    { title: 'CPR + First Aid', body: 'Safety Certified' },
  ];

  return (
    <section className="certifications container py-5">
      <h3 className="text-center mb-5">Certifications & Expertise</h3>
      <div className="row g-4">
        {items.map((c, i) => (
          <div className="col-md-4" key={i}>
            <div className="cert-card h-100 p-4 text-center border rounded shadow-sm bg-white">
              <div className="cert-icon mb-3">
                <i className="bi bi-patch-check-fill text-primary" style={{ fontSize: '2rem' }}></i>
              </div>
              <h5 className="mb-2">{c.title}</h5>
              <p className="text-muted small mb-0">{c.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Certifications;
