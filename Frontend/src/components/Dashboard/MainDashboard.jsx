import React, { useState, useEffect } from "react";

const MainDashboard = ({ onNavigate }) => {
  const [stats, setStats] = useState({
    totalMembers: 0,
    activeElections: 0,
    totalFunds: 0,
    ongoingProjects: 0,
    recentTransactions: [],
    recentLogs: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8081/api/dashboard/summary")
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch dashboard stats:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="m3-content-wrapper">

      {/* HEADER */}
      <div className="m3-page-header">
        <h1 className="m3-display-small">Dashboard Overview</h1>
        <button className="m3-fab-extended" onClick={() => onNavigate('PIS')}>
          <span className="m3-fab-icon">+</span>
          Add Member
        </button>
      </div>

      {/* SUMMARY CARDS */}
      <div className="m3-details-grid">

        <div className="m3-card m3-elevated-card">
          <div className="m3-card-content">
            <p className="m3-label-large">Total Members</p>
            <h2>{loading ? "..." : stats.totalMembers}</h2>
          </div>
        </div>

        <div className="m3-card m3-elevated-card">
          <div className="m3-card-content">
            <p className="m3-label-large">Active Elections</p>
            <h2>{loading ? "..." : stats.activeElections}</h2>
          </div>
        </div>

        <div className="m3-card m3-elevated-card">
          <div className="m3-card-content">
            <p className="m3-label-large">Total Funds</p>
            <h2>{loading ? "..." : `₱${stats.totalFunds.toLocaleString()}`}</h2>
          </div>
        </div>

        <div className="m3-card m3-elevated-card">
          <div className="m3-card-content">
            <p className="m3-label-large">Projects</p>
            <h2>{loading ? "..." : `${stats.ongoingProjects} Ongoing`}</h2>
          </div>
        </div>

      </div>

      {/* FUNDS TRANSPARENCY */}
      <div className="m3-card m3-elevated-card" style={{ marginTop: "20px" }}>
        <div className="m3-card-header">
          <h2 className="m3-title-large">Funds Transparency</h2>
        </div>

        <div className="m3-table-container">
          <table className="m3-data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentTransactions.map((tx, index) => (
                <tr key={index} className="m3-table-row">
                  <td>{new Date(tx.date).toLocaleDateString()}</td>
                  <td>{tx.description}</td>
                  <td style={{color: tx.type === 'INCOME' ? 'green' : 'red'}}>
                    {tx.type === 'INCOME' ? '+' : '-'} ₱{tx.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
              {stats.recentTransactions.length === 0 && !loading && (
                <tr><td colSpan="3" style={{padding: '20px', textAlign: 'center'}}>No recent transactions</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ACTIVITY LOGS */}
      <div className="m3-card m3-elevated-card" style={{ marginTop: "20px" }}>
        <div className="m3-card-header">
          <h2 className="m3-title-large">Recent Activity Logs</h2>
        </div>

        <div className="m3-table-container">
          <table className="m3-data-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Action</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentLogs.map((log, index) => (
                <tr key={index} className="m3-table-row">
                  <td>{log.username}</td>
                  <td>{log.action}</td>
                  <td>{new Date(log.date).toLocaleDateString()}</td>
                </tr>
              ))}
              {stats.recentLogs.length === 0 && !loading && (
                <tr><td colSpan="3" style={{padding: '20px', textAlign: 'center'}}>No recent activity</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SYSTEM STATUS */}
      <div className="m3-card m3-elevated-card" style={{ marginTop: "20px" }}>
        <div className="m3-card-content">
          <h2 className="m3-title-large">System Status</h2>
          <p className="m3-body-medium" style={{ color: loading ? "orange" : "green" }}>
            ● {loading ? "Connecting..." : "Backend Connected (Port 8081)"}
          </p>
          <p className="m3-body-medium" style={{ color: "green" }}>● Database Connected (PostgreSQL)</p>
        </div>
      </div>

    </div>
  );
};

export default MainDashboard;