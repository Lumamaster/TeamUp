import React from 'react';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginPage from './components/pages/LoginPage';
import SignupPage from './components/pages/SignupPage';
import UserPage from './components/pages/UserPage';

function App() {
  return (
    <Router>
      <Navbar />
      <Route exact path="/" component={LoginPage}/>
      <Route path="/login/" component={LoginPage}/>
      <Route path="/signup/" component={SignupPage}/>
      <Route path="/profile/" component={UserPage}/>
    </Router>
  );
}

export default App;
