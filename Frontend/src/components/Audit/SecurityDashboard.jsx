import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export default function SecurityDashboard() {
    const { fetchWithAuth } = useAuth();
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');

    const fetchLogs = async () => {
        try {
            const response = await fetchWithAuth('/api/audit/logs');
            if (response.ok) {
                const data = await response.json();
                setLogs(data);
            }
        } catch (error) {
            console.error("Error fetching logs:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const filteredLogs = logs.filter(log => 
        log.action.toLowerCase().includes(filter.toLowerCase()) ||
        (log.user && log.user.username.toLowerCase().includes(filter.toLowerCase())) ||
        (log.details && log.details.toLowerCase().includes(filter.toLowerCase()))
    );

    const handleExport = async () => {
        try {
            const response = await fetchWithAuth('/api/audit/export');
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'system_audit_logs.txt';
                a.click();
            } else {
                alert("Failed to export logs.");
            }
        } catch (error) {
            console.error("Error exporting logs:", error);
            alert("Error exporting logs.");
        }
    };

    if (loading) return <div className="m3-body-medium">Loading security logs...</div>;

    return (
        <section className="m3-content-wrapper subsystem-security animate-fade-in">
            <div className="security-dashboard">
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}}>
                    <h2 className="m3-display-small" style={{ color: "var(--m3-primary)" }}>System Access & Audit Logs</h2>
                    <div style={{display: 'flex', gap: '12px', alignItems: 'center'}}>
                        <div className="m3-text-field" style={{margin: 0, width: '300px'}}>
                            <input 
                                type="text" 
                                className="m3-input" 
                                style={{borderRadius: '24px', paddingLeft: '20px'}}
                                placeholder="Filter by user, action or detail..."
                                value={filter}
                                onChange={e => setFilter(e.target.value)}
                            />
                        </div>
                        <button className="m3-outlined-btn" onClick={handleExport} style={{borderRadius: '24px'}}>
                            ⬇ Export Logs (.txt)
                        </button>
                    </div>
                </div>

                <div className="m3-table-container m3-surface-container-low" style={{borderRadius: '24px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.05)'}}>
                    <table className="m3-table" style={{width: '100%'}}>
                        <thead style={{background: 'var(--m3-surface-variant)'}}>
                            <tr>
                                <th style={{padding: '16px 24px'}}>Timestamp</th>
                                <th style={{padding: '16px 24px'}}>User</th>
                                <th style={{padding: '16px 24px'}}>Action</th>
                                <th style={{padding: '16px 24px'}}>Details</th>
                                <th style={{padding: '16px 24px'}}>IP Address</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLogs.map(log => (
                                <tr key={log.id} style={{borderBottom: '1px solid var(--m3-surface-variant)'}}>
                                    <td style={{whiteSpace: 'nowrap', padding: '16px 24px'}}>{new Date(log.createdAt).toLocaleString()}</td>
                                    <td style={{fontWeight: '700', padding: '16px 24px'}}>{log.user ? log.user.username : 'SYSTEM'}</td>
                                    <td style={{padding: '16px 24px'}}>
                                        <span className={`m3-badge m3-badge-tonal ${getActionClass(log.action)}`} style={{padding: '4px 12px', borderRadius: '8px'}}>
                                            {log.action}
                                        </span>
                                    </td>
                                    <td style={{maxWidth: '350px', fontSize: '0.9rem', padding: '16px 24px', color: 'var(--m3-on-surface-variant)'}}>{log.details}</td>
                                    <td className="m3-on-surface-variant" style={{fontSize: '0.85rem', padding: '16px 24px'}}>{log.ipAddress}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredLogs.length === 0 && (
                    <div className="m3-empty-state" style={{padding: '80px', textAlign: 'center', background: 'var(--m3-surface-container-lowest)', borderRadius: '24px', marginTop: '16px'}}>
                        <p className="m3-body-large" style={{color: 'var(--m3-on-surface-variant)'}}>No security logs found matching your current filter.</p>
                    </div>
                )}
            </div>
        </section>
    );
}

function getActionClass(action) {
    if (action.includes('DELETE')) return 'badge-error';
    if (action.includes('CREATE') || action.includes('REGISTERED')) return 'badge-success';
    if (action.includes('LOGIN')) return 'badge-primary';
    return '';
}
