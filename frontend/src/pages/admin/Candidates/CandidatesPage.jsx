import React, { useState, useRef } from 'react';
import './CandidatesPage.css';

const CandidatesPage = () => {
  const [view, setView] = useState('list');
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
    photo: null
  });

  const [candidates, setCandidates] = useState([
    {
      id: 1,
      name: 'Priya Sharma',
      department: 'Computer Science',
      votes: '1,245 Votes',
      percent: '40.5%',
      progress: 40.5,
      photo: '/candidate_priya.png',
      status: 'Active'
    },
    {
      id: 2,
      name: 'Rahul Verma',
      department: 'Mechanical',
      votes: '987 Votes',
      percent: '32.1%',
      progress: 32.1,
      photo: '/candidate_rahul.png',
      status: 'Active'
    },
    {
      id: 3,
      name: 'Aman Patel',
      department: 'Commerce',
      votes: '654 Votes',
      percent: '21.3%',
      progress: 21.3,
      photo: '/candidate_aman.png',
      status: 'Active'
    },
    {
      id: 4,
      name: 'Neha Singh',
      department: 'Science',
      votes: '196 Votes',
      percent: '6.1%',
      progress: 6.1,
      photo: '/candidate_neha.png',
      status: 'Active'
    }
  ]);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, photo: imageUrl }));
    }
  };

  const handleSaveCandidate = (e) => {
    e.preventDefault();
    if (!formData.fullName) {
      alert('Please enter full name.');
      return;
    }

    const newCandidate = {
      id: Date.now(),
      name: formData.fullName,
      department: formData.partyGroup || 'General',
      votes: '0 Votes',
      percent: '0%',
      progress: 0,
      photo: formData.photo || '/candidate_priya.png',
      status: 'Active'
    };

    setCandidates([newCandidate, ...candidates]);
    setView('list');
    setFormData({
      fullName: '',
      gender: 'Select gender',
      partyGroup: '',
      age: '',
      partySymbol: '',
      qualification: '',
      experience: '',
      biography: '',
      photo: null
    });
  };

  const filteredCandidates = candidates.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="candidates-page-container">
      <h1 className="candidates-title">
        {view === 'list' ? '5. CANDIDATE MANAGEMENT' : '6. ADD CANDIDATE'}
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

                <button onClick={() => setView('add')} className="add-candidate-btn">
                  <span>+</span> Add Candidate
                </button>
              </div>
            </div>

            <div className="candidates-grid">
              {filteredCandidates.map((item) => (
                <div key={item.id} className="candidate-card-item">
                  <div className="candidate-photo-wrapper">
                    <img src={item.photo} alt={item.name} className="candidate-photo" />
                  </div>

                  <h3 className="candidate-name-text">{item.name}</h3>
                  <p className="candidate-dept-text">{item.department}</p>

                  <span className="candidate-votes-value">{item.votes}</span>
                  <span className="candidate-percent-text">{item.percent}</span>

                  <div className="candidate-progress-bar">
                    <div
                      className="candidate-progress-fill"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>

                  <div className="candidate-card-bottom">
                    <span className="candidate-status-badge">{item.status}</span>
                    <button className="candidate-edit-btn" aria-label="Edit candidate">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 2 2h14a2 2 0 0 2 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="candidates-footer-count">
              Showing 1 to {filteredCandidates.length} of 8 results
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
                  <button
                    type="button"
                    onClick={() => symbolInputRef.current && symbolInputRef.current.click()}
                    className="symbol-upload-btn"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                      <circle cx="8.5" cy="8.5" r="1.5"/>
                      <polyline points="21 15 16 10 5 21"/>
                    </svg>
                    Click to upload symbol
                  </button>
                  <input
                    ref={symbolInputRef}
                    type="file"
                    accept="image/*"
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
                Save Candidate
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CandidatesPage;
