import React from 'react';

export default function MemberRegistration({ newMember, handleChange, onSubmit, onCancel }) {
    return (
        <div className="m3-directory">
            <div className="m3-page-header">
                <button className="m3-icon-btn m3-on-surface-variant" onClick={onCancel} aria-label="Back">
                    ←
                </button>
                <div>
                    <h2 className="m3-display-small">New Member Registration</h2>
                    <p className="m3-body-medium m3-on-surface-variant">Add a new homeowner to the association</p>
                </div>
            </div>

            <div className="m3-registration-card">
                <form onSubmit={onSubmit}>
                    
                    {/* Section 1: Personal Details */}
                    <div className="m3-form-section">
                        <h3 className="m3-title-large">1. Personal Details</h3>
                        <div className="m3-input-group">
                            <label className="m3-form-label">Full Name</label>
                            <input type="text" name="fullName" value={newMember.fullName} onChange={handleChange} required className="m3-large-input" placeholder="e.g., Juan Dela Cruz" />
                            <span className="m3-supporting-text">Enter the legal name as it appears on official IDs.</span>
                        </div>

                        <div className="m3-input-row">
                            <div className="m3-input-group" style={{flex: 1}}>
                                <label className="m3-form-label">Birthdate</label>
                                <input type="date" name="birthDate" value={newMember.birthDate} onChange={handleChange} className="m3-large-input" />
                                <span className="m3-supporting-text">For age verification purposes.</span>
                            </div>
                            <div className="m3-input-group" style={{flex: 1}}>
                                <label className="m3-form-label">Gender</label>
                                <select name="gender" value={newMember.gender} onChange={handleChange} className="m3-large-input m3-large-select">
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>
                            <div className="m3-input-group" style={{flex: 1}}>
                                <label className="m3-form-label">Marital Status</label>
                                <select name="maritalStatus" value={newMember.maritalStatus} onChange={handleChange} className="m3-large-input m3-large-select">
                                    <option value="Single">Single</option>
                                    <option value="Married">Married</option>
                                    <option value="Widowed">Widowed</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Residency Details */}
                    <div className="m3-form-section">
                        <h3 className="m3-title-large">2. Residency Details</h3>
                        <div className="m3-input-group">
                            <label className="m3-form-label">HOA Address (Block & Lot)</label>
                            <input type="text" name="hoaAddress" value={newMember.hoaAddress} onChange={handleChange} className="m3-large-input" placeholder="e.g., Block 3 Lot 15" />
                            <span className="m3-supporting-text">The official residential address inside the subdivision.</span>
                        </div>
                        <div className="m3-input-group">
                            <label className="m3-form-label">Family Members (Optional)</label>
                            <textarea name="familyMembers" value={newMember.familyMembers} onChange={handleChange} className="m3-large-input m3-large-textarea" placeholder="List other names living in the same household..."></textarea>
                            <span className="m3-supporting-text">List dependents or spouse names for gate security clearance.</span>
                        </div>
                    </div>
                    
                    <div className="m3-registration-actions">
                        <button type="button" className="m3-text-btn-large" onClick={onCancel}>Cancel Registration</button>
                        <button type="submit" className="m3-filled-btn-large">Register Member</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
