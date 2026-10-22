/**
 * Verified company facts.
 *
 * Every value here was read from an official source - linkfields.com (the
 * parent company site) or the existing lfiai.com catalogue. Nothing in this
 * file is estimated, rounded or inferred. If a fact could not be confirmed it
 * is simply absent rather than approximated.
 *
 * A convention that matters for everything in `official`: those strings are
 * reproduced CHARACTER FOR CHARACTER from the published page, including its
 * own spelling ("organisations" in the mission, "organization's" in the
 * Ownership value) and its own punctuation. They are the company's published
 * statements, so the site quotes them rather than rewriting them. Anything
 * outside `official` is this site's own voice and is free to be edited.
 *
 * Sources, all re-read and confirmed on 2026-10-21:
 *   https://www.linkfields.com/
 *   https://www.linkfields.com/company/about-us
 *   https://www.linkfields.com/company/our-approach
 *   https://www.linkfields.com/services/technology/ai-ml
 *   https://www.linkfields.com/contact-us
 */

export const PARENT_SITE = "https://www.linkfields.com";

/**
 * Published statements, verbatim.
 *
 * Kept in one object so that anything quoting the parent company is quoting
 * the same string, and so a change on the official site is a one-line change
 * here rather than a hunt through the components.
 */
export const official = {
  /* --- homepage ---------------------------------------------------------- */
  headline: "Driving Innovation and Transformation",
  positioning:
    "Harnessing emerging technologies and innovation to drive transformation, shaping a connected, accessible and intelligent future for the business world.",
  solutionsIntro:
    "Linkfields offers industry-specific tailored solutions that benefit your business, increasing productivity, improving the quality of your application development and streamlining operations. Our automation and analytics solutions enhance decision making capabilities and improve return on investment.",
  servicesIntro:
    "With more than a decade of experience & insight, we provide Digital, RPA, Quality Assurance, AI, SAP, and Technology Consulting Services to companies of all scales, around the globe",
  industriesIntro:
    "We have rich experience in your industry. We also share insights across industries to help you uncover new opportunities to adapt and disrupt.",

  /* --- about us ----------------------------------------------------------- */
  storyHeading: "Transforming the world into a more efficient future",
  story:
    "In 2008, Linkfields Innovations (Pvt) Ltd was established in South Africa as a pioneering organization which aimed to steer their customers into the direction of the next generation of business through innovation fueled by state-of-the-art automation technologies.",
  vision:
    "To be the go-to source of creative, custom-tailored, integrated, and long-term 360 digital solutions that help businesses and organizations flourish and grow.",
  mission:
    "Through our relentless pursuit of engineering excellence and our dedication to deliver with certainty, we assist global organisations in growing, adapting, scaling, reinventing, and digitally transforming themselves.",
  valuesHeading: "Grow and succeed through transformation",
  expertiseHeading: "Constantly Innovating",
  // Carries the company's own "16 years", which was written against 2024.
  // It is quoted and attributed in the UI rather than spoken in this site's
  // voice, so the published sentence stays intact without this site asserting
  // a number that ages. See `foundedNote` for the evergreen phrasing.
  expertiseBody:
    "Our 16 years in business have acquainted us to a diverse list of industries with different requirements. We have consistently proven our adaptability to all kinds of business models, irrespective of their industry.",
  csrHeading: "Better future creates better lives",
  csrBody:
    "Bringing together the corporate and the society in a philanthropic effort because we acknowledge the role of society in making us, who we are.",

  /* --- our approach -------------------------------------------------------- */
  approachHeading: "Experience directed by iteration",
  approachIntro:
    "Linkfields follows a systematic, step-by-step approach which is often derived through blueprints and strategy based on real insights. Our experienced professionals are agile in their work, but also very thorough. Through the best combination of objectivity and subjectivity, we deliver results.",
  explorationHeading: "A recipe for success",

  /* --- ai & machine learning ----------------------------------------------- */
  aiHeading: "AI, let it ease your complex operations",
  aiOverviewHeading: "Hassling over redundancy, a thing of the past",
  aiOverview:
    "Machine learning (ML) and Artificial Intelligence (AI) are computer sciences which focus on the use of data and algorithms to imitate the way that humans learn, gradually letting them improve accuracy by themselves.",
  aiHelpHeading: "Intelligent systems that save time",
  aiProcessHeading: "Smart analysis for quicker insights",
  aiProcess:
    "Through a very well-defined, step-by-step process, we help you define your business objectives, create a platform to smartly collect and organize data, which is then analyzed thoroughly to derive smart insights which you can infuse into your business strategy, achieving great results.",

  /* --- contact -------------------------------------------------------------- */
  contactHeading: "Let's connect over a virtual coffee",
  nextSteps: [
    "Our sales team will get in touch within 24 hours",
    "If required, we sign on a NDA with you, to assure the highest level of privacy.",
    "Once we have analysed your business requirements our sales team will provide you with the next steps.",
  ],
};

export const company = {
  name: "Linkfields Innovations",
  shortName: "LFI",
  aiBrand: "Linkfields AI",
  // As published on the About Us page. (South African registrations are
  // normally "(Pty)"; the official site writes "(Pvt)", and this follows the
  // source rather than correcting it.)
  legalName: "Linkfields Innovations (Pvt) Ltd",
  tagline: "exploring innovation",
  foundedYear: 2008,
  foundedNote: "Established in 2008 in South Africa.",
  headline: official.headline,
  positioning: official.positioning,
  vision: official.vision,
  mission: official.mission,
  values: ["Innovation", "Courage", "Respect", "Impact", "Passion", "Ownership"],
};

export const contact = {
  // Published on linkfields.com/contact-us
  emails: {
    general: "info@linkfields.com",
    sales: "sales@linkfields.com",
    careers: "careers@linkfields.com",
  },
  primaryEmail: "sales@linkfields.com",
  linkedin: "https://www.linkedin.com/company/linkfieldsinnovations",
  contactPage: `${PARENT_SITE}/contact-us`,
};

/** Offices exactly as published on linkfields.com/contact-us */
export const offices = [
  {
    country: "South Africa",
    code: "ZA",
    phone: "+27 11 022 6666",
    address:
      "Block H, Midridge Office Estate, International Business Gateway, Cnr 6th Street, Midrand, 1684",
  },
  {
    country: "India",
    code: "IN",
    phone: "+91 40 4547 4849",
    address:
      "809, 8th Floor, Gowra Fountain Head, Raheja Mindspace IT Park, Hitech City, Hyderabad, 500081",
  },
  {
    country: "United States",
    code: "US",
    phone: "+1 347 871 0999",
    address: "1604, 447 Broadway, 2nd Floor, New York, 10013",
  },
  {
    country: "United Arab Emirates",
    code: "AE",
    phone: "+971 50 688 5758",
    address: "409, Churchill Towers, Business Bay, Dubai, 1686",
  },
  {
    country: "Australia",
    code: "AU",
    phone: "+61 45 124 6666",
    address: "Level 40, 140 William Street, Melbourne, 3000, VIC",
  },
  {
    country: "Botswana",
    code: "BW",
    phone: "+267 311 9073",
    address: "AGA House, Plot 28576, Gaborone Industrial, Gaborone",
  },
];

/**
 * The six company values, with the descriptions exactly as published on
 * linkfields.com/company/about-us under "OUR VALUES". These sentences were
 * previously lightly trimmed on this site; they are now the official text
 * character for character, including the source's own spelling.
 */
export const values = [
  {
    name: "Innovation",
    body: "Infusing creativity and high skill to create solutions that fix problems in the most effective way.",
  },
  {
    name: "Courage",
    body: "Our experts have the courage to try out ideas which have been untested before.",
  },
  {
    name: "Respect",
    body: "We value kindness and empathy, qualities which we believe keep the race healthy.",
  },
  {
    name: "Impact",
    body: "Everyday we try harder to create impact on the world and our clients, that is positive and everlasting.",
  },
  {
    name: "Passion",
    body: "We encourage rigorous discourse and never settle for anything but the best.",
  },
  {
    name: "Ownership",
    body: "We own up to ourselves, our actions, and our organization's impact.",
  },
];

/**
 * Recognition published on linkfields.com. Stated as published, with a link
 * back to the official source - no numbers are added or extrapolated here.
 */
export const recognition = [
  {
    label: "Financial Times / Statista 2023",
    detail: "Ranked 38th in Africa's top 100 fastest-growing companies.",
  },
  {
    label: "Great Place to Work",
    detail: "Certified employer.",
  },
  {
    label: "Youth Employment Service",
    detail: "Partner of the YES initiative in South Africa.",
  },
];

/**
 * Insights & Updates, exactly as featured on linkfields.com.
 *
 * Titles, kinds and destinations are the published ones - two are external
 * articles the official site links out to, one is a post on its own blog.
 * Nothing here is written, dated or summarised by this site: an invented
 * article with a plausible headline is the single most damaging thing a
 * marketing page can contain.
 */
export const insights = [
  {
    kind: "News",
    title: "FT ranking: Africa's Fastest Growing Companies 2023",
    href: "https://www.ft.com/africas-fastest-growing-companies-2023",
    source: "ft.com",
    external: true,
  },
  {
    kind: "Blog",
    title: "AI in the Finance Sector: How to Benefit from Conversational AI?",
    href: `${PARENT_SITE}/company/blog/AI%20changing%20lives`,
    source: "linkfields.com",
    external: true,
  },
  {
    kind: "News",
    title: "These are the 20 fastest-growing companies in South Africa",
    href: "https://businesstech.co.za/news/business/685565/these-are-the-20-fastest-growing-companies-in-south-africa/",
    source: "businesstech.co.za",
    external: true,
  },
];

/** Parent-company links used across the site. Paths verified from its nav. */
export const parentLinks = {
  home: `${PARENT_SITE}/`,
  about: `${PARENT_SITE}/company/about-us`,
  approach: `${PARENT_SITE}/company/our-approach`,
  aiml: `${PARENT_SITE}/services/technology/ai-ml`,
  careers: `${PARENT_SITE}/careers`,
  blog: `${PARENT_SITE}/company/blog`,
  news: `${PARENT_SITE}/company/news-and-articles`,
  contact: `${PARENT_SITE}/contact-us`,
  privacy: `${PARENT_SITE}/privacy-policy`,
  terms: `${PARENT_SITE}/terms-of-use`,
  cookies: `${PARENT_SITE}/cookies-policy`,
};
