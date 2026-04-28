import React, { useState } from 'react';
import MemberList from './components/Member/MemberList';
import VotingRoom from './components/Voting/VotingRoom';
import BaseLayout from './components/common/BaseLayout';
import MainDashboard from './components/Dashboard/MainDashboard';
import './App.css';

import ProjectList from './components/Audit/ProjectList';
import PRRoom from './components/PR/PRRoom';

function App() {
  const [currentView, setCurrentView] = useState('Dashboard'); // Set default to Dashboard to see changes

  return (
    <BaseLayout currentView={currentView} onNavClick={setCurrentView}>
      {currentView === 'Dashboard' && <MainDashboard onNavigate={setCurrentView} />}
      {currentView === 'PIS' && <MemberList />}
      {currentView === 'Voting' && <VotingRoom />}
      {currentView === 'Project' && <ProjectList />}
      {currentView === 'PR' && <PRRoom />}
    </BaseLayout>
  );
}

export default App;