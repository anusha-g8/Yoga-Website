import React from 'react';
import Hero from '../../components/Home/Hero.jsx';
import Testimonials from '../../components/Home/Testimonials.jsx';
import Classes from '../../components/Home/Classes.jsx';
import Newsletter from '../../components/Common/Newsletter.jsx';
import InquirySection from '../../components/Common/InquirySection.jsx';
import Footer from '../../components/Common/Footer.jsx';
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
      <InquirySection />
      <Newsletter />
      <Footer />
    </main>
  );
};

export default Home;
