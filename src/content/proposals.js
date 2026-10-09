// PROPOSED AI solutions and services. All items here await business approval.
// They are rendered with a "Proposed" badge and must never be presented as
// current offerings. `evidence` lists existing demos that show the underlying
// capability (status DEMO_SUPPORTED). Items with no evidence are plain PROPOSED.
import { STATUS } from './status';

const p = (id, name, summary, capabilities, evidence = []) => ({
  id,
  name,
  summary,
  capabilities,
  evidence,
  status: evidence.length ? STATUS.DEMO_SUPPORTED : STATUS.PROPOSED,
});

export const proposedSolutions = [
  p('enterprise-genai', 'Enterprise Generative AI',
    'Secure, governed generative AI for drafting, summarising and analysing content inside enterprise systems.',
    ['Private model deployment', 'Data access controls', 'Usage and cost governance'],
    ['textiq', 'edupilot']),
  p('agent-platforms', 'AI Agent Platforms',
    'Agents that plan and carry out multi-step business tasks through approved tools and APIs, with human approval gates.',
    ['Tool/API integration', 'Guardrails and approvals', 'Audit trails']),
  p('conversational-ai', 'Conversational AI',
    'Assistants for customers and employees across web, mobile and kiosk channels.',
    ['Intent and dialogue design', 'Channel integration', 'Hand-off to humans'],
    ['rag-chatbot', 'rag-mobile', 'unmanned-kiosk']),
  p('idp', 'Intelligent Document Processing',
    'Automated extraction, classification and validation of data from documents such as forms, claims and CVs.',
    ['OCR and layout analysis', 'Field extraction', 'Straight-through processing'],
    ['textiq', 'vajrax', 'resume-summarizer']),
  p('enterprise-rag', 'Enterprise RAG',
    'Question answering grounded in company documents, with source citations and permission-aware retrieval.',
    ['Ingestion and chunking', 'Vector search', 'Citation and evaluation'],
    ['rag-chatbot']),
  p('knowledge-search', 'AI-Powered Knowledge Search',
    'Semantic search across intranets, document stores and ticketing systems.',
    ['Hybrid keyword + vector search', 'Connectors', 'Relevance tuning']),
  p('multimodal', 'Multimodal AI',
    'Solutions that combine text, images, audio and video, such as visual inspection with natural-language reporting.',
    ['Image and video understanding', 'Cross-modal search'],
    ['golf-analyzer']),
  p('predictive-analytics', 'Predictive Analytics',
    'Forecasting and propensity models for churn, risk, demand and lifetime value.',
    ['Feature engineering', 'Model training', 'Monitoring and retraining'],
    ['banking-analytics', 'telecom-analytics', 'demand-forecasting', 'credit-risk']),
  p('ai-automation', 'AI-Assisted Business Automation',
    'Extending RPA with language and vision models so that bots can handle unstructured inputs and exceptions.',
    ['RPA + LLM integration', 'Exception triage', 'Human-in-the-loop review']),
  p('voice-agents', 'AI Voice Agents',
    'Natural voice assistants for contact centres and self-service lines.',
    ['Speech-to-text / text-to-speech', 'Real-time dialogue', 'Telephony integration']),
  p('customer-support', 'AI-Powered Customer Support',
    'Agent assist, auto-triage and self-service answers that reduce resolution time.',
    ['Ticket classification', 'Suggested replies', 'Knowledge grounding'],
    ['rag-chatbot']),
  p('enterprise-search', 'Enterprise AI Search',
    'A single search experience across enterprise data, with access control and answer generation.',
    ['Unified index', 'Access-control trimming', 'Generated answers']),
  p('security-governance', 'AI Security and Governance',
    'Policies, controls and monitoring for responsible, compliant AI use.',
    ['Risk assessment', 'Prompt-injection defence', 'Model and data governance']),
  p('decision-intelligence', 'AI-Powered Decision Intelligence',
    'Combining predictions, business rules and scenario simulation to support decisions.',
    ['Scenario modelling', 'KPI monitoring', 'Recommendation engines'],
    ['smart-kpi', 'nbo-data-engine']),
];

export const proposedServices = [
  p('genai-engineering', 'Generative AI Engineering', 'Design and build of production generative AI applications.', ['Architecture', 'Model selection', 'Application build'], ['textiq', 'edupilot']),
  p('rag-development', 'Enterprise RAG Development', 'Building retrieval-augmented assistants over company knowledge.', ['Ingestion pipelines', 'Retrieval tuning', 'Evaluation'], ['rag-chatbot', 'rag-mobile']),
  p('agent-development', 'AI Agent Development', 'Building tool-using agents with guardrails.', ['Tool design', 'Planning loops', 'Safety controls']),
  p('voice-agent-development', 'AI Voice Agent Development', 'Voice assistants for service channels.', ['Speech pipeline', 'Dialogue design', 'Telephony']),
  p('llm-integration', 'LLM Integration', 'Integrating language models into existing applications and workflows.', ['API integration', 'Data connectors', 'Access control'], ['textiq']),
  p('prompt-engineering', 'Prompt Engineering', 'Designing and testing prompts and context strategies.', ['Prompt design', 'Few-shot examples', 'Regression tests']),
  p('llm-evaluation', 'LLM Evaluation and Optimisation', 'Measuring and improving quality, latency and cost.', ['Eval suites', 'A/B testing', 'Cost optimisation']),
  p('workflow-orchestration', 'AI Workflow Orchestration', 'Coordinating models, tools and business systems end to end.', ['Pipeline design', 'Retries and fallbacks', 'Monitoring']),
  p('model-deployment', 'AI Model Deployment', 'Packaging and serving models reliably.', ['Containerisation', 'Scaling', 'Rollback']),
  p('mlops-llmops', 'MLOps and LLMOps', 'Lifecycle management for ML and LLM systems.', ['CI/CD for models', 'Drift monitoring', 'Versioning']),
  p('ai-security', 'AI Security', 'Security assessment and hardening of AI systems.', ['Threat modelling', 'Red-teaming', 'Data-leak prevention']),
  p('ai-devsecops', 'AI DevSecOps', 'Security built into the AI delivery pipeline.', ['Supply-chain scanning', 'Policy as code', 'Secrets management']),
  p('ai-infrastructure', 'AI Infrastructure Engineering', 'GPU, storage and network foundations for AI workloads.', ['Capacity planning', 'Cluster setup', 'Cost control']),
  p('vector-db-integration', 'Vector Database Integration', 'Selecting and integrating vector stores for semantic retrieval.', ['Schema and indexing', 'Hybrid search', 'Performance tuning'], ['rag-chatbot']),
  p('ai-api-microservices', 'AI API and Microservices Development', 'Exposing AI capabilities as secure, reusable services.', ['API design', 'Authentication', 'Rate limiting'], ['resume-summarizer', 'jd-cv-comparison']),
  p('ai-observability', 'AI Observability', 'Tracing, logging and quality monitoring for AI in production.', ['Tracing', 'Quality dashboards', 'Alerting']),
  p('responsible-ai', 'Responsible AI and Governance', 'Frameworks for fair, transparent and compliant AI.', ['Policy frameworks', 'Bias assessment', 'Documentation']),
];

// Existing, verified corporate capabilities related to AI (from linkfields.com
// services). They are listed alongside the proposals so the difference is explicit.
export const verifiedAiCapabilities = [
  { name: 'AI & Machine Learning', serviceId: 'technology', status: STATUS.CORPORATE },
  { name: 'Big Data Engineering', serviceId: 'technology', status: STATUS.CORPORATE },
  { name: 'Robotic Process Automation', serviceId: 'automation', status: STATUS.CORPORATE },
];
