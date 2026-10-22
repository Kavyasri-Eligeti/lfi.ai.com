/**
 * The wider Linkfields enterprise technology ecosystem.
 *
 * These are the six solutions published under "Our Solutions" on
 * linkfields.com. Each `official` string is the description from that page,
 * verbatim; each `href` is the destination the official card links to, and
 * the mapping between the two was taken from the page's own markup rather
 * than inferred from the order they happen to appear in.
 *
 * `bridge` is this site's own sentence, and it exists to answer one question
 * honestly: what does an ERP platform have to do with an AI site? The answer
 * is integration - a model is worth something when it reaches the system the
 * business actually runs on. These sentences say that and nothing more. None
 * of them claims the platform is an AI product, because none of them is one.
 */

import { PARENT_SITE } from "./company";

export const enterpriseSolutions = [
  {
    id: "sap",
    name: "SAP",
    kicker: "ERP",
    official:
      "We specialize in harnessing the power of SAP's latest release, S/4HANA, for your business's unique needs.",
    bridge:
      "Where the transactional record lives. Forecasting and document models are only useful once their output reaches it.",
    href: `${PARENT_SITE}/solutions/erp-solutions/sap`,
    icon: "stack",
  },
  {
    id: "odoo",
    name: "Odoo",
    kicker: "ERP",
    official:
      "From business process reengineering to seamless integration, we redefine efficiency for your enterprise.",
    bridge:
      "Process reengineering is the step that decides which decisions a model is allowed to change - and which it only informs.",
    href: `${PARENT_SITE}/solutions/erp-solutions/odoo`,
    icon: "grid",
  },
  {
    id: "microsoft-dynamics",
    name: "Microsoft Dynamics",
    kicker: "Business applications",
    official:
      "Embrace intelligent business applications that integrate your operations with predictive insights.",
    bridge:
      "The closest of these to the AI practice: predictive output delivered inside the application someone already has open.",
    href: `${PARENT_SITE}/solutions/erp-solutions/microsoft-dynamics`,
    icon: "spark",
  },
  {
    id: "salesforce",
    name: "Salesforce",
    kicker: "CRM",
    official:
      "Streamlined CRM for efficient sales, marketing automation, and driving growth in today's competitive market.",
    bridge:
      "Churn, segmentation and next-best-offer models all end up here, because this is where someone acts on them.",
    href: `${PARENT_SITE}/solutions/erp-solutions/salesforce`,
    icon: "chat",
  },
  {
    id: "ipaas",
    name: "iPaaS",
    kicker: "Integration",
    official:
      "With our extensive range of iPaaS products, we ensure a comprehensive approach to each implementation.",
    bridge:
      "The plumbing. Without a standing integration layer, every model ships with bespoke glue that someone has to maintain.",
    href: `${PARENT_SITE}/services/cloud/ipaas`,
    icon: "link",
  },
  {
    id: "rpa",
    name: "Robotic Process Automation",
    kicker: "Automation",
    official:
      "Easy building, deployment, and management of software robots that finish up redundant tasks for you.",
    bridge:
      "The dividing line: rule-based work is automated here, and the work that needs judgement is where a model earns its place.",
    href: `${PARENT_SITE}/services/automation/robotic-process-automation`,
    icon: "cycle",
  },
];
