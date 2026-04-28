import React, { useState, useEffect } from 'react';
import './PRRoom.css';

export default function PRRoom() {
    const [activeTab, setActiveTab] = useState('announcements'); // 'announcements', 'feedback'
    const [announcements, setAnnouncements] = useState([
        { id: 1, title: 'Summer General Assembly', content: 'Join us this Saturday for the annual summer meeting. Food will be provided!', date: '2024-05-01', pinned: true },
        { id: 2, title: 'New Security Protocol', content: 'Starting next week, all visitors must register at the main gate using the new QR system.', date: '2024-04-28', pinned: false },
        { id: 3, title: 'Pool Maintenance', content: 'The community pool will be closed for scheduled maintenance on Wednesday.', date: '2024-04-25', pinned: false }
    ]);
    const [complaints, setComplaints] = useState([
        { id: 101, subject: 'Street Light Broken', status: 'In Progress', date: '2024-04-26', response: 'Electrician scheduled for Monday.' },
        { id: 102, subject: 'Garbage Collection Delay', status: 'Resolved', date: '2024-04-20', response: 'Service resumed after truck repair.' }
    ]);

    const isAdmin = true; // Simulated for UI building

    return (
        <section className="m3-pr-container">
            {/* HEADER */}
            <div className="m3-page-header">
                <div>
                    <h1 className="m3-display-small" style={{fontWeight: '800', color: '#006060'}}>Public Relations Room</h1>
                    <p className="m3-body-large m3-on-surface-variant">Stay connected with your community and voice your concerns directly to the HOA board.</p>
                </div>
                {isAdmin && (
                    <button className="m3-fab-extended" style={{background: '#008080'}}>
                        + Publish News
                    </button>
                )}
            </div>

            {/* TABS */}
            <div className="m3-pr-tabs">
                <div 
                    className={`m3-tab ${activeTab === 'announcements' ? 'm3-tab-active' : ''}`}
                    onClick={() => setActiveTab('announcements')}
                >
                    Community News
                </div>
                <div 
                    className={`m3-tab ${activeTab === 'feedback' ? 'm3-tab-active' : ''}`}
                    onClick={() => setActiveTab('feedback')}
                >
                    Concerns & Feedback
                </div>
            </div>

            {/* CONTENT */}
            {activeTab === 'announcements' && (
                <div className="m3-announcement-grid">
                    {announcements.map(ann => (
                        <div key={ann.id} className={`m3-announcement-card ${ann.pinned ? 'pinned' : ''}`}>
                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                <h3 className="m3-announcement-title">{ann.title}</h3>
                                {ann.pinned && <span className="m3-chip m3-chip-primary" style={{background: '#008080'}}>Pinned</span>}
                            </div>
                            <p className="m3-body-medium">{ann.content}</p>
                            <span className="m3-announcement-meta">Posted on {new Date(ann.date).toLocaleDateString()}</span>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'feedback' && (
                <div className="m3-complaint-section">
                    <div className="m3-complaint-list">
                        <h2 className="m3-title-large">Community Submissions</h2>
                        {complaints.map(cp => (
                            <div key={cp.id} className="m3-complaint-card">
                                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
                                    <h4 style={{margin: 0}}>{cp.subject}</h4>
                                    <span className={`m3-status-badge m3-status-${cp.status.toLowerCase().replace(' ', '')}`}>
                                        {cp.status}
                                    </span>
                                </div>
                                <p className="m3-body-small m3-on-surface-variant">Submitted on {cp.date}</p>
                                {cp.response && (
                                    <div style={{marginTop: '12px', padding: '12px', background: '#F5F5F5', borderRadius: '8px', borderLeft: '3px solid #008080'}}>
                                        <p className="m3-body-small" style={{margin: 0}}><strong>Board Response:</strong> {cp.response}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {!isAdmin && (
                        <div className="m3-pr-form">
                            <h3 className="m3-title-medium">Lodge a Concern</h3>
                            <p className="m3-body-small" style={{marginBottom: '16px'}}>Your feedback is vital for a better community experience.</p>
                            <label className="m3-label-small">Subject</label>
                            <input type="text" className="m3-pr-input" placeholder="e.g. Maintenance Issue" />
                            <label className="m3-label-small">Message</label>
                            <textarea className="m3-pr-input" style={{height: '120px'}} placeholder="Describe your concern in detail..."></textarea>
                            <button className="m3-pr-btn">Send Feedback</button>
                        </div>
                    )}

                    {isAdmin && (
                        <div className="m3-pr-form" style={{background: '#E0F2F1'}}>
                            <h3 className="m3-title-medium">PR Management Hub</h3>
                            <p className="m3-body-small">Overseeing all community member submissions and inquiries.</p>
                            <div style={{marginTop: '20px'}}>
                                <button className="m3-outlined-btn" style={{width: '100%', marginBottom: '12px'}}>Export Report (PDF)</button>
                                <button className="m3-outlined-btn" style={{width: '100%'}}>Archive Resolved</button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}
