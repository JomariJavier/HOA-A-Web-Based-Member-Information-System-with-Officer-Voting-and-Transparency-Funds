import React from 'react';
import './VotingRoom.css';

export default function ElectionList({ elections, totalMembers, isAdmin, onSelectElection, onDeleteElection, onCreateClick }) {
    
    // calculate total votes for progress bar
    const getTotalVotes = (election) => {
        if (!election || !election.nominees) return 0;
        return election.nominees.reduce((total, candidate) => total + (candidate.voteCount || 0), 0);
    };

    return (
        <div className="m3-voting-directory">
            <div className="m3-page-header">
                <h1 className="m3-display-small">HOA Voting Room</h1>
                <p className="m3-body-large m3-on-surface-variant">Active and concluded elections.</p>
            </div>

            <div className="m3-election-list">
                {elections.length === 0 ? (
                    <div className="m3-empty-state">No elections available.</div>
                ) : (
                    elections.map(election => {
                        const totalVotes = getTotalVotes(election);
                        const expectedVoters = totalMembers > 0 ? totalMembers : 1; // Prevent div by 0
                        const progress = Math.min((totalVotes / expectedVoters) * 100, 100);
                        const isConcluded = new Date(election.endDate) < new Date();

                        return (
                            <div 
                                key={election.id} 
                                className={`m3-election-card ${isConcluded ? 'm3-card-concluded' : 'm3-card-active'}`}
                                onClick={() => onSelectElection(election)}
                            >
                                <div className="m3-card-header">
                                    <h2 className="m3-title-large">{election.title}</h2>
                                    <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                                        <span className={`m3-chip ${isConcluded ? 'm3-chip-outline' : 'm3-chip-primary'}`}>
                                            {isConcluded ? 'Concluded' : 'Active'}
                                        </span>
                                        {isAdmin && (
                                            <button 
                                                className="m3-icon-btn m3-error-text" 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onDeleteElection(election.id, election.title);
                                                }}
                                                title="Delete Election"
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className="m3-card-content">
                                    <p className="m3-body-medium m3-on-surface-variant">
                                        Ends: {new Date(election.endDate).toLocaleString()}
                                    </p>
                                    <div className="m3-progress-container">
                                        <div className="m3-progress-bar">
                                            <div className="m3-progress-fill" style={{ width: `${progress}%` }}></div>
                                        </div>
                                        <span className="m3-label-small m3-on-surface-variant">
                                            {totalVotes} / {expectedVoters} Votes Cast
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            <button className="m3-fab-extended" onClick={onCreateClick}>
                <svg className="m3-fab-icon" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 96 960 960" width="24" fill="currentColor">
                    <path d="M440 856V576H160v-80h280V216h80v280h280v80H520v280h-80Z"/>
                </svg>
                Create Poll
            </button>
        </div>
    );
}
