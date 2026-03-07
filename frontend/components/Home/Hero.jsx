import React from "react";

const Hero = () => {
  return (
    <header className="py-5" style={{ background: 'linear-gradient(180deg, rgba(230,224,240,0.6), rgba(250,248,252,0.8))' }}>
      <div className="container">
        <div className="row align-items-center">
          <div className="col-12 col-md-7">
            <h1 className="display-5 fw-bold" style={{ color: 'var(--lav-600)' }}>
              Move with intention. Breathe with purpose.
            </h1>
            <p className="lead text-muted" style={{ maxWidth: 720 }}>
              Private and group classes that help you build strength, mobility, and calm — delivered in a nurturing, accessible environment.
            </p>
            <div className="d-flex gap-2 mt-3">
              <a className="btn btn-primary btn-lg" href="/about">Start here</a>
              <a className="btn btn-outline-secondary btn-lg" href="/about">Learn more</a>
            </div>
          </div>
          <div className="col-12 col-md-5 mt-4 mt-md-0">
            <img src="/assets/images/yoga1.jpg" alt="yoga pose" className="img-fluid rounded shadow" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Hero;

/* no props */
