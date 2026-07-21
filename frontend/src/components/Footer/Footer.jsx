import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-wrapper">
      <div className="container">
        <div className="footer-top-grid">
          <div>
            <a href="#home" className="footer-brand-link">
              <div className="footer-brand-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  <path d="m9 12 2 2 4-4"/>
                </svg>
              </div>
              <span className="footer-brand-text">
                Vote<span className="footer-brand-accent">Secure</span>
              </span>
            </a>

            <p className="footer-brand-desc">
              The global standard for secure, transparent, and tamper-proof digital voting systems.
            </p>
          </div>

          <div>
            <h4 className="footer-col-title">
              Platform
            </h4>
            <ul className="footer-links-list">
              <li><a href="#features" className="footer-link">Features</a></li>
              <li><a href="#how-it-works" className="footer-link">How It Works</a></li>
              <li><a href="#faq" className="footer-link">Frequently Asked Questions</a></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-col-title">
              Security & Legal
            </h4>
            <ul className="footer-links-list">
              <li><a href="#about" className="footer-link">Security Architecture</a></li>
              <li><a href="#about" className="footer-link">ISO 27001 Compliance</a></li>
              <li><a href="#about" className="footer-link">Privacy Policy</a></li>
              <li><a href="#about" className="footer-link">Terms of Service</a></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-col-title">
              Stay Updated
            </h4>
            <p className="newsletter-desc">
              Subscribe for security updates and product releases.
            </p>

            <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed to VoteSecure updates!'); }} className="newsletter-form">
              <input 
                type="email" 
                required 
                placeholder="Enter your email"
                className="newsletter-input"
              />
              <button 
                type="submit" 
                className="btn btn-primary newsletter-btn"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <p className="footer-copyright">
            © {new Date().getFullYear()} VoteSecure Inc. All rights reserved. Secure • Transparent • Reliable.
          </p>
          <div className="footer-bottom-meta">
            <span>🌐 English (US)</span>
            <span>🔒 256-Bit SSL Secured</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
