import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../../context/AuthContext';
import './ProfilePage.css';

const ProfilePage = () => {
  const photoInputRef = useRef(null);
  const { currentUser, adminUser, updateProfile, uploadAvatar } = useAuth();

  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    photo: ''
  });

  const [loading, setLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    setProfileData({
      fullName: currentUser?.fullName || adminUser.name || '',
      email: currentUser?.email || adminUser.email || '',
      phone: currentUser?.phone || adminUser.phone || '',
      address: currentUser?.address || adminUser.address || '',
      photo: currentUser?.avatar || adminUser.avatar || '/candidate_rahul.png'
    });
  }, [currentUser, adminUser]);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Convert file to Base64
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result;
      setUploadingPhoto(true);
      setStatusMsg({ type: 'info', text: 'Uploading photo to Cloudinary...' });

      try {
        const updated = await uploadAvatar(base64Image);
        setProfileData((prev) => ({ ...prev, photo: updated.avatar }));
        setStatusMsg({ type: 'success', text: 'Photo uploaded to Cloudinary and saved to DB!' });
      } catch (err) {
        setStatusMsg({ type: 'error', text: err.message || 'Photo upload failed.' });
      } finally {
        setUploadingPhoto(false);
      }
    };
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg({ type: '', text: '' });

    try {
      await updateProfile({
        fullName: profileData.fullName,
        email: profileData.email,
        phone: profileData.phone,
        address: profileData.address
      });
      setStatusMsg({ type: 'success', text: 'Profile updated & saved to Database!' });
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page-container">
      <h1 className="profile-title">ADMIN PROFILE</h1>

      {statusMsg.text && (
        <div className={`auth-error-alert ${statusMsg.type === 'success' ? 'status-success' : ''}`} style={{
          backgroundColor: statusMsg.type === 'success' ? '#F0FDF4' : '#FEF2F2',
          borderColor: statusMsg.type === 'success' ? '#86EFAC' : '#FCA5A5',
          color: statusMsg.type === 'success' ? '#166534' : '#991B1B',
          padding: '0.8rem 1rem',
          borderRadius: '12px',
          marginBottom: '1rem',
          textAlign: 'center',
          fontWeight: 600
        }}>
          {statusMsg.text}
        </div>
      )}

      <div className="profile-main-card">
        <div className="profile-left-col">
          <div className="profile-avatar-wrapper">
            <img
              src={profileData.photo}
              alt={profileData.fullName}
              className="profile-avatar-img"
            />
          </div>
          <h3 className="profile-user-name">{profileData.fullName || 'Admin User'}</h3>
          <span className="profile-user-role">Super Administrator</span>

          <button
            type="button"
            onClick={() => photoInputRef.current && photoInputRef.current.click()}
            className="change-photo-btn"
            disabled={uploadingPhoto}
          >
            {uploadingPhoto ? 'Uploading...' : 'Change Photo'}
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

          <button type="submit" className="save-changes-btn" disabled={loading}>
            {loading ? 'Saving to Database...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
