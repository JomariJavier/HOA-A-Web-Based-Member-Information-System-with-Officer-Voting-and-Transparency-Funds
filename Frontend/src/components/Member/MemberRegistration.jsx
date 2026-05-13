import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const MemberRegistration = ({ member, isEdit, onCancel, onSuccess }) => {
    const { fetchWithAuth } = useAuth();
    const [formData, setFormData] = useState({
        fullName: member?.fullName || '',
        email: member?.email || '',
        contactNumber: member?.contactNumber || '',
        hoaAddress: member?.hoaAddress || '',
        birthDate: member?.birthDate || '',
        gender: member?.gender || 'Male',
        role: member?.role || 'Member',
        maritalStatus: member?.maritalStatus || 'Single',
        familyMembers: member?.familyMembers || '',
        status: member?.status || 'Active'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = isEdit ? `/api/members/${member.id}` : '/api/members';
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
        <div className="m3-directory animate-fade-in" style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div className="m3-card m3-elevated-card form-card" style={{borderTop: '4px solid var(--accent-directory)', width: '100%' }}>
                <div className="m3-card-header" style={{padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid var(--m3-surface-variant)'}}>
                    <button className="m3-outlined-btn" onClick={onCancel} style={{padding: '8px 16px'}}>← Back</button>
                    <h2 className="m3-title-large" style={{margin: 0}}>{isEdit ? 'Update Member Profile' : 'Register New Member'}</h2>
                </div>
                <form className="m3-form-grid" onSubmit={handleSubmit} style={{padding: '32px', gap: '24px'}}>
                    <div className="m3-text-field m3-full-width">
                        <label className="m3-label-large" style={{ fontWeight: 'bold', marginBottom: '8px', display: 'block' }}>Full Name of Resident</label>
                        <input 
                            type="text" 
                            name="fullName" 
                            value={formData.fullName} 
                            onChange={handleChange} 
                            required 
                            className="m3-input" 
                            style={{ height: '56px', fontSize: '18px', padding: '0 16px' }}
                            placeholder="Firstname Lastname"
                        />
                    </div>
                    <div className="m3-text-field">
                        <label className="m3-label-large" style={{ fontWeight: 'bold', marginBottom: '8px', display: 'block' }}>Email Address</label>
                        <input 
                            type="email" 
                            name="email" 
                            value={formData.email} 
                            onChange={handleChange} 
                            required 
                            className="m3-input" 
                            style={{ height: '56px', fontSize: '18px', padding: '0 16px' }}
                            placeholder="example@email.com"
                        />
                    </div>
                    <div className="m3-text-field">
                        <label className="m3-label-large" style={{ fontWeight: 'bold', marginBottom: '8px', display: 'block' }}>Contact Number</label>
                        <input 
                            type="text" 
                            name="contactNumber" 
                            value={formData.contactNumber} 
                            onChange={handleChange} 
                            className="m3-input" 
                            style={{ height: '56px', fontSize: '18px', padding: '0 16px' }}
                            placeholder="+63 9xx xxx xxxx"
                        />
                    </div>
                    <div className="m3-text-field">
                        <label className="m3-label-large" style={{ fontWeight: 'bold', marginBottom: '8px', display: 'block' }}>HOA Address / Location</label>
                        <input 
                            type="text" 
                            name="hoaAddress" 
                            value={formData.hoaAddress} 
                            onChange={handleChange} 
                            className="m3-input" 
                            style={{ height: '56px', fontSize: '18px', padding: '0 16px' }}
                            placeholder="Block #, Lot #"
                        />
                    </div>
                    <div className="m3-text-field">
                        <label className="m3-label-large" style={{ fontWeight: 'bold', marginBottom: '8px', display: 'block' }}>Birthdate</label>
                        <input 
                            type="date" 
                            name="birthDate" 
                            value={formData.birthDate || ''} 
                            onChange={handleChange} 
                            className="m3-input" 
                            style={{ height: '56px', fontSize: '18px', padding: '0 16px' }}
                        />
                    </div>
                    <div className="m3-text-field">
                        <label className="m3-label-large" style={{ fontWeight: 'bold', marginBottom: '8px', display: 'block' }}>Community Role</label>
                        <select 
                            name="role" 
                            value={formData.role} 
                            onChange={handleChange} 
                            className="m3-input"
                            style={{ height: '56px', fontSize: '18px', padding: '0 16px' }}
                        >
                            <option value="Member">Regular Member</option>
                            <option value="Officer">Board Officer</option>
                        </select>
                    </div>
                    <div className="m3-text-field">
                        <label className="m3-label-large" style={{ fontWeight: 'bold', marginBottom: '8px', display: 'block' }}>Marital Status</label>
                        <select 
                            name="maritalStatus" 
                            value={formData.maritalStatus} 
                            onChange={handleChange} 
                            className="m3-input"
                            style={{ height: '56px', fontSize: '18px', padding: '0 16px' }}
                        >
                            <option value="Single">Single</option>
                            <option value="Married">Married</option>
                            <option value="Widowed">Widowed</option>
                            <option value="Separated">Separated</option>
                        </select>
                    </div>
                    <div className="m3-text-field m3-full-width">
                        <label className="m3-label-large" style={{ fontWeight: 'bold', marginBottom: '8px', display: 'block' }}>Family Members & Additional Notes</label>
                        <textarea 
                            name="familyMembers" 
                            value={formData.familyMembers} 
                            onChange={handleChange} 
                            className="m3-input m3-textarea"
                            style={{ padding: '16px', fontSize: '18px', minHeight: '120px' }}
                            placeholder="List names of other residents in this household or any special remarks..."
                        ></textarea>
                    </div>

                    <div className="m3-card-actions m3-full-width" style={{ marginTop: '16px', gap: '16px' }}>
                        <button type="button" className="m3-text-btn" onClick={onCancel} style={{ fontSize: '16px', fontWeight: 'bold' }}>Discard & Exit</button>
                        <button type="submit" className="m3-filled-btn" style={{ padding: '14px 48px', fontSize: '18px', fontWeight: 'bold' }}>
                            {isEdit ? 'Update Record' : 'Register Member'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MemberRegistration;
