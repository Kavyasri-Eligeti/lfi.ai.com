# 06 · Preserved routes and demo inventory

## Routes

| Route | Before | Now |
|---|---|---|
| `/` | Project Catalogue (legacy Industries page) | AI Universe home |
| `/catalogue` | none | **Original Project Catalogue, unchanged** (legacy component) |
| `/BankingAnalytics` · `/TelecomAnalytics` · `/BankingTelecomAnalytics` | legacy | unchanged (legacy) |
| `/golf-analyzer` · `/resume-summarizer` · `/jd-cv-comparison` | legacy | unchanged (legacy) |
| `/users` · `/generate-report` | legacy (unlinked) | unchanged (legacy, still unlinked) |
| `/universe/:planetId` | none | Planet pages (8) |
| `/demos` · `/solutions` · `/services` · `/industries` · `/company` · `/careers` · `/contact` | none | New pages |

The legacy backend endpoints are unchanged. They are centralised in `src/config/endpoints.js` with
identical defaults and optional `REACT_APP_*` overrides.

`public/sitemap.xml` keeps every original URL and adds the new ones.

## Demo catalogue (38 entries, `src/content/demos.js`)

Every active entry from the production catalogue is preserved with its **exact link**. An automated
test parses the original source and fails if any link goes missing.

| Group | Entries |
|---|---|
| Conversational AI & document intelligence | RAG Chatbot, RAG Mobile, Unmanned Kiosk, TextIQ, vajraX, EduPilot |
| Banking | Banking Churn & Segmentation (+ churn/segment sub-demos), FinSight, Credit Risk, Banking Claims Fraud, 360 Customer Behaviour, CLV (Banking+Telecom), Sentiment Analysis |
| Telecom | Telecom Churn & Segmentation (+ sub-demos), (Banking+Telecom) Customer Analytics (+ sub-demos), NBO Revenue, NBO Data Recommendation Engine |
| Insurance | Claims Fraud & Anomaly, Signature Fraud, Network Fraud, Risk Score, Underwriting, Insurance Platform, Insurance CLV, Lapse Prediction |
| Operations & CX | Demand Forecasting & Inventory Optimisation, Energy Equipment Failure, Engage360, Smart KPI, Digital Twin (flagged: same URL as Kiosk), Digital Growth Intelligence |
| Talent & internal | Resume Summarisation*, JD/CV Comparison*, Golf Pose Analyzer*, Cybersecurity LMS*, Internal Portal |
| POCs | Consulate SA, Consulate LA |

\* *Linkfields network only*: these rely on `10.2.x.x` backends, exactly as before.

"Demand Forecasting" and "Inventory optimization" shared one URL in the original and are merged under the
lfiai.com structured-data name. Both labels remain in the classic `/catalogue` view.

## Planet → demo mapping (`src/content/universe.js`)

| Planet | Status | Demos |
|---|---|---|
| Generative AI | live | the original catalogue's "GenAI" list (TextIQ, vajraX, FinSight, Engage360, EduPilot, Digital Growth Intelligence, Internal Portal, Consulate SA/LA) |
| Conversational AI | live | RAG Chatbot, RAG Mobile, Unmanned Kiosk, EduPilot |
| Document Intelligence | live | TextIQ, vajraX, Resume Summarisation, JD/CV Comparison |
| Data Intelligence | live | 16 ML/analytics demos (original "Machine Learning" + "Advanced Analytics" lists and related analytics) |
| Fraud & Risk Intelligence | live | Insurance/Banking/Signature/Network fraud, Credit Risk, Risk Score |
| Computer Vision | live | Golf Pose Analyzer |
| AI Agents | **proposed** | none (proposed services only) |
| AI Automation | corporate | none. Links to the published Automation service, RPA and iPaaS |
