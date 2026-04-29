import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './PRRoom.css';

export default function PRRoom({ subView }) {
    const { user, fetchWithAuth } = useAuth();
    const [activeTab, setActiveTab] = useState(subView || 'announcements'); // 'announcements', 'feedback'
    const [announcements, setAnnouncements] = useState([]);
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filterStatus, setFilterStatus] = useState('ALL'); // ALL, OPEN, RESOLVED
    const [sortOrder, setSortOrder] = useState('newest');

    // Form states
    const [complaintForm, setComplaintForm] = useState({ subject: '', content: '', category: 'General', urgency: 'Medium' });
    const [announcementForm, setAnnouncementForm] = useState({ title: '', content: '', pinned: false, category: 'General', imageUrl: '' });
    const [responseForm, setResponseForm] = useState({ id: null, text: '' });
    const [showAnnounceModal, setShowAnnounceModal] = useState(false);

    const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPERADMIN';

    useEffect(() => {
        if (subView) setActiveTab(subView);
    }, [subView]);

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
            } else {
                const errorMsg = await res.text();
                alert("Submission failed: " + errorMsg);
            }
        } catch (error) {
            alert("Submission failed: " + error.message);
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
                setAnnouncementForm({ title: '', content: '', pinned: false, category: 'General', imageUrl: '' });
                fetchData();
            } else {
                const errorMsg = await res.text();
                alert("Failed to publish: " + errorMsg);
            }
        } catch (error) {
            alert("Failed to publish: " + error.message);
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
        <section className="m3-content-wrapper subsystem-support animate-fade-in">
            {/* TABS & ACTIONS */}
            <div className="m3-pr-tabs-container" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--m3-surface-variant)', paddingBottom: '8px', marginBottom: '24px'}}>
                <div className="m3-pr-tabs" style={{display: 'flex', gap: '8px'}}>
                    <div 
                        className={`m3-tab ${activeTab === 'announcements' ? 'm3-tab-active' : ''}`}
                        style={activeTab === 'announcements' ? {background: 'var(--accent-support-container)', color: 'var(--accent-support-on-container)', borderColor: 'var(--accent-support)', fontWeight: 'bold', padding: '12px 24px'} : {padding: '12px 24px'}}
                        onClick={() => setActiveTab('announcements')}
                    >
                        Community News
                    </div>
                    <div 
                        className={`m3-tab ${activeTab === 'feedback' ? 'm3-tab-active' : ''}`}
                        style={activeTab === 'feedback' ? {background: 'var(--accent-support-container)', color: 'var(--accent-support-on-container)', borderColor: 'var(--accent-support)', fontWeight: 'bold', padding: '12px 24px'} : {padding: '12px 24px'}}
                        onClick={() => setActiveTab('feedback')}
                    >
                        Concerns & Feedback
                    </div>
                </div>

                {isAdmin && activeTab === 'announcements' && (
                    <button className="m3-fab-extended" onClick={() => setShowAnnounceModal(true)} style={{flexShrink: 0, height: '48px'}}>
                        <span className="m3-fab-icon" style={{fontSize: '20px', lineHeight: 1}}>+</span>
                        Publish News
                    </button>
                )}
            </div>

            {/* CONTENT */}
            {activeTab === 'announcements' && (
                <div className="m3-announcement-grid animate-fade-in" style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
                    {announcements.map(ann => (
                        <div key={ann.id} className={`m3-announcement-card m3-elevated-card ${ann.pinned ? 'pinned' : ''}`} style={{padding: '24px', borderLeft: ann.pinned ? '4px solid var(--accent-support)' : '4px solid transparent'}}>
                            {ann.imageUrl && <img src={ann.imageUrl} alt="" className="m3-announcement-image" style={{width: '100%', height: '200px', objectFit: 'cover', borderRadius: '12px', marginBottom: '16px'}} />}
                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                                <div>
                                    <span className="m3-label-small" style={{color: 'var(--accent-support)', fontWeight: 'bold'}}>{ann.category}</span>
                                    <h3 className="m3-announcement-title" style={{marginTop: '4px', fontSize: '1.25rem', margin: '4px 0 12px 0'}}>{ann.title}</h3>
                                </div>
                                {ann.pinned && <span className="m3-chip" style={{background: 'var(--accent-support)', color: 'white', border: 'none'}}>Pinned</span>}
                            </div>
                            <p className="m3-body-medium" style={{margin: '0 0 16px 0', lineHeight: 1.6}}>{ann.content}</p>
                            <span className="m3-announcement-meta" style={{color: 'var(--m3-on-surface-variant)', fontSize: '13px'}}>Posted on {new Date(ann.publishedAt).toLocaleDateString()} by {ann.author?.username}</span>
                        </div>
                    ))}
                    {announcements.length === 0 && !loading && (
                        <div className="m3-empty-state-full m3-elevated-card" style={{padding: '40px', textAlign: 'center', borderRadius: '16px'}}>
                            <p className="m3-body-large" style={{color: 'var(--m3-on-surface-variant)'}}>No community announcements at this time.</p>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'feedback' && (
                <div className="m3-complaint-section animate-fade-in" style={{display: 'grid', gridTemplateColumns: isAdmin ? '1fr 350px' : '1fr 350px', gap: '24px', alignItems: 'start'}}>
                    <div className="m3-complaint-list" style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px'}}>
                            <h2 className="m3-title-large" style={{margin: 0}}>Community Submissions</h2>
                            <div style={{display: 'flex', gap: '12px'}}>
                                <select className="m3-input m3-select" style={{padding: '8px 12px', fontSize: '14px'}} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                                    <option value="ALL">All Status</option>
                                    <option value="OPEN">Open</option>
                                    <option value="RESOLVED">Resolved</option>
                                </select>
                                <select className="m3-input m3-select" style={{padding: '8px 12px', fontSize: '14px'}} value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
                                    <option value="newest">Newest First</option>
                                    <option value="oldest">Oldest First</option>
                                </select>
                            </div>
                        </div>

                        {filteredComplaints.map(cp => (
                            <div key={cp.id} className="m3-complaint-card m3-elevated-card" style={{padding: '24px'}}>
                                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '12px'}}>
                                    <div>
                                        <div style={{display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px'}}>
                                            <span className="m3-label-small m3-on-surface-variant">TKT-{cp.id}</span>
                                            <span className={`m3-badge m3-badge-tonal ${cp.urgency === 'High' ? 'badge-error' : ''}`} style={{fontSize: '0.75rem', background: cp.urgency === 'High' ? 'var(--m3-error-container)' : 'var(--m3-surface-variant)', color: cp.urgency === 'High' ? 'var(--m3-error)' : 'inherit'}}>
                                                {cp.urgency} Priority
                                            </span>
                                            <span className="m3-label-small" style={{color: 'var(--accent-support)'}}>{cp.category}</span>
                                        </div>
                                        <h4 style={{margin: '0 0 4px 0', fontSize: '1.1rem'}}>{cp.subject}</h4>
                                        <p className="m3-body-small m3-on-surface-variant" style={{margin: 0}}>By {cp.user?.username} • {new Date(cp.createdAt).toLocaleString()}</p>
                                    </div>
                                    <span className={`m3-status-badge m3-status-${cp.status.toLowerCase().replace('_', '')}`} style={{alignSelf: 'flex-start', padding: '6px 12px', borderRadius: '16px', fontSize: '13px', fontWeight: 'bold', background: cp.status === 'RESOLVED' ? '#E8F5E9' : '#FFF3E0', color: cp.status === 'RESOLVED' ? '#2E7D32' : '#E65100'}}>
                                        {cp.status}
                                    </span>
                                </div>
                                <p className="m3-body-medium" style={{marginBottom: '16px', lineHeight: 1.5}}>{cp.content}</p>
                                
                                {cp.response && (
                                    <div className="m3-board-response" style={{background: 'var(--m3-surface-variant)', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #2E7D32'}}>
                                        <p className="m3-body-small" style={{margin: 0, lineHeight: 1.5}}>
                                            <strong style={{color: '#2E7D32', display: 'block', marginBottom: '4px'}}>Board Response ({new Date(cp.respondedAt).toLocaleDateString()}):</strong> {cp.response}
                                        </p>
                                    </div>
                                )}

                                {isAdmin && !cp.response && (
                                    <div className="m3-admin-reply-area" style={{marginTop: '16px', borderTop: '1px solid var(--m3-surface-variant)', paddingTop: '16px'}}>
                                        {responseForm.id === cp.id ? (
                                            <div style={{marginTop: '8px'}}>
                                                <textarea 
                                                    className="m3-input m3-textarea" 
                                                    style={{height: '100px', width: '100%'}} 
                                                    placeholder="Enter official board response..."
                                                    value={responseForm.text}
                                                    onChange={e => setResponseForm({...responseForm, text: e.target.value})}
                                                ></textarea>
                                                <div style={{display: 'flex', gap: '12px', marginTop: '12px'}}>
                                                    <button className="m3-filled-btn" style={{background: 'var(--accent-support)', color: 'white'}} onClick={() => handleRespond(cp.id)}>Submit Response</button>
                                                    <button className="m3-outlined-btn" onClick={() => setResponseForm({id: null, text: ''})}>Cancel</button>
                                                </div>
                                            </div>
                                        ) : (
                                            <button className="m3-tonal-btn" style={{background: 'var(--accent-support-container)', color: 'var(--accent-support-on-container)'}} onClick={() => setResponseForm({id: cp.id, text: ''})}>
                                                Reply to Concern
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                        {filteredComplaints.length === 0 && (
                            <div className="m3-empty-state-full m3-elevated-card" style={{padding: '40px', textAlign: 'center', borderRadius: '16px'}}>
                                <p className="m3-body-large" style={{color: 'var(--m3-on-surface-variant)'}}>No community feedback matching the criteria.</p>
                            </div>
                        )}
                    </div>

                    {!isAdmin && (
                        <div className="m3-card m3-elevated-card m3-pr-form" style={{position: 'sticky', top: '24px'}}>
                            <form style={{padding: '24px'}} onSubmit={handleComplaintSubmit}>
                                <h3 className="m3-title-large" style={{color: 'var(--accent-support)', margin: '0 0 8px 0'}}>Lodge a Concern</h3>
                                <p className="m3-body-small m3-on-surface-variant" style={{marginBottom: '24px', lineHeight: 1.4}}>Your feedback is vital for a better community experience.</p>
                                
                                <div className="m3-text-field" style={{marginBottom: '16px'}}>
                                    <label className="m3-label-medium">Subject</label>
                                    <input 
                                        type="text" 
                                        className="m3-input" 
                                        placeholder="e.g. Maintenance Issue" 
                                        value={complaintForm.subject}
                                        onChange={e => setComplaintForm({...complaintForm, subject: e.target.value})}
                                    />
                                </div>
                                <div style={{display: 'flex', gap: '16px', marginBottom: '16px'}}>
                                    <div className="m3-text-field" style={{flex: 1}}>
                                        <label className="m3-label-medium">Category</label>
                                        <select 
                                            className="m3-input m3-select" 
                                            value={complaintForm.category}
                                            onChange={e => setComplaintForm({...complaintForm, category: e.target.value})}
                                        >
                                            <option>General</option>
                                            <option>Maintenance</option>
                                            <option>Security</option>
                                            <option>Sanitation</option>
                                        </select>
                                    </div>
                                    <div className="m3-text-field" style={{flex: 1}}>
                                        <label className="m3-label-medium">Urgency</label>
                                        <select 
                                            className="m3-input m3-select" 
                                            value={complaintForm.urgency}
                                            onChange={e => setComplaintForm({...complaintForm, urgency: e.target.value})}
                                        >
                                            <option>Low</option>
                                            <option>Medium</option>
                                            <option>High</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="m3-text-field" style={{marginBottom: '24px'}}>
                                    <label className="m3-label-medium">Message</label>
                                    <textarea 
                                        className="m3-input m3-textarea" 
                                        style={{height: '140px'}} 
                                        placeholder="Describe your concern in detail..."
                                        value={complaintForm.content}
                                        onChange={e => setComplaintForm({...complaintForm, content: e.target.value})}
                                    ></textarea>
                                </div>
                                <button className="m3-filled-btn" style={{width: '100%', background: 'var(--accent-support)', color: 'white', padding: '14px', fontSize: '16px'}} type="submit">Send Feedback</button>
                            </form>
                        </div>
                    )}

                    {isAdmin && (
                        <div className="m3-card m3-elevated-card m3-pr-form" style={{position: 'sticky', top: '24px', background: 'var(--accent-support-container)', border: 'none'}}>
                            <div style={{padding: '24px'}}>
                                <h3 className="m3-title-large" style={{color: 'var(--accent-support-on-container)', margin: '0 0 8px 0'}}>PR Management Hub</h3>
                                <p className="m3-body-small" style={{color: 'var(--accent-support-on-container)', marginBottom: '24px', opacity: 0.9}}>Overseeing all community member submissions and inquiries.</p>
                                <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                                    <button className="m3-filled-btn" style={{background: 'white', color: 'var(--accent-support)', border: '1px solid var(--accent-support)'}} onClick={handleExport}>
                                        Export Complaints (CSV)
                                    </button>
                                    <button className="m3-filled-btn" style={{background: 'var(--accent-support)', color: 'white'}} onClick={() => setFilterStatus(filterStatus === 'RESOLVED' ? 'ALL' : 'RESOLVED')}>
                                        {filterStatus === 'RESOLVED' ? 'Show All Submissions' : 'View Archived (Resolved)'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* ANNOUNCEMENT MODAL */}
            {showAnnounceModal && (
                <div className="m3-modal-overlay">
                    <div className="m3-card m3-elevated-card m3-modal-content" style={{width: '600px', padding: '32px', borderRadius: '24px'}}>
                        <h3 className="m3-title-large" style={{margin: '0 0 24px 0', color: 'var(--accent-support)'}}>Publish Community News</h3>
                        <div className="m3-text-field" style={{marginBottom: '16px'}}>
                            <label className="m3-label-medium">Title</label>
                            <input 
                                type="text" 
                                className="m3-input" 
                                value={announcementForm.title}
                                onChange={e => setAnnouncementForm({...announcementForm, title: e.target.value})}
                            />
                        </div>
                        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px'}}>
                            <div className="m3-text-field">
                                <label className="m3-label-medium">Category</label>
                                <select 
                                    className="m3-input m3-select" 
                                    value={announcementForm.category}
                                    onChange={e => setAnnouncementForm({...announcementForm, category: e.target.value})}
                                >
                                    <option>General</option>
                                    <option>Maintenance</option>
                                    <option>Security</option>
                                    <option>Events</option>
                                </select>
                            </div>
                            <div className="m3-text-field">
                                <label className="m3-label-medium">Image URL (Optional)</label>
                                <input 
                                    type="text" 
                                    className="m3-input" 
                                    placeholder="https://..."
                                    value={announcementForm.imageUrl}
                                    onChange={e => setAnnouncementForm({...announcementForm, imageUrl: e.target.value})}
                                />
                            </div>
                        </div>
                        <div className="m3-text-field" style={{marginBottom: '16px'}}>
                            <label className="m3-label-medium">Content</label>
                            <textarea 
                                className="m3-input m3-textarea" 
                                style={{height: '160px'}}
                                value={announcementForm.content}
                                onChange={e => setAnnouncementForm({...announcementForm, content: e.target.value})}
                            ></textarea>
                        </div>
                        <div style={{display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0'}}>
                            <input 
                                type="checkbox" 
                                checked={announcementForm.pinned}
                                onChange={e => setAnnouncementForm({...announcementForm, pinned: e.target.checked})}
                                style={{width: '20px', height: '20px'}}
                            />
                            <span className="m3-label-medium">Pin this announcement to top</span>
                        </div>
                        <div style={{display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '32px', borderTop: '1px solid var(--m3-surface-variant)', paddingTop: '24px'}}>
                            <button className="m3-outlined-btn" style={{padding: '12px 24px'}} onClick={() => setShowAnnounceModal(false)}>Cancel</button>
                            <button className="m3-filled-btn" style={{background: 'var(--accent-support)', color: 'white', padding: '12px 32px'}} onClick={handleAnnounceSubmit}>Publish</button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
