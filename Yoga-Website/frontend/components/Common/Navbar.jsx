import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-md navbar-light bg-white shadow-sm">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/" aria-label="Yoga with Anusha">
          <img src="/assets/images/Trishual.png" alt="" className="navbar-logo" style={{ objectFit: 'contain' }} />
          <div className="brand-text-container d-flex flex-column lh-1">
            <span className="brand-yoga">Yoga</span>
            <span className="brand-with-anusha">
              <span className="brand-with">with</span>
              <span className="brand-anusha ms-1">Anusha</span>
            </span>
          </div>
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
