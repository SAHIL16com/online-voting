import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './SettingsPage.css';

const SettingsPage = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('security');

  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [deletePassword, setDeletePassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSecuritySubmit = async (e) => {
    e.preventDefault();
    if (securityData.newPassword !== securityData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    setSubmitting(true);

    try {
      const currentToken = token || localStorage.getItem('voting_token');
      const response = await fetch('/api/auth/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentToken}`
        },
        body: JSON.stringify({
          currentPassword: securityData.currentPassword,
          newPassword: securityData.newPassword
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to update password');
      }

      alert('Password updated successfully!');
      setSecurityData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      alert(err.message || 'Failed to change password. Please verify current password.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    if (!deletePassword) {
      alert('Please enter your password to confirm deletion.');
      return;
    }

    if (!window.confirm('WARNING: Are you absolutely sure you want to delete your account? This action is permanent.')) {
      return;
    }

    setSubmitting(true);

    try {
      const currentToken = token || localStorage.getItem('voting_token');
      const response = await fetch('/api/auth/delete-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentToken}`
        },
        body: JSON.stringify({
          password: deletePassword
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Verification failed');
      }

      alert('Your account has been deleted successfully.');
      logout();
      navigate('/login');
    } catch (err) {
      alert(err.message || 'Failed to delete account. Please verify password.');
    } finally {
      setSubmitting(false);
      setDeletePassword('');
    }
  };

  return (
    <div className="settings-page-container">
      <h1 className="settings-title">SETTINGS</h1>

      <div className="settings-main-card">
        <div className="settings-tabs-header">
          <button
            onClick={() => setActiveTab('security')}
            className={`settings-tab-btn ${activeTab === 'security' ? 'active' : ''}`}
          >
            Security
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`settings-tab-btn ${activeTab === 'preferences' ? 'active' : ''}`}
          >
            Preferences
          </button>
          <button
            onClick={() => setActiveTab('danger')}
            className={`settings-tab-btn ${activeTab === 'danger' ? 'active' : ''}`}
          >
            Danger Zone
          </button>
        </div>

        <div className="settings-content-body">
          {activeTab === 'security' && (
            <form onSubmit={handleSecuritySubmit}>
              <div className="form-field-group">
                <label className="form-label">Current Password</label>
                <input
                  type="password"
                  required
                  placeholder="Enter current password"
                  value={securityData.currentPassword}
                  onChange={(e) => setSecurityData({ ...securityData, currentPassword: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-field-group">
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  required
                  placeholder="Enter new password"
                  value={securityData.newPassword}
                  onChange={(e) => setSecurityData({ ...securityData, newPassword: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-field-group">
                <label className="form-label">Confirm New Password</label>
                <input
                  type="password"
                  required
                  placeholder="Confirm new password"
                  value={securityData.confirmPassword}
                  onChange={(e) => setSecurityData({ ...securityData, confirmPassword: e.target.value })}
                  className="form-input"
                />
              </div>

              <button type="submit" className="save-settings-btn" disabled={submitting}>
                {submitting ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          )}

          {activeTab === 'preferences' && (
            <div>
              <div className="form-field-group">
                <label className="form-label">Email Notifications</label>
                <select className="form-select">
                  <option>Enabled (Recommended)</option>
                  <option>Disabled</option>
                </select>
              </div>

              <div className="form-field-group">
                <label className="form-label">System Language</label>
                <select className="form-select" disabled style={{ backgroundColor: '#F8FAFC', cursor: 'not-allowed' }}>
                  <option>English (US)</option>
                </select>
              </div>

              <button type="button" onClick={() => alert('Preferences saved!')} className="save-settings-btn">
                Save Preferences
              </button>
            </div>
          )}

          {activeTab === 'danger' && (
            <div className="danger-zone-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h4 className="danger-zone-title" style={{ color: '#EF4444' }}>Delete Account</h4>
              <p className="danger-zone-desc" style={{ color: '#64748B', maxWidth: '480px' }}>
                Once you delete your account, your profile will be permanently removed from the database. Please enter your password to confirm account deletion.
              </p>
              
              <form onSubmit={handleDeleteAccount} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', maxWidth: '320px' }}>
                <input
                  type="password"
                  required
                  placeholder="Enter password to confirm"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  className="form-input"
                />
                <button type="submit" className="danger-action-btn" disabled={submitting} style={{ backgroundColor: '#EF4444', color: '#FFFFFF', border: 'none', padding: '0.65rem 1.2rem', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s ease' }}>
                  {submitting ? 'Deleting...' : 'Verify & Delete Account'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
