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
                <table className="unified-table">
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
                    <div className="form-group">
                        <label>Full Name</label>
                        <input 
                            type="text" 
                            name="fullName" 
                            value={newMember.fullName} 
                            onChange={handleChange} 
                            placeholder="Enter name" 
                        />
                    </div>
                    <div className="form-group">
                        <label>Birthdate</label>
                        <input 
                            type="date" 
                            name="birthDate" 
                            value={newMember.birthDate} 
                            onChange={handleChange} 
                        />
                    </div>
                    <div className="form-group">
                        <label>HOA Address</label>
                        <input 
                            type="text" 
                            name="hoaAddress" 
                            value={newMember.hoaAddress} 
                            onChange={handleChange} 
                            placeholder="Block/Lot/Phase" 
                        />
                    </div>
                    <div className="form-group">
                        <label>Gender</label>
                        <select name="gender" value={newMember.gender} onChange={handleChange}>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Marital Status</label>
                        <select name="maritalStatus" value={newMember.maritalStatus} onChange={handleChange}>
                            <option value="Single">Single</option>
                            <option value="Married">Married</option>
                        </select>
                    </div>
                    <div className="form-group full-width">
                        <label>Family Members (including staff)</label>
                        <textarea 
                            name="familyMembers" 
                            value={newMember.familyMembers} 
                            onChange={handleChange} 
                            placeholder="List details..."
                        ></textarea>
                    </div>
                </div>
                
                <div className="form-actions">
                    <button type="button" className="btn-back" onClick={() => setView('list')}>Cancel</button>
                    {/* This button now actually sends the 'newMember' state to the backend */}
                    <button 
                        type="button" 
                        className="btn-register" 
                        onClick={() => handleRegisterSubmit(newMember)}
                    >
                        Register Member
                    </button>
                </div>
            </form>
        </div>
    );

    return (
        <section className="content-card">
            {view === 'list' && renderMemberTable()}
            {view === 'info' && renderMemberInfo()}
            {view === 'registration' && renderRegistration()}
        </section>
    );
}