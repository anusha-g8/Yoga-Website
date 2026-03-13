import React from 'react';

const Bio = () => {
  return (
    <section className="about-bio container py-5">
      <div className="row align-items-center bg-white rounded shadow-sm mx-0">
        <div className="col-md-5 p-0">
          <img 
            src="/assets/images/Anusha-Bio.PNG" 
            alt="Anusha Ghali" 
            className="img-fluid rounded-start bio-image-full" 
          />
        </div>
        <div className="col-md-7 p-4 p-md-5">
          <span className="text-primary fw-bold text-uppercase small ls-widest mb-2 d-block">About the Instructor</span>
          <h2 className="mb-4 display-6">Anusha Ghali</h2>
          <div className="bio-content">
            <p className="lead-text mb-4">
              Anusha Ghali is a dedicated yoga instructor specializing in Ashtanga, Vinyasa, Hatha, and Yin Yoga. 
              With a balanced approach that blends strength, breathwork, and deep relaxation, Anusha guides 
              her students toward mindful movement and inner awareness.
            </p>
            <p className="text-muted">
              Her classes are designed to build confidence, improve flexibility, and cultivate a grounded 
              sense of well-being. Whether working with beginners or experienced practitioners, Anusha 
              creates a supportive space where each student can explore their practice safely and joyfully.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Bio;
