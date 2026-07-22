import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useElections } from '../../../context/ElectionsContext';
import { useAuth } from '../../../context/AuthContext';
import './VotePage.css';

const VotePage = () => {
  const navigate = useNavigate();
  const { elections } = useElections();
  const { token } = useAuth();

  const [selectedCandidateId, setSelectedCandidateId] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [receiptId, setReceiptId] = useState('');
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [submittingVote, setSubmittingVote] = useState(false);

  const activeElection = elections.find((e) => e.status === 'Active');
  const electionCandidates = activeElection?.candidates || [];

  // Check if voter has already voted in this active election on mount
  useEffect(() => {
    const checkVotedStatus = async () => {
      if (!activeElection) {
        setCheckingStatus(false);
        return;
      }
      try {
        const currentToken = token || localStorage.getItem('voting_token');
        const response = await fetch(`/api/votes/check/${activeElection._id}`, {
          headers: {
            Authorization: `Bearer ${currentToken}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          if (data.hasVoted) {
            setHasVoted(true);
            setReceiptId(data.vote?._id || `REC-${Math.floor(1000000 + Math.random() * 9000000)}`);
          }
        }
      } catch (err) {
        console.error('Failed to check vote status:', err);
      } finally {
        setCheckingStatus(false);
      }
    };

    checkVotedStatus();
  }, [activeElection, token]);

  const handleCastVote = async () => {
    if (!selectedCandidateId || !activeElection) return;
    setSubmittingVote(true);

    try {
      const currentToken = token || localStorage.getItem('voting_token');
      const response = await fetch('/api/votes/cast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentToken}`
        },
        body: JSON.stringify({
          electionId: activeElection._id,
          candidateId: selectedCandidateId
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to cast vote');
      }

      const data = await response.json();
      setReceiptId(data.vote?._id || `REC-${Math.floor(1000000 + Math.random() * 9000000)}`);
      setHasVoted(true);
      alert('Your vote has been cast successfully!');
    } catch (err) {
      alert(err.message || 'Failed to cast vote. Please try again.');
    } finally {
      setSubmittingVote(false);
    }
  };

  const selectedCandidate = electionCandidates.find((c) => c._id === selectedCandidateId);

  if (checkingStatus) {
    return (
      <div className="vote-page-container">
        <div className="vote-main-card" style={{ textAlign: 'center', padding: '3rem 1.5rem', color: '#64748B' }}>
          Checking poll availability and voting status...
        </div>
      </div>
    );
  }

  return (
    <div className="vote-page-container">
      <h1 className="vote-page-title">Cast Your Vote</h1>

      <div className="vote-main-card">
        {!activeElection ? (
          <div style={{ textAlign: 'center', padding: '3rem 1.5rem', color: '#64748B' }}>
            <div className="success-icon-circle" style={{ backgroundColor: '#FEF3C7', color: '#B45309', marginBottom: '1.5rem' }}>
              ⚠️
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              No Active Poll Open
            </h2>
            <p style={{ color: '#64748B', fontSize: '0.95rem', margin: '0.5rem 0 0' }}>
              There are no active elections currently running. Please contact admin or wait until polls start.
            </p>
          </div>
        ) : !hasVoted ? (
          <>
            <div className="vote-header-info">
              <div>
                <span style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 600 }}>Active Election</span>
                <h2 className="election-active-name">{activeElection.name}</h2>
              </div>
              <span style={{ backgroundColor: '#DCFCE7', color: '#15803D', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 800 }}>
                ● Poll Open
              </span>
            </div>

            {electionCandidates.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#64748B', border: '1px dashed #E2E8F0', borderRadius: '16px', marginTop: '1rem' }}>
                No candidates shortlisted for this election yet.
              </div>
            ) : (
              <div className="candidates-selection-grid">
                {electionCandidates.map((cand) => {
                  const isSelected = selectedCandidateId === cand._id;
                  return (
                    <div
                      key={cand._id}
                      onClick={() => setSelectedCandidateId(cand._id)}
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
                        <img src={cand.photo || '/candidate_priya.png'} alt={cand.name} />
                      </div>

                      <h3 className="candidate-card-name">{cand.name}</h3>
                      <span className="candidate-card-dept">{cand.department || 'General'}</span>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="vote-actions-footer">
              <span className="selected-summary-text">
                Selected: <strong>{selectedCandidate ? selectedCandidate.name : 'None'}</strong>
              </span>

              <button
                disabled={!selectedCandidateId || submittingVote}
                onClick={handleCastVote}
                className="submit-vote-btn"
              >
                {submittingVote ? 'Casting Vote...' : 'Confirm & Cast Vote'}
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
              Your vote has been securely saved and encrypted in the database.
            </p>

            <div className="receipt-code-box" style={{ fontSize: '0.82rem', fontFamily: 'monospace' }}>
              Vote Receipt ID: {receiptId}
            </div>

            <button
              onClick={() => navigate('/voter/dashboard')}
              className="submit-vote-btn"
              style={{ marginTop: '1rem' }}
            >
              Back to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VotePage;
