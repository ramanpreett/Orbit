import React, { useState, useEffect } from 'react';
import { MoreVertical, Mail, Phone, Plus, X, Trash2, Wand2, Users, UserCheck, Link as LinkIcon, Search, Filter, Folder } from 'lucide-react';
import { fetchAuth } from '../utils/fetchAuth';
import toast from 'react-hot-toast';
import { confirmDelete } from '../utils/toastConfirm';
import Select from '../components/Select';

const initialClients = [];

const colors = ["bg-[#4DE3B1]", "bg-[#FEF08A]", "bg-[#E0F2FE]", "bg-[#F43F5E]", "bg-[#8666F8]", "bg-[#E9D5FF]"];

export default function Clients() {
  const [clients, setClients] = useState(initialClients);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExtractModalOpen, setIsExtractModalOpen] = useState(false);
  const [extractText, setExtractText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', company: '', email: '', phone: '', status: 'Lead' });
  const [editId, setEditId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredClients = clients.filter(client => {
    const matchesSearch = (client.name + (client.company || '') + client.email).toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || client.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  useEffect(() => {
    fetchAuth('/api/clients')
      .then(res => res.json())
      .then(data => setClients(data))
      .catch(err => console.error(err));
  }, []);

  const openAddModal = () => {
    setIsEditing(false);
    setEditId(null);
    setFormData({ name: '', company: '', email: '', phone: '', status: 'Lead' });
    setIsModalOpen(true);
  };

  const handleExtract = (e) => {
    e.preventDefault();
    if (!extractText) return;
    
    const emailMatch = extractText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const phoneMatch = extractText.match(/(?:\+?\d{1,4}[\s-]?)?(?:\(?\d{1,5}\)?[\s-]?)?\d{2,4}[\s.-]?\d{2,4}[\s.-]?\d{2,6}/);
    
    // Heuristic for name: Look for two capitalized words, or just take the text before an email if simple
    const nameMatch = extractText.match(/([A-Z][a-z]+\s[A-Z][a-z]+)/);
    
    // Heuristic for company: "at [Company]" or "from [Company]"
    const companyMatch = extractText.match(/(?:at|from|ceo of|founder of)\s+([A-Z][a-zA-Z0-9]+(?:\s+[A-Z][a-zA-Z0-9]+)*)/i);

    setFormData({
      name: nameMatch ? nameMatch[1] : '',
      company: companyMatch ? companyMatch[1] : '',
      email: emailMatch ? emailMatch[0] : '',
      phone: phoneMatch ? phoneMatch[0] : '',
      status: 'Lead'
    });
    
    setIsExtractModalOpen(false);
    setExtractText('');
    setIsEditing(false);
    setIsModalOpen(true);
    toast.success('Extracted details from text!');
  };

  const openEditModal = (client) => {
    setIsEditing(true);
    setEditId(client._id || client.id);
    setFormData({ 
      name: client.name, 
      company: client.company, 
      email: client.email, 
      phone: client.phone, 
      status: client.status 
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) return;
    
    try {
      if (isEditing) {
        const res = await fetchAuth(`/api/clients/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        const updatedClient = await res.json();
        setClients(clients.map(c => (c._id || c.id) === editId ? updatedClient : c));
        toast.success('Client updated successfully!');
      } else {
        const randomBg = colors[Math.floor(Math.random() * colors.length)];
        const res = await fetchAuth('/api/clients', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData, bg: randomBg })
        });
        const savedClient = await res.json();
        setClients([savedClient, ...clients]);
        toast.success('Client added successfully!');
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error(`Failed to ${isEditing ? 'update' : 'add'} client`);
    }
  };

  const handleDeleteClient = (id) => {
    confirmDelete('Are you sure you want to delete this client?', async () => {
      try {
        await fetchAuth(`/api/clients/${id}`, { method: 'DELETE' });
        setClients(clients.filter(c => (c._id || c.id) !== id));
        toast.success('Client deleted!');
      } catch (err) {
        console.error(err);
        toast.error('Failed to delete client');
      }
    });
  };

  const copyPortalLink = (client) => {
    if (!client.magicLinkToken) {
      toast.error('Portal link not available for this client yet.');
      return;
    }
    const url = `${window.location.origin}/portal/${client.magicLinkToken}`;
    navigator.clipboard.writeText(url);
    toast.success('Portal link copied to clipboard!');
  };

  return (
    <div className="space-y-8 h-full flex flex-col relative z-10">
      <div className="flex items-center justify-between bg-white border-2 border-black p-6 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div>
          <h1 className="text-3xl font-black text-black uppercase tracking-tight">Clients</h1>
          <p className="text-sm font-bold text-slate-600 mt-1">Manage your client relationships and contact details.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsExtractModalOpen(true)}
            className="flex items-center gap-2 bg-[#E9D5FF] text-black px-6 py-2.5 rounded-xl font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-1 transition-all"
          >
            <Wand2 className="w-5 h-5 text-black" /> 
            Auto Extract
          </button>
          <button 
            onClick={openAddModal}
            className="flex items-center gap-2 bg-[#F43F5E] text-white px-6 py-2.5 rounded-xl font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-1 transition-all"
          >
            <Plus className="w-5 h-5 border-2 border-transparent bg-white text-black rounded-full p-0.5" /> 
            Add Client
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-shrink-0">
        <div className="p-6 rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-start justify-between bg-[#4DE3B1] transition-transform hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div>
            <p className="text-sm font-black text-black mb-2 uppercase tracking-widest">Active Clients</p>
            <h3 className="text-4xl font-black text-black leading-none tracking-tight">
              {clients.filter(c => c.status === 'Active').length}
            </h3>
          </div>
          <div className="opacity-80">
            <UserCheck className="w-10 h-10 text-black stroke-[3]" />
          </div>
        </div>

        <div className="p-6 rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-start justify-between bg-[#E9D5FF] transition-transform hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div>
            <p className="text-sm font-black text-black mb-2 uppercase tracking-widest">Lead Clients</p>
            <h3 className="text-4xl font-black text-black leading-none tracking-tight">
              {clients.filter(c => c.status === 'Lead').length}
            </h3>
          </div>
          <div className="opacity-80">
            <Users className="w-10 h-10 text-black stroke-[3]" />
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 flex-shrink-0">
        <div className="relative flex-1">
          <input
            type="text"
            className="block w-full px-4 py-2 border-2 border-black rounded-xl bg-white text-black font-bold focus:outline-none focus:ring-0 focus:border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none"
            placeholder="Search clients by name, email, or company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-48 flex items-center justify-center z-20">
          <Select
            value={statusFilter}
            onChange={(val) => setStatusFilter(val)}
            options={[
              { value: 'All', label: 'All Statuses' },
              { value: 'Active', label: 'Active' },
              { value: 'Lead', label: 'Lead' },
              { value: 'Inactive', label: 'Inactive' }
            ]}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex-1 flex flex-col overflow-hidden min-h-0">
        <div className="overflow-auto flex-1">
          <table className="w-full text-left border-collapse relative">
            <thead className="sticky top-0 z-10 outline outline-2 outline-black">
              <tr className="bg-[#FEF08A]">
                <th className="py-4 px-6 text-sm font-black text-black uppercase tracking-wider border-r-2 border-black">Client Name</th>
                <th className="py-4 px-6 text-sm font-black text-black uppercase tracking-wider border-r-2 border-black">Contact Info</th>
                <th className="py-4 px-6 text-sm font-black text-black uppercase tracking-wider border-r-2 border-black">Projects</th>
                <th className="py-4 px-6 text-sm font-black text-black uppercase tracking-wider border-r-2 border-black">Status</th>
                <th className="py-4 px-6 text-sm font-black text-black uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-black">
              {filteredClients.map((client) => (
                <tr key={client._id || client.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6 border-r-2 border-black">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center text-black font-black text-xl ${client.bg}`}>
                        {client.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-base font-black text-black">{client.name}</p>
                        <p className="text-sm font-bold text-slate-600">{client.company}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 border-r-2 border-black">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-sm font-bold text-black">
                        <div className="p-1 bg-[#E0F2FE] border-2 border-black rounded-md"><Mail className="w-4 h-4" /></div> {client.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm font-bold text-black">
                        <div className="p-1 bg-[#E0F2FE] border-2 border-black rounded-md"><Phone className="w-4 h-4" /></div> {client.phone}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 border-r-2 border-black">
                    {client.projects && client.projects.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {client.projects.map(project => (
                          <span key={project._id} className="inline-flex items-center gap-1 px-2 py-1 bg-[#FEF08A] border-2 border-black rounded-lg text-xs font-bold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                            <Folder className="w-3 h-3" /> {project.name}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-sm font-bold text-gray-400 italic">No projects yet</span>
                    )}
                  </td>
                  <td className="py-4 px-6 border-r-2 border-black">
                    <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-black
                      ${client.status === 'Active' ? 'bg-[#4DE3B1]' : 'bg-[#E9D5FF]'}`}>
                      {client.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => copyPortalLink(client)}
                        className="px-3 py-1 bg-[#E0F2FE] hover:bg-[#BAE6FD] text-black font-bold border-2 border-black rounded-xl transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-0.5 flex items-center gap-1"
                        title="Copy Portal Link"
                      >
                        <LinkIcon className="w-4 h-4" /> Link
                      </button>
                      <button 
                        onClick={() => openEditModal(client)}
                        className="px-3 py-1 bg-[#FEF08A] hover:bg-yellow-300 text-black font-bold border-2 border-black rounded-xl transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-0.5"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteClient(client._id || client.id)}
                        className="p-2 text-white bg-[#F43F5E] hover:bg-[#E11D48] border-2 border-black rounded-xl transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-0.5"
                        title="Delete Client"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Auto Extract Modal */}
      {isExtractModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-md animate-in fade-in zoom-in duration-200">
            <div className="bg-[#E9D5FF] rounded-t-[12px] border-b-4 border-black p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wand2 className="w-6 h-6" />
                <h2 className="text-xl font-black text-black uppercase">Auto Extract</h2>
              </div>
              <button 
                onClick={() => setIsExtractModalOpen(false)}
                className="p-1 border-2 border-black rounded-lg bg-white hover:bg-black hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleExtract} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-black mb-2">Paste Client Info (Email, Text, Notes)</label>
                <textarea 
                  required
                  rows="6"
                  value={extractText}
                  onChange={e => setExtractText(e.target.value)}
                  className="w-full bg-white border-2 border-black rounded-xl py-3 px-4 text-black font-bold focus:outline-none focus:ring-0 focus:border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none"
                  placeholder="e.g. John Doe from Acme Corp reached out. His email is john@acme.com and his number is 555-0198..."
                />
              </div>
              
              <button 
                type="submit"
                className="w-full bg-[#E9D5FF] hover:bg-[#D8B4FE] text-black font-black uppercase tracking-wider py-3 px-4 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-1 transition-all flex items-center justify-center gap-2"
              >
                <Wand2 className="w-5 h-5" />
                Extract Details
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Client Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-md animate-in fade-in zoom-in duration-200">
            <div className={`${isEditing ? 'bg-[#FEF08A]' : 'bg-[#4DE3B1]'} rounded-t-[12px] border-b-4 border-black p-4 flex items-center justify-between`}>
              <h2 className="text-xl font-black text-black uppercase">{isEditing ? 'Edit Client' : 'Add New Client'}</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 border-2 border-black rounded-lg bg-white hover:bg-black hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-black mb-1">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-white border-2 border-black rounded-xl py-2 px-3 text-black font-bold focus:outline-none focus:ring-0 focus:border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  placeholder="Jane Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-black mb-1">Company</label>
                <input 
                  type="text" 
                  value={formData.company}
                  onChange={e => setFormData({...formData, company: e.target.value})}
                  className="w-full bg-white border-2 border-black rounded-xl py-2 px-3 text-black font-bold focus:outline-none focus:ring-0 focus:border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  placeholder="Acme Corp"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-black mb-1">Email</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-white border-2 border-black rounded-xl py-2 px-3 text-black font-bold focus:outline-none focus:ring-0 focus:border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  placeholder="jane@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-black mb-1">Phone</label>
                <input 
                  type="text" 
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="w-full bg-white border-2 border-black rounded-xl py-2 px-3 text-black font-bold focus:outline-none focus:ring-0 focus:border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  placeholder="+91 98765... or +44 20..."
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-black mb-1">Status</label>
                <Select 
                  value={formData.status}
                  onChange={(val) => setFormData({...formData, status: val})}
                  options={[
                    { value: 'Active', label: 'Active' },
                    { value: 'Lead', label: 'Lead' }
                  ]}
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
                  className="bg-[#8666F8] text-white px-6 py-2 rounded-xl font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-1 transition-all"
                >
                  {isEditing ? 'Save Changes' : 'Save Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
