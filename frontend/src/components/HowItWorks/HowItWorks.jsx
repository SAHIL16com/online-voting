import React from 'react';
import './HowItWorks.css';

const HowItWorks = () => {
  const steps = [
    {
      step: '1',
      title: 'Register',
      description: 'Create your account and verify your identity securely via multi-factor authentication.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="8.5" cy="7" r="4"/>
          <line x1="20" y1="8" x2="20" y2="14"/>
          <line x1="23" y1="11" x2="17" y2="11"/>
        </svg>
      )
    },
    {
      step: '2',
      title: 'Vote',
      description: 'Choose your candidate and cast your vote with a single tap in absolute secrecy.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <path d="m9 15 2 2 4-4"/>
        </svg>
      )
    },
    {
      step: '3',
      title: 'Results',
      description: 'Results are calculated and published transparently in real-time as polls close.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10"/>
          <line x1="12" y1="20" x2="12" y2="4"/>
          <line x1="6" y1="20" x2="6" y2="14"/>
        </svg>
      )
    },
    {
      step: '4',
      title: 'Verified',
      description: 'Every vote is verified with an immutable cryptographic receipt for full peace of mind.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          <path d="m9 12 2 2 4-4"/>
        </svg>
      )
    }
  ];

  return (
    <section id="how-it-works" className="how-it-works-section">
      <div className="container">
        <div className="how-it-works-header">
          <h2 className="how-it-works-title">
            How It Works
          </h2>
          <p className="how-it-works-subtitle">
            Cast your ballot safely in four easy steps
          </p>
        </div>

        <div className="how-it-works-grid">
          {steps.map((item) => (
            <div key={item.step} className="step-card">
              <div className="step-icon-wrapper">
                {item.icon}
                <span className="step-number-badge">
                  {item.step}
                </span>
              </div>

              <h3 className="step-title">
                {item.step}. {item.title}
              </h3>

              <p className="step-desc">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
