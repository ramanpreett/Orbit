import React, { useState, useEffect } from 'react';
import { Video, Calendar as CalendarIcon, Clock, Users, X, Trash2 } from 'lucide-react';
import { fetchAuth } from '../utils/fetchAuth';
import toast from 'react-hot-toast';
import { confirmDelete } from '../utils/toastConfirm';

export default function Meetings() {
  const [meetings, setMeetings] = useState([]);
  const [clients, setClients] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ title: '', client: '', date: '', type: 'Sync', link: '' });

  useEffect(() => {
    fetchAuth('/api/meetings')
      .then(res => res.json())
      .then(data => setMeetings(data))
      .catch(err => console.error(err));

    fetchAuth('/api/clients')
      .then(res => res.json())
      .then(data => setClients(data))
      .catch(err => console.error(err));
  }, []);

  const openAddModal = () => {
    setIsEditing(false);
    setEditId(null);
    setFormData({ title: '', client: '', date: '', type: 'Sync', link: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (meeting) => {
    setIsEditing(true);
    setEditId(meeting._id || meeting.id);
    setFormData({
      title: meeting.title,
      client: meeting.client?._id || meeting.client,
      date: meeting.date,
      type: meeting.type,
      link: meeting.link
    });
    setIsModalOpen(true);
  };

  const handleAddMeeting = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.client) return;
    try {
      if (isEditing) {
        const res = await fetchAuth(`/api/meetings/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        const updatedMeeting = await res.json();
        setMeetings(meetings.map(m => (m._id || m.id) === editId ? updatedMeeting : m));
        toast.success('Meeting updated successfully!');
      } else {
        const res = await fetchAuth('/api/meetings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        const savedMeeting = await res.json();
        setMeetings([savedMeeting, ...meetings]);
        toast.success('Meeting scheduled!');
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error(`Failed to ${isEditing ? 'update' : 'schedule'} meeting`);
    }
  };

  const handleDeleteMeeting = (id, e) => {
    e.stopPropagation();
    confirmDelete('Are you sure you want to delete this meeting?', async () => {
      try {
        await fetchAuth(`/api/meetings/${id}`, { method: 'DELETE' });
        setMeetings(meetings.filter(m => (m._id || m.id) !== id));
        toast.success('Meeting deleted!');
      } catch (err) {
        console.error(err);
        toast.error('Failed to delete meeting');
      }
    });
  };

  return (
    <div className="space-y-8 h-full flex flex-col relative z-10">
      <div className="flex items-center justify-between bg-white border-2 border-black p-6 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div>
          <h1 className="text-3xl font-black text-black uppercase tracking-tight">Meetings</h1>
          <p className="text-sm font-bold text-slate-600 mt-1">Schedule and manage your client syncs.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-[#4DE3B1] text-black px-6 py-2.5 rounded-xl font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-1 transition-all uppercase tracking-wide"
        >
          Schedule Meeting
        </button>
      </div>

      {meetings.length === 0 ? (
        <div className="bg-white rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-12 text-center max-w-2xl mx-auto mt-10">
          <div className="w-20 h-20 bg-[#FEF08A] border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black rounded-full flex items-center justify-center mx-auto mb-6 transform -rotate-12 hover:rotate-0 transition-transform">
            <CalendarIcon className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-black uppercase mb-2">No upcoming meetings</h2>
          <p className="text-sm font-bold text-slate-600 mb-8">Your schedule is clear for now. When you book new syncs or kickoff calls, they will appear here.</p>
          <button className="bg-white border-2 border-black text-black px-6 py-3 rounded-xl font-bold hover:bg-[#E0F2FE] transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 uppercase tracking-wide">
            Connect Google Calendar
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {meetings.map((meeting) => (
            <div key={meeting._id || meeting.id} className="bg-white rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 flex flex-col hover:-translate-y-2 transition-transform relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#E0F2FE] rounded-bl-full -z-10 border-b-4 border-l-4 border-black"></div>
              <div className="flex justify-between items-start mb-6 z-10">
                <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-[#FEF08A] text-black">
                  {meeting.type}
                </span>
                <div className="flex gap-2">
                  <button 
                    onClick={(e) => { e.stopPropagation(); openEditModal(meeting); }}
                    className="text-black bg-[#FEF08A] border-2 border-black px-3 py-1.5 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-bold text-xs hover:shadow-none hover:translate-y-0.5 transition-all"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={(e) => handleDeleteMeeting(meeting._id || meeting.id, e)}
                    className="text-white bg-[#F43F5E] border-2 border-black p-1.5 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-0.5 transition-all"
                    title="Delete Meeting"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  {meeting.link && (
                    <a href={meeting.link} target="_blank" rel="noopener noreferrer" className="text-black bg-white border-2 border-black p-1.5 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-0.5 transition-all">
                      <Video className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
              <h3 className="text-xl font-black text-black mb-1 z-10">{meeting.title}</h3>
              <p className="text-sm font-bold text-slate-600 mb-4 z-10">{meeting.client?.name || meeting.client || 'Unknown Client'}</p>
              <div className="flex items-center gap-2 text-sm font-bold text-black mt-auto pt-4 border-t-4 border-black z-10">
                <CalendarIcon className="w-5 h-5" />
                <span>{meeting.date}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Meeting Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className={`${isEditing ? 'bg-[#FEF08A]' : 'bg-[#E9D5FF]'} border-b-4 border-black p-4 flex items-center justify-between`}>
              <h2 className="text-xl font-black text-black uppercase">{isEditing ? 'Edit Meeting' : 'Schedule Meeting'}</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 border-2 border-black rounded-lg bg-white hover:bg-black hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddMeeting} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-black mb-1">Meeting Title</label>
                <input 
                  type="text" 
                  required
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-white border-2 border-black rounded-xl py-2 px-3 text-black font-bold focus:outline-none focus:ring-0 focus:border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  placeholder="Sync with Client"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-black mb-1">Client Name</label>
                <select 
                  required
                  value={formData.client}
                  onChange={e => setFormData({...formData, client: e.target.value})}
                  className="w-full bg-white border-2 border-black rounded-xl py-2 px-3 text-black font-bold focus:outline-none focus:ring-0 focus:border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] appearance-none"
                >
                  <option value="" disabled>Select a client</option>
                  {clients.map(c => (
                    <option key={c._id || c.id} value={c._id || c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-black mb-1">Date & Time</label>
                <input 
                  type="text" 
                  required
                  value={formData.date}
                  onChange={e => setFormData({...formData, date: e.target.value})}
                  className="w-full bg-white border-2 border-black rounded-xl py-2 px-3 text-black font-bold focus:outline-none focus:ring-0 focus:border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  placeholder="Tomorrow at 10 AM"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-black mb-1">Type</label>
                  <select 
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value})}
                    className="w-full bg-white border-2 border-black rounded-xl py-2 px-3 text-black font-bold focus:outline-none focus:ring-0 focus:border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] appearance-none"
                  >
                    <option value="Sync">Sync</option>
                    <option value="Kickoff">Kickoff</option>
                    <option value="Review">Review</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-black mb-1">Meeting Link</label>
                  <input 
                    type="text" 
                    value={formData.link}
                    onChange={e => setFormData({...formData, link: e.target.value})}
                    className="w-full bg-white border-2 border-black rounded-xl py-2 px-3 text-black font-bold focus:outline-none focus:ring-0 focus:border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    placeholder="Zoom / Meet URL"
                  />
                </div>
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
                  className="bg-[#E0F2FE] text-black px-6 py-2 rounded-xl font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-1 transition-all uppercase tracking-wide"
                >
                  {isEditing ? 'Save Changes' : 'Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
