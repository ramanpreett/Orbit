import React, { useState, useEffect } from 'react';
import { Video, Calendar as CalendarIcon, Clock, Users, X } from 'lucide-react';

export default function Meetings() {
  const [meetings, setMeetings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMeeting, setNewMeeting] = useState({ title: '', date: '', type: 'Sync', link: '' });

  useEffect(() => {
    fetch('/api/meetings')
      .then(res => res.json())
      .then(data => setMeetings(data))
      .catch(err => console.error(err));
  }, []);

  const handleAddMeeting = async (e) => {
    e.preventDefault();
    if (!newMeeting.title) return;
    try {
      const res = await fetch('/api/meetings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMeeting)
      });
      const savedMeeting = await res.json();
      setMeetings([savedMeeting, ...meetings]);
      setIsModalOpen(false);
      setNewMeeting({ title: '', date: '', type: 'Sync', link: '' });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 h-full flex flex-col relative z-10">
      <div className="flex items-center justify-between bg-white border-2 border-black p-6 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div>
          <h1 className="text-3xl font-black text-black uppercase tracking-tight">Meetings</h1>
          <p className="text-sm font-bold text-slate-600 mt-1">Schedule and manage your client syncs.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
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
                {meeting.link && (
                  <a href={meeting.link} target="_blank" rel="noopener noreferrer" className="text-black bg-white border-2 border-black p-1.5 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-0.5 transition-all">
                    <Video className="w-5 h-5" />
                  </a>
                )}
              </div>
              <h3 className="text-xl font-black text-black mb-4 z-10">{meeting.title}</h3>
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
            <div className="bg-[#E9D5FF] border-b-4 border-black p-4 flex items-center justify-between">
              <h2 className="text-xl font-black text-black uppercase">Schedule Meeting</h2>
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
                  value={newMeeting.title}
                  onChange={e => setNewMeeting({...newMeeting, title: e.target.value})}
                  className="w-full bg-white border-2 border-black rounded-xl py-2 px-3 text-black font-bold focus:outline-none focus:ring-0 focus:border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  placeholder="Sync with Client"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-black mb-1">Date & Time</label>
                <input 
                  type="text" 
                  required
                  value={newMeeting.date}
                  onChange={e => setNewMeeting({...newMeeting, date: e.target.value})}
                  className="w-full bg-white border-2 border-black rounded-xl py-2 px-3 text-black font-bold focus:outline-none focus:ring-0 focus:border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  placeholder="Tomorrow at 10 AM"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-black mb-1">Type</label>
                  <select 
                    value={newMeeting.type}
                    onChange={e => setNewMeeting({...newMeeting, type: e.target.value})}
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
                    value={newMeeting.link}
                    onChange={e => setNewMeeting({...newMeeting, link: e.target.value})}
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
                  Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
