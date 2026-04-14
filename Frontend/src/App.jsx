import React, { useState } from 'react';
import MemberList from './components/Member/MemberList';
import VotingRoom from './components/Voting/VotingRoom';
import PRRoom from './components/PublicRelations/PRRoom';
import BaseLayout from './components/common/BaseLayout';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('Voting'); // Defaulting to Voting for debugging, user can switch

  return (
    <BaseLayout currentView={currentView} onNavClick={setCurrentView}>
      {currentView === 'PIS' && <MemberList />}
      {currentView === 'Voting' && <VotingRoom />}
      {currentView === 'PR' && <PRRoom />}
      {['Dashboard', 'Project'].includes(currentView) && (
          <div style={{padding: '32px', color: 'var(--m3-on-surface-variant)'}}>
              Module coming soon...
          </div>
      )}
    </BaseLayout>
  );
}

export default App;