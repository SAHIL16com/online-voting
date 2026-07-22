import React, { useEffect } from 'react';
import { useElections } from '../../../context/ElectionsContext';
import { useCandidates } from '../../../context/CandidatesContext';
import { useVoters } from '../../../context/VotersContext';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const { elections, fetchElections } = useElections();
  const { candidates, fetchCandidates } = useCandidates();
  const { voters, fetchVoters } = useVoters();
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const currentToken = token || localStorage.getItem('voting_token');
    if (currentToken) {
      if (fetchElections) fetchElections();
      if (fetchCandidates) fetchCandidates();
      if (fetchVoters) fetchVoters(currentToken);
    }
  }, [token]);

  // Calculate stats dynamically
  const totalElections = elections.length;
  const totalCandidates = candidates.length;
  const totalVoters = voters.length;
  const totalVotesCast = candidates.reduce((sum, c) => sum + (c.votes || 0), 0);

  const stats = [
    {
      label: 'Total Elections',
      value: totalElections.toString(),
      iconClass: 'icon-green',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      )
    },
    {
      label: 'Total Candidates',
      value: totalCandidates.toString(),
      iconClass: 'icon-yellow',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      )
    },
    {
      label: 'Total Voters',
      value: totalVoters.toString(),
      iconClass: 'icon-emerald',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="8.5" cy="7" r="4"/>
          <line x1="20" y1="8" x2="20" y2="14"/>
          <line x1="23" y1="11" x2="17" y2="11"/>
        </svg>
      )
    },
    {
      label: 'Total Votes Cast',
      value: totalVotesCast.toString(),
      iconClass: 'icon-purple',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          <path d="m9 12 2 2 4-4"/>
        </svg>
      )
    }
  ];

  const getRelativeTime = (dateString) => {
    if (!dateString) return 'Just now';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  const getSystemActivities = () => {
    const list = [];

    elections.forEach((el) => {
      list.push({
        id: `el-${el._id}`,
        title: 'New Election Created',
        desc: `Election "${el.name}" was initialized in the database.`,
        date: el.createdAt,
        color: '#16A34A',
        bgColor: '#DCFCE7',
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
          </svg>
        )
      });
    });

    candidates.forEach((cand) => {
      list.push({
        id: `cand-${cand._id}`,
        title: 'Candidate Registered',
        desc: `Candidate "${cand.name}" was registered under "${cand.partyGroup || 'General'}".`,
        date: cand.createdAt,
        color: '#CA8A04',
        bgColor: '#FEF9C3',
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        )
      });
    });

    voters.forEach((vot) => {
      list.push({
        id: `vot-${vot._id || vot.id}`,
        title: 'Voter Registered',
        desc: `Voter "${vot.name}" (ID: ${vot.voterId}) account was created.`,
        date: vot.createdAt || vot.date,
        color: '#0D9488',
        bgColor: '#CCFBF1',
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="8.5" cy="7" r="4"/>
          </svg>
        )
      });
    });

    // Return top 5 activities sorted by date
    return list.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
  };

  const recentActivities = getSystemActivities();

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Dashboard</h1>

      <div className="dashboard-stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="dashboard-stat-card">
            <div className={`stat-card-icon ${stat.iconClass}`}>
              {stat.icon}
            </div>
            <div className="stat-card-content">
              <span className="stat-card-value">{stat.value}</span>
              <span className="stat-card-label">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-content-single" style={{ display: 'grid', gridTemplateColumns: '1fr', marginTop: '1rem' }}>
        <div className="dashboard-card" style={{ padding: '2.2rem' }}>
          <div className="card-header" style={{ borderBottom: '1px solid #EEF2F6', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
            <div>
              <h3 className="card-title" style={{ fontSize: '1.25rem', fontWeight: 800 }}>Recent Activities</h3>
              <p style={{ color: '#64748B', fontSize: '0.85rem', margin: '4px 0 0', fontWeight: 500 }}>Live monitoring logs of elections, candidates and voter registration events.</p>
            </div>
          </div>

          <div className="activity-list" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {recentActivities.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#64748B' }}>No dynamic activities recorded.</div>
            ) : (
              recentActivities.map((act) => (
                <div key={act.id} className="activity-item" style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem', borderBottom: '1px solid #F8FAFC', paddingBottom: '1.1rem' }}>
                  <div className="activity-icon-wrapper" style={{ backgroundColor: act.bgColor, color: act.color, width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justify: 'center', flexShrink: 0 }}>
                    {act.icon}
                  </div>
                  <div className="activity-details" style={{ flex: 1 }}>
                    <p className="activity-title-text" style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>{act.title}</p>
                    <p className="activity-sub-text" style={{ fontSize: '0.82rem', color: '#64748B', margin: '3px 0 0' }}>{act.desc}</p>
                  </div>
                  <span className="activity-time" style={{ fontSize: '0.78rem', color: '#94A3B8', fontWeight: 500 }}>{getRelativeTime(act.date)}</span>
                </div>
              ))
            )}
          </div>

          <button onClick={() => navigate('/admin/activities')} className="view-all-activity-btn" style={{ marginTop: '1.8rem', width: '100%', py: '0.9rem', fontSize: '0.9rem', fontWeight: 800, border: '1px solid #E2E8F0', borderRadius: '12px', backgroundColor: '#FAFDFB', color: '#2E7D47', cursor: 'pointer', transition: 'all 0.2s ease' }}>
            View All Activities Log
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
