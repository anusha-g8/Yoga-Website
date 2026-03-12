import React from 'react';

const Testimonials = () => {
  const data = [
    {
      name: 'Sabine',
      text: 'She is a very talented, empathetic yoga teacher who attentively guides and instructs you through the various exercises. Her training program is rounded off by diverse/varied exercises.',
    },
    {
      name: 'Varuni Kolli',
      text: 'Anusha is an excellent teacher, her classes are engaging and fun. I also really like the meditation at the end and feel relaxed and refreshed.',
    },
  ];

  return (
    <section className="testimonials">
      <h2>What students say</h2>
      <div className="testimonials-grid">
        {data.map((t, i) => (
          <blockquote className="testimonial" key={i}>
            <p>&quot;{t.text}&quot;</p>
            <footer>— {t.name}</footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;

/* no props */
