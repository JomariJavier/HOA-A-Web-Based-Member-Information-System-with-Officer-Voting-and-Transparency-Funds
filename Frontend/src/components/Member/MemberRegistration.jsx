import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const MemberRegistration = ({ member, isEdit, onCancel, onSuccess }) => {
    const { fetchWithAuth } = useAuth();
    const [formData, setFormData] = useState(member || {
        fullName: '',
        birthDate: '',
        hoaAddress: '',
        gender: 'Male',
        maritalStatus: 'Single',
        familyMembers: '',
        email: '',
        contactNumber: '',
        role: 'Member',
        status: 'Active'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = isEdit ? `http://localhost:8081/api/members/${member.id}` : 'http://localhost:8081/api/members';
        const method = isEdit ? 'PUT' : 'POST';

        try {
            const response = await fetchWithAuth(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert(isEdit ? "Member profile updated!" : "Member successfully registered!");
                onSuccess();
            } else {
                const err = await response.text();
                alert("Action failed: " + err);
            }
        } catch (error) {
            alert("Error: " + error.message);
        }
    };

    return (
        <div className="m3-directory animate-fade-in">
            <div className="m3-page-header">
                <button className="m3-icon-btn" onClick={onCancel}>←</button>
                <h2 className="m3-display-small">{isEdit ? 'Update Member Profile' : 'Register New Member'}</h2>
            </div>

            <div className="m3-card m3-elevated-card form-card">
                <form className="m3-form-grid" onSubmit={handleSubmit}>
                    <div className="m3-text-field m3-full-width">
                        <label className="m3-label-medium">Full Name</label>
                        <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required className="m3-input" />
                    </div>
                    <div className="m3-text-field">
                        <label className="m3-label-medium">Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required className="m3-input" />
                    </div>
                    <div className="m3-text-field">
                        <label className="m3-label-medium">Contact Number</label>
                        <input type="text" name="contactNumber" value={formData.contactNumber} onChange={handleChange} className="m3-input" />
                    </div>
                    <div className="m3-text-field">
                        <label className="m3-label-medium">HOA Address</label>
                        <input type="text" name="hoaAddress" value={formData.hoaAddress} onChange={handleChange} className="m3-input" />
                    </div>
                    <div className="m3-text-field">
                        <label className="m3-label-medium">Birthdate</label>
                        <input type="date" name="birthDate" value={formData.birthDate || ''} onChange={handleChange} className="m3-input" />
                    </div>
                    <div className="m3-text-field">
                        <label className="m3-label-medium">Community Role</label>
                        <select name="role" value={formData.role} onChange={handleChange} className="m3-input">
                            <option value="Member">Member</option>
                            <option value="Officer">Officer</option>
                        </select>
                    </div>
                    <div className="m3-text-field">
                        <label className="m3-label-medium">Marital Status</label>
                        <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} className="m3-input">
                            <option value="Single">Single</option>
                            <option value="Married">Married</option>
                            <option value="Widowed">Widowed</option>
                            <option value="Separated">Separated</option>
                        </select>
                    </div>
                    <div className="m3-text-field m3-full-width">
                        <label className="m3-label-medium">Family Members & Notes</label>
                        <textarea name="familyMembers" value={formData.familyMembers} onChange={handleChange} className="m3-input m3-textarea"></textarea>
                    </div>

                    <div className="m3-card-actions m3-full-width">
                        <button type="button" className="m3-text-btn" onClick={onCancel}>Cancel</button>
                        <button type="submit" className="m3-filled-btn">{isEdit ? 'Save Changes' : 'Register Member'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MemberRegistration;
