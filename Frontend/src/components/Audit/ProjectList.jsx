import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './ProjectList.css';

export default function ProjectList({ isAdmin }) {
    const { fetchWithAuth } = useAuth();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetchWithAuth('http://localhost:8081/api/projects');
                if (response.ok) {
                    const data = await response.json();
                    setProjects(data);
                } else {
                    setProjects([]);
                }
            } catch (error) {
                console.error("Error fetching projects:", error);
                setProjects([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const getStatusLabel = (status) => {
        switch (status) {
            case 'COMPLETED': return 'completed';
            case 'ONGOING': return 'ongoing';
            case 'PLANNED': return 'planned';
            default: return 'planned';
        }
    };

    const filteredProjects = projects.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === "All" || p.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const activeCount = projects.filter(p => p.status === 'ONGOING').length;
    const completedCount = projects.filter(p => p.status === 'COMPLETED').length;
    const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0);

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    const [newProject, setNewProject] = useState({
        name: '',
        status: 'PLANNED',
        progress: 0,
        budget: '',
        timeline: ''
    });

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        try {
            const cleanedProject = {
                ...newProject,
                budget: newProject.budget ? parseFloat(newProject.budget.toString().replace(/[₱,]/g, '')) : 0
            };
            const response = await fetchWithAuth('http://localhost:8081/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(cleanedProject)
            });
            if (response.ok) {
                const savedProject = await response.json();
                setProjects(prev => [...prev, savedProject]);
                setShowAddModal(false);
                setNewProject({ name: '', status: 'PLANNED', progress: 0, budget: '', timeline: '' });
            }
        } catch (error) {
            console.error("Error adding project:", error);
            alert("Connection error. Please try again.");
        }
    };

    const handleUpdateSubmit = async (e) => {
        if (e && e.preventDefault) e.preventDefault();
        setIsSaving(true);
        
        try {
            const cleanedProject = {
                ...selectedProject,
                budget: selectedProject.budget ? parseFloat(selectedProject.budget.toString().replace(/[₱,]/g, '')) : 0
            };
            const response = await fetchWithAuth(`http://localhost:8081/api/projects/${selectedProject.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(cleanedProject)
            });
            
            if (response.ok) {
                const updatedProject = await response.json();
                setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
                setShowEditModal(false);
            }
        } catch (error) {
            console.error("Update error:", error);
            alert("Error saving changes.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="project-management subsystem-funds animate-fade-in">
            

            {/* COMPACT STATS ROW */}
            <div className="project-stats-row" style={{marginTop: '8px', marginBottom: '32px'}}>
                <div className="stat-glass-card">
                    <span className="stat-label">Active Development</span>
                    <span className="stat-value">{activeCount}</span>
                </div>
                <div className="stat-glass-card">
                    <span className="stat-label">Total Investment</span>
                    <span className="stat-value">₱{(totalBudget / 1000000).toFixed(1)}M</span>
                </div>
                <div className="stat-glass-card">
                    <span className="stat-label">Completed</span>
                    <span className="stat-value">{completedCount}</span>
                </div>
                {isAdmin && (
                    <div className="stat-glass-card" style={{justifyContent: 'center', cursor: 'pointer', background: 'var(--project-primary)', color: 'white'}} onClick={() => setShowAddModal(true)}>
                        <span className="stat-value" style={{fontSize: '15px', color: 'white', textAlign: 'center'}}>+ Propose New Project</span>
                    </div>
                )}
            </div>

            {/* DIRECTORY HEADER: SEARCH (LEFT) & FILTERS (RIGHT) */}
            <div className="project-directory-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', gap: '24px'}}>
                <div style={{position: 'relative', flex: 1, maxWidth: '600px'}}>
                    <span style={{position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', opacity: 0.6}}>🔍</span>
                    <input
                        type="text"
                        className="m3-input"
                        placeholder="Search projects by name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{width: '100%', paddingLeft: '48px', borderRadius: '16px', border: '1px solid var(--m3-outline)'}}
                    />
                </div>

                <div style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
                    <span className="m3-label-medium" style={{marginRight: '8px', fontWeight: 'bold'}}>Status:</span>
                    {["All", "PLANNED", "ONGOING", "COMPLETED"].map(status => (
                        <button
                            key={status}
                            className={`m3-filter-chip ${filterStatus === status ? 'm3-chip-selected' : ''}`}
                            style={{height: '40px', padding: '0 20px', borderRadius: '12px'}}
                            onClick={() => setFilterStatus(status)}
                        >
                            {status === "All" ? "All" : status.charAt(0) + status.slice(1).toLowerCase()}
                        </button>
                    ))}
                </div>
            </div>

            {/* PROJECT GRID */}
            <div className="project-grid">
                {filteredProjects.map(project => (
                    <div 
                        key={project.id} 
                        className="project-premium-card"
                        onClick={() => { setSelectedProject(project); setShowDetailModal(true); }}
                    >
                        <div className="card-accent-bar" style={{background: project.status === 'COMPLETED' ? '#2E7D32' : project.status === 'ONGOING' ? '#1976D2' : '#9E9E9E'}}></div>
                        <div className="card-body">
                            <div className="project-meta">
                                <span className={`status-pill ${getStatusLabel(project.status)}`}>
                                    {project.status}
                                </span>
                                <span className="m3-label-small" style={{marginLeft: 'auto', color: 'var(--m3-on-surface-variant)'}}>
                                    {project.timeline || 'TBD'}
                                </span>
                            </div>

                            <h3 className="project-title">{project.name}</h3>
                            
                            <div className="budget-box">
                                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px'}}>
                                    <span className="m3-label-small">Completion</span>
                                    <span style={{color: 'var(--project-primary)', fontWeight: 'bold'}}>{project.progress}%</span>
                                </div>
                                <div className="progress-track">
                                    <div className="progress-fill" style={{ width: `${project.progress}%` }}></div>
                                </div>
                                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                    <span className="m3-label-small">Allocated Budget</span>
                                    <span className="m3-title-small">₱{project.budget ? Number(project.budget).toLocaleString() : '0'}</span>
                                </div>
                            </div>
                            
                            {isAdmin && (
                                <div style={{marginTop: '12px', display: 'flex', gap: '8px'}}>
                                    <button 
                                        className="m3-text-btn" 
                                        style={{fontSize: '12px', padding: '4px 8px'}}
                                        onClick={(e) => { e.stopPropagation(); setSelectedProject(project); setShowEditModal(true); }}
                                    >
                                        Edit Details
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* MODALS (Standardized UI) */}
            {showAddModal && (
                <div className="m3-modal-overlay">
                    <div className="m3-modal-content">
                        <h2 className="m3-title-large" style={{marginBottom: '24px'}}>Propose New Project</h2>
                        <form onSubmit={handleAddSubmit} style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                            <div className="m3-text-field">
                                <label className="m3-label-medium">Project Name</label>
                                <input type="text" className="m3-input" required value={newProject.name} onChange={e => setNewProject({...newProject, name: e.target.value})} />
                            </div>
                            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
                                <div className="m3-text-field">
                                    <label className="m3-label-medium">Budget (₱)</label>
                                    <input type="number" className="m3-input" value={newProject.budget} onChange={e => setNewProject({...newProject, budget: e.target.value})} />
                                </div>
                                <div className="m3-text-field">
                                    <label className="m3-label-medium">Timeline</label>
                                    <input type="text" className="m3-input" placeholder="e.g. Q4 2024" value={newProject.timeline} onChange={e => setNewProject({...newProject, timeline: e.target.value})} />
                                </div>
                            </div>
                            <div className="m3-card-actions" style={{marginTop: '24px'}}>
                                <button type="button" className="m3-text-btn" onClick={() => setShowAddModal(false)}>Cancel</button>
                                <button type="submit" className="m3-filled-btn" style={{background: 'var(--project-primary)'}}>Submit Proposal</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showEditModal && selectedProject && (
                <div className="m3-modal-overlay">
                    <div className="m3-modal-content">
                        <h2 className="m3-title-large" style={{marginBottom: '24px'}}>Update Project</h2>
                        <form onSubmit={handleUpdateSubmit} style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                            <div className="m3-text-field">
                                <label className="m3-label-medium">Project Name</label>
                                <input type="text" className="m3-input" required value={selectedProject.name} onChange={e => setSelectedProject({...selectedProject, name: e.target.value})} />
                            </div>
                            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
                                <div className="m3-text-field">
                                    <label className="m3-label-medium">Status</label>
                                    <select className="m3-input m3-select" value={selectedProject.status} onChange={e => setSelectedProject({...selectedProject, status: e.target.value})}>
                                        <option value="PLANNED">Planned</option>
                                        <option value="ONGOING">Ongoing</option>
                                        <option value="COMPLETED">Completed</option>
                                    </select>
                                </div>
                                <div className="m3-text-field">
                                    <label className="m3-label-medium">Progress (%)</label>
                                    <input type="number" className="m3-input" min="0" max="100" value={selectedProject.progress} onChange={e => setSelectedProject({...selectedProject, progress: parseInt(e.target.value) || 0})} />
                                </div>
                            </div>
                            <div className="m3-card-actions" style={{marginTop: '24px'}}>
                                <button type="button" className="m3-text-btn" onClick={() => setShowEditModal(false)}>Cancel</button>
                                <button type="submit" className="m3-filled-btn" style={{background: 'var(--project-primary)'}} disabled={isSaving}>
                                    {isSaving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showDetailModal && selectedProject && (
                <div className="m3-modal-overlay" onClick={() => setShowDetailModal(false)}>
                    <div className="m3-modal-content" onClick={e => e.stopPropagation()}>
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}}>
                            <h2 className="m3-display-small" style={{margin: 0}}>{selectedProject.name}</h2>
                            <span className={`status-pill ${getStatusLabel(selectedProject.status)}`}>{selectedProject.status}</span>
                        </div>
                        
                        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '32px'}}>
                            <div>
                                <span className="m3-label-small">TOTAL BUDGET</span>
                                <p className="m3-headline-medium" style={{color: 'var(--project-primary)'}}>₱{Number(selectedProject.budget).toLocaleString()}</p>
                            </div>
                            <div>
                                <span className="m3-label-small">EXPECTED TIMELINE</span>
                                <p className="m3-title-large">{selectedProject.timeline || 'TBD'}</p>
                            </div>
                        </div>

                        <div className="budget-box" style={{background: '#F5F5F5', padding: '24px'}}>
                            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '12px'}}>
                                <span className="m3-title-medium">Overall Progress</span>
                                <span className="m3-title-medium">{selectedProject.progress}%</span>
                            </div>
                            <div className="progress-track" style={{height: '16px', borderRadius: '8px'}}>
                                <div className="progress-fill" style={{ width: `${selectedProject.progress}%` }}></div>
                            </div>
                        </div>

                        <div className="m3-card-actions" style={{marginTop: '32px'}}>
                            {isAdmin && <button className="m3-tonal-btn" onClick={() => { setShowDetailModal(false); setShowEditModal(true); }}>Edit Project</button>}
                            <button className="m3-filled-btn" onClick={() => setShowDetailModal(false)}>Close</button>
                        </div>
                    </div>
                </div>
            )}

            {filteredProjects.length === 0 && !loading && (
                <div className="m3-empty-state" style={{padding: '80px', background: 'rgba(0,0,0,0.02)', borderRadius: '24px'}}>
                    <div style={{fontSize: '48px', marginBottom: '16px'}}>🏗️</div>
                    <p className="m3-title-medium">No projects found</p>
                    <p className="m3-body-medium">Refine your search or check back later for new community proposals.</p>
                </div>
            )}
        </div>
    );
}
