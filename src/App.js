 import React, { useState, useEffect } from 'react';

// This tells the app to use the Supabase engine we loaded in the HTML file
const supabaseURL = 'https://vefxeiroytqenjxkftx.supabase.co';
const supabaseKey = 'sb_publishable_JcXd7KhJuhV97qu489U-1g_sFfQ8UbP';
const supabase = window.supabase.createClient(supabaseURL, supabaseKey);

function App() {
  const [view, setView] = useState('landing'); 
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      const { data } = await supabase.from('jobs').select('*').order('created_at', { ascending: false });
      if (data) setJobs(data);
    };
    fetchJobs();
  }, []);

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
      window.location.reload();
    } else {
      alert("Error: " + error.message);
    }
  };

  const btn = { padding: '12px', backgroundColor: '#00ad9f', color: 'white', border: 'none', borderRadius: '5px', margin: '10px', fontWeight: 'bold', cursor: 'pointer' };
  const inp = { padding: '10px', margin: '5px', width: '280px', borderRadius: '5px', border: '1px solid #ccc' };

  return (
    <div style={{ textAlign: 'center', padding: '40px', fontFamily: 'sans-serif' }}>
      {view === 'landing' && (
        <>
          <h1 style={{color: '#00ad9f'}}>AfriKazi Portal</h1>
          <button onClick={() => setView('jobs')} style={btn}>Find a Job</button>
          <button onClick={() => setView('post')} style={{...btn, backgroundColor: '#333'}}>Post a Job</button>
        </>
      )}

      {view === 'post' && (
        <form onSubmit={handlePostJob}>
          <h2>List a New Job</h2>
          <input name="job_title" placeholder="Job Title" required style={inp} /><br/>
          <input name="location" placeholder="Location" required style={inp} /><br/>
          <input name="pay" placeholder="Salary" required style={inp} /><br/>
          <textarea name="desc" placeholder="Job Description" style={{...inp, height: '80px'}} /><br/>
          <button type="submit" style={btn}>Publish Now</button>
          <button type="button" onClick={() => setView('landing')} style={{display:'block', margin:'auto', color:'blue', border:'none', background:'none'}}>Cancel</button>
        </form>
      )}

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
