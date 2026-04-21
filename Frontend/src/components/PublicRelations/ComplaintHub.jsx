import React, { useState } from 'react';
import './PublicRelations.css';
import ComplaintForm from './ComplaintForm';

const MOCK_COMPLAINTS = [
    {
        id: "TKT-1024",
        subject: "Streetlight Malfunction",
        category: "Maintenance",
        status: "Resolved",
        date: "2026-04-10",
        summary: "The lamp in front of Block 3 Lot 5 is flickering and eventually goes dark at night."
    },
    {
        id: "TKT-1055",
        subject: "Delayed Trash Collection",
        category: "Sanitation",
        status: "Review",
        date: "2026-04-13",
        summary: "Trash pickup was skipped this Tuesday morning for the inner loop of Phase 1."
    },
    {
        id: "TKT-1060",
        subject: "Speeding Vehicle in Zone 2",
        category: "Security",
        status: "Pending",
        date: "2026-04-14",
        summary: "A silver sedan (ABC-1234) is frequently speeding through the residential area during school hours."
    }
];

export default function ComplaintHub({ isAdmin }) {
    const [view, setView] = useState('list'); // 'list' or 'new'

    if (view === 'new') {
        return (
            <div>
                <button className="m3-btn-text" onClick={() => setView('list')} style={{marginBottom: '16px'}}>
                    ← Back to My Concerns
                </button>
                <ComplaintForm onSubmitSuccess={() => setView('list')} />
            </div>
        );
    }

    return (
        <section className="complaint-hub">
            <div className="m3-page-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div>
                    <h2 className="m3-headline-small">{isAdmin ? "All Community Concerns" : "My Concerns & Feedback"}</h2>
                    <p className="m3-body-medium m3-on-surface-variant">
                        {isAdmin ? "Manage and resolve resident issues." : "Track the status of your reported issues."}
                    </p>
                </div>
                {!isAdmin && (
                    <button className="m3-btn-filled" onClick={() => setView('new')}>
                        New Concern
                    </button>
                )}
            </div>

            <div className="complaint-list" style={{marginTop: '24px'}}>
                {MOCK_COMPLAINTS.map(ticket => (
                    <div key={ticket.id} className="announcement-card" style={{padding: '20px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                        <div style={{flex: 1}}>
                            <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px'}}>
                                <span className="m3-label-medium m3-on-surface-variant">{ticket.id}</span>
                                <span className={`status-badge status-${ticket.status.toLowerCase()}`}>
                                    {ticket.status}
                                </span>
                            </div>
                            <h3 className="m3-title-large">{ticket.subject}</h3>
                            <p className="m3-body-medium m3-on-surface-variant" style={{marginTop: '4px'}}>
                                {ticket.summary}
                            </p>
                            <span className="m3-label-small m3-on-surface-variant" style={{marginTop: '12px', display: 'block'}}>
                                Filed on: {ticket.date} • Category: {ticket.category}
                            </span>
                        </div>
                        
                        {isAdmin && (
                            <button className="m3-btn-tonal">
                                Resolve
                            </button>
                        )}
                    </div>
                ))}

                {MOCK_COMPLAINTS.length === 0 && (
                    <div className="pr-empty-state">
                        <div className="pr-empty-icon">📝</div>
                        <h3 className="m3-title-large">No concerns recorded</h3>
                        <p className="m3-body-medium">Your reports will show up here for tracking.</p>
                    </div>
                )}
            </div>
        </section>
    );
}
