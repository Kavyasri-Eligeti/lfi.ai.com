// General AI technology topics, shown as small moons in the universe.
// These are industry technologies, NOT Linkfields products (status TECHNOLOGY).
import { STATUS } from './status';

const t = (id, name, text) => ({ id, name, text, status: STATUS.TECHNOLOGY });

export const technologies = [
  t('llm', 'Large Language Models', 'Foundation models trained on large text corpora that generate, summarise, translate and reason over language.'),
  t('rag', 'Retrieval-Augmented Generation', 'Grounds model answers in an organisation’s own documents by retrieving relevant passages at query time, reducing hallucination and keeping answers current.'),
  t('vector-db', 'Vector Databases', 'Stores embeddings for fast similarity search. This is the retrieval layer behind semantic search and RAG.'),
  t('multimodal', 'Multimodal AI', 'Models that understand and combine text, images, audio and video in one workflow.'),
  t('voice-ai', 'Voice AI', 'Speech recognition, speech synthesis and real-time voice conversation.'),
  t('ai-agents', 'AI Agents', 'Systems in which a model plans, calls tools and APIs, and completes multi-step tasks with guardrails and human oversight.'),
  t('model-evaluation', 'Model Evaluation', 'Systematic measurement of accuracy, robustness, bias and cost, using test sets, human review and automated graders.'),
  t('orchestration', 'AI Orchestration', 'Coordinating models, tools, data sources and business workflows into dependable pipelines.'),
  t('prompt-engineering', 'Prompt Engineering', 'Designing instructions, examples and context so that models behave predictably for a task.'),
  t('ai-security', 'AI Security', 'Protecting AI systems against prompt injection, data leakage, model abuse and supply-chain risk.'),
  t('mlops', 'MLOps', 'The practices and tooling that version, deploy, monitor and retrain machine-learning models in production.'),
  t('llmops', 'LLMOps', 'MLOps adapted to language models: prompt/version management, evaluation, cost and latency monitoring.'),
  t('computer-vision', 'Computer Vision', 'Extracting meaning from images and video: detection, classification, pose estimation and inspection.'),
  t('document-intelligence', 'Document Intelligence', 'OCR, layout understanding, extraction and classification that turn documents into structured data.'),
  t('predictive-analytics', 'Predictive Analytics', 'Statistical and machine-learning models that forecast outcomes such as churn, risk or demand.'),
  t('anomaly-detection', 'Anomaly Detection', 'Finding unusual patterns that may signal fraud, faults or errors.'),
  t('time-series', 'Time-Series Forecasting', 'Forecasting values over time, such as demand, load or revenue, from historical signals.'),
];

export const technologyById = Object.fromEntries(technologies.map((x) => [x.id, x]));
