import { Users, Briefcase, DollarSign, TrendingUp, ArrowUpRight } from 'lucide-react';

const StatCard = ({ title, value, change, icon: Icon, trend, bgColor, iconColor }) => (
  <div className={`p-6 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between ${bgColor} transition-transform hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]`}>
    <div>
      <p className="text-sm font-bold text-black mb-1 uppercase tracking-wider">{title}</p>
      <h3 className="text-3xl font-black text-black">{value}</h3>
      <div className="flex items-center gap-2 mt-2">
        <span className={`text-sm font-bold px-2 py-0.5 rounded-md border-2 border-black bg-white ${trend === 'up' ? 'text-black' : 'text-red-600'}`}>
          {change}
        </span>
        <span className="text-xs font-bold text-black/70">vs last month</span>
      </div>
    </div>
    <div className={`p-4 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${iconColor}`}>
      <Icon className="w-8 h-8 text-black" />
    </div>
  </div>
);

export default function Dashboard() {
  return (
    <div className="space-y-8 relative z-10">
      <div className="flex items-center justify-between bg-white border-2 border-black p-6 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div>
          <h1 className="text-3xl font-black text-black uppercase tracking-tight">Dashboard Overview</h1>
          <p className="text-sm font-bold text-slate-600 mt-1">Here's what's happening with your freelance business today.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value="$0" change="0%" icon={DollarSign} trend="up" bgColor="bg-[#4DE3B1]" iconColor="bg-white" />
        <StatCard title="Active Projects" value="0" change="0" icon={Briefcase} trend="up" bgColor="bg-[#FEF08A]" iconColor="bg-white" />
        <StatCard title="Total Clients" value="0" change="0" icon={Users} trend="up" bgColor="bg-[#F43F5E]" iconColor="bg-white" />
        <StatCard title="Pending Invoices" value="$0" change="0%" icon={TrendingUp} trend="down" bgColor="bg-[#E0F2FE]" iconColor="bg-white" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Recent Projects */}
        <div className="lg:col-span-2 bg-white rounded-2xl border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
          <div className="p-6 border-b-2 border-black flex items-center justify-between bg-[#E9D5FF]">
            <h2 className="text-xl font-black text-black uppercase">Active Projects</h2>
            <button className="text-sm font-bold text-black hover:underline underline-offset-4 decoration-2 transition-colors flex items-center gap-1 bg-white px-3 py-1 border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:shadow-none">
              View All <ArrowUpRight className="w-4 h-4" />
            </button>
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
                {[].map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6 text-sm font-bold text-black border-r-2 border-black">{item.name}</td>
                    <td className="py-4 px-6 text-sm font-bold text-slate-600 border-r-2 border-black">{item.client}</td>
                    <td className="py-4 px-6 border-r-2 border-black">
                      <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-black ${item.statusBg}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm font-black text-black text-right">{item.progress}</td>
                  </tr>
                ))}
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
            {[].map((mtg, i) => (
              <div key={i} className="flex gap-4 items-center p-5 hover:bg-gray-50 transition-colors">
                <div className={`w-12 h-12 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] shrink-0 flex items-center justify-center ${mtg.color}`}>
                   <span className="font-black text-black text-sm">{mtg.time.split(' ')[0]}</span>
                </div>
                <div>
                  <p className="text-base font-bold text-black">{mtg.title}</p>
                  <p className="text-sm font-bold text-slate-600 mt-0.5">{mtg.time} • {mtg.client}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
