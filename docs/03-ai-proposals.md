# 03 · Proposed AI solutions and services (awaiting business approval)

Source: `src/content/proposals.js`. **Nothing here is a current Linkfields offering.** The site renders
every item with a *Proposed* badge, a dashed card border and an explicit disclaimer.

- **Demo-backed** = an existing Linkfields demo demonstrates the underlying capability. This is evidence
  for the business case, not an offering.
- **Proposed** = no Linkfields evidence yet.

## Proposed AI solutions (14)

| Solution | Status | Evidence (existing demos) |
|---|---|---|
| Enterprise Generative AI | demo-backed | TextIQ, EduPilot |
| AI Agent Platforms | proposed | |
| Conversational AI | demo-backed | RAG Chatbot, RAG Mobile, Unmanned Kiosk |
| Intelligent Document Processing | demo-backed | TextIQ, vajraX, Resume Summarisation |
| Enterprise RAG | demo-backed | RAG Chatbot |
| AI-Powered Knowledge Search | proposed | |
| Multimodal AI | demo-backed | Golf Pose Analyzer |
| Predictive Analytics | demo-backed | Churn/segmentation, Demand Forecasting, Credit Risk |
| AI-Assisted Business Automation | proposed | (builds on the published RPA service) |
| AI Voice Agents | proposed | |
| AI-Powered Customer Support | demo-backed | RAG Chatbot |
| Enterprise AI Search | proposed | |
| AI Security and Governance | proposed | |
| AI-Powered Decision Intelligence | demo-backed | Smart KPI Monitoring, NBO Data Recommendation Engine |

## Proposed AI services (17)

| Service | Status | Evidence |
|---|---|---|
| Generative AI Engineering | demo-backed | TextIQ, EduPilot |
| Enterprise RAG Development | demo-backed | RAG Chatbot, RAG Mobile |
| AI Agent Development | proposed | |
| AI Voice Agent Development | proposed | |
| LLM Integration | demo-backed | TextIQ |
| Prompt Engineering | proposed | |
| LLM Evaluation and Optimisation | proposed | |
| AI Workflow Orchestration | proposed | |
| AI Model Deployment | proposed | |
| MLOps and LLMOps | proposed | |
| AI Security | proposed | |
| AI DevSecOps | proposed | |
| AI Infrastructure Engineering | proposed | |
| Vector Database Integration | demo-backed | RAG Chatbot |
| AI API and Microservices Development | demo-backed | Resume Summarisation, JD/CV Comparison (API-backed tools) |
| AI Observability | proposed | |
| Responsible AI and Governance | proposed | |

## Already verified (existing corporate services, not proposals)
**AI & Machine Learning** and **Big Data Engineering** (Technology service), and **Robotic Process
Automation** (Automation service).

## Approval workflow
To approve an item, move it from `proposals.js` into `services.js` / `solutions.js` with
`status: STATUS.CORPORATE` once it is published on linkfields.com. The integrity test
(`src/__tests__/content.integrity.test.js`) fails if a proposal is marked as an existing offering.
