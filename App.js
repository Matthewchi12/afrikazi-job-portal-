import React, { useState, useEffect } from 'react';
import { 
  Search, MapPin, Briefcase, DollarSign, Menu, X, 
  Building, Zap, CheckCircle, ChevronRight, Heart, Share2, Sparkles
} from 'lucide-react';
{
  "name": "afrikazi-portal",
  "version": "1.0.0",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "lucide-react": "^0.263.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build"
  }
}

// --- MOCK 
const JOB_LISTINGS = [
  {
    id: 1,
    title: "Senior Frontend Engineer",
    company: "PayStack Africa",
    location: "Ikeja, Lagos (Hybrid)",
    type: "Full-Time",
    salary: "₦1.2M - ₦1.8M / month",
    posted: "2 days ago",
    logoColor: "bg-blue-600",
    tags: ["React", "FinTech", "Senior"],
    perks: ["Premium HMO", "13th Month Bonus", "MacBook Pro provided"],
    description: "We are looking for a Senior Frontend Engineer to help build the future of payments in Africa. You'll be working with a world-class team right here in Lagos, tackling complex problems in financial infrastructure."
  },
  {
    id: 2,
    title: "Product Marketing Manager",
    company: "AgroNaija Innovates",
    location: "Abuja, Nigeria",
    type: "Full-Time",
    salary: "₦600k - ₦900k / month",
    posted: "5 hours ago",
    logoColor: "bg-green-600",
    tags: ["AgriTech", "Marketing", "Mid-Level"],
    perks: ["Official Car", "Health Insurance", "Quarterly Retreats"],
    description: "Join us in revolutionizing the agricultural supply chain in Nigeria. You will lead marketing campaigns across the northern and southern agricultural belts, connecting farmers with buyers directly."
  },
  {
    id: 3,
    title: "Fullstack Developer (Remote)",
    company: "Pan-Africa Tech Hub",
    location: "Remote (Pan-African)",
    type: "Contract",
    salary: "$3,000 - $4,500 / month",
    posted: "1 day ago",
    logoColor: "bg-purple-600",
    tags: ["Node.js", "Vue", "Remote"],
    perks: ["Starlink Internet Provision", "Inverter/Power Allowance", "Flexible Hours"],
    description: "Work from anywhere in Africa! We need a solid fullstack developer to help build our cross-border logistics platform. We understand the local infrastructure challenges and provide allowances to ensure you stay online and productive."
  },
  {
    id: 4,
    title: "NYSC Intern - Data Analyst",
    company: "Kuda Bank",
    location: "Yaba, Lagos",
    type: "Internship",
    salary: "₦150k / month",
    posted: "Just now",
    logoColor: "bg-indigo-600",
    tags: ["Data", "Entry Level", "NYSC"],
    perks: ["Mentorship", "Free Lunch", "Career Progression"],
    description: "Calling all recent graduates! Start your career at the bank of the free. We are looking for bright minds currently undergoing their NYSC to join our data science team in Yaba."
  },
  {
    id: 5,
    title: "Logistics Operations Lead",
    company: "OgaDeliveries",
    location: "Port Harcourt, Rivers",
    type: "Full-Time",
    salary: "₦400k - ₦550k / month",
    posted: "3 days ago",
    logoColor: "bg-orange-500",
    tags: ["Operations", "Logistics", "Management"],
    perks: ["Fuel Allowance", "Performance Bonuses", "HMO + Family"],
    description: "Manage our fleet of delivery riders across the South-South region. You'll need deep knowledge of Port Harcourt routes and excellent people management skills to keep operations smooth."
  }
];

const apiKey = "";

async function fetchGeminiText(prompt, retries = 5) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
  const payload = {
    contents: [{ parts: [{ text: prompt }] }]
  };
  
  let attempt = 0;
  while (attempt <= retries) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated.";
    } catch (error) {
      attempt++;
      if (attempt > retries) {
        return "Failed to connect to AI. Please try again later.";
      }
      // Exponential backoff: 1s, 2s, 4s, 8s, 16s
      await new Promise(r => setTimeout(r, Math.pow(2, attempt - 1) * 1000));
    }
  }
}

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [filteredJobs, setFilteredJobs] = useState(JOB_LISTINGS);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isApplying, setIsApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);

  // AI Feature States
  const [aiCoverLetterPrompt, setAiCoverLetterPrompt] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [isGeneratingCL, setIsGeneratingCL] = useState(false);
  const [marketInsight, setMarketInsight] = useState("");
  const [isGeneratingInsight, setIsGeneratingInsight] = useState(false);

  // Reset AI states when a new job is selected
  useEffect(() => {
    if (selectedJob) {
      setAiCoverLetterPrompt("");
      setCoverLetter("");
      setMarketInsight("");
    }
  }, [selectedJob]);

  const handleGenerateInsight = async () => {
    if (!selectedJob) return;
    setIsGeneratingInsight(true);
    const prompt = `As an expert tech recruiter in Africa, provide a short 2-3 sentence insight on why the role of "${selectedJob.title}" at "${selectedJob.company}" (Salary: ${selectedJob.salary}, Location: ${selectedJob.location}) is a strong career move in the current African/Nigerian job market. Be enthusiastic and specific to the region.`;
    const response = await fetchGeminiText(prompt);
    setMarketInsight(response);
    setIsGeneratingInsight(false);
  };

  const handleGenerateCoverLetter = async () => {
    if (!selectedJob || !aiCoverLetterPrompt) return;
    setIsGeneratingCL(true);
    const prompt = `Draft a professional, concise cover letter/pitch (under 150 words) for the role of "${selectedJob.title}" at "${selectedJob.company}". The applicant's background/skills are: "${aiCoverLetterPrompt}". The job description is: "${selectedJob.description}". Make it sound natural, confident, and tailored to the African tech ecosystem. Leave the sign-off generic without placeholder brackets.`;
    const response = await fetchGeminiText(prompt);
    setCoverLetter(response);
    setIsGeneratingCL(false);
  };

  // Search Logic
  useEffect(() => {
    const results = JOB_LISTINGS.filter(job => {
      const matchesTitle = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           job.company.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLocation = job.location.toLowerCase().includes(locationQuery.toLowerCase());
      return matchesTitle && matchesLocation;
    });
    setFilteredJobs(results);
  }, [searchQuery, locationQuery]);

  const handleApply = (e) => {
    e.preventDefault();
    setIsApplying(true);
    // Simulate API call
    setTimeout(() => {
      setIsApplying(false);
      setApplySuccess(true);
      setTimeout(() => {
        setApplySuccess(false);
        setSelectedJob(null);
      }, 3000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center cursor-pointer" onClick={() => setSelectedJob(null)}>
              <div className="bg-green-600 text-white p-2 rounded-lg mr-2">
                <Zap size={24} />
              </div>
              <span className="font-bold text-2xl tracking-tight text-green-800">Afri<span className="text-gray-800">Kazi</span></span>
            </div>
            
            {/* Desktop Nav */}
            <div className="hidden md:flex space-x-8 items-center">
              <a href="#" className="text-gray-600 hover:text-green-600 font-medium transition-colors">Find Jobs</a>
              <a href="#" className="text-gray-600 hover:text-green-600 font-medium transition-colors">Companies</a>
              <a href="#" className="text-gray-600 hover:text-green-600 font-medium transition-colors">Salaries</a>
              <div className="h-6 w-px bg-gray-300"></div>
              <a href="#" className="text-gray-600 font-medium hover:text-gray-900">Sign In</a>
              <button className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-full font-medium transition-all shadow-md hover:shadow-lg">
                Post a Job
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600">
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 p-4 absolute w-full shadow-lg">
            <div className="flex flex-col space-y-4">
              <a href="#" className="text-gray-600 font-medium">Find Jobs</a>
              <a href="#" className="text-gray-600 font-medium">Companies</a>
              <a href="#" className="text-gray-600 font-medium">Sign In</a>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium">Post a Job</button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="bg-green-900 relative overflow-hidden">
        {/* African Pattern Overlay (CSS approximation) */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
              Find Your Next Big Role in <span className="text-yellow-400">Nigeria & Beyond</span>
            </h1>
            <p className="text-green-100 text-lg mb-10">
              Discover opportunities that match your skills, with local perks that actually matter—from remote stipends to HMOs that cover your family.
            </p>

            {/* Search Bar */}
            <div className="bg-white p-2 rounded-2xl shadow-xl flex flex-col md:flex-row gap-2">
              <div className="flex-1 flex items-center px-4 bg-gray-50 rounded-xl">
                <Search className="text-gray-400 mr-2" size={20} />
                <input 
                  type="text" 
                  placeholder="Job title, keywords, or company" 
                  className="w-full bg-transparent border-none focus:ring-0 py-3 text-gray-700 outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex-1 flex items-center px-4 bg-gray-50 rounded-xl">
                <MapPin className="text-gray-400 mr-2" size={20} />
                <input 
                  type="text" 
                  placeholder="City or 'Remote'" 
                  className="w-full bg-transparent border-none focus:ring-0 py-3 text-gray-700 outline-none"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                />
              </div>
              <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-bold transition-colors">
                Search
              </button>
            </div>
            
            <div className="mt-6 flex flex-wrap justify-center gap-2 text-sm text-green-100">
              <span>Trending in Naija:</span>
              <span className="bg-green-800/50 px-3 py-1 rounded-full cursor-pointer hover:bg-green-700">Tech in Yaba</span>
              <span className="bg-green-800/50 px-3 py-1 rounded-full cursor-pointer hover:bg-green-700">Remote Pan-Africa</span>
              <span className="bg-green-800/50 px-3 py-1 rounded-full cursor-pointer hover:bg-green-700">NYSC Friendly</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col lg:flex-row gap-8">
        
        {/* Left Sidebar - Filters (Desktop only for simplicity in this demo) */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
            <h3 className="font-bold text-lg mb-4 text-gray-800">Filter Search</h3>
            
            <div className="mb-6">
              <h4 className="font-semibold text-gray-700 mb-2">Job Type</h4>
              <div className="space-y-2">
                {["Full-Time", "Part-Time", "Contract", "Internship/NYSC"].map(type => (
                  <label key={type} className="flex items-center text-gray-600 cursor-pointer">
                    <input type="checkbox" className="rounded text-green-600 focus:ring-green-500 mr-2" />
                    {type}
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold text-gray-700 mb-2">Location Hubs</h4>
              <div className="space-y-2">
                {["Lagos (Mainland)", "Lagos (Island)", "Abuja", "Port Harcourt", "Remote"].map(loc => (
                  <label key={loc} className="flex items-center text-gray-600 cursor-pointer">
                    <input type="checkbox" className="rounded text-green-600 focus:ring-green-500 mr-2" />
                    {loc}
                  </label>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <h4 className="font-semibold text-gray-700 mb-2">Local Perks</h4>
              <div className="space-y-2">
                {["Power/Internet Allowance", "Premium HMO", "Fuel Allowance", "13th Month"].map(perk => (
                  <label key={perk} className="flex items-center text-gray-600 cursor-pointer">
                    <input type="checkbox" className="rounded text-green-600 focus:ring-green-500 mr-2" />
                    {perk}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Job Listings */}
        <div className="flex-1">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">
              {filteredJobs.length} {filteredJobs.length === 1 ? 'Job' : 'Jobs'} Found
            </h2>
            <select className="bg-white border border-gray-200 text-gray-600 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-green-500">
              <option>Most Recent</option>
              <option>Highest Salary</option>
              <option>Most Relevant</option>
            </select>
          </div>

          <div className="space-y-4">
            {filteredJobs.length === 0 ? (
              <div className="bg-white p-10 rounded-2xl text-center border border-gray-100 shadow-sm">
                <div className="text-gray-400 mb-4 flex justify-center"><Search size={48} /></div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">No Wahala! We just couldn't find a match.</h3>
                <p className="text-gray-500">Try adjusting your search terms or locations.</p>
              </div>
            ) : (
              filteredJobs.map(job => (
                <div 
                  key={job.id} 
                  className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group"
                  onClick={() => setSelectedJob(job)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                      {/* Mock Company Logo */}
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-xl ${job.logoColor}`}>
                        {job.company.charAt(0)}
                      </div>
                      
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">{job.title}</h3>
                        <div className="flex flex-wrap items-center text-gray-500 text-sm mt-1 gap-y-2">
                          <span className="flex items-center mr-4"><Building size={16} className="mr-1"/> {job.company}</span>
                          <span className="flex items-center mr-4"><MapPin size={16} className="mr-1"/> {job.location}</span>
                          <span className="flex items-center font-medium text-gray-700"><DollarSign size={16} className="mr-1"/> {job.salary}</span>
                        </div>
                      </div>
                    </div>
                    <button className="hidden md:flex text-gray-400 hover:text-red-500 transition-colors">
                      <Heart size={24} />
                    </button>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {job.tags.map(tag => (
                      <span key={tag} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                        {tag}
                      </span>
                    ))}
                    <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-medium flex items-center">
                      <CheckCircle size={12} className="mr-1" /> Verified Employer
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Job Details Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-start sticky top-0 bg-white/95 backdrop-blur z-10">
              <div className="flex gap-4">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-sm ${selectedJob.logoColor}`}>
                  {selectedJob.company.charAt(0)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedJob.title}</h2>
                  <p className="text-lg text-gray-600">{selectedJob.company}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200">
                  <Share2 size={20} />
                </button>
                <button onClick={() => setSelectedJob(null)} className="p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 hover:text-red-500">
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1">
              {/* Quick Info Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <MapPin className="text-gray-400 mb-2" size={20}/>
                  <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Location</div>
                  <div className="font-medium text-gray-900">{selectedJob.location}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <Briefcase className="text-gray-400 mb-2" size={20}/>
                  <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Job Type</div>
                  <div className="font-medium text-gray-900">{selectedJob.type}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <DollarSign className="text-gray-400 mb-2" size={20}/>
                  <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Salary</div>
                  <div className="font-medium text-gray-900">{selectedJob.salary}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <Zap className="text-gray-400 mb-2" size={20}/>
                  <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Posted</div>
                  <div className="font-medium text-gray-900">{selectedJob.posted}</div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">About the Role</h3>
                <p className="text-gray-600 leading-relaxed">{selectedJob.description}</p>
              </div>

              {/* AI Market Insight Feature */}
              <div className="mb-8 bg-indigo-50 border border-indigo-100 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-indigo-900 flex items-center">
                    <Sparkles className="mr-2 text-indigo-600" size={24} /> 
                    AI Market Insight
                  </h3>
                  {!marketInsight && (
                    <button 
                      onClick={handleGenerateInsight}
                      disabled={isGeneratingInsight}
                      className="text-sm bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50"
                    >
                      {isGeneratingInsight ? "Analyzing..." : "✨ Analyze Opportunity"}
                    </button>
                  )}
                </div>
                {marketInsight && (
                  <p className="text-indigo-800 leading-relaxed italic border-l-4 border-indigo-400 pl-4">
                    "{marketInsight}"
                  </p>
                )}
                {!marketInsight && !isGeneratingInsight && (
                  <p className="text-indigo-600/70 text-sm">Use Gemini AI to analyze why this role is a great fit in the current Nigerian job market.</p>
                )}
              </div>

              {/* Local Perks - The "Unique to Africa/Nigeria" aspect */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Local Perks & Benefits</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedJob.perks.map((perk, i) => (
                    <div key={i} className="flex items-center bg-green-50/50 p-3 rounded-lg border border-green-100">
                      <CheckCircle size={18} className="text-green-600 mr-3 flex-shrink-0"/>
                      <span className="text-gray-700 font-medium">{perk}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Application Form Area */}
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 mt-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Apply Now</h3>
                {applySuccess ? (
                  <div className="bg-green-100 text-green-800 p-6 rounded-xl text-center flex flex-col items-center">
                    <CheckCircle size={48} className="mb-4 text-green-600" />
                    <h4 className="font-bold text-xl mb-2">Application Submitted!</h4>
                    <p>Your profile has been sent to {selectedJob.company}. Good luck!</p>
                  </div>
                ) : (
                  <form onSubmit={handleApply} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                        <input required type="text" className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder="Chukwudi" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                        <input required type="text" className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder="Okonkwo" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                      <input required type="email" className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder="name@example.com" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Resume / CV</label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-100 transition-colors cursor-pointer bg-white">
                        <p className="text-gray-500 text-sm">Click to upload or drag and drop</p>
                        <p className="text-xs text-gray-400 mt-1">PDF, DOCX up to 5MB</p>
                      </div>
                    </div>

                    {/* AI Cover Letter Generator */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-5 rounded-xl border border-green-100 mt-4">
                      <div className="flex items-center justify-between mb-3">
                        <label className="block text-sm font-bold text-green-900 flex items-center">
                          <Sparkles size={16} className="mr-1 text-green-600" />
                          Cover Letter / Pitch
                        </label>
                      </div>
                      
                      {!coverLetter ? (
                        <div className="space-y-3">
                          <p className="text-xs text-green-700">Not sure what to write? Give Gemini AI a few keywords about your experience, and we'll draft it for you!</p>
                          <div className="flex gap-2">
                            <input 
                              type="text" 
                              value={aiCoverLetterPrompt}
                              onChange={(e) => setAiCoverLetterPrompt(e.target.value)}
                              placeholder="e.g. 3 yrs React, built a fintech app, fast learner..." 
                              className="flex-1 bg-white border border-green-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500"
                            />
                            <button 
                              type="button"
                              onClick={handleGenerateCoverLetter}
                              disabled={isGeneratingCL || !aiCoverLetterPrompt}
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap disabled:opacity-50 transition-colors"
                            >
                              {isGeneratingCL ? "Drafting..." : "✨ Auto-Draft"}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <textarea 
                            value={coverLetter}
                            onChange={(e) => setCoverLetter(e.target.value)}
                            className="w-full bg-white border border-green-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500 min-h-[150px] text-sm text-gray-700"
                          />
                          <button 
                            type="button"
                            onClick={() => setCoverLetter("")}
                            className="text-xs text-red-500 hover:text-red-700 font-medium"
                          >
                            Discard & Start Over
                          </button>
                        </div>
                      )}
                    </div>

                    <button 
                      type="submit" 
                      disabled={isApplying}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-xl transition-colors flex justify-center items-center"
                    >
                      {isApplying ? (
                        <span className="animate-pulse">Submitting...</span>
                      ) : (
                        <>Submit Application <ChevronRight size={20} className="ml-2" /></>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Simple Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500">
          <div className="flex justify-center items-center mb-4">
            <Zap size={20} className="text-green-600 mr-2" />
            <span className="font-bold text-xl tracking-tight text-gray-800">Afri<span className="text-green-600">Kazi</span></span>
          </div>
          <p className="mb-4">Connecting Pan-African talent with world-class opportunities.</p>
          <div className="flex justify-center space-x-6 text-sm">
            <a href="#" className="hover:text-green-600">About Us</a>
            <a href="#" className="hover:text-green-600">Privacy Policy</a>
            <a href="#" className="hover:text-green-600">Terms of Service</a>
            <a href="#" className="hover:text-green-600">Employers</a>
          </div>
          <p className="mt-8 text-sm">© 2026 AfriKazi. Built for Nigeria, by Africa.</p>
        </div>
      </footer>
    </div>
  );
}
