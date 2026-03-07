import React from 'react';

const Certifications = () => {
  const items = [
    '200hr Yoga Teacher Training — Yoga Alliance',
    'Ashtanga and Vinyasa Yoga Certification',
    'CPR + First Aid',
  ];

  return (
    <section className="certifications">
      <h3>Certifications</h3>
      <ul>
        {items.map((c, i) => (
          <li key={i}>{c}</li>
        ))}
      </ul>
    </section>
  );
};

export default Certifications;

/* no props */
