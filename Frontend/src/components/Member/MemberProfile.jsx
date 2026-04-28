import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const MemberProfile = ({ selectedMember, onBack, onEdit, onRefresh }) => {
    const { fetchWithAuth } = useAuth();
    if (!selectedMember) return null;

    const handleStatusToggle = async () => {
        const newStatus = selectedMember.status === 'Active' ? 'Inactive' : 'Active';
        if (!window.confirm(`Are you sure you want to set status to ${newStatus}?`)) return;

        try {
            const response = await fetchWithAuth(`http://localhost:8081/api/members/${selectedMember.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...selectedMember, status: newStatus })
            });

            if (response.ok) {
                alert(`Status updated to ${newStatus}`);
                onRefresh();
                onBack();
            }
        } catch (error) {
            alert("Failed to update status: " + error.message);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to soft-delete this member?")) return;

        try {
            const response = await fetchWithAuth(`http://localhost:8081/api/members/${selectedMember.id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                alert("Member soft-deleted (status set to Inactive)");
                onRefresh();
                onBack();
            }
        } catch (error) {
            alert("Deletion failed: " + error.message);
        }
    };

    return (
        <div className="m3-directory animate-slide-up">
            <div className="m3-page-header">
                <button className="m3-icon-btn" onClick={onBack}>←</button>
                <h2 className="m3-display-small">Member Profile</h2>
            </div>

            <div className="m3-card m3-elevated-card profile-card">
                <div className="m3-card-header profile-header">
                    <div className="m3-profile-identity">
                        <div className="m3-avatar m3-avatar-large">
                            {selectedMember.fullName.charAt(0)}
                        </div>
                        <div className="m3-profile-titles">
                            <h3 className="m3-title-large">{selectedMember.fullName}</h3>
                            <div className="m3-profile-badges">
                                <span className={`m3-role-chip ${selectedMember.role === 'Officer' ? 'm3-role-officer' : 'm3-role-member'}`}>
                                    {selectedMember.role}
                                </span>
                                <span className={`m3-status-indicator ${selectedMember.status === 'Active' ? 'm3-status-active' : 'm3-status-inactive'}`}>
                                    {selectedMember.status}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="m3-card-content m3-details-grid">
                    <div className="m3-detail-item">
                        <span className="m3-label-small">Email</span>
                        <span className="m3-body-large">{selectedMember.email || 'Not Provided'}</span>
                    </div>
                    <div className="m3-detail-item">
                        <span className="m3-label-small">Contact Number</span>
                        <span className="m3-body-large">{selectedMember.contactNumber || 'Not Provided'}</span>
                    </div>
                    <div className="m3-detail-item">
                        <span className="m3-label-small">HOA Address</span>
                        <span className="m3-body-large">{selectedMember.hoaAddress || 'Not Assigned'}</span>
                    </div>
                    <div className="m3-detail-item">
                        <span className="m3-label-small">Birth Date</span>
                        <span className="m3-body-large">{selectedMember.birthDate || '—'}</span>
                    </div>
                    <div className="m3-detail-item">
                        <span className="m3-label-small">Gender</span>
                        <span className="m3-body-large">{selectedMember.gender || '—'}</span>
                    </div>
                    <div className="m3-detail-item">
                        <span className="m3-label-small">Marital Status</span>
                        <span className="m3-body-large">{selectedMember.maritalStatus || '—'}</span>
                    </div>
                    <div className="m3-detail-item m3-full-width">
                        <span className="m3-label-small">Family Composition</span>
                        <p className="m3-body-medium">{selectedMember.familyMembers || 'No secondary residents listed.'}</p>
                    </div>
                </div>

                <div className="m3-card-actions">
                    <button className="m3-filled-btn" onClick={onEdit}>Edit Profile</button>
                    <button className="m3-outlined-btn" onClick={handleStatusToggle}>
                        {selectedMember.status === 'Active' ? 'Deactivate' : 'Reactivate'}
                    </button>
                    <button className="m3-text-btn m3-error-text" onClick={handleDelete}>Soft Delete</button>
                </div>
            </div>
        </div>
    );
};

export default MemberProfile;
