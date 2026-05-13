import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const MemberProfile = ({ selectedMember, onBack, onEdit, onRefresh }) => {
    const { fetchWithAuth } = useAuth();
    if (!selectedMember) return null;

    const [confirmingStatus, setConfirmingStatus] = React.useState(false);
    const [confirmingDelete, setConfirmingDelete] = React.useState(false);

    const handleStatusToggle = async () => {
        if (!confirmingStatus) {
            setConfirmingStatus(true);
            setTimeout(() => setConfirmingStatus(false), 3000); // Reset after 3 seconds
            return;
        }

        const newStatus = selectedMember.status === 'Active' ? 'Inactive' : 'Active';
        console.log(`Executing status toggle to: ${newStatus} for ID: ${selectedMember.id}`);

        try {
            const response = await fetchWithAuth(`/api/members/${selectedMember.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...selectedMember, status: newStatus })
            });

            console.log("Status toggle response status:", response.status);

            if (response.ok) {
                alert(`Status updated to ${newStatus}`);
                onRefresh();
                onBack();
            } else {
                const errText = await response.text();
                console.error("Status toggle error:", errText);
                alert("Failed to update status. Server returned: " + response.status);
            }
        } catch (error) {
            console.error("Status toggle exception:", error);
            alert("Failed to update status: " + error.message);
        } finally {
            setConfirmingStatus(false);
        }
    };

    const handleDelete = async () => {
        if (!confirmingDelete) {
            setConfirmingDelete(true);
            setTimeout(() => setConfirmingDelete(false), 3000);
            return;
        }

        console.log(`Executing delete for ID: ${selectedMember.id}`);

        try {
            const response = await fetchWithAuth(`/api/members/${selectedMember.id}`, {
                method: 'DELETE'
            });

            console.log("Delete response status:", response.status);

            if (response.ok) {
                alert("Member soft-deleted (status set to Inactive)");
                onRefresh();
                onBack();
            } else {
                const errText = await response.text();
                console.error("Delete error:", errText);
                alert("Deletion failed. Server returned: " + response.status);
            }
        } catch (error) {
            console.error("Delete exception:", error);
            alert("Deletion failed: " + error.message);
        } finally {
            setConfirmingDelete(false);
        }
    };
    return (
        <div className="m3-directory animate-slide-up" style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div className="m3-card m3-elevated-card profile-card" style={{borderTop: '4px solid var(--accent-directory)', width: '100%' }}>
                <div className="m3-card-header profile-header" style={{padding: '24px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--m3-surface-variant)'}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '24px'}}>
                        <button 
                            className="m3-outlined-btn" 
                            onClick={() => { console.log("Back button clicked"); onBack(); }} 
                            style={{ padding: '12px 24px', fontSize: '16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}
                        >
                            ← Back to Directory
                        </button>
                        <div className="m3-profile-identity" style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
                            <div className="m3-avatar m3-avatar-large" style={{width: '80px', height: '80px', borderRadius: '50%', background: 'var(--accent-directory-container)', color: 'var(--accent-directory-on-container)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '32px'}}>
                                {selectedMember.fullName.charAt(0)}
                            </div>
                            <div className="m3-profile-titles">
                                <h3 className="m3-display-small" style={{margin: 0}}>{selectedMember.fullName}</h3>
                                <div className="m3-profile-badges" style={{marginTop: '8px', display: 'flex', gap: '12px', alignItems: 'center'}}>
                                    <span className={`m3-role-chip ${selectedMember.role === 'Officer' ? 'm3-role-officer' : 'm3-role-member'}`} style={{ padding: '4px 12px', fontSize: '14px' }}>
                                        {selectedMember.role}
                                    </span>
                                    <span className={`m3-status-indicator ${selectedMember.status === 'Active' ? 'm3-status-active' : 'm3-status-inactive'}`} style={{ fontWeight: 'bold', fontSize: '14px' }}>
                                        <span className="m3-status-dot"></span>
                                        {selectedMember.status.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="m3-card-content m3-details-grid" style={{ padding: '40px 32px', gap: '32px' }}>
                    <div className="m3-detail-item">
                        <span className="m3-label-medium" style={{ color: 'var(--accent-directory)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            📧 Email Address
                        </span>
                        <span className="m3-display-small" style={{ fontSize: '24px', marginTop: '8px', display: 'block' }}>{selectedMember.email || 'Not Provided'}</span>
                    </div>
                    <div className="m3-detail-item">
                        <span className="m3-label-medium" style={{ color: 'var(--accent-directory)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            📞 Primary Contact
                        </span>
                        <span className="m3-display-small" style={{ fontSize: '24px', marginTop: '8px', display: 'block' }}>{selectedMember.contactNumber || 'Not Provided'}</span>
                    </div>
                    <div className="m3-detail-item">
                        <span className="m3-label-medium" style={{ color: 'var(--accent-directory)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            🏠 HOA Property Address
                        </span>
                        <span className="m3-display-small" style={{ fontSize: '24px', marginTop: '8px', display: 'block' }}>{selectedMember.hoaAddress || 'Not Assigned'}</span>
                    </div>
                    <div className="m3-detail-item">
                        <span className="m3-label-medium" style={{ color: 'var(--m3-on-surface-variant)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            🎂 Birth Date
                        </span>
                        <span className="m3-title-large" style={{ fontSize: '20px', marginTop: '8px', display: 'block' }}>{selectedMember.birthDate || '—'}</span>
                    </div>
                    <div className="m3-detail-item">
                        <span className="m3-label-medium" style={{ color: 'var(--m3-on-surface-variant)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            🚻 Gender
                        </span>
                        <span className="m3-title-large" style={{ fontSize: '20px', marginTop: '8px', display: 'block' }}>{selectedMember.gender || '—'}</span>
                    </div>
                    <div className="m3-detail-item">
                        <span className="m3-label-medium" style={{ color: 'var(--m3-on-surface-variant)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            💍 Marital Status
                        </span>
                        <span className="m3-title-large" style={{ fontSize: '20px', marginTop: '8px', display: 'block' }}>{selectedMember.maritalStatus || '—'}</span>
                    </div>
                    <div className="m3-detail-item m3-full-width" style={{ background: 'var(--m3-surface-variant)', padding: '32px', borderRadius: '16px' }}>
                        <span className="m3-label-large" style={{ fontWeight: 'bold', fontSize: '16px', color: 'var(--m3-on-surface-variant)' }}>👨‍👩‍👧‍👦 Family Composition & Secondary Residents</span>
                        <p className="m3-body-large" style={{ marginTop: '16px', fontSize: '18px', lineHeight: '1.6' }}>{selectedMember.familyMembers || 'No secondary residents or additional notes listed for this household.'}</p>
                    </div>
                </div>

                <div className="m3-card-actions" style={{ padding: '32px', background: 'var(--m3-surface-variant)', gap: '16px' }}>
                    <button className="m3-filled-btn" onClick={() => { console.log("Edit clicked"); onEdit(); }} style={{ padding: '16px 32px', fontSize: '16px' }}>
                        ✏️ Edit Profile
                    </button>
                    <button 
                        className={`m3-tonal-btn ${confirmingStatus ? 'm3-chip-selected' : ''}`} 
                        onClick={() => { console.log("Status toggle clicked"); handleStatusToggle(); }} 
                        style={{ padding: '16px 32px', fontSize: '16px' }}
                    >
                        {confirmingStatus ? '⚠️ Confirm Status Change?' : (selectedMember.status === 'Active' ? '⏸ Set as Inactive' : '▶️ Set as Active')}
                    </button>
                    <div style={{ marginLeft: 'auto' }}>
                        <button 
                            className={`m3-error-btn ${confirmingDelete ? 'm3-filled-btn' : ''}`} 
                            onClick={() => { console.log("Delete clicked"); handleDelete(); }} 
                            style={{ padding: '16px 32px', fontSize: '16px', background: confirmingDelete ? 'var(--m3-error)' : '', color: confirmingDelete ? 'white' : '' }}
                        >
                            {confirmingDelete ? '❗ Confirm Soft-Delete?' : '🗑️ Delete Member'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MemberProfile;
