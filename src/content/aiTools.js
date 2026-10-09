// The AI constellation on the homepage: trending AI platforms Linkfields builds
// with, and the AI security tools it deploys to keep them safe (2026).
// Each card shows the tool's official logo, unmodified (public/logos, see
// SOURCES.txt). Listing a tool implies no partnership or endorsement.
//   kind  'ai' | 'security'
//   tag   what the tool is, shown on its card
//   logo  file in public/logos

const t = (name, vendor, tag, kind, logo) => ({
  id: `${kind}-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
  name,
  vendor,
  tag,
  kind,
  logo: `${process.env.PUBLIC_URL || ''}/logos/${logo}.svg`,
});

export const aiTools = [
  t('Claude', 'Anthropic', 'Frontier model', 'ai', 'claude'),
  t('ChatGPT', 'OpenAI', 'Frontier model', 'ai', 'openai'),
  t('Gemini', 'Google', 'Multimodal model', 'ai', 'googlegemini'),
  t('Microsoft Copilot', 'Microsoft', 'Enterprise copilot', 'ai', 'copilot'),
  t('Llama', 'Meta', 'Open model', 'ai', 'meta'),
  t('Mistral', 'Mistral AI', 'Open model', 'ai', 'mistralai'),
  t('Amazon Bedrock', 'AWS', 'Model platform', 'ai', 'aws'),
  t('Azure AI Foundry', 'Microsoft', 'Model platform', 'ai', 'azure'),
  t('Vertex AI', 'Google Cloud', 'Model platform', 'ai', 'googlecloud'),
  t('Hugging Face', 'Hugging Face', 'Model hub', 'ai', 'huggingface'),
  t('LangGraph', 'LangChain', 'Agent framework', 'ai', 'langgraph'),
  t('Model Context Protocol', 'Open standard', 'Agent tools', 'ai', 'modelcontextprotocol'),
];

export const aiSecurityTools = [
  t('Bedrock Guardrails', 'AWS', 'Guardrails', 'security', 'aws'),
  t('Prompt Shields', 'Azure AI Content Safety', 'Injection defence', 'security', 'azure'),
  t('NeMo Guardrails', 'NVIDIA', 'Guardrails', 'security', 'nvidia'),
  t('Llama Guard', 'Meta', 'Safety classifier', 'security', 'meta'),
  t('Lakera Guard', 'Check Point', 'Runtime protection', 'security', 'checkpoint'),
  t('Prisma AIRS', 'Palo Alto Networks', 'AI runtime security', 'security', 'paloaltonetworks'),
  t('Firewall for AI', 'Cloudflare', 'AI firewall', 'security', 'cloudflare'),
  t('Cisco AI Defense', 'Cisco', 'AI firewall', 'security', 'cisco'),
  t('Wiz AI-SPM', 'Wiz', 'AI posture management', 'security', 'wiz'),
  t('Garak', 'NVIDIA', 'LLM red-teaming', 'security', 'nvidia'),
  t('PyRIT', 'Microsoft', 'Red-teaming toolkit', 'security', 'microsoft'),
  t('OWASP LLM Top 10', 'OWASP', 'Risk framework', 'security', 'owasp'),
];

export const constellation = [...aiTools, ...aiSecurityTools];
