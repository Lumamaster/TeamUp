import React from 'react';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import LoginPage from './components/pages/LoginPage';
import SignupPage from './components/pages/SignupPage';

function App() {
  return (
    <Router>
      <Route exact path="/" component={LoginPage}/>
      <Route path="/login/" component={LoginPage}/>
      <Route path="/signup/" component={SignupPage}/>
    </Router>
  );
}

export default App;
