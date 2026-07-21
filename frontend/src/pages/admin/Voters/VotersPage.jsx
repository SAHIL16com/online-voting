import React, { useState, useRef } from 'react';
import './VotersPage.css';

const VotersPage = () => {
  const [view, setView] = useState('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [verifyFilter, setVerifyFilter] = useState('All Verification');

  const photoInputRef = useRef(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dob: '',
    gender: 'Select gender',
    address: '',
    voterId: '',
    password: '',
    showPassword: false,
    photo: null
  });

  const [voters, setVoters] = useState([
    {
      id: 1,
      name: 'Priya Sharma',
      voterId: 'VOT01212343',
      email: 'priya@gmail.com',
      status: 'Active',
      verification: 'Verified',
      avatar: '/candidate_priya.png'
    },
    {
      id: 2,
      name: 'Rohit Verma',
      voterId: 'VOT01212344',
      email: 'rohit@gmail.com',
      status: 'Active',
      verification: 'Verified',
      avatar: '/candidate_rahul.png'
    },
    {
      id: 3,
      name: 'Neha Singh',
      voterId: 'VOT01212345',
      email: 'neha@gmail.com',
      status: 'Active',
      verification: 'Verified',
      avatar: '/candidate_neha.png'
    },
    {
      id: 4,
      name: 'Aman Kumar',
      voterId: 'VOT01212346',
      email: 'aman@gmail.com',
      status: 'Active',
      verification: 'Verified',
      avatar: '/candidate_aman.png'
    },
    {
      id: 5,
      name: 'John Doe',
      voterId: 'VOT01212347',
      email: 'john@gmail.com',
      status: 'Suspended',
      verification: 'Un-verified',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'
    },
    {
      id: 6,
      name: 'Karan Mehta',
      voterId: 'VOT01212348',
      email: 'karan@gmail.com',
      status: 'Pending',
      verification: 'Un-verified',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
    }
  ]);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, photo: url }));
    }
  };

  const handleSaveVoter = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email) {
      alert('Please fill in full name and email.');
      return;
    }

    const created = {
      id: Date.now(),
      name: formData.fullName,
      voterId: formData.voterId || `VOT${Math.floor(10000000 + Math.random() * 90000000)}`,
      email: formData.email,
      status: 'Active',
      verification: 'Verified',
      avatar: formData.photo || '/candidate_priya.png'
    };

    setVoters([created, ...voters]);
    setView('list');
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      dob: '',
      gender: 'Select gender',
      address: '',
      voterId: '',
      password: '',
      showPassword: false,
      photo: null
    });
  };

  const filteredVoters = voters.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.voterId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All Status' || item.status === statusFilter;
    const matchesVerify = verifyFilter === 'All Verification' || item.verification === verifyFilter;

    return matchesSearch && matchesStatus && matchesVerify;
  });

  return (
    <div className="voters-page-container">
      <h1 className="voters-title">
        {view === 'list' ? '7. VOTER MANAGEMENT' : '10. ADD VOTER'}
      </h1>

      <div className="voters-main-card">
        {view === 'list' ? (
          <>
            <div className="voters-controls-bar">
              <div className="voters-search-box">
                <svg className="search-box-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input
                  type="text"
                  placeholder="Search voter..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="voters-search-input"
                />
              </div>

              <div className="voters-controls-right">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="voters-filter-select"
                >
                  <option>All Status</option>
                  <option>Active</option>
                  <option>Suspended</option>
                  <option>Pending</option>
                </select>

                <select
                  value={verifyFilter}
                  onChange={(e) => setVerifyFilter(e.target.value)}
                  className="voters-filter-select"
                >
                  <option>All Verification</option>
                  <option>Verified</option>
                  <option>Un-verified</option>
                </select>

                <button onClick={() => setView('add')} className="add-voter-btn">
                  <span>+</span> Add Voter
                </button>
              </div>
            </div>

            <div className="table-responsive">
              <table className="voters-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Voter ID</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Verification</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVoters.map((row) => (
                    <tr key={row.id}>
                      <td>
                        <div className="voter-name-cell">
                          <img src={row.avatar} alt={row.name} className="voter-avatar-img" />
                          <span>{row.name}</span>
                        </div>
                      </td>
                      <td className="voter-id-cell">{row.voterId}</td>
                      <td className="voter-email-cell">{row.email}</td>
                      <td>
                        <span className={`status-badge status-${row.status.toLowerCase()}`}>
                          {row.status}
                        </span>
                      </td>
                      <td>
                        <span className={`verify-badge verify-${row.verification.toLowerCase().replace('-', '')}`}>
                          {row.verification}
                        </span>
                      </td>
                      <td>
                        <div className="actions-cell">
                          <button className="action-icon-btn" aria-label="Edit">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 2 2h14a2 2 0 0 2 2-2v-7"/>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                          </button>
                          <button className="action-icon-btn" aria-label="Refresh">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="23 4 23 10 17 10"/>
                              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                            </svg>
                          </button>
                          <button className="action-icon-btn" aria-label="View">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                              <circle cx="12" cy="12" r="3"/>
                            </svg>
                          </button>
                          <button className="action-icon-btn delete-btn" aria-label="Delete">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
                Showing 1 to {filteredVoters.length} of 12540 results
              </span>

              <div className="pagination-controls">
                <button className="page-btn">&lt;</button>
                <button className="page-btn active">1</button>
                <button className="page-btn">2</button>
                <button className="page-btn">3</button>
                <span style={{ color: '#94A3B8', fontSize: '0.85rem' }}>...</span>
                <button className="page-btn">2090</button>
                <button className="page-btn">&gt;</button>
              </div>
            </div>
          </>
        ) : (
          <form onSubmit={handleSaveVoter} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <button type="button" onClick={() => setView('list')} className="back-voters-btn">
              ← Back to Voters
            </button>

            <div className="add-voter-form-layout">
              <div className="form-field-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Enter full name"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-field-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-field-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-field-group">
                <label className="form-label">Date of Birth</label>
                <div className="form-input-wrapper">
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
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
                <label className="form-label">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="form-select"
                >
                  <option>Select gender</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="form-field-group" style={{ gridRow: 'span 2' }}>
                <label className="form-label">Address</label>
                <textarea
                  placeholder="Enter address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="form-textarea"
                />
              </div>

              <div className="form-field-group span-2">
                <label className="form-label">Voter ID</label>
                <input
                  type="text"
                  placeholder="Enter voter ID"
                  value={formData.voterId}
                  onChange={(e) => setFormData({ ...formData, voterId: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-field-group">
                <div
                  className="voter-photo-dropzone"
                  onClick={() => photoInputRef.current && photoInputRef.current.click()}
                >
                  {formData.photo ? (
                    <img src={formData.photo} alt="Uploaded" className="preview-img" />
                  ) : (
                    <>
                      <div className="upload-icon-box">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                          <circle cx="8.5" cy="8.5" r="1.5"/>
                          <polyline points="21 15 16 10 5 21"/>
                        </svg>
                      </div>
                      <span className="upload-primary-text">Click to upload</span>
                      <span className="upload-secondary-text">PNG, JPG (max. 2MB)</span>
                    </>
                  )}
                  <input
                    ref={photoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    style={{ display: 'none' }}
                  />
                </div>
              </div>

              <div className="form-field-group span-2">
                <label className="form-label">Confirm Password</label>
                <div className="form-input-wrapper">
                  <input
                    type={formData.showPassword ? 'text' : 'password'}
                    placeholder="Confirm password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="form-input"
                  />
                  <button
                    type="button"
                    className="eye-toggle-btn"
                    onClick={() => setFormData({ ...formData, showPassword: !formData.showPassword })}
                    aria-label="Toggle password visibility"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      {formData.showPassword ? (
                        <>
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                          <line x1="1" y1="1" x2="23" y2="23"/>
                        </>
                      ) : (
                        <>
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </>
                      )}
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="form-actions-row">
              <button type="button" onClick={() => setView('list')} className="form-cancel-btn">
                Cancel
              </button>
              <button type="submit" className="form-save-btn">
                Add Voter
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default VotersPage;
