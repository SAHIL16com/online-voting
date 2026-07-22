import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../../context/AuthContext';
import './VoterProfilePage.css';

const VoterProfilePage = () => {
  const photoInputRef = useRef(null);
  const { currentUser, user, updateProfile, uploadAvatar } = useAuth();
  
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    voterId: '',
    avatar: ''
  });

  const [loading, setLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    setProfile({
      fullName: currentUser?.fullName || user.name || '',
      email: currentUser?.email || user.email || '',
      phone: currentUser?.phone || user.phone || '',
      address: currentUser?.address || user.address || '',
      voterId: currentUser?.voterId || user.voterId || '',
      avatar: currentUser?.avatar || user.avatar || '/candidate_aman.png'
    });
  }, [currentUser, user]);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result;
      setUploadingPhoto(true);
      setStatusMsg({ type: 'info', text: 'Uploading photo to Cloudinary...' });

      try {
        const updated = await uploadAvatar(base64Image);
        setProfile((prev) => ({ ...prev, avatar: updated.avatar }));
        setStatusMsg({ type: 'success', text: 'Photo uploaded to Cloudinary & saved to DB!' });
      } catch (err) {
        setStatusMsg({ type: 'error', text: err.message || 'Photo upload failed.' });
      } finally {
        setUploadingPhoto(false);
      }
    };
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg({ type: '', text: '' });

    try {
      await updateProfile({
        fullName: profile.fullName,
        email: profile.email,
        phone: profile.phone,
        address: profile.address,
        voterId: profile.voterId
      });
      setStatusMsg({ type: 'success', text: 'Voter profile updated & saved to Database!' });
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="voter-profile-container">
      <h1 className="voter-profile-title">Voter Profile</h1>

      {statusMsg.text && (
        <div style={{
          backgroundColor: statusMsg.type === 'success' ? '#F0FDF4' : '#FEF2F2',
          borderColor: statusMsg.type === 'success' ? '#86EFAC' : '#FCA5A5',
          color: statusMsg.type === 'success' ? '#166534' : '#991B1B',
          border: '1px solid',
          padding: '0.8rem 1rem',
          borderRadius: '12px',
          marginBottom: '1rem',
          textAlign: 'center',
          fontWeight: 600
        }}>
          {statusMsg.text}
        </div>
      )}

      <div className="voter-profile-main-card">
        <div className="voter-profile-left">
          <div className="voter-avatar-big">
            <img src={profile.avatar} alt={profile.fullName} />
          </div>

          <h3 className="voter-name-head">{profile.fullName}</h3>
          <span className="voter-id-sub">Voter ID: {profile.voterId || 'N/A'}</span>

          <span className="verified-pill-badge">✓ Verified Voter</span>

          <button
            type="button"
            onClick={() => photoInputRef.current && photoInputRef.current.click()}
            className="save-voter-profile-btn"
            style={{ marginTop: '1rem', padding: '0.5rem 1rem', fontSize: '0.85rem' }}
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

          <button type="submit" className="save-voter-profile-btn" disabled={loading}>
            {loading ? 'Saving Changes...' : 'Save Profile Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VoterProfilePage;
