import React from 'react';

const Newsletter = () => {
  return (
    <section className="newsletter container center">
      <h3>Join the newsletter</h3>
      <p className="muted">Get updates about new classes, workshops, and offers.</p>
      <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
        <input type="email" placeholder="your@email.com" aria-label="Email" />
        <button className="btn-primary" type="submit">Subscribe</button>
      </form>
    </section>
  );
};

export default Newsletter;

/* no props for newsletter component */
