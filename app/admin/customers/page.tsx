"use client";

import React, { useState, useEffect } from "react";
import { Users, Phone, Mail, Building, Plus, CheckCircle2, Trash2, X } from "lucide-react";
import { dataStore, Lead } from "@/lib/data-store";

const LEAD_STAGES: Lead["status"][] = ["NEW", "CONTACTED", "QUALIFIED", "PROPOSAL", "WON", "LOST"];

export default function AdminCustomersPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [source, setSource] = useState("Direct Inquiry");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    setLeads(dataStore.getLeads());
    const unsub = dataStore.subscribe(() => {
      setLeads([...dataStore.getLeads()]);
    });
    return unsub;
  }, []);

  const handleAddLead = (e: React.FormEvent) => {
    e.preventDefault();
    dataStore.addLead({
      name,
      email,
      phone,
      company: company || "Retail Customer",
      source,
      notes,
    });
    setIsModalOpen(false);
    setName("");
    setEmail("");
    setPhone("");
    setNotes("");
  };

  const handleStageChange = (id: string, stage: Lead["status"]) => {
    dataStore.updateLeadStatus(id, stage);
  };

  const handleDeleteLead = (id: string, leadName: string) => {
    if (confirm(`Are you sure you want to remove lead for ${leadName}?`)) {
      dataStore.deleteLead(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            CRM &amp; Distribution Leads
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Institutional buyers, retail pharmacy chains, and prospective domestic distributors.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#0A1B8F] hover:bg-[#1527ab] text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-2 self-start sm:self-auto transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Lead / Account</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Contact Person / Entity</th>
                <th className="py-3.5 px-4">Company</th>
                <th className="py-3.5 px-4">Contact Info</th>
                <th className="py-3.5 px-4">Channel Source</th>
                <th className="py-3.5 px-4">Stage</th>
                <th className="py-3.5 px-4">Notes / Requirements</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{lead.name}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-700">{lead.company}</td>
                  <td className="py-3.5 px-4">
                    <span className="text-slate-900 block">{lead.phone}</span>
                    <span className="text-[10px] text-slate-400">{lead.email}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">{lead.source}</td>
                  <td className="py-3.5 px-4">
                    <select
                      value={lead.status}
                      onChange={(e) => handleStageChange(lead.id, e.target.value as Lead["status"])}
                      className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full text-[10px] font-bold border border-purple-200 outline-none cursor-pointer"
                    >
                      {LEAD_STAGES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">
                    {lead.notes}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleDeleteLead(lead.id, lead.name)}
                      className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                      title="Delete Lead"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {leads.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No CRM accounts or leads logged yet.
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
              <h3 className="text-xl font-black text-slate-900">Add Prospective Account / Lead</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddLead} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Contact Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dr. Rajesh Gupta"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#0A1B8F]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Company / Clinic / Pharmacy</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Gupta PolyClinic"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#0A1B8F]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Phone *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 94360..."
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#0A1B8F]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contact@guptaclinic.com"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#0A1B8F]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Source / Discovery Channel</label>
                <select
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#0A1B8F] bg-white"
                >
                  <option value="Direct Inquiry">Direct Inquiry (Website Form)</option>
                  <option value="Medical Representative">Medical Representative Field Visit</option>
                  <option value="Pharma Expo">North-East Healthcare Expo</option>
                  <option value="Tender / Institutional">Government / Hospital Tender</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Requirements / Notes</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Requested pricing quote, batch sampling request..."
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
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
