import React, { useState } from 'react';
import './PublicRelations.css';

export default function PRAdminWorkspace({ onCancel, onSubmitNews }) {
    const [action, setAction] = useState('news'); // 'news' or 'resolutions'
    
    const [newsForm, setNewsForm] = useState({
        title: '',
        content: '',
        category: 'General',
        image: '',
        isPinned: false
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleNewsSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // Simulating API call
        setTimeout(() => {
            alert("Announcement published successfully!");
            setIsSubmitting(false);
            onCancel(); // Exit workspace
        }, 1200);
    };

    return (
        <div className="pr-form-card">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}}>
                <h2 className="m3-headline-small">Officer Toolbox</h2>
                <div className="chip-group" style={{margin: 0}}>
                    <button 
                        className={`m3-chip ${action === 'news' ? 'm3-chip-primary' : 'm3-chip-outline'}`}
                        onClick={() => setAction('news')}
                    >
                        New Announcement
                    </button>
                    <button 
                        className={`m3-chip ${action === 'resolutions' ? 'm3-chip-primary' : 'm3-chip-outline'}`}
                        onClick={() => setAction('resolutions')}
                    >
                        Resolve Concerns
                    </button>
                </div>
            </div>

            {action === 'news' ? (
                <form onSubmit={handleNewsSubmit}>
                    {/* Section 1: Headline & Metadata */}
                    <div style={{marginBottom: '32px', paddingBottom: '24px', borderBottom: '1px solid var(--m3-outline-variant)'}}>
                        <h3 className="m3-title-large" style={{marginBottom: '20px', color: 'var(--m3-primary)'}}>1. Headline & Classification</h3>
                        
                        <div className="pr-input-group">
                            <label className="pr-label">Announcement Title</label>
                            <input 
                                type="text" 
                                className="m3-input" 
                                placeholder="e.g., Scheduled Water Interruption"
                                required
                                value={newsForm.title}
                                onChange={(e) => setNewsForm({...newsForm, title: e.target.value})}
                            />
                            <span className="m3-body-small m3-on-surface-variant" style={{display: 'block', marginTop: '6px'}}>Make it catchy and immediately informative.</span>
                        </div>

                        <div style={{display: 'flex', gap: '24px', flexWrap: 'wrap'}}>
                            <div className="pr-input-group" style={{flex: '1 1 250px'}}>
                                <label className="pr-label">Category</label>
                                <select 
                                    className="m3-input"
                                    value={newsForm.category}
                                    onChange={(e) => setNewsForm({...newsForm, category: e.target.value})}
                                >
                                    <option>General</option>
                                    <option>Maintenance</option>
                                    <option>Security</option>
                                    <option>Events</option>
                                </select>
                            </div>
                            <div className="pr-input-group" style={{flex: '1 1 200px'}}>
                                <label className="pr-label">Priority</label>
                                <div style={{display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '14px'}}>
                                    <input 
                                        type="checkbox" 
                                        style={{width: '24px', height: '24px', cursor: 'pointer'}}
                                        checked={newsForm.isPinned}
                                        onChange={(e) => setNewsForm({...newsForm, isPinned: e.target.checked})}
                                    />
                                    <span className="m3-body-large" style={{fontWeight: '500'}}>Pin to Top (Hero Alert)</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Content & Media */}
                    <div style={{marginBottom: '16px'}}>
                        <h3 className="m3-title-large" style={{marginBottom: '20px', color: 'var(--m3-primary)'}}>2. Content & Media</h3>
                        
                        <div className="pr-input-group">
                            <label className="pr-label">Header Image URL (Optional)</label>
                            <input 
                                type="url" 
                                className="m3-input" 
                                placeholder="https://images.unsplash.com/..."
                                value={newsForm.image}
                                onChange={(e) => setNewsForm({...newsForm, image: e.target.value})}
                            />
                            <span className="m3-body-small m3-on-surface-variant" style={{display: 'block', marginTop: '6px'}}>Provide an image link. Wide aspect ratio (e.g. 1200x400) works best.</span>
                        </div>

                        <div className="pr-input-group">
                            <label className="pr-label">Full Announcement Body</label>
                            <textarea 
                                className="m3-input" 
                                rows="8"
                                placeholder="Write the full details here..."
                                required
                                value={newsForm.content}
                                onChange={(e) => setNewsForm({...newsForm, content: e.target.value})}
                            ></textarea>
                            <span className="m3-body-small m3-on-surface-variant" style={{display: 'block', marginTop: '6px'}}>Clear paragraph breaks are recommended.</span>
                        </div>
                    </div>

                    <div style={{display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px'}}>
                        <button type="button" className="m3-btn-text" onClick={onCancel}>
                            Discard
                        </button>
                        <button type="submit" className="m3-btn-filled" disabled={isSubmitting}>
                            {isSubmitting ? 'Publishing...' : 'Publish to Feed'}
                        </button>
                    </div>
                </form>
            ) : (
                <div className="pr-empty-state">
                    <h3 className="m3-title-large">Complaint Resolution Panel</h3>
                    <p className="m3-body-medium">To keep this prototype simple, use the "Resolve" button directly on the Concern cards in the main feed.</p>
                </div>
            )}
        </div>
    );
}
