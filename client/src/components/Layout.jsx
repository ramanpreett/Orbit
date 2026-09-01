import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Briefcase, Calendar, FileText, Settings, Bell, Search, Menu, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const SidebarItem = ({ icon: Icon, label, path }) => {
  const location = useLocation();
  const isActive = location.pathname === path;
  
  return (
    <Link
      to={path}
      className={cn(
        "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group border-2 border-transparent font-bold",
        isActive 
          ? "bg-[#4DE3B1] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black" 
          : "text-slate-700 hover:bg-[#F5F3FF] hover:border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:text-black hover:-translate-y-1"
      )}
    >
      <Icon className={cn("w-5 h-5", isActive ? "text-black" : "text-slate-500 group-hover:text-black")} />
      <span className="text-[14px]">{label}</span>
    </Link>
  );
};

export const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-[#FDFDFD] text-slate-900 font-sans selection:bg-purple-200 selection:text-slate-900 relative">
      
      {/* Universal Dotted Background for Dashboard */}
      <div 
        className="fixed inset-0 pointer-events-none z-0" 
        style={{ 
          backgroundImage: 'radial-gradient(circle, #CBD5E1 1.5px, transparent 1.5px)', 
          backgroundSize: '32px 32px' 
        }}
      />

      {/* Sidebar */}
      <aside className="w-[260px] border-r-4 border-black bg-white flex flex-col justify-between shrink-0 hidden md:flex z-20">
        <div>
          <div className="h-20 flex items-center px-6 border-b-4 border-black bg-[#FEF08A]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center">
                <span className="text-white font-black text-lg leading-none">O</span>
              </div>
              <span className="text-2xl font-black tracking-tight uppercase">Orbit</span>
            </div>
          </div>
          
          <nav className="p-4 space-y-2 mt-4">
            <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Overview</p>
            <SidebarItem icon={LayoutDashboard} label="Dashboard" path="/dashboard" />
            <SidebarItem icon={Users} label="Clients" path="/clients" />
            <SidebarItem icon={Briefcase} label="Projects" path="/projects" />
            
            <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 mt-8">Management</p>
            <SidebarItem icon={Calendar} label="Meetings" path="/meetings" />
            <SidebarItem icon={FileText} label="Invoices" path="/invoices" />
          </nav>
        </div>
        
        <div className="p-4 border-t-4 border-black bg-white">
          <SidebarItem icon={Settings} label="Settings" path="/settings" />
          
          <div className="mt-4 px-4 py-3 flex items-center justify-between rounded-xl border-2 border-black bg-[#E0F2FE] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-lg border-2 border-black bg-white flex items-center justify-center overflow-hidden shrink-0">
                 <img src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=E0F2FE&color=000&bold=true`} alt="Profile" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-black truncate">{user?.name || 'User'}</p>
                <p className="text-xs font-bold text-slate-600 truncate">{user?.email || 'user@example.com'}</p>
              </div>
            </div>
            <button onClick={handleLogout} className="text-slate-500 hover:text-black transition-colors" title="Logout">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 z-10 relative">
        {/* Top Header */}
        <header className="h-20 border-b-4 border-black bg-white flex items-center justify-between px-6 shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-4 flex-1">
            <button className="md:hidden p-2 text-black hover:text-slate-600 border-2 border-transparent hover:border-black rounded-lg transition-all">
              <Menu className="w-6 h-6" />
            </button>
            <div className="relative w-full max-w-md hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-black font-bold" />
              <input 
                type="text" 
                placeholder="Search anything..." 
                className="w-full bg-white border-2 border-black rounded-xl py-2.5 pl-10 pr-4 text-sm font-bold text-black placeholder:text-slate-500 focus:outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all focus:translate-y-1 focus:shadow-none"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <button className="relative p-2 text-black border-2 border-transparent rounded-xl hover:border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all bg-white">
              <Bell className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-3 h-3 bg-[#F43F5E] rounded-full border-2 border-black"></span>
            </button>
            <button className="px-6 py-2.5 text-sm font-bold bg-[#8666F8] text-white rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-1 transition-all flex items-center gap-2">
              + New Project
            </button>
          </div>
        </header>
        
        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8 relative">
          <div className="max-w-6xl mx-auto h-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};
