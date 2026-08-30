import React, { useState, useEffect } from 'react';
import { Download, FileText, Plus, X } from 'lucide-react';

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newInvoice, setNewInvoice] = useState({ invoiceId: '', client: '', amount: '', date: '', status: 'Pending' });

  useEffect(() => {
    fetch('/api/invoices')
      .then(res => res.json())
      .then(data => setInvoices(data))
      .catch(err => console.error(err));
  }, []);

  const handleAddInvoice = async (e) => {
    e.preventDefault();
    if (!newInvoice.invoiceId || !newInvoice.client) return;

    try {
      const res = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newInvoice)
      });
      const savedInvoice = await res.json();
      setInvoices([savedInvoice, ...invoices]);
      setIsModalOpen(false);
      setNewInvoice({ invoiceId: '', client: '', amount: '', date: '', status: 'Pending' });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 h-full flex flex-col relative z-10">
      <div className="flex items-center justify-between bg-white border-2 border-black p-6 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div>
          <h1 className="text-3xl font-black text-black uppercase tracking-tight">Invoices</h1>
          <p className="text-sm font-bold text-slate-600 mt-1">Manage billing and track your payments.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#F59E0B] text-black px-6 py-2.5 rounded-xl font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-1 transition-all uppercase tracking-wide"
        >
          <Plus className="w-5 h-5 border-2 border-transparent bg-white text-black rounded-full p-0.5" /> Create Invoice
        </button>
      </div>

      <div className="bg-white rounded-2xl border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex-1 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#E0F2FE] border-b-2 border-black">
                <th className="py-4 px-6 text-sm font-black text-black uppercase tracking-wider border-r-2 border-black">Invoice ID</th>
                <th className="py-4 px-6 text-sm font-black text-black uppercase tracking-wider border-r-2 border-black">Client</th>
                <th className="py-4 px-6 text-sm font-black text-black uppercase tracking-wider border-r-2 border-black">Amount</th>
                <th className="py-4 px-6 text-sm font-black text-black uppercase tracking-wider border-r-2 border-black">Date Issued</th>
                <th className="py-4 px-6 text-sm font-black text-black uppercase tracking-wider border-r-2 border-black">Status</th>
                <th className="py-4 px-6 text-sm font-black text-black uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-black">
              {invoices.map((inv) => (
                <tr key={inv._id || inv.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6 border-r-2 border-black">
                    <span className="text-base font-black text-black bg-[#FEF08A] px-2 py-1 rounded-md border-2 border-black">{inv.invoiceId}</span>
                  </td>
                  <td className="py-4 px-6 border-r-2 border-black text-base font-bold text-slate-700">{inv.client}</td>
                  <td className="py-4 px-6 border-r-2 border-black text-base font-black text-black">{inv.amount}</td>
                  <td className="py-4 px-6 border-r-2 border-black text-sm font-bold text-slate-600">{inv.date}</td>
                  <td className="py-4 px-6 border-r-2 border-black">
                    <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-black
                      ${inv.status === 'Paid' ? 'bg-[#4DE3B1]' : 
                        inv.status === 'Pending' ? 'bg-[#FEF08A]' : 
                        'bg-[#F43F5E] text-white'}`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button className="p-2 text-black hover:bg-[#E0F2FE] border-2 border-transparent hover:border-black rounded-xl transition-all hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        <FileText className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-black hover:bg-[#E9D5FF] border-2 border-transparent hover:border-black rounded-xl transition-all hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        <Download className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {invoices.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-12 text-center">
                    <div className="inline-block border-2 border-black rounded-2xl bg-[#FDFDFD] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6">
                      <p className="text-lg font-black text-black uppercase">No invoices found</p>
                      <p className="text-sm font-bold text-slate-600 mt-1">Create one to get started.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Invoice Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-[#4DE3B1] border-b-4 border-black p-4 flex items-center justify-between">
              <h2 className="text-xl font-black text-black uppercase">Create Invoice</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 border-2 border-black rounded-lg bg-white hover:bg-black hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddInvoice} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-black mb-1">Invoice ID</label>
                  <input 
                    type="text" 
                    required
                    value={newInvoice.invoiceId}
                    onChange={e => setNewInvoice({...newInvoice, invoiceId: e.target.value})}
                    className="w-full bg-white border-2 border-black rounded-xl py-2 px-3 text-black font-bold focus:outline-none focus:ring-0 focus:border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    placeholder="INV-001"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-black mb-1">Amount</label>
                  <input 
                    type="text" 
                    required
                    value={newInvoice.amount}
                    onChange={e => setNewInvoice({...newInvoice, amount: e.target.value})}
                    className="w-full bg-white border-2 border-black rounded-xl py-2 px-3 text-black font-bold focus:outline-none focus:ring-0 focus:border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    placeholder="$1,000.00"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-black mb-1">Client Name</label>
                <input 
                  type="text" 
                  required
                  value={newInvoice.client}
                  onChange={e => setNewInvoice({...newInvoice, client: e.target.value})}
                  className="w-full bg-white border-2 border-black rounded-xl py-2 px-3 text-black font-bold focus:outline-none focus:ring-0 focus:border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  placeholder="Acme Corp"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-black mb-1">Date Issued</label>
                  <input 
                    type="text" 
                    required
                    value={newInvoice.date}
                    onChange={e => setNewInvoice({...newInvoice, date: e.target.value})}
                    className="w-full bg-white border-2 border-black rounded-xl py-2 px-3 text-black font-bold focus:outline-none focus:ring-0 focus:border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    placeholder="Dec 31, 2026"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-black mb-1">Status</label>
                  <select 
                    value={newInvoice.status}
                    onChange={e => setNewInvoice({...newInvoice, status: e.target.value})}
                    className="w-full bg-white border-2 border-black rounded-xl py-2 px-3 text-black font-bold focus:outline-none focus:ring-0 focus:border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] appearance-none"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Overdue">Overdue</option>
                  </select>
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
                  className="bg-[#F59E0B] text-black px-6 py-2 rounded-xl font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-1 transition-all uppercase tracking-wide"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
