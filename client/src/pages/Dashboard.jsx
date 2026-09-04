import React, { useState, useEffect } from 'react';
import { Users, Briefcase, DollarSign, TrendingUp, ArrowUpRight } from 'lucide-react';
import { fetchAuth } from '../utils/fetchAuth';
import { Link } from 'react-router-dom';

const StatCard = ({ title, value, icon: Icon, bgColor }) => (
  <div className={`p-6 rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-start justify-between ${bgColor} transition-transform hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]`}>
    <div>
      <p className="text-sm font-black text-black mb-2 uppercase tracking-widest">{title}</p>
      <h3 className="text-4xl font-black text-black leading-none tracking-tight">{value}</h3>
    </div>
    <div className="opacity-80">
      <Icon className="w-10 h-10 text-black stroke-[3]" />
    </div>
  </div>
);

export default function Dashboard() {
  const [stats, setStats] = useState({ revenue: 0, activeProjects: 0, totalClients: 0, pendingInvoices: 0 });
  const [projects, setProjects] = useState([]);
  const [meetings, setMeetings] = useState([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [clientsRes, projectsRes, invoicesRes, meetingsRes] = await Promise.all([
          fetchAuth('/api/clients'),
          fetchAuth('/api/projects'),
          fetchAuth('/api/invoices'),
          fetchAuth('/api/meetings')
        ]);
        
        const clients = await clientsRes.json();
        const projs = await projectsRes.json();
        const invs = await invoicesRes.json();
        const mtgs = await meetingsRes.json();

        const parseAmount = (str) => {
          if (!str) return 0;
          const num = parseFloat(str.replace(/[^0-9.-]+/g, ""));
          return isNaN(num) ? 0 : num;
        };

        const revenue = invs.filter(i => i.status === 'Paid').reduce((acc, i) => acc + parseAmount(i.amount), 0);
        const pending = invs.filter(i => i.status === 'Pending' || i.status === 'Overdue').reduce((acc, i) => acc + parseAmount(i.amount), 0);
        const activeProjs = projs.filter(p => p.status !== 'Completed').length;

        setStats({
          revenue,
          activeProjects: activeProjs,
          totalClients: clients.length,
          pendingInvoices: pending
        });

        setProjects(projs.slice(0, 5)); // Top 5
        setMeetings(mtgs.slice(0, 4)); // Top 4
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      }
    };
    
    loadDashboardData();
  }, []);

  return (
    <div className="space-y-8 relative z-10">

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value={`$${stats.revenue.toLocaleString()}`} change="0%" icon={DollarSign} trend="up" bgColor="bg-[#4DE3B1]" iconColor="bg-white" />
        <StatCard title="Active Projects" value={stats.activeProjects} change="0" icon={Briefcase} trend="up" bgColor="bg-[#FEF08A]" iconColor="bg-white" />
        <StatCard title="Total Clients" value={stats.totalClients} change="0" icon={Users} trend="up" bgColor="bg-[#F43F5E]" iconColor="bg-white" />
        <StatCard title="Pending Invoices" value={`$${stats.pendingInvoices.toLocaleString()}`} change="0%" icon={TrendingUp} trend="down" bgColor="bg-[#E0F2FE]" iconColor="bg-white" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Recent Projects */}
        <div className="lg:col-span-2 bg-white rounded-2xl border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
          <div className="p-6 border-b-2 border-black flex items-center justify-between bg-[#E9D5FF]">
            <h2 className="text-xl font-black text-black uppercase">Active Projects</h2>
            <Link to="/projects" className="text-sm font-bold text-black hover:underline underline-offset-4 decoration-2 transition-colors flex items-center gap-1 bg-white px-3 py-1 border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:shadow-none">
              View All <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="p-0 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b-2 border-black">
                  <th className="py-4 px-6 text-sm font-black text-black uppercase tracking-wider border-r-2 border-black">Project Name</th>
                  <th className="py-4 px-6 text-sm font-black text-black uppercase tracking-wider border-r-2 border-black">Client</th>
                  <th className="py-4 px-6 text-sm font-black text-black uppercase tracking-wider border-r-2 border-black">Status</th>
                  <th className="py-4 px-6 text-sm font-black text-black uppercase tracking-wider text-right">Progress</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black">
                {projects.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6 text-sm font-bold text-black border-r-2 border-black">{item.name}</td>
                    <td className="py-4 px-6 text-sm font-bold text-slate-600 border-r-2 border-black">{item.client?.name || item.client}</td>
                    <td className="py-4 px-6 border-r-2 border-black">
                      <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-black ${item.badgeColor || 'bg-[#FEF08A]'}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm font-black text-black text-right">{item.progress}%</td>
                  </tr>
                ))}
                {projects.length === 0 && (
                  <tr><td colSpan="4" className="py-4 px-6 text-center text-sm font-bold text-slate-600">No active projects</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upcoming Meetings */}
        <div className="bg-white rounded-2xl border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden h-fit">
          <div className="p-6 border-b-2 border-black bg-[#F43F5E]">
            <h2 className="text-xl font-black text-white uppercase tracking-wider">Upcoming Meetings</h2>
          </div>
          <div className="p-0 divide-y-2 divide-black">
            {meetings.map((mtg, i) => (
              <Link key={i} to="/meetings" className="flex gap-4 items-center p-5 hover:bg-gray-50 transition-colors cursor-pointer group">
                <div className={`w-12 h-12 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] shrink-0 flex items-center justify-center bg-[#E0F2FE] group-hover:bg-[#BAE6FD] transition-colors`}>
                   <span className="font-black text-black text-xs text-center">{mtg.date.substring(0, 5)}</span>
                </div>
                <div>
                  <p className="text-base font-bold text-black group-hover:underline underline-offset-2">{mtg.title}</p>
                  <p className="text-sm font-bold text-slate-600 mt-0.5">{mtg.date}</p>
                </div>
              </Link>
            ))}
            {meetings.length === 0 && (
              <div className="p-5 text-center text-sm font-bold text-slate-600">No upcoming meetings</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
