import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import FinancialSummary from './FinancialSummary';
import ExpenseLedger from './ExpenseLedger';
import ProjectList from './ProjectList';
import SecurityDashboard from './SecurityDashboard';
import './ProjectList.css'; // Reuse common styles

export default function FinancialManagement() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('overview'); // overview, ledger, projects
    const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPERADMIN';

    return (
        <div className="m3-directory finance-hub">
            <div className="m3-page-header">
                <div>
                    <h1 className="m3-display-small">Transparency Funds</h1>
                    <p className="m3-body-medium m3-on-surface-variant">Real-time financial auditing and community projects</p>
                </div>
            </div>

            <div className="m3-tabs-container" style={{marginBottom: '32px'}}>
                <button 
                    className={`m3-tab ${activeTab === 'overview' ? 'm3-tab-active' : ''}`}
                    onClick={() => setActiveTab('overview')}
                >
                    Overview
                </button>
                <button 
                    className={`m3-tab ${activeTab === 'ledger' ? 'm3-tab-active' : ''}`}
                    onClick={() => setActiveTab('ledger')}
                >
                    Expense Ledger
                </button>
                <button 
                    className={`m3-tab ${activeTab === 'projects' ? 'm3-tab-active' : ''}`}
                    onClick={() => setActiveTab('projects')}
                >
                    Community Projects
                </button>
                {isAdmin && (
                    <button 
                        className={`m3-tab ${activeTab === 'security' ? 'm3-tab-active' : ''}`}
                        onClick={() => setActiveTab('security')}
                    >
                        Audit Logs
                    </button>
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
