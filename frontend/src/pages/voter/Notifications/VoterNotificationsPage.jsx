import React from 'react';
import { useElections } from '../../../context/ElectionsContext';
import './VoterNotificationsPage.css';
const VoterNotificationsPage = () => {
  const { elections } = useElections();
  const getDynamicNotifications = () => {
    const list = [];
    // Check for Active elections
    const activeElections = elections.filter((e) => e.status === 'Active');
    activeElections.forEach((el) => {
      list.push({
        id: `el-active-${el._id}`,
        title: `${el.name} is Live Now`,
        description: `You are eligible to vote. Polling is open for ${el.name}. Please go to the Vote tab to cast your vote!`,
        time: 'Just now',
        unread: true
      });
    });
    return list;
  };
  const notifications = getDynamicNotifications();
  return (
    <div className="notifications-page-container">
      <h1 className="notifications-title">Notifications</h1>

      <div className="notifications-main-card">
        <div className="notif-page-header">
          <span style={{ fontSize: '0.9rem', color: '#64748B', fontWeight: 600 }}>
            {notifications.filter((n) => n.unread).length} Unread Notifications
          </span>
        </div>
        <div className="notif-page-list">
          {notifications.map((item) => (
            <div key={item.id} className={`notif-card-item ${item.unread ? 'unread' : ''}`}>
              <div className="notif-icon-box" style={{ backgroundColor: item.unread ? '#E8F5E9' : '#F1F5F9', color: item.unread ? '#2E7D47' : '#64748B' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
              </div>
              <div className="notif-card-content">
                <h3 className="notif-card-title">{item.title}</h3>
                <p className="notif-card-desc">{item.description}</p>
              </div>
              <span className="notif-card-time">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VoterNotificationsPage;
