import React, { useState } from 'react';
import './PublicRelations.css';

export default function ComplaintForm({ onSubmitSuccess }) {
    const [formData, setFormData] = useState({
        subject: '',
        category: 'General',
        urgency: 'Medium',
        description: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // Simulate API call
        setTimeout(() => {
            alert("Your concern has been submitted successfully. An officer will review it shortly.");
            setIsSubmitting(false);
            onSubmitSuccess();
        }, 1500);
    };

    return (
        <div className="pr-form-card">
            <h2 className="m3-headline-small" style={{marginBottom: '8px'}}>File a New Concern</h2>
            <p className="m3-body-medium m3-on-surface-variant" style={{marginBottom: '24px'}}>
                Please provide details about your issue. We aim to respond within 24-48 hours.
            </p>

            <form onSubmit={handleSubmit}>
                {/* Section 1: Classification */}
                <div style={{marginBottom: '32px', paddingBottom: '24px', borderBottom: '1px solid var(--m3-outline-variant)'}}>
                    <h3 className="m3-title-large" style={{marginBottom: '20px', color: 'var(--m3-primary)'}}>1. What seems to be the problem?</h3>
                    
                    <div className="pr-input-group">
                        <label className="pr-label">Subject</label>
                        <input 
                            type="text" 
                            className="m3-input" 
                            placeholder="e.g., Broken street light, Water leak..."
                            required
                            value={formData.subject}
                            onChange={(e) => setFormData({...formData, subject: e.target.value})}
                        />
                        <span className="m3-body-small m3-on-surface-variant" style={{display: 'block', marginTop: '6px'}}>A short, clear title for your issue.</span>
                    </div>

                    <div style={{display: 'flex', gap: '24px', flexWrap: 'wrap'}}>
                        <div className="pr-input-group" style={{flex: '1 1 200px'}}>
                            <label className="pr-label">Category</label>
                            <select 
                                className="m3-input"
                                value={formData.category}
                                onChange={(e) => setFormData({...formData, category: e.target.value})}
                            >
                                <option>General</option>
                                <option>Maintenance</option>
                                <option>Security</option>
                                <option>Sanitation</option>
                            </select>
                            <span className="m3-body-small m3-on-surface-variant" style={{display: 'block', marginTop: '6px'}}>Helps route your concern to the right officer.</span>
                        </div>
                        <div className="pr-input-group" style={{flex: '1 1 200px'}}>
                            <label className="pr-label">Urgency</label>
                            <select 
                                className="m3-input"
                                value={formData.urgency}
                                onChange={(e) => setFormData({...formData, urgency: e.target.value})}
                            >
                                <option>Low (No rush)</option>
                                <option>Medium (Needs attention)</option>
                                <option>High (Requires fast action)</option>
                            </select>
                            <span className="m3-body-small m3-on-surface-variant" style={{display: 'block', marginTop: '6px'}}>How quickly must this be resolved?</span>
                        </div>
                    </div>
                </div>

                {/* Section 2: Details */}
                <div style={{marginBottom: '16px'}}>
                    <h3 className="m3-title-large" style={{marginBottom: '20px', color: 'var(--m3-primary)'}}>2. Provide the details</h3>
                    <div className="pr-input-group">
                        <label className="pr-label">Full Description</label>
                        <textarea 
                            className="m3-input" 
                            rows="6"
                            placeholder="Please tell us exactly what happened, including the location and time..."
                            required
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                        ></textarea>
                        <span className="m3-body-small m3-on-surface-variant" style={{display: 'block', marginTop: '6px'}}>Providing specific locations and times helps us fix things much faster.</span>
                    </div>
                </div>

                <div style={{display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px'}}>
                    <button type="button" className="m3-btn-text" onClick={onSubmitSuccess}>
                        Cancel
                    </button>
                    <button type="submit" className="m3-btn-filled" disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Submit Report'}
                    </button>
                </div>
            </form>
        </div>
    );
}
