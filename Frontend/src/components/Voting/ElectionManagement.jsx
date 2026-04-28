import React from 'react';
import './VotingRoom.css';

export default function ElectionManagement({ pollForm, onFormChange, onAddNominee, onRemoveNominee, onBack, onSubmit }) {
    
    // Wrapper for input changes to handle the complex structure
    const handleChange = (e, index = null, field = null) => {
        onFormChange(e, index, field);
    };

    return (
        <div className="m3-voting-directory">
            <div className="m3-page-header">
                <button className="m3-icon-btn m3-on-surface-variant" onClick={onBack} aria-label="Back">
                    ←
                </button>
                <div>
                    <h1 className="m3-display-small">Create New Election</h1>
                    <p className="m3-body-large m3-on-surface-variant">Configure positions and nominees.</p>
                </div>
            </div>

            <div className="m3-admin-form">
                <form onSubmit={onSubmit}>
                    <div className="m3-form-section" style={{marginBottom: '40px'}}>
                        <h2 className="m3-title-large" style={{marginBottom: '24px'}}>Election Details</h2>
                        <div className="m3-text-field m3-full-width">
                            <label className="m3-label-medium">Position Title</label>
                            <input 
                                type="text" 
                                name="title" 
                                value={pollForm.title} 
                                onChange={handleChange} 
                                className="m3-input" 
                                placeholder="e.g. HOA President"
                                required 
                            />
                            <span className="m3-supporting-text">The official title of the position block being elected.</span>
                        </div>

                        <div className="m3-form-row">
                            <div className="m3-text-field">
                                <label className="m3-label-medium">Start Date & Time</label>
                                <input 
                                    type="datetime-local" 
                                    name="startDate" 
                                    value={pollForm.startDate} 
                                    onChange={handleChange} 
                                    className="m3-input" 
                                    required 
                                />
                            </div>
                            <div className="m3-text-field">
                                <label className="m3-label-medium">End Date & Time</label>
                                <input 
                                    type="datetime-local" 
                                    name="endDate" 
                                    value={pollForm.endDate} 
                                    onChange={handleChange} 
                                    className="m3-input" 
                                    required 
                                />
                            </div>
                        </div>
                    </div>

                    <div className="m3-nominee-section">
                        <div className="m3-section-header">
                            <h2 className="m3-title-large">Nominees</h2>
                            <span className={`m3-chip ${pollForm.nominees.length >= 5 ? 'm3-chip-outline' : 'm3-chip-primary'}`}>
                                {pollForm.nominees.length}/5 Candidates
                            </span>
                        </div>
                        
                        <div className="m3-dynamic-list">
                            {pollForm.nominees.map((nominee, index) => (
                                <div key={index} className="m3-nominee-box">
                                    <div className="m3-avatar-circular" style={{width: '40px', height: '40px', fontSize: '16px'}}>
                                        {index + 1}
                                    </div>
                                    <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: '12px'}}>
                                        <div className="m3-text-field">
                                            <input 
                                                type="text" 
                                                placeholder="Full Name"
                                                value={nominee.name} 
                                                onChange={(e) => handleChange(e, index, 'name')} 
                                                className="m3-input" 
                                                required 
                                            />
                                        </div>
                                        <div className="m3-text-field">
                                            <textarea 
                                                placeholder="Candidate Credentials / Platform (Max 150 chars)"
                                                value={nominee.credentials} 
                                                onChange={(e) => handleChange(e, index, 'credentials')} 
                                                className="m3-input m3-textarea" 
                                                maxLength={150}
                                                rows={2}
                                            />
                                        </div>
                                    </div>
                                    <button 
                                        type="button" 
                                        onClick={() => onRemoveNominee(index)}
                                        className="m3-icon-btn m3-error-text"
                                        disabled={pollForm.nominees.length === 1}
                                        style={{marginTop: '8px'}}
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                        
                        {pollForm.nominees.length < 5 && (
                            <button type="button" className="m3-text-btn m3-add-nominee" onClick={onAddNominee} style={{marginTop: '16px', color: 'var(--m3-primary)', fontWeight: '600'}}>
                                + Add Another Nominee
                            </button>
                        )}
                    </div>
                    
                    <div className="m3-button-row m3-form-actions" style={{marginTop: '48px', paddingTop: '24px', borderTop: '1px solid var(--m3-surface-variant)'}}>
                        <button type="button" className="m3-outlined-btn" onClick={onBack} style={{padding: '12px 24px'}}>
                            Cancel
                        </button>
                        <button type="submit" className="m3-filled-btn" style={{padding: '12px 32px', background: 'var(--m3-primary)', color: 'white', borderRadius: '12px', border: 'none', fontWeight: 'bold'}}>
                            Create Election
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
