import { useState, useEffect } from 'react';
import './MemberList.css';

export default function MemberList() {
    // --- STATE MANAGEMENT ---
    const [view, setView] = useState('list'); // 'list', 'info', 'registration', 'edit'
    const [members, setMembers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedMember, setSelectedMember] = useState(null);
    const [filterRole, setFilterRole] = useState('All');

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
        if (view === 'edit') {
            setSelectedMember(prev => ({ ...prev, [name]: value }));
        } else {
            setNewMember(prev => ({ ...prev, [name]: value }));
        }
    };

    // 1. Update the Fetch logic
    useEffect(() => {
        fetch('http://localhost:8081/api/members')
            .then(res => res.json())
            .then(data => setMembers(data))
            .catch(err => console.error("Error fetching members:", err));
    }, [view]);

    const handleRegisterSubmit = async (formData) => {
        try {
            const dataToSend = { ...formData };
            if (dataToSend.birthDate === '') dataToSend.birthDate = null;

            const response = await fetch('http://localhost:8081/api/members', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend)
            });

            if (response.ok) {
                alert("Member successfully registered!");
                setView('list');
            }
        } catch (error) {
            alert("Registration failed: " + error.message);
        }
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:8081/api/members/${selectedMember.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(selectedMember)
            });
            if (response.ok) {
                alert("Member profile updated successfully!");
                setView('info');
            }
        } catch (error) {
            alert("Update failed: " + error.message);
        }
    };

    const handleViewDetails = (member) => {
        setSelectedMember(member);
        setView('info');
    };

    const handleDeactivate = async () => {
        if (!window.confirm(`Are you sure you want to deactivate ${selectedMember.fullName}?`)) return;

        try {
            const updatedMember = { ...selectedMember, status: 'Inactive' };
            const response = await fetch(`http://localhost:8081/api/members/${selectedMember.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedMember)
            });
            if (response.ok) {
                const data = await response.json();
                setSelectedMember(data);
                alert("Account deactivated successfully.");
            }
        } catch (error) {
            alert("Deactivation failed: " + error.message);
        }
    };

    const handleActivate = async () => {
        if (!window.confirm(`Are you sure you want to reactivate ${selectedMember.fullName}?`)) return;

        try {
            const updatedMember = { ...selectedMember, status: 'Active' };
            const response = await fetch(`http://localhost:8081/api/members/${selectedMember.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedMember)
            });
            if (response.ok) {
                const data = await response.json();
                setSelectedMember(data);
                alert("Account reactivated successfully!");
            }
        } catch (error) {
            alert("Activation failed: " + error.message);
        }
    };

    const renderMemberTable = () => (
        <div className="m3-directory animate-fade-in">
            <div className="m3-page-header">
                <div>
                    <h1 className="m3-display-small" style={{ fontWeight: '800', color: 'var(--m3-primary)' }}>Member Directory</h1>
                    <p className="m3-body-medium m3-on-surface-variant">Manage and organize {members.length} community members</p>
                </div>
                <button className="m3-fab-extended" onClick={() => setView('registration')}>
                    <span className="m3-fab-icon">+</span>
                    <span>Add Member</span>
                </button>
            </div>

            <div className="m3-search-bar-container">
                <div className="m3-search-bar">
                    <span className="m3-search-icon">🔍</span>
                    <input
                        type="text"
                        className="m3-search-input"
                        placeholder="Search by name or address..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="m3-chip-row">
                    {['All', 'Officer', 'Member'].map(role => (
                        <button
                            key={role}
                            className={`m3-filter-chip ${filterRole === role ? 'm3-chip-selected' : ''}`}
                            onClick={() => setFilterRole(role)}
                        >{role}</button>
                    ))}
                </div>
            </div>

            <div className="m3-table-container m3-elevated-card">
                <table className="m3-data-table">
                    <thead>
                        <tr>
                            <th>Member</th>
                            <th>HOA Address</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {members
                            .filter(m => filterRole === 'All' || m.role === filterRole)
                            .filter(m => m.fullName.toLowerCase().includes(searchTerm.toLowerCase()))
                            .map((member) => (
                                <tr key={member.id} className="m3-table-row">
                                    <td>
                                        <div className="m3-member-cell">
                                            <div className="m3-avatar m3-avatar-small">
                                                {member.fullName.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="m3-title-small">{member.fullName}</div>
                                                <div className="m3-label-small m3-on-surface-variant">ID: #{member.id}</div>
                                            </div>
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
                                    <td style={{ textAlign: 'right' }}>
                                        <button className="m3-tonal-btn" onClick={() => handleViewDetails(member)}>View Profile</button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderMemberInfo = () => (
        <div className="m3-directory animate-slide-up">
            <div className="m3-page-header">
                <button className="m3-icon-btn" onClick={() => setView('list')}>←</button>
                <h1 className="m3-display-small">Member Profile</h1>
            </div>

            <div className="m3-card m3-elevated-card profile-card">
                <div className="m3-card-header profile-header">
                    <div className="m3-profile-identity">
                        <div className="m3-avatar m3-avatar-large">
                            {selectedMember.fullName.charAt(0)}
                        </div>
                        <div className="m3-profile-titles">
                            <h2 className="m3-title-large" style={{ fontSize: '2.4rem', lineHeight: '1.1' }}>{selectedMember.fullName}</h2>
                            <div className="m3-profile-badges">
                                <span className={`m3-role-chip ${selectedMember.role === 'Officer' ? 'm3-role-officer' : 'm3-role-member'}`}>
                                    {selectedMember.role}
                                </span>
                                <span className={`m3-status-indicator ${selectedMember.status === 'Active' ? 'm3-status-active' : 'm3-status-inactive'}`}>
                                    <span className="m3-status-dot"></span>{selectedMember.status}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="m3-card-content m3-details-grid" style={{ padding: '32px' }}>
                    <div className="m3-detail-item">
                        <span className="m3-label-small m3-on-surface-variant">Home Address</span>
                        <span className="m3-body-large">{selectedMember.hoaAddress || 'Not Assigned'}</span>
                    </div>
                    <div className="m3-detail-item">
                        <span className="m3-label-small m3-on-surface-variant">Birth Date</span>
                        <span className="m3-body-large">{selectedMember.birthDate || 'Not Provided'}</span>
                    </div>
                    <div className="m3-detail-item">
                        <span className="m3-label-small m3-on-surface-variant">Gender</span>
                        <span className="m3-body-large">{selectedMember.gender || '—'}</span>
                    </div>
                    <div className="m3-detail-item">
                        <span className="m3-label-small m3-on-surface-variant">Marital Status</span>
                        <span className="m3-body-large">{selectedMember.maritalStatus || '—'}</span>
                    </div>
                    <div className="m3-detail-item m3-full-width">
                        <span className="m3-label-small m3-on-surface-variant">Family Composition</span>
                        <div className="m3-info-box">
                            <p className="m3-body-medium" style={{ margin: 0 }}>{selectedMember.familyMembers || 'No secondary residents listed.'}</p>
                        </div>
                    </div>
                </div>

                <div className="m3-card-actions" style={{ padding: '24px', background: 'var(--m3-surface-variant)', borderRadius: '0 0 24px 24px' }}>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button className="m3-filled-btn" onClick={() => setView('edit')}>Edit Profile</button>
                        {selectedMember.status === 'Inactive' ? (
                            <button className="m3-filled-btn" style={{ background: 'var(--m3-primary)' }} onClick={handleActivate}>Activate Account</button>
                        ) : (
                            <button className="m3-outlined-btn m3-error-text" onClick={handleDeactivate}>Deactivate Account</button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    const renderMemberForm = (isEdit = false) => {
        const data = isEdit ? selectedMember : newMember;
        const title = isEdit ? 'Update Member Profile' : 'Register New Member';
        const submitLabel = isEdit ? 'Save Changes' : 'Create Member';
        const handleSubmit = isEdit ? handleUpdateSubmit : (e) => { e.preventDefault(); handleRegisterSubmit(newMember); };

        return (
            <div className="m3-directory animate-fade-in">
                <div className="m3-page-header">
                    <button className="m3-icon-btn" onClick={() => setView(isEdit ? 'info' : 'list')}>←</button>
                    <h1 className="m3-display-small">{title}</h1>
                </div>
                <div className="m3-card m3-elevated-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <form className="m3-form-grid" style={{ padding: '32px' }} onSubmit={handleSubmit}>
                        <div className="m3-text-field m3-full-width">
                            <label className="m3-label-medium">Full Name</label>
                            <input type="text" name="fullName" value={data.fullName} onChange={handleChange} required className="m3-input" placeholder="e.g. Juan Dela Cruz" />
                        </div>
                        <div className="m3-text-field">
                            <label className="m3-label-medium">Birthdate</label>
                            <input type="date" name="birthDate" value={data.birthDate || ''} onChange={handleChange} className="m3-input" />
                        </div>
                        <div className="m3-text-field">
                            <label className="m3-label-medium">HOA Address</label>
                            <input type="text" name="hoaAddress" value={data.hoaAddress || ''} onChange={handleChange} className="m3-input" placeholder="Block & Lot" />
                        </div>
                        <div className="m3-text-field">
                            <label className="m3-label-medium">Community Role</label>
                            <select name="role" value={data.role} onChange={handleChange} className="m3-input m3-select">
                                <option value="Member">Homeowner / Member</option>
                                <option value="Officer">Board Officer</option>
                            </select>
                        </div>
                        <div className="m3-text-field">
                            <label className="m3-label-medium">Membership Status</label>
                            <select name="status" value={data.status} onChange={handleChange} className="m3-input m3-select">
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                                <option value="Suspended">Suspended</option>
                            </select>
                        </div>
                        <div className="m3-text-field m3-full-width">
                            <label className="m3-label-medium">Family Details & Notes</label>
                            <textarea name="familyMembers" value={data.familyMembers || ''} onChange={handleChange} className="m3-input m3-textarea" placeholder="List other residents or special instructions..."></textarea>
                        </div>
                        <div className="m3-card-actions m3-full-width" style={{ marginTop: '24px' }}>
                            <button type="button" className="m3-text-btn" onClick={() => setView(isEdit ? 'info' : 'list')}>Discard Changes</button>
                            <button type="submit" className="m3-filled-btn" style={{ padding: '12px 32px' }}>{submitLabel}</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    return (
        <section className="m3-content-wrapper">
            {view === 'list' && renderMemberTable()}
            {view === 'info' && renderMemberInfo()}
            {view === 'registration' && renderMemberForm(false)}
            {view === 'edit' && renderMemberForm(true)}
        </section>
    );
}
