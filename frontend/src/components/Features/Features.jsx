import React from 'react';
import './Features.css';

const Features = () => {
  const featuresList = [
    {
      id: 'secure',
      title: 'Secure',
      description: 'End-to-end encryption keeps your vote safe and tamper-proof.',
      iconBg: '#DCFCE7',
      imgSrc: '/feature_secure.png',
      alt: 'Secure Icon'
    },
    {
      id: 'transparent',
      title: 'Transparent',
      description: 'Real-time results and clear audit trails with publicly verifiable hashes.',
      iconBg: '#E0F2FE',
      imgSrc: '/feature_transparent.png',
      alt: 'Transparent Icon'
    },
    {
      id: 'accessible',
      title: 'Accessible',
      description: 'Vote anytime, anywhere from any device with zero software installation.',
      iconBg: '#F3E8FF',
      imgSrc: '/feature_accessible.png',
      alt: 'Accessible Icon'
    },
    {
      id: 'reliable',
      title: 'Reliable',
      description: 'High availability, zero vote manipulation, and automated failure recovery.',
      iconBg: '#FEF3C7',
      imgSrc: '/feature_reliable.png',
      alt: 'Reliable Icon'
    }
  ];

  return (
    <section id="features" className="features-section">
      <div className="container">
        <div className="features-header">
          <span className="badge-pill features-badge">
            Why Choose VoteSecure
          </span>
          <h2 className="features-title">
            Designed for Trust & Simplicity
          </h2>
          <p className="features-subtitle">
            Built with modern security protocols to ensure every ballot counts accurately.
          </p>
        </div>

        <div className="features-grid">
          {featuresList.map((item) => (
            <div 
              key={item.id}
              className="glass-card feature-card"
            >
              <div 
                className="feature-icon-wrapper"
                style={{ backgroundColor: item.iconBg }}
              >
                <img 
                  src={item.imgSrc} 
                  alt={item.alt} 
                  className="feature-icon-img" 
                />
              </div>

              <h3 className="feature-card-title">
                {item.title}
              </h3>

              <p className="feature-card-desc">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
