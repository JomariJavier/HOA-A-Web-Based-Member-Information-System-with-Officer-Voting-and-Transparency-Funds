import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './PRRoom.css';

export default function PRRoom() {
    const { user, fetchWithAuth } = useAuth();
    const [activeTab, setActiveTab] = useState('announcements'); // 'announcements', 'feedback'
    const [announcements, setAnnouncements] = useState([]);
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filterStatus, setFilterStatus] = useState('ALL'); // ALL, OPEN, RESOLVED
    const [sortOrder, setSortOrder] = useState('newest');

    // Form states
    const [complaintForm, setComplaintForm] = useState({ subject: '', content: '', category: 'General', urgency: 'Medium' });
    const [announcementForm, setAnnouncementForm] = useState({ title: '', content: '', isPinned: false, category: 'General', imageUrl: '' });
    const [responseForm, setResponseForm] = useState({ id: null, text: '' });
    const [showAnnounceModal, setShowAnnounceModal] = useState(false);

    const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPERADMIN';

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const announceRes = await fetchWithAuth('http://localhost:8081/api/pr/announcements');
            if (announceRes.ok) setAnnouncements(await announceRes.json());

            const complaintRes = await fetchWithAuth('http://localhost:8081/api/pr/complaints');
            if (complaintRes.ok) setComplaints(await complaintRes.json());
        } catch (error) {
            console.error("Failed to fetch PR data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleComplaintSubmit = async (e) => {
        e.preventDefault();
        if (!complaintForm.subject || !complaintForm.content) return alert("Please fill all fields");

        try {
            const res = await fetchWithAuth('http://localhost:8081/api/pr/complaints', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(complaintForm)
            });
            if (res.ok) {
                alert("Concern submitted successfully");
                setComplaintForm({ subject: '', content: '', category: 'General', urgency: 'Medium' });
                fetchData();
            }
        } catch (error) {
            alert("Submission failed");
        }
    };

    const handleAnnounceSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetchWithAuth('http://localhost:8081/api/pr/announcements', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(announcementForm)
            });
            if (res.ok) {
                setShowAnnounceModal(false);
                setAnnouncementForm({ title: '', content: '', isPinned: false, category: 'General', imageUrl: '' });
                fetchData();
            }
        } catch (error) {
            alert("Failed to publish");
        }
    };

    const handleRespond = async (id) => {
        if (!responseForm.text) return alert("Response cannot be empty");
        try {
            const res = await fetchWithAuth(`http://localhost:8081/api/pr/complaints/${id}/respond`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ response: responseForm.text, status: 'RESOLVED' })
            });
            if (res.ok) {
                setResponseForm({ id: null, text: '' });
                fetchData();
            }
        } catch (error) {
            alert("Failed to respond");
        }
    };

    const handleExport = async () => {
        try {
            const res = await fetchWithAuth('http://localhost:8081/api/pr/complaints/export');
            if (res.ok) {
                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'complaints_report.csv';
                a.click();
            }
        } catch (error) {
            alert("Export failed");
        }
    };

    const filteredComplaints = complaints
        .filter(c => filterStatus === 'ALL' || c.status === filterStatus)
        .sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
        });

    return (
        <section className="m3-pr-container">
            {/* HEADER */}
            <div className="m3-page-header">
                <div>
                    <h1 className="m3-display-small" style={{fontWeight: '800', color: '#006060'}}>Public Relations Room</h1>
                    <p className="m3-body-large m3-on-surface-variant">Stay connected with your community and voice your concerns directly to the HOA board.</p>
                </div>
                {isAdmin && (
                    <button className="m3-fab-extended" style={{background: '#008080'}} onClick={() => setShowAnnounceModal(true)}>
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
                <div className="m3-announcement-grid animate-fade-in">
                    {announcements.map(ann => (
                        <div key={ann.id} className={`m3-announcement-card ${ann.pinned ? 'pinned' : ''}`}>
                            {ann.imageUrl && <img src={ann.imageUrl} alt="" className="m3-announcement-image" style={{width: '100%', height: '150px', objectFit: 'cover', borderRadius: '12px', marginBottom: '12px'}} />}
                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                                <div>
                                    <span className="m3-label-small" style={{color: '#008080', fontWeight: 'bold'}}>{ann.category}</span>
                                    <h3 className="m3-announcement-title" style={{marginTop: '4px'}}>{ann.title}</h3>
                                </div>
                                {ann.pinned && <span className="m3-chip m3-chip-primary" style={{background: '#008080'}}>Pinned</span>}
                            </div>
                            <p className="m3-body-medium">{ann.content}</p>
                            <span className="m3-announcement-meta">Posted on {new Date(ann.publishedAt).toLocaleDateString()} by {ann.author?.username}</span>
                        </div>
                    ))}
                    {announcements.length === 0 && !loading && (
                        <div className="m3-empty-state-full">
                            <p>No community announcements at this time.</p>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'feedback' && (
                <div className="m3-complaint-section animate-fade-in">
                    <div className="m3-complaint-list">
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'}}>
                            <h2 className="m3-title-large">Community Submissions</h2>
                            <div style={{display: 'flex', gap: '8px'}}>
                                <select className="m3-input-small" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                                    <option value="ALL">All Status</option>
                                    <option value="OPEN">Open</option>
                                    <option value="RESOLVED">Resolved</option>
                                </select>
                                <select className="m3-input-small" value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
                                    <option value="newest">Newest First</option>
                                    <option value="oldest">Oldest First</option>
                                </select>
                            </div>
                        </div>

                        {filteredComplaints.map(cp => (
                            <div key={cp.id} className="m3-complaint-card">
                                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
                                    <div>
                                        <div style={{display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px'}}>
                                            <span className="m3-label-small m3-on-surface-variant">TKT-{cp.id}</span>
                                            <span className={`m3-badge m3-badge-tonal ${cp.urgency === 'High' ? 'badge-error' : ''}`} style={{fontSize: '0.65rem'}}>
                                                {cp.urgency} Priority
                                            </span>
                                            <span className="m3-label-small" style={{color: '#008080'}}>{cp.category}</span>
                                        </div>
                                        <h4 style={{margin: 0}}>{cp.subject}</h4>
                                        <p className="m3-body-small m3-on-surface-variant">By {cp.user?.username} • {new Date(cp.createdAt).toLocaleString()}</p>
                                    </div>
                                    <span className={`m3-status-badge m3-status-${cp.status.toLowerCase().replace('_', '')}`}>
                                        {cp.status}
                                    </span>
                                </div>
                                <p className="m3-body-medium" style={{marginBottom: '12px'}}>{cp.content}</p>
                                
                                {cp.response && (
                                    <div className="m3-board-response">
                                        <p className="m3-body-small" style={{margin: 0}}>
                                            <strong>Board Response ({new Date(cp.respondedAt).toLocaleDateString()}):</strong> {cp.response}
                                        </p>
                                    </div>
                                )}

                                {isAdmin && !cp.response && (
                                    <div className="m3-admin-reply-area">
                                        {responseForm.id === cp.id ? (
                                            <div style={{marginTop: '8px'}}>
                                                <textarea 
                                                    className="m3-pr-input" 
                                                    style={{height: '80px'}} 
                                                    placeholder="Enter official board response..."
                                                    value={responseForm.text}
                                                    onChange={e => setResponseForm({...responseForm, text: e.target.value})}
                                                ></textarea>
                                                <div style={{display: 'flex', gap: '8px', marginTop: '8px'}}>
                                                    <button className="m3-pr-btn-small" onClick={() => handleRespond(cp.id)}>Submit Response</button>
                                                    <button className="m3-text-btn" onClick={() => setResponseForm({id: null, text: ''})}>Cancel</button>
                                                </div>
                                            </div>
                                        ) : (
                                            <button className="m3-text-btn" style={{marginTop: '8px'}} onClick={() => setResponseForm({id: cp.id, text: ''})}>
                                                Reply to Concern
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                        {filteredComplaints.length === 0 && (
                            <div className="m3-empty-state-full" style={{padding: '40px'}}>
                                <p>No community feedback matching the criteria.</p>
                            </div>
                        )}
                    </div>

                    {!isAdmin && (
                        <form className="m3-pr-form" onSubmit={handleComplaintSubmit}>
                            <h3 className="m3-title-medium">Lodge a Concern</h3>
                            <p className="m3-body-small" style={{marginBottom: '16px'}}>Your feedback is vital for a better community experience.</p>
                            <label className="m3-label-small">Subject</label>
                            <input 
                                type="text" 
                                className="m3-pr-input" 
                                placeholder="e.g. Maintenance Issue" 
                                value={complaintForm.subject}
                                onChange={e => setComplaintForm({...complaintForm, subject: e.target.value})}
                            />
                            <div style={{display: 'flex', gap: '12px', marginBottom: '12px'}}>
                                <div style={{flex: 1}}>
                                    <label className="m3-label-small">Category</label>
                                    <select 
                                        className="m3-pr-input" 
                                        value={complaintForm.category}
                                        onChange={e => setComplaintForm({...complaintForm, category: e.target.value})}
                                    >
                                        <option>General</option>
                                        <option>Maintenance</option>
                                        <option>Security</option>
                                        <option>Sanitation</option>
                                    </select>
                                </div>
                                <div style={{flex: 1}}>
                                    <label className="m3-label-small">Urgency</label>
                                    <select 
                                        className="m3-pr-input" 
                                        value={complaintForm.urgency}
                                        onChange={e => setComplaintForm({...complaintForm, urgency: e.target.value})}
                                    >
                                        <option>Low</option>
                                        <option>Medium</option>
                                        <option>High</option>
                                    </select>
                                </div>
                            </div>
                            <label className="m3-label-small">Message</label>
                            <textarea 
                                className="m3-pr-input" 
                                style={{height: '120px'}} 
                                placeholder="Describe your concern in detail..."
                                value={complaintForm.content}
                                onChange={e => setComplaintForm({...complaintForm, content: e.target.value})}
                            ></textarea>
                            <button className="m3-pr-btn" type="submit">Send Feedback</button>
                        </form>
                    )}

                    {isAdmin && (
                        <div className="m3-pr-form" style={{background: '#E0F2F1'}}>
                            <h3 className="m3-title-medium">PR Management Hub</h3>
                            <p className="m3-body-small">Overseeing all community member submissions and inquiries.</p>
                            <div style={{marginTop: '20px'}}>
                                <button className="m3-outlined-btn" style={{width: '100%', marginBottom: '12px'}} onClick={handleExport}>
                                    Export Complaints (CSV)
                                </button>
                                <button className="m3-outlined-btn" style={{width: '100%'}} onClick={() => setFilterStatus(filterStatus === 'RESOLVED' ? 'ALL' : 'RESOLVED')}>
                                    {filterStatus === 'RESOLVED' ? 'Show All Submissions' : 'View Archived (Resolved)'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* ANNOUNCEMENT MODAL */}
            {showAnnounceModal && (
                <div className="m3-modal-overlay">
                    <div className="m3-modal-content m3-pr-form" style={{width: '500px'}}>
                        <h3 className="m3-title-large">Publish Community News</h3>
                        <label className="m3-label-small">Title</label>
                        <input 
                            type="text" 
                            className="m3-pr-input" 
                            value={announcementForm.title}
                            onChange={e => setAnnouncementForm({...announcementForm, title: e.target.value})}
                        />
                        <div style={{display: 'flex', gap: '12px', marginBottom: '12px'}}>
                            <div style={{flex: 1}}>
                                <label className="m3-label-small">Category</label>
                                <select 
                                    className="m3-pr-input" 
                                    value={announcementForm.category}
                                    onChange={e => setAnnouncementForm({...announcementForm, category: e.target.value})}
                                >
                                    <option>General</option>
                                    <option>Maintenance</option>
                                    <option>Security</option>
                                    <option>Events</option>
                                </select>
                            </div>
                            <div style={{flex: 1}}>
                                <label className="m3-label-small">Image URL (Optional)</label>
                                <input 
                                    type="text" 
                                    className="m3-pr-input" 
                                    placeholder="https://..."
                                    value={announcementForm.imageUrl}
                                    onChange={e => setAnnouncementForm({...announcementForm, imageUrl: e.target.value})}
                                />
                            </div>
                        </div>
                        <label className="m3-label-small">Content</label>
                        <textarea 
                            className="m3-pr-input" 
                            style={{height: '150px'}}
                            value={announcementForm.content}
                            onChange={e => setAnnouncementForm({...announcementForm, content: e.target.value})}
                        ></textarea>
                        <div style={{display: 'flex', alignItems: 'center', gap: '8px', margin: '12px 0'}}>
                            <input 
                                type="checkbox" 
                                checked={announcementForm.isPinned}
                                onChange={e => setAnnouncementForm({...announcementForm, isPinned: e.target.checked})}
                            />
                            <span className="m3-label-medium">Pin this announcement</span>
                        </div>
                        <div style={{display: 'flex', gap: '12px', marginTop: '20px'}}>
                            <button className="m3-pr-btn" style={{flex: 1}} onClick={handleAnnounceSubmit}>Publish</button>
                            <button className="m3-text-btn" style={{flex: 1}} onClick={() => setShowAnnounceModal(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
