import React from "react";
/* no props */
import "./Classes.css";

const sampleClasses = [
  {
    id: 1,
    title: "Easy Morning Yoga",
    length: "15 min",
    level: "Beginner",
    youtubeId: "Y2RcO6TKO4s",
    url: "https://www.youtube.com/watch?v=Y2RcO6TKO4s&vl=en"
  },
  {
    id: 2,
    title: "Full Body Flow",
    length: "16 min",
    level: "All levels",
    youtubeId: "K-6zThqLp8E",
    url: "https://www.youtube.com/watch?v=K-6zThqLp8E"
  },
  {
    id: 3,
    title: "Total Body Detox",
    length: "20 min",
    level: "Advanced",
    youtubeId: "pS-W_6rT-m8",
    url: "https://www.youtube.com/watch?v=pS-W_6rT-m8"
  },
];

const Classes = () => {
  return (
    <section className="py-5">
      <div className="container">
        <h2 className="mb-4">Featured Practice Sessions</h2>
        <div className="row g-4">
          {sampleClasses.map((c) => (
            <div key={c.id} className="col-12 col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm border-0 overflow-hidden">
                <div className="ratio ratio-16x9">
                  <iframe
                    src={`https://www.youtube.com/embed/${c.youtubeId}${c.youtubeId === 'Y2RcO6TKO4s' ? '?hl=en' : ''}`}
                    title={c.title}
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  ></iframe>
                </div>
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title fw-bold">{c.title}</h5>
                  <p className="card-text text-muted small">{c.length} • {c.level}</p>
                  <div className="mt-auto">
                    <a 
                      href={c.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn btn-outline-primary btn-sm w-100"
                    >
                      Watch on YouTube
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Classes;

/* no props */
