// Official logos of the platforms behind Linkfields' services and solutions.
// Every file is the vendor's mark, unmodified, in its official colours
// (sources in public/logos/SOURCES.txt; partner logos are the files
// linkfields.com publishes). `tile: 'dark'` marks light-on-dark logos.
// Showing a logo names a platform Linkfields works with; it implies no
// partnership unless the company lists one (see content/company.js partners).
const L = (name, file, tile = 'light') => ({ name, src: `${process.env.PUBLIC_URL || ''}${file}`, tile });
const si = (name, slug) => L(name, `/logos/${slug}.svg`);

export const LOGOS = {
  // ERP, CRM and integration
  sap: si('SAP', 'sap'),
  odoo: si('Odoo', 'odoo'),
  dynamics: L('Microsoft Dynamics 365', '/logos/dynamics365.svg'),
  salesforce: L('Salesforce', '/images/partners/salesforce.svg'),
  testoriumz: L('Testorium Z', '/logos/testoriumz.png', 'dark'),
  // Automation
  uipath: si('UiPath', 'uipath'),
  automationanywhere: L('Automation Anywhere', '/images/partners/automation-anywhere-light.svg'),
  n8n: si('n8n', 'n8n'),
  // Cloud and platforms
  aws: si('AWS', 'aws'),
  azure: si('Microsoft Azure', 'azure'),
  googlecloud: si('Google Cloud', 'googlecloud'),
  kubernetes: si('Kubernetes', 'kubernetes'),
  docker: si('Docker', 'docker'),
  terraform: si('Terraform', 'terraform'),
  redhat: si('Red Hat', 'redhat'),
  // Engineering
  react: si('React', 'react'),
  angular: si('Angular', 'angular'),
  flutter: si('Flutter', 'flutter'),
  python: si('Python', 'python'),
  jenkins: si('Jenkins', 'jenkins'),
  githubactions: si('GitHub Actions', 'githubactions'),
  selenium: si('Selenium', 'selenium'),
  cypress: si('Cypress', 'cypress'),
  // Consulting and teams
  figma: si('Figma', 'figma'),
  jira: si('Jira', 'jira'),
  confluence: si('Confluence', 'confluence'),
  miro: si('Miro', 'miro'),
  // Data
  databricks: si('Databricks', 'databricks'),
  snowflake: si('Snowflake', 'snowflake'),
  spark: si('Apache Spark', 'apachespark'),
  kafka: si('Apache Kafka', 'apachekafka'),
  airflow: si('Apache Airflow', 'apacheairflow'),
  postgresql: si('PostgreSQL', 'postgresql'),
  elasticsearch: si('Elasticsearch', 'elasticsearch'),
  neo4j: si('Neo4j', 'neo4j'),
  grafana: si('Grafana', 'grafana'),
  // AI
  anthropic: si('Anthropic', 'anthropic'),
  claude: si('Claude', 'claude'),
  openai: L('OpenAI', '/logos/openai.svg'),
  gemini: si('Google Gemini', 'googlegemini'),
  meta: si('Meta Llama', 'meta'),
  mistral: si('Mistral AI', 'mistralai'),
  huggingface: si('Hugging Face', 'huggingface'),
  langchain: si('LangChain', 'langchain'),
  langgraph: si('LangGraph', 'langgraph'),
  mcp: si('Model Context Protocol', 'modelcontextprotocol'),
  crewai: si('CrewAI', 'crewai'),
  pytorch: si('PyTorch', 'pytorch'),
  tensorflow: si('TensorFlow', 'tensorflow'),
  scikitlearn: si('scikit-learn', 'scikitlearn'),
  opencv: si('OpenCV', 'opencv'),
  nvidia: si('NVIDIA', 'nvidia'),
  mlflow: si('MLflow', 'mlflow'),
  dialogflow: si('Dialogflow', 'dialogflow'),
  copilot: L('Microsoft Copilot', '/logos/copilot.svg'),
  // Security and infrastructure
  owasp: si('OWASP', 'owasp'),
  paloalto: si('Palo Alto Networks', 'paloaltonetworks'),
  cisco: si('Cisco', 'cisco'),
  fortinet: si('Fortinet', 'fortinet'),
  vmware: si('VMware', 'vmware'),
  citrix: si('Citrix', 'citrix'),
  microsoft: L('Microsoft', '/logos/microsoft.svg'),
};

// The logos shown for each service, AI service and solution (by id or name).
export const SERVICE_LOGOS = {
  engineering: ['react', 'python', 'docker', 'jenkins'],
  consulting: ['figma', 'jira', 'miro', 'confluence'],
  cloud: ['aws', 'azure', 'googlecloud', 'kubernetes'],
  automation: ['uipath', 'automationanywhere', 'n8n'],
  technology: ['spark', 'databricks', 'pytorch', 'tensorflow'],
  teams: ['jira', 'confluence', 'githubactions'],
  'it-infrastructure': ['cisco', 'vmware', 'fortinet', 'citrix'],
  'ai-services': ['anthropic', 'openai', 'gemini', 'huggingface'],
};

export const SUB_SERVICE_LOGOS = {
  'Application Development': ['react', 'angular', 'flutter', 'python'],
  'Quality Control': ['selenium', 'cypress', 'testoriumz'],
  DevOps: ['jenkins', 'githubactions', 'terraform', 'docker'],
  'Solution Discovery': ['miro', 'confluence'],
  'Product Discovery': ['figma', 'miro', 'jira'],
  'Technology Advisory': ['aws', 'azure', 'googlecloud'],
  'UX/UI Design': ['figma'],
  'Kubernetes Services': ['kubernetes', 'docker', 'redhat'],
  'Cloud Development': ['aws', 'azure', 'googlecloud', 'terraform'],
  'Cloud Migration': ['aws', 'azure', 'googlecloud'],
  'Cloud Consulting': ['aws', 'azure', 'googlecloud'],
  'Robotic Process Automation': ['uipath', 'automationanywhere'],
  'Digital Transformation': ['sap', 'salesforce', 'dynamics', 'odoo'],
  'Big Data Engineering': ['spark', 'databricks', 'snowflake', 'kafka'],
  'AI & Machine Learning': ['pytorch', 'tensorflow', 'scikitlearn', 'huggingface'],
  'Managed Team': ['jira', 'confluence'],
  'Staff Augmentation': ['githubactions', 'jira'],
  'AI Strategy and Consulting': ['aws', 'azure', 'googlecloud'],
  'Generative AI and LLM Engineering': ['claude', 'openai', 'gemini', 'meta'],
  'AI Agent Development': ['langgraph', 'mcp', 'crewai'],
  'RAG and Knowledge Engineering': ['langchain', 'elasticsearch', 'postgresql'],
  'Custom Model Development and Fine-tuning': ['pytorch', 'tensorflow', 'huggingface'],
  'Data Engineering for AI': ['databricks', 'snowflake', 'spark', 'airflow'],
  'MLOps and LLMOps': ['mlflow', 'kubernetes', 'docker'],
  'AI Governance, Security and Responsible AI': ['owasp', 'nvidia', 'paloalto'],
  'AI Integration and APIs': ['sap', 'salesforce', 'uipath'],
};

export const SOLUTION_LOGOS = {
  // Enterprise platforms Linkfields implements
  sap: ['sap'],
  odoo: ['odoo'],
  'microsoft-dynamics': ['dynamics'],
  salesforce: ['salesforce'],
  ipaas: ['sap', 'odoo', 'dynamics', 'salesforce'],
  rpa: ['uipath', 'automationanywhere'],
  'testorium-z': ['testoriumz'],
  // AI solutions
  'generative-ai': ['claude', 'openai', 'gemini', 'copilot'],
  'agentic-ai': ['langgraph', 'mcp', 'crewai', 'claude'],
  'enterprise-rag': ['langchain', 'elasticsearch', 'postgresql'],
  'conversational-ai': ['dialogflow', 'openai', 'gemini'],
  'document-intelligence': ['aws', 'azure', 'googlecloud'],
  'computer-vision': ['opencv', 'pytorch', 'nvidia'],
  'predictive-analytics': ['scikitlearn', 'databricks', 'python'],
  'fraud-risk': ['neo4j', 'kafka', 'databricks'],
  'customer-intelligence': ['salesforce', 'snowflake', 'kafka'],
  'intelligent-automation': ['uipath', 'automationanywhere', 'n8n'],
  'industrial-ai': ['aws', 'azure', 'grafana'],
  'ai-governance': ['owasp', 'nvidia', 'paloalto'],
};

export const logosFor = (keys = []) => keys.map((k) => LOGOS[k]).filter(Boolean);
