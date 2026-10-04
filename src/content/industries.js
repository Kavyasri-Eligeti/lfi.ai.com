// Industries. Source: linkfields.com home page cards and /industries/* pages (verbatim).
// Retrieved 2026-10-01. Photos: professional photography from Unsplash
// (Unsplash License; see public/images/industries/photo/CREDITS.txt).
// relatedDemos only maps an industry to demos that the original LFI AI
// catalogue itself filed under that industry. No new industry expertise is implied.
import { STATUS } from './status';
import { CORPORATE_SITE } from './company';

export const industries = [
  {
    id: 'manufacturing',
    image: '/images/industries/photo/manufacturing.webp',
    tagline: 'Seamless Manufacturing through custom and intelligent solutions.',
    name: 'Manufacturing',
    text: 'Integrate IoT and AI to streamline production processes, elevate quality control, and reduce operational costs, significantly driving efficiency and competitiveness.',
    relatedDemos: ['demand-forecasting'],
  },
  {
    id: 'telecom',
    image: '/images/industries/photo/telecom.webp',
    tagline: 'Driving Digitalization in the Telecom Industry: Transforming and Innovating the Digital Experience',
    name: 'Telecom',
    text: 'Enhance your digital experience with strategic approaches that drive technological innovation and boost operational efficiency.',
    relatedDemos: [
      'telecom-analytics',
      'banking-telecom-analytics',
      'smart-kpi',
      'clv-banking-telecom',
      'nbo-data-engine',
    ],
  },
  {
    id: 'banking',
    image: '/images/industries/photo/banking.webp',
    tagline: 'Creating a future-ready, automated banking landscape',
    name: 'Banking',
    text: 'Implementing automated solutions to streamline customer service, ensure compliance, transforming the banking sector into a future-ready workspace.',
    relatedDemos: [
      'banking-analytics',
      'customer-360',
      'banking-claims-fraud',
      'signature-fraud',
      'nbo-revenue',
      'clv-banking-telecom',
      'credit-risk',
      'banking-sentiment',
    ],
  },
  {
    id: 'insurance',
    image: '/images/industries/photo/insurance.webp',
    tagline: 'Revolutionizing Insurance with Advanced Technology',
    name: 'Insurance',
    text: 'Automate claims processing, customer interactions, and refine risk management, resulting in significant resource savings and operational optimization.',
    relatedDemos: [
      'insurance-claims-fraud',
      'signature-fraud',
      'network-fraud',
      'risk-score',
      'underwriting',
      'insurance-platform',
      'clv-insurance',
      'lapse-prediction',
    ],
  },
  {
    id: 'fintech',
    image: '/images/industries/photo/fintech.webp',
    tagline: 'Developing a Suite of Reliable Tools to Fortify Financial Operations',
    name: 'Fintech',
    text: 'Developing a suite of reliable tools that fortify financial operations against risks while streamlining processes and reduced security vulnerabilities.',
    relatedDemos: [],
  },
  {
    id: 'fmcg',
    image: '/images/industries/photo/fmcg.webp',
    tagline: 'Optimizing FMCG Operations with AI-Driven Insights',
    name: 'FMCG',
    text: 'Optimizing supply chain operations, improving inventory tracking with state-of-the-art systems, driving excellence in product management.',
    relatedDemos: [],
  },
  {
    id: 'mining',
    image: '/images/industries/photo/mining.webp',
    tagline: 'Helping mining industries become ready for a digital future through strategic plans for automation.',
    name: 'Mining',
    text: 'Deploying advanced automation strategies to streamline workflows, reinforce safety protocols, and promote sustainable practices in the mining sector.',
    relatedDemos: [],
  },
  {
    id: 'oil-gas',
    image: '/images/industries/photo/oil-gas.webp',
    tagline: 'Delivering cutting-edge solutions to optimize the Oil & Gas industry’s performance',
    name: 'Oil & Gas',
    text: 'Optimizing Oil & Gas operations for driving sustainability, transforming supply chain efficiency and boosting market competitiveness.',
    relatedDemos: [],
  },
].map((industry) => ({
  ...industry,
  status: STATUS.CORPORATE,
  href: `${CORPORATE_SITE}/industries/${industry.id}`,
}));
