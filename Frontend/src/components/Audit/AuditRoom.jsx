import React, { useState } from 'react';
import './Audit.css';
import BudgetDashboard from './BudgetDashboard';
import ProjectList from './ProjectList';
import ProjectDetail from './ProjectDetail';
import ProjectForm from './ProjectForm';

const MOCK_PROJECTS = [
    {
        id: "PRJ-1001",
        name: "Phase 2 CCTV Installation",
        status: "Ongoing",
        dateStarted: "2026-03-01",
        estimatedDate: "2026-05-15",
        budget: 150000,
        purpose: "Enhance security coverage at the south perimeter.",
        description: "Installation of 12 new high-definition IP cameras with night vision, wired to the central guardhouse server. This project aims to prevent unauthorized entry and provide better monitoring capabilities for the homeowner association."
    },
    {
        id: "PRJ-1002",
        name: "Clubhouse Roof Repair",
        status: "Proposed",
        dateStarted: "2026-06-01",
        estimatedDate: "2026-06-30",
        budget: 45000,
        purpose: "Fix leaks in the main hall of the clubhouse.",
        description: "Contracting local builders to replace the damaged shingles and re-seal the roof structure before the rainy season starts."
    },
    {
        id: "PRJ-1003",
        name: "Community Park Landscaping",
        status: "Completed",
        dateStarted: "2025-11-10",
        estimatedDate: "2025-12-05",
        budget: 85000,
        purpose: "Beautification of the central park.",
        description: "Planting of new native trees, installation of 4 park benches, and laying down fresh bermuda grass."
    }
];

export default function AuditRoom() {
    const [currentTab, setCurrentTab] = useState('dashboard');
    const [isAdmin, setIsAdmin] = useState(false); // Prototype toggle for RBAC
    const [selectedProject, setSelectedProject] = useState(null);

    const handleTabChange = (tab) => {
        setCurrentTab(tab);
        setSelectedProject(null); // Reset detail view when changing tabs
    };

    return (
        <div className="audit-container">
            {/* Header with Admin Sandbox Toggle */}
            <header className="audit-header">
                <div>
                    <h1 className="m3-display-small">Project Management & Auditing</h1>
                    <p className="m3-body-medium m3-on-surface-variant">
                        Track community funds, review ongoing projects, and ensure financial transparency.
                    </p>
                </div>

                <div className="admin-toggle-wrapper">
                    <span className="m3-label-large">Admin Sandbox</span>
                    <label className="toggle-switch">
                        <input 
                            type="checkbox" 
                            checked={isAdmin} 
                            onChange={(e) => setIsAdmin(e.target.checked)} 
                        />
                        <span className="slider"></span>
                    </label>
                </div>
            </header>

            {/* Navigation Tabs */}
            <nav className="audit-nav-tabs">
                <div 
                    className={`audit-nav-item ${currentTab === 'dashboard' ? 'active' : ''}`}
                    onClick={() => handleTabChange('dashboard')}
                >
                    Budget Dashboard
                </div>
                <div 
                    className={`audit-nav-item ${currentTab === 'list' ? 'active' : ''}`}
                    onClick={() => handleTabChange('list')}
                >
                    Project Audit
                </div>
                {isAdmin && (
                    <div 
                        className={`audit-nav-item ${currentTab === 'create' ? 'active' : ''}`}
                        onClick={() => handleTabChange('create')}
                    >
                        Create Project
                    </div>
                )}
            </nav>

            {/* Main Content Area */}
            <main>
                {currentTab === 'dashboard' && <BudgetDashboard />}
                
                {currentTab === 'list' && !selectedProject && (
                    <ProjectList 
                        projects={MOCK_PROJECTS} 
                        onSelectProject={setSelectedProject} 
                        isAdmin={isAdmin}
                    />
                )}

                {currentTab === 'list' && selectedProject && (
                    <ProjectDetail 
                        project={selectedProject} 
                        onBack={() => setSelectedProject(null)} 
                        isAdmin={isAdmin}
                    />
                )}

                {currentTab === 'create' && (
                    <ProjectForm 
                        onCancel={() => handleTabChange('list')}
                        onSubmit={(data) => {
                            console.log("New Project Data:", data);
                            alert("Project Created! (Mock)");
                            handleTabChange('list');
                        }}
                    />
                )}
            </main>
        </div>
    );
}
