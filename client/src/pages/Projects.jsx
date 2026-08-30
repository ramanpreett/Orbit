import React, { useState, useEffect } from 'react';
import { Calendar, Clock, ArrowRight, X } from 'lucide-react';

const initialProjects = [];

const bgColors = ["bg-[#E0F2FE]", "bg-[#FEF08A]", "bg-[#E9D5FF]", "bg-[#4DE3B1]", "bg-[#F43F5E]"];
const badgeColors = ["bg-[#4DE3B1]", "bg-[#F59E0B]", "bg-[#FDFDFD]", "bg-[#8666F8]", "bg-[#FEF08A]"];

export default function Projects() {
  const [projects, setProjects] = useState(initialProjects);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', client: '', status: 'Planning', dueDate: '', progress: 0 });

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => setProjects(data))
      .catch(err => console.error(err));
  }, []);

  const handleAddProject = async (e) => {
    e.preventDefault();
    if (!newProject.name || !newProject.client) return;

    const randomBg = bgColors[Math.floor(Math.random() * bgColors.length)];
    const randomBadge = badgeColors[Math.floor(Math.random() * badgeColors.length)];

    const projectData = {
      ...newProject,
      bg: randomBg,
      badgeColor: randomBadge
    };

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData)
      });
      const savedProject = await res.json();
      setProjects([savedProject, ...projects]);
      setIsModalOpen(false);
      setNewProject({ name: '', client: '', status: 'Planning', dueDate: '', progress: 0 });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 relative z-10">
      <div className="flex items-center justify-between bg-white border-2 border-black p-6 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-black text-black uppercase tracking-tight">Projects</h1>
          <p className="text-sm font-bold text-slate-600 mt-1">Track the status and progress of all your active work.</p>
        </div>
        <div className="flex gap-4 flex-wrap">
          <select className="bg-white border-2 border-black text-black font-bold text-sm rounded-xl px-4 py-2 outline-none focus:ring-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] appearance-none cursor-pointer">
            <option>All Projects</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#4DE3B1] text-black px-6 py-2 rounded-xl font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-1 transition-all"
          >
            + New Project
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map(project => (
          <div key={project._id || project.id} className="bg-white rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 flex flex-col hover:-translate-y-2 transition-transform cursor-pointer relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-32 h-32 ${project.bg} rounded-bl-full -z-10 border-b-4 border-l-4 border-black`}></div>
            
            <div className="flex justify-between items-start mb-6 z-10">
              <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-black ${project.badgeColor}`}>
                {project.status}
              </span>
              <button className="text-black bg-white border-2 border-black p-1.5 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-0.5 transition-all">
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            
            <h3 className="text-xl font-black text-black mb-1 z-10">{project.name}</h3>
            <p className="text-sm font-bold text-slate-600 mb-8 z-10">{project.client}</p>
            
            <div className="mt-auto space-y-4 z-10">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-bold text-black uppercase tracking-wider text-xs">Progress</span>
                  <span className="font-black text-black">{project.progress}%</span>
                </div>
                <div className="w-full bg-white border-2 border-black rounded-full h-4 shadow-[inset_2px_2px_0px_0px_rgba(0,0,0,0.2)] overflow-hidden">
                  <div className={`${project.badgeColor} h-full border-r-2 border-black`} style={{ width: `${project.progress}%` }}></div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-xs font-bold text-black pt-5 border-t-4 border-black">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Due {project.dueDate || "TBD"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>-- days left</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-[#FEF08A] border-b-4 border-black p-4 flex items-center justify-between">
              <h2 className="text-xl font-black text-black uppercase">Create New Project</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 border-2 border-black rounded-lg bg-white hover:bg-black hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddProject} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-black mb-1">Project Name</label>
                <input 
                  type="text" 
                  required
                  value={newProject.name}
                  onChange={e => setNewProject({...newProject, name: e.target.value})}
                  className="w-full bg-white border-2 border-black rounded-xl py-2 px-3 text-black font-bold focus:outline-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  placeholder="Website Redesign"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-black mb-1">Client Name</label>
                <input 
                  type="text" 
                  required
                  value={newProject.client}
                  onChange={e => setNewProject({...newProject, client: e.target.value})}
                  className="w-full bg-white border-2 border-black rounded-xl py-2 px-3 text-black font-bold focus:outline-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  placeholder="Acme Corp"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-black mb-1">Status</label>
                  <select 
                    value={newProject.status}
                    onChange={e => setNewProject({...newProject, status: e.target.value})}
                    className="w-full bg-white border-2 border-black rounded-xl py-2 px-3 text-black font-bold focus:outline-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] appearance-none"
                  >
                    <option value="Planning">Planning</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Review">Review</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-black mb-1">Progress (%)</label>
                  <input 
                    type="number" 
                    min="0" max="100"
                    value={newProject.progress}
                    onChange={e => setNewProject({...newProject, progress: e.target.value})}
                    className="w-full bg-white border-2 border-black rounded-xl py-2 px-3 text-black font-bold focus:outline-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-black mb-1">Due Date</label>
                <input 
                  type="text" 
                  value={newProject.dueDate}
                  onChange={e => setNewProject({...newProject, dueDate: e.target.value})}
                  className="w-full bg-white border-2 border-black rounded-xl py-2 px-3 text-black font-bold focus:outline-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  placeholder="e.g. Dec 31, 2026"
                />
              </div>
              
              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 rounded-xl font-bold border-2 border-transparent text-slate-600 hover:text-black hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-[#4DE3B1] text-black px-6 py-2 rounded-xl font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-1 transition-all"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
