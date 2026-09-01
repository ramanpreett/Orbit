import { fetchAuth } from '../utils/fetchAuth';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const success = await register(name, email, password);
    setIsSubmitting(false);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFDFD] text-slate-900 font-sans p-6 relative selection:bg-purple-200">
      {/* Dotted Background */}
      <div 
        className="fixed inset-0 pointer-events-none z-0" 
        style={{ 
          backgroundImage: 'radial-gradient(circle, #CBD5E1 1.5px, transparent 1.5px)', 
          backgroundSize: '32px 32px' 
        }}
      />

      <div className="w-full max-w-md relative z-10">
        {/* Decorative elements */}
        <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#4DE3B1] rounded-full border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-0 hidden md:block"></div>
        <div className="absolute -bottom-8 -left-8 w-20 h-20 bg-[#E0F2FE] border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -rotate-6 z-0 hidden md:block"></div>

        <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-2xl p-8 relative z-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-black mb-4">
              <span className="text-white font-black text-3xl leading-none">F</span>
            </div>
            <h2 className="text-3xl font-black uppercase tracking-tight">Create Account</h2>
            <p className="mt-2 text-slate-600 font-bold">Start managing your projects</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-[#F43F5E] text-white font-bold p-4 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                {error}
              </div>
            )}
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-black uppercase tracking-wide mb-2">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-black">
                    <User size={20} className="stroke-2" />
                  </div>
                  <input
                    type="text"
                    required
                    className="block w-full pl-16 pr-4 py-3 border-2 border-black rounded-xl font-bold bg-[#F8FAFC] focus:bg-white placeholder:text-slate-400 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all focus:-translate-y-1"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-black uppercase tracking-wide mb-2">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-black">
                    <Mail size={20} className="stroke-2" />
                  </div>
                  <input
                    type="email"
                    required
                    className="block w-full pl-16 pr-4 py-3 border-2 border-black rounded-xl font-bold bg-[#F8FAFC] focus:bg-white placeholder:text-slate-400 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all focus:-translate-y-1"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-black uppercase tracking-wide mb-2">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-black">
                    <Lock size={20} className="stroke-2" />
                  </div>
                  <input
                    type="password"
                    required
                    className="block w-full pl-16 pr-4 py-3 border-2 border-black rounded-xl font-bold bg-[#F8FAFC] focus:bg-white placeholder:text-slate-400 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all focus:-translate-y-1"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 border-2 border-black rounded-xl font-black text-white bg-[#4DE3B1] hover:bg-[#3AC596] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-1 transition-all disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] uppercase tracking-wide text-black"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <>
                  Create Account
                  <ArrowRight size={20} className="stroke-2" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center font-bold text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="text-black hover:text-[#4DE3B1] hover:underline underline-offset-4 decoration-2">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
