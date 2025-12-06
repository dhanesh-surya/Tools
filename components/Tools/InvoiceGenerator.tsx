import React, { useState } from 'react';
import { Plus, Trash2, Download, Eye, FileText, Calculator, Building2, User } from 'lucide-react';

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface InvoiceData {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  from: { name: string; company: string; email: string; phone: string; address: string };
  to: { name: string; company: string; email: string; address: string };
  items: InvoiceItem[];
  taxRate: number;
  notes: string;
  termsAndConditions: string;
}

const InvoiceGenerator: React.FC = () => {
  const [invoice, setInvoice] = useState<InvoiceData>({
    invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    from: { name: '', company: '', email: '', phone: '', address: '' },
    to: { name: '', company: '', email: '', address: '' },
    items: [],
    taxRate: 0,
    notes: '',
    termsAndConditions: 'Payment is due within 30 days. Late payments may incur additional charges.',
  });

  const [currentItem, setCurrentItem] = useState({ description: '', quantity: 1, rate: 0 });
  const [showPreview, setShowPreview] = useState(false);

  const addItem = () => {
    if (!currentItem.description || currentItem.rate <= 0) return alert('Please fill in item description and rate');
    setInvoice({
      ...invoice,
      items: [...invoice.items, {
        id: Date.now().toString(),
        description: currentItem.description,
        quantity: currentItem.quantity,
        rate: currentItem.rate,
        amount: currentItem.quantity * currentItem.rate,
      }]
    });
    setCurrentItem({ description: '', quantity: 1, rate: 0 });
  };

  const deleteItem = (id: string) => {
    setInvoice({ ...invoice, items: invoice.items.filter(item => item.id !== id) });
  };

  const calculateSubtotal = () => invoice.items.reduce((sum, item) => sum + item.amount, 0);
  const calculateTax = () => (calculateSubtotal() * invoice.taxRate) / 100;
  const calculateTotal = () => calculateSubtotal() + calculateTax();

  const downloadInvoice = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>Invoice-${invoice.invoiceNumber}-${new Date().toISOString().split('T')[0]}</title>
<style>
body{font-family:'Segoe UI',sans-serif;max-width:850px;margin:40px auto;padding:40px;background:#fff;color:#333}
.invoice-header{display:flex;justify-content:space-between;margin-bottom:50px;padding-bottom:30px;border-bottom:3px solid #4f46e5}
.invoice-title{font-size:48px;font-weight:700;color:#4f46e5}
parties-section{display:grid;grid-template-columns:1fr 1fr;gap:60px;margin-bottom:50px}
.party-details{background:#f8fafc;padding:25px;border-radius:8px;border-left:4px solid #4f46e5}
.section-title{font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#64748b;margin-bottom:15px;font-weight:600}
.party-name{font-size:18px;font-weight:700;color:#1e293b}
table{width:100%;border-collapse:collapse;margin:40px 0}
thead{background:linear-gradient(135deg,#667eea,#764ba2);color:white}
th{padding:15px;text-align:left;font-weight:600;font-size:13px}
td{padding:15px;font-size:14px;color:#475569;border-bottom:1px solid #e2e8f0}
th:nth-child(2),td:nth-child(2){text-align:center}
th:nth-child(3),th:nth-child(4),td:nth-child(3),td:nth-child(4){text-align:right}
.totals-section{display:flex;justify-content:flex-end;margin-top:40px}
.totals-box{width:350px;background:#f8fafc;border-radius:8px;padding:25px}
.total-row{display:flex;justify-content:space-between;padding:10px 0}
.grand-total{margin-top:15px;padding-top:15px;border-top:2px solid #4f46e5;font-size:24px;font-weight:700;color:#4f46e5}
@media print{body{padding:0;margin:0}@page{margin:15mm;size:A4}}
</style>
<script>window.onload=function(){setTimeout(function(){window.print()},500)}</script>
</head><body>
<div class="invoice-header">
  <div><div class="invoice-title">INVOICE</div><div>#${invoice.invoiceNumber}</div></div>
  <div style="text-align:right"><div><strong>Date:</strong> ${new Date(invoice.date).toLocaleDateString()}</div>
  <div><strong>Due:</strong> ${new Date(invoice.dueDate).toLocaleDateString()}</div></div>
</div>
<div class="parties-section">
  <div class="party-details">
    <div class="section-title">From</div>
    <div class="party-name">${invoice.from.name}</div>
    ${invoice.from.company ? `<div>${invoice.from.company}</div>` : ''}
    <div>${invoice.from.email}</div><div>${invoice.from.phone}</div><div>${invoice.from.address}</div>
  </div>
  <div class="party-details">
    <div class="section-title">Bill To</div>
    <div class="party-name">${invoice.to.name}</div>
    ${invoice.to.company ? `<div>${invoice.to.company}</div>` : ''}
    <div>${invoice.to.email}</div><div>${invoice.to.address}</div>
  </div>
</div>
<table>
  <thead><tr><th>Description</th><th>Qty</th><th>Rate</th><th>Amount</th></tr></thead>
  <tbody>${invoice.items.map(item => `<tr><td>${item.description}</td><td>${item.quantity}</td>
      <td>$${item.rate.toFixed(2)}</td><td>$${item.amount.toFixed(2)}</td></tr>`).join('')}</tbody>
</table>
<div class="totals-section"><div class="totals-box">
  <div class="total-row"><span>Subtotal</span><span>$${calculateSubtotal().toFixed(2)}</span></div>
  ${invoice.taxRate > 0 ? `<div class="total-row"><span>Tax (${invoice.taxRate}%)</span><span>$${calculateTax().toFixed(2)}</span></div>` : ''}
  <div class="total-row grand-total"><span>TOTAL</span><span>$${calculateTotal().toFixed(2)}</span></div>
</div></div>
${invoice.notes ? `<div style="margin-top:40px;padding:25px;background:#fffbeb;border-left:4px solid #f59e0b;border-radius:8px">
<div class="section-title">Notes</div><p>${invoice.notes}</p></div>` : ''}
<div style="margin-top:40px;padding:25px;background:#f1f5f9;border-radius:8px">
<div class="section-title">Terms & Conditions</div><p>${invoice.termsAndConditions}</p></div>
</body></html>`);
    printWindow.document.close();
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
            <FileText className="w-10 h-10 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Invoice Generator</h1>
        <p className="text-slate-600 dark:text-slate-400">Create professional invoices in minutes</p>
      </div>

      {!showPreview ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['invoiceNumber', 'date', 'dueDate'].map(field => (
              <div key={field} className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  {field === 'invoiceNumber' ? 'Invoice Number' : field === 'date' ? 'Date' : 'Due Date'}
                </label>
                <input type={field === 'invoiceNumber' ? 'text' : 'date'} value={invoice[field as keyof typeof invoice] as string}
                  onChange={(e) => setInvoice({ ...invoice, [field]: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[{ title: 'From (You)', icon: Building2, data: invoice.from, key: 'from' as const },
            { title: 'Bill To (Client)', icon: User, data: invoice.to, key: 'to' as const }].map(({ title, icon: Icon, data, key }) => (
              <div key={key} className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Icon size={20} />{title}
                </h3>
                <div className="space-y-3">
                  {['name', 'company', 'email', key === 'from' ? 'phone' : null, 'address'].filter(Boolean).map(field =>
                    field === 'address' ? (
                      <textarea key={field} placeholder="Address" value={data[field as keyof typeof data]}
                        onChange={(e) => setInvoice({ ...invoice, [key]: { ...data, [field]: e.target.value } })}
                        className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none h-20" />
                    ) : (
                      <input key={field!} type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
                        placeholder={field === 'company' ? 'Company (Optional)' : field!.charAt(0).toUpperCase() + field!.slice(1)}
                        value={data[field! as keyof typeof data]}
                        onChange={(e) => setInvoice({ ...invoice, [key]: { ...data, [field!]: e.target.value } })}
                        className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500" />
                    )
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Add Items</h3>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-4">
              <input type="text" placeholder="Description" value={currentItem.description}
                onChange={(e) => setCurrentItem({ ...currentItem, description: e.target.value })}
                className="md:col-span-6 px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500" />
              <input type="number" placeholder="Qty" min="1" value={currentItem.quantity}
                onChange={(e) => setCurrentItem({ ...currentItem, quantity: parseInt(e.target.value) || 1 })}
                className="md:col-span-2 px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500" />
              <input type="number" placeholder="Rate" min="0" step="0.01" value={currentItem.rate}
                onChange={(e) => setCurrentItem({ ...currentItem, rate: parseFloat(e.target.value) || 0 })}
                className="md:col-span-2 px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500" />
              <button onClick={addItem}
                className="md:col-span-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-bold flex items-center justify-center gap-2">
                <Plus size={18} />Add
              </button>
            </div>

            {invoice.items.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 dark:bg-slate-700">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Description</th>
                      <th className="text-center py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Qty</th>
                      <th className="text-right py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Rate</th>
                      <th className="text-right py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Amount</th>
                      <th className="text-center py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items.map(item => (
                      <tr key={item.id} className="border-b border-slate-200 dark:border-slate-700">
                        <td className="py-3 px-4 text-slate-900 dark:text-white">{item.description}</td>
                        <td className="py-3 px-4 text-center text-slate-700 dark:text-slate-300">{item.quantity}</td>
                        <td className="py-3 px-4 text-right text-slate-700 dark:text-slate-300">${item.rate.toFixed(2)}</td>
                        <td className="py-3 px-4 text-right font-bold text-slate-900 dark:text-white">${item.amount.toFixed(2)}</td>
                        <td className="py-3 px-4 text-center">
                          <button onClick={() => deleteItem(item.id)}
                            className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 rounded-lg">
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Additional Info</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Tax Rate (%)</label>
                  <input type="number" min="0" max="100" step="0.1" value={invoice.taxRate}
                    onChange={(e) => setInvoice({ ...invoice, taxRate: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Notes</label>
                  <textarea value={invoice.notes} onChange={(e) => setInvoice({ ...invoice, notes: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none h-24"
                    placeholder="Add notes..." />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-200 dark:border-blue-800 p-6">
              <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-4 flex items-center gap-2">
                <Calculator size={20} />Invoice Summary
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-slate-700 dark:text-slate-300">
                  <span>Subtotal:</span><span className="font-bold">${calculateSubtotal().toFixed(2)}</span>
                </div>
                {invoice.taxRate > 0 && (
                  <div className="flex justify-between text-slate-700 dark:text-slate-300">
                    <span>Tax ({invoice.taxRate}%):</span><span className="font-bold">${calculateTax().toFixed(2)}</span>
                  </div>
                )}
                <div className="pt-3 border-t-2 border-blue-200 dark:border-blue-800">
                  <div className="flex justify-between text-blue-900 dark:text-blue-100">
                    <span className="text-xl font-bold">Total:</span>
                    <span className="text-2xl font-bold">${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button onClick={() => setShowPreview(true)} disabled={invoice.items.length === 0}
              className="flex-1 px-6 py-4 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 disabled:bg-slate-100 text-slate-700 dark:text-slate-300 rounded-xl font-bold flex items-center justify-center gap-2">
              <Eye size={20} />Preview
            </button>
            <button onClick={downloadInvoice} disabled={invoice.items.length === 0}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-400 disabled:cursor-not-allowed text-white rounded-xl font-bold shadow-lg flex items-center justify-center gap-2">
              <Download size={20} />Download PDF
            </button>
          </div>
        </>
      ) : (
        <div className="space-y-6">
          <button onClick={() => setShowPreview(false)}
            className="px-6 py-3 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-700 dark:text-slate-300 rounded-xl font-bold">
            ← Back
          </button>
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-12">
            <div className="flex justify-between mb-12">
              <div><h1 className="text-5xl font-bold text-blue-600">INVOICE</h1><p className="text-slate-500">#{invoice.invoiceNumber}</p></div>
              <div className="text-right text-sm">
                <div><strong>Date:</strong> {new Date(invoice.date).toLocaleDateString()}</div>
                <div><strong>Due:</strong> {new Date(invoice.dueDate).toLocaleDateString()}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-12 mb-12">
              <div>
                <h3 className="font-bold mb-2">From:</h3>
                <p className="font-bold">{invoice.from.name}</p>
                {invoice.from.company && <p>{invoice.from.company}</p>}
                <p>{invoice.from.email}</p><p>{invoice.from.phone}</p>
                <p className="text-sm text-slate-600">{invoice.from.address}</p>
              </div>
              <div>
                <h3 className="font-bold mb-2">Bill To:</h3>
                <p className="font-bold">{invoice.to.name}</p>
                {invoice.to.company && <p>{invoice.to.company}</p>}
                <p>{invoice.to.email}</p>
                <p className="text-sm text-slate-600">{invoice.to.address}</p>
              </div>
            </div>
            <table className="w-full mb-8">
              <thead className="bg-blue-50 dark:bg-blue-900/20">
                <tr>
                  <th className="text-left py-4 px-4">Description</th>
                  <th className="text-center py-4 px-4">Qty</th>
                  <th className="text-right py-4 px-4">Rate</th>
                  <th className="text-right py-4 px-4">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map(item => (
                  <tr key={item.id} className="border-b border-slate-200">
                    <td className="py-4 px-4">{item.description}</td>
                    <td className="py-4 px-4 text-center">{item.quantity}</td>
                    <td className="py-4 px-4 text-right">${item.rate.toFixed(2)}</td>
                    <td className="py-4 px-4 text-right font-bold">${item.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-end mb-8">
              <div className="w-64 space-y-2">
                <div className="flex justify-between"><span>Subtotal:</span><span className="font-bold">${calculateSubtotal().toFixed(2)}</span></div>
                {invoice.taxRate > 0 && (
                  <div className="flex justify-between"><span>Tax ({invoice.taxRate}%):</span><span className="font-bold">${calculateTax().toFixed(2)}</span></div>
                )}
                <div className="flex justify-between pt-2 border-t-2 border-blue-600">
                  <span className="text-xl font-bold">Total:</span>
                  <span className="text-2xl font-bold text-blue-600">${calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
            {invoice.notes && (
              <div className="mb-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <h4 className="font-bold mb-2">Notes:</h4><p className="text-sm">{invoice.notes}</p>
              </div>
            )}
            <div className="pt-8 border-t-2 border-slate-200 text-sm text-slate-500">
              <h4 className="font-bold mb-2">Terms & Conditions:</h4>
              <p>{invoice.termsAndConditions}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceGenerator;