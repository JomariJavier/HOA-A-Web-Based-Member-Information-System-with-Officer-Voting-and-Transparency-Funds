import { useState, useEffect } from 'react';
import './MemberList.css';
import MemberDirectory from './MemberDirectory';
import MemberProfile from './MemberProfile';
import MemberRegistration from './MemberRegistration';

export default function MemberList({ isAdmin, setIsAdmin }) {
    // --- STATE MANAGEMENT ---
    const [view, setView] = useState('list'); // 'list', 'info', 'registration'
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
        setNewMember(prev => ({ ...prev, [name]: value }));
    };
    
    // Fetch members from backend
    useEffect(() => {
        fetch('http://localhost:8080/api/members')
            .then(res => res.json())
            .then(data => setMembers(data))
            .catch(err => console.error("Error fetching members:", err));
    }, [view]);

    // Registration submit logic
    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/api/members', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newMember)
            });
            if(response.ok) {
                alert("Member successfully registered!");
                setNewMember({
                    fullName: '',
                    birthDate: '',
                    hoaAddress: '',
                    gender: 'Male',
                    maritalStatus: 'Single',
                    familyMembers: '',
                    role: 'Member'
                });
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

    // If somehow entered but not admin, show Access Denied
    if (!isAdmin) {
        return (
            <div className="m3-content-wrapper">
                <div className="m3-empty-state" style={{ padding: '80px 0' }}>
                    <div style={{ fontSize: '64px', marginBottom: '16px', opacity: 0.5 }}>🔒</div>
                    <h2 className="m3-display-small">Access Denied</h2>
                    <p className="m3-body-large m3-on-surface-variant">
                        The Personal Information System is restricted to authorized HOA Officers only.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <section className="m3-content-wrapper">
            {/* Universal Header with Admin Sandbox Toggle */}
            <header className="pis-header">
                <div>
                    <h1 className="m3-display-small">HOA Personal Information</h1>
                    <p className="m3-body-medium m3-on-surface-variant">
                        Manage member records, residency details, and roles within the association.
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

            {/* View Orchestration */}
            <main>
                {view === 'list' && (
                    <MemberDirectory 
                        members={members}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        filterRole={filterRole}
                        setFilterRole={setFilterRole}
                        onAddMember={() => setView('registration')}
                        onViewDetails={handleViewDetails}
                    />
                )}
                
                {view === 'info' && (
                    <MemberProfile 
                        selectedMember={selectedMember} 
                        onBack={() => setView('list')} 
                    />
                )}

                {view === 'registration' && (
                    <MemberRegistration 
                        newMember={newMember}
                        handleChange={handleChange}
                        onSubmit={handleRegisterSubmit}
                        onCancel={() => setView('list')}
                    />
                )}
            </main>
        </section>
    );
}