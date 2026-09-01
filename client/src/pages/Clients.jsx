import React, { useState, useEffect } from 'react';
import { MoreVertical, Mail, Phone, Plus, X, Trash2 } from 'lucide-react';
import { fetchAuth } from '../utils/fetchAuth';
import toast from 'react-hot-toast';
import { confirmDelete } from '../utils/toastConfirm';

const initialClients = [];

const colors = ["bg-[#4DE3B1]", "bg-[#FEF08A]", "bg-[#E0F2FE]", "bg-[#F43F5E]", "bg-[#8666F8]", "bg-[#E9D5FF]"];

export default function Clients() {
  const [clients, setClients] = useState(initialClients);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', company: '', email: '', phone: '', status: 'Lead' });
  const [editId, setEditId] = useState(null);

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

  return (
    <div className="space-y-8 h-full flex flex-col relative z-10">
      <div className="flex items-center justify-between bg-white border-2 border-black p-6 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div>
          <h1 className="text-3xl font-black text-black uppercase tracking-tight">Clients</h1>
          <p className="text-sm font-bold text-slate-600 mt-1">Manage your client relationships and contact details.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="flex items-center gap-2 bg-[#F43F5E] text-white px-6 py-2.5 rounded-xl font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-1 transition-all"
        >
          <Plus className="w-5 h-5 border-2 border-transparent bg-white text-black rounded-full p-0.5" /> 
          Add Client
        </button>
      </div>

      <div className="bg-white rounded-2xl border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex-1 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FEF08A] border-b-2 border-black">
                <th className="py-4 px-6 text-sm font-black text-black uppercase tracking-wider border-r-2 border-black">Client Name</th>
                <th className="py-4 px-6 text-sm font-black text-black uppercase tracking-wider border-r-2 border-black">Contact Info</th>
                <th className="py-4 px-6 text-sm font-black text-black uppercase tracking-wider border-r-2 border-black">Status</th>
                <th className="py-4 px-6 text-sm font-black text-black uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-black">
              {clients.map((client) => (
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
                    <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-black
                      ${client.status === 'Active' ? 'bg-[#4DE3B1]' : 'bg-[#E9D5FF]'}`}>
                      {client.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-2">
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

      {/* Add Client Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className={`${isEditing ? 'bg-[#FEF08A]' : 'bg-[#4DE3B1]'} border-b-4 border-black p-4 flex items-center justify-between`}>
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
                  placeholder="+1 (555) 000-0000"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-black mb-1">Status</label>
                <select 
                  value={formData.status}
                  onChange={e => setFormData({...formData, status: e.target.value})}
                  className="w-full bg-white border-2 border-black rounded-xl py-2 px-3 text-black font-bold focus:outline-none focus:ring-0 focus:border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] appearance-none"
                >
                  <option value="Active">Active</option>
                  <option value="Lead">Lead</option>
                </select>
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
