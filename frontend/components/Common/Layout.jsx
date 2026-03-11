import React from 'react';
import PropTypes from 'prop-types';
import Navbar from './Navbar.jsx';

const layoutStyle = {
  padding: '20px',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
};

const mainStyle = {
  flex: 1,
  width: '100%',
};

const footerStyle = {
  borderTop: '1px solid #eee',
  paddingTop: 12,
  marginTop: 24,
  color: '#666',
  fontSize: '0.9rem',
};

const Layout = ({ children }) => {
  return (
    <div style={layoutStyle}>
      <Navbar />
      <main style={mainStyle}>{children}</main>
      <footer style={footerStyle}>
        © {new Date().getFullYear()} Yoga with Anusha — All rights reserved.
      </footer>
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node,
};

export default Layout;
