import React, { useState, useEffect } from 'react';
import { useElections } from '../../../context/ElectionsContext';
import { useAuth } from '../../../context/AuthContext';
import './ElectionHistoryPage.css';

const ElectionHistoryPage = () => {
  const { elections, loading } = useElections();
  const { token } = useAuth();
  
  const [voterHistoryStatuses, setVoterHistoryStatuses] = useState({});

  const [selectedElection, setSelectedElection] = useState(null);

  // Filter completed/stopped elections
  const completedElections = elections.filter((e) => e.status === 'Completed');

  useEffect(() => {
    const fetchVoterStatuses = async () => {
      const statuses = {};
      const currentToken = token || localStorage.getItem('voting_token');
      
      for (const el of completedElections) {
        try {
          const response = await fetch(`/api/votes/check/${el._id}`, {
            headers: {
              Authorization: `Bearer ${currentToken}`
            }
          });
          if (response.ok) {
            const data = await response.json();
            statuses[el._id] = data.hasVoted ? 'Voted' : 'Did Not Vote';
          } else {
            statuses[el._id] = 'Did Not Vote';
          }
        } catch (err) {
          statuses[el._id] = 'Did Not Vote';
        }
      }
      setVoterHistoryStatuses(statuses);
    };

    if (completedElections.length > 0) {
      fetchVoterStatuses();
    }
  }, [elections, token]);

  const getProcessedHistory = () => {
    return completedElections.map((el) => {
      const cList = el.candidates || [];
      
      let winnerName = 'No Winner';
      let winnerPhoto = '/candidate_priya.png';
      let winnerVotesCount = 0;
      
      if (cList.length > 0) {
        const sorted = [...cList].sort((a, b) => (b.votes || 0) - (a.votes || 0));
        const winner = sorted[0];
        winnerName = winner.name;
        winnerPhoto = winner.photo || '/candidate_priya.png';
        winnerVotesCount = winner.votes || 0;
      }

      let completedDateStr = 'Recently';
      if (el.endDate && el.endDate !== 'TBD') {
        completedDateStr = el.endDate;
      } else if (el.updatedAt) {
        const d = new Date(el.updatedAt);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        completedDateStr = `${yyyy}-${mm}-${dd}`;
      }

      return {
        id: el._id,
        name: el.name,
        isPublished: el.isPublished,
        winner: el.isPublished ? winnerName : 'Results Pending',
        winnerPhoto: el.isPublished ? winnerPhoto : null,
        totalVotes: el.isPublished ? winnerVotesCount.toLocaleString() : 'Pending',
        yourStatus: voterHistoryStatuses[el._id] || 'Checking...',
        date: completedDateStr,
        rawDoc: el
      };
    });
  };

  const historyList = getProcessedHistory();

  return (
    <div className="election-history-container">
      <h1 className="history-title">Election History</h1>

      <div className="history-main-card">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#64748B' }}>Loading history...</div>
        ) : historyList.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', border: '1px dashed #E2E8F0', borderRadius: '24px', color: '#64748B', backgroundColor: '#FFFFFF' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🏛️</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>No Completed Elections</h3>
            <p style={{ fontSize: '0.9rem', color: '#64748B', marginTop: '0.4rem' }}>
              Completed elections and final standings will be recorded here once polls close.
            </p>
          </div>
        ) : (
          <div className="history-table-responsive">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Election Name</th>
                  <th>Winner</th>
                  <th>Winner's Votes</th>
                  <th>Your Status</th>
                  <th>Completed Date</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {historyList.map((row) => (
                  <tr key={row.id}>
                    <td style={{ fontWeight: 700, color: '#0F172A' }}>{row.name}</td>
                    <td>
                      {row.winnerPhoto ? (
                        <div className="history-winner-cell">
                          <img src={row.winnerPhoto} alt={row.winner} className="winner-avatar" />
                          <span>{row.winner}</span>
                        </div>
                      ) : (
                        <span style={{ fontStyle: 'italic', fontWeight: 600, color: '#94A3B8' }}>{row.winner}</span>
                      )}
                    </td>
                    <td>{row.totalVotes}</td>
                    <td>
                      <span className={row.yourStatus === 'Voted' ? 'badge-history-voted' : row.yourStatus === 'Checking...' ? 'badge-history-checking' : 'badge-history-skipped'}>
                        {row.yourStatus}
                      </span>
                    </td>
                    <td>{row.date}</td>
                    <td style={{ textAlign: 'right' }}>
                      {row.isPublished ? (
                        <button
                          onClick={() => setSelectedElection(row.rawDoc)}
                          className="history-preview-btn"
                          style={{
                            backgroundColor: '#E8F5E9',
                            color: '#2E7D47',
                            border: 'none',
                            padding: '0.45rem 1rem',
                            borderRadius: '8px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                          </svg>
                          Preview
                        </button>
                      ) : (
                        <button
                          disabled
                          style={{
                            backgroundColor: '#F1F5F9',
                            color: '#94A3B8',
                            border: 'none',
                            padding: '0.45rem 1rem',
                            borderRadius: '8px',
                            fontWeight: 700,
                            cursor: 'not-allowed',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.4rem'
                          }}
                        >
                          Pending
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Standings Modal */}
      {selectedElection && (
        <div
          className="modal-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1.5rem',
            backdropFilter: 'blur(4px)'
          }}
          onClick={() => setSelectedElection(null)}
        >
          <div
            className="modal-content"
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              width: '100%',
              maxWidth: '580px',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              animation: 'modalSlideUp 0.3s ease-out'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ padding: '1.5rem 1.8rem', borderBottom: '1px solid #EEF2F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FAFDFB' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#2E7D47', letterSpacing: '0.05em' }}>Published Result</span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', margin: '0.2rem 0 0' }}>{selectedElection.name}</h3>
              </div>
              <button
                onClick={() => setSelectedElection(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#F1F5F9' }}
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: '1.8rem', overflowY: 'auto', maxHeight: '420px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: '#F8FAFC', padding: '1rem 1.2rem', borderRadius: '14px', border: '1px solid #F1F5F9' }}>
                <div>
                  <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>ELECTION STATUS</div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#2E7D47', marginTop: '0.2rem' }}>Completed & Published</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>TOTAL VOTES CAST</div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#2E7D47', marginTop: '0.2rem' }}>
                    {selectedElection.candidates.reduce((sum, c) => sum + (c.votes || 0), 0).toLocaleString()}
                  </div>
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#475569', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Candidate Standing & Votes</h4>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {(() => {
                    const totalVotes = selectedElection.candidates.reduce((sum, c) => sum + (c.votes || 0), 0);
                    const sortedCands = [...selectedElection.candidates].sort((a, b) => (b.votes || 0) - (a.votes || 0));
                    
                    return sortedCands.map((cand, index) => {
                      const cvotes = cand.votes || 0;
                      const pct = totalVotes > 0 ? ((cvotes / totalVotes) * 100).toFixed(1) : '0.0';
                      const isWinner = index === 0 && cvotes > 0;
                      
                      return (
                        <div key={cand._id} style={{ border: isWinner ? '2px solid #2E7D47' : '1px solid #E2E8F0', borderRadius: '16px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.8rem', position: 'relative', backgroundColor: isWinner ? '#F9FDF9' : '#FFFFFF' }}>
                          {isWinner && (
                            <span style={{ position: 'absolute', top: '-10px', right: '15px', backgroundColor: '#2E7D47', color: '#FFFFFF', fontSize: '0.7rem', fontWeight: 800, padding: '0.15rem 0.6rem', borderRadius: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                              Winner 🏆
                            </span>
                          )}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                            <img
                              src={cand.photo || '/candidate_priya.png'}
                              alt={cand.name}
                              style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #F1F5F9' }}
                            />
                            <div style={{ flex: 1 }}>
                              <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.92rem' }}>{cand.name}</div>
                              <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 500 }}>{cand.partyGroup || cand.department || 'General'}</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.92rem' }}>{cvotes.toLocaleString()} Votes</div>
                              <div style={{ fontSize: '0.78rem', color: '#2E7D47', fontWeight: 700 }}>{pct}%</div>
                            </div>
                          </div>
                          <div style={{ height: '6px', backgroundColor: '#E2E8F0', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', backgroundColor: '#2E7D47', borderRadius: '3px', width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div style={{ padding: '1.25rem 1.8rem', borderTop: '1px solid #EEF2F6', display: 'flex', justifyContent: 'flex-end', backgroundColor: '#FAFDFB' }}>
              <button
                onClick={() => setSelectedElection(null)}
                style={{ padding: '0.65rem 1.4rem', border: '1px solid #E2E8F0', borderRadius: '10px', backgroundColor: '#FFFFFF', color: '#64748B', fontWeight: 700, cursor: 'pointer' }}
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ElectionHistoryPage;
