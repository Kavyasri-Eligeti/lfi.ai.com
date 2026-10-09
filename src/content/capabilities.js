// AI capability groups used to browse the demo catalogue.
// Every group is backed by existing demos. The groupings follow the original
// LFI AI catalogue's own lists (its "GenAI", "Machine Learning" and "Advanced
// Analytics" sections) and the demos' published descriptions. No capability is
// claimed here that a live demo does not show.
import { STATUS } from './status';

export const capabilities = [
  {
    id: 'generative-ai',
    name: 'Generative AI',
    short: 'Write, summarise and create',
    summary:
      'Generative AI demonstrations from the LFI AI catalogue: document intelligence, financial insight, customer engagement and education assistants built on large language models.',
    demos: ['textiq', 'vajrax', 'finsight', 'engage360', 'edupilot', 'digital-growth-intelligence', 'internal-portal', 'consulate-sa', 'consulate-la'],
  },
  {
    id: 'conversational-ai',
    name: 'Conversational AI',
    short: 'Assistants grounded in your knowledge',
    summary:
      'Retrieval-augmented chatbots on web and mobile, an unattended self-service kiosk and an education assistant.',
    demos: ['rag-chatbot', 'rag-mobile', 'unmanned-kiosk', 'edupilot'],
  },
  {
    id: 'document-intelligence',
    name: 'Document Intelligence',
    short: 'Turning documents into decisions',
    summary:
      'Extraction, classification and summarisation of documents, from enterprise workflows (TextIQ, vajraX) to talent tools that summarise CVs and match them to job descriptions.',
    demos: ['textiq', 'vajrax', 'resume-summarizer', 'jd-cv-comparison'],
  },
  {
    id: 'predictive-analytics',
    name: 'Predictive Analytics',
    short: 'Prediction, segmentation and insight',
    summary:
      'Machine-learning and advanced analytics: customer churn and segmentation, lifetime value, next best offer, forecasting, underwriting, KPI monitoring and predictive maintenance.',
    demos: [
      'banking-analytics', 'telecom-analytics', 'banking-telecom-analytics', 'customer-360', 'clv-banking-telecom',
      'clv-insurance', 'nbo-revenue', 'nbo-data-engine', 'demand-forecasting', 'underwriting', 'insurance-platform',
      'lapse-prediction', 'smart-kpi', 'equipment-failure', 'banking-sentiment', 'digital-twin',
    ],
  },
  {
    id: 'fraud-risk',
    name: 'Fraud and Risk',
    short: 'Detecting what does not belong',
    summary:
      'Claims fraud, signature fraud and network fraud detection, plus credit and insurance risk scoring, for banking and insurance.',
    demos: ['insurance-claims-fraud', 'banking-claims-fraud', 'signature-fraud', 'network-fraud', 'credit-risk', 'risk-score'],
  },
  {
    id: 'computer-vision',
    name: 'Computer Vision',
    short: 'Seeing movement, form and detail',
    summary: 'Computer-vision movement analysis: the Golf Pose Analyzer detects poses in a swing and reports joint angles.',
    demos: ['golf-analyzer'],
  },
].map((c) => ({ ...c, status: STATUS.PRODUCT }));

export const capabilityById = Object.fromEntries(capabilities.map((c) => [c.id, c]));
export const capabilitiesForDemo = (demoId) => capabilities.filter((c) => c.demos.includes(demoId));

// Flagship demos featured on the home page and at the top of the solutions page.
export const featuredDemoIds = ['rag-chatbot', 'textiq', 'vajrax', 'finsight', 'credit-risk', 'insurance-claims-fraud', 'demand-forecasting'];
