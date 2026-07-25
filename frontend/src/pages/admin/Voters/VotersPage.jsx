import React, { useState, useRef, useEffect } from 'react';
import { useVoters } from '../../../context/VotersContext';
import { useAuth } from '../../../context/AuthContext';
import './VotersPage.css';

const VotersPage = () => {
  const { voters, loading, fetchVoters, addVoter, updateVoter, deleteVoter } = useVoters();
  const { token } = useAuth();

  const [view, setView] = useState('list'); // 'list', 'add', 'edit'
  const [editingId, setEditingId] = useState(null);
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
    photo: ''
  });

  useEffect(() => {
    const currentToken = token || localStorage.getItem('voting_token');
    if (currentToken) {
      fetchVoters(currentToken);
    }
  }, [token]);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setFormData((prev) => ({ ...prev, photo: reader.result }));
      };
    }
  };

  const handleEditClick = (voter) => {
    setEditingId(voter._id);
    setFormData({
      fullName: voter.name,
      email: voter.email,
      phone: voter.phone || '',
      dob: voter.dob || '',
      gender: voter.gender || 'Select gender',
      address: voter.address || '',
      voterId: voter.voterId || '',
      password: '', // Kept empty unless changing password
      showPassword: false,
      photo: voter.avatar || ''
    });
    setView('edit');
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm('Are you sure you want to delete this voter?')) {
      try {
        const currentToken = token || localStorage.getItem('voting_token');
        await deleteVoter(id, currentToken);
        alert('Voter account removed successfully!');
      } catch (err) {
        alert(err.message || 'Failed to delete voter.');
      }
    }
  };

  const handleSaveVoter = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.voterId) {
      alert('Please fill in full name, email and Voter ID.');
      return;
    }

    if (view === 'add' && !formData.password) {
      alert('Please specify a password for the new voter account.');
      return;
    }

    try {
      const currentToken = token || localStorage.getItem('voting_token');
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        voterId: formData.voterId,
        phone: formData.phone,
        dob: formData.dob,
        gender: formData.gender,
        address: formData.address,
        password: formData.password || undefined
      };

      if (view === 'edit') {
        await updateVoter(editingId, payload, currentToken);
        alert('Voter profile updated successfully!');
      } else {
        await addVoter(payload, currentToken);
        alert('Voter profile created successfully!');
      }

      setView('list');
      resetForm();
    } catch (err) {
      alert(err.message || 'Failed to save voter.');
    }
  };

  const resetForm = () => {
    setEditingId(null);
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
      photo: ''
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
        {view === 'list' ? 'VOTER MANAGEMENT' : view === 'edit' ? 'EDIT VOTER' : 'ADD VOTER'}
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

                <button onClick={() => { resetForm(); setView('add'); }} className="add-voter-btn">
                  <span>+</span> Add Voter
                </button>
              </div>
            </div>

            {loading && voters.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#64748B' }}>Loading voters...</div>
            ) : filteredVoters.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 1.5rem', border: '1px dashed #E2E8F0', borderRadius: '16px', color: '#64748B' }}>
                No voters found. Click "Add Voter" to create a voter account.
              </div>
            ) : (
              <div className="table-responsive">
                <table className="voters-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Voter ID (Username)</th>
                      <th>Email</th>
                      <th>Status</th>
                      <th>Verification</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredVoters.map((row) => (
                      <tr key={row._id}>
                        <td>
                          <div className="voter-name-cell">
                            <img src={row.avatar} alt={row.name} className="voter-avatar-img" />
                            <span>{row.name}</span>
                          </div>
                        </td>
                        <td className="voter-id-cell" style={{ fontWeight: 600 }}>{row.voterId}</td>
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
                            <button onClick={() => handleEditClick(row)} className="action-icon-btn" aria-label="Edit">
                              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                              </svg>
                            </button>
                            <button onClick={() => handleDeleteClick(row._id)} className="action-icon-btn delete-btn" aria-label="Delete">
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
            )}

            <div className="table-pagination-footer">
              <span className="results-count-text">
                Showing {filteredVoters.length} of {voters.length} results
              </span>
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
                <label className="form-label">Voter ID (This will be the username for Voter login)</label>
                <input
                  type="text"
                  required
                  placeholder="Enter voter ID (e.g. VOT10001)"
                  value={formData.voterId}
                  onChange={(e) => setFormData({ ...formData, voterId: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-field-group span-2">
                <label className="form-label">{view === 'edit' ? 'Change Password (Optional)' : 'Password'}</label>
                <div className="form-input-wrapper" style={{ position: 'relative' }}>
                  <input
                    type={formData.showPassword ? 'text' : 'password'}
                    placeholder={view === 'edit' ? 'Leave blank to keep current password' : 'Enter password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="form-input"
                  />
                  <button
                    type="button"
                    className="eye-toggle-btn"
                    style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}
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
                {view === 'edit' ? 'Update Voter' : 'Add Voter'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default VotersPage;
