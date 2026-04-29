import React from 'react';
import './VotingRoom.css';

export default function VotingBallot({ election, selectedCandidateId, onSelectCandidate, onVoteSubmit, onBack, onCreateClick }) {
    
    const isConcluded = new Date(election?.endDate) < new Date();
    const hasVoted = election?.userHasVoted;
    const canVote = !isConcluded && !hasVoted;

    return (
        <div className="m3-voting-directory subsystem-voting animate-fade-in">
            
            <div className="ballot-paper">
                <div style={{marginBottom: '32px'}}>
                    <button className="m3-text-btn" onClick={onBack} style={{paddingLeft: 0, color: 'var(--voting-primary)'}}>
                        ← Back to Elections
                    </button>
                </div>

                <div className="ballot-header">
                    <h1 className="m3-display-small" style={{fontSize: '36px', color: 'var(--m3-on-surface)'}}>{election?.title}</h1>
                    <p className="m3-body-large m3-on-surface-variant">
                        {isConcluded 
                            ? "This election has concluded. Results are finalized below." 
                            : hasVoted 
                                ? "You have already cast your vote for this election. Thank you for participating!"
                                : "Select one candidate from the list below. Your vote is confidential and can only be cast once."
                        }
                    </p>
                </div>

                <div className="candidate-selection-grid">
                    {election?.nominees.map(candidate => {
                        const initials = candidate.name.split(' ').map(n => n[0]).join('').toUpperCase();
                        const isSelected = selectedCandidateId === candidate.id;

                        return (
                            <div 
                                key={candidate.id} 
                                className={`candidate-card-premium ${isSelected ? 'selected' : ''}`}
                                onClick={() => canVote && onSelectCandidate(candidate.id)}
                                style={{opacity: !canVote && !isSelected ? 0.6 : 1, cursor: canVote ? 'pointer' : 'default'}}
                            >
                                <div className="selection-indicator">
                                    {(isSelected || hasVoted) && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                                </div>
                                
                                <div className="candidate-avatar-large">
                                    {initials}
                                </div>

                                <h3 className="candidate-name">{candidate.name}</h3>
                                <p className="candidate-creds">{candidate.credentials || "No credentials provided."}</p>
                                
                                {isConcluded && (
                                    <div style={{marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--m3-surface-variant)'}}>
                                        <span className="m3-label-medium" style={{color: 'var(--voting-primary)'}}>FINAL VOTES</span>
                                        <p className="m3-display-small" style={{fontSize: '24px', marginTop: '4px'}}>{candidate.voteCount || 0}</p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px'}}>
                    {canVote ? (
                        <button 
                            className="m3-filled-btn" 
                            onClick={onVoteSubmit}
                            disabled={!selectedCandidateId}
                            style={{
                                padding: '20px 64px', 
                                fontSize: '18px', 
                                borderRadius: '32px',
                                background: selectedCandidateId ? 'var(--voting-primary)' : 'var(--m3-outline)',
                                boxShadow: selectedCandidateId ? '0 12px 24px rgba(81, 45, 168, 0.3)' : 'none'
                            }}
                        >
                            {selectedCandidateId ? 'Submit Confidential Vote' : 'Select a Candidate to Proceed'}
                        </button>
                    ) : (
                        <div className="status-pill" style={{padding: '16px 32px', fontSize: '16px', background: 'var(--m3-surface-variant)', color: 'var(--m3-on-surface-variant)'}}>
                            {hasVoted ? '✓ Your Vote has been Recorded' : '🔒 Voting Period Closed'}
                        </div>
                    )}
                    <p className="m3-label-small" style={{color: 'var(--m3-on-surface-variant)'}}>
                        Security Verification: All actions are encrypted and logged for transparency.
                    </p>
                </div>
            </div>

        </div>
    );
}
