// Corporate solutions. Source: linkfields.com solution pages and the header
// "Solutions" menu (headlines, intros and offering names as published).
// Retrieved 2026-10-01.
import { STATUS } from './status';
import { CORPORATE_SITE } from './company';

export const ERP_INTRO =
  'Combining cutting-edge technology with deep industry expertise, we provide the perfect ERP solution for your challenge.';

export const corporateSolutions = [
  {
    id: 'sap',
    name: 'SAP',
    group: 'ERP',
    status: STATUS.CORPORATE,
    headline: 'Empower your enterprise with SAP Solutions',
    intro: 'SAP ERP consulting and implementation solutions.',
    offerings: ['S/4 HANA', 'Core SAP Expertise', 'SAP Special Expertise', 'Services & More', 'Data Services'],
    href: `${CORPORATE_SITE}/solutions/erp-solutions/sap`,
  },
  {
    id: 'odoo',
    name: 'Odoo',
    group: 'ERP',
    status: STATUS.CORPORATE,
    headline: 'Get your business processes simplified',
    intro: 'We specialize in customizing Odoo to suit your specific business requirements.',
    offerings: [
      'Business Process Re-engineering',
      'Custom Development',
      'System Integration',
      'Data Migration & Management',
    ],
    href: `${CORPORATE_SITE}/solutions/erp-solutions/odoo`,
  },
  {
    id: 'microsoft-dynamics',
    name: 'Microsoft Dynamics',
    group: 'ERP',
    status: STATUS.CORPORATE,
    headline: 'Microsoft Dynamics: ERP, CRM, and BI, brought together on a single platform.',
    intro:
      'A trusted Dynamics 365 development company with a wealth of experience in delivering CRM projects across various industry verticals.',
    offerings: ['ERP', 'CRM', 'BI'],
    href: `${CORPORATE_SITE}/solutions/erp-solutions/microsoft-dynamics`,
  },
  {
    id: 'salesforce',
    name: 'Salesforce',
    group: 'CRM',
    status: STATUS.CORPORATE,
    headline: 'Elevate customer engagement and streamline operations with our Salesforce expertise.',
    intro:
      'Certified consultants partner with organizations to fully leverage the Salesforce ecosystem through thorough business analysis, stakeholder engagement, and targeted strategy development.',
    offerings: [
      'Salesforce Consulting Services',
      'Implementation Services',
      'Integration services',
      'Development services',
      'Migration services',
      'Support services',
    ],
    href: `${CORPORATE_SITE}/solutions/erp-solutions/salesforce`,
  },
  {
    id: 'ipaas',
    name: 'iPaaS',
    group: 'Integration',
    status: STATUS.CORPORATE,
    headline: 'Pioneers in iPaaS implementation',
    intro:
      'Linkfields offers tailor-made solutions that align with your unique business needs, backed by expertise across a diverse range of products.',
    offerings: [
      'Tailored Integration Solutions',
      'Seamless Data Management',
      'Automated Workflows',
      'API Governance',
      'Unified Monitoring',
      'Cloud and On-Premises Integration',
      'Strategic Consultation',
      'Continuous Support and Training',
      'Scalability and Compliance',
    ],
    href: `${CORPORATE_SITE}/services/cloud/ipaas`,
  },
  {
    id: 'rpa',
    name: 'RPA',
    group: 'Automation',
    status: STATUS.CORPORATE,
    headline: 'Software bots for an automated workplace',
    intro:
      'RPA, aimed at automating business processes, uses tools, or a “robot,” to capture and interpret applications for processing a transaction, manipulating data, triggering responses and communicating with other digital systems.',
    offerings: [
      'RPA consulting',
      'Automation design',
      'RPA development',
      'Infrastructure support',
      'Managed RPA services',
      'Automation support',
      'RPA center of excellence',
    ],
    href: `${CORPORATE_SITE}/services/automation/robotic-process-automation`,
  },
  {
    id: 'testorium-z',
    name: 'Testorium Z',
    group: 'Quality',
    status: STATUS.CORPORATE,
    headline: 'Accelerate Quality. Automate Smart. Deliver Faster.',
    intro: 'Listed in the Solutions menu on linkfields.com. Full details are on the product’s own website.',
    offerings: [],
    href: 'https://testoriumz.com',
  },
];

// Named AI products from the LFI AI catalogue (lfiai.com). Details live in demos.js.
export const aiProductIds = [
  'textiq',
  'vajrax',
  'finsight',
  'engage360',
  'edupilot',
  'rag-chatbot',
  'unmanned-kiosk',
  'digital-growth-intelligence',
];
