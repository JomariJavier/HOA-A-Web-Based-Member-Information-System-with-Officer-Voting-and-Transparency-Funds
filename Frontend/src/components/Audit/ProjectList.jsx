import React from 'react';
import './Audit.css';

export default function ProjectList({ projects, onSelectProject, isAdmin }) {
    // Determine badge color based on status
    const getStatusClass = (status) => {
        switch (status) {
            case 'Completed': return 'm3-status-active'; // Green
            case 'Ongoing': return 'm3-status-review'; // Blue
            case 'Proposed': return 'm3-status-pending'; // Yellow/Orange
            default: return 'm3-status-inactive'; // Default grey/red
        }
    };

    return (
        <div className="project-list-view">
            <div className="m3-page-header" style={{ marginBottom: '24px' }}>
                <div>
                    <h2 className="m3-display-small">Project Directory</h2>
                    <p className="m3-body-medium m3-on-surface-variant">View ongoing, proposed, and completed community projects.</p>
                </div>
            </div>

            <div className="m3-details-grid">
                {projects.map((project) => (
                    <div 
                        key={project.id} 
                        className="m3-card m3-elevated-card" 
                        style={{ cursor: 'pointer', transition: 'transform 0.2s', padding: '0' }}
                        onClick={() => onSelectProject(project)}
                    >
                        <div className="m3-card-content">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                <span className={`m3-label-small ${getStatusClass(project.status).replace('status-', 'text-')}`} style={{ fontWeight: 'bold' }}>
                                    {project.status}
                                </span>
                                <span className="m3-label-small m3-on-surface-variant">{project.id}</span>
                            </div>
                            <h3 className="m3-title-large" style={{ marginBottom: '8px' }}>{project.name}</h3>
                            <p className="m3-body-medium m3-on-surface-variant" style={{ 
                                display: '-webkit-box', 
                                WebkitLineClamp: 2, 
                                WebkitBoxOrient: 'vertical', 
                                overflow: 'hidden' 
                            }}>
                                {project.purpose}
                            </p>
                        </div>
                        <div className="m3-card-actions" style={{ borderTop: '1px solid var(--m3-surface-variant)', background: '#f8fafc', padding: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span className="m3-label-small m3-on-surface-variant">Budget</span>
                                    <span className="m3-title-medium">₱{project.budget.toLocaleString()}</span>
                                </div>
                                <button className="m3-text-btn" onClick={(e) => { e.stopPropagation(); onSelectProject(project); }}>
                                    View Details →
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {projects.length === 0 && (
                <div className="audit-empty-state">
                    <div className="audit-empty-icon">📂</div>
                    <h3 className="m3-title-large">No Projects Found</h3>
                    <p className="m3-body-medium">There are no projects tracked in the system yet.</p>
                </div>
            )}
        </div>
    );
}
