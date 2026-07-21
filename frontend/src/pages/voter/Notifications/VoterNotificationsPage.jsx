import React, { useState } from 'react';
import './VoterNotificationsPage.css';

const VoterNotificationsPage = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Presidential Election 2024 is live now',
      description: 'You are eligible to vote. Polling is open until 31 May 2024.',
      time: '10 mins ago',
      unread: true
    },
    {
      id: 2,
      title: 'New candidate added in your election',
      description: 'Aman Patel from Commerce department has been registered.',
      time: '1 hour ago',
      unread: true
    },
    {
      id: 3,
      title: 'Reminder: Voting Closes Soon',
      description: 'Don\'t forget to cast your vote for Sports Head Election 2024.',
      time: '1 day ago',
      unread: false
    },
    {
      id: 4,
      title: 'Account Verification Complete',
      description: 'Your voter account has been verified by the election committee.',
      time: '3 days ago',
      unread: false
    }
  ]);

  const handleMarkAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, unread: false })));
  };

  return (
    <div className="notifications-page-container">
      <h1 className="notifications-title">Notifications</h1>

      <div className="notifications-main-card">
        <div className="notif-page-header">
          <span style={{ fontSize: '0.9rem', color: '#64748B', fontWeight: 600 }}>
            {notifications.filter((n) => n.unread).length} Unread Notifications
          </span>

          <button onClick={handleMarkAllRead} className="mark-read-btn">
            Mark all as read
          </button>
        </div>

        <div className="notif-page-list">
          {notifications.map((item) => (
            <div key={item.id} className={`notif-card-item ${item.unread ? 'unread' : ''}`}>
              <div className="notif-icon-box">
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
