import React, { useState } from 'react';

const MemberDirectory = ({ members, onAddMember, onViewDetails }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterRole, setFilterRole] = useState('All');

    const filteredMembers = members
        .filter(m => filterRole === 'All' || m.role === filterRole)
        .filter(m => m.fullName.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="m3-directory animate-fade-in" style={{ padding: '0 8px' }}>
            {/* HCI COMMAND CENTER: Logical Task Grouping */}
            <div className="directory-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', gap: '24px' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {/* Primary Search - High Visibility */}
                    <div style={{ position: 'relative', width: '100%', maxWidth: '600px' }}>
                        <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', fontSize: '24px', opacity: 0.7 }}>🔍</span>
                        <input
                            type="text"
                            className="m3-input"
                            placeholder="Search residents by name..."
                            style={{ 
                                width: '100%', 
                                padding: '18px 18px 18px 56px', 
                                fontSize: '18px', 
                                borderRadius: '16px',
                                border: '2px solid var(--m3-surface-variant)',
                                background: 'var(--m3-surface)',
                                boxShadow: 'var(--m3-elevation-1)'
                            }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Filters - Secondary Grouped Action */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span className="m3-label-large" style={{ fontWeight: 'bold', marginRight: '8px' }}>Filter by:</span>
                        {['All', 'Officer', 'Member'].map(role => (
                            <button
                                key={role}
                                className={`m3-filter-chip ${filterRole === role ? 'm3-chip-selected' : ''}`}
                                style={{ 
                                    padding: '10px 24px', 
                                    fontSize: '15px',
                                    borderRadius: '12px',
                                    height: 'auto',
                                    background: filterRole === role ? 'var(--m3-primary-container)' : 'transparent',
                                    color: filterRole === role ? 'var(--m3-primary)' : 'inherit',
                                    border: `1.5px solid ${filterRole === role ? 'var(--m3-primary)' : 'var(--m3-outline)'}`
                                }}
                                onClick={() => setFilterRole(role)}
                            >{role}</button>
                        ))}
                    </div>
                </div>

                {/* Main Call-to-Action - Distant to avoid errors */}
                <button 
                    className="m3-filled-btn" 
                    onClick={onAddMember} 
                    style={{ 
                        padding: '16px 32px', 
                        height: 'auto', 
                        fontSize: '16px', 
                        fontWeight: 'bold', 
                        borderRadius: '16px',
                        boxShadow: 'var(--m3-elevation-2)'
                    }}
                >
                    + Add New Member
                </button>
            </div>

            {/* ENHANCED MEMBER LEDGER */}
            <div className="m3-table-container m3-elevated-card" style={{ borderRadius: '24px', overflow: 'hidden' }}>
                <table className="m3-data-table" style={{ borderCollapse: 'separate', borderSpacing: '0' }}>
                    <thead>
                        <tr style={{ background: 'var(--m3-surface-variant)', opacity: 0.8 }}>
                            <th style={{ padding: '16px 24px' }}>Resident Information</th>
                            <th style={{ padding: '16px 24px' }}>HOA Property</th>
                            <th style={{ padding: '16px 24px' }}>Role & Status</th>
                            <th style={{ padding: '16px 24px', textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredMembers.map((member) => (
                            <tr key={member.id} className="m3-table-row" style={{ height: '90px' }}>
                                <td style={{ padding: '16px 24px' }}>
                                    <div className="m3-member-cell" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <div className="m3-avatar m3-avatar-large" style={{ width: '56px', height: '56px', fontSize: '20px', background: 'var(--m3-primary-container)', color: 'var(--m3-primary)' }}>
                                            {member.fullName.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="m3-title-large" style={{ fontWeight: '700', color: 'var(--m3-on-surface)' }}>{member.fullName}</div>
                                            <div className="m3-body-medium" style={{ color: 'var(--m3-on-surface-variant)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                📞 {member.contactNumber || 'No Phone Listed'}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: '16px 24px' }}>
                                    <div className="m3-body-large" style={{ fontWeight: '500' }}>
                                        🏠 {member.hoaAddress || 'Unassigned'}
                                    </div>
                                    <div className="m3-label-small m3-on-surface-variant">Block & Lot Details</div>
                                </td>
                                <td style={{ padding: '16px 24px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        <span className={`m3-role-chip ${member.role === 'Officer' ? 'm3-role-officer' : 'm3-role-member'}`} style={{ width: 'fit-content' }}>
                                            {member.role}
                                        </span>
                                        <span className={`m3-status-indicator ${member.status === 'Active' ? 'm3-status-active' : 'm3-status-inactive'}`} style={{ fontWeight: 'bold' }}>
                                            <span className="m3-status-dot"></span>
                                            {member.status.toUpperCase()}
                                        </span>
                                    </div>
                                </td>
                                <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                                    <button 
                                        className="m3-tonal-btn" 
                                        onClick={() => onViewDetails(member)}
                                        style={{ padding: '12px 24px', borderRadius: '12px', fontWeight: 'bold' }}
                                    >
                                        Manage Profile
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filteredMembers.length === 0 && (
                            <tr>
                                <td colSpan="4" style={{ textAlign: 'center', padding: '64px' }}>
                                    <div style={{ fontSize: '20px', color: 'var(--m3-on-surface-variant)' }}>No residents found matching your criteria.</div>
                                    <button className="m3-text-btn" onClick={() => {setSearchTerm(""); setFilterRole("All");}} style={{ marginTop: '16px' }}>Clear all filters</button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <p className="m3-body-small" style={{ marginTop: '16px', opacity: 0.6, textAlign: 'center' }}>
                Displaying {filteredMembers.length} records • Total Association Capacity: {members.length}
            </p>
        </div>
    );
};

export default MemberDirectory;
