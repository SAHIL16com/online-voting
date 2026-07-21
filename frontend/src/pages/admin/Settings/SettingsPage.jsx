import React, { useState } from 'react';
import './SettingsPage.css';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('security');

  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleSecuritySubmit = (e) => {
    e.preventDefault();
    if (securityData.newPassword !== securityData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    alert('Password updated successfully!');
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

              <button type="submit" className="save-settings-btn">
                Update Password
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
                <select className="form-select">
                  <option>English (US)</option>
                  <option>Hindi</option>
                </select>
              </div>

              <button type="button" onClick={() => alert('Preferences saved!')} className="save-settings-btn">
                Save Preferences
              </button>
            </div>
          )}

          {activeTab === 'danger' && (
            <div className="danger-zone-card">
              <h4 className="danger-zone-title">Delete Admin Account</h4>
              <p className="danger-zone-desc">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <button type="button" onClick={() => alert('Account deletion requested.')} className="danger-action-btn">
                Delete Account
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
