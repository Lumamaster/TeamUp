import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import TeamUp from '../TeamUp_white_bg_transparent.png';
import '../App.css';

function Navbar() {
  const [loggedin, setLoggedIn] = useState(window.localStorage.getItem('token') ? true : false)
  const logout = () => {
    window.localStorage.removeItem('token')
    setLoggedIn(false);
  }
  document.addEventListener('login', e => {
    setLoggedIn(true)
    //console.log("Logged in!")
  })
  if(!loggedin) {
    //user is not logged in
    return (
      <div id="top-border">
        <div className="flexstart" style={{marginLeft:7}}>
          <Link to="/"><img src={TeamUp} alt="" id="navbar-logo" /></Link>
          <Link to="/login/" id="login">Log In</Link>
          <Link to="/signup/" id="signup">Sign Up</Link>
        </div>
      </div>
    )
  }

  //user is logged in; no need to display signup or login
  return (
    <div id="top-border">
      <div className="flexstart" style={{marginLeft:7}}>
        <Link to="/"><img src={TeamUp} alt="" id="navbar-logo" /></Link>
        <Link to="/profile/" id="profile">My Profile</Link>
        <Link to="/users/" id="users">List Users</Link>
        <Link to="/teams/" id="teams">List Teams</Link>
        <Link to="/createteam/" id="createteam">Create Team</Link>
      </div>
      <div className="flexend" style={{marginRight:7}}>
        <Link to="/login/" onClick={logout}>Log Out</Link>
      </div>
    </div>
  );
}

export default Navbar;
