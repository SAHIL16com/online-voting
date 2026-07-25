import React, { useState, useRef, useEffect } from 'react';
import { useCandidates } from '../../../context/CandidatesContext';
import { useAuth } from '../../../context/AuthContext';
import './CandidatesPage.css';

const CandidatesPage = () => {
  const { candidates, loading, addCandidate, updateCandidate, deleteCandidate, fetchCandidates } = useCandidates();
  const { token } = useAuth();

  useEffect(() => {
    fetchCandidates();
  }, []);

  const [view, setView] = useState('list'); // 'list', 'add', 'edit'
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [electionFilter, setElectionFilter] = useState('All Elections');

  const fileInputRef = useRef(null);
  const symbolInputRef = useRef(null);

  const [formData, setFormData] = useState({
    fullName: '',
    gender: 'Select gender',
    partyGroup: '',
    age: '',
    partySymbol: '',
    qualification: '',
    experience: '',
    biography: '',
    photo: ''
  });

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

  const handleSymbolUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setFormData((prev) => ({ ...prev, partySymbol: reader.result }));
      };
    }
  };

  const handleEditClick = (cand) => {
    setEditingId(cand._id);
    setFormData({
      fullName: cand.name,
      gender: cand.gender || 'Select gender',
      partyGroup: cand.department,
      age: cand.age || '',
      partySymbol: cand.partySymbol || '',
      qualification: cand.qualification || '',
      experience: cand.experience || '',
      biography: cand.biography || '',
      photo: cand.photo || ''
    });
    setView('edit');
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm('Are you sure you want to remove this candidate?')) {
      try {
        const currentToken = token || localStorage.getItem('voting_token');
        await deleteCandidate(id, currentToken);
        alert('Candidate deleted successfully!');
      } catch (err) {
        alert(err.message || 'Failed to delete candidate.');
      }
    }
  };

  const handleSaveCandidate = async (e) => {
    e.preventDefault();
    if (!formData.fullName) {
      alert('Please enter full name.');
      return;
    }

    try {
      const currentToken = token || localStorage.getItem('voting_token');
      const payload = {
        name: formData.fullName,
        gender: formData.gender,
        partyGroup: formData.partyGroup,
        age: formData.age ? Number(formData.age) : undefined,
        partySymbol: formData.partySymbol,
        qualification: formData.qualification,
        experience: formData.experience,
        biography: formData.biography,
        photo: formData.photo
      };

      if (view === 'edit') {
        await updateCandidate(editingId, payload, currentToken);
        alert('Candidate details updated successfully!');
      } else {
        await addCandidate(payload, currentToken);
        alert('Candidate created successfully!');
      }

      setView('list');
      resetForm();
    } catch (err) {
      alert(err.message || 'Failed to save candidate.');
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      fullName: '',
      gender: 'Select gender',
      partyGroup: '',
      age: '',
      partySymbol: '',
      qualification: '',
      experience: '',
      biography: '',
      photo: ''
    });
  };

  const filteredCandidates = candidates.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="candidates-page-container">
      <h1 className="candidates-title">
        {view === 'list' ? '5. CANDIDATE MANAGEMENT' : view === 'edit' ? 'EDIT CANDIDATE' : '6. ADD CANDIDATE'}
      </h1>

      <div className="candidates-main-card">
        {view === 'list' ? (
          <>
            <div className="candidates-controls-bar">
              <div className="candidates-search-box">
                <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input
                  type="text"
                  placeholder="Search candidate..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="candidates-search-input"
                />
              </div>

              <div className="candidates-controls-right">
                <button
                  type="button"
                  onClick={fetchCandidates}
                  className="refresh-candidates-btn"
                  title="Refresh Candidates"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0.65rem',
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px',
                    backgroundColor: '#FFFFFF',
                    cursor: 'pointer',
                    color: '#64748B',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#CBD5E1';
                    e.currentTarget.style.color = '#0F172A';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#E2E8F0';
                    e.currentTarget.style.color = '#64748B';
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 4v6h-6" />
                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                  </svg>
                </button>

                <select
                  value={electionFilter}
                  onChange={(e) => setElectionFilter(e.target.value)}
                  className="candidates-filter-select"
                >
                  <option>All Elections</option>
                  <option>College President Election 2024</option>
                  <option>Student Council Election 2024</option>
                  <option>Sports Head Election 2024</option>
                </select>

                <button onClick={() => { resetForm(); setView('add'); }} className="add-candidate-btn">
                  <span>+</span> Add Candidate
                </button>
              </div>
            </div>

            {loading && candidates.length === 0 ? (
              <div className="candidates-loading">Loading candidates...</div>
            ) : filteredCandidates.length === 0 ? (
              <div className="candidates-empty-state">No candidates found. Click "Add Candidate" to create one.</div>
            ) : (
              <div className="candidates-grid">
                {filteredCandidates.map((item) => (
                  <div key={item.id} className="candidate-card-item">
                    <div className="candidate-photo-wrapper">
                      <img src={item.photo} alt={item.name} className="candidate-photo" />
                    </div>

                    <h3 className="candidate-name-text">{item.name}</h3>
                    <p className="candidate-dept-text">{item.department}</p>

                    <div className="candidate-card-bottom">
                      <span className="candidate-status-badge">{item.status}</span>
                      <div className="candidate-actions-wrapper" style={{ display: 'flex', gap: '0.4rem' }}>
                        <button 
                          onClick={() => handleEditClick(item)} 
                          className="candidate-edit-btn" 
                          aria-label="Edit candidate"
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(item._id)} 
                          className="candidate-edit-btn" 
                          style={{ color: '#EF4444' }} 
                          aria-label="Delete candidate"
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="candidates-footer-count">
              Showing {filteredCandidates.length} of {candidates.length} results
            </div>
          </>
        ) : (
          <form onSubmit={handleSaveCandidate} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <button type="button" onClick={() => setView('list')} className="back-candidates-btn">
              ← Back to Candidates
            </button>

            <div className="add-candidate-form-layout">
              <div className="photo-upload-container">
                <label className="form-label">Photo</label>
                <div
                  className="photo-upload-dropzone"
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                >
                  {formData.photo ? (
                    <img src={formData.photo} alt="Uploaded" className="preview-img" />
                  ) : (
                    <>
                      <div className="upload-icon-box">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    style={{ display: 'none' }}
                  />
                </div>
              </div>

              <div className="form-fields-grid">
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

                <div className="form-field-group">
                  <label className="form-label">Party / Group</label>
                  <input
                    type="text"
                    placeholder="Enter party or group"
                    value={formData.partyGroup}
                    onChange={(e) => setFormData({ ...formData, partyGroup: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-field-group">
                  <label className="form-label">Age</label>
                  <input
                    type="number"
                    placeholder="Enter age"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-field-group">
                  <label className="form-label">Party Symbol</label>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <button
                      type="button"
                      onClick={() => symbolInputRef.current && symbolInputRef.current.click()}
                      className="symbol-upload-btn"
                      style={{ flex: 1 }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21 15 16 10 5 21"/>
                      </svg>
                      {formData.partySymbol ? 'Symbol uploaded' : 'Upload symbol'}
                    </button>
                    {formData.partySymbol && (
                      <img 
                        src={formData.partySymbol} 
                        alt="Symbol preview" 
                        style={{ width: '40px', height: '40px', objectFit: 'contain', border: '1px solid #E2E8F0', borderRadius: '8px' }} 
                      />
                    )}
                  </div>
                  <input
                    ref={symbolInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleSymbolUpload}
                    style={{ display: 'none' }}
                  />
                </div>

                <div className="form-field-group">
                  <label className="form-label">Qualification</label>
                  <input
                    type="text"
                    placeholder="Enter qualification"
                    value={formData.qualification}
                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-field-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Experience</label>
                  <input
                    type="text"
                    placeholder="Enter experience"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>
            </div>

            <div className="form-field-group">
              <label className="form-label">Biography</label>
              <textarea
                placeholder="Enter candidate biography"
                value={formData.biography}
                onChange={(e) => setFormData({ ...formData, biography: e.target.value })}
                className="form-textarea"
              />
            </div>

            <div className="form-actions-row">
              <button type="button" onClick={() => setView('list')} className="form-cancel-btn">
                Cancel
              </button>
              <button type="submit" className="form-save-btn">
                {view === 'edit' ? 'Update Candidate' : 'Save Candidate'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CandidatesPage;
