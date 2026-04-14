import React, { useState, useEffect } from 'react';
import ElectionList from './ElectionList';
import VotingBallot from './VotingBallot';
import ElectionManagement from './ElectionManagement';
import './VotingRoom.css';

export default function VotingRoom() {
    const [view, setView] = useState('list'); // 'list', 'ballot', 'create'
    const [elections, setElections] = useState([]);
    const [totalMembers, setTotalMembers] = useState(0);
    const [selectedElection, setSelectedElection] = useState(null);
    const [selectedCandidateId, setSelectedCandidateId] = useState(null);
    const CURRENT_USER_MEMBER_ID = 1; // Mocked logged-in user until Login Module is built
    const isAdmin = true; // Simulated Admin role logic for now

    // Form state for creating poll
    const [pollForm, setPollForm] = useState({
        title: '',
        startDate: '',
        endDate: '',
        status: 'Active',
        nominees: [{ name: '', credentials: '' }]
    });

    useEffect(() => {
        fetchStatsAndElections();
        
        // Auto-refresh every 30 seconds to sync Active/Concluded statuses
        const interval = setInterval(() => {
            fetchStatsAndElections();
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    // Only fetch on view change if we aren't already on list (to force update)
    useEffect(() => {
        if (view === 'list') {
            fetchStatsAndElections();
        }
    }, [view]);

    const fetchStatsAndElections = async () => {
        try {
            const memberRes = await fetch('http://localhost:8080/api/voting/elections/stats/member-count');
            const memberCount = await memberRes.json();
            setTotalMembers(memberCount);

            const electionRes = await fetch('http://localhost:8080/api/voting/elections');
            const electionData = await electionRes.json();
            setElections(electionData);
        } catch (error) {
            console.error("Error fetching data", error);
        }
    };

    const handleCreatePollChange = (e, index = null, field = null) => {
        if (index !== null) {
            const updatedNominees = [...pollForm.nominees];
            updatedNominees[index][field] = e.target.value;
            setPollForm({ ...pollForm, nominees: updatedNominees });
        } else {
            setPollForm({ ...pollForm, [e.target.name]: e.target.value });
        }
    };

    const addNomineeField = () => {
        if (pollForm.nominees.length < 5) {
            setPollForm({
                ...pollForm,
                nominees: [...pollForm.nominees, { name: '', credentials: '' }]
            });
        }
    };

    const removeNomineeField = (index) => {
        const updatedNominees = pollForm.nominees.filter((_, i) => i !== index);
        setPollForm({ ...pollForm, nominees: updatedNominees });
    };

    const handleCreatePollSubmit = async (e) => {
        e.preventDefault();
        
        // Frontend Validation
        if (!pollForm.title || pollForm.title.trim().length < 3) {
            alert("Please provide a valid position title (min 3 chars).");
            return;
        }
        if (!pollForm.startDate || !pollForm.endDate) {
            alert("Please select both start and end dates.");
            return;
        }
        if (new Date(pollForm.endDate) <= new Date(pollForm.startDate)) {
            alert("Election must end after it starts!");
            return;
        }
        if (pollForm.nominees.length < 2) {
            alert("Democratic elections require at least 2 nominees.");
            return;
        }
        const hasEmptyNames = pollForm.nominees.some(n => !n.name || n.name.trim().length === 0);
        if (hasEmptyNames) {
            alert("All nominees must have a name.");
            return;
        }

        try {
            const res = await fetch('http://localhost:8080/api/voting/elections', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pollForm)
            });

            if (!res.ok) {
                const errorText = await res.text();
                alert(`Creation failed: ${errorText}`);
                return;
            }

            setView('list');
            setPollForm({
                title: '',
                startDate: '',
                endDate: '',
                status: 'Active',
                nominees: [{ name: '', credentials: '' }]
            });
        } catch (error) {
            console.error("Error creating poll", error);
        }
    };

    const handleVoteSubmit = async () => {
        if (!selectedCandidateId) {
            alert("Please select a candidate to vote for.");
            return;
        }

        try {
            const res = await fetch(`http://localhost:8080/api/voting/elections/${selectedElection.id}/candidates/${selectedCandidateId}/vote?memberId=${CURRENT_USER_MEMBER_ID}`, {
                method: 'POST'
            });
            
            if (!res.ok) {
                const errorMsg = await res.text();
                alert(`Vote failed: ${errorMsg}`);
                return;
            }

            alert("Vote recorded successfully!");
            setView('list');
        } catch (error) {
            console.error("Error submitting vote", error);
            alert("An error occurred while submitting your vote.");
        }
    };

    const handleSelectElection = (election) => {
        setSelectedElection(election);
        setSelectedCandidateId(null);
        setView('ballot');
    };

    const handleDeleteElection = async (id, title) => {
        console.log(`Attempting to delete election ID: ${id} (${title})`);
        if (!window.confirm(`Are you sure you want to delete "${title}"? This will wipe all votes.`)) return;
        
        try {
            const res = await fetch(`http://localhost:8080/api/voting/elections/${id}`, {
                method: 'DELETE'
            });
            console.log(`Delete response status: ${res.status}`);
            if (res.ok) {
                alert(`Successfully deleted "${title}"`);
                fetchStatsAndElections();
            } else {
                const error = await res.text();
                alert(`Delete failed: ${error || res.statusText}`);
            }
        } catch (error) {
            console.error("Error deleting election", error);
            alert("Delete failed: Backend unreachable or connection error.");
        }
    };

    return (
        <section className="m3-content-wrapper">
            {view === 'list' && (
                <ElectionList 
                    elections={elections} 
                    totalMembers={totalMembers}
                    isAdmin={isAdmin}
                    onSelectElection={handleSelectElection} 
                    onDeleteElection={handleDeleteElection}
                    onCreateClick={() => setView('create')} 
                />
            )}
            {view === 'ballot' && (
                <VotingBallot 
                    election={selectedElection} 
                    selectedCandidateId={selectedCandidateId} 
                    onSelectCandidate={setSelectedCandidateId} 
                    onVoteSubmit={handleVoteSubmit} 
                    onBack={() => setView('list')} 
                    onCreateClick={() => setView('create')}
                />
            )}
            {view === 'create' && (
                <ElectionManagement 
                    pollForm={pollForm} 
                    onFormChange={handleCreatePollChange} 
                    onAddNominee={addNomineeField} 
                    onRemoveNominee={removeNomineeField} 
                    onBack={() => setView('list')} 
                    onSubmit={handleCreatePollSubmit} 
                />
            )}
        </section>
    );
}
