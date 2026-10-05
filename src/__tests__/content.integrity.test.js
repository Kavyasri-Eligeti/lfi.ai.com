import fs from 'fs';
import path from 'path';
import { demos, demoById } from '../content/demos';
import { capabilities, featuredDemoIds } from '../content/capabilities';
import { partners, offices, company } from '../content/company';
import { insights } from '../content/insights';
import { careers } from '../content/careers';
import { corporateServices } from '../content/services';
import { corporateSolutions } from '../content/solutions';
import { industries } from '../content/industries';
import { proposedServices, proposedSolutions } from '../content/proposals';
import { STATUS, STATUS_META } from '../content/status';
import { LEGACY_PATHS } from '../app/navigation';
import { aiSolutions, aiSolutionById } from '../content/aiSolutions';
import { aiServicePractice } from '../content/services';
import { aiTools, aiSecurityTools, constellation } from '../content/aiTools';
import { theatreCards, FEATURED, CARD_FILTERS, cardsFor, MAX_CARDS, HOME_CARDS } from '../content/theatreCards';
import { LOGOS, SERVICE_LOGOS, SUB_SERVICE_LOGOS, SOLUTION_LOGOS } from '../content/logos';
import { DEMO_GLYPHS, GLYPHS, GROUP_ACCENTS, demoMarkFor } from '../content/demoMarks';
import { DEMO_GROUPS } from '../content/demos';

const legacySource = fs.readFileSync(path.join(__dirname, '../legacy/pages/Industries.js'), 'utf8');
// Only active entries: commented-out lines in the original are ignored.
const livePaths = [...legacySource.matchAll(/^\s*path:\s*"([^"]+)"/gm)].map((m) => m[1]);
const norm = (u) => u.replace(/\/$/, '');

describe('preservation of the production catalogue (build main.9fe686d8)', () => {
  test('the legacy catalogue source is present and parsable', () => {
    expect(livePaths.length).toBeGreaterThan(30);
  });

  test('every live link from the original catalogue is in the new catalogue', () => {
    const hrefs = new Set(demos.map((d) => norm(d.href)));
    const missing = livePaths.filter((p) => !hrefs.has(norm(p)));
    expect(missing).toEqual([]);
  });

  test('every internal legacy route is still routed', () => {
    demos.filter((d) => d.internalRoute).forEach((d) => expect(LEGACY_PATHS).toContain(d.href));
    [
      '/BankingAnalytics',
      '/TelecomAnalytics',
      '/BankingTelecomAnalytics',
      '/golf-analyzer',
      '/resume-summarizer',
      '/jd-cv-comparison',
      '/users',
      '/generate-report',
    ].forEach((p) => expect(LEGACY_PATHS).toContain(p));
  });

  test('demo ids are unique and links are well-formed', () => {
    expect(new Set(demos.map((d) => d.id)).size).toBe(demos.length);
    demos.forEach((d) => expect(d.href).toMatch(/^(https?:\/\/|\/)/));
  });
});

describe('corporate content matches linkfields.com', () => {
  test('services are preserved with their published names', () => {
    expect(corporateServices.map((s) => s.name)).toEqual([
      'Engineering',
      'Consulting',
      'Cloud',
      'Automation',
      'Technology',
      'Teams',
      'IT Infrastructure and Solutions',
    ]);
  });

  test('solutions are preserved', () => {
    expect(corporateSolutions.map((s) => s.name)).toEqual(['SAP', 'Odoo', 'Microsoft Dynamics', 'Salesforce', 'iPaaS', 'RPA', 'Testorium Z']);
  });

  test('industries are preserved exactly', () => {
    expect(industries.map((i) => i.name)).toEqual([
      'Manufacturing',
      'Telecom',
      'Banking',
      'Insurance',
      'Fintech',
      'FMCG',
      'Mining',
      'Oil & Gas',
    ]);
    industries.forEach((i) => i.relatedDemos.forEach((id) => expect(demoById[id]).toBeDefined()));
  });
});

describe('claims are labelled honestly', () => {
  test('proposals are never marked as existing offerings', () => {
    [...proposedSolutions, ...proposedServices].forEach((p) => {
      expect([STATUS.PROPOSED, STATUS.DEMO_SUPPORTED]).toContain(p.status);
      p.evidence.forEach((id) => expect(demoById[id]).toBeDefined());
    });
  });

  test('every status used has display metadata', () => {
    [...demos, ...capabilities, ...proposedServices, ...proposedSolutions].forEach((x) => expect(STATUS_META[x.status]).toBeDefined());
  });
});

const PUBLIC = path.join(__dirname, '../../public');
const publicFile = (url) => fs.existsSync(path.join(PUBLIC, url.replace(/^\//, '')));

describe('every browsable item leads somewhere real', () => {
  test('capability groups and featured demos reference existing demos', () => {
    capabilities.forEach((c) => {
      expect(c.demos.length).toBeGreaterThan(0);
      c.demos.forEach((id) => expect(demoById[id]).toBeDefined());
    });
    featuredDemoIds.forEach((id) => expect(demoById[id]).toBeDefined());
  });

  test('bundled images exist in public/', () => {
    partners.forEach((p) => expect(publicFile(p.logo)).toBe(true));
    industries.filter((i) => i.image).forEach((i) => expect(publicFile(i.image)).toBe(true));
    company.recognition.filter((r) => r.image).forEach((r) => expect(publicFile(r.image)).toBe(true));
    Object.values(careers.images).forEach((img) => {
      expect(publicFile(img.src)).toBe(true);
      expect(publicFile(img.srcSm)).toBe(true);
    });
    demos.filter((d) => d.image).forEach((d) => expect(publicFile(d.image)).toBe(true));
  });

  test('every demo card shows a logo: a product logo or a themed mark', () => {
    demos.forEach((d) => {
      expect(Object.keys(DEMO_GLYPHS)).toContain(d.id);
      if (d.image) {
        expect(DEMO_GLYPHS[d.id]).toBeNull();
      } else {
        const mark = demoMarkFor(d);
        expect(mark).not.toBeNull();
        expect(GLYPHS[mark.glyph]).toBeDefined();
        expect(mark.path).toMatch(/^M/);
        expect(GROUP_ACCENTS[d.group]).toBe(mark.accent);
      }
    });
    Object.keys(DEMO_GLYPHS).forEach((id) => expect(demoById[id]).toBeDefined());
    DEMO_GROUPS.forEach((g) => expect(GROUP_ACCENTS[g.id]).toMatch(/^#[0-9a-f]{6}$/i));
  });

  test('offices carry published contact details and direction links', () => {
    expect(offices.map((o) => o.country)).toEqual(['South Africa', 'India', 'USA', 'UAE', 'Australia', 'Botswana']);
    offices.forEach((o) => {
      expect(o.address.length).toBeGreaterThan(10);
      expect(o.phones.length).toBeGreaterThan(0);
      expect(o.directions).toMatch(/^https:\/\/(www\.google\.com\/maps|goo\.gl\/maps|maps\.app\.goo\.gl)/);
    });
  });

  test('insights keep their published titles and only published dates', () => {
    expect(insights).toHaveLength(8);
    insights.forEach((n) => {
      expect(n.href).toMatch(/^https:\/\//);
      if (n.type === 'News') expect(n.date).toBeUndefined();
      if (n.date) expect(n.date).toMatch(/^2024-\d\d-\d\d$/);
    });
  });

  test('the mission and values are the published wording', () => {
    expect(company.mission).toMatch(/^Through our relentless pursuit of engineering excellence/);
    expect(company.values.map((v) => v.name)).toEqual(['Innovation', 'Courage', 'Respect', 'Impact', 'Passion', 'Ownership']);
  });
});

describe('AI solutions, AI services and the universe', () => {
  test('every AI solution is complete and its live demos exist', () => {
    expect(new Set(aiSolutions.map((x) => x.id)).size).toBe(aiSolutions.length);
    aiSolutions.forEach((x) => {
      expect(x.useCases.length).toBeGreaterThan(0);
      expect(x.mark.code).toMatch(/^[A-Z][a-z]$/);
      expect(x.mark.accent).toMatch(/^#/);
      x.demos.forEach((id) => expect(demoById[id]).toBeDefined());
    });
  });

  test('AI services sit alongside, not inside, the published services', () => {
    expect(corporateServices.map((x) => x.id)).not.toContain(aiServicePractice.id);
    expect(aiServicePractice.subServices.length).toBeGreaterThan(5);
  });

  test('the constellation lists AI tools and AI security tools, each with its official logo', () => {
    expect(aiTools).toHaveLength(12);
    expect(aiSecurityTools).toHaveLength(12);
    expect(new Set(constellation.map((x) => x.id)).size).toBe(constellation.length);
    constellation.forEach((x) => {
      expect(x.name && x.vendor && x.tag).toBeTruthy();
      expect(publicFile(x.logo)).toBe(true);
    });
  });

  test('the theatre cards cover every offering and lead somewhere real', () => {
    expect(new Set(theatreCards.map((c) => c.id)).size).toBe(theatreCards.length);
    theatreCards.forEach((c) => {
      expect(c.to).toMatch(/^\/(solutions|services|industries)(#[a-z0-9-]+)?$/);
      expect(c.palette).toHaveLength(3);
      if (c.logo) expect(publicFile(c.logo)).toBe(true);
      if (c.image) expect(publicFile(c.image)).toBe(true);
    });
    expect(FEATURED.length).toBe(MAX_CARDS);
    // Telecom, Manufacturing, Banking and Insurance are not part of the homepage flow.
    expect(HOME_CARDS.map((c) => c.id)).not.toEqual(expect.arrayContaining(['industries-telecom']));
    expect(HOME_CARDS.map((c) => c.id)).not.toContain('industries-manufacturing');
    ['Telecom', 'Manufacturing', 'Banking', 'Insurance'].forEach((name) =>
      expect(cardsFor({ filter: 'industries' }).map((c) => c.title)).not.toContain(name)
    );
    expect(FEATURED.filter((c) => c.category === 'industries')).toHaveLength(0);
    // Machine Learning, Deep Learning, Cyber Security and AI Security replace Claude, ChatGPT and Gemini.
    const home = FEATURED.map((c) => c.title);
    ['Machine Learning', 'Deep Learning', 'Cyber Security', 'AI Security'].forEach((t) => expect(home).toContain(t));
    ['Claude', 'ChatGPT', 'Gemini'].forEach((t) => expect(HOME_CARDS.map((c) => c.title)).not.toContain(t));
    FEATURED.forEach((c) => (c.logos || []).forEach((l) => expect(publicFile(l.src)).toBe(true)));
    CARD_FILTERS.forEach((f) => expect(cardsFor({ filter: f.id }).length).toBeGreaterThan(0));
    expect(cardsFor({ query: 'guardrails' }).map((c) => c.title)).toEqual(expect.arrayContaining(['Bedrock Guardrails', 'NeMo Guardrails']));
  });

  test('every service, sub-service and solution shows official logos that exist', () => {
    Object.values(LOGOS).forEach((l) => expect(publicFile(l.src)).toBe(true));
    const keys = [...Object.values(SERVICE_LOGOS), ...Object.values(SUB_SERVICE_LOGOS), ...Object.values(SOLUTION_LOGOS)].flat();
    keys.forEach((k) => expect(LOGOS[k]).toBeDefined());
    corporateServices.forEach((s) => {
      expect(SERVICE_LOGOS[s.id]?.length).toBeGreaterThan(0);
      (s.subServices || []).forEach((sub) => expect(SUB_SERVICE_LOGOS[sub.name]?.length).toBeGreaterThan(0));
    });
    aiServicePractice.subServices.forEach((sub) => expect(SUB_SERVICE_LOGOS[sub.name]?.length).toBeGreaterThan(0));
    [...corporateSolutions, ...aiSolutions].forEach((x) => expect(SOLUTION_LOGOS[x.id]?.length).toBeGreaterThan(0));
  });
});
