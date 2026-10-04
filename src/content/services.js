// Corporate services. Source: linkfields.com/services/* and each sub-service
// page (headlines, overviews and taglines verbatim). Retrieved 2026-10-01.
// Names are kept exactly as published. "Technology" and "Teams" are two
// separate services on the corporate site.
import { STATUS } from './status';
import { CORPORATE_SITE } from './company';

const sub = (name, path, tagline, summary) => ({ name, href: `${CORPORATE_SITE}/services/${path}`, tagline, summary });

export const corporateServices = [
  {
    id: 'engineering',
    name: 'Engineering',
    status: STATUS.CORPORATE,
    headline: 'Creating impact by harnessing technology',
    overview: {
      title: 'Building things that are precise',
      text: 'Engineering relies on an expert’s ability to figure out a solution to a problem that seems impossible to achieve. By following the same philosophy we engineer software based on tough frameworks that shows flexibility of function.',
    },
    subServices: [
      sub('Application Development', 'engineering/application-development', 'Finishing tasks faster with applications',
        'Creating software and apps that are easy-to-use, have a lot of capability, and are easy-to-navigate, ensuring high quality.'),
      sub('Quality Control', 'engineering/quality-control', 'Never compromising on quality',
        'Quality control is a system or set of methods planned to guarantee that a made item or performed administration holds fast to a characterized set of value models or meets the prerequisites of the customer or client.'),
      sub('DevOps', 'engineering/devops', 'A future-oriented practice that boosts swiftness',
        'Its goal is to minimize the systems development life cycle and provide high-quality software delivery on a continual basis.'),
    ],
    href: `${CORPORATE_SITE}/services/engineering`,
  },
  {
    id: 'consulting',
    name: 'Consulting',
    status: STATUS.CORPORATE,
    headline: 'Facilitating effective technology change',
    overview: {
      title: 'Providing insights fueled by decades of experience',
      text: 'We thrive on innovating and creating better processes for our clients through new digital models, defining roadmaps, and varied approaches for delivering digital transformation.',
    },
    subServices: [
      sub('Solution Discovery', 'consulting/solution-discovery', 'Exploration towards the best solution',
        'By following a step-by-step approach in the designing process, we discover the approach that suits your business needs best.'),
      sub('Product Discovery', 'consulting/product-discovery', 'Providing teams with certainty in their building approach',
        'The iterative process of eliminating uncertainty around an issue or idea to ensure that the correct product is produced for the right audience is known as product discovery.'),
      sub('Technology Advisory', 'consulting/technology-advisory', 'Expert insights for better IT outputs',
        'Technology advisory is a client-driven approach to IT assistance that includes professional guidance supported by world-class knowledge and in step with current technological trends.'),
      sub('UX/UI Design', 'consulting/uiux-design', 'UX/UI design, the technology for tomorrow',
        'The design of user interfaces with the goal of maximizing usability and the user experience is known as user interface design or user interface engineering'),
    ],
    href: `${CORPORATE_SITE}/services/consulting`,
  },
  {
    id: 'cloud',
    name: 'Cloud',
    status: STATUS.CORPORATE,
    headline: 'The future is on the cloud',
    overview: {
      title: 'Access your data, no matter where you are',
      text: 'Bringing the transformation in the manner in which businesses deal with data storage & computing power, without requiring active management through managed cloud services.',
    },
    subServices: [
      sub('Kubernetes Services', 'cloud/kubernetes-services', 'Kubernetes saves time and resources',
        'Now you won’t have to make modifications to your cloud application with Kubernetes’ unfamiliar service discovery methodology.'),
      sub('Cloud Development', 'cloud/cloud-development', 'Building the cloud infrastructure',
        'Cloud development is a service where our cloud technicians and experts develop, design, and engineer the cloud environment itself.'),
      sub('Cloud Migration', 'cloud/cloud-migration', 'Moving to a cloud-based infrastructure',
        'Providing expert insights and support to organizations in moving their data center capabilities to the cloud.'),
      sub('Cloud Consulting', 'cloud/cloud-consulting', 'Providing expert insights to help you make the right cloud-related decisions',
        'Through years of experience with cloud technologies, our experts help you make the right decision when it comes to cloud migration and other cloud-related services.'),
    ],
    href: `${CORPORATE_SITE}/services/cloud`,
  },
  {
    id: 'automation',
    name: 'Automation',
    status: STATUS.CORPORATE,
    headline: 'Amplifying business growth with automation',
    overview: {
      title: 'Swifter operations, lesser costs, and higher productivity',
      text: 'Designing a broad spectrum of technologies that reduce the requirement of human mediation in operations, freeing up employees for more imaginative tasks that boost productivity.',
    },
    subServices: [
      sub('Robotic Process Automation', 'automation/robotic-process-automation', 'Become a more efficient workplace',
        'RPA, aimed at automating business processes, uses tools, or a “robot,” to capture and interpret applications for processing a transaction, manipulating data, triggering responses and communicating with other digital systems.'),
      sub('Digital Transformation', 'automation/digital-transformation', 'Preparing you for a digital world',
        'Digital transformation is the adoption of digital technologies by a corporation to improve business processes, customer value, and innovation.'),
    ],
    href: `${CORPORATE_SITE}/services/automation`,
  },
  {
    id: 'technology',
    name: 'Technology',
    status: STATUS.CORPORATE,
    headline: 'Facilitating change by mobilizing technology',
    overview: {
      title: 'Adaptation and research for newer technologies',
      text: 'We research and study all the upcoming technologies to develop models that will make the technological transformation easier in the future.',
    },
    subServices: [
      sub('Big Data Engineering', 'technology/big-data', 'Making data analysis easier',
        'Big Data Engineering is a field that finds ways to examine, efficiently separate data from data sets that are excessively huge or complex to be managed by customary information handling application programming.'),
      sub('AI & Machine Learning', 'technology/ai-ml', 'Hassling over redundancy, a thing of the past',
        'Machine learning (ML) and Artificial Intelligence (AI) are computer sciences which focus on the use of data and algorithms to imitate the way that humans learn, gradually letting them improve accuracy by themselves.'),
    ],
    href: `${CORPORATE_SITE}/services/technology`,
  },
  {
    id: 'teams',
    name: 'Teams',
    status: STATUS.CORPORATE,
    headline: 'Synchronized teamwork for higher output',
    overview: {
      title: 'Analysis and data-fuelled team building',
      text: 'By studying and analysis team outputs, we identify the discrepancies and shortcomings, and their specific areas of emergence. This helps us figure out what skill-set needs to be added to the team.',
    },
    subServices: [
      sub('Managed Team', 'teams/managed-team', 'Balancing skills and expertise to make better teams',
        'Combining features like teamwork, communication, objective setting and performance appraisals to form teams that function well, get along, and are highly productive.'),
      sub('Staff Augmentation', 'teams/staff-augmentation', 'Adding the missing piece to the problem',
        'Staff augmentation is a type of outsourcing that is used to staff a project and meet the company’s goals. The method entails assessing current personnel and identifying which extra skills are necessary.'),
    ],
    href: `${CORPORATE_SITE}/services/teams`,
  },
  {
    id: 'it-infrastructure',
    name: 'IT Infrastructure and Solutions',
    status: STATUS.CORPORATE,
    headline: 'Transforming IT Infrastructure for the digital age',
    overview: {
      title: 'Transform your IT Infrastructure for the digital age',
      text: 'Your business relies heavily on robust IT infrastructure to deliver exceptional user experiences and drive growth. At Linkfields, we specialize in transforming traditional IT environments into modern, software-defined, and intelligent infrastructures',
    },
    offer: 'IT infrastructure needs to advance. We help shift from a big-budget, hardware-centric setup to a smart, software-driven infrastructure that is prepared to meet any challenge.',
    // This service has no sub-pages; its offerings are grouped in three tabs.
    groups: [
      {
        name: 'End User Computing',
        items: [
          { name: 'Device Management', text: 'Keep user devices secure, up-to-date, and performing at their best with our comprehensive management services.' },
          { name: 'Desktop Virtualization', text: 'Enable flexible and remote working with secure virtual desktop solutions accessible from any device.' },
          { name: 'Application Delivery', text: 'Streamline application deployment and updates to enhance productivity, ensuring users have the tools they need.' },
          { name: 'Support Services', text: 'Get 24/7 IT support to resolve issues quickly, minimizing downtime and maximizing efficiency.' },
        ],
      },
      {
        name: 'Networking',
        items: [
          { name: 'Network Design and Implementation', text: 'Create custom network architecture tailored to your business needs for optimal performance and reliability.' },
          { name: 'Network Monitoring and Management', text: 'Maintain peak network performance with proactive monitoring and management, identifying and resolving issues promptly.' },
          { name: 'Wireless Networking', text: 'Provide seamless and secure wireless connectivity to enhance mobility and collaboration within your workplace.' },
          { name: 'Security Solutions', text: 'Implement state-of-the-art security measures, including firewalls, intrusion detection, and secure access controls.' },
        ],
      },
      {
        name: 'Digital Workplace',
        items: [
          { name: 'Collaboration Tools', text: 'Enhance teamwork and communication with integrated collaboration platforms.' },
          { name: 'Employee Engagement', text: 'Foster a positive and engaging work culture with digital tools designed to improve employee satisfaction and productivity.' },
          { name: 'Remote Work Solutions', text: 'Enable secure and productive remote work environments with advanced digital tools and platforms.' },
          { name: 'User Experience Management', text: 'Ensure a smooth and efficient user experience with tools that monitor and optimize performance.' },
        ],
      },
    ],
    href: `${CORPORATE_SITE}/services/itinfraandsolutions`,
  },
];

// AI services, added alongside the published services above. These are new
// Linkfields AI practice offerings (not yet on linkfields.com); their links
// lead to the contact page.
const ai = (name, tagline, summary) => ({ name, href: '/contact', linkLabel: `Discuss ${name}`, tagline, summary });

export const aiServicePractice = {
  id: 'ai-services',
  name: 'AI Services',
  isNew: true,
  headline: 'From AI strategy to AI in production',
  overview: {
    title: 'End-to-end AI engineering, built on our seven practices',
    text: 'We help enterprises choose the right AI opportunities, build them on secure foundations and run them reliably in production, combining our engineering, cloud, data and automation experience with today’s leading AI models and platforms.',
  },
  subServices: [
    ai('AI Strategy and Consulting', 'Finding the AI opportunities worth building',
      'AI readiness assessments, use-case discovery and prioritisation, business cases and roadmaps that connect AI investment to measurable outcomes.'),
    ai('Generative AI and LLM Engineering', 'Production-grade generative AI applications',
      'Design and build of copilots and generative AI applications: model selection, prompt and context engineering, evaluation, and integration with your systems.'),
    ai('AI Agent Development', 'Agents that get work done, safely',
      'Tool-using AI agents and multi-agent workflows with guardrails, human approval steps and audit trails, connected to your APIs through standards such as MCP.'),
    ai('RAG and Knowledge Engineering', 'Grounding AI in your own knowledge',
      'Ingestion pipelines, vector and hybrid search, permission-aware retrieval and answer evaluation for assistants that cite their sources.'),
    ai('Custom Model Development and Fine-tuning', 'Models shaped to your data',
      'Training and fine-tuning machine-learning, vision and language models on your data, from feature engineering to model validation.'),
    ai('Data Engineering for AI', 'The data foundation AI depends on',
      'Data platforms, pipelines, quality checks and feature stores that make enterprise data ready for analytics and AI.'),
    ai('MLOps and LLMOps', 'Reliable AI in production',
      'CI/CD for models, deployment, monitoring, drift detection, cost control and observability for machine-learning and LLM systems.'),
    ai('AI Governance, Security and Responsible AI', 'Trust built in from the start',
      'AI policies, risk assessment, red-teaming, prompt-injection defence and compliance with frameworks such as ISO/IEC 42001 and the EU AI Act.'),
    ai('AI Integration and APIs', 'AI wherever your business runs',
      'Exposing AI capabilities as secure, reusable APIs and microservices, and embedding them in ERP, CRM and RPA platforms such as SAP, Salesforce and UiPath.'),
  ],
  href: '/contact',
  linkLabel: 'Talk to our AI team',
};

export const allServices = [...corporateServices, aiServicePractice];

export const serviceById = Object.fromEntries(allServices.map((s) => [s.id, s]));
