import React, { useState } from 'react';

const MemberDirectory = ({ members, onAddMember, onViewDetails }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterRole, setFilterRole] = useState('All');

    const filteredMembers = members
        .filter(m => filterRole === 'All' || m.role === filterRole)
        .filter(m => m.fullName.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="m3-directory animate-fade-in">
            <div className="m3-page-header">
                <div>
                    <h2 className="m3-title-large">Member Directory</h2>
                    <p className="m3-body-medium m3-on-surface-variant">Showing {filteredMembers.length} members</p>
                </div>
                <button className="m3-filled-btn" onClick={onAddMember}>
                    + Add Member
                </button>
            </div>

            <div className="m3-search-bar-container">
                <input
                    type="text"
                    className="m3-input search-input"
                    placeholder="Search by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
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
                        {filteredMembers.map((member) => (
                            <tr key={member.id} className="m3-table-row">
                                <td>
                                    <div className="m3-member-cell">
                                        <div className="m3-avatar">
                                            {member.fullName.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="m3-title-small">{member.fullName}</div>
                                            <div className="m3-label-small">ID: #{member.id}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>{member.hoaAddress || '—'}</td>
                                <td>
                                    <span className={`m3-role-chip ${member.role === 'Officer' ? 'm3-role-officer' : 'm3-role-member'}`}>
                                        {member.role}
                                    </span>
                                </td>
                                <td>
                                    <span className={`m3-status-indicator ${member.status === 'Active' ? 'm3-status-active' : 'm3-status-inactive'}`}>
                                        {member.status}
                                    </span>
                                </td>
                                <td style={{ textAlign: 'right' }}>
                                    <button className="m3-text-btn" onClick={() => onViewDetails(member)}>View</button>
                                </td>
                            </tr>
                        ))}
                        {filteredMembers.length === 0 && (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center', padding: '48px' }}>
                                    No members found matching your search.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MemberDirectory;
