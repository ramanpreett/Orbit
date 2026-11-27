import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Briefcase, FileText, Calendar, Download } from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { apiUrl } from '../utils/api';

export default function ClientPortal() {
  const { token } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(apiUrl(`/api/portal/${token}`))
      .then(res => {
        if (!res.ok) throw new Error('Invalid or expired portal link');
        return res.json();
      })
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [token]);

  // Reuse the invoice PDF generator but without Settings (or default settings)
  const handleDownloadInvoice = async (inv) => {
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
          <p style="font-weight: 900; font-size: 24px; margin: 0;">${data.client.name}</p>
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
              <td style="text-align: right; padding: 12px; font-weight: 900; border-bottom: 2px solid black;">$${inv.amount.toString().replace(/^\$/, '')}</td>
            </tr>
          </tbody>
        </table>
        <div style="display: flex; justify-content: flex-end;">
          <div style="width: 250px; background: #4DE3B1; padding: 20px; border: 4px solid black; border-radius: 12px; box-shadow: 6px 6px 0px 0px rgba(0,0,0,1);">
            <p style="font-weight: 700; font-size: 14px; margin: 0; margin-bottom: 8px;">TOTAL DUE</p>
            <p style="font-weight: 900; font-size: 32px; margin: 0;">$${inv.amount.toString().replace(/^\$/, '')}</p>
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
      pdf.save(`Invoice_${inv.invoiceId}.pdf`);
    } catch (err) {
      console.error(err);
      alert('Failed to generate PDF');
    } finally {
      document.body.removeChild(invoiceElement);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center">
        <div className="text-2xl font-black uppercase text-black animate-pulse">Loading Portal...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center p-4">
        <div className="bg-[#F43F5E] p-8 rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-md text-center">
          <h1 className="text-3xl font-black text-white uppercase mb-2">Access Denied</h1>
          <p className="text-white font-bold">{error || 'Unable to load portal data.'}</p>
        </div>
      </div>
    );
  }

  const { client, projects, invoices, meetings } = data;

  return (
    <div className="min-h-screen bg-[#FDFDFD] p-6 lg:p-12 relative" style={{ backgroundImage: 'radial-gradient(circle, #CBD5E1 1.5px, transparent 1.5px)', backgroundSize: '32px 32px' }}>
      <div className="max-w-5xl mx-auto space-y-8 relative z-10">
        
        {/* Header */}
        <div className="bg-[#FEF08A] rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8">
          <h1 className="text-4xl font-black text-black uppercase">Welcome, {client.name}</h1>
          <p className="text-lg font-bold text-slate-800 mt-2">Here is the latest overview of your projects, meetings, and invoices.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Projects Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-[#E0F2FE] border-2 border-black rounded-xl">
                  <Briefcase className="w-6 h-6 text-black" />
                </div>
                <h2 className="text-2xl font-black text-black uppercase">Active Projects</h2>
              </div>
              
              <div className="space-y-4">
                {projects.map(p => (
                  <div key={p._id} className="p-4 border-2 border-black rounded-xl bg-gray-50 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-lg text-black">{p.name}</h3>
                      <p className="text-sm font-bold text-slate-600 mt-1">Status: {p.status}</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-3 py-1 bg-black text-white text-xs font-black uppercase rounded-lg border-2 border-transparent">{p.progress}% Complete</span>
                    </div>
                  </div>
                ))}
                {projects.length === 0 && (
                  <p className="text-sm font-bold text-slate-500 text-center py-4">No active projects.</p>
                )}
              </div>
            </div>

            {/* Meetings Section */}
            <div className="bg-white rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-[#E9D5FF] border-2 border-black rounded-xl">
                  <Calendar className="w-6 h-6 text-black" />
                </div>
                <h2 className="text-2xl font-black text-black uppercase">Upcoming Meetings</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {meetings.map(m => (
                  <div key={m._id} className="p-4 border-2 border-black rounded-xl bg-white flex flex-col gap-2">
                    <span className="font-black text-black bg-[#E0F2FE] px-2 py-1 rounded-md self-start border-2 border-black text-xs">{m.date}</span>
                    <h3 className="font-bold text-black">{m.title}</h3>
                    {m.link && (
                      <a href={m.link} target="_blank" rel="noopener noreferrer" className="mt-2 text-sm font-bold text-blue-600 hover:underline">Join Meeting &rarr;</a>
                    )}
                  </div>
                ))}
                {meetings.length === 0 && (
                  <p className="text-sm font-bold text-slate-500 py-2">No upcoming meetings.</p>
                )}
              </div>
            </div>
          </div>

          {/* Invoices Column */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-[#4DE3B1] border-2 border-black rounded-xl">
                  <FileText className="w-6 h-6 text-black" />
                </div>
                <h2 className="text-2xl font-black text-black uppercase">Invoices</h2>
              </div>
              
              <div className="space-y-4">
                {invoices.map(inv => (
                  <div key={inv._id} className="p-4 border-2 border-black rounded-xl bg-white flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                      <span className="font-black text-black">{inv.invoiceId}</span>
                      <span className="font-black text-black">$${inv.amount.toString().replace(/^\$/, '')}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold border-2 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] text-black
                        ${inv.status === 'Paid' ? 'bg-[#4DE3B1]' :
                          inv.status === 'Pending' ? 'bg-[#FEF08A]' :
                          'bg-[#F43F5E] text-white'}`}
                      >
                        {inv.status}
                      </span>
                      <button 
                        onClick={() => handleDownloadInvoice(inv)}
                        className="p-1.5 hover:bg-[#E9D5FF] border-2 border-transparent hover:border-black rounded-lg transition-all"
                        title="Download PDF"
                      >
                        <Download className="w-4 h-4 text-black" />
                      </button>
                    </div>
                  </div>
                ))}
                {invoices.length === 0 && (
                  <p className="text-sm font-bold text-slate-500 text-center py-2">No invoices found.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
