import React from "react";
/* no props */
import "./Classes.css";

const sampleClasses = [
  {
    id: 1,
    title: "Morning Flow",
    length: "45 min",
    level: "All levels",
    img: "/assets/images/yoga1.jpg",
  },
  {
    id: 2,
    title: "Slow Hatha",
    length: "60 min",
    level: "Beginner",
    img: "/assets/images/yoga2.jpg",
  },
  {
    id: 3,
    title: "Vinyasa Build",
    length: "50 min",
    level: "Intermediate",
    img: "/assets/images/yoga3.jpg",
  },
];

const Classes = () => {
  return (
    <section className="py-5">
      <div className="container">
        <h2 className="mb-4">Classes</h2>
        <div className="row g-4">
          {sampleClasses.map((c) => (
            <div key={c.id} className="col-12 col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm">
                <img src={c.img} className="card-img-top" alt={c.title} />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{c.title}</h5>
                  <p className="card-text text-muted">{c.length} • {c.level}</p>
                  <div className="mt-auto">
                    <button className="btn btn-outline-primary">View</button>
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
