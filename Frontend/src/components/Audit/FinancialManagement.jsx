import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import FinancialSummary from './FinancialSummary';
import ExpenseLedger from './ExpenseLedger';
import ProjectList from './ProjectList';
import SecurityDashboard from './SecurityDashboard';
import './ProjectList.css'; // Reuse common styles

export default function FinancialManagement({ subView }) {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState(subView || 'overview'); // overview, ledger, projects, security
    const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPERADMIN';

    React.useEffect(() => {
        if (subView) setActiveTab(subView);
    }, [subView]);

    return (
        <div className="m3-content-wrapper finance-hub subsystem-funds animate-fade-in">

            <div className="m3-tabs-container" style={{marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--m3-surface-variant)', paddingBottom: '8px'}}>
                <div style={{display: 'flex', gap: '8px'}}>
                    <button 
                        className={`m3-tab ${activeTab === 'overview' ? 'm3-tab-active' : ''}`}
                        style={activeTab === 'overview' ? {background: 'var(--accent-funds-container)', color: 'var(--accent-funds-on-container)', borderColor: 'var(--accent-funds)', fontWeight: 'bold', padding: '12px 24px'} : {padding: '12px 24px'}}
                        onClick={() => setActiveTab('overview')}
                    >
                        Overview
                    </button>
                    <button 
                        className={`m3-tab ${activeTab === 'ledger' ? 'm3-tab-active' : ''}`}
                        style={activeTab === 'ledger' ? {background: 'var(--accent-funds-container)', color: 'var(--accent-funds-on-container)', borderColor: 'var(--accent-funds)', fontWeight: 'bold', padding: '12px 24px'} : {padding: '12px 24px'}}
                        onClick={() => setActiveTab('ledger')}
                    >
                        Expense Ledger
                    </button>
                    <button 
                        className={`m3-tab ${activeTab === 'projects' ? 'm3-tab-active' : ''}`}
                        style={activeTab === 'projects' ? {background: 'var(--accent-funds-container)', color: 'var(--accent-funds-on-container)', borderColor: 'var(--accent-funds)', fontWeight: 'bold', padding: '12px 24px'} : {padding: '12px 24px'}}
                        onClick={() => setActiveTab('projects')}
                    >
                        Community Projects
                    </button>
                    {isAdmin && (
                        <button 
                            className={`m3-tab ${activeTab === 'security' ? 'm3-tab-active' : ''}`}
                            style={activeTab === 'security' ? {background: 'var(--accent-funds-container)', color: 'var(--accent-funds-on-container)', borderColor: 'var(--accent-funds)', fontWeight: 'bold', padding: '12px 24px'} : {padding: '12px 24px'}}
                            onClick={() => setActiveTab('security')}
                        >
                            Audit Logs
                        </button>
                    )}
                </div>

                {activeTab === 'ledger' && (
                    <div style={{display: 'flex', gap: '12px'}}>
                        <button className="m3-outlined-btn" onClick={() => window.open('/api/finance/export', '_blank')}>
                            ⬇ Export
                        </button>
                        {isAdmin && (
                            <button className="m3-filled-btn" onClick={() => document.dispatchEvent(new CustomEvent('open-transaction-modal'))}>
                                + Record
                            </button>
                        )}
                    </div>
                )}
            </div>

            <div className="finance-content-area">
                {activeTab === 'overview' && <FinancialSummary />}
                {activeTab === 'ledger' && <ExpenseLedger isAdmin={isAdmin} />}
                {activeTab === 'projects' && <ProjectList isAdmin={isAdmin} />}
                {activeTab === 'security' && isAdmin && <SecurityDashboard />}
            </div>
        </div>
    );
}
