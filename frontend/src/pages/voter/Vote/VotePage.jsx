import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCandidates } from '../../../context/CandidatesContext';
import './VotePage.css';

const VotePage = () => {
  const navigate = useNavigate();
  const { candidates, castVoteForCandidate } = useCandidates();
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [receiptId, setReceiptId] = useState('');

  const handleCastVote = () => {
    if (!selectedCandidateId) return;
    castVoteForCandidate(selectedCandidateId);
    const generatedReceipt = `REC-${Math.floor(1000000 + Math.random() * 9000000)}`;
    setReceiptId(generatedReceipt);
    setHasVoted(true);
  };

  const selectedCandidate = candidates.find((c) => c.id === selectedCandidateId);

  return (
    <div className="vote-page-container">
      <h1 className="vote-page-title">Cast Your Vote</h1>

      <div className="vote-main-card">
        {!hasVoted ? (
          <>
            <div className="vote-header-info">
              <div>
                <span style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 600 }}>Active Election</span>
                <h2 className="election-active-name">Presidential Election 2024</h2>
              </div>
              <span style={{ backgroundColor: '#DCFCE7', color: '#15803D', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 800 }}>
                ● Poll Open
              </span>
            </div>

            <div className="candidates-selection-grid">
              {candidates.map((cand) => {
                const isSelected = selectedCandidateId === cand.id;
                return (
                  <div
                    key={cand.id}
                    onClick={() => setSelectedCandidateId(cand.id)}
                    className={`candidate-select-card ${isSelected ? 'selected' : ''}`}
                  >
                    <div className="radio-check-indicator">
                      {isSelected && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      )}
                    </div>

                    <div className="candidate-avatar-frame">
                      <img src={cand.photo} alt={cand.name} />
                    </div>

                    <h3 className="candidate-card-name">{cand.name}</h3>
                    <span className="candidate-card-dept">{cand.department}</span>
                  </div>
                );
              })}
            </div>

            <div className="vote-actions-footer">
              <span className="selected-summary-text">
                Selected: <strong>{selectedCandidate ? selectedCandidate.name : 'None'}</strong>
              </span>

              <button
                disabled={!selectedCandidateId}
                onClick={handleCastVote}
                className="submit-vote-btn"
              >
                Confirm & Cast Vote
              </button>
            </div>
          </>
        ) : (
          <div className="success-vote-card">
            <div className="success-icon-circle">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>

            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Vote Cast Successfully!
            </h2>

            <p style={{ color: '#64748B', fontSize: '0.95rem', margin: 0, maxWidth: '420px' }}>
              Your vote for <strong>{selectedCandidate?.name}</strong> has been encrypted and recorded on VoteSecure blockchain ledger.
            </p>

            <div className="receipt-code-box">
              Digital Receipt ID: {receiptId}
            </div>

            <button
              onClick={() => navigate('/voter/status')}
              className="submit-vote-btn"
              style={{ marginTop: '1rem' }}
            >
              View Voting Status
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VotePage;
