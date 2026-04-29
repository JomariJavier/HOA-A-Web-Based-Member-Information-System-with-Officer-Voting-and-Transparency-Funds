import React from 'react';
import './VotingRoom.css';

export default function ElectionManagement({ pollForm, onFormChange, onAddNominee, onRemoveNominee, onBack, onSubmit }) {
    
    // Wrapper for input changes to handle the complex structure
    const handleChange = (e, index = null, field = null) => {
        onFormChange(e, index, field);
    };

    return (
        <div className="m3-voting-directory subsystem-voting animate-fade-in">
            <div style={{display: 'flex', alignItems: 'center', marginBottom: '24px'}}>
                <button className="m3-icon-btn m3-on-surface-variant" onClick={onBack} aria-label="Back">
                    ←
                </button>
                <h1 className="m3-title-large" style={{margin: '0 0 0 16px'}}>Create New Election</h1>
            </div>

            <div className="m3-admin-form m3-elevated-card" style={{padding: '32px', borderTop: '4px solid var(--accent-voting)', background: 'var(--m3-surface)', borderRadius: '16px'}}>
                <form onSubmit={onSubmit}>
                    <div className="m3-form-section" style={{marginBottom: '40px'}}>
                        <h2 className="m3-title-medium" style={{color: 'var(--accent-voting)', marginBottom: '24px', borderBottom: '1px solid var(--m3-surface-variant)', paddingBottom: '8px'}}>Election Details</h2>
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
                            <span className="m3-supporting-text" style={{fontSize: '13px', color: 'var(--m3-on-surface-variant)', marginTop: '4px', display: 'block'}}>The official title of the position block being elected.</span>
                        </div>

                        <div className="m3-form-row" style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px'}}>
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
                        <div className="m3-section-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--m3-surface-variant)', paddingBottom: '8px'}}>
                            <h2 className="m3-title-medium" style={{color: 'var(--accent-voting)', margin: 0}}>Nominees</h2>
                            <span className={`m3-chip ${pollForm.nominees.length >= 5 ? 'm3-chip-outline' : 'm3-chip-primary'}`} style={{background: pollForm.nominees.length < 5 ? 'var(--accent-voting-container)' : 'transparent', color: pollForm.nominees.length < 5 ? 'var(--accent-voting)' : 'inherit', border: pollForm.nominees.length < 5 ? 'none' : '1px solid var(--m3-outline)'}}>
                                {pollForm.nominees.length}/5 Candidates
                            </span>
                        </div>
                        
                        <div className="m3-dynamic-list" style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
                            {pollForm.nominees.map((nominee, index) => (
                                <div key={index} className="m3-nominee-box" style={{display: 'flex', gap: '20px', background: 'var(--m3-surface-variant)', padding: '24px', borderRadius: '12px'}}>
                                    <div className="m3-avatar-circular" style={{width: '48px', height: '48px', borderRadius: '50%', background: 'var(--accent-voting)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 'bold', flexShrink: 0}}>
                                        {index + 1}
                                    </div>
                                    <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: '16px'}}>
                                        <div className="m3-text-field">
                                            <input 
                                                type="text" 
                                                placeholder="Candidate Full Name"
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
                                        style={{alignSelf: 'flex-start', background: 'white'}}
                                        title="Remove Nominee"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                        
                        {pollForm.nominees.length < 5 && (
                            <button type="button" className="m3-text-btn m3-add-nominee" onClick={onAddNominee} style={{marginTop: '24px', color: 'var(--accent-voting)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: 'var(--accent-voting-container)', borderRadius: '24px'}}>
                                <span style={{fontSize: '20px'}}>+</span> Add Another Nominee
                            </button>
                        )}
                    </div>
                    
                    <div className="m3-button-row m3-form-actions" style={{marginTop: '48px', paddingTop: '24px', borderTop: '1px solid var(--m3-surface-variant)', display: 'flex', justifyContent: 'flex-end', gap: '16px'}}>
                        <button type="button" className="m3-outlined-btn" onClick={onBack} style={{padding: '12px 24px'}}>
                            Cancel
                        </button>
                        <button type="submit" className="m3-filled-btn" style={{padding: '12px 32px', background: 'var(--accent-voting)', color: 'white'}}>
                            Create Election
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
