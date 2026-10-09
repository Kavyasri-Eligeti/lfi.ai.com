// LFI AI demo catalogue.
// Source of truth: the production catalogue recovered from lfiai.com build
// main.9fe686d8 (src/legacy/pages/Industries.js). Every link is copied from there.
// Descriptions in quotes come from the lfiai.com structured data. Others are
// short, name-derived labels that make no extra claims.
import { STATUS } from './status';

export const DEMO_GROUPS = [
  { id: 'conversational', name: 'Conversational AI and document intelligence' },
  { id: 'banking', name: 'Banking and financial services analytics' },
  { id: 'telecom', name: 'Telecom analytics' },
  { id: 'insurance', name: 'Insurance analytics' },
  { id: 'operations', name: 'Operations, forecasting and customer experience' },
  { id: 'talent', name: 'Talent and internal tools' },
  { id: 'poc', name: 'Proofs of concept' },
];

const d = (id, name, href, group, extra = {}) => ({
  id,
  name,
  href,
  group,
  status: STATUS.PRODUCT,
  internalRoute: href.startsWith('/'),
  ...extra,
});

export const demos = [
  // Conversational AI and document intelligence
  d('rag-chatbot', 'RAG Chatbot', 'https://rag.lfiai.com/', 'conversational', {
    description: "Retrieval-augmented generation chatbot that answers questions grounded in an organisation's own documents.",
  }),
  d('rag-mobile', 'RAG Chatbot Mobile App', 'https://ragmobile.lfiai.com/', 'conversational', {
    description: 'The same retrieval-augmented assistant, on mobile.',
  }),
  d('unmanned-kiosk', 'Unmanned Kiosk', 'https://uks.lfiai.com/', 'conversational', {
    description: 'Self-service AI kiosk for unattended customer interactions.',
  }),
  d('textiq', 'TextIQ', 'https://textiq.lfidemo.com/', 'conversational', {
    description: 'Document and text intelligence platform for extraction, classification and summarisation.',
    image: '/images/thumbs/textIQ.png',
  }),
  d('vajrax', 'vajraX', 'https://vajrax.lfidemo.com/', 'conversational', {
    description: "Linkfields Innovations' AI platform for enterprise document and data workflows.",
    image: '/images/thumbs/vajraX.png',
  }),
  d('edupilot', 'EduPilot', 'https://edupilot.lfiai.com/', 'conversational', {
    description: 'AI assistant for education workflows and learner support.',
    image: '/images/thumbs/EduPilot.png',
  }),

  // Banking and financial services
  d('banking-analytics', 'Banking Customer Churn and Segmentation', '/BankingAnalytics', 'banking', {
    description: 'Customer churn and customer segmentation analytics for banking.',
    subDemos: [
      { name: 'Customer Churn Analytics', href: 'https://bankingchurn.lfidemo.com' },
      { name: 'Customer Segmentation Analytics', href: 'https://bankingsegment.lfidemo.com' },
    ],
  }),
  d('finsight', 'FinSight', 'https://finsight.lfidemo.com/', 'banking', {
    description: 'Financial insight and reporting analytics for banking data.',
    image: '/images/thumbs/Finsight.png',
  }),
  d('credit-risk', 'Credit Risk Analytics', 'https://creditrisk.lfidemo.com', 'banking', {
    description: 'Credit risk scoring and portfolio risk analytics for lenders.',
  }),
  d('banking-claims-fraud', 'Banking Claims Fraud Detection', 'https://bankingclaimsfraud.lfidemo.com', 'banking', {
    description: 'Fraud detection for banking claims.',
  }),
  d('customer-360', '360 Customer Behaviour Analytics', 'https://customeranalytics.lfidemo.com', 'banking', {
    description: 'A 360-degree view of customer behaviour.',
  }),
  d('clv-banking-telecom', 'CLV Analytics (Banking + Telecom)', 'https://clvbankingtelecom.lfidemo.com', 'banking', {
    description: 'Customer lifetime value analytics across banking and telecom.',
  }),
  d('banking-sentiment', 'Sentiment Analysis', 'https://bankingsentimentanalysis.lfidemo.com/', 'banking', {
    description: 'Sentiment analysis for banking.',
  }),

  // Telecom
  d('telecom-analytics', 'Telecom Customer Churn and Segmentation', '/TelecomAnalytics', 'telecom', {
    description: 'Customer churn and customer segmentation analytics for telecom.',
    subDemos: [
      { name: 'Customer Churn Analytics', href: 'https://telecomchurn.lfidemo.com' },
      { name: 'Customer Segmentation Analytics', href: 'https://telecomsegment.lfidemo.com' },
    ],
  }),
  d('banking-telecom-analytics', '(Banking + Telecom) Customer Analytics', '/BankingTelecomAnalytics', 'telecom', {
    description: 'Combined banking and telecom customer churn and segmentation analytics.',
    subDemos: [
      { name: 'Customer Churn Analytics', href: 'https://banktelecomchurn.lfidemo.com' },
      { name: 'Customer Segmentation Analytics', href: 'https://bankingtelecosmartsegment.lfidemo.com' },
    ],
  }),
  d('nbo-revenue', 'Next Best Offer (NBO) Revenue Analytics', 'https://bankingtelcorevenuenbo.lfidemo.com', 'telecom', {
    description: 'Next-best-offer revenue analytics for banking and telecom.',
  }),
  d('nbo-data-engine', 'NBO Data Recommendation Engine', 'https://telecomnbodataaddon.lfidemo.com/', 'telecom', {
    description: 'Next-best-offer data recommendation engine.',
  }),

  // Insurance
  d('insurance-claims-fraud', 'Claims Fraud and Anomaly Detection', 'https://insurancefraud.lfidemo.com', 'insurance', {
    description: 'Detects fraudulent and anomalous insurance claims using machine learning.',
  }),
  d('signature-fraud', 'Signature Fraud Detection', 'https://signaturefrauddetect.lfidemo.com/', 'insurance', {
    description: 'Signature fraud detection.',
  }),
  d('network-fraud', 'Network Fraud Detection', 'https://networkfrauddetect.lfidemo.com/', 'insurance', {
    description: 'Network fraud detection.',
  }),
  d('risk-score', 'Risk Score Prediction', 'https://insuranceriskscore.lfidemo.com/', 'insurance', {
    description: 'Insurance risk score prediction.',
  }),
  d('underwriting', 'Underwriting Optimisation and Pricing Segmentation', 'https://underwriting.lfidemo.com', 'insurance', {
    description: 'Underwriting optimisation and pricing segmentation.',
  }),
  d('insurance-platform', 'Insurance Analytics Platform (Claims + CLV + Underwriting)', 'https://insuranceplatform.lfidemo.com', 'insurance', {
    description: 'Claims, customer lifetime value and underwriting analytics on one platform.',
  }),
  d('clv-insurance', 'Insurance Customer Lifetime Value', 'https://clvinsurance.lfidemo.com', 'insurance', {
    description: 'Customer lifetime value analytics for insurance.',
  }),
  d('lapse-prediction', 'Lapse Prediction and Retention Analytics', 'https://insurancelapseprediction.lfidemo.com/', 'insurance', {
    description: 'Policy lapse prediction and retention analytics.',
  }),

  // Operations, forecasting and customer experience
  d('demand-forecasting', 'Demand Forecasting and Inventory Optimisation', 'https://forecasting.lfidemo.com/', 'operations', {
    description: 'Time-series demand forecasting and inventory optimisation.',
  }),
  d('equipment-failure', 'Energy Equipment Failure and Predictive Maintenance', 'https://equipment.lfidemo.com', 'operations', {
    description: 'Equipment failure prediction and predictive maintenance for energy.',
  }),
  d('engage360', 'Engage360', 'https://engage360.lfidemo.com/', 'operations', {
    description: 'Customer engagement analytics across channels and touchpoints.',
    image: '/images/thumbs/Engage360.png',
  }),
  d('smart-kpi', 'Smart KPI Monitoring', 'https://kpi.lfidemo.com', 'operations', {
    description: 'Smart monitoring of key performance indicators.',
  }),
  d('digital-twin', 'Digital Twin', 'https://uks.lfiai.com/', 'operations', {
    description: 'Listed under Advanced Analytics in the original catalogue.',
    note: 'In the original catalogue this entry links to the same URL as Unmanned Kiosk.',
  }),
  d('digital-growth-intelligence', 'Digital Growth Intelligence', 'https://seo.lfidemo.com/', 'operations', {
    description: 'Digital growth and search visibility intelligence.',
  }),

  // Talent and internal tools
  d('resume-summarizer', 'Resume Summarisation', '/resume-summarizer', 'talent', {
    description: 'Summarises uploaded CVs.',
    status: STATUS.INTERNAL,
  }),
  d('jd-cv-comparison', 'Job Description and CV Comparison', '/jd-cv-comparison', 'talent', {
    description: 'Compares a job description with a CV.',
    status: STATUS.INTERNAL,
  }),
  d('golf-analyzer', 'Golf Pose Analyzer', '/golf-analyzer', 'talent', {
    description: 'Computer-vision movement analysis of a golf swing.',
    status: STATUS.INTERNAL,
  }),
  d('cybersecurity-lms', 'Cybersecurity LMS', 'http://10.2.0.70:5003', 'talent', {
    description: 'Cybersecurity learning management system.',
    status: STATUS.INTERNAL,
  }),
  d('internal-portal', 'Internal Portal', 'https://internal.lfidemo.com/', 'talent', {
    description: 'Linkfields internal portal.',
  }),

  // Proofs of concept
  d('consulate-sa', 'Consulate SA', 'https://consulate-sa.lfidemo.com/', 'poc', {
    description: 'Consulate proof of concept (South Africa).',
    status: STATUS.POC,
  }),
  d('consulate-la', 'Consulate LA', 'https://consulate-la.lfidemo.com/', 'poc', {
    description: 'Consulate proof of concept (LA).',
    status: STATUS.POC,
  }),
];

export const demoById = Object.fromEntries(demos.map((demo) => [demo.id, demo]));
export const getDemos = (ids = []) => ids.map((id) => demoById[id]).filter(Boolean);
