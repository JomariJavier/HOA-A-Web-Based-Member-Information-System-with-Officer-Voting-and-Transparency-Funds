import MemberList from './components/Member/MemberList';
import BaseLayout from './components/common/BaseLayout';
import './App.css';

function App() {
  return (
    <BaseLayout currentView="HOA Personal Information">
      <MemberList />
    </BaseLayout>
  );
}

export default App;