import { useState, useEffect } from 'react';
import './MemberList.css';

export default function MemberList() {
    // --- STATE MANAGEMENT ---
    const [view, setView] = useState('list'); // 'list', 'info', 'registration'
    const [members, setMembers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedMember, setSelectedMember] = useState(null);

    const [newMember, setNewMember] = useState({
    fullName: '',
    birthDate: '',
    hoaAddress: '',
    gender: 'Male',
    maritalStatus: 'Single',
    familyMembers: '',
    role: 'Member'
});

const handleChange = (e) => {
    const { name, value } = e.target;
    setNewMember(prev => ({ ...prev, [name]: value }));
};
    
    // Filter State
    const [showFilter, setShowFilter] = useState(false);
    const [filterRole, setFilterRole] = useState('All');

    // 1. Update the Fetch logic
useEffect(() => {
    fetch('http://localhost:8080/api/members')
        .then(res => res.json())
        .then(data => setMembers(data))
        .catch(err => console.error("Error fetching members:", err));
}, [view]); // Refresh when we go back to the list view

// 2. Update the Registration submit logic
const handleRegisterSubmit = async (formData) => {
    try {
        const response = await fetch('http://localhost:8080/api/members', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        if(response.ok) {
            alert("Member successfully registered!");
            setView('list');
        }
    } catch (error) {
        console.error("Registration failed:", error);
    }
};

    const handleViewDetails = (member) => {
        setSelectedMember(member);
        setView('info');
    };

    // --- RENDER PIECES ---

    const renderMemberTable = () => (
        <div className="m3-directory">
            {/* M3 Top App Bar style header */}
            <div className="m3-page-header">
                <div>
                    <h1 className="m3-display-small">Member Directory</h1>
                    <p className="m3-body-medium m3-on-surface-variant">{members.length} registered members</p>
                </div>
                <button className="m3-fab-extended" onClick={() => setView('registration')}>
                    <span className="m3-fab-icon">+</span>
                    <span>Add Member</span>
                </button>
            </div>

            {/* M3 Search Bar */}
            <div className="m3-search-bar-container">
                <div className="m3-search-bar">
                    <span className="m3-search-icon">🔍</span>
                    <input
                        type="text"
                        className="m3-search-input"
                        placeholder="Search members by name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <button className="m3-icon-btn" onClick={() => setSearchTerm('')}>✕</button>
                    )}
                </div>

                {/* M3 Filter Chips */}
                <div className="m3-chip-row">
                    <button
                        className={`m3-filter-chip ${filterRole === 'All' ? 'm3-chip-selected' : ''}`}
                        onClick={() => setFilterRole('All')}
                    >All</button>
                    <button
                        className={`m3-filter-chip ${filterRole === 'Officer' ? 'm3-chip-selected' : ''}`}
                        onClick={() => setFilterRole('Officer')}
                    >Officer</button>
                    <button
                        className={`m3-filter-chip ${filterRole === 'Member' ? 'm3-chip-selected' : ''}`}
                        onClick={() => setFilterRole('Member')}
                    >Member</button>
                </div>
            </div>

            {/* M3 Data Table */}
            <div className="m3-table-container">
                <table className="m3-data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Full Name</th>
                            <th>HOA Address</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th style={{textAlign: 'right'}}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {members
                            .filter(m => filterRole === 'All' || m.role === filterRole)
                            .filter(m => m.fullName.toLowerCase().includes(searchTerm.toLowerCase()))
                            .map((member) => (
                            <tr key={member.id} className="m3-table-row">
                                <td className="m3-label-large">{member.id}</td>
                                <td>
                                    <div className="m3-member-cell">
                                        <div className="m3-avatar">
                                            <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 96 960 960" width="20" fill="currentColor">
                                                <path d="M480 576q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM192 896v-57q0-38 18.5-70t50.5-50q51-29 108.5-44T480 660q61 0 119 15t108 44q32 18 50.5 50t18.5 70v57H192Z"/>
                                            </svg>
                                        </div>
                                        <span className="m3-title-small">{member.fullName}</span>
                                    </div>
                                </td>
                                <td className="m3-body-medium">{member.hoaAddress || '—'}</td>
                                <td>
                                    <span className={`m3-role-chip ${member.role === 'Officer' ? 'm3-role-officer' : 'm3-role-member'}`}>
                                        {member.role}
                                    </span>
                                </td>
                                <td>
                                    <span className={`m3-status-indicator ${member.status === 'Active' ? 'm3-status-active' : 'm3-status-inactive'}`}>
                                        <span className="m3-status-dot"></span>
                                        {member.status}
                                    </span>
                                </td>
                                <td style={{textAlign: 'right'}}>
                                    <button className="m3-tonal-btn" onClick={() => handleViewDetails(member)}>
                                        View Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {members.length === 0 && (
                    <div className="m3-empty-state">
                        <p className="m3-title-medium">No members found</p>
                        <p className="m3-body-medium m3-on-surface-variant">Add your first member to get started</p>
                    </div>
                )}
            </div>
        </div>
    );

    const renderMemberInfo = () => (
        <div className="m3-directory">
            <div className="m3-page-header">
                <button className="m3-icon-btn m3-on-surface-variant" onClick={() => setView('list')} aria-label="Back">
                    ←
                </button>
                <div>
                    <h1 className="m3-display-small">Member Profile</h1>
                </div>
            </div>

            <div className="m3-card m3-elevated-card">
                <div className="m3-card-header">
                    <div className="m3-avatar m3-avatar-large">
                        <svg xmlns="http://www.w3.org/2000/svg" height="32" viewBox="0 96 960 960" width="32" fill="currentColor">
                            <path d="M480 576q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM192 896v-57q0-38 18.5-70t50.5-50q51-29 108.5-44T480 660q61 0 119 15t108 44q32 18 50.5 50t18.5 70v57H192Z"/>
                        </svg>
                    </div>
                    <div>
                        <h2 className="m3-title-large">{selectedMember.fullName}</h2>
                        <span className={`m3-role-chip ${selectedMember.role === 'Officer' ? 'm3-role-officer' : 'm3-role-member'}`}>
                            {selectedMember.role}
                        </span>
                    </div>
                </div>
                
                <div className="m3-card-content m3-details-grid">
                    <div className="m3-detail-item">
                        <span className="m3-label-small m3-on-surface-variant">Member ID</span>
                        <span className="m3-body-large">{selectedMember.id}</span>
                    </div>
                    <div className="m3-detail-item">
                        <span className="m3-label-small m3-on-surface-variant">HOA Address</span>
                        <span className="m3-body-large">{selectedMember.hoaAddress || '—'}</span>
                    </div>
                    <div className="m3-detail-item">
                        <span className="m3-label-small m3-on-surface-variant">Date Registered</span>
                        <span className="m3-body-large">{selectedMember.dateRegistered}</span>
                    </div>
                    <div className="m3-detail-item">
                        <span className="m3-label-small m3-on-surface-variant">Status</span>
                        <span className={`m3-status-indicator ${selectedMember.status === 'Active' ? 'm3-status-active' : 'm3-status-inactive'}`}>
                            <span className="m3-status-dot"></span>{selectedMember.status}
                        </span>
                    </div>
                    <div className="m3-detail-item">
                        <span className="m3-label-small m3-on-surface-variant">Birthdate</span>
                        <span className="m3-body-large">{selectedMember.birthDate || '—'}</span>
                    </div>
                    <div className="m3-detail-item">
                        <span className="m3-label-small m3-on-surface-variant">Marital Status</span>
                        <span className="m3-body-large">{selectedMember.maritalStatus}</span>
                    </div>
                    <div className="m3-detail-item m3-full-width">
                        <span className="m3-label-small m3-on-surface-variant">Family Members</span>
                        <div className="m3-info-box m3-body-medium">
                            {selectedMember.familyMembers || 'No family members listed.'}
                        </div>
                    </div>
                </div>

                <div className="m3-card-actions">
                    <button className="m3-filled-btn">Edit Profile</button>
                    <button className="m3-outlined-btn m3-error-text">Deactivate</button>
                </div>
            </div>
        </div>
    );

    const renderRegistration = () => (
        <div className="m3-directory">
            <div className="m3-page-header">
                <button className="m3-icon-btn m3-on-surface-variant" onClick={() => setView('list')} aria-label="Back">
                    ←
                </button>
                <div>
                    <h1 className="m3-display-small">New Member Registration</h1>
                </div>
            </div>

            <div className="m3-card m3-elevated-card">
                <form className="m3-form-grid" onSubmit={(e) => { e.preventDefault(); handleRegisterSubmit(newMember); }}>
                    <div className="m3-text-field">
                        <label className="m3-label-medium">Full Name</label>
                        <input type="text" name="fullName" value={newMember.fullName} onChange={handleChange} required className="m3-input" />
                    </div>
                    <div className="m3-text-field">
                        <label className="m3-label-medium">Birthdate</label>
                        <input type="date" name="birthDate" value={newMember.birthDate} onChange={handleChange} className="m3-input" />
                    </div>
                    <div className="m3-text-field">
                        <label className="m3-label-medium">HOA Address (Block/Lot)</label>
                        <input type="text" name="hoaAddress" value={newMember.hoaAddress} onChange={handleChange} className="m3-input" />
                    </div>
                    <div className="m3-text-field">
                        <label className="m3-label-medium">Gender</label>
                        <select name="gender" value={newMember.gender} onChange={handleChange} className="m3-input m3-select">
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>
                    <div className="m3-text-field">
                        <label className="m3-label-medium">Marital Status</label>
                        <select name="maritalStatus" value={newMember.maritalStatus} onChange={handleChange} className="m3-input m3-select">
                            <option value="Single">Single</option>
                            <option value="Married">Married</option>
                        </select>
                    </div>
                    <div className="m3-text-field m3-full-width">
                        <label className="m3-label-medium">Family Members</label>
                        <textarea name="familyMembers" value={newMember.familyMembers} onChange={handleChange} className="m3-input m3-textarea"></textarea>
                    </div>
                    
                    <div className="m3-card-actions m3-full-width">
                        <button type="button" className="m3-text-btn" onClick={() => setView('list')}>Cancel</button>
                        <button type="submit" className="m3-filled-btn">Register Member</button>
                    </div>
                </form>
            </div>
        </div>
    );

    return (
        <section className="m3-content-wrapper">
            {view === 'list' && renderMemberTable()}
            {view === 'info' && renderMemberInfo()}
            {view === 'registration' && renderRegistration()}
        </section>
    );
}