// The AI universe: eight category planets orbit the central AI emblem, and
// three outer worlds represent Solutions, Services and Industries.
// Visual parameters live next to content so that each planet's identity and
// meaning are defined in one place.
import { STATUS } from './status';
import { corporateSolutions } from './solutions';
import { corporateServices } from './services';
import { industries } from './industries';

export const planets = [
  {
    id: 'generative-ai',
    name: 'Generative AI',
    tagline: 'Models that write, summarise and create',
    summary:
      'Generative AI demonstrations from the LFI AI catalogue: document intelligence, financial insight, customer engagement and education assistants built on large language models.',
    status: STATUS.PRODUCT,
    demos: ['textiq', 'vajrax', 'finsight', 'engage360', 'edupilot', 'digital-growth-intelligence', 'internal-portal', 'consulate-sa', 'consulate-la'],
    moons: ['llm', 'prompt-engineering', 'multimodal'],
    services: { corporate: ['technology'], proposed: ['genai-engineering', 'llm-integration', 'prompt-engineering'] },
    visual: { radius: 0.95, orbit: 5.4, tilt: 0.06, phase: 0.2, colors: ['#1a1446', '#5b3fd1', '#ffd600'], atmosphere: '#8a7dff', noise: 1.8, bands: 2, bandMix: 0.15, lines: 1.0 },
  },
  {
    id: 'conversational-ai',
    name: 'Conversational AI',
    tagline: 'Assistants grounded in your knowledge',
    summary:
      'Retrieval-augmented chatbots on web and mobile, an unattended self-service kiosk and an education assistant: live, working conversational AI demos.',
    status: STATUS.PRODUCT,
    demos: ['rag-chatbot', 'rag-mobile', 'unmanned-kiosk', 'edupilot'],
    moons: ['rag', 'vector-db', 'voice-ai'],
    services: { corporate: ['technology'], proposed: ['rag-development', 'voice-agent-development', 'vector-db-integration'] },
    visual: { radius: 0.8, orbit: 7.1, tilt: -0.08, phase: 2.1, colors: ['#0b2a5c', '#2d58c0', '#cfe8ff'], atmosphere: '#5aa9ff', noise: 1.3, bands: 7, bandMix: 0.55, lines: 0.5 },
  },
  {
    id: 'document-intelligence',
    name: 'Document Intelligence',
    tagline: 'Turning documents into decisions',
    summary:
      'Extraction, classification and summarisation of documents, from enterprise workflows (TextIQ, vajraX) to talent tools that summarise CVs and match them to job descriptions.',
    status: STATUS.PRODUCT,
    demos: ['textiq', 'vajrax', 'resume-summarizer', 'jd-cv-comparison'],
    moons: ['document-intelligence', 'llm'],
    services: { corporate: ['automation'], proposed: ['llm-integration', 'ai-api-microservices'] },
    visual: { radius: 0.62, orbit: 8.8, tilt: 0.1, phase: 4.0, colors: ['#2e3a4c', '#b8c6d6', '#2d58c0'], atmosphere: '#cfe0ff', noise: 2.4, bands: 3, bandMix: 0.3, lines: 1.2 },
  },
  {
    id: 'data-intelligence',
    name: 'Data Intelligence',
    tagline: 'Prediction, segmentation and insight',
    summary:
      'Machine-learning and advanced analytics demos: customer churn and segmentation, lifetime value, next best offer, forecasting, underwriting, KPI monitoring and predictive maintenance.',
    status: STATUS.PRODUCT,
    demos: [
      'banking-analytics', 'telecom-analytics', 'banking-telecom-analytics', 'customer-360', 'clv-banking-telecom',
      'clv-insurance', 'nbo-revenue', 'nbo-data-engine', 'demand-forecasting', 'underwriting', 'insurance-platform',
      'lapse-prediction', 'smart-kpi', 'equipment-failure', 'banking-sentiment', 'digital-twin',
    ],
    moons: ['predictive-analytics', 'time-series', 'mlops'],
    services: { corporate: ['technology'], proposed: ['mlops-llmops', 'model-deployment'] },
    visual: { radius: 1.05, orbit: 10.6, tilt: -0.05, phase: 5.3, colors: ['#4a2208', '#ff7800', '#ffe0b0'], atmosphere: '#ffb066', noise: 1.1, bands: 11, bandMix: 0.8, lines: 0.0, ring: true },
  },
  {
    id: 'fraud-risk',
    name: 'Fraud & Risk Intelligence',
    tagline: 'Detecting what does not belong',
    summary:
      'Claims fraud, signature fraud and network fraud detection, plus credit and insurance risk scoring, for banking and insurance.',
    status: STATUS.PRODUCT,
    demos: ['insurance-claims-fraud', 'banking-claims-fraud', 'signature-fraud', 'network-fraud', 'credit-risk', 'risk-score'],
    moons: ['anomaly-detection', 'model-evaluation'],
    services: { corporate: ['technology'], proposed: ['ai-security', 'llm-evaluation'] },
    visual: { radius: 0.7, orbit: 12.4, tilt: 0.12, phase: 0.9, colors: ['#1c0a0e', '#7a1a22', '#ff7800'], atmosphere: '#ff5a3c', noise: 2.0, bands: 0, bandMix: 0.0, lines: 1.6 },
  },
  {
    id: 'computer-vision',
    name: 'Computer Vision',
    tagline: 'Seeing movement, form and detail',
    summary:
      'Computer-vision movement analysis: the Golf Pose Analyzer detects poses in a swing and reports joint angles.',
    status: STATUS.PRODUCT,
    demos: ['golf-analyzer'],
    moons: ['computer-vision', 'multimodal'],
    services: { corporate: ['technology'], proposed: ['ai-api-microservices'] },
    visual: { radius: 0.58, orbit: 14.0, tilt: -0.1, phase: 3.2, colors: ['#042a2e', '#0f8f8a', '#9ff7ea'], atmosphere: '#45e0d0', noise: 1.6, bands: 4, bandMix: 0.35, lines: 0.8 },
  },
  {
    id: 'ai-agents',
    name: 'AI Agents',
    tagline: 'Proposed: systems that plan and act',
    summary:
      'A proposed area awaiting business approval: agents that plan multi-step work and call approved tools, with human oversight. No Linkfields agent product is claimed here.',
    status: STATUS.PROPOSED,
    demos: [],
    moons: ['ai-agents', 'orchestration', 'ai-security'],
    services: { corporate: [], proposed: ['agent-development', 'workflow-orchestration', 'ai-observability'] },
    visual: { radius: 0.66, orbit: 15.6, tilt: 0.07, phase: 1.6, colors: ['#2b2300', '#b89400', '#fff2a8'], atmosphere: '#ffe066', noise: 1.4, bands: 5, bandMix: 0.4, lines: 1.0 },
  },
  {
    id: 'ai-automation',
    name: 'AI Automation',
    tagline: 'Automation, extended with intelligence',
    summary:
      'Built on Linkfields’ published Automation and RPA services. Extending these bots with AI (AI-assisted business automation) is a proposal awaiting business approval.',
    status: STATUS.CORPORATE,
    demos: [],
    moons: ['orchestration', 'llmops'],
    services: { corporate: ['automation'], proposed: ['workflow-orchestration', 'responsible-ai'] },
    corporateLinks: ['rpa', 'ipaas'],
    visual: { radius: 0.74, orbit: 17.2, tilt: -0.04, phase: 4.7, colors: ['#10151f', '#46566e', '#ffd600'], atmosphere: '#9fb4d6', noise: 2.2, bands: 0, bandMix: 0.0, lines: 1.4 },
  },
];

export const planetById = Object.fromEntries(planets.map((x) => [x.id, x]));

// Outer worlds visited by the home-page scroll journey.
export const worlds = {
  solutions: {
    id: 'solutions',
    name: 'Solutions',
    position: [-36, 5, -34],
    radius: 3.0,
    colors: ['#06163a', '#2d58c0', '#8fd3ff'],
    atmosphere: '#6fb6ff',
    moonOrbit: 5.4,
    satellites: corporateSolutions.map((s) => ({ id: s.id, name: s.name, href: `/solutions#${s.id}` })),
  },
  services: {
    id: 'services',
    name: 'Services',
    position: [38, -3, -64],
    radius: 3.4,
    colors: ['#2a1204', '#ff7800', '#ffd600'],
    atmosphere: '#ffb45a',
    moonOrbit: 6.4,
    ring: true,
    satellites: corporateServices.map((s) => ({ id: s.id, name: s.name, href: `/services#${s.id}` })),
  },
  industries: {
    id: 'industries',
    name: 'Industries',
    position: [0, 16, -104],
    // Constellation layout (x, y) relative to the centre, in world units.
    layout: [[-9, 3], [-5, 6.5], [0, 4], [5, 7], [9.5, 2.5], [6, -2.5], [0, -4], [-6, -2]],
    stars: industries.map((i) => ({ id: i.id, name: i.name, href: `/industries#${i.id}` })),
  },
};
