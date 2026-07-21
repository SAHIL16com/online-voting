import React from 'react';
import { useNavigate } from 'react-router-dom';
import './VotingStatusPage.css';

const VotingStatusPage = () => {
  const navigate = useNavigate();

  const records = [
    {
      id: 1,
      election: 'Presidential Election 2024',
      voted: true,
      timestamp: '21 Jul 2026, 03:45 PM',
      receiptId: 'REC-8849201'
    },
    {
      id: 2,
      election: 'Student Council Election 2024',
      voted: false,
      timestamp: null,
      receiptId: null
    },
    {
      id: 3,
      election: 'Sports Head Election 2024',
      voted: false,
      timestamp: null,
      receiptId: null
    }
  ];

  return (
    <div className="voting-status-container">
      <h1 className="voting-status-title">Voting Status</h1>

      <div className="status-main-card">
        <div className="status-cards-list">
          {records.map((item) => (
            <div key={item.id} className="status-item-card">
              <div className="status-item-left">
                <div className={`status-icon-badge ${item.voted ? '' : 'not-voted'}`}>
                  {item.voted ? (
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
                  <h3 className="status-election-title">{item.election}</h3>
                  {item.voted ? (
                    <span className="status-receipt-text">
                      Voted on {item.timestamp} • Receipt: {item.receiptId}
                    </span>
                  ) : (
                    <span style={{ fontSize: '0.82rem', color: '#94A3B8' }}>
                      You have not cast your vote in this election yet.
                    </span>
                  )}
                </div>
              </div>

              <div>
                {item.voted ? (
                  <span className="voted-badge">✓ Voted</span>
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default VotingStatusPage;
