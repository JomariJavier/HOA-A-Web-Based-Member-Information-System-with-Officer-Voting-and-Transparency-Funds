import { useState, useEffect } from 'react';
import './MemberList.css';

export default function MemberList() {
    const [members, setMembers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        // Mock data matching the HOA context
        const fakeData = [
            { id: "2024-001", name: "Emmanuel Consencino", address: "Blk 1 Lot 2, Phase 1", status: "Active" },
            { id: "2024-002", name: "Lara Shane Eduarte", address: "Blk 3 Lot 4, Phase 2", status: "Active" },
            { id: "2024-003", name: "John Paul Gutierrez", address: "Blk 2 Lot 1, Phase 1", status: "Inactive" },
            { id: "2024-004", name: "Jomari Javier", address: "Blk 5 Lot 10, Phase 3", status: "Active" }
        ];
        setMembers(fakeData);
    }, []);

    const filteredMembers = members.filter(member => 
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="pis-layout">
            {/* Sidebar Mockup */}
            <aside className="pis-sidebar">
                <div className="sidebar-logo">HOA System</div>
                <nav>
                    <div className="nav-item active">Member List</div>
                    <div className="nav-item">Registration</div>
                    <div className="nav-item">Voting System</div>
                    <div className="nav-item">Funds Management</div>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="pis-main">
                <header className="pis-top-header">
                    <div className="breadcrumb">PIS / Member List</div>
                    <div className="user-profile">Admin User</div>
                </header>

                <section className="pis-content-card">
                    <div className="content-header">
                        <h2 style={{ color: '#2d3748' }}>Homeowner Directory</h2>
                        <button className="add-member-btn">+ Add New Member</button>
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
                    </div>

                    <div className="table-responsive">
                        <table className="pis-table">
                            <thead>
                                <tr>
                                    <th>Member ID</th>
                                    <th>Full Name</th>
                                    <th>Address/Location</th>
                                    <th>Status</th>
                                    <th className="text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredMembers.map((member) => (
                                    <tr key={member.id}>
                                        <td className="id-cell">{member.id}</td>
                                        <td className="name-cell">{member.name}</td>
                                        <td>{member.address}</td>
                                        <td>
                                            <span className={`badge ${member.status.toLowerCase()}`}>
                                                {member.status}
                                            </span>
                                        </td>
                                        <td className="text-center">
                                            <button className="view-btn">View Details</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>
        </div>
    );
}