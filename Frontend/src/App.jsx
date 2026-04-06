import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [members, setMembers] = useState([]);
  const [newName, setNewName] = useState("");

  // Function to fetch members from Backend
  const fetchMembers = () => {
    fetch('http://localhost:8080/api/members')
      .then(res => res.json())
      .then(data => setMembers(data))
      .catch(err => console.error("Error fetching:", err));
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newName) return;

    fetch('http://localhost:8080/api/members', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName })
    })
    .then(() => {
      setNewName(""); // Clear input
      fetchMembers(); // Refresh list
    })
    .catch(err => console.error("Error saving:", err));
  };

  return (
    <div className="App">
      <h1>HOA Member Manager</h1>
      
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          value={newName} 
          onChange={(e) => setNewName(e.target.value)} 
          placeholder="Enter member name"
        />
        <button type="submit">Add Member</button>
      </form>

      <div className="card">
        <h3>Member List (from PostgreSQL)</h3>
        {members.length === 0 ? <p>No members found.</p> : (
          <ul>
            {members.map(m => (
              <li key={m.id}>{m.name} - <strong>{m.status}</strong></li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default App