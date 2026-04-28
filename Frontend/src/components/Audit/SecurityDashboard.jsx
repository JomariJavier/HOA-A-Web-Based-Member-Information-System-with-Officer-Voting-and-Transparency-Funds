import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export default function SecurityDashboard() {
    const { fetchWithAuth } = useAuth();
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');

    const fetchLogs = async () => {
        try {
            const response = await fetchWithAuth('http://localhost:8081/api/audit/logs');
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

    if (loading) return <div className="m3-body-medium">Loading security logs...</div>;

    return (
        <div className="security-dashboard animate-fade-in">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}}>
                <h2 className="m3-title-large">System Access & Audit Logs</h2>
                <div className="m3-text-field" style={{margin: 0, width: '300px'}}>
                    <input 
                        type="text" 
                        className="m3-input" 
                        placeholder="Filter by user, action or detail..."
                        value={filter}
                        onChange={e => setFilter(e.target.value)}
                    />
                </div>
            </div>

            <div className="m3-table-container m3-surface-container-low" style={{borderRadius: '16px', overflow: 'hidden'}}>
                <table className="m3-table">
                    <thead>
                        <tr>
                            <th>Timestamp</th>
                            <th>User</th>
                            <th>Action</th>
                            <th>Details</th>
                            <th>IP Address</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLogs.map(log => (
                            <tr key={log.id}>
                                <td style={{whiteSpace: 'nowrap'}}>{new Date(log.createdAt).toLocaleString()}</td>
                                <td style={{fontWeight: 'bold'}}>{log.user ? log.user.username : 'SYSTEM'}</td>
                                <td>
                                    <span className={`m3-badge m3-badge-tonal ${getActionClass(log.action)}`}>
                                        {log.action}
                                    </span>
                                </td>
                                <td style={{maxWidth: '300px', fontSize: '0.85rem'}}>{log.details}</td>
                                <td className="m3-on-surface-variant" style={{fontSize: '0.8rem'}}>{log.ipAddress}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {filteredLogs.length === 0 && (
                <div className="m3-empty-state" style={{padding: '40px'}}>
                    <p className="m3-body-large">No logs found matching your criteria.</p>
                </div>
            )}
        </div>
    );
}

function getActionClass(action) {
    if (action.includes('DELETE')) return 'badge-error';
    if (action.includes('CREATE') || action.includes('REGISTERED')) return 'badge-success';
    if (action.includes('LOGIN')) return 'badge-primary';
    return '';
}
