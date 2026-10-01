// Latest insights. Source: linkfields.com "Insights & Updates" and
// /company/news-and-articles. Retrieved 2026-10-01.
// Titles and dates are copied exactly. The press items carry no date on the
// corporate site, so no date is shown for them.
import { CORPORATE_SITE } from './company';

export const insights = [
  {
    id: 'rpa-digital-world',
    type: 'Blog',
    topic: 'RPA',
    title: 'RPA: How is Robotic Process Automation Transforming the Digital World',
    date: '2024-03-21',
    href: `${CORPORATE_SITE}/company/blog/Privacy%20Policy%204`,
  },
  {
    id: 'dt-customer-experience',
    type: 'Blog',
    topic: 'Automation',
    title: 'DT: How Digital Transformation Drives Customer Experience',
    date: '2024-03-13',
    href: `${CORPORATE_SITE}/company/blog/Privacy%20Policy`,
  },
  {
    id: 'ai-finance-conversational',
    type: 'Blog',
    topic: 'Banking',
    title: 'AI in the Finance Sector: How to Benefit from Conversational AI?',
    date: '2024-02-08',
    href: `${CORPORATE_SITE}/company/blog/AI%20changing%20lives`,
  },
  {
    id: 'ft-ranking-2023',
    type: 'News',
    source: 'Financial Times',
    title: "FT ranking: Africa's Fastest Growing Companies 2023",
    href: 'https://www.ft.com/africas-fastest-growing-companies-2023',
  },
  {
    id: 'businesstech-20-fastest',
    type: 'News',
    source: 'BusinessTech',
    title: 'These are the 20 fastest-growing companies in South Africa',
    href: 'https://businesstech.co.za/news/business/685565/these-are-the-20-fastest-growing-companies-in-south-africa/',
  },
  {
    id: 'business-insider-top-100',
    type: 'News',
    source: 'Business Insider Africa',
    title: "Africa's fastest growing companies 2023: A look at the top 100 companies",
    href: 'https://africa.businessinsider.com/local/markets/africas-fastest-growing-companies-2023-a-look-at-the-top-100-companies/tqz4nlr',
  },
  {
    id: 'news24-top-10',
    type: 'News',
    source: 'News24',
    title: "Here are SA's top 10 fastest-growing companies for 2023",
    href: 'https://www.news24.com/news24/tech-and-trends/here-are-sas-top-10-fastest-growing-companies-in-2023-according-to-new-report-20230504',
  },
  {
    id: 'itweb-ft-list',
    type: 'News',
    source: 'ITWeb',
    title: "Who has made it to FT's fastest growing company in Africa list?",
    href: 'https://www.itweb.co.za/article/who-has-made-it-to-fts-fastest-growing-company-in-africa-list/4r1lyMR9ykD7pmda',
  },
];

export const formatInsightDate = (iso) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
