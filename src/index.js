import React from "react";
import ReactDOM from "react-dom/client";

// Bootstrap is NOT loaded here. Only the legacy demo pages use it, and they
// are lazy-loaded, so it travels in their chunk (see styles/legacy-bootstrap.css).
// Its JS bundle was dropped entirely - nothing in this project uses a
// Bootstrap JS behaviour (no data-bs-* attributes anywhere in src/).

import "./styles/tokens.css";
import "./styles/global.css";
import "./styles/atmosphere.css";
import "./styles/animations.css";
import "./styles/hud.css";
import "./styles/scrub.css";
import "./index.css";

import App from "./App";
import reportWebVitals from "./reportWebVitals";

// Marks that JavaScript is running, before first paint. The reveal animations
// key off this, so if the bundle never executes the content renders visible
// instead of staying at opacity 0 forever.
document.documentElement.classList.add("lfi-js");

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
