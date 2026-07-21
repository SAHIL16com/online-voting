import React from 'react';
import Hero from '../../components/Hero/Hero';
import Features from '../../components/Features/Features';
import HowItWorks from '../../components/HowItWorks/HowItWorks';
import StatsBanner from '../../components/StatsBanner/StatsBanner';
import SecurityTrust from '../../components/SecurityTrust/SecurityTrust';
import FaqSection from '../../components/FaqSection/FaqSection';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <Hero />
      <Features />
      <HowItWorks />
      <StatsBanner />
      <SecurityTrust />
      <FaqSection />
    </div>
  );
};

export default LandingPage;
