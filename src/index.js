import React from 'react';
import ReactDOM from 'react-dom/client';
// Open Sans @font-face + preload live in public/index.html (stable /fonts URL).
import './styles/tokens.css';
import './styles/base.css';
import './styles/components.css';
import App from './app/App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Core Web Vitals (LCP, INP, CLS). In development they are logged to the
// console. Pass a reporter here to send them to an analytics endpoint.
reportWebVitals(process.env.NODE_ENV === 'development' ? console.log : undefined);
