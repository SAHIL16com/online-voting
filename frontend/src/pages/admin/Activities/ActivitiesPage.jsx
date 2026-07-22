import React, { useEffect } from 'react';
import { useElections } from '../../../context/ElectionsContext';
import { useCandidates } from '../../../context/CandidatesContext';
import { useVoters } from '../../../context/VotersContext';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './ActivitiesPage.css';

const ActivitiesPage = () => {
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

    return list.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const allActivities = getSystemActivities();

  return (
    <div className="activities-page-container">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button onClick={() => navigate('/admin/dashboard')} className="back-activity-btn" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem', display: 'flex', alignItems: 'center', color: '#64748B' }}>
          ←
        </button>
        <h1 className="activities-title">SYSTEM ACTIVITIES LOG</h1>
      </div>

      <div className="activities-main-card">
        <h3 className="activities-card-title">All Dynamic Operations Roster</h3>
        <p className="activities-subtitle">Audit trail of all registered elections, candidates, and voters from database.</p>

        <div className="activities-full-list" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1.5rem' }}>
          {allActivities.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#64748B' }}>No system activities recorded yet.</div>
          ) : (
            allActivities.map((act) => (
              <div key={act.id} className="activity-item-row" style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem', borderBottom: '1px solid #F1F5F9', paddingBottom: '1.25rem' }}>
                <div className="activity-icon-wrapper" style={{ backgroundColor: act.bgColor, color: act.color, width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justify: 'center', flexShrink: 0 }}>
                  {act.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <p className="activity-title-text" style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>{act.title}</p>
                  <p className="activity-sub-text" style={{ fontSize: '0.85rem', color: '#64748B', margin: '4px 0 0' }}>{act.desc}</p>
                </div>
                <span className="activity-time-text" style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 500 }}>{getRelativeTime(act.date)}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivitiesPage;
