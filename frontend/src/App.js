import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginPage from './components/pages/LoginPage';
import SignupPage from './components/pages/SignupPage';
import UserPage from './components/pages/UserPage';
import TeamPage from './components/pages/TeamPage';
import CreateTeamPage from './components/pages/CreateTeamPage';
import TeamDashboard from './components/pages/TeamDashboard';
import UserSearch from './components/pages/UserSearch';
function App() {
  return (
    <Router>
      <Navbar />
      <Route exact path="/" component={LoginPage}/>
      <Route path="/login/" component={LoginPage}/>
      <Route path="/signup/" component={SignupPage}/>
      <Route path="/profile/" component={UserPage}/>
      <Route path="/teams/:id" component={TeamDashboard}/>
      <Route exact path="/teams/" component={TeamPage}/>
      <Route path="/createteam/" component={CreateTeamPage}/>
      <Route path="/users/" component={UserSearch}/>
    </Router>
  );
}

export default App;
