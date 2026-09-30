import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import RootLayout from '../components/layout/RootLayout';
import UniverseLayout from '../features/universe/UniverseLayout';
// New-site pages are small (~18 KB gzipped together) and ship in the main
// bundle: a deep link then renders without a second request (no LCP waterfall).
// The heavy parts stay lazy: the 3D engine, the globe and the legacy app.
import HomePage from '../pages/home/HomePage';
import PlanetPage from '../pages/universe/PlanetPage';
import DemosPage from '../pages/demos/DemosPage';
import SolutionsPage from '../pages/solutions/SolutionsPage';
import ServicesPage from '../pages/services/ServicesPage';
import IndustriesPage from '../pages/industries/IndustriesPage';
import CompanyPage from '../pages/company/CompanyPage';
import CareersPage from '../pages/careers/CareersPage';
import ContactPage from '../pages/contact/ContactPage';
import NotFoundPage from '../pages/NotFoundPage';

// Preserved production app (build main.9fe686d8). Same URLs, same components.
const LegacyLayout = lazy(() => import('../legacy/LegacyLayout'));
const LegacyIndustries = lazy(() => import('../legacy/pages/Industries'));
const BankingAnalytics = lazy(() => import('../legacy/pages/Banking_Analytics'));
const TelecomAnalytics = lazy(() => import('../legacy/pages/Telecom_Analytics'));
const BankingTelecomAnalytics = lazy(() => import('../legacy/pages/Banking_Telecom_Analytics'));
const GolfPoseAnalyzer = lazy(() => import('../legacy/components/GolfPoseAnalyzer'));
const ResumeSummarizer = lazy(() => import('../legacy/components/ResumeSummarizer'));
const JDCVComparison = lazy(() => import('../legacy/components/JDCVComparison'));
const UserList = lazy(() => import('../legacy/components/UserList'));
const ReportGenerator = lazy(() => import('../legacy/components/ReportGenerator'));

const page = (Component) => (
  <Suspense fallback={<div className="lf-route-loading" role="status"><span className="lf-visually-hidden">Loading</span></div>}>
    <Component />
  </Suspense>
);

export const routes = [
  {
    element: <RootLayout />,
    children: [
      {
        element: <UniverseLayout />,
        children: [
          { index: true, element: <HomePage /> },
          { path: 'universe/:planetId', element: <PlanetPage /> },
        ],
      },
      { path: 'demos', element: <DemosPage /> },
      { path: 'solutions', element: <SolutionsPage /> },
      { path: 'services', element: <ServicesPage /> },
      { path: 'industries', element: <IndustriesPage /> },
      { path: 'company', element: <CompanyPage /> },
      { path: 'careers', element: <CareersPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  {
    element: page(LegacyLayout),
    children: [
      { path: 'catalogue', element: page(LegacyIndustries) },
      { path: 'BankingAnalytics', element: page(BankingAnalytics) },
      { path: 'TelecomAnalytics', element: page(TelecomAnalytics) },
      { path: 'BankingTelecomAnalytics', element: page(BankingTelecomAnalytics) },
      { path: 'golf-analyzer', element: page(GolfPoseAnalyzer) },
      { path: 'resume-summarizer', element: page(ResumeSummarizer) },
      { path: 'jd-cv-comparison', element: page(JDCVComparison) },
      { path: 'users', element: page(UserList) },
      { path: 'generate-report', element: page(ReportGenerator) },
    ],
  },
];

export const createRouter = () => createBrowserRouter(routes);
