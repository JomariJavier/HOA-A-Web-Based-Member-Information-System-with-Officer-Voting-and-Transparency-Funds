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
                    <h1 className="m3-display-small">Create New Poll</h1>
                    <p className="m3-body-large m3-on-surface-variant">Administrative Workspace</p>
                </div>
            </div>

            <div className="m3-surface-container-high m3-admin-form">
                <form onSubmit={onSubmit}>
                    <div className="m3-text-field m3-full-width">
                        <label className="m3-label-medium">Election for Position</label>
                        <input 
                            type="text" 
                            name="title" 
                            value={pollForm.title} 
                            onChange={handleChange} 
                            className="m3-input" 
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

                    <div className="m3-nominee-section">
                        <div className="m3-section-header">
                            <h2 className="m3-title-large">Nominees</h2>
                            <span className="m3-supporting-text m3-limit-text">
                                {pollForm.nominees.length >= 5 ? 'Maximum reached (5/5)' : `${pollForm.nominees.length}/5 nominees`}
                            </span>
                        </div>
                        
                        <div className="m3-dynamic-list">
                            {pollForm.nominees.map((nominee, index) => (
                                <div key={index} className="m3-nominee-box">
                                    <div className="m3-text-field">
                                        <label className="m3-label-medium">Nominee Name</label>
                                        <input 
                                            type="text" 
                                            value={nominee.name} 
                                            onChange={(e) => handleChange(e, index, 'name')} 
                                            className="m3-input" 
                                            required 
                                        />
                                    </div>
                                    <div className="m3-text-field m3-nominee-creds">
                                        <label className="m3-label-medium">Credentials (Max 150 chars)</label>
                                        <textarea 
                                            value={nominee.credentials} 
                                            onChange={(e) => handleChange(e, index, 'credentials')} 
                                            className="m3-input m3-textarea" 
                                            maxLength={150}
                                        />
                                    </div>
                                    <button 
                                        type="button" 
                                        onClick={() => onRemoveNominee(index)}
                                        className="m3-icon-btn m3-error-text m3-remove-btn"
                                        disabled={pollForm.nominees.length === 1}
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                        
                        {pollForm.nominees.length < 5 && (
                            <button type="button" className="m3-text-btn m3-add-nominee" onClick={onAddNominee}>
                                + Add Another Nominee
                            </button>
                        )}
                    </div>
                    
                    <div className="m3-button-row m3-form-actions">
                        <button type="button" className="m3-outlined-btn" onClick={onBack}>
                            Cancel
                        </button>
                        <button type="submit" className="m3-filled-btn">
                            Create Poll
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
