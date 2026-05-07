import React, { useState } from 'react';

function App() {
  const [showSignup, setShowSignup] = useState(false);

  return (
    <div style={{ textAlign: 'center', padding: '50px', fontFamily: 'Arial' }}>
      <h1>AfriKazi Job Portal Live!</h1>
      <p>The AI Engine is connected and ready.</p>
      
      {!showSignup ? (
        <button 
          onClick={() => setShowSignup(true)}
          style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}
        >
          Test Sign Up Flow
        </button>
      ) : (
        <div style={{ marginTop: '30px', border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
          <h2>Create Account</h2>
          <input type="text" placeholder="Full Name" style={inputStyle} /><br/>
          <input type="email" placeholder="Email Address" style={inputStyle} /><br/>
          <input type="password" placeholder="Password" style={inputStyle} /><br/>
          <button style={{ ...inputStyle, backgroundColor: '#00ad9f', color: 'white' }}>
            Sign Up
          </button>
          <br/>
          <button onClick={() => setShowSignup(false)} style={{ background: 'none', border: 'none', color: 'blue', cursor: 'pointer' }}>
            Go Back
          </button>
        </div>
      )}
    </div>
  );
}

const inputStyle = {
  margin: '10px',
  padding: '10px',
  width: '250px',
  borderRadius: '4px',
  border: '1px solid #ddd'
};

export default App;
