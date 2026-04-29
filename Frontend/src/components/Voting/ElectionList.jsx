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
            
            {/* COMPACT HERO SECTION */}
            <div className="voting-hero-card" style={{padding: '24px 32px', marginBottom: '16px'}}>
                <div className="voting-hero-content">
                    <h1 style={{fontSize: '28px'}}>Election Directory</h1>
                    <p style={{fontSize: '15px', marginBottom: 0}}>Shape the future of our community through active polls.</p>
                </div>
            </div>

            {/* COMPACT STATS ROW */}
            <div className="voting-stats-row" style={{marginBottom: '20px', gap: '12px'}}>
                <div className="stat-glass-card" style={{padding: '16px 20px'}}>
                    <span className="stat-label" style={{fontSize: '11px'}}>Active</span>
                    <span className="stat-value" style={{fontSize: '24px'}}>{activeCount}</span>
                </div>
                <div className="stat-glass-card" style={{padding: '16px 20px'}}>
                    <span className="stat-label" style={{fontSize: '11px'}}>Members</span>
                    <span className="stat-value" style={{fontSize: '24px'}}>{totalMembers}</span>
                </div>
                <div className="stat-glass-card" style={{padding: '16px 20px'}}>
                    <span className="stat-label" style={{fontSize: '11px'}}>Archived</span>
                    <span className="stat-value" style={{fontSize: '24px'}}>{concludedCount}</span>
                </div>
                {isAdmin && (
                    <div className="stat-glass-card" style={{padding: '16px 20px', justifyContent: 'center', cursor: 'pointer', background: 'var(--voting-primary)', color: 'white'}} onClick={onCreateClick}>
                        <span className="stat-value" style={{fontSize: '15px', color: 'white', textAlign: 'center'}}>+ Create Election</span>
                    </div>
                )}
            </div>

            <div className="election-grid">
                {elections.length === 0 ? (
                    <div className="m3-empty-state m3-elevated-card" style={{gridColumn: '1 / -1', padding: '80px', background: 'var(--voting-glass)', backdropFilter: 'blur(10px)'}}>
                        <div style={{fontSize: '48px', marginBottom: '16px'}}>📭</div>
                        <p className="m3-title-large">No active elections</p>
                        <p className="m3-body-large">The community is quiet for now. Check back later for upcoming polls.</p>
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
                                className="election-premium-card"
                                onClick={() => onSelectElection(election)}
                            >
                                <div className="card-accent-bar" style={{background: isConcluded ? 'var(--m3-outline)' : 'var(--voting-primary)'}}></div>
                                <div className="card-body">
                                    <div className="election-meta">
                                        <span className={`status-pill ${isConcluded ? 'concluded' : 'live'}`}>
                                            {isConcluded ? 'ARCHIVED' : '● LIVE NOW'}
                                        </span>
                                        {election.userHasVoted && (
                                            <span className="status-pill" style={{background: '#E8F5E9', color: '#2E7D32'}}>✓ VOTED</span>
                                        )}
                                        {isAdmin && (
                                            <button 
                                                className="m3-icon-btn" 
                                                style={{marginLeft: 'auto', color: 'var(--m3-error)'}}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onDeleteElection(election.id, election.title);
                                                }}
                                            >
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                                            </button>
                                        )}
                                    </div>

                                    <h3 className="election-title">{election.title}</h3>
                                    <p className="m3-body-medium m3-on-surface-variant" style={{marginBottom: '24px'}}>
                                        {isConcluded ? 'Voting has ended for this position.' : `Voting closes on ${new Date(election.endDate).toLocaleDateString()} at ${new Date(election.endDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`}
                                    </p>

                                    <div className="participation-box">
                                        <div className="participation-label">
                                            <span>Participation Rate</span>
                                            <span style={{color: isConcluded ? 'inherit' : 'var(--voting-primary)'}}>{Math.round(progress)}%</span>
                                        </div>
                                        <div className="progress-track" style={{marginTop: '8px'}}>
                                            <div className="progress-fill" style={{ width: `${progress}%`, background: isConcluded ? 'var(--m3-outline)' : undefined }}></div>
                                        </div>
                                        <p className="m3-label-small" style={{marginTop: '4px', textAlign: 'right'}}>
                                            {totalVotes} of {totalMembers} votes cast
                                        </p>
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
