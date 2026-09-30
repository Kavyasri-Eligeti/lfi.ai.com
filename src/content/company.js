// Company information. Source of truth: https://www.linkfields.com
// (About Us, Our Approach, Careers, Contact Us, footer). Retrieved 2026-09-30.
// Text in quotes is reproduced verbatim from the corporate site.

export const CORPORATE_SITE = 'https://www.linkfields.com';

export const company = {
  legalName: 'Linkfields Innovations (Pvt) Ltd',
  name: 'Linkfields Innovations',
  shortName: 'LFI',
  founded: 2008,
  foundedIn: 'South Africa',
  hero: {
    title: 'Driving Innovation and Transformation',
    text: 'Harnessing emerging technologies and innovation to drive transformation, shaping a connected, accessible and intelligent future for the business world.',
  },
  history:
    'Linkfields Innovations was established in 2008 in South Africa as a pioneering organization which aimed to steer their customers into the direction of the next generation of business through innovation fueled by state-of-the-art automation technologies.',
  vision:
    'To be the go-to source of creative, custom-tailored, integrated, and long-term 360 digital solutions that help businesses and organizations flourish and grow.',
  mission:
    'Assisting global enterprises in growing, adapting, scaling, reinventing, and digitally transforming themselves through engineering excellence and reliable delivery.',
  values: [
    { name: 'Innovation', text: 'Creative problem-solving with high skill.' },
    { name: 'Courage', text: 'Willingness to test untested ideas.' },
    { name: 'Respect', text: 'Valuing kindness and empathy.' },
    { name: 'Impact', text: 'Creating positive, lasting change for clients and the world.' },
    { name: 'Passion', text: 'Pursuing rigorous excellence.' },
    { name: 'Ownership', text: 'Accountability for actions and organizational impact.' },
  ],
  approach: {
    title: 'Attention to detail, precision in outcomes',
    text: 'Linkfields follows a systematic, step-by-step approach which is often derived through blueprints and strategy based on real insights. Our experienced professionals are agile in their work, but also very thorough. Through the best combination of objectivity and subjectivity, we deliver results.',
    principles: [
      { name: 'Define the real challenge', text: 'Identifying the actual problem requiring resolution.' },
      { name: 'Move fast, and stay flexible', text: 'Maintaining agility while remaining adaptable to change.' },
      { name: 'Apply a human-centered lens', text: 'Ensuring solutions prioritize human needs and experiences.' },
      { name: 'Put relationships first', text: 'Building trust and strong partnerships as foundational elements.' },
    ],
  },
  // Only recognitions displayed on linkfields.com.
  recognition: [
    { value: '2008', label: 'Established in South Africa' },
    { value: '38th', label: "Financial Times & Statista: Africa's fastest-growing companies 2023" },
    { value: 'GPTW', label: 'Great Place to Work® Certified' },
    { value: 'ISO', label: 'ISO 27001:2022 and ISO 9001 certified' },
    { value: 'YES', label: 'Youth Employment Service (YES) initiative partner' },
  ],
  links: {
    about: `${CORPORATE_SITE}/company/about-us`,
    approach: `${CORPORATE_SITE}/company/our-approach`,
    blog: `${CORPORATE_SITE}/company/blog`,
    news: `${CORPORATE_SITE}/company/news-and-articles`,
    contact: `${CORPORATE_SITE}/contact-us`,
    careers: `${CORPORATE_SITE}/careers`,
  },
};

export const emails = {
  general: 'info@linkfields.com',
  sales: 'sales@linkfields.com',
  careers: 'careers@linkfields.com',
};

export const socials = [
  { name: 'LinkedIn', href: 'https://www.linkedin.com/company/linkfieldsinnovations/' },
  { name: 'X (Twitter)', href: 'https://x.com/LinkfieldsI' },
  { name: 'YouTube', href: 'https://www.youtube.com/channel/UCiSaCEnC7Gtu7YkanoA6mpg' },
];

// Partner names as listed on linkfields.com. Names only: no third-party
// logos are bundled, to avoid trademark and licensing issues.
export const partners = [
  'Automation Anywhere',
  'UiPath',
  'Salesforce',
  'Soterion',
  'Odoo',
  'AWS',
  'Azure',
  'Microsoft',
  'Blue Prism',
];

// Offices from https://www.linkfields.com/contact-us.
// lat/lon are approximate city-centre positions, used only to place a marker
// on the decorative globe. They are not office coordinates.
export const offices = [
  {
    id: 'south-africa',
    country: 'South Africa',
    city: 'Midrand',
    hq: true,
    address: 'Block H, Midridge Office Estate, International Business Gateway, Cnr 6th Street, Midrand, 1684',
    phones: ['+27 11 022 6666', '+27 11 023 6666'],
    approx: { lat: -26.0, lon: 28.13 },
  },
  {
    id: 'india',
    country: 'India',
    city: 'Hyderabad',
    address: '809, 8th Floor, Gowra Fountain Head, Raheja Mindspace IT Park, Hitech City, Hyderabad, 500081',
    phones: ['+91 40 4547 4849'],
    approx: { lat: 17.44, lon: 78.38 },
  },
  {
    id: 'usa',
    country: 'USA',
    city: 'New York',
    address: '1604, 447 Broadway, 2nd Floor, New York, 10013',
    phones: ['+1 347 871 0999'],
    approx: { lat: 40.72, lon: -74.0 },
  },
  {
    id: 'uae',
    country: 'UAE',
    city: 'Dubai',
    address: '409, Churchill Towers, Business Bay, Dubai, United Arab Emirates, 1686',
    phones: ['+971 50 688 5758'],
    approx: { lat: 25.19, lon: 55.27 },
  },
  {
    id: 'australia',
    country: 'Australia',
    city: 'Melbourne',
    address: 'Level 40, 140 William Street, Melbourne, 3000, VIC Australia',
    phones: ['+61 45 124 6666'],
    approx: { lat: -37.81, lon: 144.96 },
  },
  {
    id: 'botswana',
    country: 'Botswana',
    city: 'Gaborone',
    address: 'AGA House, Plot 28576, Gaborone Industrial, Gaborone',
    phones: ['+267 311 9073'],
    approx: { lat: -24.65, lon: 25.91 },
  },
];

export const telHref = (phone) => `tel:${phone.replace(/[^+\d]/g, '')}`;
