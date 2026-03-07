import React from 'react';

const Videos = () => {
  const vids = [
    { id: 1, title: 'Gentle Morning Sequence', thumb: '/assets/images/yoga1.jpg' },
    { id: 2, title: 'Slow Evening Wind Down', thumb: '/assets/images/yoga2.jpg' },
    { id: 3, title: 'Core & Breath', thumb: '/assets/images/yoga3.jpg' },
  ];

  return (
    <main className="container py-5">
      <h1 className="mb-3">Sample Yoga Videos</h1>
      <p className="text-muted">Temporary collection of sample videos. These will be replaced with actual video embeds.</p>

      <div className="row g-4 mt-4">
        {vids.map((v) => (
          <div key={v.id} className="col-12 col-md-6 col-lg-4">
            <div className="card h-100">
              <img src={v.thumb} className="card-img-top" alt={v.title} />
              <div className="card-body">
                <h5 className="card-title">{v.title}</h5>
                <p className="text-muted">Duration: ~10-30 min</p>
                <a className="btn btn-primary" href="#">Watch</a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Videos;
