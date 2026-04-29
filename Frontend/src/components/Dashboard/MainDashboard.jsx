import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";

const MainDashboard = ({ onNavigate }) => {
  const { user, fetchWithAuth } = useAuth();
  const [stats, setStats] = useState({
    totalMembers: 0,
    activeElections: 0,
    totalFunds: 0,
    ongoingProjects: 0,
    recentTransactions: [],
    recentLogs: []
  });
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPERADMIN';

  useEffect(() => {
    fetchWithAuth("http://localhost:8081/api/dashboard/summary")
      .then(res => {
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        return res.json();
      })
      .then(data => {
        setStats({
          totalMembers: data.totalMembers || 0,
          activeElections: data.activeElections || 0,
          totalFunds: data.totalFunds || 0,
          ongoingProjects: data.ongoingProjects || 0,
          recentTransactions: Array.isArray(data.recentTransactions) ? data.recentTransactions : [],
          recentLogs: Array.isArray(data.recentLogs) ? data.recentLogs : []
        });
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch dashboard stats:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="m3-content-wrapper subsystem-dashboard animate-fade-in">

      {/* WELCOME BANNER */}
      <div className="m3-card m3-elevated-card" style={{ marginBottom: "20px", background: "linear-gradient(135deg, var(--m3-primary-container) 0%, var(--m3-surface) 100%)", border: "none" }}>
        <div className="m3-card-content" style={{ padding: "12px 20px", display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
          <div>
            <h2 className="m3-display-small" style={{ color: "var(--m3-primary)" }}>Community Dashboard</h2>
            <p className="m3-body-large" style={{ marginTop: "4px", color: "var(--m3-on-surface-variant)" }}>
              Here's a quick overview of what's happening in the HOA today.
            </p>
          </div>
          {isAdmin && (
            <button className="m3-fab-extended" onClick={() => onNavigate('PIS')} style={{ flexShrink: 0 }}>
              <span className="m3-fab-icon" style={{fontSize: '20px', lineHeight: 1}}>+</span>
              Add Member
            </button>
          )}
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="m3-details-grid">

        <div className="m3-card m3-elevated-card accent-card">
          <div className="m3-card-content">
            <p className="m3-label-medium">TOTAL MEMBERS</p>
            <h2 className="m3-display-small" style={{marginTop: '4px'}}>{loading ? "..." : stats.totalMembers}</h2>
          </div>
        </div>

        <div className="m3-card m3-elevated-card accent-card">
          <div className="m3-card-content">
            <p className="m3-label-medium">ACTIVE ELECTIONS</p>
            <h2 className="m3-display-small" style={{marginTop: '4px'}}>{loading ? "..." : stats.activeElections}</h2>
          </div>
        </div>

        <div className="m3-card m3-elevated-card accent-card">
          <div className="m3-card-content">
            <p className="m3-label-medium">TOTAL FUNDS</p>
            <h2 className="m3-display-small" style={{marginTop: '4px'}}>{loading ? "..." : `₱${(stats.totalFunds || 0).toLocaleString()}`}</h2>
          </div>
        </div>

        <div className="m3-card m3-elevated-card accent-card">
          <div className="m3-card-content">
            <p className="m3-label-medium">ONGOING PROJECTS</p>
            <h2 className="m3-display-small" style={{marginTop: '4px'}}>{loading ? "..." : stats.ongoingProjects}</h2>
          </div>
        </div>

      </div>

      {/* FUNDS TRANSPARENCY */}
      <div className="m3-card m3-elevated-card" style={{ marginTop: "24px" }}>
        <div className="m3-card-header" style={{ marginBottom: "16px" }}>
          <h2 className="m3-title-large" style={{ margin: 0 }}>Funds Transparency</h2>
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
                  <td style={{fontWeight: '500'}}>{tx.description || tx.category}</td>
                  <td style={{color: tx.type === 'INCOME' ? 'var(--accent-funds)' : 'var(--m3-error)', fontWeight: 'bold'}}>
                    {tx.type === 'INCOME' ? '+' : '-'} ₱{(tx.amount || 0).toLocaleString()}
                  </td>
                </tr>
              ))}
              {stats.recentTransactions.length === 0 && !loading && (
                <tr><td colSpan="3" style={{padding: '32px', textAlign: 'center', color: 'var(--m3-on-surface-variant)'}}>No recent transactions found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ACTIVITY LOGS */}
      <div className="m3-card m3-elevated-card" style={{ marginTop: "24px" }}>
        <div className="m3-card-header" style={{ marginBottom: "16px" }}>
          <h2 className="m3-title-large" style={{ margin: 0 }}>Recent Activity Logs</h2>
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
                  <td style={{fontWeight: '500'}}>{log.recordedBy?.username || "System"}</td>
                  <td><span className="m3-badge m3-badge-tonal">{log.category || log.type}</span></td>
                  <td style={{color: 'var(--m3-on-surface-variant)'}}>{new Date(log.date).toLocaleDateString()}</td>
                </tr>
              ))}
              {stats.recentLogs.length === 0 && !loading && (
                <tr><td colSpan="3" style={{padding: '32px', textAlign: 'center', color: 'var(--m3-on-surface-variant)'}}>No recent activity found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default MainDashboard;