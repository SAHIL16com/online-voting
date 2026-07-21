import React, { useState, useRef } from 'react';
import './ElectionsPage.css';

const ElectionsPage = () => {
  const [view, setView] = useState('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');

  const bannerInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    type: 'Select type',
    description: '',
    startDate: '',
    startTime: '',
    eligibility: 'Select eligibility',
    timeDuration: '0D:11',
    banner: null
  });

  const [elections, setElections] = useState([
    {
      id: 1,
      name: 'College President Election 2024',
      type: 'Student',
      startDate: '01 May 2024',
      endDate: '31 May 2024',
      status: 'Active'
    },
    {
      id: 2,
      name: 'Student Council Election 2024',
      type: 'Student',
      startDate: '10 May 2024',
      endDate: '25 May 2024',
      status: 'Active'
    },
    {
      id: 3,
      name: 'Sports Head Election 2024',
      type: 'Student',
      startDate: '15 May 2024',
      endDate: '30 May 2024',
      status: 'Active'
    },
    {
      id: 4,
      name: 'Cultural Head Election 2024',
      type: 'Student',
      startDate: '20 May 2024',
      endDate: '05 Jun 2024',
      status: 'Upcoming'
    },
    {
      id: 5,
      name: 'Department Head Election',
      type: 'Staff',
      startDate: '01 Apr 2024',
      endDate: '20 Apr 2024',
      status: 'Completed'
    },
    {
      id: 6,
      name: 'Class Representative Election',
      type: 'Student',
      startDate: '10 Mar 2024',
      endDate: '20 Mar 2024',
      status: 'Completed'
    }
  ]);

  const handleBannerUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, banner: imageUrl }));
    }
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) {
      alert('Please enter election name.');
      return;
    }

    const newElection = {
      id: Date.now(),
      name: formData.name,
      type: formData.type !== 'Select type' ? formData.type : 'Student',
      startDate: formData.startDate || '21 Jul 2026',
      endDate: '30 Aug 2026',
      status: 'Upcoming'
    };

    setElections([newElection, ...elections]);
    setView('list');
    setFormData({
      name: '',
      type: 'Select type',
      description: '',
      startDate: '',
      startTime: '',
      eligibility: 'Select eligibility',
      timeDuration: '0D:11',
      banner: null
    });
  };

  const filteredElections = elections.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All Status' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="elections-page-container">
      <h1 className="elections-title">
        {view === 'list' ? '2. MANAGE ELECTIONS' : '3. CREATE ELECTION'}
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

                <button onClick={() => setView('create')} className="create-election-btn">
                  <span>+</span> Create Election
                </button>
              </div>
            </div>

            <div className="table-responsive">
              <table className="elections-table">
                <thead>
                  <tr>
                    <th>Election Name</th>
                    <th>Type</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredElections.map((row) => (
                    <tr key={row.id}>
                      <td className="election-name-cell">{row.name}</td>
                      <td className="election-type-cell">{row.type}</td>
                      <td>{row.startDate}</td>
                      <td>{row.endDate}</td>
                      <td>
                        <span className={`status-badge status-${row.status.toLowerCase()}`}>
                          {row.status}
                        </span>
                      </td>
                      <td>
                        <div className="actions-cell">
                          <button className="action-icon-btn" aria-label="Edit">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                          </button>
                          <button className="action-icon-btn" aria-label="View">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                              <circle cx="12" cy="12" r="3"/>
                            </svg>
                          </button>
                          <button className="action-icon-btn delete-btn" aria-label="Delete">
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

            <div className="table-pagination-footer">
              <span className="results-count-text">
                Showing 1 to {filteredElections.length} of 18 results
              </span>

              <div className="pagination-controls">
                <button className="page-btn">&lt;</button>
                <button className="page-btn active">1</button>
                <button className="page-btn">2</button>
                <button className="page-btn">3</button>
                <button className="page-btn">&gt;</button>
              </div>
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
                  <option>Select type</option>
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

              <div className="form-field-group">
                <label className="form-label">Eligibility</label>
                <select
                  value={formData.eligibility}
                  onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
                  className="form-select"
                >
                  <option>Select eligibility</option>
                  <option>All Students</option>
                  <option>Final Year Only</option>
                  <option>Staff Only</option>
                </select>
              </div>

              <div className="form-field-group">
                <label className="form-label">Time</label>
                <select
                  value={formData.timeDuration}
                  onChange={(e) => setFormData({ ...formData, timeDuration: e.target.value })}
                  className="form-select"
                >
                  <option>0D:11</option>
                  <option>1 Day</option>
                  <option>3 Days</option>
                  <option>7 Days</option>
                </select>
              </div>

              <div className="form-field-group full-width">
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
                Create Election
              </button>
            </div>
          </form>
        )}
      </div>

      {view === 'list' && (
        <div className="elections-summary-grid">
          <div className="summary-card">
            <span className="summary-card-title">Active Elections</span>
            <span className="summary-card-count">3</span>
          </div>
          <div className="summary-card">
            <span className="summary-card-title">Upcoming Elections</span>
            <span className="summary-card-count">1</span>
          </div>
          <div className="summary-card">
            <span className="summary-card-title">Completed Elections</span>
            <span className="summary-card-count">14</span>
          </div>
          <div className="summary-card">
            <span className="summary-card-title">Cancelled Elections</span>
            <span className="summary-card-count">0</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ElectionsPage;
