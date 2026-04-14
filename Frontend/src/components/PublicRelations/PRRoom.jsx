import React, { useState } from 'react';
import './PublicRelations.css';
import AnnouncementFeed from './AnnouncementFeed';
import ComplaintHub from './ComplaintHub';

export default function PRRoom() {
    const [activeTab, setActiveTab] = useState('announcements');
    const [isAdmin, setIsAdmin] = useState(true); // Simulated admin role for development

    return (
        <main className="pr-container">
            {/* Header Section */}
            <header className="m3-page-header">
                <h1 className="m3-display-small">Public Relations Room</h1>
                <p className="m3-body-large m3-on-surface-variant">
                    Staying connected and keeping the community informed.
                </p>
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
                
                {/* Simulated Role Toggle for Developer Testing */}
                <div style={{marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px'}}>
                    <span className="m3-label-small m3-on-surface-variant">Admin Mode:</span>
                    <button 
                        className={`m3-chip ${isAdmin ? 'm3-chip-primary' : 'm3-chip-outline'}`}
                        onClick={() => setIsAdmin(!isAdmin)}
                    >
                        {isAdmin ? 'ON' : 'OFF'}
                    </button>
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
