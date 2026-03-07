import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

// Load Bootstrap (local) and icons so navbar and components work reliably in dev
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import './global.css';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
