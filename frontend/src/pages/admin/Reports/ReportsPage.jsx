import React, { useState } from 'react';
import { useElections } from '../../../context/ElectionsContext';
import { useAuth } from '../../../context/AuthContext';
import './ReportsPage.css';

const ReportsPage = () => {
  const { elections, loading, togglePublishResult } = useElections();
  const { token } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [previewElection, setPreviewElection] = useState(null); // Selected election for modal preview

  const filteredElections = elections.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'All Types' || item.type === typeFilter;
    return matchesSearch && matchesType;
  });

  // Calculate total votes for the previewed election candidates
  const getPreviewTotalVotes = () => {
    if (!previewElection || !previewElection.candidates) return 0;
    return previewElection.candidates.reduce((sum, c) => sum + (c.votes || 0), 0);
  };

  const totalPreviewVotes = getPreviewTotalVotes();

  const handlePublishToggle = async (election) => {
    try {
      const currentToken = token || localStorage.getItem('voting_token');
      const updated = await togglePublishResult(election._id || election.id, currentToken);
      if (previewElection && (previewElection._id === election._id || previewElection.id === election.id)) {
        setPreviewElection(updated);
      }
      alert(`Election results ${!election.isPublished ? 'published' : 'un-published'} successfully!`);
    } catch (err) {
      alert(err.message || 'Failed to toggle publish status.');
    }
  };

  return (
    <div className="reports-page-container">
      <h1 className="reports-title">10. ELECTION REPORTS & PREVIEWS</h1>

      <div className="reports-main-card">
        <div className="reports-filters-row" style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div className="report-filter-group" style={{ flex: 1, minWidth: '220px' }}>
            <label className="filter-group-label">Search Election</label>
            <input
              type="text"
              placeholder="Search election by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="report-select-dropdown"
              style={{ padding: '0.65rem 1rem', width: '100%' }}
            />
          </div>

          <div className="report-filter-group" style={{ width: '200px' }}>
            <label className="filter-group-label">Filter by Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="report-select-dropdown"
              style={{ width: '100%' }}
            >
              <option>All Types</option>
              <option>Student</option>
              <option>Staff</option>
              <option>General</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#64748B' }}>Loading elections...</div>
        ) : filteredElections.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1.5rem', border: '1px dashed #E2E8F0', borderRadius: '16px', color: '#64748B' }}>
            No elections found.
          </div>
        ) : (
          <div className="reports-table-wrapper">
            <table className="reports-table">
              <thead>
                <tr style={{ borderBottom: '2px solid #EEF2F6', textAlign: 'left' }}>
                  <th style={{ padding: '1rem', color: '#64748B', fontWeight: 700 }}>Election Name</th>
                  <th style={{ padding: '1rem', color: '#64748B', fontWeight: 700 }}>Type</th>
                  <th style={{ padding: '1rem', color: '#64748B', fontWeight: 700 }}>Start Date</th>
                  <th style={{ padding: '1rem', color: '#64748B', fontWeight: 700 }}>Status</th>
                  <th style={{ padding: '1rem', color: '#64748B', fontWeight: 700, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredElections.map((item) => (
                  <tr key={item._id} style={{ borderBottom: '1px solid #F8FAFC' }}>
                    <td className="report-title-cell" style={{ padding: '1.1rem 1rem', fontWeight: 700, color: '#0F172A' }}>{item.name}</td>
                    <td className="report-election-cell" style={{ padding: '1.1rem 1rem', color: '#64748B' }}>{item.type}</td>
                    <td className="report-date-cell" style={{ padding: '1.1rem 1rem', color: '#64748B' }}>{item.startDate || 'TBD'}</td>
                    <td style={{ padding: '1.1rem 1rem' }}>
                      <span className={`status-badge status-${item.status ? item.status.toLowerCase() : 'upcoming'}`} style={{ display: 'inline-block', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 700 }}>
                        {item.status || 'Upcoming'}
                      </span>
                    </td>
                    <td style={{ padding: '1.1rem 1rem', textAlign: 'right', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                      <button
                        onClick={() => setPreviewElection(item)}
                        className="report-preview-btn"
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
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                        Preview
                      </button>

                      <button
                        onClick={() => handlePublishToggle(item)}
                        className="report-publish-btn"
                        style={{
                          backgroundColor: item.isPublished ? '#FFEBEE' : '#E3F2FD',
                          color: item.isPublished ? '#C62828' : '#1565C0',
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
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                          <polyline points="16 6 12 2 8 6"/>
                          <line x1="12" y1="2" x2="12" y2="15"/>
                        </svg>
                        {item.isPublished ? 'Unpublish' : 'Publish'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="reports-footer" style={{ borderTop: '1px solid #EEF2F6', paddingTop: '1.25rem', marginTop: '1rem' }}>
          <span className="reports-count-text">
            Showing {filteredElections.length} of {elections.length} results
          </span>
        </div>
      </div>

      {/* Results Preview Modal */}
      {previewElection && (
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
          onClick={() => setPreviewElection(null)}
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
                <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#2E7D47', letterSpacing: '0.05em' }}>Result Preview</span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', margin: '0.2rem 0 0' }}>{previewElection.name}</h3>
              </div>
              <button
                onClick={() => setPreviewElection(null)}
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
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', marginTop: '0.2rem' }}>{previewElection.status || 'Upcoming'}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>TOTAL VOTES CAST</div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#2E7D47', marginTop: '0.2rem' }}>{totalPreviewVotes.toLocaleString()}</div>
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#475569', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Shortlisted Candidates & Standings</h4>
                
                {!previewElection.candidates || previewElection.candidates.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '1.5rem', color: '#94A3B8', border: '1px dashed #E2E8F0', borderRadius: '12px', fontSize: '0.88rem' }}>
                    No candidates are shortlisted for this election.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {previewElection.candidates.map((cand) => {
                      const cvotes = cand.votes || 0;
                      const pct = totalPreviewVotes > 0 ? ((cvotes / totalPreviewVotes) * 100).toFixed(1) : '0.0';
                      return (
                        <div key={cand._id} style={{ border: '1px solid #E2E8F0', borderRadius: '16px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                            <img
                              src={cand.photo || '/candidate_priya.png'}
                              alt={cand.name}
                              style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #F1F5F9' }}
                            />
                            <div style={{ flex: 1 }}>
                              <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.92rem' }}>{cand.name}</div>
                              <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 500 }}>{cand.partyGroup || 'General'}</div>
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
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div style={{ padding: '1.25rem 1.8rem', borderTop: '1px solid #EEF2F6', display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', backgroundColor: '#FAFDFB' }}>
              <button
                onClick={() => setPreviewElection(null)}
                style={{ padding: '0.65rem 1.4rem', border: '1px solid #E2E8F0', borderRadius: '10px', backgroundColor: '#FFFFFF', color: '#64748B', fontWeight: 700, cursor: 'pointer' }}
              >
                Close Preview
              </button>

              <button
                onClick={() => handlePublishToggle(previewElection)}
                style={{
                  padding: '0.65rem 1.4rem',
                  border: 'none',
                  borderRadius: '10px',
                  backgroundColor: previewElection.isPublished ? '#EF4444' : '#2E7D47',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                  <polyline points="16 6 12 2 8 6"/>
                  <line x1="12" y1="2" x2="12" y2="15"/>
                </svg>
                {previewElection.isPublished ? 'Unpublish' : 'Publish'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
