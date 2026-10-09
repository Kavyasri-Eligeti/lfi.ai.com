# 02 · Corporate content inventory

_Re-verified against linkfields.com on 1 October 2026. All corporate content is data in `src/content/`._

| Area | File | Source | Notes |
|---|---|---|---|
| Hero, story, vision, mission, values, approach, CSR | `company.js` | `/`, `/company/about-us`, `/company/our-approach` | **Mission, values and approach now use the exact published wording** (the earlier branch paraphrased them). Approach principles are titles only, as published. The four "A recipe for success" steps are verbatim |
| Recognition | `company.js` | home, footer | FT/Statista 2023: 38th · Great Place to Work® · ISO/IEC 27001:2022 · ISO 9001:2015 · YES partner · NASSCOM and DUNS memberships. "16 years" is not used (out of date). Founding year 2008 is used instead |
| Partners (9) | `company.js` | home carousel | Logos are the SVG files linkfields.com publishes, unmodified (`public/images/partners/`). Links point to each partner's home page |
| Offices (6) | `company.js` | `/contact-us` | Published addresses, phone numbers and **Get direction** links. Markers use city-level positions. No headquarters label (not published) |
| Emails | `company.js` | `/contact-us` | info@, sales@, careers@linkfields.com |
| Socials | `company.js` | footer, metadata | LinkedIn (public company page: the footer link on linkfields.com goes to an admin URL), X, YouTube, GoodFirms |
| Legal | `company.js` | footer | Privacy Policy, Terms of Use, Cookies Policy |
| Services (7) | `services.js` | `/services/*` and 16 sub-pages | Overview titles and texts and every sub-service tagline and summary verbatim, each linked to its page. IT Infrastructure has its 3 published groups (12 items) |
| Solutions (7) | `solutions.js` | ERP pages, RPA, iPaaS, header menu | **Testorium Z added** (it was missing). iPaaS has 9 offerings and RPA 7, matching the site |
| Industries (8) | `industries.js` | home cards, `/industries/*` | Taglines added. Name "Oil & Gas" as on the page. Six published photos are used. FMCG and Manufacturing have none: their published images carry third-party branding or "Unsplash+" watermarks |
| Careers | `careers.js` | `/careers` | Verbatim text, the official "Find jobs" link, published photos (including the Linkfields office reception). No vacancies or benefits are invented. "Craftmenship" is shown as "Craftsmanship" |
| Insights (8) | `insights.js` | home, `/company/news-and-articles` | 3 blog posts with their published dates. 5 press links have no dates, because the site shows none |

## Open questions for Linkfields
1. Legal name: the site uses "(Pvt) Ltd", "Pty Ltd" and "(Pty) Ltd". The copyright line uses the legal-page form, "(Pty) Ltd".
2. Midrand postcode: 1684 on the page, 1686 in the site metadata. 1684 is used.
3. Home-page counters (150+ solutions, 5 mn journeys, 10x growth): no source or date on the site, so not used.
4. Industry photos for FMCG and Manufacturing.
5. A dark-wordmark logo for use on light backgrounds.
