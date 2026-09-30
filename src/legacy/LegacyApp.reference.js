// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Industries from './Pages/Industries';
import BankingAnalytics from './Pages/Banking_Analytics';
import TelecomAnalytics from './Pages/Telecom_Analytics';
import BankingTelecomAnalytics from './Pages/Banking_Telecom_Analytics';
import GolfPoseAnalyzer from './components/GolfPoseAnalyzer';
import ResumeSummarizer from './components/ResumeSummarizer';
import JDCVComparison from './components/JDCVComparison';
import UserList from './components/UserList';
import ReportGenerator from './components/ReportGenerator';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Industries />} />
        <Route path="/BankingAnalytics" element={<BankingAnalytics />} />
        <Route path="/TelecomAnalytics" element={<TelecomAnalytics />} />
        <Route path="/BankingTelecomAnalytics" element={<BankingTelecomAnalytics />} />
        <Route path="/golf-analyzer" element={<GolfPoseAnalyzer />} />
        <Route path="/resume-summarizer" element={<ResumeSummarizer />} />
        <Route path="/jd-cv-comparison" element={<JDCVComparison />} />
        <Route path="/users" element={<UserList />} />
        <Route path="/generate-report" element={<ReportGenerator />} />
      </Routes>
    </Router>
  );
}

export default App;