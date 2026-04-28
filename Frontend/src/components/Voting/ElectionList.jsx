import React from 'react';
import './VotingRoom.css';

export default function ElectionList({ elections, totalMembers, isAdmin, onSelectElection, onDeleteElection, onCreateClick }) {
    
    // calculate total votes for progress bar
    const getTotalVotes = (election) => {
        if (!election || !election.nominees) return 0;
        return election.nominees.reduce((total, candidate) => total + (candidate.voteCount || 0), 0);
    };

    const activeCount = elections.filter(e => new Date(e.endDate) >= new Date()).length;
    const concludedCount = elections.length - activeCount;

    return (
        <div className="m3-voting-directory">
            <div className="m3-page-header">
                <div>
                    <h1 className="m3-display-small">HOA Voting Room</h1>
                    <p className="m3-body-large m3-on-surface-variant">Secure, anonymous elections for our community.</p>
                </div>
            </div>

            <div className="m3-details-grid" style={{marginBottom: '24px'}}>
                <div className="m3-card m3-elevated-card">
                    <div className="m3-card-content">
                        <span className="m3-label-medium">Active Elections</span>
                        <h2 className="m3-display-small" style={{color: 'var(--m3-primary)'}}>{activeCount}</h2>
                    </div>
                </div>
                <div className="m3-card m3-elevated-card">
                    <div className="m3-card-content">
                        <span className="m3-label-medium">Total Participation</span>
                        <h2 className="m3-display-small">{totalMembers} Members</h2>
                    </div>
                </div>
                <div className="m3-card m3-elevated-card">
                    <div className="m3-card-content">
                        <span className="m3-label-medium">Concluded</span>
                        <h2 className="m3-display-small" style={{color: 'var(--m3-on-surface-variant)'}}>{concludedCount}</h2>
                    </div>
                </div>
            </div>

            <div className="m3-election-list">
                {elections.length === 0 ? (
                    <div className="m3-empty-state">
                        <p className="m3-title-medium">No elections are currently scheduled.</p>
                        <p className="m3-body-small">Check back later for upcoming community polls.</p>
                    </div>
                ) : (
                    elections.map(election => {
                        const totalVotes = getTotalVotes(election);
                        const expectedVoters = totalMembers > 0 ? totalMembers : 1; 
                        const progress = Math.min((totalVotes / expectedVoters) * 100, 100);
                        const isConcluded = new Date(election.endDate) < new Date();

                        return (
                            <div 
                                key={election.id} 
                                className={`m3-election-card ${isConcluded ? 'm3-card-concluded' : 'm3-card-active'}`}
                                onClick={() => onSelectElection(election)}
                            >
                                <div className="m3-card-header">
                                    <h2 className="m3-title-large" style={{margin: 0}}>{election.title}</h2>
                                    <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                                        <span className={`m3-chip ${isConcluded ? 'm3-chip-outline' : 'm3-chip-primary'}`}>
                                            {isConcluded ? 'Archived' : 'Live'}
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
                                        {isConcluded ? 'Voting period ended' : `Ends: ${new Date(election.endDate).toLocaleString()}`}
                                    </p>
                                    <div className="m3-progress-container">
                                        <div className="m3-progress-bar">
                                            <div className="m3-progress-fill" style={{ width: `${progress}%` }}></div>
                                        </div>
                                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                            <span className="m3-label-small m3-on-surface-variant">Participation Rate</span>
                                            <span className="m3-label-small m3-primary-text" style={{fontWeight: 'bold'}}>{Math.round(progress)}%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {isAdmin && (
                <button className="m3-fab-extended" onClick={onCreateClick}>
                    <span style={{fontSize: '24px', marginRight: '8px'}}>+</span>
                    Create New Election
                </button>
            )}
        </div>
    );
}
