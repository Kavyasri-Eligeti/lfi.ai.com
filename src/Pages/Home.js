import React, { useEffect } from "react";
import Layout from "../components/layout/Layout";
import Hero from "../components/sections/Hero";
import Introduction from "../components/sections/Introduction";
import Solutions from "../components/sections/Solutions";
import Products from "../components/sections/Products";
import IndustriesSection from "../components/sections/IndustriesSection";
import Process from "../components/sections/Process";
import Enterprise from "../components/sections/Enterprise";
import Services from "../components/sections/Services";
import WhyLinkfields from "../components/sections/WhyLinkfields";
import Insights from "../components/sections/Insights";
import Contact from "../components/sections/Contact";
import { setMeta } from "../utils/meta";

/**
 * The marketing homepage.
 *
 * The order is an argument, read top to bottom:
 *
 *   Hero          - what this is.
 *   Introduction  - who builds it, in Linkfields' own published words.
 *   Solutions     - the six AI & ML capabilities. The core of the site.
 *   Products      - the named products those capabilities became.
 *   Industries    - where they apply.
 *   Process       - how an engagement actually runs.
 *   Enterprise    - the platforms an AI model has to integrate with.
 *   Services      - the practice around the model.
 *   WhyLinkfields - credibility and the official company values.
 *   Insights      - published articles, at their original sources.
 *   Contact       - the ask.
 *
 * Capability -> proof -> application -> delivery -> context -> credibility.
 * Enterprise and Services sit together deliberately: both answer "what else
 * does this company do", and splitting them would make the page read as two
 * separate pitches.
 */
export default function Home() {
  useEffect(() => {
    setMeta({
      title:
        "Linkfields AI - Enterprise AI, Machine Learning & Intelligent Automation",
      description:
        "Linkfields Innovations builds enterprise AI, machine learning and intelligent automation for banking, insurance, telecom and manufacturing - with a working demonstration behind every capability.",
      path: "/",
    });
  }, []);

  return (
    <Layout>
      <Hero />
      <Introduction />
      <Solutions />
      <Products />
      <IndustriesSection />
      <Process />
      <Enterprise />
      <Services />
      <WhyLinkfields />
      <Insights />
      <Contact />
    </Layout>
  );
}
