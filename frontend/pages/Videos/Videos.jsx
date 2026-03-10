import React from 'react';

const Videos = () => {
  const videos = [
    {
      title: 'Easy Morning Yoga For Beginners',
      duration: '15:12',
      level: 'Beginner',
      desc: 'A gentle and effective morning flow to wake up your body and mind.',
      youtubeId: 'Y2RcO6TKO4s',
      url: 'https://www.youtube.com/watch?v=Y2RcO6TKO4s&vl=en'
    },
    {
      title: 'Full Body Flow - Breathe & Release',
      duration: '20:15',
      level: 'All levels',
      desc: 'A powerful full body flow to release tension and build strength.',
      youtubeId: 'ZAlpjTIe0DA',
      url: 'https://www.youtube.com/watch?v=ZAlpjTIe0DA&t=913s'
    }
  ];

  return (
    <div className="container my-5">
      <h1 className="text-center mb-5" style={{ color: 'var(--lav-600)' }}>Sample Practice Videos</h1>
      <div className="row g-4">
        {videos.map((video, idx) => (
          <div key={idx} className="col-12 col-md-6">
            <div className="card h-100 shadow-sm overflow-hidden border-0">
              <div className="ratio ratio-16x9">
                <iframe
                  src={`https://www.youtube.com/embed/${video.youtubeId}${video.youtubeId === 'Y2RcO6TKO4s' ? '?hl=en' : video.youtubeId === 'ZAlpjTIe0DA' ? '?start=913' : ''}`}
                  title={video.title}
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  style={{ borderRadius: '8px 8px 0 0' }}
                ></iframe>
              </div>
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h5 className="card-title fw-bold mb-0">{video.title}</h5>
                  <span className="badge bg-light text-primary border border-primary-subtle">{video.level}</span>
                </div>
                <p className="card-text text-muted small mb-0">{video.desc}</p>
                <div className="mt-3 d-flex justify-content-between align-items-center">
                  <span className="text-muted small"><i className="bi bi-clock me-1"></i>{video.duration}</span>
                  <a 
                    href={video.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn btn-link btn-sm p-0 text-decoration-none"
                  >
                    View on YouTube <i className="bi bi-box-arrow-up-right ms-1"></i>
                  </a>
                </div>
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
