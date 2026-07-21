import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import './VoterDashboard.css';

const VoterDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="voter-dashboard-container">
      <div className="dashboard-top-grid">
        <div className="voter-card welcome-greeting-card">
          <div className="welcome-text-group">
            <h1 className="welcome-title">
              Welcome back,<br />
              {user.name.split(' ')[0]}! 👋
            </h1>
            <p className="welcome-subtext">
              Every vote matters.<br />
              Make your voice count.
            </p>
          </div>

          <svg className="welcome-vector-illustration" viewBox="0 0 160 200" fill="none">
            <path d="M70 190C60 140 30 110 20 80C10 50 40 30 60 50C80 70 90 130 90 190Z" fill="#15803D" opacity="0.15" />
            <circle cx="95" cy="55" r="22" fill="#FDBA74" />
            <path d="M85 45C85 40 105 35 110 45" stroke="#431407" strokeWidth="4" strokeLinecap="round" />
            <rect x="70" y="80" width="50" height="110" rx="20" fill="#2E7D47" />
            <path d="M55 100C45 90 35 80 40 70C45 60 55 80 65 95Z" fill="#FDBA74" />
          </svg>
        </div>

        <div className="voter-card">
          <div>
            <span className="card-title-header">Active Election</span>
            <h2 className="election-name-heading">Presidential Election 2024</h2>
            <span className="ends-in-label">Ends in</span>

            <div className="timer-boxes-row">
              <div className="timer-box">
                <span className="timer-num-box">08</span>
                <span className="timer-unit-label">Days</span>
              </div>
              <div className="timer-box">
                <span className="timer-num-box">12</span>
                <span className="timer-unit-label">Hours</span>
              </div>
              <div className="timer-box">
                <span className="timer-num-box">45</span>
                <span className="timer-unit-label">Mins</span>
              </div>
              <div className="timer-box">
                <span className="timer-num-box">30</span>
                <span className="timer-unit-label">Secs</span>
              </div>
            </div>
          </div>

          <button onClick={() => navigate('/voter/vote')} className="vote-now-btn">
            Vote Now &rarr;
          </button>
        </div>

        <div className="voter-card">
          <div>
            <span className="card-title-header">Voting Status</span>
            <p className="not-voted-text">
              You have not voted yet in<br />
              <strong>Presidential Election 2024</strong>.
            </p>
          </div>

          <button onClick={() => navigate('/voter/vote')} className="go-vote-btn">
            Go Vote &rarr;
          </button>
        </div>
      </div>

      <div className="dashboard-bottom-grid">
        <div className="voter-card">
          <span className="card-title-header">Recent Notifications</span>

          <div className="notifications-list">
            <div className="notif-item-row">
              <div className="notif-icon-circle">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <div className="notif-info-content">
                <p className="notif-heading-text">Presidential Election 2024 is live now</p>
                <p className="notif-sub-desc">You can cast your vote now.</p>
              </div>
              <span className="notif-time-ago">10 mins ago</span>
            </div>

            <div className="notif-item-row">
              <div className="notif-icon-circle blue">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <div className="notif-info-content">
                <p className="notif-heading-text">New candidate added in your election</p>
                <p className="notif-sub-desc">Aman Patel has been added.</p>
              </div>
              <span className="notif-time-ago">1 hour ago</span>
            </div>
          </div>

          <button onClick={() => navigate('/voter/notifications')} className="view-all-notif-btn">
            View All Notifications
          </button>
        </div>

        <div className="voter-card why-vote-card">
          <div className="why-vote-icon-box">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>

          <h3 className="why-vote-title">Why Vote?</h3>
          <p className="why-vote-body">
            Your vote is your voice.<br />
            Together we build a better future for everyone.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VoterDashboard;
