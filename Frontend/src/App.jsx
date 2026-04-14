import React, { useState } from 'react';
import MemberList from './components/Member/MemberList';
import VotingRoom from './components/Voting/VotingRoom';
import PRRoom from './components/PublicRelations/PRRoom';
import AuditRoom from './components/Audit/AuditRoom';
import BaseLayout from './components/common/BaseLayout';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('Voting'); // Defaulting to Voting for debugging, user can switch
  const [isAdmin, setIsAdmin] = useState(true); // Global admin toggle for prototyping

  return (
    <BaseLayout currentView={currentView} onNavClick={setCurrentView} isAdmin={isAdmin}>
      {currentView === 'PIS' && isAdmin && <MemberList isAdmin={isAdmin} setIsAdmin={setIsAdmin} />}
      {currentView === 'Voting' && <VotingRoom isAdmin={isAdmin} setIsAdmin={setIsAdmin} />}
      {currentView === 'PR' && <PRRoom isAdmin={isAdmin} setIsAdmin={setIsAdmin} />}
      {currentView === 'Project' && <AuditRoom isAdmin={isAdmin} setIsAdmin={setIsAdmin} />}
      {['Dashboard'].includes(currentView) && (
          <div style={{padding: '32px', color: 'var(--m3-on-surface-variant)'}}>
              Module coming soon...
          </div>
      )}
    </BaseLayout>
  );
}

export default App;