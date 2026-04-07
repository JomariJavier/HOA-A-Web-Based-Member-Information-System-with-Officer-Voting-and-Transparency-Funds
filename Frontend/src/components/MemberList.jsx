import { useState, useEffect } from 'react';
import './MemberList.css';

export default function MemberList() {
    // --- STATE MANAGEMENT ---
    const [view, setView] = useState('list'); // 'list', 'info', 'registration'
    const [members, setMembers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedMember, setSelectedMember] = useState(null);
    
    // Filter State
    const [showFilter, setShowFilter] = useState(false);
    const [filterRole, setFilterRole] = useState('All');

    useEffect(() => {
        // Placeholders matching the Figma structure
        const fakeData = [
            { 
                id: "2024-001", 
                fullName: "Emmanuel A. Consencino", 
                birthDate: "1998-05-20", 
                hoaAddress: "Blk 1 Lot 2, Phase 1", 
                dateRegistered: "2024-01-15",
                maritalStatus: "Single",
                familyMembers: "Staff: Maria Santos, Dependent: Jose Consencino",
                role: "Officer"
            },
            { 
                id: "2024-002", 
                fullName: "Lara Shane T. Eduarte", 
                birthDate: "1999-11-12", 
                hoaAddress: "Blk 3 Lot 4, Phase 2", 
                dateRegistered: "2024-02-10",
                maritalStatus: "Single",
                familyMembers: "None",
                role: "Member"
            }
        ];
        setMembers(fakeData);
    }, []);

    const handleViewDetails = (member) => {
        setSelectedMember(member);
        setView('info');
    };

    // --- RENDER PIECES ---

    const renderMemberTable = () => (
        <>
            <div className="content-header">
                <h2>Member Directory</h2>
                <button className="add-member-btn" onClick={() => setView('registration')}>+ Add New Member</button>
            </div>
            
            <div className="toolbar">
                <div className="search-and-filter">
                    <div className="search-wrapper">
                        <span className="search-icon">🔍</span>
                        <input 
                            type="text" 
                            placeholder="Search members..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="filter-container">
                        <button className="filter-btn" onClick={() => setShowFilter(!showFilter)}>
                             Filter ⚙️
                        </button>
                        {showFilter && (
                            <div className="filter-popup">
                                <div className="filter-option" onClick={() => {setFilterRole('All'); setShowFilter(false);}}>All</div>
                                <div className="filter-option" onClick={() => {setFilterRole('Officer'); setShowFilter(false);}}>Officer</div>
                                <div className="filter-option" onClick={() => {setFilterRole('Member'); setShowFilter(false);}}>Member</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="table-responsive">
                <table className="pis-table">
                    <thead>
                        <tr>
                            <th>Member ID</th>
                            <th>Full Name</th>
                            <th>HOA Address</th>
                            <th>Role</th>
                            <th className="text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {members.map((member) => (
                            <tr key={member.id}>
                                <td className="id-cell">{member.id}</td>
                                <td className="name-cell">{member.fullName}</td>
                                <td>{member.hoaAddress}</td>
                                <td>{member.role}</td>
                                <td className="text-right">
                                    <button className="view-btn" onClick={() => handleViewDetails(member)}>
                                        View Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );

    const renderMemberInfo = () => (
        <div className="member-info-view">
            <div className="content-header">
                <button className="back-link" onClick={() => setView('list')}>← Back to List</button>
                <button className="add-member-btn" onClick={() => setView('registration')}>+ Add New Member</button>
            </div>
            <div className="info-grid-simple">
                <div className="info-section">
                    <h3>Member Details</h3>
                    <div className="details-list">
                        <div className="detail-row"><label>Full Name:</label> <span>{selectedMember.fullName}</span></div>
                        <div className="detail-row"><label>Birthdate:</label> <span>{selectedMember.birthDate}</span></div>
                        <div className="detail-row"><label>HOA Address:</label> <span>{selectedMember.hoaAddress}</span></div>
                        <div className="detail-row"><label>Date Registered:</label> <span>{selectedMember.dateRegistered}</span></div>
                        <div className="detail-row"><label>Marital Status:</label> <span>{selectedMember.maritalStatus}</span></div>
                        <div className="detail-row full-width-row"><label>Family Members:</label> <p>{selectedMember.familyMembers}</p></div>
                    </div>
                </div>
            </div>
            <div className="form-actions">
                 <button className="edit-btn">Edit Record</button>
            </div>
        </div>
    );

    const renderRegistration = () => (
        <div className="registration-view">
            <div className="content-header">
                <h2>New Member Registration</h2>
            </div>
            <form className="registration-form">
                <div className="form-grid">
                    <div className="form-group"><label>Full Name</label><input type="text" /></div>
                    <div className="form-group"><label>Birthdate</label><input type="date" /></div>
                    <div className="form-group"><label>HOA Address</label><input type="text" /></div>
                    <div className="form-group"><label>Gender</label>
                        <select><option>Male</option><option>Female</option></select>
                    </div>
                    <div className="form-group"><label>Marital Status</label>
                        <select><option>Single</option><option>Married</option></select>
                    </div>
                    <div className="form-group full-width">
                        <label>Family Members (including staff)</label>
                        <textarea placeholder="List details..."></textarea>
                    </div>
                </div>
                <div className="form-actions">
                    <button type="button" className="btn-back" onClick={() => setView('list')}>Cancel</button>
                    <button type="button" className="btn-register" onClick={() => setView('list')}>Register Member</button>
                </div>
            </form>
        </div>
    );

    return (
        <div className="pis-layout">
            <aside className="pis-sidebar">
                <div className="sidebar-logo">HOA Portal</div>
                <nav>
                    <div className="nav-item">Dashboard</div>
                    <div className={`nav-item ${view !== 'registration' ? 'active' : ''}`} onClick={() => setView('list')}>HOA Personal Information</div>
                    <div className="nav-item">Project Management</div>
                    <div className="nav-item">HOA Voting Room</div>
                    <div className="nav-item">Public Relations Room</div>
                </nav>
            </aside>

            <main className="pis-main">
                <header className="pis-top-header">
                    <div className="breadcrumb">PIS / {view === 'list' ? 'Member List' : view === 'info' ? 'Member Details' : 'Registration'}</div>
                    <div className="user-profile">Admin Mode</div>
                </header>

                <section className="pis-content-card">
                    {view === 'list' && renderMemberTable()}
                    {view === 'info' && renderMemberInfo()}
                    {view === 'registration' && renderRegistration()}
                </section>
            </main>
        </div>
    );
}