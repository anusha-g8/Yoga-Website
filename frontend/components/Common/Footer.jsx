import React from 'react';

const Footer = () => {
  return (
    <footer className="site-footer container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <strong>Yoga with Anusha</strong>
          <div className="muted">Mindful movement for every body</div>
        </div>
        <div className="muted">© {new Date().getFullYear()} Anusha Ghali</div>
      </div>
    </footer>
  );
};

export default Footer;

/* no props */
