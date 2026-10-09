// Shell for the preserved production pages (the original lfiai.com catalogue
// and its internal tools). It loads Bootstrap and the original global CSS so
// these pages look and behave exactly as they did in build main.9fe686d8.
//
// This module is lazy-loaded, so Bootstrap never ships with the new site.
import { Outlet } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './styles/index.css';
import './styles/App.css';

export default function LegacyLayout() {
  return (
    <div className="legacy-app">
      <Outlet />
    </div>
  );
}
