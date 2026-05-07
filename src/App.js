import React, { useState } from 'react';

function App() {
  const [showSignup, setShowSignup] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // This handles the form submission for Netlify
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(formData).toString(),
    })
      .then(() => setSubmitted(true))
      .catch((error) => alert(error));
  };

  if (submitted) {
    return (
      <div style={{ textAlign: 'center', padding: '50px', fontFamily: 'Arial' }}>
        <h1>✅ Success!</h1>
        <p>Your AfriKazi account has been created.</p>
        <button onClick={() => setSubmitted(false)} style={btnStyle}>Back to Home</button>
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'center', padding: '50px', fontFamily: 'Arial' }}>
      <h1>AfriKazi Job Portal</h1>
      <p>The AI Engine is connected and ready.</p>
      
      {!showSignup ? (
        <button onClick={() => setShowSignup(true)} style={btnStyle}>Sign Up Now</button>
      ) : (
        <form 
          name="signup" 
          method="POST" 
          data-netlify="true" 
          onSubmit={handleSubmit}
          style={{ 
            marginTop: '30px', border: '1px solid #ddd', padding: '25px', 
            borderRadius: '12px', display: 'inline-block' 
          }}
        >
          {/* Hidden input for Netlify bot detection */}
          <input type="hidden" name="form-name" value="signup" />
          
          <h2>Create Account</h2>
          <input type="text" name="name" placeholder="Full Name" required style={inputStyle} /><br/>
          <input type="email" name="email" placeholder="Email Address" required style={inputStyle} /><br/>
          <input type="password" name="password" placeholder="Password" required style={inputStyle} /><br/>
          <button type="submit" style={{ ...btnStyle, width: '100%' }}>Complete Sign Up</button>
          <br/>
          <button type="button" onClick={() => setShowSignup(false)} style={{ background: 'none', border: 'none', color: '#666', marginTop: '10px' }}>Cancel</button>
        </form>
      )}
    </div>
  );
}

const inputStyle = { margin: '10px 0', padding: '12px', width: '280px', borderRadius: '6px', border: '1px solid #ccc' };
const btnStyle = { padding: '12px 24px', fontSize: '18px', backgroundColor: '#00ad9f', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' };

export default App;
