import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../src/config';

const Videos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/videos`);
        const data = await response.json();
        if (!response) throw new Error("No response");
        setVideos(Array.isArray(data) ? data : []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching videos:', error);
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  if (loading) return <div className="container my-5 text-center">Loading videos...</div>;

  return (
    <div className="container my-5">
      <h1 className="text-center mb-5" style={{ color: 'var(--lav-600)' }}>Sample Practice Videos</h1>
      <div className="row g-4">
        {videos.map((video, idx) => (
          <div key={idx} className="col-12 col-md-6">
            <div className="card h-100 shadow-sm overflow-hidden border-0">
              <div className="ratio ratio-16x9">
                <iframe
                  src={`https://www.youtube.com/embed/${video.youtube_id}`}
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
                <p className="card-text text-muted small mb-0">{video.description}</p>
                <div className="mt-3 d-flex justify-content-between align-items-center">
                  <span className="text-muted small"><i className="bi bi-clock me-1"></i>{video.duration}</span>
                  <a 
                    href={video.url || `https://www.youtube.com/watch?v=${video.youtube_id}`} 
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
        {videos.length === 0 && (
          <div className="col-12 text-center text-muted py-5">
            No sample videos available at the moment.
          </div>
        )}
      </div>

      <div className="mt-5 p-4 bg-light rounded text-center shadow-sm">
        <h4>Want more?</h4>
        <p className="mb-0">Full-length class recordings are available for enrolled students in our member portal.</p>
        <button className="btn btn-primary mt-3" onClick={() => navigate('/member/portal')}>Access Member Portal</button>
      </div>
    </div>
  );
};

export default Videos;
