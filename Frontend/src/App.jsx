import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [connectionData, setConnectionData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetching data from our Spring Boot API
    fetch('http://localhost:8080/api/test/connection')
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(data => setConnectionData(data))
      .catch(err => setError(err.message));
  }, []);

  return (
    <div className="App">
      <h1>HOA System Connection Test</h1>
      
      <div className="card">
        {error ? (
          <p style={{ color: 'red' }}>Error connecting to backend: {error}</p>
        ) : (
          <ul>
            {connectionData.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        )}
      </div>
      <p className="read-the-docs">
        If you see "Backend Status: Online", your stack is correctly wired!
      </p>
    </div>
  )
}

export default App