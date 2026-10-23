/**
 * Corporate profile content.
 *
 * Every string and figure here is taken from the Linkfields Corporate Profile
 * 2026 deck, in the deck's own wording. Components render this data; they do
 * not carry copy of their own, so a change to the profile is a change to this
 * file and nowhere else.
 *
 * Images under /assets/img were cut from the same deck at full resolution.
 */

const IMG = "/assets/img";

/* --- the five portfolios ---------------------------------------------------
   `tone` keys into the portfolio colours in tokens.css (--pf-<tone>). The
   order is the deck's order and is the order everywhere on the site. */
export const portfolios = [
  {
    id: "digital-transformation",
    tone: "orange",
    name: "Digital Transformation",
    motto: ["Modernise", "Automate", "Transform"],
    summary:
      "Modernise applications, automate operations and connect every channel your customers use.",
    highlights: [
      "App modernisation",
      "Automation & RPA",
      "Integration services",
      "WhatsApp Business & omnichannel",
    ],
    deliver: [
      { title: "App modernisation", body: "Cloud, DevOps & microservices" },
      { title: "Automation & RPA", body: "UiPath, Blue Prism & AI workflows" },
      { title: "Integration services", body: "APIs, Boomi & enterprise integration" },
      { title: "WhatsApp Business", body: "Conversational service & commerce" },
      { title: "Omnichannel", body: "Connected journeys, every channel" },
      { title: "Quality engineering", body: "Test automation & AI code assurance" },
    ],
    ip: [
      {
        name: "testoriumz",
        logo: `${IMG}/ip/testoriumz.webp`,
        w: 708,
        h: 168,
        body: "Quality engineering platform for continuous testing: test management, low-code automation, root-cause analysis, dashboards and CI/CD integration. Replaces a fragmented tool estate with one platform.",
      },
    ],
    accelerators: ["AI Workflow Automation", "AI orchestration", "Testing CoE"],
    visual: "pipeline",
  },
  {
    id: "intelligent-enterprise-platforms",
    tone: "blue",
    name: "Intelligent Enterprise Platforms",
    motto: ["Operate", "Integrate", "Engage"],
    summary:
      "Run the core of the enterprise on connected ERP and CRM platforms, made smarter with AI.",
    highlights: [
      "ERP & SAP S/4HANA",
      "Microsoft Dynamics 365",
      "CRM & Customer 360",
      "Platform migration & AMS",
    ],
    deliver: [
      { title: "ERP & SAP S/4HANA", body: "Implementation, upgrades & migration" },
      { title: "Dynamics 365", body: "Microsoft finance, operations & CE" },
      { title: "CRM & Customer 360", body: "Salesforce & Zoho journeys" },
      { title: "Odoo & Zoho ERP", body: "Agile platforms for growing firms" },
      { title: "Customer portals", body: "Self-service & partner portals" },
      { title: "Platform AMS", body: "Managed support & optimisation" },
    ],
    ip: [
      {
        name: "linkworks",
        logo: `${IMG}/ip/linkworks.webp`,
        w: 520,
        h: 104,
        body: "Composable enterprise application platform for complex business apps where packaged ERP or CRM does not fit.",
      },
    ],
    platforms: ["sap", "oracle", "salesforce", "zoho", "odoo", "microsoft"],
    accelerators: ["SAP migration accelerators", "Regression packs", "Intelligent ops"],
    visual: "hub",
  },
  {
    id: "data-ai",
    tone: "purple",
    name: "Data & AI",
    motto: ["Understand", "Predict", "Govern"],
    summary:
      "From AI strategy to agentic AI in production: turn data into decisions, governed from day one.",
    highlights: [
      "AI strategy & governance",
      "Agentic AI & GenAI",
      "Data platforms & analytics",
      "Machine learning",
    ],
    deliver: [
      { title: "AI strategy", body: "Roadmaps, use cases & value" },
      { title: "Agentic AI", body: "Autonomous agents that act" },
      { title: "AI governance", body: "Guardrails, cost & observability" },
      { title: "GenAI & RAG", body: "Knowledge assistants on your data" },
      { title: "Data & analytics", body: "Platforms, pipelines & Power BI" },
      { title: "Machine learning", body: "Prediction, scoring & forecasting" },
    ],
    ip: [
      {
        name: "textIQ",
        logo: `${IMG}/ip/textiq.webp`,
        w: 452,
        h: 148,
        body: "Intelligent search and insight across unstructured enterprise content.",
      },
      {
        name: "FinSight",
        logo: `${IMG}/ip/finsight.webp`,
        w: 324,
        h: 156,
        body: "Conversational analysis and reporting over financial data.",
      },
      {
        name: "EduPilot",
        logo: `${IMG}/ip/edupilot.webp`,
        w: 456,
        h: 144,
        body: "Rapid course creation for education and corporate learning.",
      },
      {
        name: "InteliConvo",
        logo: `${IMG}/ip/inteliconvo.webp`,
        w: 460,
        h: 100,
        body: "AI contact centre for voice, chat and agent assist.",
      },
    ],
    accelerators: ["Predictive Analytics Suite", "Digital Twin Suite"],
    visual: "neural",
  },
  {
    id: "talent-advisory-gcc",
    tone: "yellow",
    name: "Talent Advisory & GCC",
    motto: ["Advise", "Staff", "Scale"],
    summary:
      "Strategy, specialist talent and Global Capability Centres (GCC) that scale with you.",
    highlights: [
      "Technology advisory",
      "Specialist talent & managed teams",
      "GCC strategy & setup",
      "GCC build-operate-transfer",
    ],
    deliver: [
      { title: "Technology advisory", body: "Roadmaps, architecture & assessments" },
      { title: "Specialist talent", body: "On-demand experts across verticals" },
      { title: "Managed teams", body: "Outcome-based delivery pods" },
      { title: "GCC strategy & setup", body: "Operating model & set-up advisory" },
      { title: "GCC build & operate", body: "Build-operate-transfer centres" },
      { title: "GCC scale & govern", body: "Talent, tooling & embedded IP" },
    ],
    models: [
      {
        title: "Staff augmentation",
        body: "Specialists embedded in your teams, ready to start fast",
      },
      {
        title: "Managed teams",
        body: "Outcome-based delivery pods we run end to end",
      },
      {
        title: "GCC build-operate-transfer",
        body: "We build and run your GCC, then hand it over",
      },
    ],
    scale: ["5+ data & development centres", "550+ people", "150+ consultants"],
    visual: "photo",
    photo: `${IMG}/portfolio/talent.webp`,
  },
  {
    id: "cyber-security",
    tone: "teal",
    name: "Cyber Security",
    motto: ["Protect", "Validate", "Govern"],
    summary:
      "End-to-end security, from code to AI: our own products plus specialist services.",
    highlights: [
      "Exposure validation & AppSec",
      "Security operations",
      "Cloud security & IAM",
      "AI security & GRC",
    ],
    deliver: [
      { title: "Offensive testing", body: "AI, LLM & web app testing" },
      { title: "Security operations", body: "Splunk SIEM, Qualys monitoring" },
      { title: "Incident response", body: "Rapid7: detect, triage, contain" },
      { title: "Architecture review", body: "Network, firewall & IAM" },
      { title: "Cloud security & GRC", body: "Controls, IAM & regulation" },
      { title: "Security awareness", body: "Staff education & phishing drills" },
    ],
    ip: [
      {
        name: "VajraX",
        logo: `${IMG}/ip/vajrax.webp`,
        w: 340,
        h: 112,
        body: "AI-powered exposure validation of your external attack surface.",
      },
      {
        name: "Vector X",
        body: "Code scanning and supply-chain analysis, repo to release.",
      },
      {
        name: "AI Governance",
        body: "One gateway for every AI tool: guardrails, cost & tracing (Portkey + Opik).",
      },
    ],
    accelerators: [
      "Regulatory readiness accelerator",
      "Continuous compliance evidence",
    ],
    visual: "radar",
  },
];

/* --- who we are ------------------------------------------------------------ */
export const about = {
  eyebrow: "Who we are",
  title: "One partner across your transformation",
  intro:
    "Linkfields is a technology partner across five portfolios: we modernise, run, analyse, secure and scale the enterprise, combining specialist services with our own software and reusable delivery IP. Headquartered in South Africa, delivering globally.",
  mission:
    "We help global organisations grow, adapt, scale, reinvent and transform: modernising their technology, running their core platforms, unlocking data and AI, securing what matters and scaling their teams.",
  vision:
    "To become the preferred partner for creative, customised, integrated and sustainable 360-degree solutions across technology, data, security and talent that enable businesses to thrive and expand.",
  facts: [
    { value: "18+ years", tone: "orange" },
    { value: "550+ people", tone: "yellow" },
    { value: "B-BBEE Level 1 contributor", tone: "blue" },
  ],
  photos: {
    team: { src: `${IMG}/culture/team.webp`, w: 404, h: 956, alt: "Linkfields colleagues smiling together" },
    celebration: { src: `${IMG}/culture/celebration.webp`, w: 408, h: 318, alt: "A Linkfields team celebrating with a high five" },
    city: { src: `${IMG}/culture/cape-town.webp`, w: 1072, h: 570, alt: "Cape Town, with Lion's Head behind the city" },
  },
};

/* --- culture --------------------------------------------------------------- */
export const culture = {
  eyebrow: "Our culture",
  title: "Rooted in Africa. Delivering for the world.",
  tiles: [
    { label: "People first", tone: "yellow", src: `${IMG}/culture/people-first.webp`, w: 1372, h: 1320, alt: "Three colleagues in discussion around a laptop" },
    { label: "Vibrant markets", tone: "orange", src: `${IMG}/culture/vibrant-markets.webp`, w: 1072, h: 570, alt: "A trader at a market stall piled with fresh peppers" },
    { label: "Cape Town", tone: "blue", src: `${IMG}/culture/cape-town.webp`, w: 1072, h: 570, alt: "The colourful houses of Cape Town beneath Lion's Head" },
    { label: "Craft & colour", tone: "yellow", src: `${IMG}/culture/craft-colour.webp`, w: 1028, h: 570, alt: "A woman arranging stacks of patterned African fabric" },
  ],
  hq: {
    title: "Headquartered in South Africa",
    body: "550+ people bringing African ingenuity, diverse perspectives and deep local understanding to every engagement.",
  },
};

/* --- scale ----------------------------------------------------------------- */
export const stats = [
  { to: 3, suffix: "M", label: "people touched by our platforms", tone: "yellow" },
  { to: 5, suffix: "M", label: "daily digital journeys", tone: "orange" },
  { to: 18, suffix: "+", label: "years of proven track record", tone: "blue" },
  { to: 95, suffix: "%+", label: "delivery success", tone: "yellow" },
  { to: 80, suffix: "+", label: "valued clients", tone: "orange" },
  { to: 550, suffix: "+", label: "employees", tone: "blue" },
  { to: 100, suffix: "+", label: "projects completed", tone: "yellow" },
  { to: 20, suffix: "+", label: "partner ecosystem", tone: "orange" },
  { to: 150, suffix: "+", label: "digital transformation consultants", tone: "blue" },
  { to: 100, suffix: "+", label: "ERP consultants", tone: "yellow" },
  { to: 100, suffix: "+", label: "CRM consultants", tone: "orange" },
  { to: 10, suffix: "+", label: "S/4HANA journeys", tone: "blue" },
];

/* --- where we are -----------------------------------------------------------
   Coordinates are the office cities published on linkfields.com/contact-us;
   the UK has no published office yet, so London marks the launch market.
   `hub` is the origin of every arc on both the globe and the map. */
export const locations = [
  { id: "za", label: "Johannesburg", country: "South Africa", role: "Headquarters", city: "Midrand, Johannesburg", lat: -26.0, lon: 28.1, tone: "orange", hub: true },
  { id: "in", label: "Hyderabad", country: "India", role: "Offshore delivery centre", city: "Hyderabad", lat: 17.4, lon: 78.4, tone: "yellow" },
  { id: "ae", label: "Dubai", country: "UAE", role: "Middle East", city: "Dubai", lat: 25.2, lon: 55.3, tone: "yellow" },
  { id: "uk", label: "London", country: "United Kingdom", role: "Europe", city: "Launching", lat: 51.5, lon: -0.1, tone: "blue", launching: true },
  { id: "us", label: "New York", country: "USA", role: "North America", city: "New York", lat: 40.7, lon: -74.0, tone: "yellow" },
  { id: "au", label: "Melbourne", country: "Australia", role: "Asia Pacific", city: "Melbourne", lat: -37.8, lon: 145.0, tone: "yellow" },
];

export const reach = {
  eyebrow: "Where we are",
  title: "Global reach, local delivery",
  summary: [
    { value: "5 countries + UK launching", tone: "yellow" },
    { value: "5+ data & development centres", tone: "orange" },
    { value: "HQ in South Africa", tone: "blue" },
  ],
};

/* --- industries ------------------------------------------------------------ */
export const industries = [
  {
    name: "Telecom",
    body: "Transform Telecom and Customer Experiences with Digital Innovation, Intelligent Automation and Data & AI.",
    tags: ["Digital services", "Customer engagement", "Intelligent connectivity", "Automation"],
    tone: "blue",
    src: `${IMG}/industries/telecom.webp`,
    alt: "A woman on a video call against a pink wall",
  },
  {
    name: "Banking, Financial Services & Insurance",
    body: "Reimagine Financial and Customer Services with Secure Digital Innovation, Intelligent Automation and Data & AI.",
    tags: ["Security", "Digital financial services", "Intelligent automation", "CX"],
    tone: "yellow",
    src: `${IMG}/industries/bfsi.webp`,
    alt: "A smiling professional checking her phone",
  },
  {
    name: "Healthcare & Pharma",
    body: "Transform Healthcare with Digital Innovation, AI-Driven Insights and Intelligent Automation for Better Patient Care.",
    tags: ["Patient care", "Digital health", "AI-powered insights"],
    tone: "orange",
    src: `${IMG}/industries/healthcare.webp`,
    alt: "A smiling doctor with a stethoscope",
  },
  {
    name: "Retail, FMCG & CPG",
    body: "Reimagine Retail and Consumer Experiences with Digital Innovation, AI-Driven Insights and Intelligent Automation.",
    tags: ["Customer experience", "Forecasting", "Personalisation", "Growth"],
    tone: "blue",
    src: `${IMG}/industries/retail.webp`,
    alt: "A shopkeeper smiling at her counter",
  },
  {
    name: "Manufacturing",
    body: "Accelerate Smart Manufacturing with Digital Innovation, AI-Powered Automation and Predictive Intelligence.",
    tags: ["Smart factories", "Operational excellence", "Predictive intelligence"],
    tone: "yellow",
    src: `${IMG}/industries/manufacturing.webp`,
    alt: "An engineer in a hard hat working on equipment",
  },
  {
    name: "Energy & Mining",
    body: "Transform Energy and Mining Operations with Digital Innovation, Intelligent Automation and Secure Data & AI Solutions.",
    tags: ["Asset optimisation", "Operational efficiency", "Security", "Automation"],
    tone: "orange",
    src: `${IMG}/industries/energy.webp`,
    alt: "A smiling mine worker in a white hard hat and hi-vis vest",
  },
];

/* --- clients --------------------------------------------------------------- */
const client = (file, name) => ({ name, src: `${IMG}/clients/${file}.webp` });
export const clients = [
  client("fnb", "FNB"),
  client("telkom", "Telkom"),
  client("zoom-fibre", "Zoom Fibre"),
  client("cipherwave", "CipherWave"),
  client("multichoice", "MultiChoice Africa"),
  client("tiger-brands", "Tiger Brands"),
  client("coca-cola", "Coca-Cola"),
  client("pepsico", "PepsiCo"),
  client("dp-world", "DP World"),
  client("sanlam", "Sanlam"),
  client("rma", "RMA"),
  client("assupol", "Assupol"),
  client("hsbc", "HSBC"),
  client("absa", "Absa"),
  client("sol-plaatje", "Sol Plaatje University"),
  client("client-b", "Client"),
  client("ensafrica", "ENSafrica"),
  client("client-g", "Client"),
  client("bcx", "BCX"),
  client("adapt-it", "Adapt IT"),
  client("deloitte", "Deloitte"),
  client("ibm", "IBM"),
  client("ltimindtree", "LTIMindtree"),
  client("grant-thornton", "Grant Thornton"),
  client("neom", "NEOM"),
  client("dhofar", "Dhofar Insurance"),
  client("alfanar", "Alfanar"),
];

export const clientQuote =
  "Customer success is the cornerstone of our approach. We build enduring partnerships that drive long-term growth and measurable impact.";

/* --- partners -------------------------------------------------------------- */
const partner = (file, name) => ({ id: file, name, src: `${IMG}/partners/${file}.webp` });
export const partners = [
  partner("microsoft", "Microsoft"),
  partner("azure", "Microsoft Azure"),
  partner("aws", "AWS Partner Network"),
  partner("salesforce", "Salesforce"),
  partner("sap", "SAP Partner"),
  partner("oracle", "Oracle"),
  partner("uipath", "UiPath"),
  partner("blueprism", "Blue Prism"),
  partner("boomi", "Boomi"),
  partner("odoo", "Odoo"),
  partner("zoho", "Zoho"),
  partner("hp", "HP"),
];

export const recognitionMedia = {
  bbbee: { src: `${IMG}/recognition/bbbee.webp`, w: 426, h: 424, alt: "Proudly South African, B-BBEE Level 1 proud contributor" },
  awards: {
    src: `${IMG}/recognition/awards.webp`,
    w: 1512,
    h: 340,
    alt: "Awards and recognitions: YES member, B-BBEE contributor, Great Place To Work certified, and Financial Times Africa's Fastest Growing Companies 2023",
  },
};

/* --- commercial models ------------------------------------------------------- */
export const engagement = {
  eyebrow: "How we engage",
  title: "Flexible commercial models",
  lede: "One capability architecture, flexible commercial models. Buy a project, a managed outcome, a dedicated team, or our software on its own.",
  models: [
    {
      name: "Fixed Price",
      tone: "orange",
      body: "Defined scope and outcome delivered against agreed milestones and acceptance criteria.",
      bestFor: "Well-defined projects, migrations, discrete builds",
    },
    {
      name: "Time & Materials",
      tone: "blue",
      body: "Flexible delivery where scope evolves, with transparent rates and governance.",
      bestFor: "Discovery, evolving roadmaps, co-development",
    },
    {
      name: "Managed Service",
      tone: "teal",
      body: "Ongoing service with SLAs, governance and continuous improvement built in.",
      bestFor: "Application management, managed quality, managed security",
    },
    {
      name: "Dedicated Team",
      tone: "purple",
      body: "Persistent squads or specialist teams aligned to your priorities and ways of working.",
      bestFor: "Product engineering, sustained capacity, capability centres (GCC)",
    },
    {
      name: "Outcome-Based",
      tone: "yellow",
      body: "Commercials linked to measurable business or operational outcomes, where these can be agreed and evidenced.",
      bestFor: "Assurance, exposure closure, resolution-rate engagements",
    },
  ],
  software: {
    lead: "Linkworks, testoriumz, VajraX and our AI SaaS solutions",
    rest: " are available by licence, subscription or SaaS, with or without a Linkfields services engagement.",
  },
  context: [
    "Banking & Financial Services",
    "Insurance",
    "Telecom",
    "Public Sector",
    "Retail & FMCG",
    "Mining & Manufacturing",
    "Education",
    "Hospitality",
  ],
};

/* --- why linkfields ---------------------------------------------------------- */
export const reasons = [
  {
    title: "Services depth",
    body: "Five verticals spanning modernisation, enterprise platforms, data & AI, talent & GCC and security.",
    tone: "yellow",
  },
  {
    title: "Proprietary software",
    body: "Linkworks, testoriumz, VajraX, Vector X and our AI SaaS products: proof beyond consultant capability.",
    tone: "orange",
  },
  {
    title: "Reusable accelerators",
    body: "Delivery IP that shortens time to value and turns prior engineering into repeatable outcomes.",
    tone: "blue",
  },
  {
    title: "Integrated delivery",
    body: "One partner for services, software, managed delivery, dedicated teams and capability centres.",
    tone: "yellow",
  },
];

export const reasonsTagline = [
  { text: "Five verticals", tone: "yellow" },
  { text: "Proprietary IP", tone: "orange" },
  { text: "Reusable accelerators", tone: "blue" },
  { text: "One integrated partner", tone: "white" },
];

/* --- hero ------------------------------------------------------------------ */
export const hero = {
  eyebrow: "Linkfields · exploring innovation",
  titleLead: "Integrating your business",
  titleAccent: "for a better future",
  facts: [
    { to: 18, suffix: "+", label: "Years" },
    { to: 550, suffix: "+", label: "People" },
    { to: 80, suffix: "+", label: "Clients" },
    { to: 6, suffix: "", label: "Markets" },
  ],
};

export const contactBlock = {
  title: "Let's explore innovation together",
  presence: "South Africa (HQ) · India · USA · UAE · Australia · UK (launching)",
  photo: { src: `${IMG}/contact/cape-town-beach.webp`, w: 1400, h: 1380, alt: "Table Mountain seen across the water from Bloubergstrand at dusk" },
};
