# 02 · Corporate content inventory

All corporate content is data in `src/content/`. Pages render from that data, so correcting the text
means editing one file. Every item carries a `status` (see `src/content/status.js`), and the UI shows it
as a badge.

| Status | Badge | Meaning |
|---|---|---|
| `corporate` | Linkfields offering | Published on linkfields.com |
| `product` | Live demo | Working demo in the LFI AI catalogue |
| `poc` | Proof of concept | Listed as a POC in the catalogue |
| `internal` | Linkfields network only | Needs a private-network backend |
| `demo-supported` | Proposed · demo-backed | Proposed, and an existing demo shows the capability |
| `proposed` | Proposed · awaiting approval | Proposed opportunity, not an offering |
| `technology` | AI technology | General technology, not a Linkfields product |

## Solutions (`content/solutions.js`, source: linkfields.com)
SAP · Odoo · Microsoft Dynamics · Salesforce · iPaaS · RPA. Each has its published headline, intro,
offerings and corporate link.

## Services (`content/services.js`)
Engineering · Consulting · Cloud · Automation · Technology · Teams · IT Infrastructure and Solutions.
Names are exactly as published: **"Technology" and "Teams" are two services** on linkfields.com (the brief
listed "Technology Teams"). Sub-services and their published descriptions are included. Sub-services
without a published description show the name only.

## Industries (`content/industries.js`)
Manufacturing · Telecom · Banking · Insurance · Fintech · FMCG · Mining · Oil and Gas, with verbatim
descriptions and corporate links. `relatedDemos` links only demos that the original catalogue itself
filed under that industry.

## Company (`content/company.js`)
Founded 2008 in South Africa; history; vision; mission; values (Innovation, Courage, Respect, Impact,
Passion, Ownership); Our Approach (4 principles); recognition shown on linkfields.com (FT/Statista 2023
#38, Great Place to Work®, ISO 27001:2022 and ISO 9001, YES partner); partners (Automation Anywhere, UiPath,
Salesforce, Soterion, Odoo, AWS, Azure, Microsoft, Blue Prism), as names only with no third-party logos.

## Offices (`content/company.js › offices`)
Midrand (HQ, South Africa) · Hyderabad (India) · New York (USA) · Dubai (UAE) · Melbourne (Australia) ·
Gaborone (Botswana), with full published addresses and phone numbers. Globe markers use **approximate
city-centre** coordinates only, and the UI says so.

## Contact & social
info@ · sales@ · careers@linkfields.com; LinkedIn (`/company/linkfieldsinnovations/`), X (`@LinkfieldsI`),
YouTube (channel `UCiSaCEnC7Gtu7YkanoA6mpg`); official enquiry form `linkfields.com/contact-us`.

## Careers (`content/careers.js`)
Verbatim headings and text; the six "We Nurture" qualities; the "Find jobs" CTA to
`ditto.jobs/company-profile?id=987835090`. **No vacancies or benefits are invented.**
