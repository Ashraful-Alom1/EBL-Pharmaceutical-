"use client";

import React, { useState, useEffect } from "react";
import { Plus, Receipt, TrendingDown, DollarSign, Trash2, X } from "lucide-react";
import { dataStore, Expense } from "@/lib/data-store";
import { formatPaiseToInr } from "@/lib/gst";

export default function AdminExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Laboratory & R&D");
  const [amountInr, setAmountInr] = useState("25000");
  const [vendor, setVendor] = useState("");
  const [method, setMethod] = useState("Bank Transfer");

  useEffect(() => {
    setExpenses(dataStore.getExpenses());
    const unsub = dataStore.subscribe(() => {
      setExpenses([...dataStore.getExpenses()]);
    });
    return unsub;
  }, []);

  const totalPaise = expenses.reduce((s, e) => s + e.amountPaise, 0);

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const paise = Math.round(parseFloat(amountInr) * 100);

    dataStore.addExpense({
      title,
      category,
      amountPaise: paise,
      paidOn: new Date().toISOString().slice(0, 10),
      vendor,
      paymentMethod: method,
    });

    setIsModalOpen(false);
    setTitle("");
    setVendor("");
  };

  const handleDeleteExpense = (id: string, expTitle: string) => {
    if (confirm(`Are you sure you want to delete expense "${expTitle}"?`)) {
      dataStore.deleteExpense(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Expense Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track operational outlays across laboratory research, logistics partners, and packaging.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#0A1B8F] hover:bg-[#1527ab] text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-2 self-start sm:self-auto transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Record Expense</span>
        </button>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Total Operational Outlay
          </span>
          <div className="text-2xl font-black text-slate-900">
            {formatPaiseToInr(totalPaise)}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">
            Across {expenses.length} recorded entries
          </span>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Title / Purpose</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Vendor / Payee</th>
                <th className="py-3.5 px-4">Payment Method</th>
                <th className="py-3.5 px-4 text-right">Amount</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {expenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-4 text-slate-500 font-mono">{exp.paidOn}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{exp.title}</td>
                  <td className="py-3.5 px-4">
                    <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                      {exp.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700">{exp.vendor}</td>
                  <td className="py-3.5 px-4 text-slate-600">{exp.paymentMethod}</td>
                  <td className="py-3.5 px-4 font-black text-slate-900 text-right">
                    {formatPaiseToInr(exp.amountPaise)}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleDeleteExpense(exp.id, exp.title)}
                      className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                      title="Delete Expense"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {expenses.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No expenses recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-xl font-black text-slate-900">Record Operational Expense</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddExpense} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Expense Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Courier Freight Advance"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#0A1B8F]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#0A1B8F] bg-white font-medium"
                >
                  <option value="Laboratory & R&D">Laboratory &amp; R&amp;D</option>
                  <option value="Logistics & Shipping">Logistics &amp; Shipping</option>
                  <option value="Packaging">Packaging Materials</option>
                  <option value="Salaries & Staff">Salaries &amp; Staff</option>
                  <option value="Utilities & Rent">Utilities &amp; Facility Rent</option>
                  <option value="Marketing & Design">Marketing &amp; Content</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    value={amountInr}
                    onChange={(e) => setAmountInr(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#0A1B8F]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Payment Method</label>
                  <select
                    value={method}
                    onChange={(e) => setMethod(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#0A1B8F] bg-white"
                  >
                    <option value="Bank Transfer">Bank Transfer (NEFT)</option>
                    <option value="UPI">UPI / QR Code</option>
                    <option value="Cheque">Corporate Cheque</option>
                    <option value="Cash">Petty Cash</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Vendor / Payee</label>
                <input
                  type="text"
                  value={vendor}
                  onChange={(e) => setVendor(e.target.value)}
                  placeholder="e.g. BlueDart Express"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#0A1B8F]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="text-xs font-bold text-slate-500 px-4 py-2 hover:bg-slate-100 rounded-full"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#0A1B8F] text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-md hover:bg-[#1527ab] transition-colors"
                >
                  Record Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
