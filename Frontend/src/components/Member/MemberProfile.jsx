import React from 'react';

export default function MemberProfile({ selectedMember, onBack }) {
    if (!selectedMember) return null;

    return (
        <div className="m3-directory">
            <div className="m3-page-header">
                <button className="m3-icon-btn m3-on-surface-variant" onClick={onBack} aria-label="Back">
                    ←
                </button>
                <div>
                    <h2 className="m3-display-small">Member Profile</h2>
                </div>
            </div>

            <div className="m3-card m3-elevated-card">
                <div className="m3-card-header">
                    <div className="m3-avatar m3-avatar-large">
                        <svg xmlns="http://www.w3.org/2000/svg" height="32" viewBox="0 96 960 960" width="32" fill="currentColor">
                            <path d="M480 576q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM192 896v-57q0-38 18.5-70t50.5-50q51-29 108.5-44T480 660q61 0 119 15t108 44q32 18 50.5 50t18.5 70v57H192Z"/>
                        </svg>
                    </div>
                    <div>
                        <h2 className="m3-title-large">{selectedMember.fullName}</h2>
                        <span className={`m3-role-chip ${selectedMember.role === 'Officer' ? 'm3-role-officer' : 'm3-role-member'}`}>
                            {selectedMember.role}
                        </span>
                    </div>
                </div>
                
                <div className="m3-card-content m3-details-grid">
                    <div className="m3-detail-item">
                        <span className="m3-label-small m3-on-surface-variant">Member ID</span>
                        <span className="m3-body-large">{selectedMember.id}</span>
                    </div>
                    <div className="m3-detail-item">
                        <span className="m3-label-small m3-on-surface-variant">HOA Address</span>
                        <span className="m3-body-large">{selectedMember.hoaAddress || '—'}</span>
                    </div>
                    <div className="m3-detail-item">
                        <span className="m3-label-small m3-on-surface-variant">Date Registered</span>
                        <span className="m3-body-large">{selectedMember.dateRegistered}</span>
                    </div>
                    <div className="m3-detail-item">
                        <span className="m3-label-small m3-on-surface-variant">Status</span>
                        <span className={`m3-status-indicator ${selectedMember.status === 'Active' ? 'm3-status-active' : 'm3-status-inactive'}`}>
                            <span className="m3-status-dot"></span>{selectedMember.status}
                        </span>
                    </div>
                    <div className="m3-detail-item">
                        <span className="m3-label-small m3-on-surface-variant">Birthdate</span>
                        <span className="m3-body-large">{selectedMember.birthDate || '—'}</span>
                    </div>
                    <div className="m3-detail-item">
                        <span className="m3-label-small m3-on-surface-variant">Marital Status</span>
                        <span className="m3-body-large">{selectedMember.maritalStatus}</span>
                    </div>
                    <div className="m3-detail-item m3-full-width">
                        <span className="m3-label-small m3-on-surface-variant">Family Members</span>
                        <div className="m3-info-box m3-body-medium">
                            {selectedMember.familyMembers || 'No family members listed.'}
                        </div>
                    </div>
                </div>

                <div className="m3-card-actions">
                    <button className="m3-filled-btn">Edit Profile</button>
                    <button className="m3-outlined-btn m3-error-text">Deactivate</button>
                </div>
            </div>
        </div>
    );
}
