export default function VotingBallot({ election, selectedCandidateId, onSelectCandidate, onVoteSubmit, onBack, onCreateClick, isAdmin }) {
    return (
        <div className="m3-voting-directory">
            <div className="m3-page-header">
                <button className="m3-icon-btn m3-on-surface-variant" onClick={onBack} aria-label="Back">
                    ←
                </button>
                <div>
                    <h1 className="m3-display-small">{election?.title}</h1>
                    <p className="m3-body-large m3-on-surface-variant">Selection Ballot</p>
                </div>
                {isAdmin && (
                    <button className="m3-outlined-btn" onClick={onCreateClick} style={{marginLeft: 'auto'}}>
                        Create Poll
                    </button>
                )}
            </div>

            <div className="m3-ballot-info-box m3-elevated-card" style={{padding: '16px', borderRadius: '12px', marginBottom: '24px', background: 'var(--m3-surface-container-low)'}}>
                <span className="m3-label-medium">Instructions:</span>
                <p className="m3-body-small">Select one candidate from the list below. Your vote is confidential and cannot be changed after submission.</p>
            </div>

            <div className="m3-candidate-grid">
                {election?.nominees.map(candidate => (
                    <div 
                        key={candidate.id} 
                        className={`m3-identity-card ${selectedCandidateId === candidate.id ? 'm3-card-selected' : ''}`}
                        onClick={() => onSelectCandidate(candidate.id)}
                    >
                        <div className="m3-avatar-circular-large">
                            {candidate.name.charAt(0)}
                        </div>
                        <div className="m3-identity-info">
                            <h3 className="m3-title-large">{candidate.name}</h3>
                            <p className="m3-body-medium m3-credentials">
                                {candidate.credentials || "No credentials provided."}
                            </p>
                        </div>
                        <div className="m3-selection-indicator">
                            <div className={`m3-radio-outer ${selectedCandidateId === candidate.id ? 'm3-radio-outer-selected' : ''}`}>
                                <div className={`m3-radio-inner ${selectedCandidateId === candidate.id ? 'm3-radio-inner-selected' : ''}`}></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {new Date(election?.endDate) > new Date() ? (
                <button className="m3-fab-extended m3-fab-bottom-right" onClick={onVoteSubmit}>
                    <svg style={{marginRight: '8px'}} xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 96 960 960" width="20" fill="currentColor">
                        <path d="M382 710 154 482l57-57 171 171 367-367 57 57-424 424Z"/>
                    </svg>
                    Confirm Vote
                </button>
            ) : (
                <div className="m3-fab-extended m3-fab-bottom-right m3-chip-outline" style={{boxShadow: 'none', cursor: 'default', opacity: 0.6}}>
                    <svg style={{marginRight: '8px'}} xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 96 960 960" width="20" fill="currentColor">
                        <path d="M480 776q-100 0-170-70t-70-170q0-100 70-170t170-70q100 0 170 70t70 170q0 100-70 170t-170 70Zm0-80q67 0 113.5-46.5T640 536q0-67-46.5-113.5T480 376q-67 0-113.5 46.5T320 536q0 67 46.5 113.5T480 696Zm0-160Zm0 280q-75 0-140.5-28.5t-114-77q-48.5-48.5-77-114T120 536q0-75 28.5-140.5t77-114q48.5-48.5 114-77T480 176q75 0 140.5 28.5t114 77q48.5 48.5 77 114T840 536q0 75-28.5 140.5t-77 114q-48.5 48.5-114 77T480 816Z"/>
                    </svg>
                    Voting Concluded
                </div>
            )}
        </div>
    );
}
