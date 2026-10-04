// The cards of the homepage "theatre": everything Linkfields offers, as 3D
// glass cards that spiral around the AI column. Built from the content
// modules, so a change to a solution, service or tool updates its card.
//   category  filter it belongs to (see CARD_FILTERS)
//   palette   three colours for the card's flowing surface
//   to        where the card leads
import { aiSolutions } from './aiSolutions';
import { aiServicePractice, corporateServices } from './services';
import { industries } from './industries';
import { aiTools, aiSecurityTools } from './aiTools';
import { SERVICE_LOGOS, SOLUTION_LOGOS, SUB_SERVICE_LOGOS, logosFor } from './logos';
import { corporateSolutions } from './solutions';
import { company, emails, offices } from './company';
import { careers } from './careers';

export const CARD_FILTERS = [
  { id: 'solutions', label: 'AI solutions' },
  { id: 'ai-services', label: 'AI services' },
  { id: 'services', label: 'Services' },
  { id: 'industries', label: 'Industries' },
  { id: 'tools', label: 'AI tools' },
  { id: 'security', label: 'AI security' },
];

const PALETTES = {
  solutions: ['#ffb547', '#ff6f91', '#1b2a52'],
  'ai-services': ['#b4a2ff', '#6fe3d3', '#1c1440'],
  services: ['#6fe3d3', '#3a7bd5', '#0d2230'],
  industries: ['#6fe3d3', '#b4a2ff', '#0d1d26'],
  tools: ['#ffb547', '#b4a2ff', '#1a1630'],
  security: ['#539fe5', '#6fe3d3', '#0a1a2c'],
};

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const card = (category, fields) => ({
  palette: PALETTES[category],
  ...fields,
  id: `${category}-${fields.id || slug(fields.title)}`,
  category,
});

export const theatreCards = [
  ...aiSolutions.map((s, i) =>
    card('solutions', {
      id: s.id,
      index: i + 1,
      title: s.name,
      kicker: 'AI solution',
      text: s.tagline,
      logos: logosFor(SOLUTION_LOGOS[s.id]).slice(0, 4),
      palette: [s.mark.accent, ['#b4a2ff', '#6fe3d3', '#ff6f91', '#539fe5'][i % 4], '#121a30'],
      to: `/solutions#${s.id}`,
    })
  ),
  ...aiServicePractice.subServices.map((s) =>
    card('ai-services', { title: s.name, kicker: 'AI service', text: s.tagline, logos: logosFor(SUB_SERVICE_LOGOS[s.name]).slice(0, 4), to: '/services#ai-services' })
  ),
  ...corporateServices.map((s) =>
    card('services', { id: s.id, title: s.name, kicker: 'Linkfields practice', text: s.headline, logos: logosFor(SERVICE_LOGOS[s.id]).slice(0, 4), to: `/services#${s.id}` })
  ),
  ...industries.map((i) =>
    card('industries', { id: i.id, title: i.name, kicker: 'Industry', text: i.tagline, image: i.image, to: `/industries#${i.id}` })
  ),
  ...aiTools.map((t) =>
    card('tools', { id: t.id, title: t.name, kicker: `${t.vendor} · ${t.tag}`, logo: t.logo, to: '/services#ai-services' })
  ),
  ...aiSecurityTools.map((t) =>
    card('security', { id: t.id, title: t.name, kicker: `${t.vendor} · ${t.tag}`, logo: t.logo, to: '/solutions#ai-governance' })
  ),
];

// Capability cards shown only in the homepage flow.
const HOME_CAPABILITIES = [
  card('solutions', {
    id: 'machine-learning',
    title: 'Machine Learning',
    kicker: 'AI capability',
    text: 'Models that learn from your data to predict, classify and recommend',
    logos: logosFor(['scikitlearn', 'python', 'databricks']),
    palette: ['#37c871', '#539fe5', '#0f1a2c'],
    to: '/solutions#predictive-analytics',
  }),
  card('solutions', {
    id: 'deep-learning',
    title: 'Deep Learning',
    kicker: 'AI capability',
    text: 'Neural networks for vision, language and complex patterns',
    logos: logosFor(['pytorch', 'tensorflow', 'nvidia']),
    palette: ['#ff6f91', '#b4a2ff', '#1a1230'],
    to: '/services#ai-services',
  }),
  card('security', {
    id: 'cyber-security',
    title: 'Cyber Security',
    kicker: 'Security',
    text: 'Firewalls, intrusion detection and secure access for the whole enterprise',
    logos: logosFor(['fortinet', 'paloalto', 'cisco']),
    palette: ['#539fe5', '#6fe3d3', '#0a1a2c'],
    to: '/services#it-infrastructure',
  }),
  card('security', {
    id: 'ai-security',
    title: 'AI Security',
    kicker: 'Security',
    text: 'Guardrails, red-teaming and governance that keep AI safe and compliant',
    logos: logosFor(['owasp', 'nvidia', 'paloalto']),
    palette: ['#b4a2ff', '#539fe5', '#120f2a'],
    to: '/solutions#ai-governance',
  }),
];

// The homepage flow leaves out these cards (they stay on their own pages).
const NOT_ON_HOME = new Set([
  'industries-telecom',
  'industries-manufacturing',
  'industries-banking',
  'industries-insurance',
  'tools-ai-claude',
  'tools-ai-chatgpt',
  'tools-ai-gemini',
]);
export const HOME_CARDS = [...HOME_CAPABILITIES, ...theatreCards.filter((c) => !NOT_ON_HOME.has(c.id))];

const byCategory = (c) => theatreCards.filter((x) => x.category === c && !NOT_ON_HOME.has(x.id));

// The opening set: the capability cards, AI solutions, AI services, security
// tools and practices (industries and the AI tools are one filter away).
export const FEATURED = [
  ...HOME_CAPABILITIES,
  ...byCategory('solutions').slice(0, 5),
  ...byCategory('ai-services').slice(0, 3),
  ...byCategory('security').slice(0, 2),
  ...byCategory('services').slice(0, 2),
];

export const MAX_CARDS = 16;

/** Cards from `all` for a filter, or for a free-text question ("Ask me anything"). */
export function selectCards(all, { filter, query } = {}, featured = all) {
  const q = (query || '').trim().toLowerCase();
  if (q) {
    const words = q.split(/\s+/).filter((w) => w.length > 1);
    const scored = all
      .map((c) => {
        const hay = `${c.title} ${c.kicker} ${c.text || ''} ${c.category}`.toLowerCase();
        return { c, score: words.reduce((n, w) => n + (hay.includes(w) ? 1 : 0), 0) };
      })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score);
    return scored.slice(0, MAX_CARDS).map((x) => x.c);
  }
  if (filter) return all.filter((x) => x.category === filter);
  return featured;
}

/** The homepage selection: every card, opening on the curated mix. */
export const cardsFor = (opts) => selectCards(HOME_CARDS, opts, FEATURED);

// ---------- The card theatre on every other page ----------
// Each page gets its own set, linking to its own sections (or straight out:
// email, directions, jobs).

const ink = (a, b) => [a, b, '#0f1622'];

const solutionsPage = [
  ...theatreCards.filter((c) => c.category === 'solutions').map((c) => ({ ...c, category: 'ai' })),
  ...corporateSolutions.map((s) =>
    card('platforms', {
      id: s.id,
      title: s.name,
      kicker: `${s.group} platform`,
      text: s.headline,
      logos: logosFor(SOLUTION_LOGOS[s.id]).slice(0, 4),
      palette: ink('#ffb547', '#6fe3d3'),
      to: `/solutions#${s.id}`,
    })
  ),
];

const servicesPage = [
  ...theatreCards.filter((c) => c.category === 'services').map((c) => ({ ...c, category: 'practices' })),
  ...theatreCards.filter((c) => c.category === 'ai-services'),
];

const industriesPage = theatreCards.filter((c) => c.category === 'industries');

const companyPage = [
  ...company.values.map((v) =>
    card('values', { id: v.name, title: v.name, kicker: 'Our values', text: v.text, palette: ink('#b4a2ff', '#ff6f91'), to: '/company#values' })
  ),
  ...offices.map((o) =>
    card('offices', { id: o.id, title: o.city, kicker: o.country, text: o.address, palette: ink('#6fe3d3', '#539fe5'), to: '/company#offices' })
  ),
];

const careersPage = [
  card('life', { id: 'thinking', title: 'A thinking-space', kicker: careers.subtitle, text: careers.thinkingSpace.text, palette: ink('#b4a2ff', '#6fe3d3'), to: '/careers#thinking' }),
  ...careers.nurture.map((n) =>
    card('nurture', { id: n, title: n, kicker: 'We nurture', palette: ink('#ff6f91', '#ffb547'), to: '/careers#nurture' })
  ),
  card('life', { id: 'jobs', title: careers.cta.jobsLabel, kicker: 'Open roles', text: careers.cta.text, palette: ink('#ffb547', '#b4a2ff'), to: careers.cta.jobsHref }),
];

const contactPage = [
  card('channels', { id: 'sales', title: 'Sales and enquiries', kicker: emails.sales, text: 'Our sales team will get in touch within 24 hours.', palette: ink('#ffb547', '#ff6f91'), to: `mailto:${emails.sales}` }),
  card('channels', { id: 'general', title: 'General information', kicker: emails.general, palette: ink('#b4a2ff', '#6fe3d3'), to: `mailto:${emails.general}` }),
  card('channels', { id: 'careers', title: 'Careers', kicker: emails.careers, palette: ink('#6fe3d3', '#539fe5'), to: `mailto:${emails.careers}` }),
  ...offices.map((o) =>
    card('offices', { id: o.id, title: o.city, kicker: o.country, text: o.address, palette: ink('#6fe3d3', '#b4a2ff'), to: o.directions })
  ),
];

export const PAGE_THEATRES = {
  solutions: { cards: solutionsPage, filters: [{ id: 'ai', label: 'AI solutions' }, { id: 'platforms', label: 'Enterprise platforms' }] },
  services: { cards: servicesPage, filters: [{ id: 'practices', label: 'Practices' }, { id: 'ai-services', label: 'AI services' }] },
  industries: { cards: industriesPage, filters: [] },
  company: { cards: companyPage, filters: [{ id: 'values', label: 'Our values' }, { id: 'offices', label: 'Our offices' }] },
  careers: { cards: careersPage, filters: [{ id: 'nurture', label: 'What we nurture' }, { id: 'life', label: 'Life and roles' }] },
  contact: { cards: contactPage, filters: [{ id: 'channels', label: 'Email a team' }, { id: 'offices', label: 'Visit an office' }] },
};
