import React, { useState, useRef } from 'react';
import './ProfilePage.css';

const ProfilePage = () => {
  const photoInputRef = useRef(null);

  const [profileData, setProfileData] = useState({
    fullName: 'Admin User',
    email: 'admin@votesecure.com',
    phone: '+91 98765 43210',
    address: '123, Green Street, New Delhi, India',
    photo: '/candidate_rahul.png'
  });

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setProfileData((prev) => ({ ...prev, photo: url }));
    }
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    alert('Profile updated successfully!');
  };

  return (
    <div className="profile-page-container">
      <h1 className="profile-title">PROFILE</h1>

      <div className="profile-main-card">
        <div className="profile-left-col">
          <div className="profile-avatar-wrapper">
            <img
              src={profileData.photo}
              alt={profileData.fullName}
              className="profile-avatar-img"
            />
          </div>
          <h3 className="profile-user-name">{profileData.fullName}</h3>
          <span className="profile-user-role">Super Administrator</span>

          <button
            type="button"
            onClick={() => photoInputRef.current && photoInputRef.current.click()}
            className="change-photo-btn"
          >
            Change Photo
          </button>
          <input
            ref={photoInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            style={{ display: 'none' }}
          />
        </div>

        <form onSubmit={handleProfileSubmit} className="profile-right-col">
          <div className="form-field-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              required
              value={profileData.fullName}
              onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
              className="form-input"
            />
          </div>

          <div className="form-field-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              required
              value={profileData.email}
              onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
              className="form-input"
            />
          </div>

          <div className="form-field-group">
            <label className="form-label">Phone Number</label>
            <input
              type="tel"
              value={profileData.phone}
              onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
              className="form-input"
            />
          </div>

          <div className="form-field-group">
            <label className="form-label">Address</label>
            <input
              type="text"
              value={profileData.address}
              onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
              className="form-input"
            />
          </div>

          <button type="submit" className="save-changes-btn">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
