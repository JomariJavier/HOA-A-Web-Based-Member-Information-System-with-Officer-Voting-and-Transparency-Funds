import { useState, useEffect } from 'react';
import './ProjectList.css';

export default function ProjectList() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");

    useEffect(() => {
        // Fetch projects from backend
        // Since there is no ProjectController yet, this might fail unless we create one.
        // For now, let's use some dummy data that matches the Backend seed data
        // but we will attempt to fetch it anyway in case the user adds the controller.
        const fetchProjects = async () => {
            try {
                const response = await fetch('http://localhost:8081/api/projects');
                if (response.ok) {
                    const data = await response.json();
                    setProjects(data);
                } else {
                    // Fallback to dummy data if API not ready
                    setProjects([
                        { id: 1, name: "Street Paving", status: "ONGOING", progress: 65, budget: "₱150,000", timeline: "Jan - Jun 2024" },
                        { id: 2, name: "CCTV Installation", status: "ONGOING", progress: 30, budget: "₱80,000", timeline: "Mar - May 2024" },
                        { id: 3, name: "Park Renovation", status: "PLANNED", progress: 0, budget: "₱200,000", timeline: "Jul - Dec 2024" },
                        { id: 4, name: "Clubhouse Painting", status: "COMPLETED", progress: 100, budget: "₱45,000", timeline: "Feb 2024" }
                    ]);
                }
            } catch (error) {
                console.error("Error fetching projects:", error);
                setProjects([
                    { id: 1, name: "Street Paving", status: "ONGOING", progress: 65, budget: "₱150,000", timeline: "Jan - Jun 2024" },
                    { id: 2, name: "CCTV Installation", status: "ONGOING", progress: 30, budget: "₱80,000", timeline: "Mar - May 2024" },
                    { id: 3, name: "Park Renovation", status: "PLANNED", progress: 0, budget: "₱200,000", timeline: "Jul - Dec 2024" },
                    { id: 4, name: "Clubhouse Painting", status: "COMPLETED", progress: 100, budget: "₱45,000", timeline: "Feb 2024" }
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const getStatusClass = (status) => {
        switch (status) {
            case 'COMPLETED': return 'm3-status-active';
            case 'ONGOING': return 'm3-status-pending'; // We'll define this
            case 'PLANNED': return 'm3-status-inactive';
            default: return '';
        }
    };

    const filteredProjects = projects.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === "All" || p.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
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
            const response = await fetch('http://localhost:8081/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newProject)
            });
            if (response.ok) {
                const savedProject = await response.json();
                setProjects(prev => [...prev, savedProject]);
                setShowAddModal(false);
                setNewProject({ name: '', status: 'PLANNED', progress: 0, budget: '', timeline: '' });
            }
        } catch (error) {
            console.error("Error adding project:", error);
            alert("Database connection failed. Changes will not be saved permanently.");
            setProjects(prev => [...prev, { ...newProject, id: Date.now() }]);
            setShowAddModal(false);
        }
    };

    const [isSaving, setIsSaving] = useState(false);

    const handleUpdateSubmit = async (e) => {
        if (e && e.preventDefault) e.preventDefault();
        setIsSaving(true);
        console.log("Attempting to update project:", selectedProject);
        
        if (!selectedProject || !selectedProject.id) {
            alert("Error: Project ID is missing.");
            setIsSaving(false);
            return;
        }

        try {
            const response = await fetch(`http://localhost:8081/api/projects/${selectedProject.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(selectedProject)
            });
            
            if (response.ok) {
                const updatedProject = await response.json();
                setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
                setShowEditModal(false);
                alert("Project updated successfully!");
            } else {
                alert(`Update failed: Server returned ${response.status}`);
            }
        } catch (error) {
            console.error("Update error:", error);
            alert("Error connecting to database: " + error.message);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="m3-directory project-management">
            <div className="m3-page-header">
                <div>
                    <h1 className="m3-display-small">Project Management</h1>
                    <p className="m3-body-medium m3-on-surface-variant">Track and monitor community infrastructure projects</p>
                </div>
                <button className="m3-fab-extended" onClick={() => setShowAddModal(true)}>
                    <span className="m3-fab-icon">+</span>
                    <span>Propose Project</span>
                </button>
            </div>

            {/* DETAIL MODAL (Read-Only) */}
            {showDetailModal && selectedProject && (
                <div className="m3-modal-overlay">
                    <div className="m3-card m3-elevated-card m3-modal-content detail-modal">
                        <div className="modal-header">
                            <h2 className="m3-display-small">{selectedProject.name}</h2>
                            <span className={`m3-status-indicator ${getStatusClass(selectedProject.status)}`}>
                                {selectedProject.status}
                            </span>
                        </div>
                        
                        <div className="detail-grid">
                            <div className="detail-item">
                                <label className="m3-label-small">ESTIMATED BUDGET</label>
                                <p className="m3-headline-medium">{selectedProject.budget || 'N/A'}</p>
                            </div>
                            <div className="detail-item">
                                <label className="m3-label-small">TIMELINE</label>
                                <p className="m3-title-large">{selectedProject.timeline || 'TBD'}</p>
                            </div>
                            <div className="detail-item m3-full-width">
                                <label className="m3-label-small">CURRENT PROGRESS</label>
                                <div className="progress-section" style={{marginTop: '12px'}}>
                                    <div className="progress-bar-container" style={{height: '12px'}}>
                                        <div className="progress-bar-fill" style={{ width: `${selectedProject.progress}%` }}></div>
                                    </div>
                                    <p className="m3-body-large" style={{marginTop: '8px'}}>{selectedProject.progress}% Completed</p>
                                </div>
                            </div>
                        </div>

                        <div className="m3-card-actions" style={{marginTop: '32px'}}>
                            <button className="m3-tonal-btn" onClick={() => { setShowDetailModal(false); setShowEditModal(true); }}>Edit Project</button>
                            <button className="m3-filled-btn" onClick={() => setShowDetailModal(false)}>Close</button>
                        </div>
                    </div>
                </div>
            )}

            {showAddModal && (
                <div className="m3-modal-overlay">
                    <div className="m3-card m3-elevated-card m3-modal-content">
                        <h2 className="m3-title-large">New Project Proposal</h2>
                        <form className="m3-form-grid" onSubmit={handleAddSubmit}>
                            <div className="m3-text-field m3-full-width">
                                <label className="m3-label-medium">Project Name</label>
                                <input 
                                    type="text" 
                                    className="m3-input" 
                                    required 
                                    value={newProject.name}
                                    onChange={e => setNewProject({...newProject, name: e.target.value})}
                                />
                            </div>
                            <div className="m3-text-field">
                                <label className="m3-label-medium">Budget</label>
                                <input 
                                    type="text" 
                                    className="m3-input" 
                                    placeholder="e.g. ₱50,000"
                                    value={newProject.budget}
                                    onChange={e => setNewProject({...newProject, budget: e.target.value})}
                                />
                            </div>
                            <div className="m3-text-field">
                                <label className="m3-label-medium">Timeline</label>
                                <input 
                                    type="text" 
                                    className="m3-input" 
                                    placeholder="e.g. Q3 2024"
                                    value={newProject.timeline}
                                    onChange={e => setNewProject({...newProject, timeline: e.target.value})}
                                />
                            </div>
                            <div className="m3-text-field">
                                <label className="m3-label-medium">Initial Status</label>
                                <select 
                                    className="m3-input m3-select"
                                    value={newProject.status}
                                    onChange={e => setNewProject({...newProject, status: e.target.value})}
                                >
                                    <option value="PLANNED">Planned</option>
                                    <option value="ONGOING">Ongoing</option>
                                    <option value="COMPLETED">Completed</option>
                                </select>
                            </div>
                            <div className="m3-text-field">
                                <label className="m3-label-medium">Progress (%)</label>
                                <input 
                                    type="number" 
                                    className="m3-input" 
                                    min="0" max="100"
                                    value={newProject.progress}
                                    onChange={e => setNewProject({...newProject, progress: parseInt(e.target.value) || 0})}
                                />
                            </div>
                            <div className="m3-card-actions m3-full-width">
                                <button type="button" className="m3-text-btn" onClick={() => setShowAddModal(false)}>Cancel</button>
                                <button type="submit" className="m3-filled-btn">Submit Proposal</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showEditModal && selectedProject && (
                <div className="m3-modal-overlay">
                    <div className="m3-card m3-elevated-card m3-modal-content">
                        <h2 className="m3-title-large">Update Project</h2>
                        <form className="m3-form-grid" onSubmit={handleUpdateSubmit}>
                            <div className="m3-text-field m3-full-width">
                                <label className="m3-label-medium">Project Name</label>
                                <input 
                                    type="text" 
                                    className="m3-input" 
                                    required 
                                    value={selectedProject.name}
                                    onChange={e => setSelectedProject({...selectedProject, name: e.target.value})}
                                />
                            </div>
                            <div className="m3-text-field">
                                <label className="m3-label-medium">Budget</label>
                                <input 
                                    type="text" 
                                    className="m3-input" 
                                    value={selectedProject.budget}
                                    onChange={e => setSelectedProject({...selectedProject, budget: e.target.value})}
                                />
                            </div>
                            <div className="m3-text-field">
                                <label className="m3-label-medium">Timeline</label>
                                <input 
                                    type="text" 
                                    className="m3-input" 
                                    value={selectedProject.timeline}
                                    onChange={e => setSelectedProject({...selectedProject, timeline: e.target.value})}
                                />
                            </div>
                            <div className="m3-text-field">
                                <label className="m3-label-medium">Status</label>
                                <select 
                                    className="m3-input m3-select"
                                    value={selectedProject.status}
                                    onChange={e => setSelectedProject({...selectedProject, status: e.target.value})}
                                >
                                    <option value="PLANNED">Planned</option>
                                    <option value="ONGOING">Ongoing</option>
                                    <option value="COMPLETED">Completed</option>
                                </select>
                            </div>
                            <div className="m3-text-field">
                                <label className="m3-label-medium">Progress (%)</label>
                                <input 
                                    type="number" 
                                    className="m3-input" 
                                    min="0" max="100"
                                    value={selectedProject.progress}
                                    onChange={e => setSelectedProject({...selectedProject, progress: parseInt(e.target.value) || 0})}
                                />
                            </div>
                            <div className="m3-card-actions m3-full-width">
                                <button type="button" className="m3-text-btn" onClick={() => setShowEditModal(false)}>Cancel</button>
                                <button 
                                    type="button" 
                                    className="m3-filled-btn" 
                                    disabled={isSaving}
                                    onClick={handleUpdateSubmit}
                                >
                                    {isSaving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="m3-search-bar-container">
                <div className="m3-search-bar">
                    <span className="m3-search-icon">🔍</span>
                    <input
                        type="text"
                        className="m3-search-input"
                        placeholder="Search projects..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="m3-chip-row">
                    {["All", "PLANNED", "ONGOING", "COMPLETED"].map(status => (
                        <button
                            key={status}
                            className={`m3-filter-chip ${filterStatus === status ? 'm3-chip-selected' : ''}`}
                            onClick={() => setFilterStatus(status)}
                        >
                            {status.charAt(0) + status.slice(1).toLowerCase()}
                        </button>
                    ))}
                </div>
            </div>

            <div className="project-grid">
                {filteredProjects.map(project => (
                    <div 
                        key={project.id} 
                        className="m3-card m3-elevated-card project-card clickable-card"
                        onClick={() => { setSelectedProject(project); setShowDetailModal(true); }}
                    >
                        <div className="project-card-header">
                            <h3 className="m3-title-large">{project.name}</h3>
                            <span className={`m3-status-indicator ${getStatusClass(project.status)}`}>
                                <span className="m3-status-dot"></span>
                                {project.status}
                            </span>
                        </div>
                        
                        <div className="project-card-content">
                            <div className="project-metric">
                                <span className="m3-label-small m3-on-surface-variant">BUDGET</span>
                                <span className="m3-title-medium">{project.budget || 'N/A'}</span>
                            </div>
                            <div className="project-metric">
                                <span className="m3-label-small m3-on-surface-variant">TIMELINE</span>
                                <span className="m3-body-medium">{project.timeline || 'TBD'}</span>
                            </div>
                            
                            <div className="progress-section">
                                <div className="progress-header">
                                    <span className="m3-label-small">PROGRESS</span>
                                    <span className="m3-label-small">{project.progress}%</span>
                                </div>
                                <div className="progress-bar-container">
                                    <div 
                                        className="progress-bar-fill" 
                                        style={{ width: `${project.progress}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        <div className="m3-card-actions">
                            <button className="m3-text-btn" onClick={(e) => { e.stopPropagation(); setSelectedProject(project); setShowDetailModal(true); }}>Details</button>
                            <button className="m3-tonal-btn" onClick={(e) => { e.stopPropagation(); setSelectedProject(project); setShowEditModal(true); }}>Update</button>
                        </div>
                    </div>
                ))}
            </div>

            {filteredProjects.length === 0 && !loading && (
                <div className="m3-empty-state">
                    <p className="m3-title-medium">No projects found</p>
                </div>
            )}
        </div>
    );
}
