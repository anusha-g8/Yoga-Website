import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="site-footer container mt-auto py-4">
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <strong>Yoga with Anusha</strong>
          <div className="text-muted small">Mindful movement for every body</div>
        </div>
        <div className="text-muted small">
          © {new Date().getFullYear()} Anusha Ghali
          <Link to="/admin" className="ms-3 text-decoration-none text-muted" style={{ opacity: 0.5 }}>Admin Portal</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

/* no props */
