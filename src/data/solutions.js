/**
 * AI & ML capabilities.
 *
 * The six capabilities are the ones published on
 * https://www.linkfields.com/services/technology/ai-ml.
 *
 * Two fields carry text, and the difference between them is deliberate:
 *
 *   `official` - the description from that page, VERBATIM. This is the
 *                company's published statement of what the service is, and it
 *                is what the UI quotes and attributes.
 *   `blurb`    - this site's own expansion, written against the official
 *                description without adding a claim it does not make. Used
 *                where a card needs more than one sentence.
 *
 * Note on the first entry: the official page runs two sentences together with
 * no space ("foundation.We help") and writes "MI" where it means "ML". The
 * missing space is a markup artefact and has been closed; the "MI" is in the
 * published copy and has been left as published rather than silently
 * corrected on the company's behalf.
 */

export const solutions = [
  {
    id: "idea-to-product",
    title: "AI & ML Idea to Product",
    official:
      "Begin your AI and ML journey with a strong foundation. We help businesses identify and prioritise the right AI and MI use cases that can help them grow.",
    blurb:
      "Identify and prioritise the AI and machine learning use cases worth building, then take the strongest of them from a defined business case through to a working product.",
    points: ["Use-case discovery", "Prioritisation", "Build and hand-over"],
    icon: "spark",
  },
  {
    id: "platform-services",
    title: "AI & ML Platform Services",
    official:
      "Simplified deployment and operationalization of AI and ML models in production provide great returns on investment.",
    blurb:
      "Deploy and operate models in production without rebuilding the plumbing each time - the pipelines, serving and monitoring that keep a model useful after launch.",
    points: ["Model deployment", "Pipelines", "Monitoring"],
    icon: "stack",
  },
  {
    id: "explainable-ai",
    title: "Explainable AI",
    official:
      "We ensure that your AI-driven decisions are accurate and consistent with reasoning and rationale behind them.",
    blurb:
      "Make automated decisions inspectable, so that the reasoning behind an outcome can be shown to a risk team, an auditor or a regulator - not just the outcome itself.",
    points: ["Decision traceability", "Model reasoning", "Audit support"],
    icon: "lens",
  },
  {
    id: "document-analytics",
    title: "Intelligent Document Analytics",
    official:
      "Detect hidden customer insights in your unstructured text documents to transform them into productive assets at scale.",
    blurb:
      "Turn unstructured text - contracts, claims, correspondence, policy documents - into structured, queryable data that the rest of the business can actually use.",
    points: ["Extraction", "Classification", "Summarisation"],
    icon: "doc",
  },
  {
    id: "enterprise-search",
    title: "Intelligent Enterprise Search",
    official:
      "Through natural learning, machine learning, and semantic research, we facilitate real-time access to crucial data and open up rich enterprise data resources.",
    blurb:
      "Natural language processing and semantic search applied across internal data, so people find the answer itself rather than a list of systems that might contain it.",
    points: ["Semantic search", "NLP", "Real-time access"],
    icon: "search",
  },
  {
    id: "conversational",
    title: "Conversational Platforms",
    official:
      "We are capable of deploying highly intelligent chatbots for type and vocal interactions. These capture the true intent of the customer through context and non verbal cues.",
    blurb:
      "Text and voice assistants that read intent from context, grounded in your own documents and processes rather than in generic web knowledge.",
    points: ["Chat and voice", "Intent capture", "Grounded answers"],
    icon: "chat",
  },
];

/**
 * "Smart analysis for quicker insights".
 *
 * The official AI & ML page describes this as one continuous sentence rather
 * than as numbered steps (see `official.aiProcess` in company.js, which the
 * UI quotes in full). These four are that sentence broken into its stages, in
 * its order, with the titles as short labels - no stage has been added and
 * none has been reordered.
 */
export const analysisSteps = [
  {
    n: "01",
    title: "Define the business objective",
    body: "Start from the commercial outcome, not the model. What decision changes, and what is it worth when it does?",
  },
  {
    n: "02",
    title: "Build the data foundation",
    body: "Create a platform that collects and organises the data the objective depends on, from the systems that already hold it.",
  },
  {
    n: "03",
    title: "Analyse thoroughly",
    body: "Work the data properly - structure, quality and signal - so that the insight that comes out of it survives contact with the business.",
  },
  {
    n: "04",
    title: "Apply it to strategy",
    body: "Put the insight where decisions are made, and keep it there, so the result is a changed operation rather than a finished report.",
  },
];

/**
 * The four principles under "How we work" on
 * https://www.linkfields.com/company/our-approach - the official headings,
 * verbatim. (The source hyphenates "human- centered" with a stray space; that
 * is a line-break artefact in its markup, not the wording, so it is closed
 * here.)
 */
export const approachPrinciples = [
  "Define the real challenge",
  "Move fast, and stay flexible",
  "Apply a human-centered lens",
  "Put relationships first",
];

/**
 * The exploration stages from the same page, under "A recipe for success".
 *
 * The official page publishes these as four unnamed, unnumbered paragraphs.
 * `official` is each paragraph verbatim and is what the UI renders; `label`
 * and `title` are this site's short names for them, added so the stages can
 * be navigated and referred to. They are in the published order and nothing
 * is added to or removed from the list.
 *
 * These used to carry a `body` as well - a restatement of the same paragraph
 * in this site's voice. Rendering both printed each stage twice in slightly
 * different words, so the paraphrase is gone and the published text is the
 * text.
 */
export const processStages = [
  {
    n: "01",
    label: "Explore",
    title: "Scope the real challenge",
    official:
      "We explore the scope of challenges that are being faced by employees or customers. We also determine which assets, platforms or services will accelerate outcomes and establish the most commercially viable solution",
  },
  {
    n: "02",
    label: "Hypothesise",
    title: "Agree what to prove first",
    official:
      "After discussion and deliberation, we agree on the hypothesis and determine what we need to prove first. Through our partners, we explore ways to maximise impact and boost change, finally drafting an initial project roadmap",
  },
  {
    n: "03",
    label: "Evolve",
    title: "Check the proof points",
    official:
      "Evolution helps us determine if any additional proof points are generating expected returns and make adjustments if necessary. We also determine if any additional proof points are required and decide which services are needed to support scale.",
  },
  {
    n: "04",
    label: "Scale",
    title: "Scale and embed",
    official:
      "We explore ways to scale and drive a sustainable cultural change and identify what the delivery model requirements are. This helps us understand how to accelerate additional values.",
  },
];
