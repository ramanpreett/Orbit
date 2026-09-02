import { fetchAuth } from '../utils/fetchAuth';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, ArrowRight, Loader2, Home } from 'lucide-react';

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
    <div className="min-h-screen flex items-center justify-center bg-[#FF90E8] text-slate-900 font-sans p-6 relative selection:bg-black selection:text-white overflow-hidden">
      {/* Dotted Background */}
      <div 
        className="fixed inset-0 pointer-events-none z-0" 
        style={{ 
          backgroundImage: 'radial-gradient(circle, black 1.5px, transparent 1.5px)', 
          backgroundSize: '32px 32px',
          opacity: 0.2
        }}
      />

      {/* Floating Dashboard Elements */}
      {/* Top Right: Mini Invoice */}
      <div className="absolute top-24 right-12 w-64 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rotate-6 z-0 hidden lg:block p-5 hover:rotate-0 transition-transform duration-300 cursor-default">
        <div className="flex justify-between items-center mb-4">
          <div className="font-black text-sm uppercase">Invoice #1042</div>
          <div className="bg-[#4DE3B1] text-xs font-bold px-2 py-1 border-2 border-black">PAID</div>
        </div>
        <div className="w-full h-2 bg-slate-200 mb-2"></div>
        <div className="w-2/3 h-2 bg-slate-200 mb-4"></div>
        <div className="font-black text-3xl">$1,250.00</div>
      </div>

      {/* Bottom Left: Mini Project Card */}
      <div className="absolute bottom-20 left-12 w-72 bg-[#E0F2FE] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] -rotate-6 z-0 hidden lg:block p-5 hover:rotate-0 transition-transform duration-300 cursor-default">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-black border-2 border-black flex items-center justify-center text-white"><User size={24} /></div>
          <div>
            <div className="font-black text-base uppercase">Website Redesign</div>
            <div className="text-sm font-bold text-slate-600 mt-1">Client: Acme Corp</div>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <div className="bg-[#FBBF24] border-2 border-black w-10 h-10 rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"></div>
          <div className="bg-[#FF90E8] border-2 border-black w-10 h-10 rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] -ml-4"></div>
          <div className="bg-white border-2 border-black w-10 h-10 rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] -ml-4 flex items-center justify-center text-xs font-black">+3</div>
        </div>
      </div>

      {/* Back to Home Button */}
      <Link 
        to="/" 
        className="absolute top-6 left-6 md:top-10 md:left-10 z-50 flex items-center justify-center gap-2 bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-xl px-4 py-3 font-black text-black uppercase tracking-wider hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-y-1 active:translate-x-1 active:shadow-none"
      >
        <Home size={24} className="stroke-[3]" />
        <span className="hidden sm:inline">Home</span>
      </Link>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-[#FEF08A] border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] rounded-2xl p-6 md:p-8 relative z-10 transform -rotate-1 hover:rotate-0 transition-transform duration-300">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-black uppercase tracking-tight bg-white inline-block px-4 py-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -rotate-2 mt-1">Create Account</h2>
            <p className="mt-2 text-black font-bold text-base">Start managing your projects</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-[#F43F5E] text-white font-bold p-3 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-black uppercase tracking-wide mb-1">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-black">
                    <User size={20} className="stroke-2" />
                  </div>
                  <input
                    type="text"
                    required
                    className="block w-full !pl-12 pr-4 py-2.5 !border-2 !border-black !rounded-xl font-bold bg-white focus:outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-black uppercase tracking-wide mb-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-black">
                    <Mail size={20} className="stroke-2" />
                  </div>
                  <input
                    type="email"
                    required
                    className="block w-full !pl-12 pr-4 py-2.5 !border-2 !border-black !rounded-xl font-bold bg-white focus:outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-black uppercase tracking-wide mb-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-black">
                    <Lock size={20} className="stroke-2" />
                  </div>
                  <input
                    type="password"
                    required
                    className="block w-full !pl-12 pr-4 py-2.5 !border-2 !border-black !rounded-xl font-bold bg-white focus:outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border-2 border-black rounded-xl font-black text-white bg-[#4DE3B1] hover:bg-[#3AC596] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-1 transition-all disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] uppercase tracking-wide text-black mt-2"
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

          <p className="mt-6 text-center font-bold text-slate-600">
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
