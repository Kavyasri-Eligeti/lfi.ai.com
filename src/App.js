// src/App.js
import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScrollManager from "./components/layout/ScrollManager";
import Home from "./Pages/Home";

/**
 * Routing.
 *
 * The marketing site (Home) is eager, because it is the landing route and must
 * paint fast. Everything else is split out: the demo catalogue, the 404, and
 * in particular the legacy analytics and tooling pages, which pull in recharts
 * and the Bootstrap-era styling. Before this split those libraries were in the
 * main bundle for every visitor who only ever saw the homepage.
 *
 * Every pre-existing route is preserved at its original path, so any link
 * already published against this site keeps working.
 */

const Demos = lazy(() => import("./Pages/Demos"));
const NotFound = lazy(() => import("./Pages/NotFound"));

// --- legacy pages, unchanged behaviour ------------------------------------
const Explore = lazy(() => import("./Pages/Industries"));
const BankingAnalytics = lazy(() => import("./Pages/Banking_Analytics"));
const TelecomAnalytics = lazy(() => import("./Pages/Telecom_Analytics"));
const BankingTelecomAnalytics = lazy(() =>
  import("./Pages/Banking_Telecom_Analytics")
);
const GolfPoseAnalyzer = lazy(() => import("./components/GolfPoseAnalyzer"));
const ResumeSummarizer = lazy(() => import("./components/ResumeSummarizer"));
const JDCVComparison = lazy(() => import("./components/JDCVComparison"));
const UserList = lazy(() => import("./components/UserList"));
const ReportGenerator = lazy(() => import("./components/ReportGenerator"));

function RouteFallback() {
  return (
    <div className="lfi-route-fallback" role="status" aria-live="polite">
      <span className="lfi-route-fallback__spinner" aria-hidden="true" />
      <span className="lfi-sr">Loading</span>
    </div>
  );
}

function App() {
  return (
    <Router>
      <ScrollManager />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          {/* --- marketing site --- */}
          <Route path="/" element={<Home />} />
          <Route path="/demos" element={<Demos />} />

          {/* --- the original interactive catalogue, preserved --- */}
          <Route path="/explore" element={<Explore />} />

          {/* --- existing demo routes, unchanged --- */}
          <Route path="/BankingAnalytics" element={<BankingAnalytics />} />
          <Route path="/TelecomAnalytics" element={<TelecomAnalytics />} />
          <Route
            path="/BankingTelecomAnalytics"
            element={<BankingTelecomAnalytics />}
          />
          <Route path="/golf-analyzer" element={<GolfPoseAnalyzer />} />
          <Route path="/resume-summarizer" element={<ResumeSummarizer />} />
          <Route path="/jd-cv-comparison" element={<JDCVComparison />} />
          <Route path="/users" element={<UserList />} />
          <Route path="/generate-report" element={<ReportGenerator />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
