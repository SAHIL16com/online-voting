import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import './AdminLayout.css';

const AdminLayout = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const navigate = useNavigate();
  const { logout, currentUser, adminUser } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      path: '/admin/dashboard',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      )
    },
    {
      id: 'elections',
      label: 'Elections',
      path: '/admin/elections',
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
      id: 'candidates',
      label: 'Candidates',
      path: '/admin/candidates',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      )
    },
    {
      id: 'voters',
      label: 'Voters',
      path: '/admin/voters',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      )
    },
    {
      id: 'results',
      label: 'Results',
      path: '/admin/results',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10"/>
          <line x1="12" y1="20" x2="12" y2="4"/>
          <line x1="6" y1="20" x2="6" y2="14"/>
        </svg>
      )
    },
    {
      id: 'reports',
      label: 'Reports',
      path: '/admin/reports',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10 9 9 9 8 9"/>
        </svg>
      )
    },
    {
      id: 'settings',
      label: 'Settings',
      path: '/admin/settings',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
        </svg>
      )
    },
    {
      id: 'profile',
      label: 'Profile',
      path: '/admin/profile',
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
    <div className="admin-container">
      {isSidebarOpen && (
        <div 
          className="admin-sidebar-overlay" 
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
      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-top">
          <NavLink to="/" className="admin-brand">
            <div className="admin-brand-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <path d="m9 12 2 2 4-4"/>
              </svg>
            </div>
            <span className="admin-brand-text">VoteSecure</span>
          </NavLink>

          <nav className="admin-nav">
            {menuItems.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <button onClick={handleLogout} className="admin-nav-logout">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          <span>Logout</span>
        </button>
      </aside>

      <div className="admin-main-wrapper">
        <header className="admin-topbar">
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
          <div className="admin-search-wrapper" style={{ position: 'relative' }}>
            <svg className="admin-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input 
              type="text" 
              placeholder="Search sidebar elements..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="admin-search-input"
            />
            {searchQuery.trim() !== '' && (
              <div 
                className="search-results-dropdown" 
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  width: '260px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid #EEF2F6',
                  boxShadow: '0 10px 25px rgba(15, 23, 42, 0.08)',
                  marginTop: '0.5rem',
                  zIndex: 100,
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '0.5rem 0',
                  overflow: 'hidden'
                }}
              >
                {menuItems.filter(item => item.label.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 ? (
                  <div style={{ padding: '0.7rem 1rem', color: '#64748B', fontSize: '0.85rem' }}>No results found</div>
                ) : (
                  menuItems.filter(item => item.label.toLowerCase().includes(searchQuery.toLowerCase())).map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        navigate(item.path);
                        setSearchQuery('');
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.8rem',
                        padding: '0.7rem 1rem',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s ease',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        color: '#0F172A'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F0FDF4'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <span style={{ color: '#2E7D47', display: 'flex', alignItems: 'center' }}>{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <div className="admin-topbar-right">
            <div onClick={() => navigate('/admin/profile')} className="admin-profile-menu">
              <img 
                src={currentUser?.avatar || adminUser.avatar} 
                alt={currentUser?.fullName || adminUser.name} 
                className="admin-avatar" 
              />
              <div className="admin-user-info">
                <span className="admin-user-name">{currentUser?.fullName || adminUser.name}</span>
                <span className="admin-user-role">{currentUser?.role === 'admin' ? 'Administrator' : (currentUser?.role || adminUser.role)}</span>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2">
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </div>
          </div>
        </header>

        <main className="admin-body-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
