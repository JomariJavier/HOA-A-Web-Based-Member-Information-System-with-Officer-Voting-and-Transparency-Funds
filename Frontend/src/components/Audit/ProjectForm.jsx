import React, { useState } from 'react';
import './Audit.css';

export default function ProjectForm({ onCancel, onSubmit }) {
    const [formData, setFormData] = useState({
        name: '',
        purpose: '',
        description: '',
        budget: '',
        dateStarted: '',
        estimatedDate: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="pr-form-card">
            <h2 className="m3-display-small" style={{ marginBottom: '8px' }}>Create New Project</h2>
            <p className="m3-body-medium m3-on-surface-variant" style={{ marginBottom: '32px' }}>
                Fill out the details below to propose or log a new HOA project. All fields are required for financial transparency.
            </p>

            <form onSubmit={handleSubmit}>
                {/* Section 1: Basic Information */}
                <div style={{ marginBottom: '32px', paddingBottom: '24px', borderBottom: '1px solid var(--m3-outline-variant)' }}>
                    <h3 className="m3-title-large" style={{ color: 'var(--m3-primary)', marginBottom: '24px' }}>1. Basic Information</h3>
                    
                    <div style={{ marginBottom: '24px' }}>
                        <label className="m3-form-label" style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Project Name</label>
                        <input 
                            type="text" 
                            name="name" 
                            value={formData.name} 
                            onChange={handleChange} 
                            required 
                            className="m3-input" 
                            placeholder="e.g., Phase 2 CCTV Installation" 
                            style={{ width: '100%', padding: '16px 20px', borderRadius: '12px', border: '1px solid var(--m3-outline)', fontSize: '1.1rem' }}
                        />
                        <p className="m3-label-small m3-on-surface-variant" style={{ marginTop: '6px' }}>Provide a clear and identifiable name for the project.</p>
                    </div>

                    <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                        <div style={{ flex: 1, minWidth: '300px' }}>
                            <label className="m3-form-label" style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Estimated Budget (₱)</label>
                            <input 
                                type="number" 
                                name="budget" 
                                value={formData.budget} 
                                onChange={handleChange} 
                                required 
                                className="m3-input" 
                                placeholder="0.00" 
                                style={{ width: '100%', padding: '16px 20px', borderRadius: '12px', border: '1px solid var(--m3-outline)', fontSize: '1.1rem' }}
                            />
                            <p className="m3-label-small m3-on-surface-variant" style={{ marginTop: '6px' }}>Total allocated cost.</p>
                        </div>
                    </div>
                </div>

                {/* Section 2: Timeline */}
                <div style={{ marginBottom: '32px', paddingBottom: '24px', borderBottom: '1px solid var(--m3-outline-variant)' }}>
                    <h3 className="m3-title-large" style={{ color: 'var(--m3-primary)', marginBottom: '24px' }}>2. Timeline</h3>
                    
                    <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                        <div style={{ flex: 1, minWidth: '300px' }}>
                            <label className="m3-form-label" style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Start Date</label>
                            <input 
                                type="date" 
                                name="dateStarted" 
                                value={formData.dateStarted} 
                                onChange={handleChange} 
                                required 
                                className="m3-input" 
                                style={{ width: '100%', padding: '16px 20px', borderRadius: '12px', border: '1px solid var(--m3-outline)', fontSize: '1.1rem' }}
                            />
                        </div>
                        <div style={{ flex: 1, minWidth: '300px' }}>
                            <label className="m3-form-label" style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Estimated Completion Date</label>
                            <input 
                                type="date" 
                                name="estimatedDate" 
                                value={formData.estimatedDate} 
                                onChange={handleChange} 
                                required 
                                className="m3-input" 
                                style={{ width: '100%', padding: '16px 20px', borderRadius: '12px', border: '1px solid var(--m3-outline)', fontSize: '1.1rem' }}
                            />
                        </div>
                    </div>
                </div>

                {/* Section 3: Details */}
                <div style={{ marginBottom: '32px' }}>
                    <h3 className="m3-title-large" style={{ color: 'var(--m3-primary)', marginBottom: '24px' }}>3. Details</h3>
                    
                    <div style={{ marginBottom: '24px' }}>
                        <label className="m3-form-label" style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Project Purpose</label>
                        <input 
                            type="text" 
                            name="purpose" 
                            value={formData.purpose} 
                            onChange={handleChange} 
                            required 
                            className="m3-input" 
                            placeholder="Briefly state why this project is needed." 
                            style={{ width: '100%', padding: '16px 20px', borderRadius: '12px', border: '1px solid var(--m3-outline)', fontSize: '1.1rem' }}
                        />
                    </div>
                    
                    <div style={{ marginBottom: '24px' }}>
                        <label className="m3-form-label" style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Detailed Description</label>
                        <textarea 
                            name="description" 
                            value={formData.description} 
                            onChange={handleChange} 
                            required 
                            className="m3-input" 
                            placeholder="Provide a comprehensive breakdown of the project scope..."
                            style={{ width: '100%', padding: '16px 20px', borderRadius: '12px', border: '1px solid var(--m3-outline)', fontSize: '1.1rem', minHeight: '120px', resize: 'vertical' }}
                        ></textarea>
                    </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '32px' }}>
                    <button 
                        type="button" 
                        className="m3-btn-text" 
                        onClick={onCancel}
                        style={{ height: '48px', padding: '0 24px', borderRadius: '24px', border: 'none', background: 'transparent', color: 'var(--m3-primary)', fontWeight: '500', cursor: 'pointer' }}
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        className="m3-btn-filled"
                        style={{ height: '48px', padding: '0 24px', borderRadius: '24px', border: 'none', background: 'var(--m3-primary)', color: 'white', fontWeight: '500', cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }}
                    >
                        Save Project
                    </button>
                </div>
            </form>
        </div>
    );
}
