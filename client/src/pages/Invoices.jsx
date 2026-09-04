import React, { useState, useEffect } from 'react';
import { Download, FileText, Plus, X, Trash2 } from 'lucide-react';
import { fetchAuth } from '../utils/fetchAuth';
import toast from 'react-hot-toast';
import { confirmDelete } from '../utils/toastConfirm';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import Select from '../components/Select';
import DatePicker from '../components/DatePicker';

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ invoiceId: '', client: '', amount: '', date: '', status: 'Pending' });

  const [clients, setClients] = useState([]);

  useEffect(() => {
    fetchAuth('/api/invoices')
      .then(res => res.json())
      .then(data => setInvoices(data))
      .catch(err => console.error(err));
      
    fetchAuth('/api/clients')
      .then(res => res.json())
      .then(data => setClients(data))
      .catch(err => console.error(err));
  }, []);

  const openAddModal = () => {
    setIsEditing(false);
    setEditId(null);
    setFormData({ invoiceId: '', client: '', amount: '', date: '', status: 'Pending' });
    setIsModalOpen(true);
  };

  const openEditModal = (inv) => {
    setIsEditing(true);
    setEditId(inv._id || inv.id);
    setFormData({
      invoiceId: inv.invoiceId,
      client: inv.client?._id || inv.client,
      amount: inv.amount,
      date: inv.date,
      status: inv.status
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.client || !formData.amount || !formData.date) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      if (isEditing) {
        const res = await fetchAuth(`/api/invoices/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        const updatedInvoice = await res.json();
        if (!res.ok) throw new Error(updatedInvoice.message || 'Failed to update');
        setInvoices(invoices.map(i => (i._id || i.id) === editId ? updatedInvoice : i));
        toast.success('Invoice updated successfully!');
      } else {
        const res = await fetchAuth('/api/invoices', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        const savedInvoice = await res.json();
        if (!res.ok) throw new Error(savedInvoice.message || 'Failed to create');
        setInvoices([savedInvoice, ...invoices]);
        toast.success('Invoice created successfully!');
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error(`Error: ${err.message}`);
    }
  };

  const handleDeleteInvoice = (id) => {
    confirmDelete('Are you sure you want to delete this invoice?', async () => {
      try {
        await fetchAuth(`/api/invoices/${id}`, { method: 'DELETE' });
        setInvoices(invoices.filter(i => (i._id || i.id) !== id));
        toast.success('Invoice deleted!');
      } catch (err) {
        console.error(err);
        toast.error('Failed to delete invoice');
      }
    });
  };

  const generatePDF = async (inv) => {
    const invoiceElement = document.createElement('div');
    invoiceElement.innerHTML = `
      <div style="padding: 40px; font-family: sans-serif; width: 600px; background: white; color: black; border: 4px solid black;">
        <h1 style="font-size: 32px; font-weight: 900; text-transform: uppercase; border-bottom: 4px solid black; padding-bottom: 20px; margin-bottom: 20px;">INVOICE</h1>
        <div style="display: flex; justify-content: space-between; margin-bottom: 40px;">
          <div>
            <p style="font-weight: 700; font-size: 14px; margin: 0;">INVOICE ID</p>
            <p style="font-weight: 900; font-size: 20px; margin: 0;">${inv.invoiceId}</p>
          </div>
          <div style="text-align: right;">
            <p style="font-weight: 700; font-size: 14px; margin: 0;">DATE ISSUED</p>
            <p style="font-weight: 900; font-size: 20px; margin: 0;">${inv.date}</p>
          </div>
        </div>
        <div style="margin-bottom: 40px; padding: 20px; background: #FEF08A; border: 4px solid black; border-radius: 12px; box-shadow: 6px 6px 0px 0px rgba(0,0,0,1);">
          <p style="font-weight: 700; font-size: 14px; margin: 0; margin-bottom: 8px;">BILLED TO</p>
          <p style="font-weight: 900; font-size: 24px; margin: 0;">${inv.client?.name || inv.client}</p>
        </div>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 40px;">
          <thead>
            <tr style="border-bottom: 4px solid black; background: #E0F2FE;">
              <th style="text-align: left; padding: 12px; font-weight: 900;">Description</th>
              <th style="text-align: right; padding: 12px; font-weight: 900;">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 12px; font-weight: 700; border-bottom: 2px solid black;">Services Rendered</td>
              <td style="text-align: right; padding: 12px; font-weight: 900; border-bottom: 2px solid black;">${inv.amount}</td>
            </tr>
          </tbody>
        </table>
        <div style="display: flex; justify-content: flex-end;">
          <div style="width: 250px; background: #4DE3B1; padding: 20px; border: 4px solid black; border-radius: 12px; box-shadow: 6px 6px 0px 0px rgba(0,0,0,1);">
            <p style="font-weight: 700; font-size: 14px; margin: 0; margin-bottom: 8px;">TOTAL DUE</p>
            <p style="font-weight: 900; font-size: 32px; margin: 0;">${inv.amount}</p>
          </div>
        </div>
      </div>
    `;
    invoiceElement.style.position = 'absolute';
    invoiceElement.style.left = '-9999px';
    document.body.appendChild(invoiceElement);

    try {
      const canvas = await html2canvas(invoiceElement, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 10, 10, pdfWidth - 20, pdfHeight - (20 * (pdfHeight/pdfWidth)));
      return pdf;
    } finally {
      document.body.removeChild(invoiceElement);
    }
  };

  const handleExportPDF = async (inv) => {
    const toastId = toast.loading('Generating PDF...');
    try {
      const pdf = await generatePDF(inv);
      pdf.save(`Invoice_${inv.invoiceId}.pdf`);
      toast.success('PDF exported successfully!', { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error('Failed to export PDF', { id: toastId });
    }
  };

  const handleViewPDF = async (inv) => {
    const toastId = toast.loading('Opening preview...');
    try {
      const pdf = await generatePDF(inv);
      const pdfBlob = pdf.output('blob');
      const blobUrl = URL.createObjectURL(pdfBlob);
      window.open(blobUrl, '_blank');
      toast.dismiss(toastId);
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate preview', { id: toastId });
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
          onClick={openAddModal}
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
                  <td className="py-4 px-6 border-r-2 border-black text-base font-bold text-slate-700">{inv.client?.name || inv.client || 'Unknown Client'}</td>
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
                      <button 
                        onClick={() => openEditModal(inv)}
                        className="p-2 text-black hover:bg-[#FEF08A] border-2 border-transparent hover:border-black rounded-xl transition-all hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteInvoice(inv._id || inv.id)}
                        className="p-2 text-white bg-[#F43F5E] hover:bg-[#E11D48] border-2 border-black rounded-xl transition-all hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5"
                        title="Delete Invoice"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleViewPDF(inv)}
                        className="p-2 text-black hover:bg-[#E0F2FE] border-2 border-transparent hover:border-black rounded-xl transition-all hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                        title="View Invoice"
                      >
                        <FileText className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleExportPDF(inv)}
                        className="p-2 text-black hover:bg-[#E9D5FF] border-2 border-transparent hover:border-black rounded-xl transition-all hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                        title="Export PDF"
                      >
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
          <div className="bg-white rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-md animate-in fade-in zoom-in duration-200">
            <div className={`${isEditing ? 'bg-[#FEF08A]' : 'bg-[#4DE3B1]'} rounded-t-[12px] border-b-4 border-black p-4 flex items-center justify-between`}>
              <h2 className="text-xl font-black text-black uppercase">{isEditing ? 'Edit Invoice' : 'Create Invoice'}</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 border-2 border-black rounded-lg bg-white hover:bg-black hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-black mb-1">Amount</label>
                <input 
                  type="text" 
                  required
                  value={formData.amount}
                  onChange={e => setFormData({...formData, amount: e.target.value})}
                  className="w-full bg-white border-2 border-black rounded-xl py-2 px-3 text-black font-bold focus:outline-none focus:ring-0 focus:border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  placeholder="$1,000.00"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-black mb-1">Client Name</label>
                <Select 
                  value={formData.client}
                  onChange={(val) => setFormData({...formData, client: val})}
                  placeholder="Select a client"
                  options={clients.map(c => ({ value: c._id || c.id, label: c.name }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-black mb-1">Date Issued</label>
                  <DatePicker 
                    value={formData.date}
                    onChange={(val) => setFormData({...formData, date: val})}
                    placeholder="Dec 31, 2026"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-black mb-1">Status</label>
                  <Select 
                    value={formData.status}
                    onChange={(val) => setFormData({...formData, status: val})}
                    options={[
                      { value: 'Pending', label: 'Pending' },
                      { value: 'Paid', label: 'Paid' },
                      { value: 'Overdue', label: 'Overdue' }
                    ]}
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
                  className="bg-[#F59E0B] text-black px-6 py-2 rounded-xl font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-1 transition-all uppercase tracking-wide"
                >
                  {isEditing ? 'Save Changes' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
