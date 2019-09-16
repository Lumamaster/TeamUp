import React from 'react';
import TeamUp from '../../TeamUp.png';
import '../../App.css';

function LoginPage() {
  return (
    <div>
      <div id="top-border">
        <img src={TeamUp} alt="" id="logo" />
        <h1 style={{color:'white'}}>Login</h1>
      </div>
    </div>
  );
}

export default LoginPage;
