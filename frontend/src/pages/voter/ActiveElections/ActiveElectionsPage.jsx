import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ActiveElectionsPage.css';

const ActiveElectionsPage = () => {
  const navigate = useNavigate();

  const activeElections = [
    {
      id: 1,
      title: 'Presidential Election 2024',
      description: 'Vote for the next College President to lead student initiatives and campus development.',
      startDate: '01 May 2024',
      endDate: '31 May 2024',
      candidatesCount: 4,
      status: 'Live'
    },
    {
      id: 2,
      title: 'Student Council Election 2024',
      description: 'Elect representatives for the University Student Council positions.',
      startDate: '10 May 2024',
      endDate: '25 May 2024',
      candidatesCount: 3,
      status: 'Live'
    },
    {
      id: 3,
      title: 'Sports Head Election 2024',
      description: 'Vote for the Sports Department Chairperson for the upcoming academic year.',
      startDate: '15 May 2024',
      endDate: '30 May 2024',
      candidatesCount: 2,
      status: 'Live'
    }
  ];

  return (
    <div className="active-elections-container">
      <h1 className="active-elections-title">Active Elections</h1>

      <div className="elections-grid-layout">
        {activeElections.map((item) => (
          <div key={item.id} className="election-card-item">
            <div>
              <div className="card-top-row">
                <span className="election-badge-live">● {item.status}</span>
                <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>{item.candidatesCount} Candidates</span>
              </div>

              <h2 className="election-card-title">{item.title}</h2>
              <p className="election-card-desc">{item.description}</p>
            </div>

            <div className="election-info-pills">
              <div className="info-pill">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                <span>Ends: {item.endDate}</span>
              </div>
            </div>

            <button onClick={() => navigate('/voter/vote')} className="vote-now-card-btn">
              Vote Now &rarr;
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActiveElectionsPage;
