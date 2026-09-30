// Corporate services. Source: linkfields.com/services/* (verbatim headlines,
// intros and sub-service names). Retrieved 2026-09-30.
// Names are kept exactly as published. "Technology" and "Teams" are two
// separate services on the corporate site.
import { STATUS } from './status';
import { CORPORATE_SITE } from './company';

export const corporateServices = [
  {
    id: 'engineering',
    name: 'Engineering',
    status: STATUS.CORPORATE,
    headline: 'Creating impact by harnessing technology',
    subServices: [
      {
        name: 'Application Development',
        text: 'Complete renovation of businesses to prepare them for the digital future by equipping organizations with digitally empowered tools.',
      },
      { name: 'Quality Control' },
      { name: 'DevOps' },
    ],
    href: `${CORPORATE_SITE}/services/engineering`,
  },
  {
    id: 'consulting',
    name: 'Consulting',
    status: STATUS.CORPORATE,
    headline: 'Providing insights fueled by decades of experience',
    intro:
      'We thrive on innovating and creating better processes for our clients through new digital models, defining roadmaps, and varied approaches for delivering digital transformation.',
    subServices: [
      {
        name: 'Solution Discovery',
        text: 'Step-by-step approach to make a blueprint of the delivery approach suitable for your business.',
      },
      { name: 'Product Discovery' },
      { name: 'Technology Advisory' },
      { name: 'UX/UI Design' },
    ],
    href: `${CORPORATE_SITE}/services/consulting`,
  },
  {
    id: 'cloud',
    name: 'Cloud',
    status: STATUS.CORPORATE,
    headline: 'The future is on the cloud',
    intro:
      'Bringing the transformation in the manner in which businesses deal with data storage & computing power, without requiring active management through managed cloud services.',
    subServices: [
      {
        name: 'Kubernetes Services',
        text: 'Employing open-source automation software that speed up the development process and also can be cost-effective.',
      },
      { name: 'Cloud Development' },
      { name: 'Cloud Migration' },
      { name: 'Cloud Consulting' },
    ],
    href: `${CORPORATE_SITE}/services/cloud`,
  },
  {
    id: 'automation',
    name: 'Automation',
    status: STATUS.CORPORATE,
    headline: 'Amplifying business growth with automation',
    intro:
      'Swifter operations, lesser costs, and higher productivity. Designing a broad spectrum of technologies that reduce the requirement of human mediation in operations, freeing up employees for more imaginative tasks that boost productivity.',
    subServices: [
      {
        name: 'Robotic Process Automation',
        text: 'RPA software uses a combination of integrations, advanced technologies, and cognitive processes, allowing companies to use software robots that perform organizational tasks within an overall business.',
      },
      { name: 'Digital Transformation' },
    ],
    href: `${CORPORATE_SITE}/services/automation`,
  },
  {
    id: 'technology',
    name: 'Technology',
    status: STATUS.CORPORATE,
    headline: 'Facilitating change by mobilizing technology',
    subServices: [
      {
        name: 'Big Data Engineering',
        text: 'Building and managing big data infrastructure and tools that lets engineers interact with massive data processing systems and databases in large-scale computing environments.',
      },
      { name: 'AI & Machine Learning' },
    ],
    href: `${CORPORATE_SITE}/services/technology`,
  },
  {
    id: 'teams',
    name: 'Teams',
    status: STATUS.CORPORATE,
    headline: 'Synchronized teamwork for higher output',
    intro:
      'By studying and analysis team outputs, we identify the discrepancies and shortcomings, and their specific areas of emergence. This helps us figure out what skill-set needs to be added to the team.',
    subServices: [
      {
        name: 'Managed Team',
        text: 'Helping businesses build well-structured, well-designed teams to fit into their specific requirement.',
      },
      { name: 'Staff Augmentation' },
    ],
    href: `${CORPORATE_SITE}/services/teams`,
  },
  {
    id: 'it-infrastructure',
    name: 'IT Infrastructure and Solutions',
    status: STATUS.CORPORATE,
    headline: 'IT Infrastructure and Solutions',
    intro:
      'Your business relies heavily on robust IT infrastructure to deliver exceptional user experiences and drive growth. At Linkfields, we specialize in transforming traditional IT environments into modern, software-defined, and intelligent infrastructures.',
    subServices: [
      {
        name: 'Device Management',
        text: 'Keep user devices secure, up-to-date, and performing at their best with our comprehensive management services.',
      },
      {
        name: 'Desktop Virtualization',
        text: 'Enable flexible and remote working with secure virtual desktop solutions accessible from any device.',
      },
      {
        name: 'Application Delivery',
        text: 'Streamline application deployment and updates to enhance productivity, ensuring users have the tools they need.',
      },
      {
        name: 'Support Services',
        text: 'Get 24/7 IT support to resolve issues quickly, minimizing downtime and maximizing efficiency.',
      },
    ],
    href: `${CORPORATE_SITE}/services/itinfraandsolutions`,
  },
];
