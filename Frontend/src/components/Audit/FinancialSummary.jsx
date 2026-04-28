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
        <div className="financial-summary-grid">
            <div className="m3-card m3-elevated-card summary-card balance-card">
                <div className="m3-card-content">
                    <span className="m3-label-medium">COMMUNITY BALANCE</span>
                    <h2 className="m3-display-medium primary-text">{formatCurrency(summary?.communityBalance)}</h2>
                    <p className="m3-body-small">Total funds available for projects</p>
                </div>
            </div>

            <div className="summary-row">
                <div className="m3-card m3-elevated-card summary-card">
                    <div className="m3-card-content">
                        <span className="m3-label-medium">TOTAL INCOME</span>
                        <h2 className="m3-title-large" style={{color: '#2E7D32'}}>+ {formatCurrency(summary?.totalIncome)}</h2>
                    </div>
                </div>
                <div className="m3-card m3-elevated-card summary-card">
                    <div className="m3-card-content">
                        <span className="m3-label-medium">TOTAL EXPENSES</span>
                        <h2 className="m3-title-large" style={{color: '#C62828'}}>- {formatCurrency(summary?.totalExpense)}</h2>
                    </div>
                </div>
            </div>

            <div className="m3-card m3-outline-card transparency-disclaimer" style={{marginTop: '24px'}}>
                <div className="m3-card-content">
                    <h3 className="m3-title-medium">Transparency Promise</h3>
                    <p className="m3-body-small m3-on-surface-variant">
                        Every transaction recorded here is part of an immutable audit trail. 
                        Records are soft-deleted only for corrections, and remain accessible to auditors.
                    </p>
                </div>
            </div>
        </div>
    );
}
