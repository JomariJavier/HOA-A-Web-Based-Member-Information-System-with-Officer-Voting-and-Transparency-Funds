import React, { useState } from 'react';
import './PublicRelations.css';
import AnnouncementFeed from './AnnouncementFeed';
import ComplaintHub from './ComplaintHub';

export default function PRRoom({ isAdmin, setIsAdmin }) {
    const [activeTab, setActiveTab] = useState('announcements');

    return (
        <main className="pr-container">
            {/* Header Section */}
            <header className="pr-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h1 className="m3-display-small">Public Relations Room</h1>
                    <p className="m3-body-medium m3-on-surface-variant">
                        Staying connected and keeping the community informed.
                    </p>
                </div>

                <div className="admin-toggle-wrapper">
                    <span className="m3-label-large">Admin Sandbox</span>
                    <label className="toggle-switch">
                        <input 
                            type="checkbox" 
                            checked={isAdmin} 
                            onChange={(e) => setIsAdmin(e.target.checked)} 
                        />
                        <span className="slider"></span>
                    </label>
                </div>
            </header>

            {/* Navigation Switcher */}
            <nav className="pr-nav-tabs">
                <div 
                    className={`pr-nav-item ${activeTab === 'announcements' ? 'active' : ''}`}
                    onClick={() => setActiveTab('announcements')}
                >
                    Announcements
                </div>
                <div 
                    className={`pr-nav-item ${activeTab === 'complaints' ? 'active' : ''}`}
                    onClick={() => setActiveTab('complaints')}
                >
                    Concerns & Feedback
                </div>
            </nav>

            {/* View Rendering */}
            <div className="pr-view-content">
                {activeTab === 'announcements' ? (
                    <AnnouncementFeed isAdmin={isAdmin} />
                ) : (
                    <ComplaintHub isAdmin={isAdmin} />
                )}
            </div>
        </main>
    );
}
