import React from 'react';
import './VotingRoom.css';

export default function VotingBallot({ election, selectedCandidateId, onSelectCandidate, onVoteSubmit, onBack, onCreateClick }) {
    return (
        <div className="m3-voting-directory">
            <div className="m3-page-header">
                <button className="m3-icon-btn m3-on-surface-variant" onClick={onBack} aria-label="Back">
                    ←
                </button>
                <div>
                    <h1 className="m3-display-small">{election?.title}</h1>
                    <p className="m3-body-large m3-on-surface-variant">Official Ballot</p>
                </div>
                <button className="m3-outlined-btn" onClick={onCreateClick} style={{marginLeft: 'auto'}}>
                    Create Poll
                </button>
            </div>

            <div className="m3-candidate-grid">
                {election?.nominees.map(candidate => (
                    <div 
                        key={candidate.id} 
                        className={`m3-identity-card ${selectedCandidateId === candidate.id ? 'm3-card-selected' : ''}`}
                        onClick={() => onSelectCandidate(candidate.id)}
                    >
                        <div className="m3-avatar m3-avatar-circular">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 96 960 960" width="24" fill="currentColor">
                                <path d="M480 576q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM192 896v-57q0-38 18.5-70t50.5-50q51-29 108.5-44T480 660q61 0 119 15t108 44q32 18 50.5 50t18.5 70v57H192Z"/>
                            </svg>
                        </div>
                        <div className="m3-identity-info">
                            <h3 className="m3-headline-large">{candidate.name}</h3>
                            <p className="m3-body-medium m3-credentials">
                                {candidate.credentials?.length > 150 ? candidate.credentials.substring(0, 150) + '...' : candidate.credentials}
                            </p>
                        </div>
                        <div className="m3-radio-indicator">
                            <div className={`m3-radio-inner ${selectedCandidateId === candidate.id ? 'm3-radio-checked' : ''}`}></div>
                        </div>
                    </div>
                ))}
            </div>

            {new Date(election?.endDate) > new Date() ? (
                <button className="m3-fab-extended m3-fab-bottom-right" onClick={onVoteSubmit}>
                    Confirm Vote
                </button>
            ) : (
                <div className="m3-fab-extended m3-fab-bottom-right m3-chip-outline" style={{boxShadow: 'none', cursor: 'default'}}>
                    Voting Concluded
                </div>
            )}
        </div>
    );
}
