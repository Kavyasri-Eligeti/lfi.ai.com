/**
 * The LFI AI demo catalogue.
 *
 * Names and descriptions come from the existing lfiai.com catalogue and its
 * structured data - they describe work that already exists. Every external
 * `href` in this file returned HTTP 200 when the catalogue was last verified
 * (see VERIFIED_ON). Nothing here is aspirational: a demo that is not
 * reachable carries `status: "offline"` and the UI routes the visitor to an
 * enquiry instead of a dead link.
 *
 * `access` values:
 *   "public"   - reachable from anywhere.
 *   "internal" - served from the corporate network (10.2.0.x); it will not
 *                load for an outside visitor, and the UI says so rather than
 *                letting the page hang on a request that cannot complete.
 */

export const VERIFIED_ON = "2026-10-20";

export const INDUSTRIES = {
  banking: "Banking",
  telecom: "Telecom",
  insurance: "Insurance",
  retail: "Retail",
  manufacturing: "Manufacturing",
  energy: "Energy",
  education: "Education",
  publicSector: "Public sector",
  crossIndustry: "Cross-industry",
};

export const TECH = {
  genai: "Generative AI",
  ml: "Machine learning",
  cv: "Computer vision",
  analytics: "Advanced analytics",
  nlp: "NLP",
};

/**
 * The named products.
 *
 * This array is the single source of truth for the product portfolio. It is
 * reconciled against `src/Pages/Industries.js`, which is the catalogue page
 * recovered verbatim from the deployed lfiai.com build and therefore the
 * authoritative record of what shipped. That file declares the product set
 * explicitly:
 *
 *   const generalProductApps =
 *     ["FinSight", "Engage360", "EduPilot", "TextIQ", "vajraX",
 *      "InternalPortal", "SEO"];
 *
 * and, separately, the proofs of concept:
 *
 *   const generalPocApps = ["ConsulateSA", "ConsulateLA"];
 *
 * Two entries from that product list are deliberately NOT reproduced here,
 * and the reasons are recorded so the omissions are decisions rather than
 * oversights:
 *
 *   - "InternalPortal" (https://internal.lfidemo.com/) is reachable, but it
 *     serves a page titled "LinkFields - Internal Portal". It is a staff
 *     tool, not something a prospective customer buys, and listing it in a
 *     public product catalogue would misrepresent it.
 *   - "ConsulateSA"/"ConsulateLA" are tagged as PoCs by the source itself,
 *     and both currently return HTTP 502.
 *
 * `href: null` means there is no public build. The UI must route those to an
 * enquiry rather than invent a URL - see components/sections/Products.js.
 */
export const products = [
  {
    id: "vajrax",
    name: "vajraX",
    kicker: "AI platform",
    blurb:
      "The platform layer behind enterprise document and data workflows - where a model stops being a prototype and becomes something a department runs on.",
    href: "https://vajrax.lfidemo.com/",
    image: "/images/vajraX.png",
    tech: ["genai", "nlp"],
    industries: ["crossIndustry"],
    access: "public",
    status: "live",
  },
  {
    id: "textiq",
    name: "TextIQ",
    kicker: "Document intelligence",
    blurb:
      "Extraction, classification and summarisation over unstructured documents, turning filed paperwork into fields a system can query.",
    href: "https://textiq.lfidemo.com/",
    image: "/images/textIQ_transparent.png",
    tech: ["nlp", "genai"],
    industries: ["crossIndustry", "insurance", "banking"],
    access: "public",
    status: "live",
  },
  {
    id: "finsight",
    name: "FinSight",
    kicker: "Banking analytics",
    blurb:
      "Financial insight and reporting analytics over banking data, built for the people who have to explain the number as well as produce it.",
    href: "https://finsight.lfidemo.com/",
    image: "/images/Finsight_transparent.png",
    tech: ["analytics", "ml"],
    industries: ["banking"],
    access: "public",
    status: "live",
  },
  {
    id: "engage360",
    name: "Engage360",
    kicker: "Customer engagement",
    blurb:
      "Cross-channel customer engagement analytics - what happened across every touchpoint, assembled into one view of the relationship.",
    href: "https://engage360.lfidemo.com/",
    image: "/images/Engage360.png",
    tech: ["analytics", "ml"],
    industries: ["crossIndustry", "retail", "telecom"],
    access: "public",
    status: "live",
  },
  {
    id: "edupilot",
    name: "EduPilot",
    kicker: "Education AI",
    blurb:
      "An AI assistant for education workflows and learner support, grounded in an institution's own material.",
    href: "https://edupilot.lfiai.com/",
    image: "/images/EduPilot_transparent.png",
    tech: ["genai", "nlp"],
    industries: ["education"],
    access: "public",
    status: "live",
  },
  {
    /* Listed as "SEO" in the deployed build's `generalProductApps`, and named
       "Digital Growth Intelligence" in the no-JS fallback of public/index.html:
         <a href="https://seo.lfidemo.com/">Digital Growth Intelligence</a>
         - search and digital growth analytics.
       It was present in this file only as a demo row, never as a product,
       which is why it was missing from the portfolio on the homepage. */
    id: "seo",
    name: "Digital Growth Intelligence",
    kicker: "Growth analytics",
    blurb:
      "Search and digital growth analytics for marketing teams, built on the same analytics practice as the rest of the catalogue.",
    href: "https://seo.lfidemo.com/",
    // No wordmark asset ships for this one. The product window is drawn
    // instead - see ui/ProductMockup - and Products.js omits the overlay.
    image: null,
    tech: ["analytics", "nlp"],
    industries: ["crossIndustry"],
    access: "public",
    status: "live",
  },
  {
    /* SiteSense ships a wordmark in the same family as the other products
       (public/images/SiteSense_transparent.png) and is declared in the
       deployed catalogue - but commented out there, pointing at
       http://10.2.3.61:8080/, a corporate-network address.

       Its EXISTENCE is verified. Nothing about what it does is: there is no
       description of it in this repository, in the deployed build, in the
       page metadata, or on linkfields.com. So this entry says only what can
       be supported and sends the reader to a person. Writing a plausible
       capability list for it would be inventing a product. */
    id: "sitesense",
    name: "SiteSense",
    kicker: "Portfolio build",
    blurb:
      "A named build in the Linkfields portfolio, served from the corporate network. There is no public demonstration and no published capability list, so this page does not describe one.",
    href: null,
    image: "/images/SiteSense_transparent.png",
    tech: [],
    industries: [],
    access: "internal",
    status: "live",
    // Name and artwork confirmed; capabilities and positioning are not.
    detailsVerified: false,
  },
];

/** The full catalogue of working demonstrations. */
export const demos = [
  // --- conversational AI & document intelligence ---------------------------
  {
    id: "rag",
    name: "RAG Chatbot",
    blurb:
      "Retrieval-augmented answers grounded in your own documents, with the source the answer came from.",
    href: "https://rag.lfiai.com/",
    tech: ["genai", "nlp"],
    industries: ["crossIndustry"],
    access: "public",
    status: "live",
  },
  {
    id: "rag-mobile",
    name: "RAG Chatbot - mobile",
    blurb: "The same grounded assistant, built for a phone.",
    href: "https://ragmobile.lfiai.com/",
    tech: ["genai", "nlp"],
    industries: ["crossIndustry"],
    access: "public",
    status: "live",
  },
  {
    id: "kiosk",
    name: "Unmanned Kiosk",
    blurb:
      "A self-service AI kiosk for unattended customer interactions, from greeting through to resolution.",
    href: "https://uks.lfiai.com/",
    tech: ["genai", "cv"],
    industries: ["retail", "publicSector", "banking"],
    access: "public",
    status: "live",
  },
  {
    id: "textiq-demo",
    name: "TextIQ",
    blurb: "Document extraction, classification and summarisation.",
    href: "https://textiq.lfidemo.com/",
    tech: ["nlp", "genai"],
    industries: ["crossIndustry", "insurance"],
    access: "public",
    status: "live",
    productId: "textiq",
  },
  {
    id: "vajrax-demo",
    name: "vajraX",
    blurb: "Enterprise document and data workflow platform.",
    href: "https://vajrax.lfidemo.com/",
    tech: ["genai", "nlp"],
    industries: ["crossIndustry"],
    access: "public",
    status: "live",
    productId: "vajrax",
  },
  {
    id: "edupilot-demo",
    name: "EduPilot",
    blurb: "AI assistant for education workflows.",
    href: "https://edupilot.lfiai.com/",
    tech: ["genai"],
    industries: ["education"],
    access: "public",
    status: "live",
    productId: "edupilot",
  },
  {
    id: "seo",
    name: "Digital Growth Intelligence",
    blurb: "Search and digital growth analytics for marketing teams.",
    href: "https://seo.lfidemo.com/",
    tech: ["analytics", "nlp"],
    industries: ["crossIndustry"],
    access: "public",
    status: "live",
    productId: "seo",
  },

  // --- banking --------------------------------------------------------------
  {
    id: "finsight-demo",
    name: "FinSight",
    blurb: "Financial insight and reporting analytics.",
    href: "https://finsight.lfidemo.com/",
    tech: ["analytics"],
    industries: ["banking"],
    access: "public",
    status: "live",
    productId: "finsight",
  },
  {
    id: "banking-churn",
    name: "Banking churn & segmentation",
    blurb:
      "Who is about to leave, which segment they sit in, and what that is worth.",
    href: "/BankingAnalytics",
    internalRoute: true,
    tech: ["ml", "analytics"],
    industries: ["banking"],
    access: "public",
    status: "live",
  },
  {
    id: "credit-risk",
    name: "Credit Risk Analytics",
    blurb: "Credit risk scoring and portfolio risk analytics for lenders.",
    href: "https://creditrisk.lfidemo.com/",
    tech: ["ml", "analytics"],
    industries: ["banking"],
    access: "public",
    status: "live",
  },
  {
    id: "banking-fraud",
    name: "Banking Claims Fraud Detection",
    blurb: "Flagging claims that do not behave like the rest of the book.",
    href: "https://bankingclaimsfraud.lfidemo.com/",
    tech: ["ml"],
    industries: ["banking"],
    access: "public",
    status: "live",
  },
  {
    id: "signature-fraud",
    name: "Signature Fraud Detection",
    blurb: "Computer vision applied to signature verification.",
    href: "https://signaturefrauddetect.lfidemo.com/",
    tech: ["cv", "ml"],
    industries: ["banking", "insurance"],
    access: "public",
    status: "live",
  },
  {
    id: "network-fraud",
    name: "Network Fraud Detection",
    blurb:
      "Fraud found in the shape of the network rather than the single transaction.",
    href: "https://networkfrauddetect.lfidemo.com/",
    tech: ["ml", "analytics"],
    industries: ["banking", "telecom"],
    access: "public",
    status: "live",
  },
  {
    id: "banking-sentiment",
    name: "Sentiment Analysis",
    blurb: "What customers are actually saying, at the scale they say it.",
    href: "https://bankingsentimentanalysis.lfidemo.com/",
    tech: ["nlp"],
    industries: ["banking"],
    access: "public",
    status: "live",
  },

  // --- telecom --------------------------------------------------------------
  {
    id: "telecom-churn",
    name: "Telecom churn & segmentation",
    blurb: "Churn and segmentation modelling on a telecom subscriber base.",
    href: "/TelecomAnalytics",
    internalRoute: true,
    tech: ["ml", "analytics"],
    industries: ["telecom"],
    access: "public",
    status: "live",
  },
  {
    id: "banking-telecom",
    name: "Banking + Telecom customer analytics",
    blurb: "One customer view across two industries' data.",
    href: "/BankingTelecomAnalytics",
    internalRoute: true,
    tech: ["analytics", "ml"],
    industries: ["banking", "telecom"],
    access: "public",
    status: "live",
  },
  {
    id: "nbo",
    name: "Next Best Offer revenue analytics",
    blurb: "Which offer to make next, ranked by expected revenue.",
    href: "https://bankingtelcorevenuenbo.lfidemo.com/",
    tech: ["ml", "analytics"],
    industries: ["banking", "telecom"],
    access: "public",
    status: "live",
  },
  {
    id: "nbo-data",
    name: "NBO Data Recommendation Engine",
    blurb: "Data-bundle recommendations for telecom subscribers.",
    href: "https://telecomnbodataaddon.lfidemo.com/",
    tech: ["ml"],
    industries: ["telecom"],
    access: "public",
    status: "live",
  },
  {
    id: "clv-bank-telco",
    name: "Customer Lifetime Value (Banking + Telecom)",
    blurb: "What a relationship is worth over its life, not this quarter.",
    href: "https://clvbankingtelecom.lfidemo.com/",
    tech: ["analytics", "ml"],
    industries: ["banking", "telecom"],
    access: "public",
    status: "live",
  },
  {
    id: "kpi",
    name: "Smart KPI Monitoring",
    blurb: "KPI monitoring that notices the move before the monthly pack does.",
    href: "https://kpi.lfidemo.com/",
    tech: ["analytics"],
    industries: ["telecom", "crossIndustry"],
    access: "public",
    status: "live",
  },

  // --- insurance ------------------------------------------------------------
  {
    id: "claims-fraud",
    name: "Claims Fraud & Anomaly Detection",
    blurb: "Detects fraudulent and anomalous insurance claims.",
    href: "https://insurancefraud.lfidemo.com/",
    tech: ["ml"],
    industries: ["insurance"],
    access: "public",
    status: "live",
  },
  {
    id: "underwriting",
    name: "Underwriting optimisation & pricing segmentation",
    blurb: "Pricing segmentation and underwriting decisions on the same data.",
    href: "https://underwriting.lfidemo.com/",
    tech: ["ml", "analytics"],
    industries: ["insurance"],
    access: "public",
    status: "live",
  },
  {
    id: "insurance-platform",
    name: "Insurance analytics platform",
    blurb: "Claims, customer lifetime value and underwriting in one place.",
    href: "https://insuranceplatform.lfidemo.com/",
    tech: ["analytics", "ml"],
    industries: ["insurance"],
    access: "public",
    status: "live",
  },
  {
    id: "clv-insurance",
    name: "Insurance Customer Lifetime Value",
    blurb: "Lifetime value modelling across a policy book.",
    href: "https://clvinsurance.lfidemo.com/",
    tech: ["analytics"],
    industries: ["insurance"],
    access: "public",
    status: "live",
  },
  {
    id: "lapse",
    name: "Lapse Prediction & Retention Analytics",
    blurb: "Which policies are about to lapse, and which are worth saving.",
    href: "https://insurancelapseprediction.lfidemo.com/",
    tech: ["ml"],
    industries: ["insurance"],
    access: "public",
    status: "live",
  },
  {
    id: "risk-score",
    name: "Risk Score Prediction",
    blurb: "Risk scoring across an insurance portfolio.",
    href: "https://insuranceriskscore.lfidemo.com/",
    tech: ["ml"],
    industries: ["insurance"],
    access: "public",
    status: "live",
  },

  // --- operations, forecasting, customer experience -------------------------
  {
    id: "forecasting",
    name: "Demand Forecasting & Inventory Optimisation",
    blurb: "Time-series demand forecasting feeding inventory decisions.",
    href: "https://forecasting.lfidemo.com/",
    tech: ["ml", "analytics"],
    industries: ["retail", "manufacturing"],
    access: "public",
    status: "live",
  },
  {
    id: "equipment",
    name: "Equipment Failure & Predictive Maintenance",
    blurb: "Predicting equipment failure before it takes the line down.",
    href: "https://equipment.lfidemo.com/",
    tech: ["ml"],
    industries: ["energy", "manufacturing"],
    access: "public",
    status: "live",
  },
  {
    id: "customer-360",
    name: "360 Customer Behaviour Analytics",
    blurb:
      "Behavioural analytics assembled across every channel a customer uses.",
    href: "https://customeranalytics.lfidemo.com/",
    tech: ["analytics"],
    industries: ["crossIndustry", "retail"],
    access: "public",
    status: "live",
  },
  {
    id: "engage360-demo",
    name: "Engage360",
    blurb: "Cross-channel customer engagement.",
    href: "https://engage360.lfidemo.com/",
    tech: ["analytics"],
    industries: ["crossIndustry", "retail"],
    access: "public",
    status: "live",
    productId: "engage360",
  },

  // --- internal-network demos ----------------------------------------------
  // Real, in the repository, and kept working - but they call services on the
  // corporate network. Labelled honestly rather than linked as if public.
  {
    id: "resume",
    name: "Resume Summarisation",
    blurb: "Summarises a CV into the facts a hiring manager screens on.",
    href: "/resume-summarizer",
    internalRoute: true,
    tech: ["genai", "nlp"],
    industries: ["crossIndustry"],
    access: "internal",
    status: "live",
  },
  {
    id: "jd-cv",
    name: "JD & CV Comparison",
    blurb: "Scores a CV against a job description and shows where the gaps are.",
    href: "/jd-cv-comparison",
    internalRoute: true,
    tech: ["genai", "nlp"],
    industries: ["crossIndustry"],
    access: "internal",
    status: "live",
  },
  {
    id: "golf",
    name: "Golf Pose Analyzer",
    blurb: "Computer-vision movement analysis from video of a swing.",
    href: "/golf-analyzer",
    internalRoute: true,
    tech: ["cv"],
    industries: ["crossIndustry"],
    access: "internal",
    status: "live",
  },
  {
    /* Live (not commented out) in the deployed catalogue at
       http://10.2.0.70:5003 - a corporate-network address, so it is listed
       with the same honesty as the internal routes above rather than linked.
       It was absent from this file entirely. */
    id: "cyber-lms",
    name: "Cybersecurity LMS",
    blurb:
      "A learning-management build for cybersecurity training, served from the corporate network.",
    href: null,
    tech: [],
    industries: ["crossIndustry"],
    access: "internal",
    status: "live",
  },
  {
    /* Carries its own artwork and its own entry in the deployed catalogue.
       No public build exists, so it is listed, not linked. */
    id: "sitesense-demo",
    name: "SiteSense",
    blurb:
      "A named portfolio build served from the corporate network. Capabilities are not published.",
    href: null,
    tech: [],
    industries: [],
    access: "internal",
    status: "live",
    productId: "sitesense",
  },
];

export const publicDemos = demos.filter((d) => d.access === "public");
export const internalDemos = demos.filter((d) => d.access === "internal");
