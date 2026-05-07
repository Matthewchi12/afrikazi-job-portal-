  import React, { useState, useEffect } from 'react';

// Using the window.supabase method to avoid Netlify build errors
const supabaseURL = 'https://vefxeiroytqenjxkftx.supabase.co';
const supabaseKey = 'sb_publishable_JcXd7KhJuhV97qu489U-1g_sFfQ8UbP';
const supabase = window.supabase.createClient(supabaseURL, supabaseKey);

function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('login'); 
  const [jobs, setJobs] = useState([]);
  const [email, setEmail] = useState('');

  // Check if user is already logged in
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        setView('landing');
      }
    };
    checkUser();
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    const { data } = await supabase.from('jobs').select('*').order('created_at', { ascending: false });
    if (data) setJobs(data);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) alert(error.message);
    else alert("Check your email for the login link!");
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const { error } = await supabase.from('jobs').insert([{
      title: formData.get("job_title"),
      location: formData.get("location"),
      pay: formData.get("pay"),
      Description: formData.get("desc") 
    }]);
    if (!error) {
      alert("Job Posted Successfully!");
      setView('jobs');
      fetchJobs();
    } else {
      alert("Error: " + error.message);
    }
  };

  const btn = { padding: '12px', backgroundColor: '#00ad9f', color: 'white', border: 'none', borderRadius: '5px', margin: '10px', fontWeight: 'bold', cursor: 'pointer' };
  const inp = { padding: '10px', margin: '5px', width: '280px', borderRadius: '5px', border: '1px solid #ccc' };

  // 1. LOGIN VIEW
  if (!user && view === 'login') {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h1>AfriKazi Login</h1>
        <p>Enter your email to get a magic login link.</p>
        <form onSubmit={handleLogin}>
          <input type="email" placeholder="Your Email" value={email} onChange={(e) => setEmail(e.target.value)} required style={inp} /><br/>
          <button type="submit" style={btn}>Send Login Link</button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'center', padding: '40px', fontFamily: 'sans-serif' }}>
      {/* 2. LANDING VIEW (After Login) */}
      {view === 'landing' && (
        <>
          <h1 style={{color: '#00ad9f'}}>Welcome to AfriKazi</h1>
          <button onClick={() => setView('jobs')} style={btn}>Search for Jobs</button>
          <button onClick={() => setView('post')} style={{...btn, backgroundColor: '#333'}}>Post a Job</button>
          <button onClick={() => supabase.auth.signOut().then(() => window.location.reload())} style={{display:'block', margin:'20px auto', background:'none', border:'none', color:'red'}}>Logout</button>
        </>
      )}

      {/* 3. POST JOB VIEW */}
      {view === 'post' && (
        <form onSubmit={handlePostJob}>
          <h2>List a New Job</h2>
          <input name="job_title" placeholder="Job Title" required style={inp} /><br/>
          <input name="location" placeholder="Location" required style={inp} /><br/>
          <input name="pay" placeholder="Salary" required style={inp} /><br/>
          <textarea name="desc" placeholder="Job Description" style={{...inp, height: '80px'}} /><br/>
          <button type="submit" style={btn}>Publish Now</button>
          <button type="button" onClick={() => setView('landing')} style={{display:'block', margin:'auto', border:'none', background:'none'}}>Cancel</button>
        </form>
      )}

      {/* 4. SEARCH/LIST VIEW */}
      {view === 'jobs' && (
        <div>
          <h2>Available Openings</h2>
          {jobs.length === 0 ? <p>Loading jobs...</p> : jobs.map(j => (
            <div key={j.id} style={{border:'1px solid #eee', padding:'15px', margin:'10px auto', maxWidth:'400px', borderRadius:'10px', textAlign:'left'}}>
              <h3>{j.title}</h3>
              <p>📍 {j.location} | 💰 {j.pay}</p>
              <p>{j.Description}</p>
              <button style={{...btn, width: '100%'}}>Apply Now</button>
            </div>
          ))}
          <button onClick={() => setView('landing')} style={btn}>Back</button>
        </div>
      )}
    </div>
  );
}

export default App;
