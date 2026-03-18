import React from 'react';
import Bio from '../../components/About/Bio.jsx';
import Certifications from '../../components/About/Certifications.jsx';
import './About.css';

const About = () => {
  return (
    <main className="about-page-wrapper">
      <div className="about-hero-section py-5 mb-5 bg-light border-bottom">
        <div className="container text-center py-4">
          <h1 className="display-4 fw-bold mb-3">About Anusha&apos;s Yoga</h1>
          <p className="lead text-muted mx-auto" style={{ maxWidth: '700px' }}>
            Discover the philosophy and passion behind every breath and movement.
          </p>
        </div>
      </div>

      <div className="about-content-sections">
        <section className="about-philosophy container mb-5">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="philosophy-card p-4 p-md-5 rounded shadow-sm bg-white border-top border-5 border-primary">
                <div className="text-center mb-4">
                  <i className="bi bi-infinity text-primary mb-3 d-block" style={{ fontSize: '3rem' }}></i>
                  <h3 className="fw-bold">Class Philosophy</h3>
                </div>
                <p className="philosophy-text text-center mx-auto mb-0" style={{ maxWidth: '850px' }}>
                  This class is a balanced blend of Ashtanga discipline, Vinyasa fluidity, and Hatha stability, 
                  combining structured Ashtanga sequences to build strength, stamina, and focus with smooth, 
                  breath-led Vinyasa transitions that create a continuous, meditative flow. Hatha yoga 
                  elements are integrated by holding postures longer to refine alignment, increase body 
                  awareness, and encourage mindful presence. The practice is both energizing and grounding, 
                  offering a holistic experience that supports flexibility, muscular strength, mental 
                  clarity, and inner balance while connecting breath, movement, and stillness.
                </p>
              </div>
            </div>
          </div>
        </section>

        <Bio />

        <Certifications />
      </div>
    </main>
  );
};

export default About;
