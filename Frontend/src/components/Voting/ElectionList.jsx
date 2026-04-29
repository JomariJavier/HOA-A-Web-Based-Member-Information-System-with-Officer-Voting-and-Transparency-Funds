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
        <div className="m3-voting-directory subsystem-voting animate-fade-in">
            <div className="m3-subsystem-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '2px solid var(--m3-surface-variant)', paddingBottom: '12px'}}>
                <h1 className="m3-title-large" style={{margin: 0}}>Election Directory</h1>
                {isAdmin && (
                    <button className="m3-fab-extended" onClick={onCreateClick} style={{height: '48px'}}>
                        <span className="m3-fab-icon" style={{fontSize: '20px', lineHeight: 1}}>+</span>
                        Create New Election
                    </button>
                )}
            </div>

            <div className="m3-details-grid" style={{marginBottom: '24px', gap: '16px'}}>
                <div className="m3-card m3-elevated-card accent-card" style={{borderLeftColor: 'var(--accent-voting)'}}>
                    <div className="m3-card-content">
                        <span className="m3-label-medium">ACTIVE ELECTIONS</span>
                        <h2 className="m3-display-small" style={{color: 'var(--accent-voting)', marginTop: '4px'}}>{activeCount}</h2>
                    </div>
                </div>
                <div className="m3-card m3-elevated-card accent-card" style={{borderLeftColor: 'var(--accent-voting)'}}>
                    <div className="m3-card-content">
                        <span className="m3-label-medium">TOTAL PARTICIPATION</span>
                        <h2 className="m3-display-small" style={{marginTop: '4px'}}>{totalMembers} Members</h2>
                    </div>
                </div>
                <div className="m3-card m3-elevated-card accent-card" style={{borderLeftColor: 'var(--accent-voting)'}}>
                    <div className="m3-card-content">
                        <span className="m3-label-medium">CONCLUDED</span>
                        <h2 className="m3-display-small" style={{color: 'var(--m3-on-surface-variant)', marginTop: '4px'}}>{concludedCount}</h2>
                    </div>
                </div>
            </div>

            <div className="m3-election-list">
                {elections.length === 0 ? (
                    <div className="m3-empty-state m3-elevated-card" style={{padding: '40px', textAlign: 'center', borderRadius: '16px'}}>
                        <p className="m3-title-medium" style={{color: 'var(--m3-on-surface-variant)'}}>No elections are currently scheduled.</p>
                        <p className="m3-body-medium" style={{color: 'var(--m3-on-surface-variant)'}}>Check back later for upcoming community polls.</p>
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
                                className={`m3-election-card m3-elevated-card ${isConcluded ? 'm3-card-concluded' : 'm3-card-active'}`}
                                onClick={() => onSelectElection(election)}
                                style={{borderTop: isConcluded ? 'none' : '4px solid var(--accent-voting)', cursor: 'pointer', padding: '24px', transition: 'transform 0.2s, box-shadow 0.2s'}}
                                onMouseOver={e => {e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.1)'}}
                                onMouseOut={e => {e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--m3-elevation-1)'}}
                            >
                                <div className="m3-card-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px'}}>
                                    <div>
                                        <h2 className="m3-title-large" style={{margin: '0 0 4px 0'}}>{election.title}</h2>
                                        <p className="m3-body-medium m3-on-surface-variant" style={{margin: 0}}>
                                            {isConcluded ? 'Voting period ended' : `Ends: ${new Date(election.endDate).toLocaleString()}`}
                                        </p>
                                    </div>
                                    <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                                        <span className={`m3-chip ${isConcluded ? 'm3-chip-outline' : 'm3-chip-primary'}`} style={!isConcluded ? {background: 'var(--accent-voting)', color: 'white', border: 'none'} : {}}>
                                            {isConcluded ? 'Archived' : 'Live'}
                                        </span>
                                        {election.userHasVoted && (
                                            <span className="m3-chip" style={{background: '#E8F5E9', color: '#2E7D32', border: '1px solid #A5D6A7'}}>Voted</span>
                                        )}
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
                                    <div className="m3-progress-container" style={{marginTop: '16px'}}>
                                        <div className="m3-progress-bar" style={{height: '8px', borderRadius: '4px', background: 'var(--m3-surface-variant)', overflow: 'hidden'}}>
                                            <div className="m3-progress-fill" style={{ width: `${progress}%`, height: '100%', background: 'var(--accent-voting)', transition: 'width 0.5s ease' }}></div>
                                        </div>
                                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px'}}>
                                            <span className="m3-label-small m3-on-surface-variant">Participation Rate</span>
                                            <span className="m3-label-small" style={{fontWeight: 'bold', color: 'var(--accent-voting)'}}>{Math.round(progress)}%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

        </div>
    );
}
