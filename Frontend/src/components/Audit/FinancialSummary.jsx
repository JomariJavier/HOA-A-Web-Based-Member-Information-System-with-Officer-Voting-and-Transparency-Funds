import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './ProjectList.css'; // Reusing glass and card styles

export default function FinancialSummary() {
    const { fetchWithAuth } = useAuth();
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const response = await fetchWithAuth('/api/finance/summary');
                if (response.ok) {
                    const data = await response.json();
                    setSummary(data);
                }
            } catch (error) {
                console.error("Error fetching financial summary:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSummary();
    }, []);

    if (loading) return (
        <div style={{padding: '40px', textAlign: 'center'}}>
            <div className="m3-loading">Synchronizing with Treasury...</div>
        </div>
    );

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount || 0);
    };

    return (
        <div className="financial-summary-grid animate-fade-in" style={{display: 'flex', flexDirection: 'column', gap: '16px', paddingTop: '8px'}}>
            
            {/* FLOW METRICS */}
            <div className="project-stats-row" style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
                <div className="stat-glass-card" style={{borderLeft: '4px solid #1A237E', background: 'linear-gradient(135deg, #E8EAF6 0%, #C5CAE9 100%)'}}>
                    <span className="stat-label" style={{color: '#1A237E'}}>Current Treasury Balance</span>
                    <span className="stat-value" style={{fontSize: '32px', color: '#1A237E'}}>{formatCurrency(summary?.communityBalance)}</span>
                </div>
                <div className="stat-glass-card" style={{borderLeft: '4px solid #2E7D32'}}>
                    <span className="stat-label">Cumulative Income</span>
                    <span className="stat-value" style={{color: '#2E7D32'}}>+ {formatCurrency(summary?.totalIncome)}</span>
                </div>
            </div>

            <div className="project-stats-row" style={{display: 'grid', gridTemplateColumns: '1fr', gap: '16px'}}>
                <div className="stat-glass-card" style={{borderLeft: '4px solid #C62828'}}>
                    <span className="stat-label">Cumulative Expenses</span>
                    <span className="stat-value" style={{color: '#C62828'}}>- {formatCurrency(summary?.totalExpense)}</span>
                </div>
            </div>

            {/* TRANSPARENCY SHIELD */}
            <div className="stat-glass-card" style={{background: 'rgba(255,255,255,0.4)', display: 'flex', flexDirection: 'row', gap: '20px', alignItems: 'center', padding: '24px'}}>
                <div style={{fontSize: '32px'}}>🛡️</div>
                <div>
                    <h3 className="m3-title-medium" style={{margin: '0 0 4px 0'}}>Transparency & Accountability Protocol</h3>
                    <p className="m3-body-medium" style={{margin: 0, opacity: 0.8}}>
                        Every Philippine Peso is accounted for. This dashboard is fueled by an immutable ledger. 
                        Unauthorized modifications are strictly prohibited and flagged in the system audit logs.
                    </p>
                </div>
            </div>

        </div>
    );
}
