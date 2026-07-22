import React, { useState } from 'react';
import { useCandidates } from '../../../context/CandidatesContext';
import { useElections } from '../../../context/ElectionsContext';
import './ResultsPage.css';

const ResultsPage = () => {
  const { candidates } = useCandidates();
  const { elections, togglePublishResult } = useElections();

  const [selectedElectionName, setSelectedElectionName] = useState(
    elections[0]?.name || 'College President Election 2024'
  );

  const currentElection = elections.find((e) => e.name === selectedElectionName) || elections[0];
  const isPublished = currentElection ? currentElection.isPublished : false;

  const leadingCandidate = candidates[0];
  const totalVotesCount = candidates.reduce((sum, item) => sum + item.votes, 0);

  const handlePublishToggle = () => {
    if (currentElection) {
      togglePublishResult(currentElection.id);
      if (!isPublished) {
        alert('Election results published successfully!');
      } else {
        alert('Election results un-published.');
      }
    }
  };

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

        <button onClick={handlePublishToggle} className="publish-result-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
            <polyline points="16 6 12 2 8 6"/>
            <line x1="12" y1="2" x2="12" y2="15"/>
          </svg>
          {isPublished ? 'Unpublish Result' : 'Publish Result'}
        </button>
      </div>

      <div className="results-main-grid">
        <div className="leading-candidate-card">
          <span className="leading-badge">Leading Candidate</span>

          <div className="leading-avatar-wrapper">
            <img
              src={leadingCandidate?.photo}
              alt={leadingCandidate?.name}
              className="leading-avatar-img"
            />
          </div>

          <h2 className="leading-name">{leadingCandidate?.name}</h2>
          <p className="leading-dept">{leadingCandidate?.department}</p>

          <span className="leading-votes-count">{leadingCandidate?.displayVotes}</span>
          <span className="leading-percent">{leadingCandidate?.percentage}</span>
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
            {candidates.map((item) => (
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
            ))}
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
