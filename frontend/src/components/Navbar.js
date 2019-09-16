import React from 'react';
import {Link} from 'react-router-dom';
import TeamUp from '../TeamUp_white_bg_transparent.png';
import '../App.css';

function Navbar() {
  return (
    <div id="top-border">
        <Link to="/"><img src={TeamUp} alt="" id="navbar-logo" /></Link>
        <Link to="/login/">Log In</Link>
        <Link to="/signup/">Sign Up</Link>
    </div>
  );
}

export default Navbar;
