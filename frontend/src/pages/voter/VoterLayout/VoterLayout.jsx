import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useElections } from '../../../context/ElectionsContext';
import './VoterLayout.css';

const VoterLayout = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { elections } = useElections();

  const hasActiveNotification = elections.some((e) => e.status === 'Active');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      path: '/voter/dashboard',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      )
    },
    {
      id: 'active-elections',
      label: 'Active Elections',
      path: '/voter/active-elections',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      )
    },
    {
      id: 'vote',
      label: 'Vote',
      path: '/voter/vote',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
      )
    },
    {
      id: 'status',
      label: 'Voting Status',
      path: '/voter/status',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      )
    },
    {
      id: 'history',
      label: 'Election History',
      path: '/voter/history',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
      )
    },
    {
      id: 'notifications',
      label: 'Notifications',
      path: '/voter/notifications',
      badge: hasActiveNotification,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
      )
    },
    {
      id: 'profile',
      label: 'Profile',
      path: '/voter/profile',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      )
    }
  ];

  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  return (
    <div className="voter-container">
      {isSidebarOpen && (
        <div 
          className="voter-sidebar-overlay" 
          onClick={() => setIsSidebarOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.4)',
            zIndex: 998,
            backdropFilter: 'blur(2px)'
          }}
        />
      )}
      <aside className={`voter-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="voter-sidebar-top">
          <NavLink to="/" className="voter-brand">
            <div className="voter-brand-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <path d="m9 12 2 2 4-4"/>
              </svg>
            </div>
            <span className="voter-brand-text">VoteSecure</span>
          </NavLink>

          <nav className="voter-nav">
            {menuItems.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive }) => `voter-nav-item ${isActive ? 'active' : ''}`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge && <span className="nav-badge-dot" style={{ marginLeft: 'auto', backgroundColor: '#16A34A', width: '8px', height: '8px', borderRadius: '50%' }}></span>}
              </NavLink>
            ))}
          </nav>
        </div>

        <button onClick={handleLogout} className="voter-nav-logout">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          <span>Logout</span>
        </button>
      </aside>

      <div className="voter-main-wrapper">
        <header className="voter-topbar">
          <button 
            className="mobile-menu-toggle" 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#0f172a',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '0.75rem',
              padding: '0.25rem',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: '#f8fafc',
              border: '1px solid #f1f5f9',
              display: 'none' // will toggle display via media queries
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          <div className="voter-search-wrapper">
            <svg className="voter-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input 
              type="text" 
              placeholder="Search..." 
              className="voter-search-input"
            />
          </div>

          <div className="voter-topbar-right">
            <button onClick={() => navigate('/voter/notifications')} className="voter-notification-btn" aria-label="Notifications">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              {hasActiveNotification && (
                <span className="notification-badge-dot" style={{ position: 'absolute', top: '8px', right: '8px', width: '8px', height: '8px', backgroundColor: '#EF4444', borderRadius: '50%', border: '1px solid #FFFFFF' }}></span>
              )}
            </button>

            <div onClick={() => navigate('/voter/profile')} className="voter-profile-menu">
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="voter-avatar" 
              />
              <div className="voter-user-info">
                <span className="voter-user-name">{user.name}</span>
                <span className="voter-user-role">{user.role}</span>
              </div>
            </div>
          </div>
        </header>

        <main className="voter-body-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default VoterLayout;
