import React, { useState } from 'react';
import './FaqSection.css';

const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: 'How does VoteSecure guarantee voter privacy?',
      a: 'VoteSecure uses zero-knowledge cryptography and homomorphic encryption. This decouples voter identity from the cast ballot paper so no administrator or third party can trace a vote back to a specific individual.'
    },
    {
      q: 'How are election results verified?',
      a: 'Each cast ballot generates an immutable cryptographic receipt hash. Anyone with audit permissions can verify that all votes were counted accurately without revealing individual choices.'
    },
    {
      q: 'Can voters vote from mobile devices?',
      a: 'Yes! VoteSecure is 100% web-based and responsive. Voters can securely cast their ballots from any smartphone, tablet, laptop, or desktop browser with zero software installation required.'
    },
    {
      q: 'What prevents voters from voting multiple times?',
      a: 'Voter eligibility is verified via unique secure single-use tokens, OAuth identity providers, or biometric MFA. Once a token is redeemed, it cannot be reused.'
    },
    {
      q: 'How can our institution start an election?',
      a: 'Setting up an election takes under 5 minutes! Simply click "Get Started", import your voter directory, create candidate profiles, and schedule your poll start and end time.'
    }
  ];

  return (
    <section id="faq" className="faq-section">
      <div className="container">
        <div className="faq-header">
          <span className="badge-pill faq-badge">
            Got Questions?
          </span>
          <h2 className="faq-title">
            Frequently Asked Questions
          </h2>
          <p className="faq-subtitle">
            Everything you need to know about the VoteSecure platform
          </p>
        </div>

        <div className="faq-container">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div 
                key={idx}
                className={`faq-card ${isOpen ? 'open' : ''}`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="faq-toggle-btn"
                >
                  <span className="faq-question">
                    {faq.q}
                  </span>
                  <span className={`faq-icon-circle ${isOpen ? 'active' : ''}`}>
                    {isOpen ? '−' : '+'}
                  </span>
                </button>

                {isOpen && (
                  <div className="faq-answer">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
