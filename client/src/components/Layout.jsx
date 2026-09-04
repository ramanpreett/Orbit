import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Briefcase, Calendar, FileText, Settings, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const SidebarItem = ({ icon: Icon, label, path, isCollapsed }) => {
  const location = useLocation();
  const isActive = location.pathname === path;
  
  return (
    <Link
      to={path}
      className={cn(
        "flex items-center px-4 py-2.5 rounded-xl transition-all duration-200 group border-2 border-transparent font-bold",
        isCollapsed ? "justify-center" : "gap-3",
        isActive 
          ? "bg-[#4DE3B1] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black" 
          : "text-slate-700 hover:bg-[#F5F3FF] hover:border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:text-black hover:-translate-y-1"
      )}
      title={isCollapsed ? label : undefined}
    >
      <Icon className={cn("w-5 h-5 shrink-0", isActive ? "text-black" : "text-slate-500 group-hover:text-black")} />
      {!isCollapsed && <span className="text-[14px] truncate">{label}</span>}
    </Link>
  );
};

export const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-[#FDFDFD] text-slate-900 font-sans selection:bg-purple-200 selection:text-slate-900 relative transition-all duration-300">
      
      {/* Universal Dotted Background for Dashboard */}
      <div 
        className="fixed inset-0 pointer-events-none z-0" 
        style={{ 
          backgroundImage: 'radial-gradient(circle, #CBD5E1 1.5px, transparent 1.5px)', 
          backgroundSize: '32px 32px' 
        }}
      />

      {/* Sidebar */}
      <aside className={cn(
        "border-r-4 border-black bg-white flex flex-col justify-between shrink-0 hidden md:flex z-20 transition-all duration-300 relative",
        isCollapsed ? "w-[88px]" : "w-[260px]"
      )}>
        {/* Toggle Button */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-4 top-6 w-8 h-8 bg-white border-2 border-black rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-0.5 transition-all z-30 text-black"
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>

        <div>
          <div className="h-20 flex items-center px-6 border-b-4 border-black bg-[#FEF08A] overflow-hidden">
            <div className={cn("flex items-center gap-2", isCollapsed && "justify-center w-full")}>
              <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center shrink-0">
                <span className="text-white font-black text-lg leading-none">O</span>
              </div>
              {!isCollapsed && <span className="text-2xl font-black tracking-tight uppercase truncate">Orbit</span>}
            </div>
          </div>
          
          <nav className="p-4 space-y-2 mt-4">
            {!isCollapsed && <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 truncate">Overview</p>}
            <SidebarItem icon={LayoutDashboard} label="Dashboard" path="/dashboard" isCollapsed={isCollapsed} />
            <SidebarItem icon={Users} label="Clients" path="/clients" isCollapsed={isCollapsed} />
            <SidebarItem icon={Briefcase} label="Projects" path="/projects" isCollapsed={isCollapsed} />
            
            {!isCollapsed && <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 mt-8 truncate">Management</p>}
            {isCollapsed && <div className="h-px bg-slate-200 my-4 mx-4"></div>}
            <SidebarItem icon={Calendar} label="Meetings" path="/meetings" isCollapsed={isCollapsed} />
            <SidebarItem icon={FileText} label="Invoices" path="/invoices" isCollapsed={isCollapsed} />
          </nav>
        </div>
        
        <div className="p-4 border-t-4 border-black bg-white">
          <SidebarItem icon={Settings} label="Settings" path="/settings" isCollapsed={isCollapsed} />
          
          <div className={cn(
            "mt-4 flex items-center rounded-xl border-2 border-black bg-[#E0F2FE] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
            isCollapsed ? "justify-center p-2" : "justify-between px-4 py-3"
          )}>
            <div className={cn("flex items-center gap-3 min-w-0", isCollapsed && "justify-center")}>
              <div className="w-10 h-10 rounded-lg border-2 border-black bg-white flex items-center justify-center overflow-hidden shrink-0">
                 <img src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=E0F2FE&color=000&bold=true`} alt="Profile" />
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-black truncate">{user?.name || 'User'}</p>
                  <p className="text-xs font-bold text-slate-600 truncate">{user?.email || 'user@example.com'}</p>
                </div>
              )}
            </div>
            {!isCollapsed && (
              <button onClick={handleLogout} className="text-slate-500 hover:text-black transition-colors shrink-0" title="Logout">
                <LogOut className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 z-10 relative transition-all duration-300">
        
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
