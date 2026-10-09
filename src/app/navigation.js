export const primaryNav = [
  { label: 'AI Solutions', to: '/solutions' },
  { label: 'Services', to: '/services' },
  { label: 'Industries', to: '/industries' },
  { label: 'Company', to: '/company' },
  { label: 'Careers', to: '/careers' },
];

export const contactNav = { label: 'Contact us', to: '/contact' };

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

// The cinematic page sequence: scrolling past the end of one page carries the
// visitor into the next (see components/layout/NextChapter).
export const CHAPTER_SEQUENCE = [
  { path: '/', label: 'Home' },
  { path: '/solutions', label: 'AI Solutions', color: '#ff9900' },
  { path: '/services', label: 'Services', color: '#539fe5' },
  { path: '/industries', label: 'Industries', color: '#37c871' },
  { path: '/company', label: 'Company', color: '#9b6bff' },
  { path: '/careers', label: 'Careers', color: '#ff5d8f' },
  { path: '/contact', label: 'Contact us', color: '#ffd27a' },
];

export const nextChapterFor = (pathname) => {
  const i = CHAPTER_SEQUENCE.findIndex((c) => c.path === pathname);
  if (i < 0 || i === CHAPTER_SEQUENCE.length - 1) return null;
  return CHAPTER_SEQUENCE[i + 1];
};
