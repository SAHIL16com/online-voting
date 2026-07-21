import React from 'react';
import './SecurityTrust.css';

const SecurityTrust = () => {
  const securityFeatures = [
    {
      title: 'End-to-End Encryption',
      desc: 'Ballots are encrypted on the voter device before transmission, preventing any middleman exposure.',
      badge: 'AES-256 & RSA-4096'
    },
    {
      title: 'Zero-Knowledge Audits',
      desc: 'Verify election results with mathematical certainty without compromising individual voter privacy.',
      badge: 'ZKP Cryptography'
    },
    {
      title: 'Biometric & Identity Auth',
      desc: 'Seamless multi-factor identity verification preventing duplicate or unauthorized voting.',
      badge: 'MFA Verification'
    }
  ];

  return (
    <section id="about" className="security-trust-section">
      <div className="container">
        <div className="security-trust-grid">
          <div>
            <span className="badge-pill security-trust-badge">
              Bank-Grade Security
            </span>
            <h2 className="security-trust-title">
              Uncompromising Security for Every Single Vote
            </h2>
            <p className="security-trust-desc">
              Our platform combines military-grade encryption standards with public auditability, ensuring that no vote can be altered, duplicated, or deleted.
            </p>

            <div className="security-features-list">
              {securityFeatures.map((sec, idx) => (
                <div key={idx} className="sec-feature-item">
                  <div className="sec-check-icon">
                    ✓
                  </div>
                  <div>
                    <div className="sec-feature-header">
                      <h4 className="sec-feature-title">{sec.title}</h4>
                      <span className="sec-tag-badge">
                        {sec.badge}
                      </span>
                    </div>
                    <p className="sec-feature-desc">
                      {sec.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card security-shield-card">
            <div className="shield-card-header">
              <div className="shield-icon-box">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  <path d="m9 12 2 2 4-4"/>
                </svg>
              </div>
              <div>
                <h3 className="shield-card-title">Security Compliance Shield</h3>
                <p className="shield-card-subtitle">Certified & Audited Architecture</p>
              </div>
            </div>

            <div className="shield-items-list">
              <div className="shield-item-row">
                <span className="shield-item-name">SOC 2 Type II Certified</span>
                <span className="shield-item-status">PASSED ✓</span>
              </div>

              <div className="shield-item-row">
                <span className="shield-item-name">GDPR Privacy Compliant</span>
                <span className="shield-item-status">VERIFIED ✓</span>
              </div>

              <div className="shield-item-row">
                <span className="shield-item-name">ISO/IEC 27001 Certified</span>
                <span className="shield-item-status">ACTIVE ✓</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecurityTrust;
