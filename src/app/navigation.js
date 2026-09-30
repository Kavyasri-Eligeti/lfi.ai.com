export const primaryNav = [
  { label: 'AI Universe', to: '/' },
  { label: 'Demos', to: '/demos' },
  { label: 'Solutions', to: '/solutions' },
  { label: 'Services', to: '/services' },
  { label: 'Industries', to: '/industries' },
  { label: 'Company', to: '/company' },
  { label: 'Careers', to: '/careers' },
  { label: 'Contact', to: '/contact' },
];

// Routes served by the preserved production app (src/legacy). They are linked
// with full page loads so that their Bootstrap styling never leaks into the new site.
export const LEGACY_PATHS = [
  '/catalogue',
  '/BankingAnalytics',
  '/TelecomAnalytics',
  '/BankingTelecomAnalytics',
  '/golf-analyzer',
  '/resume-summarizer',
  '/jd-cv-comparison',
  '/users',
  '/generate-report',
];

export const isLegacyPath = (href) => LEGACY_PATHS.some((p) => href === p || href.startsWith(`${p}?`));
