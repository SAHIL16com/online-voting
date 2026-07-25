import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useElections } from '../../../context/ElectionsContext';
import { useAuth } from '../../../context/AuthContext';
import './VotingStatusPage.css';

const VotingStatusPage = () => {
  const navigate = useNavigate();
  const { elections, loading } = useElections();
  const { token } = useAuth();

  const [voteStatuses, setVoteStatuses] = useState({});
  const [checking, setChecking] = useState(true);

  // Filter current/upcoming elections
  const currentElections = elections.filter((e) => e.status === 'Active' || e.status === 'Upcoming');

  useEffect(() => {
    const fetchVoteStatuses = async () => {
      const statuses = {};
      const currentToken = token || localStorage.getItem('voting_token');

      for (const el of currentElections) {
        if (el.status !== 'Active') {
          statuses[el._id] = { voted: false, receiptId: null, timestamp: null };
          continue;
        }

        try {
          const response = await fetch(`/api/votes/check/${el._id}`, {
            headers: {
              Authorization: `Bearer ${currentToken}`
            }
          });
          if (response.ok) {
            const data = await response.json();
            statuses[el._id] = {
              voted: data.hasVoted,
              receiptId: data.vote?._id || null,
              timestamp: data.vote?.createdAt ? new Date(data.vote.createdAt).toLocaleString() : null
            };
          } else {
            statuses[el._id] = { voted: false, receiptId: null, timestamp: null };
          }
        } catch (err) {
          statuses[el._id] = { voted: false, receiptId: null, timestamp: null };
        }
      }
      setVoteStatuses(statuses);
      setChecking(false);
    };

    if (currentElections.length > 0) {
      fetchVoteStatuses();
    } else {
      setChecking(false);
    }
  }, [elections, token]);

  return (
    <div className="voting-status-container">
      <h1 className="voting-status-title">Voting Status</h1>

      <div className="status-main-card">
        {loading || checking ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#64748B' }}>Checking voting statuses...</div>
        ) : currentElections.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', border: '1px dashed #E2E8F0', borderRadius: '24px', color: '#64748B', backgroundColor: '#FFFFFF' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🗳️</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>No Elections Scheduled</h3>
            <p style={{ fontSize: '0.9rem', color: '#64748B', marginTop: '0.4rem' }}>
              There are no active or upcoming elections at this time.
            </p>
          </div>
        ) : (
          <div className="status-cards-list">
            {currentElections.map((item) => {
              const statusData = voteStatuses[item._id] || { voted: false, receiptId: null, timestamp: null };
              const isUpcoming = item.status === 'Upcoming';

              return (
                <div key={item._id} className="status-item-card">
                  <div className="status-item-left">
                    <div className={`status-icon-badge ${statusData.voted ? '' : 'not-voted'}`}>
                      {statusData.voted ? (
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M20 6L9 17l-5-5"/>
                        </svg>
                      ) : (
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"/>
                          <line x1="12" y1="8" x2="12" y2="12"/>
                          <line x1="12" y1="16" x2="12.01" y2="16"/>
                        </svg>
                      )}
                    </div>

                    <div className="status-item-info">
                      <h3 className="status-election-title">{item.name}</h3>
                      {statusData.voted ? (
                        <span className="status-receipt-text">
                          Voted on {statusData.timestamp} • Receipt: {statusData.receiptId}
                        </span>
                      ) : isUpcoming ? (
                        <span style={{ fontSize: '0.82rem', color: '#CA8A04', fontWeight: 700 }}>
                          Upcoming (Polls open soon)
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.82rem', color: '#94A3B8' }}>
                          You have not cast your vote in this election yet.
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    {statusData.voted ? (
                      <span className="voted-badge">✓ Voted</span>
                    ) : isUpcoming ? (
                      <span className="not-voted-badge" style={{ backgroundColor: '#FEF3C7', color: '#D97706' }}>Not Started</span>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span className="not-voted-badge">Not Voted</span>
                        <button
                          onClick={() => navigate('/voter/vote')}
                          style={{
                            padding: '0.5rem 1.1rem',
                            borderRadius: '10px',
                            border: 'none',
                            backgroundColor: '#2E7D47',
                            color: '#FFFFFF',
                            fontWeight: 700,
                            fontSize: '0.85rem',
                            cursor: 'pointer'
                          }}
                        >
                          Vote Now
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default VotingStatusPage;
