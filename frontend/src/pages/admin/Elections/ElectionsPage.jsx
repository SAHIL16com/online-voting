import React, { useState, useRef } from 'react';
import { useElections } from '../../../context/ElectionsContext';
import { useCandidates } from '../../../context/CandidatesContext';
import { useAuth } from '../../../context/AuthContext';
import './ElectionsPage.css';

const ElectionsPage = () => {
  const { elections, loading, addElection, updateElection, toggleElectionStatus, deleteElection } = useElections();
  const { candidates } = useCandidates();
  const { token } = useAuth();

  const [view, setView] = useState('list'); // 'list', 'create', 'edit'
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');

  const bannerInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    type: 'Student',
    description: '',
    startDate: '',
    startTime: '',
    endDate: '',
    candidates: [], // Selected candidate IDs
    banner: ''
  });

  const handleBannerUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setFormData((prev) => ({ ...prev, banner: reader.result }));
      };
    }
  };

  const handleCandidateCheckbox = (candId) => {
    setFormData((prev) => {
      const selected = prev.candidates.includes(candId)
        ? prev.candidates.filter((id) => id !== candId)
        : [...prev.candidates, candId];
      return { ...prev, candidates: selected };
    });
  };

  const handleEditClick = (election) => {
    setEditingId(election._id);
    setFormData({
      name: election.name,
      type: election.type || 'Student',
      description: election.description || '',
      startDate: election.startDate || '',
      startTime: election.startTime || '',
      endDate: election.endDate || '',
      candidates: election.candidates ? election.candidates.map(c => c._id || c) : [],
      banner: election.banner || ''
    });
    setView('edit');
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm('Are you sure you want to delete this election?')) {
      try {
        const currentToken = token || localStorage.getItem('voting_token');
        await deleteElection(id, currentToken);
        alert('Election deleted successfully!');
      } catch (err) {
        alert(err.message || 'Failed to delete election.');
      }
    }
  };

  const handleToggleStatusClick = async (id) => {
    try {
      const currentToken = token || localStorage.getItem('voting_token');
      const updated = await toggleElectionStatus(id, currentToken);
      alert(`Election status toggled successfully! Now: ${updated.status}`);
    } catch (err) {
      alert(err.message || 'Failed to toggle election status.');
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      alert('Please enter election name.');
      return;
    }

    try {
      const currentToken = token || localStorage.getItem('voting_token');
      const payload = {
        ...formData,
        endDate: formData.endDate || 'TBD'
      };

      if (view === 'edit') {
        await updateElection(editingId, payload, currentToken);
        alert('Election updated successfully!');
      } else {
        await addElection(payload, currentToken);
        alert('Election created successfully!');
      }

      setView('list');
      resetForm();
    } catch (err) {
      alert(err.message || 'Failed to save election.');
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: '',
      type: 'Student',
      description: '',
      startDate: '',
      startTime: '',
      endDate: '',
      candidates: [],
      banner: ''
    });
  };

  const filteredElections = elections.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All Status' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Summary counts
  const activeCount = elections.filter(e => e.status === 'Active').length;
  const upcomingCount = elections.filter(e => e.status === 'Upcoming').length;
  const completedCount = elections.filter(e => e.status === 'Completed').length;
  const cancelledCount = elections.filter(e => e.status === 'Cancelled').length;

  return (
    <div className="elections-page-container">
      <h1 className="elections-title">
        {view === 'list' ? 'MANAGE ELECTIONS' : view === 'edit' ? 'EDIT ELECTION' : 'CREATE ELECTION'}
      </h1>

      <div className="elections-main-card">
        {view === 'list' ? (
          <>
            <div className="elections-controls-bar">
              <div className="elections-search-box">
                <svg className="search-box-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input
                  type="text"
                  placeholder="Search election..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="elections-search-input"
                />
              </div>

              <div className="elections-controls-right">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="elections-filter-select"
                >
                  <option>All Status</option>
                  <option>Active</option>
                  <option>Upcoming</option>
                  <option>Completed</option>
                  <option>Cancelled</option>
                </select>

                <button onClick={() => { resetForm(); setView('create'); }} className="create-election-btn">
                  <span>+</span> Create Election
                </button>
              </div>
            </div>

            {loading && elections.length === 0 ? (
              <div className="elections-loading" style={{ textAlign: 'center', padding: '2rem', color: '#64748B' }}>Loading elections...</div>
            ) : filteredElections.length === 0 ? (
              <div className="elections-empty-state" style={{ textAlign: 'center', padding: '3rem 1.5rem', border: '1px dashed #E2E8F0', borderRadius: '16px', color: '#64748B' }}>
                No elections found. Click "Create Election" to create one.
              </div>
            ) : (
              <div className="table-responsive">
                <table className="elections-table">
                  <thead>
                    <tr>
                      <th>Election Name</th>
                      <th>Type</th>
                      <th>Start Date</th>
                      <th>Shortlisted Candidates</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredElections.map((row) => (
                      <tr key={row._id}>
                        <td className="election-name-cell">{row.name}</td>
                        <td className="election-type-cell">{row.type}</td>
                        <td>{row.startDate || 'TBD'}</td>
                        <td>
                          <div style={{ fontSize: '0.82rem', color: '#475569', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {row.candidates && row.candidates.length > 0
                              ? row.candidates.map(c => c.name || c).join(', ')
                              : 'None Shortlisted'}
                          </div>
                        </td>
                        <td>
                          <span className={`status-badge status-${row.status.toLowerCase()}`}>
                            {row.status}
                          </span>
                        </td>
                        <td>
                          <div className="actions-cell" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <button
                              onClick={() => handleToggleStatusClick(row._id)}
                              className={`status-toggle-btn ${row.status === 'Active' ? 'stop-btn' : 'start-btn'}`}
                            >
                              {row.status === 'Active' ? 'Stop Election' : 'Start Election'}
                            </button>

                            <button onClick={() => handleEditClick(row)} className="action-icon-btn" aria-label="Edit">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                              </svg>
                            </button>

                            <button onClick={() => handleDeleteClick(row._id)} className="action-icon-btn delete-btn" aria-label="Delete">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="3 6 5 6 21 6"/>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="table-pagination-footer">
              <span className="results-count-text">
                Showing {filteredElections.length} of {elections.length} results
              </span>
            </div>
          </>
        ) : (
          <form onSubmit={handleCreateSubmit} className="create-election-form">
            <button type="button" onClick={() => setView('list')} className="back-elections-btn">
              ← Back to Elections
            </button>

            <h3 className="form-section-heading">Election Information</h3>

            <div className="form-grid-2col">
              <div className="form-field-group">
                <label className="form-label">Election Name</label>
                <input
                  type="text"
                  required
                  placeholder="Enter election name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-field-group">
                <label className="form-label">Election Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="form-select"
                >
                  <option>Student</option>
                  <option>Staff</option>
                  <option>General</option>
                </select>
              </div>

              <div className="form-field-group full-width">
                <label className="form-label">Description</label>
                <textarea
                  placeholder="Enter election description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="form-textarea"
                />
              </div>

              <div className="form-field-group">
                <label className="form-label">Start Date</label>
                <div className="form-input-icon-wrapper">
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="form-input"
                  />
                  <svg className="form-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                </div>
              </div>

              <div className="form-field-group">
                <label className="form-label">Start Time</label>
                <div className="form-input-icon-wrapper">
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="form-input"
                  />
                  <svg className="form-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                </div>
              </div>

              {/* Shortlist candidates checkbox area */}
              <div className="form-field-group full-width" style={{ marginTop: '1rem' }}>
                <label className="form-label">Shortlist Candidates (Select to participate in this election)</label>
                {candidates.length === 0 ? (
                  <div style={{ color: '#64748B', fontSize: '0.88rem', padding: '0.5rem 0' }}>
                    No candidates available. Please create candidates first in Candidate Management tab.
                  </div>
                ) : (
                  <div className="shortlist-candidates-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.8rem', marginTop: '0.5rem' }}>
                    {candidates.map((cand) => (
                      <label
                        key={cand._id}
                        className="shortlist-candidate-label"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.6rem',
                          padding: '0.6rem 0.8rem',
                          border: '1px solid #E2E8F0',
                          borderRadius: '12px',
                          cursor: 'pointer',
                          backgroundColor: formData.candidates.includes(cand._id) ? '#F0FDF4' : '#FFFFFF',
                          borderColor: formData.candidates.includes(cand._id) ? '#2E7D47' : '#E2E8F0',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={formData.candidates.includes(cand._id)}
                          onChange={() => handleCandidateCheckbox(cand._id)}
                          style={{ accentColor: '#2E7D47' }}
                        />
                        <img 
                          src={cand.photo} 
                          alt={cand.name} 
                          style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} 
                        />
                        <div style={{ fontSize: '0.85rem' }}>
                          <div style={{ fontWeight: 600, color: '#0F172A' }}>{cand.name}</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{cand.department}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div className="form-field-group full-width" style={{ marginTop: '1rem' }}>
                <label className="form-label">Banner Image</label>
                <div
                  className="banner-upload-dropzone"
                  onClick={() => bannerInputRef.current && bannerInputRef.current.click()}
                >
                  {formData.banner ? (
                    <img src={formData.banner} alt="Uploaded Banner" style={{ maxHeight: '100px', objectFit: 'cover', borderRadius: '8px' }} />
                  ) : (
                    <>
                      <span className="upload-primary-text">Click to upload image</span>
                      <span className="upload-secondary-text">PNG, JPG or JPEG (max. 2MB)</span>
                    </>
                  )}
                  <input
                    ref={bannerInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleBannerUpload}
                    style={{ display: 'none' }}
                  />
                </div>
              </div>
            </div>

            <div className="form-actions-row">
              <button type="button" onClick={() => setView('list')} className="form-cancel-btn">
                Cancel
              </button>
              <button type="submit" className="form-submit-green-btn">
                {view === 'edit' ? 'Update Election' : 'Create Election'}
              </button>
            </div>
          </form>
        )}
      </div>

      {view === 'list' && (
        <div className="elections-summary-grid">
          <div className="summary-card">
            <span className="summary-card-title">Active Elections</span>
            <span className="summary-card-count">{activeCount}</span>
          </div>
          <div className="summary-card">
            <span className="summary-card-title">Upcoming Elections</span>
            <span className="summary-card-count">{upcomingCount}</span>
          </div>
          <div className="summary-card">
            <span className="summary-card-title">Completed Elections</span>
            <span className="summary-card-count">{completedCount}</span>
          </div>
          <div className="summary-card">
            <span className="summary-card-title">Cancelled Elections</span>
            <span className="summary-card-count">{cancelledCount}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ElectionsPage;
