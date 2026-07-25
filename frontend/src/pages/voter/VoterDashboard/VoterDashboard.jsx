import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useElections } from '../../../context/ElectionsContext';
import './VoterDashboard.css';

const VoterDashboard = () => {
  const navigate = useNavigate();
  const { currentUser, token } = useAuth();
  const { elections } = useElections();

  const [hasVoted, setHasVoted] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);

  const activeElection = elections.find((e) => e.status === 'Active');

  // Check if voter has already voted in the active election
  useEffect(() => {
    const checkVotedStatus = async () => {
      if (!activeElection) {
        setCheckingStatus(false);
        return;
      }
      try {
        const currentToken = token || localStorage.getItem('voting_token');
        const response = await fetch(`/api/votes/check/${activeElection._id}`, {
          headers: {
            Authorization: `Bearer ${currentToken}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setHasVoted(data.hasVoted);
        }
      } catch (err) {
        console.error('Failed to check vote status:', err);
      } finally {
        setCheckingStatus(false);
      }
    };

    checkVotedStatus();
  }, [activeElection, token]);

  const getDynamicNotifications = () => {
    const list = [];
    
    // Check for Active elections
    const activeElections = elections.filter((e) => e.status === 'Active');
    
    activeElections.forEach((el) => {
      list.push({
        id: `el-active-${el._id}`,
        title: `${el.name} is Live Now`,
        description: `Polling is open. Click Go Vote to cast your vote.`,
        time: 'Just now',
        iconColor: '#16A34A',
        iconBg: '#DCFCE7',
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        )
      });
    });
    return list;
  };

  const notificationsList = getDynamicNotifications();

  if (!activeElection) {
    return (
      <div className="voter-dashboard-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center' }}>
        <div style={{ padding: '3rem 2rem', border: '1px dashed #E2E8F0', borderRadius: '24px', backgroundColor: '#FFFFFF', maxWidth: '440px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.02), 0 8px 10px -6px rgba(0,0,0,0.02)' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: '#94A3B8' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.75rem' }}>No Active Election</h3>
          <p style={{ fontSize: '0.88rem', color: '#64748B', lineHeight: 1.5, margin: 0 }}>
            There are no active elections to vote in right now. Please wait for the admin to launch an election.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="voter-dashboard-container">
      <div className="dashboard-top-grid">
        <div className="voter-card welcome-greeting-card">
          <div className="welcome-text-group">
            <h1 className="welcome-title">
              Welcome back,<br />
              {currentUser?.fullName ? currentUser.fullName.split(' ')[0] : 'Voter'}! 👋
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
            {activeElection ? (
              <>
                <h2 className="election-name-heading">{activeElection.name}</h2>
                <span className="ends-in-label">Status: Active</span>
                <div style={{ color: '#16A34A', fontWeight: 800, marginTop: '0.5rem', fontSize: '0.9rem' }}>
                  ● Polls are currently OPEN
                </div>
              </>
            ) : (
              <>
                <h2 className="election-name-heading" style={{ color: '#94A3B8' }}>No Active Polls</h2>
                <p style={{ color: '#64748B', fontSize: '0.88rem', marginTop: '0.4rem' }}>
                  Keep checking back or check your notifications.
                </p>
              </>
            )}
          </div>

          <button onClick={() => navigate('/voter/vote')} className="vote-now-btn" disabled={!activeElection} style={{ opacity: activeElection ? 1 : 0.6 }}>
            Vote Now &rarr;
          </button>
        </div>

        <div className="voter-card">
          <div>
            <span className="card-title-header">Voting Status</span>
            {checkingStatus ? (
              <p className="not-voted-text">Checking voting record...</p>
            ) : !activeElection ? (
              <p className="not-voted-text">No active polls to check status.</p>
            ) : hasVoted ? (
              <p className="not-voted-text" style={{ color: '#16A34A' }}>
                You have successfully **Voted** in<br />
                <strong>{activeElection.name}</strong>.
              </p>
            ) : (
              <p className="not-voted-text">
                You have **not voted** yet in<br />
                <strong>{activeElection.name}</strong>.
              </p>
            )}
          </div>

          <button onClick={() => navigate('/voter/vote')} className="go-vote-btn" disabled={!activeElection} style={{ opacity: activeElection ? 1 : 0.6 }}>
            {hasVoted ? 'View Receipt' : 'Go Vote'} &rarr;
          </button>
        </div>
      </div>

      <div className="dashboard-bottom-grid">
        <div className="voter-card">
          <span className="card-title-header">Recent Notifications</span>

          <div className="notifications-list">
            {notificationsList.map((item) => (
              <div key={item.id} className="notif-item-row">
                <div className="notif-icon-circle" style={{ backgroundColor: item.iconBg, color: item.iconColor }}>
                  {item.icon}
                </div>
                <div className="notif-info-content">
                  <p className="notif-heading-text">{item.title}</p>
                  <p className="notif-sub-desc">{item.description}</p>
                </div>
                <span className="notif-time-ago">{item.time}</span>
              </div>
            ))}
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
