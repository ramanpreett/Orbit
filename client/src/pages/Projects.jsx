import React, { useState, useEffect } from 'react';
import { Calendar, Clock, X, Trash2, Edit2, MoreVertical, FileText } from 'lucide-react';
import { fetchAuth } from '../utils/fetchAuth';
import toast from 'react-hot-toast';
import DatePicker from '../components/DatePicker';
import Select from '../components/Select';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';

const initialProjects = [];

const bgColors = ["bg-[#E0F2FE]", "bg-[#FEF08A]", "bg-[#E9D5FF]", "bg-[#4DE3B1]", "bg-[#F43F5E]"];
const badgeColors = ["bg-[#4DE3B1]", "bg-[#F59E0B]", "bg-[#FDFDFD]", "bg-[#8666F8]", "bg-[#FEF08A]"];
const columns = ['Planning', 'In Progress', 'Review', 'Completed'];

export default function Projects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState(initialProjects);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ name: '', client: '', status: 'Planning', dueDate: '', progress: 0 });

  const [clients, setClients] = useState([]);
  
  // Time Logging State
  const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);
  const [activeProject, setActiveProject] = useState(null);
  const [timeLogData, setTimeLogData] = useState({ hours: '', description: '' });
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    fetchAuth('/api/projects')
      .then(res => res.json())
      .then(data => setProjects(data))
      .catch(err => console.error(err));
      
    fetchAuth('/api/clients')
      .then(res => res.json())
      .then(data => setClients(data))
      .catch(err => console.error(err));
      
    fetchAuth('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(err => console.error(err));
  }, []);

  const openAddModal = () => {
    setIsEditing(false);
    setEditId(null);
    setFormData({ name: '', client: '', status: 'Planning', dueDate: '', progress: 0 });
    setIsModalOpen(true);
  };

  const openEditModal = (project) => {
    setIsEditing(true);
    setEditId(project._id || project.id);
    setFormData({
      name: project.name,
      client: project.client?._id || project.client,
      status: project.status,
      dueDate: project.dueDate,
      progress: project.progress
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.client) return;

    try {
      if (isEditing) {
        const res = await fetchAuth(`/api/projects/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        const updatedProject = await res.json();
        setProjects(projects.map(p => (p._id || p.id) === editId ? updatedProject : p));
        toast.success('Project updated successfully!');
      } else {
        const randomBg = bgColors[Math.floor(Math.random() * bgColors.length)];
        const randomBadge = badgeColors[Math.floor(Math.random() * badgeColors.length)];
        const projectData = {
          ...formData,
          bg: randomBg,
          badgeColor: randomBadge
        };
        const res = await fetchAuth('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(projectData)
        });
        const savedProject = await res.json();
        setProjects([savedProject, ...projects]);
        toast.success('Project created successfully!');
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} project`);
    }
  };

  const handleDeleteProject = (id, e) => {
    e.stopPropagation();
    confirmDelete('Are you sure you want to delete this project?', async () => {
      try {
        await fetchAuth(`/api/projects/${id}`, { method: 'DELETE' });
        setProjects(projects.filter(p => (p._id || p.id) !== id));
        toast.success('Project deleted!');
      } catch (err) {
        console.error(err);
        toast.error('Failed to delete project');
      }
    });
  };

  const handleDragStart = (e, projectId) => {
    e.dataTransfer.setData('projectId', projectId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    const projectId = e.dataTransfer.getData('projectId');
    if (!projectId) return;

    const projectToUpdate = projects.find(p => (p._id || p.id) === projectId);
    if (!projectToUpdate || projectToUpdate.status === newStatus) return;

    let newProgress = projectToUpdate.progress;
    if (newStatus === 'Planning') newProgress = 0;
    else if (newStatus === 'In Progress') newProgress = 30;
    else if (newStatus === 'Review') newProgress = 80;
    else if (newStatus === 'Completed') newProgress = 100;

    const updatedData = { 
      ...projectToUpdate, 
      status: newStatus, 
      progress: newProgress,
      client: projectToUpdate.client?._id || projectToUpdate.client // ensure client is ID
    };
    
    // Optimistic UI update
    setProjects(projects.map(p => (p._id || p.id) === projectId ? { ...updatedData, client: projectToUpdate.client } : p));

    // Fire confetti when moved to Completed
    if (newStatus === 'Completed') {
      const confettiSettings = {
        particleCount: 150,
        spread: 80,
        startVelocity: 60,
        colors: ['#4DE3B1', '#FEF08A', '#8666F8', '#F43F5E', '#000000']
      };
      
      // Left corner
      confetti({
        ...confettiSettings,
        angle: 60,
        origin: { x: 0, y: 1 }
      });
      // Right corner
      confetti({
        ...confettiSettings,
        angle: 120,
        origin: { x: 1, y: 1 }
      });
    }

    try {
      const res = await fetchAuth(`/api/projects/${projectId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      if (!res.ok) throw new Error('Update failed');
      const savedProject = await res.json();
      setProjects(prev => prev.map(p => (p._id || p.id) === projectId ? savedProject : p));
      toast.success('Project updated!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to move project');
      // Revert optimistic update by fetching again or resetting state
      const res = await fetchAuth('/api/projects');
      const data = await res.json();
      setProjects(data);
    }
  };

  const openTimeModal = (project, e) => {
    e.stopPropagation();
    setActiveProject(project);
    setTimeLogData({ hours: '', description: '' });
    setIsTimeModalOpen(true);
  };

  const handleAddTimeLog = async (e) => {
    e.preventDefault();
    if (!timeLogData.hours || !timeLogData.description) return;
    
    try {
      const res = await fetchAuth(`/api/projects/${activeProject._id || activeProject.id}/time`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hours: Number(timeLogData.hours), description: timeLogData.description })
      });
      if (!res.ok) throw new Error('Failed to log time');
      const updatedProject = await res.json();
      setProjects(projects.map(p => (p._id || p.id) === (updatedProject._id || updatedProject.id) ? updatedProject : p));
      setActiveProject(updatedProject);
      setTimeLogData({ hours: '', description: '' });
      toast.success('Time logged successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to log time');
    }
  };

  const handleDeleteTimeLog = async (logId) => {
    try {
      const res = await fetchAuth(`/api/projects/${activeProject._id || activeProject.id}/time/${logId}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete time log');
      const updatedProject = await res.json();
      setProjects(projects.map(p => (p._id || p.id) === (updatedProject._id || updatedProject.id) ? updatedProject : p));
      setActiveProject(updatedProject);
      toast.success('Time log removed!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to remove time log');
    }
  };

  const handleGenerateInvoice = async () => {
    if (!activeProject || !activeProject.timeLogs || activeProject.timeLogs.length === 0) {
      toast.error('No logged hours to invoice.');
      return;
    }
    
    const totalHours = activeProject.timeLogs.reduce((acc, log) => acc + log.hours, 0);
    const hourlyRate = settings?.hourlyRate || 50;
    const amount = `$${(totalHours * hourlyRate).toFixed(2)}`;
    const invoiceId = `INV-${Math.floor(100000 + Math.random() * 900000)}`;
    const date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    const invoiceData = {
      invoiceId,
      client: activeProject.client?._id || activeProject.client,
      amount,
      date,
      status: 'Pending'
    };
    
    try {
      const res = await fetchAuth('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invoiceData)
      });
      if (!res.ok) throw new Error('Failed to create invoice');
      toast.success('Invoice generated successfully! Check your Invoices tab.');
      setIsTimeModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate invoice');
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] space-y-6 relative z-10">
      {/* Header */}
      <div className="flex items-center justify-between bg-white border-4 border-black p-6 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] shrink-0">
        <div>
          <h1 className="text-3xl font-black text-black uppercase tracking-tight">Projects Board</h1>
          <p className="text-sm font-bold text-slate-600 mt-1">Manage your team's workflow and track progress.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={openAddModal}
            className="bg-[#8666F8] text-white px-6 py-3 rounded-xl font-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-1 transition-all"
          >
            + Create Issue
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 flex gap-6 overflow-x-auto pb-6 px-1 items-start h-full scrollbar-hide">
        {columns.map(col => {
          const colProjects = projects.filter(p => p.status === col);
          const colColors = {
            'Planning': 'bg-[#E0F2FE]',
            'In Progress': 'bg-[#FEF08A]',
            'Review': 'bg-[#E9D5FF]',
            'Completed': 'bg-[#4DE3B1]'
          };

          return (
            <div 
              key={col} 
              className="flex-1 w-full min-w-[200px] bg-white rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col max-h-full"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col)}
            >
              {/* Column Header */}
              <div className={`${colColors[col]} p-4 border-b-4 border-black rounded-t-xl flex justify-between items-center sticky top-0 z-10`}>
                <h2 className="font-black text-lg uppercase tracking-wide">{col}</h2>
                <span className="bg-white border-2 border-black text-black text-xs font-black px-2 py-1 rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  {colProjects.length}
                </span>
              </div>
              
              {/* Column Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
                {colProjects.map(project => (
                  <div 
                    key={project._id || project.id} 
                    draggable
                    onDragStart={(e) => handleDragStart(e, project._id || project.id)}
                    className="bg-white rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-5 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer relative group flex flex-col gap-3 active:scale-95 active:rotate-1"
                    onClick={() => openEditModal(project)}
                  >
                    <div className={`absolute top-0 left-0 w-2 h-full ${project.badgeColor} border-r-4 border-black`}></div>
                    
                    <div className="flex justify-between items-start pl-2">
                      <span className="text-xs font-black bg-slate-100 border-2 border-black px-2 py-1 rounded-md">
                        PROJ-{(project._id || project.id || '').substring(0,4).toUpperCase()}
                      </span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={(e) => openTimeModal(project, e)}
                          className="p-1 hover:bg-[#E9D5FF] hover:text-black border-2 border-transparent hover:border-black rounded-md transition-colors"
                          title="Log Time"
                        >
                          <Clock className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={(e) => handleDeleteProject(project._id || project.id, e)}
                          className="p-1 hover:bg-[#F43F5E] hover:text-white border-2 border-transparent hover:border-black rounded-md transition-colors"
                          title="Delete Project"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-black text-black leading-tight pl-2">{project.name}</h3>
                    
                    <div className="pl-2 flex items-center justify-between mt-2">
                      <div className="flex -space-x-2">
                        {(project.client?.name || clients.find(c => (c._id || c.id) === project.client)?.name) && (
                          <div className="w-8 h-8 rounded-full border-2 border-black bg-[#FEF08A] flex items-center justify-center text-xs font-bold z-10" title={project.client?.name || clients.find(c => (c._id || c.id) === project.client)?.name}>
                            {(project.client?.name || clients.find(c => (c._id || c.id) === project.client)?.name).charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      
                      {project.dueDate && (
                        <div className="flex items-center gap-1 text-xs font-bold px-2 py-1 bg-white border-2 border-black rounded-md shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                          <Calendar className="w-3 h-3" />
                          {project.dueDate}
                        </div>
                      )}
                    </div>

                    <div className="pl-2 mt-2">
                      <div className="flex justify-between text-[10px] font-black uppercase mb-1">
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-100 border-2 border-black rounded-full h-2.5 overflow-hidden">
                        <div className="bg-[#8666F8] h-full border-r-2 border-black" style={{ width: `${project.progress}%` }}></div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {colProjects.length === 0 && (
                  <div className="text-center p-6 text-slate-400 font-black border-4 border-dashed border-slate-300 rounded-xl bg-white/50">
                    Drop items here
                  </div>
                )}
                
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-md animate-in fade-in zoom-in duration-200">
            <div className={`${isEditing ? 'bg-[#FEF08A]' : 'bg-[#E0F2FE]'} rounded-t-[12px] border-b-4 border-black p-4 flex items-center justify-between`}>
              <h2 className="text-xl font-black text-black uppercase tracking-tight">{isEditing ? 'Edit Issue' : 'Create Issue'}</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 border-2 border-black rounded-lg bg-white hover:bg-black hover:text-white transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-0.5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5 bg-[#FDFDFD]">
              <div>
                <label className="block text-xs font-black text-black uppercase tracking-wider mb-2">Issue Title</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-white border-2 border-black rounded-xl py-2.5 px-3 text-black font-bold focus:outline-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow"
                  placeholder="e.g., Update Landing Page"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-black uppercase tracking-wider mb-2">Assign to Client</label>
                <Select 
                  value={formData.client}
                  onChange={(val) => setFormData({...formData, client: val})}
                  placeholder="Select a client..."
                  options={clients.map(c => ({ value: c._id || c.id, label: c.name }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-black text-black uppercase tracking-wider mb-2">Status</label>
                  <Select 
                    value={formData.status}
                    onChange={(val) => setFormData({...formData, status: val})}
                    options={[
                      { value: 'Planning', label: 'Planning' },
                      { value: 'In Progress', label: 'In Progress' },
                      { value: 'Review', label: 'Review' },
                      { value: 'Completed', label: 'Completed' }
                    ]}
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-black uppercase tracking-wider mb-2">Progress (%)</label>
                  <input 
                    type="number" 
                    min="0" max="100"
                    value={formData.progress}
                    onChange={e => setFormData({...formData, progress: e.target.value})}
                    className="w-full bg-white border-2 border-black rounded-xl py-2.5 px-3 text-black font-bold focus:outline-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black text-black uppercase tracking-wider mb-2">Due Date</label>
                <DatePicker 
                  value={formData.dueDate}
                  onChange={(date) => setFormData({...formData, dueDate: date})}
                  placeholder="e.g., Dec 31, 2026"
                />
              </div>
              
              <div className="pt-6 flex justify-end gap-4 border-t-4 border-black mt-6">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 rounded-xl font-black border-2 border-black bg-white text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-0.5 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-[#8666F8] text-white px-6 py-2.5 rounded-xl font-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-1 transition-all"
                >
                  {isEditing ? 'Save Changes' : 'Create Issue'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Log Time Modal */}
      {isTimeModalOpen && activeProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-lg animate-in fade-in zoom-in duration-200">
            <div className="bg-[#E9D5FF] rounded-t-[12px] border-b-4 border-black p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-6 h-6 text-black" />
                <h2 className="text-xl font-black text-black uppercase tracking-tight">Time Logs - {activeProject.name}</h2>
              </div>
              <button 
                onClick={() => setIsTimeModalOpen(false)}
                className="p-1.5 border-2 border-black rounded-lg bg-white hover:bg-black hover:text-white transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-0.5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 bg-[#FDFDFD]">
              {/* Existing Logs */}
              <div className="mb-6 max-h-48 overflow-y-auto pr-2">
                {(!activeProject.timeLogs || activeProject.timeLogs.length === 0) ? (
                  <p className="text-sm font-bold text-slate-500 text-center py-4 border-2 border-dashed border-slate-300 rounded-xl">No time logged yet.</p>
                ) : (
                  <div className="space-y-3">
                    {activeProject.timeLogs.map(log => (
                      <div key={log._id} className="flex items-center justify-between p-3 border-2 border-black rounded-xl bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        <div>
                          <p className="font-bold text-black">{log.description}</p>
                          <p className="text-xs font-bold text-slate-500">{new Date(log.date).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-black text-black bg-[#E0F2FE] px-2 py-1 rounded-md border-2 border-black">{log.hours}h</span>
                          <button onClick={() => handleDeleteTimeLog(log._id)} className="text-slate-400 hover:text-[#F43F5E] transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between mb-4 border-t-2 border-black pt-4">
                <span className="font-black text-black uppercase">Total Time Logged:</span>
                <span className="font-black text-2xl bg-[#FEF08A] px-3 py-1 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  {activeProject.timeLogs?.reduce((acc, log) => acc + log.hours, 0) || 0}h
                </span>
              </div>

              {/* Add New Log Form */}
              <form onSubmit={handleAddTimeLog} className="space-y-4 border-4 border-black p-4 rounded-xl bg-slate-50">
                <div className="grid grid-cols-4 gap-3">
                  <div className="col-span-1">
                    <label className="block text-xs font-black text-black uppercase mb-1">Hours</label>
                    <input 
                      type="number" step="0.5" min="0" required
                      value={timeLogData.hours}
                      onChange={e => setTimeLogData({...timeLogData, hours: e.target.value})}
                      className="w-full bg-white border-2 border-black rounded-lg py-2 px-2 text-black font-bold focus:outline-none"
                      placeholder="e.g. 2.5"
                    />
                  </div>
                  <div className="col-span-3">
                    <label className="block text-xs font-black text-black uppercase mb-1">Description</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" required
                        value={timeLogData.description}
                        onChange={e => setTimeLogData({...timeLogData, description: e.target.value})}
                        className="w-full bg-white border-2 border-black rounded-lg py-2 px-3 text-black font-bold focus:outline-none"
                        placeholder="What did you work on?"
                      />
                      <button type="submit" className="bg-[#4DE3B1] text-black px-4 font-black border-2 border-black rounded-lg hover:bg-[#34D399]">Add</button>
                    </div>
                  </div>
                </div>
              </form>

              {activeProject.status === 'Completed' && (
                <div className="mt-6 border-t-4 border-black pt-6">
                  <button 
                    onClick={handleGenerateInvoice}
                    className="w-full flex items-center justify-center gap-2 bg-[#F59E0B] text-black px-6 py-3 rounded-xl font-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-1 transition-all uppercase tracking-wide"
                  >
                    <FileText className="w-5 h-5" /> Generate Invoice from Hours
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
