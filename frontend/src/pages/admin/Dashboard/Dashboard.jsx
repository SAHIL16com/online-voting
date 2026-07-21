import React from 'react';
import './Dashboard.css';

const Dashboard = () => {
  const stats = [
    {
      label: 'Total Elections',
      value: '0',
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
      value: '0',
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
      value: '0',
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
      label: 'Total Votes',
      value: '0',
      iconClass: 'icon-purple',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          <path d="m9 12 2 2 4-4"/>
        </svg>
      )
    }
  ];

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

      <div className="dashboard-content-grid">
        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">Elections Overview</h3>
            <div className="chart-legend">
              <div className="legend-item">
                <span className="legend-dot green-dot" />
                <span>Elections</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot emerald-dot" />
                <span>Votes</span>
              </div>
            </div>
          </div>

          <div className="chart-svg-container">
            <svg viewBox="0 0 600 220" width="100%" height="100%" preserveAspectRatio="none">
              <line x1="40" y1="40" x2="580" y2="40" stroke="#F1F5F9" strokeWidth="1"/>
              <line x1="40" y1="90" x2="580" y2="90" stroke="#F1F5F9" strokeWidth="1"/>
              <line x1="40" y1="140" x2="580" y2="140" stroke="#F1F5F9" strokeWidth="1"/>
              <line x1="40" y1="190" x2="580" y2="190" stroke="#F1F5F9" strokeWidth="1"/>

              <text x="15" y="45" fontSize="11" fill="#94A3B8">2K</text>
              <text x="15" y="95" fontSize="11" fill="#94A3B8">1.5K</text>
              <text x="15" y="145" fontSize="11" fill="#94A3B8">1K</text>
              <text x="15" y="195" fontSize="11" fill="#94A3B8">0</text>

              <text x="60" y="215" fontSize="11" fill="#94A3B8">Jan</text>
              <text x="160" y="215" fontSize="11" fill="#94A3B8">Feb</text>
              <text x="260" y="215" fontSize="11" fill="#94A3B8">Mar</text>
              <text x="360" y="215" fontSize="11" fill="#94A3B8">Apr</text>
              <text x="460" y="215" fontSize="11" fill="#94A3B8">May</text>
              <text x="560" y="215" fontSize="11" fill="#94A3B8">Jun</text>

              <polyline
                fill="none"
                stroke="#16A34A"
                strokeWidth="2.5"
                points="60,190 160,120 260,140 360,80 460,110 560,70"
              />
              <polyline
                fill="none"
                stroke="#059669"
                strokeWidth="2.5"
                points="60,190 160,150 260,170 360,130 460,150 560,110"
              />

              <circle cx="60" cy="190" r="4" fill="#16A34A"/>
              <circle cx="160" cy="120" r="4" fill="#16A34A"/>
              <circle cx="260" cy="140" r="4" fill="#16A34A"/>
              <circle cx="360" cy="80" r="4" fill="#16A34A"/>
              <circle cx="460" cy="110" r="4" fill="#16A34A"/>
              <circle cx="560" cy="70" r="4" fill="#16A34A"/>

              <circle cx="60" cy="190" r="4" fill="#059669"/>
              <circle cx="160" cy="150" r="4" fill="#059669"/>
              <circle cx="260" cy="170" r="4" fill="#059669"/>
              <circle cx="360" cy="130" r="4" fill="#059669"/>
              <circle cx="460" cy="150" r="4" fill="#059669"/>
              <circle cx="560" cy="110" r="4" fill="#059669"/>
            </svg>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">Recent Activity</h3>
          </div>

          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon-wrapper" style={{ backgroundColor: '#DCFCE7', color: '#16A34A' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
              </div>
              <div className="activity-details">
                <p className="activity-title-text">System Initialized</p>
                <p className="activity-sub-text">Admin panel ready for setup</p>
              </div>
              <span className="activity-time">Just now</span>
            </div>
          </div>

          <button className="view-all-activity-btn">
            View All Activity
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
