import React from 'react';
import './VotingRoom.css';

export default function VotingBallot({ election, selectedCandidateId, onSelectCandidate, onVoteSubmit, onBack, onCreateClick }) {
    
    const isConcluded = new Date(election?.endDate) < new Date();
    const hasVoted = election?.userHasVoted;
    const canVote = !isConcluded && !hasVoted;

    return (
        <div className="m3-voting-directory subsystem-voting m3-ballot-container animate-slide-up">
            <div style={{display: 'flex', alignItems: 'center', marginBottom: '16px'}}>
                <button className="m3-icon-btn m3-on-surface-variant" onClick={onBack} aria-label="Back">
                    ←
                </button>
                <h1 className="m3-title-large" style={{margin: '0 0 0 16px'}}>{election?.title} Election</h1>
            </div>

            <div className="m3-card m3-elevated-card" style={{padding: '24px', marginBottom: '32px', borderLeft: '4px solid var(--accent-voting)'}}>
                <p className="m3-body-large" style={{margin: 0}}>
                    Please select exactly <strong>one</strong> candidate for the position of <strong>{election?.title}</strong>. 
                    Your vote is anonymous and cannot be changed after submission.
                </p>
            </div>

            <div className="m3-candidate-grid" style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                {election?.nominees.map(candidate => (
                    <div 
                        key={candidate.id} 
                        className={`m3-identity-card m3-elevated-card ${selectedCandidateId === candidate.id ? 'm3-card-selected' : ''}`}
                        onClick={() => canVote && onSelectCandidate(candidate.id)}
                        style={{
                            cursor: canVote ? 'pointer' : 'default',
                            display: 'flex', alignItems: 'center', padding: '24px', borderRadius: '16px', gap: '20px',
                            border: selectedCandidateId === candidate.id ? '2px solid var(--accent-voting)' : '2px solid transparent',
                            background: selectedCandidateId === candidate.id ? 'var(--accent-voting-container)' : 'var(--m3-surface)'
                        }}
                    >
                        <div className="m3-avatar-circular" style={{width: '60px', height: '60px', borderRadius: '50%', background: 'var(--accent-voting)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold'}}>
                            {candidate.name.charAt(0)}
                        </div>
                        <div className="m3-identity-info" style={{flex: 1}}>
                            <h3 className="m3-headline-small" style={{margin: '0 0 4px 0', color: selectedCandidateId === candidate.id ? 'var(--accent-voting)' : 'inherit'}}>{candidate.name}</h3>
                            <p className="m3-body-medium m3-credentials" style={{margin: 0, color: 'var(--m3-on-surface-variant)'}}>
                                {candidate.credentials || 'No credentials provided.'}
                            </p>
                        </div>
                        {canVote && (
                            <div className="m3-radio-indicator" style={{width: '24px', height: '24px', borderRadius: '50%', border: selectedCandidateId === candidate.id ? '2px solid var(--accent-voting)' : '2px solid var(--m3-outline)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                <div className={`m3-radio-inner ${selectedCandidateId === candidate.id ? 'm3-radio-checked' : ''}`} style={{width: '12px', height: '12px', borderRadius: '50%', background: selectedCandidateId === candidate.id ? 'var(--accent-voting)' : 'transparent'}}></div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {canVote ? (
                <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: '32px'}}>
                    <button 
                        className="m3-filled-btn" 
                        onClick={onVoteSubmit}
                        disabled={!selectedCandidateId}
                        style={{
                            padding: '16px 32px', fontSize: '16px', borderRadius: '24px',
                            background: selectedCandidateId ? 'var(--accent-voting)' : 'var(--m3-surface-variant)',
                            color: selectedCandidateId ? 'white' : 'var(--m3-on-surface-variant)',
                            cursor: selectedCandidateId ? 'pointer' : 'not-allowed'
                        }}
                    >
                        Confirm & Submit Vote
                    </button>
                </div>
            ) : (
                <div style={{display: 'flex', justifyContent: 'center', marginTop: '32px'}}>
                    <div className="m3-chip m3-chip-outline" style={{padding: '12px 24px', fontSize: '15px', background: '#f5f5f5', border: '1px solid #ccc', color: '#666'}}>
                        {hasVoted ? '✓ Your Vote is Recorded' : 'Election Concluded'}
                    </div>
                </div>
            )}
        </div>
    );
}
