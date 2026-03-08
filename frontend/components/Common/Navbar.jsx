import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-md navbar-light bg-white shadow-sm">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <img src="/assets/images/Trishual.png" alt="" height="64" style={{ objectFit: 'contain' }} />
          <svg
            width="132" height="64" viewBox="0 0 132 64"
            fill="none" xmlns="http://www.w3.org/2000/svg"
            aria-label="Yoga with Anusha" role="img"
          >
            <text x="0" y="36" style={{ fontFamily: "'Great Vibes', cursive", fontSize: '44px', fill: '#2c2420' }}>Yoga</text>
            <line x1="0" y1="46" x2="128" y2="46" stroke="#2c2420" strokeWidth="0.5"/>
            <text x="0" y="58" style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '9.5px', fontWeight: 300, letterSpacing: '3px', fill: '#2c2420' }}>WITH ANUSHA</text>
          </svg>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/about">About</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/calendar">Calendar</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/courses">Courses</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/videos">Sample Videos</Link>
            </li>
          </ul>
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <a className="nav-link p-0" href="https://instagram.com/anushayogastudio" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <img src="/assets/images/instagram.svg" alt="Instagram" className="instagram-icon" />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
