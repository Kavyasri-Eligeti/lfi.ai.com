// Logos for the LFI AI demo cards.
//
// Five demos are products with their own logo (`image` in demos.js). Every
// other demo gets a mark: a line glyph on a small accent tile, drawn on the
// same 24px grid and 1.75px stroke as the site's icons so the catalogue reads
// as one set. Glyphs describe what the demo does; the accent colour follows
// its catalogue group so a filtered grid still shows which family a card is in.

export const GROUP_ACCENTS = {
  conversational: '#6fe3d3', // teal
  banking: '#ffb547', // amber
  telecom: '#b4a2ff', // lavender
  insurance: '#539fe5', // blue
  operations: '#ff6a3d', // orange
  talent: '#ffd27a', // yellow
  poc: '#ff6f91', // rose
};

// Glyph paths: 24px grid, stroke only (no fills).
export const GLYPHS = {
  chat: 'M4 5h16v11H9l-5 4V5ZM8 10.5h.01M12 10.5h.01M16 10.5h.01',
  mobileChat: 'M8 2h8a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2ZM11 18.5h2M9 8h6M9 11h4',
  kiosk: 'M5 3h14v12H5zM9 15v6M15 15v6M9 21h6M9 7h6M9 10h3',
  churn: 'M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3 20a6 6 0 0 1 12 0M15 8h6M18.5 5.5 21 8l-2.5 2.5',
  shieldCheck: 'M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3ZM9 12l2 2 4-4',
  shieldAlert: 'M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3ZM12 8v5M12 16v.5',
  orbit: 'M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM6.5 18.5a5.5 5.5 0 0 1 11 0M21 12a9 9 0 1 1-2.6-6.4M21 3v4h-4',
  growth: 'M3 20h18M5 16l4-5 4 3 6-8M16 6h3v3',
  smile: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM8.5 14.5a5 5 0 0 0 7 0M9 10h.01M15 10h.01',
  signal: 'M12 22V11M8.5 7.5a5 5 0 0 1 7 0M5.5 4.5a9 9 0 0 1 13 0M12 11a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z',
  overlap: 'M9 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12ZM15 21a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z',
  target: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10ZM12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z',
  database: 'M12 8c4.4 0 8-1.3 8-3s-3.6-3-8-3-8 1.3-8 3 3.6 3 8 3ZM4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3',
  signature: 'M3 19c4-8 6-8 7-2 .5 3 2 3 4-2 1-3 2-3 6 0M14 5l4 4M9 14l6-6 2 2-6 6-3 1 1-3Z',
  network: 'M12 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM5 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM19 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM12 7v4M12 11l-6 6M12 11l6 6M12 11v.5',
  gauge: 'M5 19a9 9 0 1 1 14 0M12 19l4-7M12 19.5h.01',
  sliders: 'M4 7h10M18 7h2M14 4v6M4 17h4M12 17h8M8 14v6',
  layers: 'M12 3 3 8l9 5 9-5-9-5ZM3 12l9 5 9-5M3 16l9 5 9-5',
  calendarTrend: 'M4 5h16v15H4zM4 9h16M8 3v3M16 3v3M8 13l3 3 2-2 3 3',
  bolt: 'M13 2 4 14h7l-1 8 9-12h-7l1-8Z',
  pulse: 'M3 12h4l3-7 4 14 3-7h4',
  twin: 'M3 3h9v9H3zM12 12h9v9h-9zM7.5 12v4.5H12M16.5 12V7.5H12',
  searchGrowth: 'M10 17a7 7 0 1 0 0-14 7 7 0 0 0 0 14ZM21 21l-5-5M7 12l2-2 2 1.5 3-3.5',
  document: 'M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h4',
  compare: 'M3 4h7v16H3zM14 4h7v16h-7zM10 12h4M12 10l2 2-2 2',
  motion: 'M13 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM6 22l4-8 4 2 2-5 4 2M10 14l2-5 5 1M3 22h18',
  lock: 'M6 11h12v10H6zM9 11V7a3 3 0 0 1 6 0v4M12 15v2',
  grid: 'M3 3h8v8H3zM13 3h8v8h-8zM3 13h8v8H3zM13 13h8v8h-8z',
  building: 'M4 21h16M5 21V9l7-5 7 5v12M10 21v-6h4v6M9 11h.01M15 11h.01',
  globe: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18',
};

// Demo id -> glyph. Demos with an official product logo are listed with
// `null` so the test can confirm every demo was considered.
export const DEMO_GLYPHS = {
  // Conversational AI and document intelligence
  'rag-chatbot': 'chat',
  'rag-mobile': 'mobileChat',
  'unmanned-kiosk': 'kiosk',
  textiq: null,
  vajrax: null,
  edupilot: null,
  // Banking and financial services
  'banking-analytics': 'churn',
  finsight: null,
  'credit-risk': 'shieldCheck',
  'banking-claims-fraud': 'shieldAlert',
  'customer-360': 'orbit',
  'clv-banking-telecom': 'growth',
  'banking-sentiment': 'smile',
  // Telecom
  'telecom-analytics': 'signal',
  'banking-telecom-analytics': 'overlap',
  'nbo-revenue': 'target',
  'nbo-data-engine': 'database',
  // Insurance
  'insurance-claims-fraud': 'shieldAlert',
  'signature-fraud': 'signature',
  'network-fraud': 'network',
  'risk-score': 'gauge',
  underwriting: 'sliders',
  'insurance-platform': 'layers',
  'clv-insurance': 'growth',
  'lapse-prediction': 'calendarTrend',
  // Operations, forecasting and customer experience
  'demand-forecasting': 'growth',
  'equipment-failure': 'bolt',
  engage360: null,
  'smart-kpi': 'pulse',
  'digital-twin': 'twin',
  'digital-growth-intelligence': 'searchGrowth',
  // Talent and internal tools
  'resume-summarizer': 'document',
  'jd-cv-comparison': 'compare',
  'golf-analyzer': 'motion',
  'cybersecurity-lms': 'lock',
  'internal-portal': 'grid',
  // Proofs of concept
  'consulate-sa': 'globe',
  'consulate-la': 'building',
};

/** The mark for a demo, or null when it has its own product logo. */
export const demoMarkFor = (demo) => {
  const glyph = DEMO_GLYPHS[demo.id];
  if (!glyph) return null;
  return { path: GLYPHS[glyph], accent: GROUP_ACCENTS[demo.group] || GROUP_ACCENTS.poc, glyph };
};
