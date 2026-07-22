import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('voter'); // 'voter' or 'admin'
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password, role);
      if (user?.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/voter/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        <h2 className="auth-header-title">Login</h2>

        <div className="auth-shield-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            <polyline points="9 12 11 14 15 10"/>
          </svg>
        </div>

        <h1 className="auth-main-heading">Welcome Back!</h1>
        <p className="auth-sub-heading">Login to access your account</p>

        {/* Role Toggle Tabs */}
        <div className="auth-role-tabs">
          <button
            type="button"
            className={`auth-role-tab ${role === 'voter' ? 'active' : ''}`}
            onClick={() => setRole('voter')}
          >
            Voter Login
          </button>
          <button
            type="button"
            className={`auth-role-tab ${role === 'admin' ? 'active' : ''}`}
            onClick={() => setRole('admin')}
          >
            Admin Login
          </button>
        </div>

        {error && <div className="auth-error-alert">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field-group">
            <label className="auth-label">{role === 'voter' ? 'Voter ID (Username)' : 'Email Address'}</label>
            <div className="auth-input-wrapper">
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={role === 'voter' ? 'Enter your Voter ID' : 'Enter your email'}
                className="auth-input"
              />
            </div>
          </div>

          <div className="auth-field-group">
            <label className="auth-label">Password</label>
            <div className="auth-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="auth-input"
              />
              <button
                type="button"
                className="auth-eye-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {showPassword ? (
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
            <Link to="#" className="auth-forgot-link">Forgot password?</Link>
          </div>

          <div className="auth-checkbox-row">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="auth-checkbox"
            />
            <label htmlFor="rememberMe">Remember me</label>
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? 'Logging in...' : `Login as ${role === 'admin' ? 'Admin' : 'Voter'}`}
          </button>
        </form>

        {role === 'admin' && (
          <p className="auth-footer-text">
            Don't have an account? 
            <Link to="/register" className="auth-footer-link">Register</Link>
          </p>
        )}
        {role === 'voter' && (
          <p className="auth-footer-text" style={{ color: '#64748B' }}>
            Voter registration is managed by Admin. Please contact admin for your login credentials.
          </p>
        )}

        <div className="auth-illustration-container">
          <svg className="auth-lock-illustration" viewBox="0 0 220 180" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="110" cy="155" rx="85" ry="18" fill="#E8F5E9" />
            <path d="M30 160C45 130 80 145 95 160" stroke="#C8E6C9" strokeWidth="6" strokeLinecap="round" />
            <path d="M120 160C140 120 185 135 195 160" stroke="#A5D6A7" strokeWidth="6" strokeLinecap="round" />
            <circle cx="75" cy="135" r="4" fill="#81C784" />
            <circle cx="155" cy="130" r="5" fill="#A5D6A7" />
            
            <path d="M90 75V55C90 44 99 35 110 35C121 35 130 44 130 55V75" stroke="#3B8754" strokeWidth="9" strokeLinecap="round" />
            <rect x="78" y="72" width="64" height="52" rx="14" fill="#3B8754" />
            <circle cx="110" cy="94" r="5" fill="#FFFFFF" />
            <path d="M110 99V107" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
            <path d="M150 115C165 100 160 85 170 70C160 80 145 95 150 115Z" fill="#81C784" opacity="0.6" />
            <path d="M70 120C55 105 60 90 50 75C60 85 75 100 70 120Z" fill="#A5D6A7" opacity="0.7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
