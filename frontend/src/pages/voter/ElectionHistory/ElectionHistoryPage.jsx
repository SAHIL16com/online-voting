import React from 'react';
import './ElectionHistoryPage.css';

const ElectionHistoryPage = () => {
  const historyList = [
    {
      id: 1,
      name: 'Department Head Election 2023',
      winner: 'Priya Sharma',
      winnerPhoto: '/candidate_priya.png',
      totalVotes: '2,450',
      yourStatus: 'Voted',
      date: '20 Apr 2024'
    },
    {
      id: 2,
      name: 'Class Representative Election 2023',
      winner: 'Rahul Verma',
      winnerPhoto: '/candidate_rahul.png',
      totalVotes: '1,890',
      yourStatus: 'Voted',
      date: '20 Mar 2024'
    },
    {
      id: 3,
      name: 'Cultural Festival Lead Election 2023',
      winner: 'Neha Singh',
      winnerPhoto: '/candidate_neha.png',
      totalVotes: '3,120',
      yourStatus: 'Did Not Vote',
      date: '15 Dec 2023'
    }
  ];

  return (
    <div className="election-history-container">
      <h1 className="history-title">Election History</h1>

      <div className="history-main-card">
        <div className="history-table-responsive">
          <table className="history-table">
            <thead>
              <tr>
                <th>Election Name</th>
                <th>Winner</th>
                <th>Total Votes</th>
                <th>Your Status</th>
                <th>Completed Date</th>
              </tr>
            </thead>
            <tbody>
              {historyList.map((row) => (
                <tr key={row.id}>
                  <td style={{ fontWeight: 700, color: '#0F172A' }}>{row.name}</td>
                  <td>
                    <div className="history-winner-cell">
                      <img src={row.winnerPhoto} alt={row.winner} className="winner-avatar" />
                      <span>{row.winner}</span>
                    </div>
                  </td>
                  <td>{row.totalVotes}</td>
                  <td>
                    <span className={row.yourStatus === 'Voted' ? 'badge-history-voted' : 'badge-history-skipped'}>
                      {row.yourStatus}
                    </span>
                  </td>
                  <td>{row.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ElectionHistoryPage;
