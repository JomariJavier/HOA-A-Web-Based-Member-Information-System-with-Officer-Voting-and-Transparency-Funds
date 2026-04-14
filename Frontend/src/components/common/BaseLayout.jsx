export default function BaseLayout({ currentView, onNavClick, children }) {
    return (
        <div className="app-layout">
            <aside className="app-sidebar">
                <div className="sidebar-logo">HOA Portal</div>
                <nav>
                    <div className={`nav-item ${currentView === 'Dashboard' ? 'active' : ''}`} onClick={() => onNavClick('Dashboard')}>Dashboard</div>
                    <div className={`nav-item ${currentView === 'PIS' ? 'active' : ''}`} onClick={() => onNavClick('PIS')}>HOA Personal Information</div>
                    <div className={`nav-item ${currentView === 'Project' ? 'active' : ''}`} onClick={() => onNavClick('Project')}>Project Management</div>
                    <div className={`nav-item ${currentView === 'Voting' ? 'active' : ''}`} onClick={() => onNavClick('Voting')}>HOA Voting Room</div>
                    <div className={`nav-item ${currentView === 'PR' ? 'active' : ''}`} onClick={() => onNavClick('PR')}>Public Relations Room</div>
                </nav>
            </aside>

            <main className="app-main">
                <header className="app-top-header">
                    <div className="breadcrumb">{currentView}</div>
                    <div className="user-profile">Admin Mode</div>
                </header>

                <div className="app-content-wrapper">
                    {children}
                </div>
            </main>
        </div>
    );
}
