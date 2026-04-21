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
                    <h2 className="m3-display-small">Create New Poll</h2>
                    <p className="m3-body-large m3-on-surface-variant">Setup election details and nominate candidates.</p>
                </div>
            </div>

            <form onSubmit={onSubmit} className="m3-segmented-form">
                {/* SECTION 1: ELECTION DETAILS */}
                <div className="m3-form-section m3-elevated-card">
                    <div className="m3-section-header-pill">
                        <h3 className="m3-title-medium">1. Election Fundamentals</h3>
                    </div>
                    
                    <div className="m3-card-content">
                        <div className="m3-text-field m3-full-width">
                            <label className="m3-label-medium">Position Title</label>
                            <input 
                                type="text" 
                                name="title" 
                                value={pollForm.title} 
                                onChange={handleChange} 
                                className="m3-input" 
                                placeholder="e.g., Association President"
                                required 
                            />
                            <span className="m3-supporting-text">The official name of the role being elected.</span>
                        </div>

                        <div className="m3-text-field m3-full-width" style={{marginTop: '20px'}}>
                            <label className="m3-label-medium">Election Purpose / Description</label>
                            <textarea 
                                name="description" 
                                value={pollForm.description} 
                                onChange={handleChange} 
                                className="m3-input m3-textarea" 
                                placeholder="Explain why this election is being held..."
                                style={{height: '100px'}}
                            />
                            <span className="m3-supporting-text">Provide context to homeowners about the importance of this vote.</span>
                        </div>

                        <div className="m3-form-row">
                            <div className="m3-text-field">
                                <label className="m3-label-medium">Voting Starts</label>
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
                                <label className="m3-label-medium">Voting Closes</label>
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
                </div>

                {/* SECTION 2: NOMINEES */}
                <div className="m3-form-section m3-elevated-card" style={{marginTop: '24px'}}>
                    <div className="m3-section-header-pill">
                        <h3 className="m3-title-medium">2. Nominee Management</h3>
                    </div>

                    <div className="m3-card-content">
                        <div className="m3-dynamic-nominee-list">
                            {pollForm.nominees.map((nominee, index) => (
                                <div key={index} className="m3-nominee-entry-box">
                                    <div className="m3-nominee-header">
                                        <span className="m3-label-large">Candidate #{index + 1}</span>
                                        {pollForm.nominees.length > 2 && (
                                            <button 
                                                type="button" 
                                                onClick={() => onRemoveNominee(index)}
                                                className="m3-icon-btn m3-error-text"
                                                title="Remove Nominee"
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                    <div className="m3-nominee-fields">
                                        <div className="m3-text-field">
                                            <label className="m3-label-small">Full Name</label>
                                            <input 
                                                type="text" 
                                                value={nominee.name} 
                                                onChange={(e) => handleChange(e, index, 'name')} 
                                                className="m3-input" 
                                                required 
                                            />
                                        </div>
                                        <div className="m3-text-field">
                                            <label className="m3-label-small">Short Bio / Credentials</label>
                                            <input 
                                                type="text" 
                                                value={nominee.credentials} 
                                                onChange={(e) => handleChange(e, index, 'credentials')} 
                                                className="m3-input" 
                                                maxLength={150}
                                                placeholder="Max 150 characters..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {pollForm.nominees.length < 5 && (
                            <button type="button" className="m3-text-btn" style={{marginTop: '16px'}} onClick={onAddNominee}>
                                + Add Nominee ({5 - pollForm.nominees.length} slots left)
                            </button>
                        )}
                    </div>
                </div>
                
                <div className="m3-form-actions-footer">
                    <button type="button" className="m3-text-btn-large" onClick={onBack}>
                        Cancel
                    </button>
                    <button type="submit" className="m3-filled-btn-large">
                        Confirm & Launch Poll
                    </button>
                </div>
            </form>
        </div>
    );
}
