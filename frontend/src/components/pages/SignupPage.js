import React from 'react';
import TeamUp from '../../TeamUp.png';
import '../../App.css';

function SignupPage() {
  return (
    <div>
      <div id="top-border">
        <img src={TeamUp} alt="" id="logo" />
        <h1 style={{color:'white'}}>Sign Up</h1>
      </div>
    </div>
  );
}

export default SignupPage;