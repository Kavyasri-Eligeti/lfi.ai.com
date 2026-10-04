// Company information. Source of truth: https://www.linkfields.com
// (Home, About Us, Our Approach, Careers, Contact Us, footer). Retrieved 2026-10-01.
// Text in quotes is reproduced verbatim from the corporate site.

export const CORPORATE_SITE = 'https://www.linkfields.com';

export const company = {
  // The corporate site uses "(Pvt) Ltd" on About Us and "(Pty) Ltd" on its legal
  // pages. The legal-page form is used for the copyright line.
  legalName: 'Linkfields Innovations (Pty) Ltd',
  name: 'Linkfields Innovations',
  shortName: 'LFI',
  founded: 2008,
  foundedIn: 'South Africa',
  hero: {
    title: 'Driving Innovation and Transformation',
    text: 'Harnessing emerging technologies and innovation to drive transformation, shaping a connected, accessible and intelligent future for the business world.',
  },
  about: {
    tagline: 'Digitally forward, exploring and innovating',
    storyTitle: 'Transforming the world into a more efficient future',
  },
  history:
    'In 2008, Linkfields Innovations (Pvt) Ltd was established in South Africa as a pioneering organization which aimed to steer their customers into the direction of the next generation of business through innovation fueled by state-of-the-art automation technologies.',
  vision:
    'To be the go-to source of creative, custom-tailored, integrated, and long-term 360 digital solutions that help businesses and organizations flourish and grow.',
  mission:
    'Through our relentless pursuit of engineering excellence and our dedication to deliver with certainty, we assist global organisations in growing, adapting, scaling, reinventing, and digitally transforming themselves.',
  valuesTitle: 'Grow and succeed through transformation',
  values: [
    { name: 'Innovation', text: 'Infusing creativity and high skill to create solutions that fix problems in the most effective way.' },
    { name: 'Courage', text: 'Our experts have the courage to try out ideas which have been untested before.' },
    { name: 'Respect', text: 'We value kindness and empathy, qualities which we believe keep the race healthy.' },
    { name: 'Impact', text: 'Everyday we try harder to create impact on the world and our clients, that is positive and everlasting.' },
    { name: 'Passion', text: 'We encourage rigorous discourse and never settle for anything but the best.' },
    { name: 'Ownership', text: 'We own up to ourselves, our actions, and our organization’s impact.' },
  ],
  approach: {
    tagline: 'Attention to detail, precision in outcomes',
    title: 'Experience directed by iteration',
    text: 'Linkfields follows a systematic, step-by-step approach which is often derived through blueprints and strategy based on real insights. Our experienced professionals are agile in their work, but also very thorough. Through the best combination of objectivity and subjectivity, we deliver results.',
    // Only the principle titles are published.
    principles: ['Define the real challenge', 'Move fast, and stay flexible', 'Apply a human-centered lens', 'Put relationships first'],
    recipeTitle: 'A recipe for success',
    recipe: [
      'We explore the scope of challenges that are being faced by employees or customers. We also determine which assets, platforms or services will accelerate outcomes and establish the most commercially viable solution',
      'After discussion and deliberation, we agree on the hypothesis and determine what we need to prove first. Through our partners, we explore ways to maximise impact and boost change, finally drafting an initial project roadmap',
      'Evolution helps us determine if any additional proof points are generating expected returns and make adjustments if necessary. We also determine if any additional proof points are required and decide which services are needed to support scale.',
      'We explore ways to scale and drive a sustainable cultural change and identify what the delivery model requirements are. This helps us understand how to accelerate additional values.',
    ],
  },
  csr: {
    title: 'Better future creates better lives',
    text: 'Bringing together the corporate and the society in a philanthropic effort because we acknowledge the role of society in making us, who we are.',
  },
  // Only recognitions displayed on linkfields.com. The published "16 years"
  // figure dates from 2024, so the founding year is used instead.
  recognition: [
    { value: '2008', label: 'Established in South Africa' },
    {
      value: '38th',
      label: 'Ranked 38th in Financial Times and Statista’s 2023 list of Africa’s top 100 fastest-growing companies',
      href: 'https://www.ft.com/africas-fastest-growing-companies-2023',
    },
    { value: 'GPTW', label: 'Great Place to Work® Certified', image: '/images/badges/gptw.png' },
    { value: 'ISO/IEC 27001', label: 'ISO/IEC 27001:2022 certified', image: '/images/badges/iso-27001.png' },
    { value: 'ISO 9001', label: 'ISO 9001:2015 certified', image: '/images/badges/iso-9001.png' },
    { value: 'YES', label: 'Proud to be a partner of the Youth Employment Service initiative.' },
  ],
  memberships: ['NASSCOM', 'DUNS'],
  links: {
    about: `${CORPORATE_SITE}/company/about-us`,
    approach: `${CORPORATE_SITE}/company/our-approach`,
    blog: `${CORPORATE_SITE}/company/blog`,
    news: `${CORPORATE_SITE}/company/news-and-articles`,
    contact: `${CORPORATE_SITE}/contact-us`,
    careers: `${CORPORATE_SITE}/careers`,
    privacy: `${CORPORATE_SITE}/privacy-policy`,
    terms: `${CORPORATE_SITE}/terms-of-use`,
    cookies: `${CORPORATE_SITE}/cookies-policy`,
  },
};

export const emails = {
  general: 'info@linkfields.com',
  sales: 'sales@linkfields.com',
  careers: 'careers@linkfields.com',
};

// The LinkedIn icon on linkfields.com points to a LinkedIn admin URL that the
// public cannot open, so the public company page (from the site's metadata) is used.
export const socials = [
  { id: 'linkedin', name: 'LinkedIn', handle: 'linkfieldsinnovations', href: 'https://www.linkedin.com/company/linkfieldsinnovations/' },
  { id: 'x', name: 'X', handle: '@LinkfieldsI', href: 'https://x.com/LinkfieldsI' },
  { id: 'youtube', name: 'YouTube', handle: 'Linkfields Innovations', href: 'https://www.youtube.com/channel/UCiSaCEnC7Gtu7YkanoA6mpg' },
  { id: 'goodfirms', name: 'GoodFirms', handle: 'Company profile', href: 'https://www.goodfirms.co/company/linkfields-innovations' },
];

// Partners as shown in the "Our partners" carousel on linkfields.com, in the
// same order, with the logo files and links published there. The tiles are
// graphite, so every logo is shown in its light-on-dark form: the light
// versions linkfields.com publishes (Automation Anywhere, Soterion) and the
// official reverse colourways (white lettering) of AWS, Microsoft, Odoo and
// Blue Prism. `file` overrides the default /images/partners/<id>.svg.
export const partners = [
  { id: 'automation-anywhere', name: 'Automation Anywhere', href: 'https://www.automationanywhere.com/' },
  { id: 'uipath', name: 'UiPath', href: 'https://www.uipath.com/' },
  { id: 'salesforce', name: 'Salesforce', href: 'https://www.salesforce.com/' },
  { id: 'soterion', name: 'Soterion', href: 'https://soterion.com/' },
  { id: 'odoo', name: 'Odoo', href: 'https://www.odoo.com/', file: 'odoo-reverse.svg' },
  { id: 'aws', name: 'AWS', href: 'https://aws.amazon.com/', file: 'aws-reverse.svg' },
  { id: 'azure', name: 'Azure', href: 'https://azure.microsoft.com/' },
  { id: 'microsoft', name: 'Microsoft', href: 'https://www.microsoft.com/', file: 'microsoft-reverse.svg' },
  { id: 'blue-prism', name: 'Blue Prism', href: 'https://www.blueprism.com/', file: 'blue-prism-reverse.svg' },
].map((p) => ({ ...p, logo: `/images/partners/${p.file || `${p.id}.svg`}` }));

// Offices from https://www.linkfields.com/contact-us, with the direction links
// published there. `approx` is the office's position on the globe: building-level
// where the published directions link or the street address resolves (noted on
// each line); `areaOnly` marks an office placed by its area.
export const offices = [
  {
    id: 'south-africa',
    country: 'South Africa',
    city: 'Midrand',
    address: 'Block H, Midridge Office Estate, International Business Gateway, Cnr 6th Street, Midrand, 1684',
    phones: ['+27 11 022 6666', '+27 11 023 6666'],
    directions:
      'https://www.google.com/maps/dir//Linkfields+Innovations+(Pty)+Ltd,+Block+H,+Midridge+Office+Estate+International+Business+Gateway,+Cnr+6th+Street+%26,+New+Rd,+Carlswald,+Midrand,+1684,+South+Africa/@-25.9773519,28.1198535,18z/data=!4m8!4m7!1m0!1m5!1m1!1s0x1e956fbeafbef887:0x70ddc33f5ea30690!2m2!1d28.1210252!2d-25.9762899?entry=ttu',
    approx: { lat: -25.97629, lon: 28.12103 }, // from the published directions link
  },
  {
    id: 'india',
    country: 'India',
    city: 'Hyderabad',
    address: '809, 8th Floor, Gowra Fountain Head, Raheja Mindspace IT Park, Hitech City, Hyderabad, 500081',
    phones: ['+91 40 4547 4849'],
    directions:
      'https://www.google.com/maps/place/Gowra+Fountain+Head/@17.4439218,78.3807443,17z/data=!3m1!4b1!4m5!3m4!1s0x3bcb93e01511d911:0x104e7368bcfb0af1!8m2!3d17.4439218!4d78.382933',
    approx: { lat: 17.44392, lon: 78.38293 }, // Gowra Fountain Head, from the published directions link
  },
  {
    id: 'usa',
    country: 'USA',
    city: 'New York',
    address: '1604, 447 Broadway, 2nd Floor, New York, 10013',
    phones: ['+1 347 871 0999'],
    directions: 'https://goo.gl/maps/4CenTJee6XXRZou1A?coh=178572&entry=tt',
    approx: { lat: 40.72045, lon: -74.00122 }, // 447 Broadway (OpenStreetMap)
  },
  {
    id: 'uae',
    country: 'UAE',
    city: 'Dubai',
    address: '409, Churchill Towers, Business Bay, Dubai, United Arab Emirates, 1686',
    phones: ['+971 50 688 5758'],
    directions: 'https://goo.gl/maps/bm3bunttL7epY7bC7?coh=178572&entry=tt',
    approx: { lat: 25.18056, lon: 55.26284 }, // Churchill Towers, Business Bay (OpenStreetMap)
  },
  {
    id: 'australia',
    country: 'Australia',
    city: 'Melbourne',
    address: 'Level 40, 140 William Street, Melbourne, 3000, VIC Australia',
    phones: ['+61 45 124 6666'],
    directions: 'https://goo.gl/maps/VFXWxdQEhMruwG6f8?coh=178572&entry=tt',
    approx: { lat: -37.81587, lon: 144.95886 }, // 140 William Street (OpenStreetMap)
  },
  {
    id: 'botswana',
    country: 'Botswana',
    city: 'Gaborone',
    address: 'AGA House, Plot 28576, Gaborone Industrial, Gaborone',
    phones: ['+267 311 9073'],
    directions: 'https://maps.app.goo.gl/XCroxEzCeCV8ogYTA?g_st=iw',
    approx: { lat: -24.6545, lon: 25.9200 }, areaOnly: true, // Gaborone industrial area; the plot is not in public map data
  },
];

export const telHref = (phone) => `tel:${phone.replace(/[^+\d]/g, '')}`;
