import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const VIEW_LABELS = {
    'Dashboard':         'Dashboard',
    'PIS':               'Resident Directory',
    'Voting':            'Voting & Elections',
    'Project:overview':  'Community Funds › Overview',
    'Project:ledger':    'Community Funds › Expense Ledger',
    'Project:projects':  'Community Funds › Community Projects',
    'Project:security':  'Community Funds › Audit Logs',
    'PR:announcements':  'Help & Support › Community News',
    'PR:feedback':       'Help & Support › Concerns & Feedback',
    'Security':          'System Security & Audit Logs',
};

const SUBSYSTEM_CLASS = {
    'Dashboard': 'subsystem-dashboard',
    'PIS':       'subsystem-directory',
    'Voting':    'subsystem-voting',
    'Project':   'subsystem-funds',
    'PR':        'subsystem-support',
    'Security':  'subsystem-security',
};

export default function BaseLayout({ currentView, onNavClick, isAdmin, userName, children }) {
    const { user, logout } = useAuth();
    const mainView = currentView.split(':')[0];
    const breadcrumb = VIEW_LABELS[currentView] || currentView;
    const subsystemClass = SUBSYSTEM_CLASS[mainView] || '';

    return (
        <div className="app-layout">
            <aside className="app-sidebar" role="navigation" aria-label="Main navigation">
                <div className="sidebar-logo">🏘 HOA Portal</div>
                <nav className="sidebar-nav">
                    <button
                        className={`nav-item ${mainView === 'Dashboard' ? 'active' : ''}`}
                        onClick={() => onNavClick('Dashboard')}
                        aria-label="Navigate to Dashboard"
                        aria-current={mainView === 'Dashboard' ? 'page' : undefined}
                    >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                        Dashboard
                    </button>

                    {isAdmin && (
                        <div className="nav-group">
                            <button
                                className={`nav-item ${mainView === 'PIS' ? 'active' : ''}`}
                                onClick={() => onNavClick('PIS')}
                                aria-label="Navigate to Resident Directory"
                                aria-current={mainView === 'PIS' ? 'page' : undefined}
                            >
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                                Resident Directory
                            </button>
                        </div>
                    )}

                    <div className="nav-group">
                        <button
                            className={`nav-item ${mainView === 'Voting' ? 'active' : ''}`}
                            onClick={() => onNavClick('Voting')}
                            aria-label="Navigate to Voting and Elections"
                            aria-current={mainView === 'Voting' ? 'page' : undefined}
                        >
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                            Voting & Elections
                        </button>
                    </div>

                    <div className="nav-group">
                        <button
                            className={`nav-item ${mainView === 'Project' ? 'active' : ''}`}
                            onClick={() => onNavClick('Project:overview')}
                            aria-label="Navigate to Community Funds"
                            aria-current={mainView === 'Project' ? 'page' : undefined}
                        >
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                            Community Funds
                        </button>
                        {mainView === 'Project' && (
                            <div className="sub-nav" role="group" aria-label="Community Funds sub-sections">
                                <button className={`sub-nav-item ${currentView === 'Project:overview' ? 'active' : ''}`} onClick={() => onNavClick('Project:overview')}>Overview</button>
                                <button className={`sub-nav-item ${currentView === 'Project:ledger' ? 'active' : ''}`} onClick={() => onNavClick('Project:ledger')}>Expense Ledger</button>
                                <button className={`sub-nav-item ${currentView === 'Project:projects' ? 'active' : ''}`} onClick={() => onNavClick('Project:projects')}>Community Projects</button>
                                {isAdmin && (
                                    <button className={`sub-nav-item ${currentView === 'Project:security' ? 'active' : ''}`} onClick={() => onNavClick('Project:security')}>Audit Logs</button>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="nav-group">
                        <button
                            className={`nav-item ${mainView === 'PR' ? 'active' : ''}`}
                            onClick={() => onNavClick('PR:announcements')}
                            aria-label="Navigate to Help and Support"
                            aria-current={mainView === 'PR' ? 'page' : undefined}
                        >
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                            Help & Support
                        </button>
                        {mainView === 'PR' && (
                            <div className="sub-nav" role="group" aria-label="Help and Support sub-sections">
                                <button className={`sub-nav-item ${currentView === 'PR:announcements' ? 'active' : ''}`} onClick={() => onNavClick('PR:announcements')}>Community News</button>
                                <button className={`sub-nav-item ${currentView === 'PR:feedback' ? 'active' : ''}`} onClick={() => onNavClick('PR:feedback')}>Concerns & Feedback</button>
                            </div>
                        )}
                    </div>

                    {isAdmin && (
                        <div className="nav-group">
                            <button
                                className={`nav-item ${mainView === 'Security' ? 'active' : ''}`}
                                onClick={() => onNavClick('Security')}
                                aria-label="Navigate to Security and Audit Logs"
                                aria-current={mainView === 'Security' ? 'page' : undefined}
                            >
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                                Security & Audit
                            </button>
                        </div>
                    )}
                </nav>
            </aside>

            <main className="app-main">
                <header className="app-top-header">
                    <div className="breadcrumb" aria-label="Current section">{breadcrumb}</div>
                    <div className="user-profile" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <span style={{ fontSize: '13px', color: 'var(--m3-on-surface-variant)' }}>
                            {userName} &nbsp;·&nbsp; {user?.role === 'SUPERADMIN' ? 'Super Admin' : (isAdmin ? 'Admin' : 'Member')}
                        </span>
                        <button
                            onClick={logout}
                            style={{
                                padding: '6px 14px',
                                cursor: 'pointer',
                                background: 'transparent',
                                border: '1.5px solid var(--m3-outline)',
                                borderRadius: '20px',
                                fontSize: '13px',
                                fontWeight: '600',
                                color: 'var(--m3-on-surface-variant)',
                                transition: 'all 0.15s',
                            }}
                            onMouseOver={e => { e.target.style.background = 'var(--m3-error-container)'; e.target.style.borderColor = 'var(--m3-error)'; e.target.style.color = 'var(--m3-error)'; }}
                            onMouseOut={e => { e.target.style.background = 'transparent'; e.target.style.borderColor = 'var(--m3-outline)'; e.target.style.color = 'var(--m3-on-surface-variant)'; }}
                        >
                            Log Out
                        </button>
                    </div>
                </header>

                <div className={`app-content-wrapper ${subsystemClass}`}>
                    <div className="subsystem-topbar" aria-hidden="true" />
                    {children}
                </div>
            </main>
        </div>
    );
}


