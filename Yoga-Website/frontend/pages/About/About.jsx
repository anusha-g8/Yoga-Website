import React from 'react';
import Bio from '../../components/About/Bio.jsx';
import Certifications from '../../components/About/Certifications.jsx';
import './About.css';

const About = () => {
  return (
    <main className="about-page">
      <header className="about-header">
        <h1>About</h1>
        <p>Learn more about Anusha&apos;s teaching approach and background.</p>
      </header>

      <Bio />

      <Certifications />
    </main>
  );
};

export default About;
