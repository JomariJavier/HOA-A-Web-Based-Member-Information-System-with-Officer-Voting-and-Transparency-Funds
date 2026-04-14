import React, { useState, useEffect } from 'react';
import ElectionList from './ElectionList';
import VotingBallot from './VotingBallot';
import ElectionManagement from './ElectionManagement';
import './VotingRoom.css';

export default function VotingRoom() {
    const [view, setView] = useState('list'); // 'list', 'ballot', 'create'
    const [elections, setElections] = useState([]);
    const [selectedElection, setSelectedElection] = useState(null);
    const [selectedCandidateId, setSelectedCandidateId] = useState(null);

    // Form state for creating poll
    const [pollForm, setPollForm] = useState({
        title: '',
        startDate: '',
        endDate: '',
        status: 'Active',
        nominees: [{ name: '', credentials: '' }]
    });

    useEffect(() => {
        if (view === 'list') {
            fetchElections();
        }
    }, [view]);

    const fetchElections = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/voting/elections');
            const data = await response.json();
            setElections(data);
        } catch (error) {
            console.error("Error fetching elections", error);
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
        if (!pollForm.title || !pollForm.startDate || !pollForm.endDate || pollForm.nominees.length === 0) {
            alert("All fields are required. At least one nominee is required.");
            return;
        }

        try {
            await fetch('http://localhost:8080/api/voting/elections', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pollForm)
            });
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
            await fetch(`http://localhost:8080/api/voting/elections/${selectedElection.id}/candidates/${selectedCandidateId}/vote`, {
                method: 'POST'
            });
            alert("Vote recorded successfully!");
            setView('list');
        } catch (error) {
            console.error("Error submitting vote", error);
        }
    };

    const handleSelectElection = (election) => {
        setSelectedElection(election);
        setSelectedCandidateId(null);
        setView('ballot');
    };

    return (
        <section className="m3-content-wrapper">
            {view === 'list' && (
                <ElectionList 
                    elections={elections} 
                    onSelectElection={handleSelectElection} 
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
