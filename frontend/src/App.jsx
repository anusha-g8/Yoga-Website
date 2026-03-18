import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home/Home.jsx';
import About from '../pages/About/About.jsx';
import Calendar from '../pages/Calendar/Calendar.jsx';
import Courses from '../pages/Courses/Courses.jsx';
import Videos from '../pages/Videos/Videos.jsx';
import Contact from '../pages/Contact/Contact.jsx';
import AdminLogin from '../pages/Admin/AdminLogin.jsx';
import AdminDashboard from '../pages/Admin/AdminDashboard.jsx';
import MemberPortal from '../pages/Member/MemberPortal.jsx';
import MemberDashboard from '../pages/Member/MemberDashboard.jsx';
import Layout from '../components/Common/Layout.jsx';

const App = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/member/portal" element={<MemberPortal />} />
          <Route path="/member/dashboard" element={<MemberDashboard />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default App;
