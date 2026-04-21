import React from 'react';
import './Audit.css';

export default function ProjectDetail({ project, onBack, isAdmin }) {
    if (!project) return null;

    return (
        <div className="project-detail-view animation-fadeIn">
            <div className="m3-page-header" style={{ marginBottom: '24px' }}>
                <button className="m3-icon-btn m3-on-surface-variant" onClick={onBack} aria-label="Back">
                    ←
                </button>
                <div style={{ flex: 1, marginLeft: '16px' }}>
                    <h2 className="m3-display-small">{project.name}</h2>
                    <p className="m3-body-medium m3-on-surface-variant">ID: {project.id} | Status: {project.status}</p>
                </div>
                {isAdmin && (
                    <button className="m3-btn-filled" style={{ height: '48px', borderRadius: '24px', padding: '0 24px' }}>
                        Edit Project
                    </button>
                )}
            </div>

            <div className="m3-card m3-elevated-card" style={{ padding: '32px' }}>
                <h3 className="m3-title-large" style={{ color: 'var(--m3-primary)', borderBottom: '1px solid var(--m3-outline-variant)', paddingBottom: '16px', marginBottom: '24px' }}>
                    Project Information
                </h3>

                <div className="m3-details-grid" style={{ marginBottom: '32px' }}>
                    <div className="m3-detail-item">
                        <label className="m3-label-small m3-on-surface-variant" style={{ textTransform: 'uppercase' }}>Budget Cost</label>
                        <p className="m3-title-medium" style={{ fontSize: '1.2rem', color: 'var(--m3-primary)' }}>₱{project.budget.toLocaleString()}</p>
                    </div>
                    <div className="m3-detail-item">
                        <label className="m3-label-small m3-on-surface-variant" style={{ textTransform: 'uppercase' }}>Date Started</label>
                        <p className="m3-body-large">{new Date(project.dateStarted).toLocaleDateString()}</p>
                    </div>
                    <div className="m3-detail-item">
                        <label className="m3-label-small m3-on-surface-variant" style={{ textTransform: 'uppercase' }}>Estimated Completion</label>
                        <p className="m3-body-large">{project.estimatedDate ? new Date(project.estimatedDate).toLocaleDateString() : 'TBD'}</p>
                    </div>
                    <div className="m3-detail-item">
                        <label className="m3-label-small m3-on-surface-variant" style={{ textTransform: 'uppercase' }}>Current Status</label>
                        <p className="m3-body-large" style={{ fontWeight: '600' }}>{project.status}</p>
                    </div>
                </div>

                <div className="m3-info-box" style={{ marginBottom: '24px', padding: '24px', background: 'var(--m3-surface-container)' }}>
                    <label className="m3-title-medium" style={{ display: 'block', marginBottom: '8px' }}>Project Purpose</label>
                    <p className="m3-body-medium">{project.purpose}</p>
                </div>

                <div className="m3-info-box" style={{ padding: '24px', background: 'var(--m3-surface-container-high)', borderRadius: '16px' }}>
                    <label className="m3-title-medium" style={{ display: 'block', marginBottom: '8px' }}>Detailed Description</label>
                    <p className="m3-body-medium" style={{ lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{project.description}</p>
                </div>
            </div>
            
            {!isAdmin && (
                <div style={{ marginTop: '24px', textAlign: 'center' }}>
                    <p className="m3-body-medium m3-on-surface-variant">
                        This view is provided for financial transparency. Only administrators can edit project details.
                    </p>
                </div>
            )}
        </div>
    );
}
