import React from 'react';
import ReactDOM from 'react-dom/client';
// Open Sans and Hanken Grotesk @font-face + preloads live in public/index.html (stable /fonts URL).
import '@fontsource/share-tech-mono/latin-400.css';
import './styles/tokens.css';
import './styles/base.css';
import './styles/components.css';
import './components/sections/sections.css';
import './styles/glow.css';
import App from './app/App';
import { reloadToHome } from './app/reloadToHome';
import reportWebVitals from './reportWebVitals';

// Must run before the router reads the URL.
reloadToHome();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Core Web Vitals (LCP, INP, CLS). In development they are logged to the
// console. Pass a reporter here to send them to an analytics endpoint.
reportWebVitals(process.env.NODE_ENV === 'development' ? console.log : undefined);
