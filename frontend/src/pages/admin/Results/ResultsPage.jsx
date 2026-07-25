import React, { useState } from 'react';
import { useElections } from '../../../context/ElectionsContext';
import './ResultsPage.css';

const ResultsPage = () => {
  const { elections } = useElections();

  const [selectedElectionName, setSelectedElectionName] = useState(
    elections[0]?.name || 'College President Election 2024'
  );

  const currentElection = elections.find((e) => e.name === selectedElectionName) || elections[0];
  const isPublished = currentElection ? currentElection.isPublished : false;

  const getProcessedElectionCandidates = () => {
    if (!currentElection || !currentElection.candidates) return [];
    const electionCands = currentElection.candidates;
    const totalVotes = electionCands.reduce((sum, c) => sum + (c.votes || 0), 0);
    return electionCands.map((c) => {
      const v = c.votes || 0;
      const pct = totalVotes > 0 ? ((v / totalVotes) * 100).toFixed(1) : '0.0';
      return {
        id: c._id,
        _id: c._id,
        name: c.name,
        department: c.partyGroup || 'General',
        votes: v,
        displayVotes: `${v.toLocaleString()} Votes`,
        percent: `${pct}%`,
        percentage: `${pct}%`,
        progress: parseFloat(pct),
        photo: c.photo || '/candidate_priya.png',
        status: c.status || 'Active',
      };
    });
  };

  const electionCandidates = getProcessedElectionCandidates();
  const sortedCandidates = [...electionCandidates].sort((a, b) => b.votes - a.votes);
  const leadingCandidate = sortedCandidates[0];
  const totalVotesCount = electionCandidates.reduce((sum, item) => sum + item.votes, 0);

  if (!currentElection || currentElection.status === 'Completed' || currentElection.status === 'Upcoming') {
    return (
      <div className="results-page-container">
        <div className="results-top-header">
          <div className="results-header-left">
            <div className="results-select-wrapper">
              <select
                value={selectedElectionName}
                onChange={(e) => setSelectedElectionName(e.target.value)}
                className="election-select-dropdown"
              >
                {elections.map((ele) => (
                  <option key={ele.id} value={ele.name}>
                    {ele.name}
                  </option>
                ))}
              </select>

              {currentElection && (
                <span className={`status-live-badge ${isPublished ? 'published' : ''}`} style={{ backgroundColor: currentElection.status === 'Completed' ? '#F1F5F9' : '#FEF3C7', color: currentElection.status === 'Completed' ? '#475569' : '#D97706', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 700 }}>
                  {currentElection.status}
                </span>
              )}
            </div>
            <p className="last-updated-text">Last updated: Just now</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', textAlign: 'center', border: '1px dashed #E2E8F0', borderRadius: '24px', backgroundColor: '#FFFFFF', padding: '3rem 2rem', marginTop: '1.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: '#94A3B8' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
              <path d="M22 12A10 10 0 0 0 12 2v10z" />
            </svg>
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.5rem' }}>
            {currentElection ? `Election ${currentElection.status}` : 'No Elections Available'}
          </h3>
          <p style={{ fontSize: '0.88rem', color: '#64748B', maxWidth: '380px', margin: 0, lineHeight: 1.5 }}>
            {currentElection?.status === 'Completed' 
              ? 'This election has ended. To view the final results and generate official reports, please navigate to the Reports section.'
              : 'This election has not started yet. Live results will be available once the election status is set to Active.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="results-page-container">
      <div className="results-top-header">
        <div className="results-header-left">
          <div className="results-select-wrapper">
            <select
              value={selectedElectionName}
              onChange={(e) => setSelectedElectionName(e.target.value)}
              className="election-select-dropdown"
            >
              {elections.map((ele) => (
                <option key={ele.id} value={ele.name}>
                  {ele.name}
                </option>
              ))}
            </select>

            <span className={`status-live-badge ${isPublished ? 'published' : ''}`}>
              {isPublished ? 'Published' : 'Live'}
            </span>
          </div>

          <p className="last-updated-text">Last updated: Just now</p>
        </div>
      </div>

      <div className="results-main-grid">
        <div className="leading-candidate-card">
          <span className="leading-badge">Leading Candidate</span>

          {leadingCandidate ? (
            <>
              <div className="leading-avatar-wrapper">
                <img
                  src={leadingCandidate.photo}
                  alt={leadingCandidate.name}
                  className="leading-avatar-img"
                />
              </div>

              <h2 className="leading-name">{leadingCandidate.name}</h2>
              <p className="leading-dept">{leadingCandidate.department}</p>

              <span className="leading-votes-count">{leadingCandidate.displayVotes}</span>
              <span className="leading-percent">{leadingCandidate.percentage}</span>
            </>
          ) : (
            <div style={{ padding: '2rem 1rem', color: '#64748B', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                </svg>
              </div>
              <p style={{ margin: 0, fontWeight: 700, fontSize: '0.95rem' }}>No Candidates</p>
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#94A3B8' }}>No candidates are registered for this election.</p>
            </div>
          )}
        </div>

        <div className="results-overview-card">
          <div className="overview-card-header">
            <h3 className="overview-title">Results Overview</h3>
            <div className="overview-legend">
              <div className="legend-item">
                <span className="legend-dot green" />
                <span>Votes</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot light-green" />
                <span>Percentage</span>
              </div>
            </div>
          </div>

          <div className="bars-list-container">
            {sortedCandidates.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#94A3B8', fontSize: '0.9rem' }}>
                No candidate results available.
              </div>
            ) : (
              sortedCandidates.map((item) => (
                <div key={item.id} className="candidate-bar-row">
                  <span className="bar-candidate-name">{item.name}</span>
                  <div className="bar-graphic-line">
                    <div className="bar-track">
                      <div
                        className="bar-fill"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                    <div className="bar-stats">
                      <span className="stat-votes-val">{item.displayVotes}</span>
                      <span className="stat-percent-val">{item.percentage}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="chart-axis-ticks">
            <span>0</span>
            <span>500</span>
            <span>1K</span>
            <span>1.5K</span>
          </div>
        </div>
      </div>

      <div className="results-stats-bottom-grid">
        <div className="stat-bottom-card">
          <span className="stat-bottom-label">Total Voters</span>
          <span className="stat-bottom-value">{totalVotesCount.toLocaleString()}</span>
        </div>

        <div className="stat-bottom-card">
          <span className="stat-bottom-label">Valid Votes</span>
          <span className="stat-bottom-value">{totalVotesCount.toLocaleString()}</span>
        </div>

        <div className="stat-bottom-card">
          <span className="stat-bottom-label">Invalid Votes</span>
          <span className="stat-bottom-value">0</span>
        </div>

        <div className="stat-bottom-card">
          <span className="stat-bottom-label">Voter Turnout</span>
          <span className="stat-bottom-value">60%</span>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
