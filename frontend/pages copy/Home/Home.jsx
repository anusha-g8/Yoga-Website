import React from 'react';
import Hero from '../../frontend/components/Home/Hero.jsx';
import Testimonials from '../../frontend/components/Home/Testimonials.jsx';
import Classes from '../../frontend/components/Home/Classes.jsx';
import Newsletter from '../../frontend/components/Common/Newsletter.jsx';
import Footer from '../../frontend/components/Common/Footer.jsx';
import './Home.css';

const Home = () => {
  return (
    <main className="home-page">
      <Hero />
      <section className="home-content container">
        <h2>Welcome</h2>
        <p>
          Join classes that honor where you are today and help you grow steadily
          and safely. Options include online group classes, multi-week packages,
          and private instruction.
        </p>
      </section>
      <Classes />
      <Testimonials />
      <Newsletter />
      <Footer />
    </main>
  );
};

export default Home;
