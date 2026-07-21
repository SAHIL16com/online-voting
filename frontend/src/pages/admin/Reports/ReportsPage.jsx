import React, { useState } from 'react';
import './ReportsPage.css';

const ReportsPage = () => {
  const [reportType, setReportType] = useState('All Reports');
  const [selectedElection, setSelectedElection] = useState('All Elections');

  const reportsList = [
    {
      id: 1,
      title: 'Election Summary Report',
      election: 'College President Election 2024',
      date: '31 May 2024',
      type: 'Summary Report'
    },
    {
      id: 2,
      title: 'Candidate Performance Report',
      election: 'College President Election 2024',
      date: '25 May 2024',
      type: 'Candidate Performance'
    },
    {
      id: 3,
      title: 'Voter Participation Report',
      election: 'Student Council Election 2024',
      date: '18 May 2024',
      type: 'Voter Participation'
    },
    {
      id: 4,
      title: 'Votes Detail Report',
      election: 'Sports Head Election 2024',
      date: '15 May 2024',
      type: 'Votes Detail'
    },
    {
      id: 5,
      title: 'Voter List Report',
      election: 'All Elections',
      date: '10 May 2024',
      type: 'Voter List'
    }
  ];

  const handleDownloadReport = (title) => {
    alert(`Downloading ${title}...`);
  };

  const filteredReports = reportsList.filter((item) => {
    const matchesType = reportType === 'All Reports' || item.type === reportType;
    const matchesElection = selectedElection === 'All Elections' || item.election === selectedElection || item.election === 'All Elections';
    return matchesType && matchesElection;
  });

  return (
    <div className="reports-page-container">
      <h1 className="reports-title">10. REPORTS</h1>

      <div className="reports-main-card">
        <div className="reports-filters-row">
          <div className="report-filter-group">
            <label className="filter-group-label">Select Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="report-select-dropdown"
            >
              <option>All Reports</option>
              <option>Summary Report</option>
              <option>Candidate Performance</option>
              <option>Voter Participation</option>
              <option>Votes Detail</option>
              <option>Voter List</option>
            </select>
          </div>

          <div className="report-filter-group">
            <label className="filter-group-label">Select Election</label>
            <select
              value={selectedElection}
              onChange={(e) => setSelectedElection(e.target.value)}
              className="report-select-dropdown"
            >
              <option>All Elections</option>
              <option>College President Election 2024</option>
              <option>Student Council Election 2024</option>
              <option>Sports Head Election 2024</option>
            </select>
          </div>
        </div>

        <div className="reports-table-wrapper">
          <table className="reports-table">
            <tbody>
              {filteredReports.map((row) => (
                <tr key={row.id}>
                  <td className="report-title-cell">{row.title}</td>
                  <td className="report-election-cell">{row.election}</td>
                  <td className="report-date-cell">{row.date}</td>
                  <td style={{ width: '40px', textAlign: 'right' }}>
                    <button
                      onClick={() => handleDownloadReport(row.title)}
                      className="report-action-btn"
                      aria-label="Download report"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="7 10 12 15 17 10"/>
                        <line x1="12" y1="15" x2="12" y2="3"/>
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="reports-footer">
          <span className="reports-count-text">
            Showing 1 to {filteredReports.length} of 25 results
          </span>

          <div className="pagination-controls">
            <button className="page-btn">&lt;</button>
            <button className="page-btn active">1</button>
            <button className="page-btn">2</button>
            <button className="page-btn">3</button>
            <button className="page-btn">4</button>
            <button className="page-btn">5</button>
            <button className="page-btn">&gt;</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
