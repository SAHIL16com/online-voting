import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import './VoterProfilePage.css';

const VoterProfilePage = () => {
  const { user, updateUserProfile } = useAuth();
  const [profile, setProfile] = useState({
    fullName: user.name,
    email: user.email,
    phone: user.phone || '',
    address: user.address || '',
    voterId: user.voterId,
    avatar: user.avatar
  });

  const handleSave = (e) => {
    e.preventDefault();
    updateUserProfile({
      name: profile.fullName,
      email: profile.email,
      phone: profile.phone,
      address: profile.address
    });
    alert('Voter profile updated successfully!');
  };

  return (
    <div className="voter-profile-container">
      <h1 className="voter-profile-title">Voter Profile</h1>

      <div className="voter-profile-main-card">
        <div className="voter-profile-left">
          <div className="voter-avatar-big">
            <img src={profile.avatar} alt={profile.fullName} />
          </div>

          <h3 className="voter-name-head">{profile.fullName}</h3>
          <span className="voter-id-sub">Voter ID: {profile.voterId}</span>

          <span className="verified-pill-badge">✓ Verified Voter</span>
        </div>

        <form onSubmit={handleSave} className="voter-profile-form">
          <div className="form-field-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              required
              value={profile.fullName}
              onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
              className="form-input"
            />
          </div>

          <div className="form-field-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              required
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="form-input"
            />
          </div>

          <div className="form-field-group">
            <label className="form-label">Phone Number</label>
            <input
              type="tel"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              className="form-input"
            />
          </div>

          <div className="form-field-group">
            <label className="form-label">Address</label>
            <input
              type="text"
              value={profile.address}
              onChange={(e) => setProfile({ ...profile, address: e.target.value })}
              className="form-input"
            />
          </div>

          <button type="submit" className="save-voter-profile-btn">
            Save Profile Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default VoterProfilePage;
