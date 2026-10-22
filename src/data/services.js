/**
 * Services and industries.
 *
 * The service groups mirror the seven service lines published on
 * linkfields.com (Engineering, Consulting, Cloud, Automation, Technology,
 * Teams, IT Infrastructure and Solutions), narrowed to the ones an AI
 * engagement actually draws on. Each `href` points at the official page for
 * that service, so no link leads to a page that does not exist.
 *
 * The industry list is the eight industries published on linkfields.com.
 * Each industry carries two separate pieces of text, and the UI keeps them
 * visibly apart:
 *
 *   `official` - how Linkfields describes its work in that industry on
 *                linkfields.com, VERBATIM. Published company expertise.
 *   `useCase`  - an illustrative application of a capability that exists in
 *                this site's demo catalogue. NOT a customer story, not a
 *                deployment, and labelled as illustrative wherever shown.
 *
 * Conflating the two would turn a demo into a case study, which is the one
 * thing this catalogue must never imply.
 */

import { PARENT_SITE } from "./company";

export const services = [
  {
    id: "ai-ml",
    title: "AI & Machine Learning",
    blurb:
      "From the first use-case workshop to a model running in production: idea-to-product, platform services, explainable AI, document analytics, enterprise search and conversational platforms.",
    href: `${PARENT_SITE}/services/technology/ai-ml`,
    tags: ["Idea to product", "Platform services", "Explainable AI"],
    featured: true,
  },
  {
    id: "automation",
    title: "Intelligent Automation",
    blurb:
      "Robotic process automation combined with AI, so the work that is rule-based gets automated and the work that needs judgement gets a model behind it.",
    href: `${PARENT_SITE}/services/automation`,
    tags: ["RPA", "Process redesign", "Orchestration"],
  },
  {
    id: "engineering",
    title: "Engineering",
    blurb:
      "The build itself - the applications, integrations and data pipelines a model needs around it before it is worth anything to the business.",
    href: `${PARENT_SITE}/services/engineering`,
    tags: ["Custom build", "Integration", "Data engineering"],
  },
  {
    id: "consulting",
    title: "Technology Consulting",
    blurb:
      "Deciding what to build and in what order: where AI is worth applying, what it will cost to run, and what has to change around it to land.",
    href: `${PARENT_SITE}/services/consulting`,
    tags: ["Strategy", "Roadmap", "Prioritisation"],
  },
  {
    id: "cloud",
    title: "Cloud",
    blurb:
      "The platform underneath - cloud architecture and iPaaS integration so models and data move between systems without bespoke glue each time.",
    href: `${PARENT_SITE}/services/cloud`,
    tags: ["Architecture", "iPaaS", "Migration"],
  },
  {
    id: "teams",
    title: "Teams",
    blurb:
      "Specialist engineering and data capacity working alongside your own people, for programmes that need to move faster than hiring allows.",
    href: `${PARENT_SITE}/services/teams`,
    tags: ["Embedded teams", "Specialist skills"],
  },
];

export const industries = [
  {
    id: "banking",
    name: "Banking",
    href: `${PARENT_SITE}/industries/banking`,
    official:
      "Implementing automated solutions to streamline customer service, ensure compliance, transforming the banking sector into a future-ready workspace.",
    useCase:
      "Churn and segmentation on the retail book, credit risk scoring, claims and signature fraud detection, and lifetime value across the relationship.",
    demoIds: [
      "banking-churn",
      "credit-risk",
      "banking-fraud",
      "clv-bank-telco",
    ],
  },
  {
    id: "insurance",
    name: "Insurance",
    href: `${PARENT_SITE}/industries/insurance`,
    official:
      "Automate claims processing, customer interactions, and refine risk management, resulting in significant resource savings and operational optimization.",
    useCase:
      "Claims fraud and anomaly detection, underwriting and pricing segmentation, lapse prediction and portfolio risk scoring.",
    demoIds: ["claims-fraud", "underwriting", "lapse", "risk-score"],
  },
  {
    id: "telecom",
    name: "Telecom",
    href: `${PARENT_SITE}/industries/telecom`,
    official:
      "Enhance your digital experience with strategic approaches that drive technological innovation and boost operational efficiency.",
    useCase:
      "Subscriber churn and segmentation, next-best-offer ranking, data-bundle recommendation and KPI monitoring across the base.",
    demoIds: ["telecom-churn", "nbo", "nbo-data", "kpi"],
  },
  {
    id: "manufacturing",
    name: "Manufacturing",
    href: `${PARENT_SITE}/industries/manufacturing`,
    official:
      "Integrate IoT and AI to streamline production processes, elevate quality control, and reduce operational costs, significantly driving efficiency and competitiveness.",
    useCase:
      "Demand forecasting feeding inventory decisions, and predictive maintenance that flags equipment failure before it stops the line.",
    demoIds: ["forecasting", "equipment"],
  },
  {
    id: "fintech",
    name: "Fintech",
    href: `${PARENT_SITE}/industries/fintech`,
    official:
      "Developing a suite of reliable tools that fortify financial operations against risks while streamlining processes and reduced security vulnerabilities.",
    useCase:
      "Risk scoring, transaction and network fraud detection, and document intelligence applied to onboarding and compliance packs.",
    demoIds: ["network-fraud", "credit-risk", "textiq-demo"],
  },
  {
    id: "fmcg",
    name: "FMCG",
    href: `${PARENT_SITE}/industries/fmcg`,
    official:
      "Optimizing supply chain operations, improving inventory tracking with state-of-the-art systems, driving excellence in product management.",
    useCase:
      "Demand forecasting, inventory optimisation and cross-channel customer behaviour analytics.",
    demoIds: ["forecasting", "customer-360", "engage360-demo"],
  },
  {
    id: "mining",
    name: "Mining",
    href: `${PARENT_SITE}/industries/mining`,
    official:
      "Deploying advanced automation strategies to streamline workflows, reinforce safety protocols, and promote sustainable practices in the mining sector",
    useCase:
      "Predictive maintenance on heavy equipment and KPI monitoring across operations.",
    demoIds: ["equipment", "kpi"],
  },
  {
    id: "oil-gas",
    name: "Oil & Gas",
    href: `${PARENT_SITE}/industries/oil-gas`,
    official:
      "Optimizing Oil & Gas operations for driving sustainability, transforming supply chain efficiency and boosting market competitiveness",
    useCase:
      "Equipment failure prediction, and document intelligence over technical and regulatory documentation.",
    demoIds: ["equipment", "textiq-demo"],
  },
];

/** Differentiators, each traceable to official positioning. */
export const differentiators = [
  {
    title: "Business first, model second",
    body: "The approach starts from the commercial objective and the real challenge your people face - then decides whether AI is the right answer and what it has to be worth.",
  },
  {
    title: "Built to run in production",
    body: "Platform services exist because a model that cannot be deployed, monitored and explained is not a solution. The engineering around the model is part of the work.",
  },
  {
    title: "Decisions you can defend",
    body: "Explainable AI is a named capability, not an afterthought - the reasoning behind an automated decision can be shown to a risk team or a regulator.",
  },
  {
    title: "Integrated with what you already run",
    body: "Engineering, cloud and iPaaS sit alongside the AI practice, so a model connects to the ERP, core system or data platform already in place.",
  },
  {
    title: "Proven across industries",
    body: "Work spanning telecom, fintech, FMCG, banking, insurance, mining, oil and gas, and manufacturing - different data, different regulators, the same delivery approach.",
  },
  {
    title: "A catalogue you can open",
    body: "Every capability on this site has a working demonstration behind it. You can judge the work by using it rather than by reading about it.",
  },
];
