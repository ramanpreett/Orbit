import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Briefcase, Calendar, Receipt, Box } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 font-sans selection:bg-purple-200 selection:text-slate-900 overflow-x-clip relative">
      {/* Universal Dotted Background */}
      <div 
        className="fixed inset-0 pointer-events-none z-0" 
        style={{ 
          backgroundImage: 'radial-gradient(circle, #CBD5E1 1.5px, transparent 1.5px)', 
          backgroundSize: '32px 32px' 
        }}
      />

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-[#FEF08A] border-b-2 border-black shadow-[0_4px_0_0_rgba(0,0,0,1)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center">
              <span className="text-white font-black text-lg leading-none">O</span>
            </div>
            <span className="text-2xl font-black tracking-tight uppercase">Orbit</span>
            </div>
            <div className="flex items-center gap-6">
              <Link to="/login" className="text-sm font-bold text-black hover:underline underline-offset-4 decoration-2 transition-all">
                Login
              </Link>
              <Link 
                to="/signup" 
                className="inline-flex h-11 items-center justify-center rounded-xl bg-black px-6 py-2 text-sm font-bold text-white transition-transform hover:-translate-y-1 shadow-[0_4px_0_0_rgba(0,0,0,0.3)] hover:shadow-[0_2px_0_0_rgba(0,0,0,0.3)] focus:outline-none border-2 border-transparent"
              >
                Sign up for free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 lg:pt-36 lg:pb-48 z-10 flex items-center justify-center min-h-[70vh]">
        
        {/* 4 Corner Diagrams - Visual / Abstract (Positioned relative to full screen width) */}
        
        {/* Top Left: Clients (People) */}
        <div className="absolute top-0 left-[-2rem] md:top-10 md:left-8 lg:left-16 -rotate-6 hidden md:block transition-transform hover:rotate-0 duration-300 z-30">
          <div className="bg-[#E0F2FE] border-2 border-black rounded-3xl p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center w-32 h-32 lg:w-40 lg:h-40 relative">
             <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
               {/* Person 2 (Left) */}
               <path d="M 5 85 A 20 25 0 0 1 45 85 Z" fill="#F43F5E" stroke="black" strokeWidth="4" strokeLinejoin="round" />
               <circle cx="25" cy="45" r="12" fill="#F43F5E" stroke="black" strokeWidth="4" />
               
               {/* Person 3 (Right) */}
               <path d="M 55 85 A 20 25 0 0 1 95 85 Z" fill="#10B981" stroke="black" strokeWidth="4" strokeLinejoin="round" />
               <circle cx="75" cy="45" r="12" fill="#10B981" stroke="black" strokeWidth="4" />
               
               {/* Person 1 (Center - Forefront) */}
               <path d="M 15 95 A 35 45 0 0 1 85 95 Z" fill="#0284C7" stroke="black" strokeWidth="4" strokeLinejoin="round" />
               <circle cx="50" cy="32" r="15" fill="#0284C7" stroke="black" strokeWidth="4" />
             </svg>
             <div className="absolute -top-3 -right-3 bg-white border-2 border-black text-xs font-bold px-3 py-1 rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">Clients</div>
          </div>
          <div className="mt-4 text-center">
            <span className="text-xs lg:text-sm font-bold text-slate-600 bg-white/80 px-3 py-1 rounded-full border border-slate-200">Centralized directory</span>
          </div>
        </div>

        {/* Top Right: Invoices (Money) */}
        <div className="absolute top-10 right-[-2rem] md:top-20 md:right-8 lg:right-16 rotate-12 hidden md:block transition-transform hover:rotate-0 duration-300 z-30">
          <div className="bg-[#FEF08A] border-2 border-black rounded-3xl p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] w-32 h-32 lg:w-40 lg:h-40 relative flex items-center justify-center gap-3">
             <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
               {/* Stacked Bill (Bottom) */}
               <rect x="15" y="15" width="70" height="45" rx="4" fill="#16A34A" stroke="black" strokeWidth="4" transform="rotate(5 50 50)" />
               
               {/* Main Bill */}
               <rect x="5" y="30" width="80" height="50" rx="4" fill="#22C55E" stroke="black" strokeWidth="4" transform="rotate(-15 50 50)" />
               <rect x="13" y="36" width="64" height="38" rx="2" fill="none" stroke="black" strokeWidth="2" strokeDasharray="4 4" transform="rotate(-15 50 50)" />
               <circle cx="45" cy="55" r="10" fill="#16A34A" stroke="black" strokeWidth="3" transform="rotate(-15 50 50)" />
               <text x="45" y="60" fontSize="16" fontWeight="bold" fill="white" textAnchor="middle" transform="rotate(-15 50 50)">$</text>
               
               {/* Floating Coin */}
               <circle cx="85" cy="20" r="14" fill="#F59E0B" stroke="black" strokeWidth="4" />
               <text x="85" y="26" fontSize="18" fontWeight="black" fill="black" textAnchor="middle">$</text>
             </svg>
             <div className="absolute -top-3 -left-3 bg-white border-2 border-black text-xs font-bold px-3 py-1 rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-black">Invoices</div>
          </div>
          <div className="mt-4 text-center">
            <span className="text-xs lg:text-sm font-bold text-slate-600 bg-white/80 px-3 py-1 rounded-full border border-slate-200">Track payments</span>
          </div>
        </div>

        {/* Bottom Left: Projects (Kanban Board) */}
        <div className="absolute bottom-24 left-[-1rem] md:bottom-36 md:left-12 lg:bottom-44 lg:left-24 rotate-[6deg] hidden md:block transition-transform hover:rotate-0 duration-300 z-30">
          <div className="bg-[#DCFCE7] border-2 border-black rounded-3xl p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] w-32 h-32 lg:w-40 lg:h-40 relative flex items-center justify-center">
             <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
               {/* Board Background */}
               <rect x="5" y="10" width="90" height="80" rx="8" fill="white" stroke="black" strokeWidth="4" />
               
               {/* Vertical Column Lines */}
               <line x1="35" y1="10" x2="35" y2="90" stroke="black" strokeWidth="3" />
               <line x1="65" y1="10" x2="65" y2="90" stroke="black" strokeWidth="3" />
               
               {/* Column 1 Tasks (To Do) */}
               <rect x="11" y="20" width="18" height="22" rx="3" fill="#F43F5E" stroke="black" strokeWidth="2" />
               <rect x="11" y="48" width="18" height="14" rx="3" fill="#F59E0B" stroke="black" strokeWidth="2" />
               
               {/* Column 2 Tasks (In Progress) */}
               <rect x="41" y="25" width="18" height="28" rx="3" fill="#3B82F6" stroke="black" strokeWidth="2" />
               <rect x="41" y="59" width="18" height="16" rx="3" fill="#A855F7" stroke="black" strokeWidth="2" />
               
               {/* Column 3 Tasks (Done) */}
               <rect x="71" y="15" width="18" height="20" rx="3" fill="#10B981" stroke="black" strokeWidth="2" />
               <rect x="71" y="41" width="18" height="26" rx="3" fill="#EC4899" stroke="black" strokeWidth="2" />
             </svg>
             <div className="absolute -top-3 -right-3 bg-white border-2 border-black text-xs font-bold px-3 py-1 rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] z-10">Projects</div>
          </div>
          <div className="mt-4 lg:mt-6 text-center relative z-20">
            <span className="text-xs lg:text-sm font-bold text-slate-600 bg-white/80 px-3 py-1 rounded-full border border-slate-200">Visual workflows</span>
          </div>
        </div>

        {/* Bottom Right: Meetings (Online Meeting) */}
        <div className="absolute bottom-24 right-[-1rem] md:bottom-32 md:right-10 lg:bottom-40 lg:right-20 -rotate-12 hidden md:block transition-transform hover:rotate-0 duration-300 z-30">
          <div className="bg-[#F5F3FF] border-2 border-black rounded-3xl p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] w-32 h-32 lg:w-40 lg:h-40 relative">
             <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
               {/* Laptop Screen */}
               <rect x="5" y="15" width="90" height="60" rx="4" fill="white" stroke="black" strokeWidth="4" />
               {/* Laptop Base */}
               <path d="M 0 75 L 100 75 L 90 85 L 10 85 Z" fill="#94A3B8" stroke="black" strokeWidth="4" strokeLinejoin="round" />
               
               {/* Video Grid inside screen */}
               <rect x="12" y="22" width="35" height="22" rx="2" fill="#3B82F6" stroke="black" strokeWidth="2" />
               <circle cx="29.5" cy="33" r="6" fill="white" />
               <rect x="53" y="22" width="35" height="22" rx="2" fill="#EF4444" stroke="black" strokeWidth="2" />
               <circle cx="70.5" cy="33" r="6" fill="white" />
               <rect x="12" y="48" width="35" height="22" rx="2" fill="#10B981" stroke="black" strokeWidth="2" />
               <circle cx="29.5" cy="59" r="6" fill="white" />
               <rect x="53" y="48" width="35" height="22" rx="2" fill="#F59E0B" stroke="black" strokeWidth="2" />
               <circle cx="70.5" cy="59" r="6" fill="white" />
             </svg>
             <div className="absolute -bottom-4 -left-4 bg-black text-white border-2 border-black text-xs font-bold px-3 py-1 rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">Meetings</div>
          </div>
          <div className="mt-4 lg:mt-6 text-center">
            <span className="text-xs lg:text-sm font-bold text-slate-600 bg-white/80 px-3 py-1 rounded-full border border-slate-200">Schedule syncing</span>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative w-full pointer-events-none">
          <div className="text-center max-w-4xl mx-auto flex flex-col items-center relative z-20 pointer-events-auto">
            
            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.2] flex flex-col items-center gap-4">
              <div className="flex items-center flex-wrap justify-center gap-3">
                <span className="bg-white px-2">The</span>
                <span className="relative inline-block px-4 py-1 bg-[#4DE3B1] border-2 border-black rounded-md rotate-[-2deg] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black">
                  all-in-one
                </span>
                <span className="bg-white px-2">workspace</span>
              </div>
              <div className="flex items-center flex-wrap justify-center gap-3">
                <span className="bg-white px-2">for</span>
                <span className="relative inline-block px-5 py-1 bg-[#8666F8] text-white border-2 border-black rounded-md rotate-[1deg] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  freelancers.
                </span>
              </div>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-3xl mx-auto font-medium leading-relaxed bg-white/50 backdrop-blur-sm px-6 py-3 rounded-2xl">
              Orbit centralizes your business into a clean dashboard. Stop relying on scattered spreadsheets and multiple apps. Focus on delivering quality work, not admin tasks.
            </p>

            <div className="flex items-center justify-center gap-4">
              <Link 
                to="/signup" 
                className="inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-[#F43F5E] px-8 text-lg font-bold text-white transition-transform hover:-translate-y-1 shadow-[0_8px_0_0_#9F1239] hover:shadow-[0_4px_0_0_#9F1239] active:translate-y-2 active:shadow-none"
              >
                Get Started Today
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section className="py-24 border-t-2 border-black z-10 relative mt-12 lg:mt-0">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-32 max-w-5xl mx-auto flex flex-col items-center">
            <h2 className="text-5xl md:text-7xl font-black tracking-tight text-black mb-8 uppercase flex flex-col items-center gap-4">
              <span className="inline-block bg-[#FF90E8] border-4 border-black px-6 py-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] -rotate-2">Everything you need.</span>
              <span className="inline-block bg-[#FEF08A] border-4 border-black px-6 py-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rotate-2">Nothing you don't.</span>
            </h2>
            <p className="text-black text-lg md:text-xl font-bold bg-white inline-block px-8 py-4 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] -rotate-1 mt-4">
              A meticulously designed toolset for managing the full lifecycle of your freelance clients.
            </p>
          </div>
          
          <div className="flex flex-col gap-24 max-w-3xl mx-auto pb-48">
            {/* Feature 1: Clients */}
            <div className="sticky top-32 group rounded-3xl bg-[#38BDF8] p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black rotate-[-2deg] transition-transform duration-300 hover:rotate-0 z-10">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="mb-4 text-3xl font-black text-black uppercase">Clients</h3>
              <ul className="space-y-4 text-black text-lg font-bold bg-white/40 p-6 rounded-2xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <li className="flex items-start gap-3"><ArrowRight className="h-6 w-6 text-black shrink-0 mt-0.5"/> Store and organize all client info in one place.</li>
                <li className="flex items-start gap-3"><ArrowRight className="h-6 w-6 text-black shrink-0 mt-0.5"/> Maintain a directory with contact details & project links.</li>
                <li className="flex items-start gap-3"><ArrowRight className="h-6 w-6 text-black shrink-0 mt-0.5"/> Quickly search, filter, and access information.</li>
              </ul>
            </div>

            {/* Feature 2: Projects */}
            <div className="sticky top-40 group rounded-3xl bg-[#4ADE80] p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black rotate-[2deg] transition-transform duration-300 hover:rotate-0 z-20">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black">
                <Briefcase className="h-8 w-8" />
              </div>
              <h3 className="mb-4 text-3xl font-black text-black uppercase">Projects</h3>
              <ul className="space-y-4 text-black text-lg font-bold bg-white/40 p-6 rounded-2xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <li className="flex items-start gap-3"><ArrowRight className="h-6 w-6 text-black shrink-0 mt-0.5"/> Create and manage multiple projects per client.</li>
                <li className="flex items-start gap-3"><ArrowRight className="h-6 w-6 text-black shrink-0 mt-0.5"/> Track status: Planning, In Progress, Review, Completed.</li>
                <li className="flex items-start gap-3"><ArrowRight className="h-6 w-6 text-black shrink-0 mt-0.5"/> Record descriptions, deadlines, and view progress visually.</li>
              </ul>
            </div>

            {/* Feature 3: Meetings */}
            <div className="sticky top-48 group rounded-3xl bg-[#FBBF24] p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black rotate-[-2deg] transition-transform duration-300 hover:rotate-0 z-30">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black">
                <Calendar className="h-8 w-8" />
              </div>
              <h3 className="mb-4 text-3xl font-black text-black uppercase">Meetings</h3>
              <ul className="space-y-4 text-black text-lg font-bold bg-white/40 p-6 rounded-2xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <li className="flex items-start gap-3"><ArrowRight className="h-6 w-6 text-black shrink-0 mt-0.5"/> Schedule meetings directly with clients.</li>
                <li className="flex items-start gap-3"><ArrowRight className="h-6 w-6 text-black shrink-0 mt-0.5"/> Record dates, times, agendas, and important notes.</li>
                <li className="flex items-start gap-3"><ArrowRight className="h-6 w-6 text-black shrink-0 mt-0.5"/> Keep interaction history and get upcoming reminders.</li>
              </ul>
            </div>

            {/* Feature 4: Invoices */}
            <div className="sticky top-56 group rounded-3xl bg-[#C084FC] p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black rotate-[2deg] transition-transform duration-300 hover:rotate-0 z-40">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black">
                <Receipt className="h-8 w-8" />
              </div>
              <h3 className="mb-4 text-3xl font-black text-black uppercase">Invoices</h3>
              <ul className="space-y-4 text-black text-lg font-bold bg-white/40 p-6 rounded-2xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <li className="flex items-start gap-3"><ArrowRight className="h-6 w-6 text-black shrink-0 mt-0.5"/> Create professional invoices in minutes.</li>
                <li className="flex items-start gap-3"><ArrowRight className="h-6 w-6 text-black shrink-0 mt-0.5"/> Track status: Draft, Sent, Paid, Overdue.</li>
                <li className="flex items-start gap-3"><ArrowRight className="h-6 w-6 text-black shrink-0 mt-0.5"/> Easily access payment history for financial tracking.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 z-10 relative">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <div className="bg-[#8666F8] rounded-[2rem] p-12 md:p-20 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.2]" style={{ backgroundImage: 'radial-gradient(circle, white 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }}></div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to organize your business?</h2>
              <p className="text-purple-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto font-medium">
                Join the new wave of freelancers managing their clients, projects, and finances without the stress.
              </p>
              <Link 
                to="/signup" 
                className="inline-flex h-14 items-center justify-center rounded-xl bg-white px-8 text-lg font-bold text-black transition-transform hover:-translate-y-1 shadow-[0_6px_0_0_#000] hover:shadow-[0_3px_0_0_#000] active:translate-y-2 active:shadow-none border-2 border-black"
              >
                Start for free
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t-2 border-black z-10 relative bg-[#FDFDFD]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-slate-800">
            <div className="h-6 w-6 bg-black rounded-md flex items-center justify-center text-white">
              <Box className="h-4 w-4" />
            </div>
            <span className="font-bold">Orbit &copy; {new Date().getFullYear()}</span>
          </div>
          <div className="flex gap-8 font-bold text-slate-600">
            <a href="#" className="hover:text-black transition-colors hover:underline">Privacy Policy</a>
            <a href="#" className="hover:text-black transition-colors hover:underline">Terms of Service</a>
            <a href="#" className="hover:text-black transition-colors hover:underline">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
