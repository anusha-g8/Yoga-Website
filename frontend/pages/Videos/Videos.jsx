import React from 'react';

const Videos = () => {
  const videos = [
    {
      title: '15 Min Morning Wakeup',
      duration: '15:20',
      level: 'All levels',
      desc: 'Start your day with gentle movement and focused breathing.',
      thumb: '/assets/images/yoga1.jpg'
    },
    {
      title: 'Hatha Yoga for Flexibility',
      duration: '45:00',
      level: 'Intermediate',
      desc: 'A deep stretching session targeting hips and hamstrings.',
      thumb: '/assets/images/yoga2.jpg'
    },
    {
      title: 'Bedtime Calm Down',
      duration: '10:15',
      level: 'Beginner',
      desc: 'A restorative sequence to prepare your body for restful sleep.',
      thumb: '/assets/images/yoga3.jpg'
    },
    {
      title: 'Core Strength Vinyasa',
      duration: '30:00',
      level: 'Intermediate',
      desc: 'Focus on abdominal strength and stability through flow.',
      thumb: '/assets/images/yoga1.jpg'
    }
  ];

  return (
    <div className="container my-5">
      <h1 className="text-center mb-5" style={{ color: 'var(--lav-600)' }}>Sample Practice Videos</h1>
      <div className="row g-4">
        {videos.map((video, idx) => (
          <div key={idx} className="col-12 col-md-6">
            <div className="card h-100 shadow-sm overflow-hidden border-0">
              <div className="position-relative">
                <img src={video.thumb} className="card-img-top" alt={video.title} style={{ height: '220px', objectFit: 'cover' }} />
                <div className="position-absolute top-50 start-50 translate-middle">
                  <i className="bi bi-play-circle-fill text-white opacity-75" style={{ fontSize: '4rem' }}></i>
                </div>
                <div className="position-absolute bottom-0 end-0 bg-dark text-white px-2 py-1 m-2 rounded small opacity-75">
                  {video.duration}
                </div>
              </div>
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h5 className="card-title fw-bold mb-0">{video.title}</h5>
                  <span className="badge bg-light text-primary border border-primary-subtle">{video.level}</span>
                </div>
                <p className="card-text text-muted small">{video.desc}</p>
                <button className="btn btn-outline-primary btn-sm">Watch Session</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5 p-4 bg-light rounded text-center shadow-sm">
        <h4>Want more?</h4>
        <p className="mb-0">Full-length class recordings are available for enrolled students in our member portal.</p>
        <button className="btn btn-primary mt-3">Access Member Portal</button>
      </div>
    </div>
  );
};

export default Videos;
