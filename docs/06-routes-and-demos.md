# 06 · Routes and demo inventory

## Routes

| Route | Production today (`main`) | This branch |
|---|---|---|
| `/` | Project Catalogue (legacy) | New home page |
| `/catalogue` | none | **Original Project Catalogue, unchanged** (legacy component) |
| `/BankingAnalytics` · `/TelecomAnalytics` · `/BankingTelecomAnalytics` | legacy | unchanged |
| `/golf-analyzer` · `/resume-summarizer` · `/jd-cv-comparison` | legacy | unchanged |
| `/users` · `/generate-report` | legacy (unlinked) | unchanged (still unlinked) |
| `/solutions` · `/services` · `/industries` · `/company` · `/careers` · `/contact` | none | new pages |
| `/demos` | none | redirects to `/solutions#products` |

Legacy backend endpoints are unchanged (`src/config/endpoints.js`). `public/sitemap.xml` lists every
original URL plus the new pages.

## Demo catalogue (38 entries, `src/content/demos.js`)

Every active entry from the production catalogue keeps its **exact link**. A unit test parses the
original source and fails if any link is missing.

### Link check, 1 October 2026 (HTTP status from this machine)

| Result | Entries |
|---|---|
| 200 OK | 34 of the 37 unique external URLs |
| 502 | Consulate SA, Consulate LA (`consulate-*.lfidemo.com`) |
| Private network | Cybersecurity LMS (`http://10.2.0.70:5003`), plus the in-app tools that call `10.2.x.x` backends |
| Same URL as another entry | Digital Twin uses the Unmanned Kiosk URL (preserved and flagged on its card) |

## Capability groups (`src/content/capabilities.js`)

These groups are used by the home index and the catalogue filter. Each one is backed only by existing demos.

| Capability | Demos |
|---|---|
| Generative AI | 9: the original catalogue's "GenAI" list |
| Conversational AI | 4: RAG Chatbot, RAG Mobile, Unmanned Kiosk, EduPilot |
| Document Intelligence | 4: TextIQ, vajraX, Resume Summarisation, JD/CV Comparison |
| Predictive Analytics | 16: the original "Machine Learning" and "Advanced Analytics" lists |
| Fraud and Risk | 6 |
| Computer Vision | 1: Golf Pose Analyzer |

Featured on home: RAG Chatbot, TextIQ, vajraX, FinSight, Credit Risk, Claims Fraud, Demand Forecasting.
