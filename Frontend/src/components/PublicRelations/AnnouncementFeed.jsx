import React, { useState } from 'react';
import './PublicRelations.css';
import PRAdminWorkspace from './PRAdminWorkspace';

const MOCK_ANNOUNCEMENTS = [
    {
        id: 1,
        title: "Annual Community Summer Festival 2026",
        content: "Get ready for our biggest event of the year! We will have live music, food stalls, and a swimming competition. All residents are invited to bring their families.",
        category: "Events",
        author: "Admin - Maria Santos",
        date: "2026-04-12T10:00:00",
        isPinned: true,
        image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=1000&auto=format&fit=crop"
    },
    {
        id: 2,
        title: "Scheduled Water Interruption - Phase 2",
        content: "Please be advised that there will be a scheduled maintenance of the water pipes in Phase 2 this coming Thursday. Water supply will be cut from 9 AM to 4 PM.",
        category: "Maintenance",
        author: "Maintenance Dept",
        date: "2026-04-14T08:30:00",
        isPinned: false,
        image: "https://images.unsplash.com/photo-1585702138251-665c34bb3219?q=80&w=1000&auto=format&fit=crop"
    },
    {
        id: 3,
        title: "Enhanced Security Measures in Main Gate",
        content: "The board has approved the installation of new RFID scanners at the main gate to improve entry speed and security validation. Registration begins next week.",
        category: "Security",
        author: "Sec. Officer Rico",
        date: "2026-04-13T15:45:00",
        isPinned: false,
        image: "https://images.unsplash.com/photo-1557597774-9d2739f85a94?q=80&w=1000&auto=format&fit=crop"
    },
    {
        id: 4,
        title: "New Recycling Bins in Clubhouse",
        content: "In our effort to go green, we have placed new color-coded recycling bins near the clubhouse entrance. Let's work together to manage our waste responsibly.",
        category: "General",
        author: "Admin",
        date: "2026-04-10T11:20:00",
        isPinned: false,
        image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=1000&auto=format&fit=crop"
    }
];

const CATEGORIES = ["All", "General", "Maintenance", "Security", "Events"];

export default function AnnouncementFeed({ isAdmin }) {
    const [filter, setFilter] = useState("All");
    const [isCreating, setIsCreating] = useState(false);

    const filteredList = MOCK_ANNOUNCEMENTS.filter(a => 
        filter === "All" || a.category === filter
    );

    const pinnedItems = filteredList.filter(a => a.isPinned);
    const regularItems = filteredList.filter(a => !a.isPinned);

    if (isCreating) {
        return <PRAdminWorkspace onCancel={() => setIsCreating(false)} />;
    }

    return (
        <section className="announcement-view">
            {/* Category Filter */}
            <div className="chip-group">
                {CATEGORIES.map(cat => (
                    <button 
                        key={cat}
                        className={`m3-chip-selectable ${filter === cat ? 'active' : ''}`}
                        onClick={() => setFilter(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Admin Action Button */}
            {isAdmin && (
                <button 
                    className="m3-btn-filled" 
                    style={{marginBottom: '24px'}}
                    onClick={() => setIsCreating(true)}
                >
                    + Create Announcement
                </button>
            )}

            <div className="announcement-grid">
                {/* Render Pinned Items separately if on "All" or if they match filter */}
                {pinnedItems.map(item => (
                    <AnnouncementCard key={item.id} item={item} isPinned={true} />
                ))}

                {/* Render Regular Items */}
                {regularItems.map(item => (
                    <AnnouncementCard key={item.id} item={item} />
                ))}

                {filteredList.length === 0 && (
                    <div className="pr-empty-state">
                        <div className="pr-empty-icon">📰</div>
                        <h3 className="m3-title-large">No news yet in this category</h3>
                        <p className="m3-body-medium">Check back later for updates or try a different filter.</p>
                    </div>
                )}
            </div>
        </section>
    );
}

function AnnouncementCard({ item, isPinned }) {
    return (
        <div className={`announcement-card ${isPinned ? 'pinned' : ''}`}>
            {item.image && (
                <img src={item.image} alt={item.title} className="announcement-img" />
            )}
            <div className="announcement-content">
                <div className="announcement-meta">
                    <span className="m3-label-medium m3-primary-text">{item.category}</span>
                    <span className="m3-label-small m3-on-surface-variant">
                        {new Date(item.date).toLocaleDateString()}
                    </span>
                </div>
                <h3 className={isPinned ? 'm3-headline-small' : 'm3-title-large'}>
                    {item.title}
                </h3>
                <p className="m3-body-medium m3-on-surface-variant" style={{marginTop: '8px', lineHeight: '1.6'}}>
                    {item.content}
                </p>
                <div style={{marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    <span className="m3-label-small m3-on-surface-variant">By: {item.author}</span>
                    {isPinned && <span className="m3-chip m3-chip-primary">Pinned</span>}
                </div>
            </div>
        </div>
    );
}
