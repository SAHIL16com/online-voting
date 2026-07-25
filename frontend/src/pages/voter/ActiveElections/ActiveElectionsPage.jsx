import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useElections } from '../../../context/ElectionsContext';
import './ActiveElectionsPage.css';

const ActiveElectionsPage = () => {
  const navigate = useNavigate();
  const { elections, loading } = useElections();

  // Filter only Active elections from database
  const activeElections = elections.filter((e) => e.status === 'Active');

  return (
    <div className="active-elections-container">
      <h1 className="active-elections-title">Active Elections</h1>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#64748B' }}>Loading active polls...</div>
      ) : activeElections.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', border: '1px dashed #E2E8F0', borderRadius: '24px', color: '#64748B', backgroundColor: '#FFFFFF' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🗳️</div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>No Active Polls Open</h3>
          <p style={{ fontSize: '0.9rem', color: '#64748B', marginTop: '0.4rem' }}>
            There are no elections currently running. Please verify with the administrator or wait for polls to start.
          </p>
        </div>
      ) : (
        <div className="elections-grid-layout">
          {activeElections.map((item) => (
            <div key={item._id} className="election-card-item">
              <div>
                <div className="card-top-row">
                  <span className="election-badge-live">● Live</span>
                  <span style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 700 }}>
                    {item.candidates ? item.candidates.length : 0} Candidates
                  </span>
                </div>

                <h2 className="election-card-title">{item.name}</h2>
                <p className="election-card-desc">
                  {item.description || `Shortlisted candidates are ready to contest in the ${item.type} category election.`}
                </p>
              </div>

              <div className="election-info-pills">
                <div className="info-pill">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  <span>Started: {item.startDate || 'TBD'}</span>
                </div>
              </div>

              <button onClick={() => navigate('/voter/vote')} className="vote-now-card-btn">
                Vote Now &rarr;
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActiveElectionsPage;
