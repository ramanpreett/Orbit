import React, { useState } from 'react';
import { User, Lock, Save, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { fetchAuth } from '../utils/fetchAuth';
import { Building2 } from 'lucide-react';

export default function Settings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const [password, setPassword] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const [agencySettings, setAgencySettings] = useState({
    agencyName: 'My Agency',
    logoUrl: '',
    hourlyRate: 50,
    invoiceTerms: 'Payment due within 30 days.'
  });

  React.useEffect(() => {
    fetchAuth('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data && data._id) {
          setAgencySettings({
            agencyName: data.agencyName || '',
            logoUrl: data.logoUrl || '',
            hourlyRate: data.hourlyRate || 50,
            invoiceTerms: data.invoiceTerms || ''
          });
        }
      })
      .catch(err => console.error(err));
  }, []);

  const handleProfileSave = (e) => {
    e.preventDefault();
    // Simulate API call
    toast.success('Profile updated successfully!');
  };

  const handlePasswordSave = (e) => {
    e.preventDefault();
    if (password.new !== password.confirm) {
      toast.error('New passwords do not match!');
      return;
    }
    // Simulate API call
    toast.success('Password changed successfully!');
    setPassword({ current: '', new: '', confirm: '' });
  };

  const handleAgencySave = async (e) => {
    e.preventDefault();
    try {
      const res = await fetchAuth('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(agencySettings)
      });
      if (!res.ok) throw new Error('Failed to update settings');
      toast.success('Agency settings saved!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save settings');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logged out successfully!');
  };

  return (
    <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
      <div className="flex items-center justify-between bg-white border-2 border-black p-6 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div>
          <h1 className="text-3xl font-black text-black uppercase tracking-tight">Settings</h1>
          <p className="text-sm font-bold text-slate-600 mt-1">Manage your account profile and security preferences.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Profile Settings */}
        <div className="bg-white rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-[#E0F2FE] border-2 border-black rounded-xl">
              <User className="w-6 h-6 text-black" />
            </div>
            <h2 className="text-2xl font-black text-black uppercase">Profile</h2>
          </div>
          
          <form onSubmit={handleProfileSave} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-black mb-2">Full Name</label>
              <input 
                type="text" 
                value={profile.name}
                onChange={(e) => setProfile({...profile, name: e.target.value})}
                className="w-full bg-white border-2 border-black rounded-xl py-3 px-4 text-black font-bold focus:outline-none focus:ring-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-black mb-2">Email Address</label>
              <input 
                type="email" 
                value={profile.email}
                disabled
                className="w-full bg-gray-100 border-2 border-black rounded-xl py-3 px-4 text-slate-500 font-bold focus:outline-none focus:ring-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-not-allowed"
              />
            </div>
            <button 
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-[#FEF08A] text-black px-6 py-3 rounded-xl font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-1 transition-all uppercase tracking-wide mt-8"
            >
              <Save className="w-5 h-5" /> Save Profile
            </button>
          </form>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-[#F43F5E] border-2 border-black rounded-xl text-white">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-black uppercase">Security</h2>
          </div>
          
          <form onSubmit={handlePasswordSave} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-black mb-2">Current Password</label>
              <input 
                type="password" 
                value={password.current}
                onChange={(e) => setPassword({...password, current: e.target.value})}
                className="w-full bg-white border-2 border-black rounded-xl py-3 px-4 text-black font-bold focus:outline-none focus:ring-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                placeholder="••••••••"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-black mb-2">New Password</label>
              <input 
                type="password" 
                value={password.new}
                onChange={(e) => setPassword({...password, new: e.target.value})}
                className="w-full bg-white border-2 border-black rounded-xl py-3 px-4 text-black font-bold focus:outline-none focus:ring-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                placeholder="••••••••"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-black mb-2">Confirm New Password</label>
              <input 
                type="password" 
                value={password.confirm}
                onChange={(e) => setPassword({...password, confirm: e.target.value})}
                className="w-full bg-white border-2 border-black rounded-xl py-3 px-4 text-black font-bold focus:outline-none focus:ring-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                placeholder="••••••••"
                required
              />
            </div>
            <button 
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-[#4DE3B1] text-black px-6 py-3 rounded-xl font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-1 transition-all uppercase tracking-wide mt-8"
            >
              <Save className="w-5 h-5" /> Update Password
            </button>
          </form>
        </div>
      </div>

      {/* Agency & Billing Settings */}
      <div className="bg-white rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-[#E9D5FF] border-2 border-black rounded-xl text-black">
            <Building2 className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-black uppercase">Agency & Billing</h2>
        </div>
        
        <form onSubmit={handleAgencySave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-black mb-2">Agency Name</label>
              <input 
                type="text" 
                value={agencySettings.agencyName}
                onChange={(e) => setAgencySettings({...agencySettings, agencyName: e.target.value})}
                className="w-full bg-white border-2 border-black rounded-xl py-3 px-4 text-black font-bold focus:outline-none focus:ring-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-black mb-2">Logo URL</label>
              <input 
                type="text" 
                value={agencySettings.logoUrl}
                onChange={(e) => setAgencySettings({...agencySettings, logoUrl: e.target.value})}
                className="w-full bg-white border-2 border-black rounded-xl py-3 px-4 text-black font-bold focus:outline-none focus:ring-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                placeholder="https://example.com/logo.png"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-black mb-2">Default Hourly Rate ($)</label>
              <input 
                type="number" 
                value={agencySettings.hourlyRate}
                onChange={(e) => setAgencySettings({...agencySettings, hourlyRate: Number(e.target.value)})}
                className="w-full bg-white border-2 border-black rounded-xl py-3 px-4 text-black font-bold focus:outline-none focus:ring-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-black mb-2">Invoice Terms & Conditions</label>
              <input 
                type="text" 
                value={agencySettings.invoiceTerms}
                onChange={(e) => setAgencySettings({...agencySettings, invoiceTerms: e.target.value})}
                className="w-full bg-white border-2 border-black rounded-xl py-3 px-4 text-black font-bold focus:outline-none focus:ring-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                placeholder="Payment due within 30 days."
              />
            </div>
          </div>
          <button 
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-[#F59E0B] text-black px-6 py-3 rounded-xl font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-1 transition-all uppercase tracking-wide mt-8"
          >
            <Save className="w-5 h-5" /> Save Agency Settings
          </button>
        </form>
      </div>

      {/* Account Actions */}
      <div className="bg-[#F43F5E] rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white uppercase">Account Actions</h2>
          <p className="text-white font-bold mt-1">Sign out of your account on this device.</p>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 bg-white text-black px-8 py-4 rounded-xl font-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-1 transition-all uppercase tracking-wide shrink-0"
        >
          <LogOut className="w-6 h-6 stroke-2" /> Log Out
        </button>
      </div>
    </div>
  );
}
