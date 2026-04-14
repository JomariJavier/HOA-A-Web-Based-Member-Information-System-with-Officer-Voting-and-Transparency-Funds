export default function BaseLayout({ currentView, children }) {
    return (
        <div className="app-layout">
            <aside className="app-sidebar">
                <div className="sidebar-logo">HOA Portal</div>
                <nav>
                    <div className={`nav-item ${currentView === 'Dashboard' ? 'active' : ''}`}>Dashboard</div>
                    <div className={`nav-item ${currentView === 'PIS' ? 'active' : ''}`}>HOA Personal Information</div>
                    <div className={`nav-item ${currentView === 'Project' ? 'active' : ''}`}>Project Management</div>
                    <div className={`nav-item ${currentView === 'Voting' ? 'active' : ''}`}>HOA Voting Room</div>
                    <div className={`nav-item ${currentView === 'PR' ? 'active' : ''}`}>Public Relations Room</div>
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
