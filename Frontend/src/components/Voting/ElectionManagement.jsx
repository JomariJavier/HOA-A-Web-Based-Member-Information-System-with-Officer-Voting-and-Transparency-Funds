import React from 'react';
import './VotingRoom.css';

export default function ElectionManagement({ pollForm, onFormChange, onAddNominee, onRemoveNominee, onBack, onSubmit }) {
    
    // Wrapper for input changes to handle the complex structure
    const handleChange = (e, index = null, field = null) => {
        onFormChange(e, index, field);
    };

    return (
        <div className="m3-voting-directory subsystem-voting animate-fade-in">
            
            <div className="admin-workspace-card">
                <div style={{display: 'flex', alignItems: 'center', marginBottom: '40px'}}>
                    <button className="m3-text-btn" onClick={onBack} style={{paddingLeft: 0, color: 'var(--voting-primary)'}}>
                        ← Back to Elections
                    </button>
                    <h1 className="m3-display-small" style={{margin: '0 0 0 24px'}}>Create New Election</h1>
                </div>

                <form onSubmit={onSubmit}>
                    <div className="m3-form-section" style={{marginBottom: '48px'}}>
                        <h2 className="m3-title-medium" style={{color: 'var(--voting-primary)', marginBottom: '24px', borderBottom: '1px solid var(--m3-surface-variant)', paddingBottom: '12px'}}>
                            Step 1: Election Details
                        </h2>
                        
                        <div className="m3-text-field m3-full-width">
                            <label className="m3-label-medium">Official Position Title</label>
                            <input 
                                type="text" 
                                name="title" 
                                value={pollForm.title} 
                                onChange={handleChange} 
                                className="m3-input" 
                                style={{borderRadius: '16px', padding: '16px'}}
                                placeholder="e.g. HOA Board Director"
                                required 
                            />
                        </div>

                        <div className="m3-form-row" style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '24px'}}>
                            <div className="m3-text-field">
                                <label className="m3-label-medium">Voting Starts</label>
                                <input 
                                    type="datetime-local" 
                                    name="startDate" 
                                    value={pollForm.startDate} 
                                    onChange={handleChange} 
                                    className="m3-input" 
                                    style={{borderRadius: '16px'}}
                                    required 
                                />
                            </div>
                            <div className="m3-text-field">
                                <label className="m3-label-medium">Voting Ends</label>
                                <input 
                                    type="datetime-local" 
                                    name="endDate" 
                                    value={pollForm.endDate} 
                                    onChange={handleChange} 
                                    className="m3-input" 
                                    style={{borderRadius: '16px'}}
                                    required 
                                />
                            </div>
                        </div>
                    </div>

                    <div className="m3-nominee-section">
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}}>
                            <h2 className="m3-title-medium" style={{color: 'var(--voting-primary)', margin: 0}}>
                                Step 2: Nominees & Candidates
                            </h2>
                            <span className="status-pill live" style={{background: 'var(--voting-container)', color: 'var(--voting-primary)'}}>
                                {pollForm.nominees.length}/5 Registered
                            </span>
                        </div>
                        
                        <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
                            {pollForm.nominees.map((nominee, index) => (
                                <div key={index} className="nominee-row" style={{boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'}}>
                                    <div className="m3-text-field">
                                        <label className="m3-label-small">Full Name</label>
                                        <input 
                                            type="text" 
                                            placeholder="John Doe"
                                            value={nominee.name} 
                                            onChange={(e) => handleChange(e, index, 'name')} 
                                            className="m3-input" 
                                            style={{background: 'white'}}
                                            required 
                                        />
                                    </div>
                                    <div className="m3-text-field">
                                        <label className="m3-label-small">Credentials & Bio</label>
                                        <input 
                                            type="text" 
                                            placeholder="10 years in management..."
                                            value={nominee.credentials} 
                                            onChange={(e) => handleChange(e, index, 'credentials')} 
                                            className="m3-input" 
                                            style={{background: 'white'}}
                                        />
                                    </div>
                                    <button 
                                        type="button" 
                                        onClick={() => onRemoveNominee(index)}
                                        className="m3-icon-btn"
                                        disabled={pollForm.nominees.length === 1}
                                        style={{color: 'var(--m3-error)', background: 'white', border: '1px solid var(--m3-surface-variant)'}}
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                        
                        {pollForm.nominees.length < 5 && (
                            <button 
                                type="button" 
                                className="m3-outlined-btn" 
                                onClick={onAddNominee} 
                                style={{marginTop: '24px', borderRadius: '16px', padding: '16px 32px', borderStyle: 'dashed', width: '100%'}}
                            >
                                + Add Nominee
                            </button>
                        )}
                    </div>
                    
                    <div style={{marginTop: '64px', display: 'flex', justifyContent: 'flex-end', gap: '16px'}}>
                        <button type="button" className="m3-text-btn" onClick={onBack} style={{padding: '16px 32px'}}>
                            Discard Draft
                        </button>
                        <button type="submit" className="m3-filled-btn" style={{padding: '16px 48px', borderRadius: '24px', background: 'var(--voting-primary)', boxShadow: '0 8px 24px rgba(81, 45, 168, 0.2)'}}>
                            Launch Election
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
