import React from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
  return (
    <section id="home" className="hero-section">
      <div className="container hero-grid">
        <div className="hero-content">
          <div className="badge-pill hero-badge">
            <span className="hero-badge-dot" />
            Secure • Transparent • Reliable
          </div>

          <h1 className="hero-title">
            Your Voice.<br />
            Your Future.<br />
            <span className="hero-title-accent">
              Our Responsibility.
            </span>
          </h1>

          <p className="hero-subtitle">
            VoteSecure is a secure online voting system that ensures transparency, fairness and accessibility for everyone. Empower your organization with tamper-proof elections.
          </p>

          <div className="hero-cta-group">
            <Link to="/register" className="btn btn-primary hero-btn-primary">
              Get Started
            </Link>

            <a 
              href="#how-it-works" 
              className="btn btn-outline hero-btn-outline"
            >
              Learn More
            </a>
          </div>

          <div className="hero-trust-bar">
            <div className="hero-avatar-stack">
              <div className="hero-avatar avatar-green">✓</div>
              <div className="hero-avatar avatar-blue">🔒</div>
              <div className="hero-avatar avatar-purple">⚡</div>
            </div>
            <p className="hero-trust-text">
              Trusted by <strong>250+ universities & corporate institutions</strong>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
