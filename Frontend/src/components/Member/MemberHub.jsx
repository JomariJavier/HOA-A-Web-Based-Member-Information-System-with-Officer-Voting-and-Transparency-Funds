import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import MemberDirectory from './MemberDirectory';
import MemberProfile from './MemberProfile';
import MemberRegistration from './MemberRegistration';
import './MemberHub.css';

const MemberHub = () => {
    const { fetchWithAuth } = useAuth();
    const [view, setView] = useState('list'); // 'list', 'info', 'registration', 'edit'
    const [members, setMembers] = useState([]);
    const [selectedMember, setSelectedMember] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchMembers = async () => {
        setLoading(true);
        try {
            const response = await fetchWithAuth('http://localhost:8081/api/members');
            if (response.ok) {
                const data = await response.json();
                setMembers(data);
            }
        } catch (error) {
            console.error("Error fetching members:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMembers();
    }, [view]);

    const handleViewDetails = (member) => {
        setSelectedMember(member);
        setView('info');
    };

    const handleEdit = (member) => {
        setSelectedMember(member);
        setView('edit');
    };

    return (
        <section className="m3-content-wrapper">
            <header className="pis-header">
                <div>
                    <h1 className="m3-display-small">HOA Personal Information</h1>
                    <p className="m3-body-medium m3-on-surface-variant">
                        Manage member records, residency details, and roles within the association.
                    </p>
                </div>
            </header>

            <main>
                {loading && view === 'list' ? (
                    <div className="m3-loading">Loading members...</div>
                ) : (
                    <>
                        {view === 'list' && (
                            <MemberDirectory 
                                members={members}
                                onAddMember={() => setView('registration')}
                                onViewDetails={handleViewDetails}
                            />
                        )}
                        
                        {view === 'info' && (
                            <MemberProfile 
                                selectedMember={selectedMember} 
                                onBack={() => setView('list')}
                                onEdit={() => setView('edit')}
                                onRefresh={fetchMembers}
                            />
                        )}

                        {(view === 'registration' || view === 'edit') && (
                            <MemberRegistration 
                                member={view === 'edit' ? selectedMember : null}
                                isEdit={view === 'edit'}
                                onCancel={() => setView(view === 'edit' ? 'info' : 'list')}
                                onSuccess={() => setView('list')}
                            />
                        )}
                    </>
                )}
            </main>
        </section>
    );
};

export default MemberHub;
