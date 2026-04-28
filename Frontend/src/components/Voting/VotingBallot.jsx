import React from 'react';
import './VotingRoom.css';

export default function VotingBallot({ election, selectedCandidateId, onSelectCandidate, onVoteSubmit, onBack, onCreateClick }) {
    
    const isConcluded = new Date(election?.endDate) < new Date();

    return (
        <div className="m3-voting-directory m3-ballot-container">
            <div className="m3-page-header">
                <button className="m3-icon-btn m3-on-surface-variant" onClick={onBack} aria-label="Back">
                    ←
                </button>
                <div>
                    <h1 className="m3-display-small">{election?.title} Election</h1>
                    <p className="m3-body-large m3-on-surface-variant">Official Digital Ballot</p>
                </div>
            </div>

            <div className="m3-card m3-surface-container-high" style={{padding: '24px', marginBottom: '32px'}}>
                <p className="m3-body-medium">
                    Please select exactly <strong>one</strong> candidate for the position of <strong>{election?.title}</strong>. 
                    Your vote is anonymous and cannot be changed after submission.
                </p>
            </div>

            <div className="m3-candidate-grid">
                {election?.nominees.map(candidate => (
                    <div 
                        key={candidate.id} 
                        className={`m3-identity-card ${selectedCandidateId === candidate.id ? 'm3-card-selected' : ''}`}
                        onClick={() => !isConcluded && onSelectCandidate(candidate.id)}
                        style={{cursor: isConcluded ? 'default' : 'pointer'}}
                    >
                        <div className="m3-avatar-circular">
                            {candidate.name.charAt(0)}
                        </div>
                        <div className="m3-identity-info">
                            <h3 className="m3-headline-large">{candidate.name}</h3>
                            <p className="m3-body-medium m3-credentials">
                                {candidate.credentials || 'No credentials provided.'}
                            </p>
                        </div>
                        {!isConcluded && (
                            <div className="m3-radio-indicator">
                                <div className={`m3-radio-inner ${selectedCandidateId === candidate.id ? 'm3-radio-checked' : ''}`}></div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {!isConcluded ? (
                <button 
                    className="m3-fab-extended m3-fab-bottom-right" 
                    onClick={onVoteSubmit}
                    disabled={!selectedCandidateId}
                    style={{opacity: selectedCandidateId ? 1 : 0.6}}
                >
                    Confirm & Submit Vote
                </button>
            ) : (
                <div className="m3-fab-extended m3-fab-bottom-right m3-chip-outline" style={{boxShadow: 'none', cursor: 'default', background: '#f5f5f5'}}>
                    Election Concluded
                </div>
            )}
        </div>
    );
}
