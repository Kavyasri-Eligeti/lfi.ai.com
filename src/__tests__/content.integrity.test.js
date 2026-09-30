import fs from 'fs';
import path from 'path';
import { demos, demoById } from '../content/demos';
import { planets, worlds } from '../content/universe';
import { technologyById } from '../content/technologies';
import { corporateServices } from '../content/services';
import { corporateSolutions } from '../content/solutions';
import { industries } from '../content/industries';
import { proposedServices, proposedSolutions } from '../content/proposals';
import { STATUS, STATUS_META } from '../content/status';
import { LEGACY_PATHS } from '../app/navigation';

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
    expect(corporateSolutions.map((s) => s.name)).toEqual(['SAP', 'Odoo', 'Microsoft Dynamics', 'Salesforce', 'iPaaS', 'RPA']);
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
      'Oil and Gas',
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
    [...demos, ...planets, ...proposedServices, ...proposedSolutions].forEach((x) => expect(STATUS_META[x.status]).toBeDefined());
  });
});

describe('universe integrity: every clickable object leads somewhere meaningful', () => {
  test('planets reference real demos, technologies and services', () => {
    const proposedIds = new Set(proposedServices.map((s) => s.id));
    const serviceIds = new Set(corporateServices.map((s) => s.id));
    planets.forEach((p) => {
      p.demos.forEach((id) => expect(demoById[id]).toBeDefined());
      p.moons.forEach((id) => expect(technologyById[id]).toBeDefined());
      p.services.proposed.forEach((id) => expect(proposedIds.has(id)).toBe(true));
      p.services.corporate.forEach((id) => expect(serviceIds.has(id)).toBe(true));
      // A planet without demos must be marked proposed or link to corporate offerings.
      if (!p.demos.length) expect(p.status === STATUS.PROPOSED || (p.corporateLinks || []).length > 0).toBe(true);
    });
  });

  test('outer-world satellites link to existing page anchors', () => {
    worlds.solutions.satellites.forEach((s) =>
      expect(corporateSolutions.some((c) => s.href === `/solutions#${c.id}`)).toBe(true)
    );
    worlds.services.satellites.forEach((s) =>
      expect(corporateServices.some((c) => s.href === `/services#${c.id}`)).toBe(true)
    );
    expect(worlds.industries.stars).toHaveLength(worlds.industries.layout.length);
  });
});
