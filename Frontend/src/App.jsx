import React, { useState } from 'react';
import MemberHub from './components/Member/MemberHub';
import VotingRoom from './components/Voting/VotingRoom';
import BaseLayout from './components/common/BaseLayout';
import Login from './components/Auth/Login';
import MainDashboard from './components/Dashboard/MainDashboard';
import FinancialManagement from './components/Audit/FinancialManagement';
import PRRoom from './components/PR/PRRoom';
import { useAuth } from './contexts/AuthContext';
import './App.css';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState('Dashboard');

  if (loading) {
      return <div>Loading...</div>;
  }

  if (!user) {
    return <Login />;
  }

  const isAdmin = user.role === 'ADMIN' || user.role === 'SUPERADMIN';

  const [mainView, subView] = currentView.split(':');

  return (
    <BaseLayout 
      currentView={currentView} 
      onNavClick={setCurrentView} 
      isAdmin={isAdmin}
      userName={user.username}
    >
      {mainView === 'Dashboard' && <MainDashboard onNavigate={setCurrentView} subView={subView} />}
      {mainView === 'PIS' && isAdmin && <MemberHub subView={subView} />}
      {mainView === 'Voting' && <VotingRoom subView={subView} />}
      {mainView === 'Project' && <FinancialManagement subView={subView} />}
      {mainView === 'PR' && <PRRoom subView={subView} />}
    </BaseLayout>
  );
}

function App() {
  // Assuming AuthProvider is wrapped in main.jsx. Wait, I should wrap it here if not in main.jsx.
  // Actually, I'll export AuthProvider from context and wrap it in main.jsx, or I'll just wrap it here.
  return (
      <AppContent />
  );
}

export default App;