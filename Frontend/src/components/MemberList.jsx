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
    const [filterRole, setFilterRole] = useState('All'); // 'All', 'Officer', 'Member'

    useEffect(() => {
        const fakeData = [
            { 
                id: "2024-001", firstName: "Emmanuel", lastName: "Consencino", middleName: "A", suffix: "",
                gender: "Male", civilStatus: "Single", occupation: "Software Engineer", 
                email: "emman@example.com", phone: "09123456789", income: "50,000",
                birthDate: "1998-05-20", birthPlace: "Manila",
                address: "Blk 1 Lot 2, Phase 1", status: "Active", role: "Officer"
            },
            { 
                id: "2024-002", firstName: "Lara Shane", lastName: "Eduarte", middleName: "T", suffix: "",
                gender: "Female", civilStatus: "Single", occupation: "Accountant", 
                email: "lara@example.com", phone: "09987654321", income: "45,000",
                birthDate: "1999-11-12", birthPlace: "Quezon City",
                address: "Blk 3 Lot 4, Phase 2", status: "Active", role: "Member"
            }
        ];
        setMembers(fakeData);
    }, []);

    // --- LOGIC ---
    const filteredMembers = members.filter(member => {
        const matchesSearch = `${member.firstName} ${member.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             member.address.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterRole === 'All' || member.role === filterRole;
        return matchesSearch && matchesFilter;
    });

    const handleViewDetails = (member) => {
        setSelectedMember(member);
        setView('info');
    };

    const handleOpenRegistration = () => {
        setView('registration');
    };

    // --- RENDER PIECES ---

    const renderMemberTable = () => (
        <>
            <div className="content-header">
                <h2>Homeowner Directory</h2>
                {/* Registration button available in List view */}
                <button className="add-member-btn" onClick={handleOpenRegistration}>+ Add New Member</button>
            </div>
            
            <div className="toolbar">
                <div className="search-wrapper">
                    <span className="search-icon">🔍</span>
                    <input 
                        type="text" 
                        placeholder="Search by name, ID, or address..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="filter-container">
                    <button className="filter-btn" onClick={() => setShowFilter(!showFilter)}>
                        <span>Inline Filter</span> ⚙️
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

            <div className="table-responsive">
                <table className="pis-table">
                    <thead>
                        <tr>
                            <th>Member ID</th>
                            <th>Full Name</th>
                            <th>Address/Location</th>
                            <th>Role</th>
                            <th className="text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredMembers.map((member) => (
                            <tr key={member.id}>
                                <td className="id-cell">{member.id}</td>
                                <td className="name-cell">{member.firstName} {member.lastName}</td>
                                <td>{member.address}</td>
                                <td>{member.role}</td>
                                <td className="text-center">
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
                <button className="back-link" onClick={() => setView('list')}>← Back to Member List</button>
                <button className="add-member-btn" onClick={handleOpenRegistration}>+ Add New Member</button>
            </div>
            <div className="info-grid">
                <div className="info-section">
                    <h3>Personal Information</h3>
                    <div className="details-grid">
                        <div className="detail-item"><label>Full Name</label><p>{selectedMember.firstName} {selectedMember.lastName}</p></div>
                        <div className="detail-item"><label>Gender</label><p>{selectedMember.gender}</p></div>
                        <div className="detail-item"><label>Birth Date</label><p>{selectedMember.birthDate}</p></div>
                        <div className="detail-item"><label>Role</label><p>{selectedMember.role}</p></div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderRegistration = () => (
        <div className="registration-view">
            <div className="content-header">
                <h2>Member Registration</h2>
            </div>
            <form className="registration-form">
                <div className="form-grid">
                    <div className="form-group">
                        <label>Full Name</label>
                        <input type="text" placeholder="Enter name" />
                    </div>
                    <div className="form-group">
                        <label>Birthdate</label>
                        <input type="date" />
                    </div>
                    <div className="form-group">
                        <label>HOA Address</label>
                        <input type="text" placeholder="Block/Lot/Phase" />
                    </div>
                    <div className="form-group">
                        <label>Gender</label>
                        <select>
                            <option>Male</option>
                            <option>Female</option>
                            <option>Other</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Marital Status</label>
                        <select>
                            <option>Single</option>
                            <option>Married</option>
                            <option>Widowed</option>
                        </select>
                    </div>
                    <div className="form-group full-width">
                        <label>Family Members (including staff)</label>
                        <textarea placeholder="List family members and staff details..."></textarea>
                    </div>
                </div>
                
                <div className="form-actions">
                    <button type="button" className="btn-back" onClick={() => setView('list')}>Back</button>
                    <button type="button" className="btn-register" onClick={() => {alert('Member Registered!'); setView('list');}}>Register</button>
                </div>
            </form>
        </div>
    );

    return (
        <div className="pis-layout">
            <aside className="pis-sidebar">
                <div className="sidebar-logo">HOA System</div>
                <nav>
                    <div className={`nav-item ${view === 'list' ? 'active' : ''}`} onClick={() => setView('list')}>Member List</div>
                    <div className={`nav-item ${view === 'registration' ? 'active' : ''}`} onClick={() => setView('registration')}>Registration</div>
                    <div className="nav-item">Voting System</div>
                    <div className="nav-item">Funds Management</div>
                </nav>
            </aside>

            <main className="pis-main">
                <header className="pis-top-header">
                    <div className="breadcrumb">PIS / {view === 'list' ? 'Member List' : view === 'info' ? 'Member Info' : 'Registration'}</div>
                    <div className="user-profile">Admin User</div>
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