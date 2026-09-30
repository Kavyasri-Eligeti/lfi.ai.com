// Industries. Source: linkfields.com (descriptions verbatim). Retrieved 2026-09-30.
// relatedDemos only maps an industry to demos that the original LFI AI
// catalogue itself filed under that industry. No new industry expertise is implied.
import { STATUS } from './status';
import { CORPORATE_SITE } from './company';

export const industries = [
  {
    id: 'manufacturing',
    name: 'Manufacturing',
    text: 'Integrate IoT and AI to streamline production processes, elevate quality control, and reduce operational costs, significantly driving efficiency and competitiveness.',
    relatedDemos: ['demand-forecasting'],
  },
  {
    id: 'telecom',
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
    name: 'Fintech',
    text: 'Developing a suite of reliable tools that fortify financial operations against risks while streamlining processes and reduced security vulnerabilities.',
    relatedDemos: [],
  },
  {
    id: 'fmcg',
    name: 'FMCG',
    text: 'Optimizing supply chain operations, improving inventory tracking with state-of-the-art systems, driving excellence in product management.',
    relatedDemos: [],
  },
  {
    id: 'mining',
    name: 'Mining',
    text: 'Deploying advanced automation strategies to streamline workflows, reinforce safety protocols, and promote sustainable practices in the mining sector.',
    relatedDemos: [],
  },
  {
    id: 'oil-gas',
    name: 'Oil and Gas',
    text: 'Optimizing Oil & Gas operations for driving sustainability, transforming supply chain efficiency and boosting market competitiveness.',
    relatedDemos: [],
  },
].map((industry) => ({
  ...industry,
  status: STATUS.CORPORATE,
  href: `${CORPORATE_SITE}/industries/${industry.id}`,
}));
