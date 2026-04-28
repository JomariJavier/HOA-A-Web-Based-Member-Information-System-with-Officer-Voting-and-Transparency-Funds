import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

export default function BaseLayout({ currentView, onNavClick, isAdmin, userName, children }) {
    const { user, logout } = useAuth();

    return (
        <div className="app-layout">
            <aside className="app-sidebar">
                <div className="sidebar-logo">HOA Portal</div>
                <nav>
                    <div className={`nav-item ${currentView === 'Dashboard' ? 'active' : ''}`} onClick={() => onNavClick('Dashboard')}>Dashboard</div>
                    {isAdmin && (
                        <div className={`nav-item ${currentView === 'PIS' ? 'active' : ''}`} onClick={() => onNavClick('PIS')}>Member Directory</div>
                    )}
                    <div className={`nav-item ${currentView === 'Voting' ? 'active' : ''}`} onClick={() => onNavClick('Voting')}>Voting Room</div>
                    <div className={`nav-item ${currentView === 'Project' ? 'active' : ''}`} onClick={() => onNavClick('Project')}>Transparency Funds</div>
                    <div className={`nav-item ${currentView === 'PR' ? 'active' : ''}`} onClick={() => onNavClick('PR')}>PR & Support</div>
                </nav>
            </aside>

            <main className="app-main">
                <header className="app-top-header">
                    <div className="breadcrumb">{currentView}</div>
                    <div className="user-profile" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <span>Welcome, {userName} ({user?.role === 'SUPERADMIN' ? 'Super Admin' : (isAdmin ? 'Admin' : 'Member')})</span>
                        <button 
                            onClick={logout} 
                            style={{ padding: '8px 16px', cursor: 'pointer', background: 'transparent', border: '1px solid #ccc', borderRadius: '4px' }}
                        >
                            Log Out
                        </button>
                    </div>
                </header>

                <div className="app-content-wrapper">
                    {children}
                </div>
            </main>
        </div>
    );
}
