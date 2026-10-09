// Backend endpoints used by the preserved legacy tools.
//
// Defaults are the exact values hard-coded in the production build
// (main.9fe686d8). They can be overridden per environment with
// REACT_APP_* variables (see .env.example) without touching component code.
//
// NOTE: the 10.2.x.x hosts are private-network addresses. These tools only
// work from inside the Linkfields network, exactly as they do today.

const env = (key, fallback) => process.env[key] || fallback;

export const ENDPOINTS = {
  golfAnalyze: env('REACT_APP_GOLF_ANALYZE_URL', 'http://10.2.0.70:5001/analyze/'),
  jdCvMatch: env('REACT_APP_JD_CV_MATCH_URL', 'http://10.2.0.70:5002/match-jd-cv/'),
  resumeSummarize: env('REACT_APP_RESUME_SUMMARIZE_URL', 'http://10.2.0.70:5002/summarize-pdf'),
  users: env('REACT_APP_USERS_URL', 'http://10.2.0.65:8020/users?limit=100&offset=0'),
  recommendations: env(
    'REACT_APP_RECOMMENDATIONS_URL',
    'https://ungenuine-neville-oasitic.ngrok-free.dev/api/recommendations'
  ),
};
