import React from 'react';

export default function MemberDirectory({ members, searchTerm, setSearchTerm, filterRole, setFilterRole, onAddMember, onViewDetails }) {
    return (
        <div className="m3-directory">
            {/* M3 Top App Bar style header */}
            <div className="m3-page-header">
                <div>
                    <h2 className="m3-display-small">Member Directory</h2>
                    <p className="m3-body-medium m3-on-surface-variant">{members.length} registered members</p>
                </div>
                <button className="m3-fab-extended" onClick={onAddMember}>
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
                                    <button className="m3-tonal-btn" onClick={() => onViewDetails(member)}>
                                        View Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {(members.length === 0 || members.filter(m => (filterRole === 'All' || m.role === filterRole) && m.fullName.toLowerCase().includes(searchTerm.toLowerCase())).length === 0) && (
                    <div className="m3-empty-state">
                        <p className="m3-title-medium">No members found</p>
                        <p className="m3-body-medium m3-on-surface-variant">Try adjusting your search or filter</p>
                    </div>
                )}
            </div>
        </div>
    );
}
