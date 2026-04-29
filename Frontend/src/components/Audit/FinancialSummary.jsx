import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export default function FinancialSummary() {
    const { fetchWithAuth } = useAuth();
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const response = await fetchWithAuth('http://localhost:8081/api/finance/summary');
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

    if (loading) return <div className="m3-loading">Calculating totals...</div>;

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount || 0);
    };

    return (
        <div className="financial-summary-grid animate-fade-in" style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
            <div className="m3-card m3-elevated-card summary-card balance-card" style={{borderLeft: '6px solid var(--accent-funds)', background: 'var(--m3-surface)'}}>
                <div className="m3-card-content" style={{padding: '32px'}}>
                    <span className="m3-label-medium" style={{color: 'var(--accent-funds)', fontWeight: 'bold'}}>COMMUNITY BALANCE</span>
                    <h2 className="m3-display-medium primary-text" style={{color: 'var(--m3-on-surface)', marginTop: '8px', marginBottom: '8px'}}>{formatCurrency(summary?.communityBalance)}</h2>
                    <p className="m3-body-large m3-on-surface-variant">Total funds available for projects</p>
                </div>
            </div>

            <div className="summary-row" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px'}}>
                <div className="m3-card m3-elevated-card summary-card" style={{borderTop: '4px solid #2E7D32'}}>
                    <div className="m3-card-content">
                        <span className="m3-label-medium">TOTAL INCOME</span>
                        <h2 className="m3-title-large" style={{color: '#2E7D32', fontSize: '2rem', marginTop: '8px'}}>+ {formatCurrency(summary?.totalIncome)}</h2>
                    </div>
                </div>
                <div className="m3-card m3-elevated-card summary-card" style={{borderTop: '4px solid #C62828'}}>
                    <div className="m3-card-content">
                        <span className="m3-label-medium">TOTAL EXPENSES</span>
                        <h2 className="m3-title-large" style={{color: '#C62828', fontSize: '2rem', marginTop: '8px'}}>- {formatCurrency(summary?.totalExpense)}</h2>
                    </div>
                </div>
            </div>

            <div className="m3-card m3-outline-card transparency-disclaimer" style={{marginTop: '16px', background: 'var(--accent-funds-container)', border: 'none'}}>
                <div className="m3-card-content" style={{display: 'flex', gap: '16px', alignItems: 'flex-start'}}>
                    <span style={{fontSize: '24px'}}>🛡️</span>
                    <div>
                        <h3 className="m3-title-medium" style={{color: 'var(--accent-funds-on-container)', margin: '0 0 4px 0'}}>Transparency Promise</h3>
                        <p className="m3-body-medium" style={{color: 'var(--accent-funds-on-container)', margin: 0, opacity: 0.9}}>
                            Every transaction recorded here is part of an immutable audit trail. 
                            Records are soft-deleted only for corrections, and remain accessible to auditors.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
