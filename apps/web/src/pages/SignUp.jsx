import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser, createProject } from '../services/api';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [org, setOrg] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!email || !password || !org || !role) return setError('Please fill all fields');
    
    setError('');
    setLoading(true);
    
    try {
      const data = await registerUser({ email, password });
      localStorage.setItem('token', data.token);
      
      const newProj = await createProject({ name: `${org} Project`, description: 'Auto-generated project for ' + org });
      localStorage.setItem('currentProjectId', newProj._id);
      
      navigate('/blueprint');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-enerblock-red text-enerblock-dark min-h-screen flex flex-col overflow-x-hidden selection:bg-enerblock-dark selection:text-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        {/* Left Column: Content & Form */}
        <div className="flex flex-col justify-between p-6 lg:p-12 border-r border-enerblock-dark/20 relative z-10 bg-enerblock-red">
          <header className="flex justify-between items-center mb-16 lg:mb-24">
            <Link to="/" className="font-bold text-4xl md:text-5xl tracking-tighter uppercase headline text-white hover:text-enerblock-dark transition-colors">
              BLUEOPS.
            </Link>
            
          </header>
          
          <div className="flex-grow flex flex-col justify-center max-w-2xl">
            
            <h1 className="text-7xl md:text-9xl font-bold leading-none tracking-tighter text-enerblock-dark mb-12 headline italic">
              INITIALIZE<br />ACCOUNT
            </h1>
            
            <form onSubmit={handleRegister} className="space-y-10 w-full relative">
              {error && (
                <div className="bg-white/10 text-white px-4 py-3 border border-white/20 mono text-sm font-bold">
                  {error}
                </div>
              )}
              {/* Field 1 */}
              <div className="relative group">
                <label className="block mono text-xs uppercase tracking-widest text-enerblock-dark/70 mb-2 font-bold transition-colors group-focus-within:text-white" htmlFor="email">
                  Professional Email
                </label>
                <input 
                  className="w-full bg-transparent border-0 border-b-2 border-enerblock-dark/30 rounded-none px-0 py-3 text-enerblock-dark placeholder-enerblock-dark/40 focus:ring-0 focus:border-enerblock-dark transition-colors text-xl outline-none" 
                  id="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="architect@organization.com" 
                  type="email" 
                />
              </div>
              
              {/* Field 2 */}
              <div className="relative group">
                <label className="block mono text-xs uppercase tracking-widest text-enerblock-dark/70 mb-2 font-bold transition-colors group-focus-within:text-white" htmlFor="org">
                  Organization
                </label>
                <input 
                  className="w-full bg-transparent border-0 border-b-2 border-enerblock-dark/30 rounded-none px-0 py-3 text-enerblock-dark placeholder-enerblock-dark/40 focus:ring-0 focus:border-enerblock-dark transition-colors text-xl outline-none" 
                  id="org" 
                  value={org}
                  onChange={(e) => setOrg(e.target.value)}
                  placeholder="System Corp" 
                  type="text" 
                />
              </div>
              
              <div className="relative group">
                <label className="block mono text-xs uppercase tracking-widest text-enerblock-dark/70 mb-2 font-bold transition-colors group-focus-within:text-white" htmlFor="password">
                  Secure Password
                </label>
                <input 
                  className="w-full bg-transparent border-0 border-b-2 border-enerblock-dark/30 rounded-none px-0 py-3 text-enerblock-dark placeholder-enerblock-dark/40 focus:ring-0 focus:border-enerblock-dark transition-colors text-xl outline-none" 
                  id="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••" 
                  type="password" 
                />
              </div>
              
              {/* Field 3 */}
              <div className="relative group">
                <label className="block mono text-xs uppercase tracking-widest text-enerblock-dark/70 mb-2 font-bold transition-colors group-focus-within:text-white" htmlFor="role">
                  Architecture Role
                </label>
                <div className="relative">
                  <select 
                    className="w-full bg-transparent border-0 border-b-2 border-enerblock-dark/30 rounded-none px-0 py-3 text-enerblock-dark focus:ring-0 focus:border-enerblock-dark transition-colors appearance-none text-xl cursor-pointer outline-none" 
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option className="text-enerblock-dark bg-white" disabled value="">Select assignment...</option>
                    <option className="bg-white" value="devops">DevOps Engineer</option>
                    <option className="bg-white" value="sysadmin">Systems Administrator</option>
                    <option className="bg-white" value="architect">Cloud Architect</option>
                    <option className="bg-white" value="security">Security Specialist</option>
                  </select>
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-enerblock-dark group-focus-within:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                  </div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="pt-8 flex flex-col sm:flex-row items-center gap-8 justify-between">
                <button disabled={loading} className="w-full sm:w-auto bg-enerblock-dark text-white mono text-sm uppercase tracking-widest py-5 px-10 rounded-none hover:bg-white hover:text-enerblock-dark transition-colors duration-300 font-bold disabled:opacity-50" type="submit">
                  {loading ? 'INITIALIZING...' : 'CREATE ACCOUNT'}
                </button>
                <Link className="mono text-xs uppercase tracking-widest text-enerblock-dark hover:text-white transition-colors duration-200 font-bold border-b border-enerblock-dark hover:border-white pb-1" to="/login">
                  Already have access?
                </Link>
              </div>
            </form>
          </div>
          
          
        </div>
        
        {/* Right Column: Visual Blueprint */}
        <div className="hidden lg:block relative min-h-screen bg-enerblock-red overflow-hidden">
          <div className="absolute inset-0 w-full h-full">
            <img alt="Technical Blueprint Map" className="w-full h-full object-cover grayscale opacity-90 mix-blend-multiply" src="https://lh3.googleusercontent.com/aida/AP1WRLsx9W2qIA4JTVCeqcGl54m7w5Fnr_aLy-uHLml5A1OWLkCtujujIFbrQFTUUJz7wEl_1hHNGPshZLhSDw6CL8RYsvvEtxsifK4rfDlyinbLEixD8ePV3ypBAJohcMH5yc9HaBWs3xI7k7x5m6Bkmo3IPzalXRNjQLBBtG6UY_iPM372AWgNSd3Gk2aJ11CI2xwi5IvtCKkz4IuA5wYFRnfY0aRIvyODAvs58u1EmWUDbnQHcSJ78B7Zp3-7" />
          </div>
          
          {/* Overlay Grid / Architectural Lines */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Vertical Rules */}
            <div className="absolute top-0 bottom-0 left-[20%] w-px bg-enerblock-dark opacity-20"></div>
            <div className="absolute top-0 bottom-0 right-[20%] w-px bg-enerblock-dark opacity-20"></div>
            
            {/* Horizontal Rules */}
            <div className="absolute left-0 right-0 top-[30%] h-px bg-enerblock-dark opacity-20"></div>
            <div className="absolute left-0 right-0 bottom-[30%] h-px bg-enerblock-dark opacity-20"></div>
            
            {/* Floating Coordinates */}
            
            
          </div>
        </div>
      </div>
    </div>
  );
}
