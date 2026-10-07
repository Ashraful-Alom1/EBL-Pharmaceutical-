"use client";

import React, { useState, useEffect } from "react";
import {
  Building2,
  ShoppingBag,
  Save,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Share2,
  RotateCcw,
  Sparkles,
  ExternalLink,
  MessageCircle
} from "lucide-react";
import { dataStore, CompanySettings } from "@/lib/data-store";
import { INITIAL_COMPANY_SETTINGS } from "@/lib/constants";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<"corporate" | "shop">("corporate");
  const [formData, setFormData] = useState<CompanySettings>(dataStore.getCompanySettings());
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setFormData(dataStore.getCompanySettings());
    const unsub = dataStore.subscribe(() => {
      setFormData(dataStore.getCompanySettings());
    });
    return unsub;
  }, []);

  const handleChange = (field: keyof CompanySettings, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    dataStore.updateCompanySettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  const handleResetToDefaults = () => {
    if (confirm("Are you sure you want to restore default company and store details?")) {
      setFormData({ ...INITIAL_COMPANY_SETTINGS });
      dataStore.updateCompanySettings({ ...INITIAL_COMPANY_SETTINGS });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Company &amp; Store Information Settings
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage contact details, registered office addresses, customer support helplines, and footer information for both corporate and online store sections.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleResetToDefaults}
            className="px-4 py-2.5 rounded-full text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center gap-1.5 cursor-pointer border border-slate-200"
            title="Reset to initial values"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={() => handleSave()}
            className="bg-[#0A1B8F] hover:bg-[#1527ab] text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-2 cursor-pointer transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save All Changes</span>
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {savedSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center gap-3 text-xs text-emerald-800 animate-in fade-in duration-200 shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <strong className="font-bold block">Settings Saved Successfully!</strong>
            <span>All changes have been permanently saved and are now live across both the corporate footer and store section footers.</span>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-200">
        <button
          onClick={() => setActiveTab("corporate")}
          className={`pb-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === "corporate"
              ? "border-[#0A1B8F] text-[#0A1B8F]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Corporate Profile &amp; Footer Info</span>
        </button>

        <button
          onClick={() => setActiveTab("shop")}
          className={`pb-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === "shop"
              ? "border-[#AF4646] text-[#AF4646]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Dedicated Shop Section &amp; Footer Details</span>
        </button>
      </div>

      {/* TAB 1: CORPORATE PROFILE & FOOTER */}
      {activeTab === "corporate" && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
            <div className="border-b pb-4">
              <h2 className="font-black text-slate-900 text-base flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#0A1B8F]" />
                <span>Corporate Profile &amp; Legal Identity</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                These details are displayed on the main corporate website, About page, Contact page, and Corporate Footer.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Company Legal Name *</label>
                <input
                  type="text"
                  value={formData.legalName}
                  onChange={(e) => handleChange("legalName", e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 outline-none focus:border-[#0A1B8F]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Corporate Identification Number (CIN) *</label>
                <input
                  type="text"
                  value={formData.cin}
                  onChange={(e) => handleChange("cin", e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 outline-none focus:border-[#0A1B8F] font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Official Contact Phone / Telephone *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={formData.contactPhone}
                    onChange={(e) => handleChange("contactPhone", e.target.value)}
                    className="w-full text-xs pl-9 pr-3 py-3 rounded-xl border border-slate-200 outline-none focus:border-[#0A1B8F]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Official Corporate Email Address *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => handleChange("contactEmail", e.target.value)}
                    className="w-full text-xs pl-9 pr-3 py-3 rounded-xl border border-slate-200 outline-none focus:border-[#0A1B8F]"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-bold text-slate-700 block mb-1">Registered Office Address *</label>
                <textarea
                  rows={2}
                  value={formData.registeredOffice}
                  onChange={(e) => handleChange("registeredOffice", e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 outline-none focus:border-[#0A1B8F] leading-relaxed"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-bold text-slate-700 block mb-1">Corporate / Operational Office Address *</label>
                <textarea
                  rows={2}
                  value={formData.corporateOffice}
                  onChange={(e) => handleChange("corporateOffice", e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 outline-none focus:border-[#0A1B8F] leading-relaxed"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Office Working Hours</label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={formData.officeHours}
                    onChange={(e) => handleChange("officeHours", e.target.value)}
                    placeholder="e.g. Monday – Saturday: 9:30 AM – 6:30 PM"
                    className="w-full text-xs pl-9 pr-3 py-3 rounded-xl border border-slate-200 outline-none focus:border-[#0A1B8F]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">ROC Registration Number</label>
                <input
                  type="text"
                  value={formData.registrationNo}
                  onChange={(e) => handleChange("registrationNo", e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 outline-none focus:border-[#0A1B8F]"
                />
              </div>
            </div>

            {/* Social Media Links */}
            <div className="pt-4 border-t space-y-4">
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <Share2 className="w-4 h-4 text-[#0A1B8F]" />
                <span>Corporate Social Profiles</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">LinkedIn Profile URL</label>
                  <input
                    type="text"
                    value={formData.linkedinUrl || ""}
                    onChange={(e) => handleChange("linkedinUrl", e.target.value)}
                    placeholder="https://linkedin.com/company/..."
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#0A1B8F]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Twitter / X Profile URL</label>
                  <input
                    type="text"
                    value={formData.twitterUrl || ""}
                    onChange={(e) => handleChange("twitterUrl", e.target.value)}
                    placeholder="https://twitter.com/..."
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#0A1B8F]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Facebook Page URL</label>
                  <input
                    type="text"
                    value={formData.facebookUrl || ""}
                    onChange={(e) => handleChange("facebookUrl", e.target.value)}
                    placeholder="https://facebook.com/..."
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#0A1B8F]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">YouTube Channel URL</label>
                  <input
                    type="text"
                    value={formData.youtubeUrl || ""}
                    onChange={(e) => handleChange("youtubeUrl", e.target.value)}
                    placeholder="https://youtube.com/..."
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#0A1B8F]"
                  />
                </div>
              </div>
            </div>

            {/* Corporate Footer Live Preview */}
            <div className="pt-4 border-t space-y-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Live Corporate Footer Preview
              </span>
              <div className="bg-[#1C1C1C] text-gray-300 p-5 rounded-2xl text-xs space-y-2 font-sans border border-gray-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-800 pb-3">
                  <span className="font-bold text-white text-sm">{formData.legalName}</span>
                  <span className="text-gray-400 font-mono text-[11px]">CIN: {formData.cin}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[11px] text-gray-400 pt-1">
                  <div>
                    <span className="font-semibold text-gray-300 block">Registered Office:</span>
                    <p className="leading-relaxed">{formData.registeredOffice}</p>
                    <p className="pt-1 text-gray-300">Tel: {formData.contactPhone}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-300 block">Corporate Office:</span>
                    <p className="leading-relaxed">{formData.corporateOffice}</p>
                    <p className="pt-1 text-gray-300">E-mail: {formData.contactEmail}</p>
                    {formData.officeHours && <p className="text-gray-400">Hours: {formData.officeHours}</p>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DEDICATED SHOP SECTION & FOOTER */}
      {activeTab === "shop" && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
            <div className="border-b pb-4">
              <h2 className="font-black text-slate-900 text-base flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#AF4646]" />
                <span>Dedicated Shop Section &amp; Store Footer Details</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                These settings directly power the online store footer, WhatsApp ordering button, customer helpline, and dispatch address.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Shop Customer Care Phone *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={formData.shopPhone}
                    onChange={(e) => handleChange("shopPhone", e.target.value)}
                    placeholder="e.g. +91 94361 22899"
                    className="w-full text-xs pl-9 pr-3 py-3 rounded-xl border border-slate-200 outline-none focus:border-[#AF4646]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Dedicated Shop WhatsApp Number *</label>
                <div className="relative">
                  <MessageCircle className="w-4 h-4 text-emerald-600 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={formData.shopWhatsapp}
                    onChange={(e) => handleChange("shopWhatsapp", e.target.value)}
                    placeholder="e.g. 919436122899"
                    className="w-full text-xs pl-9 pr-3 py-3 rounded-xl border border-slate-200 outline-none focus:border-[#AF4646] font-mono"
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">Connected to the floating WhatsApp chat button and instant order inquiries.</span>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Shop Orders &amp; Support Email *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={formData.shopEmail}
                    onChange={(e) => handleChange("shopEmail", e.target.value)}
                    placeholder="care@easternbiochemicals.com"
                    className="w-full text-xs pl-9 pr-3 py-3 rounded-xl border border-slate-200 outline-none focus:border-[#AF4646]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Customer Helpline Hours</label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={formData.shopHours}
                    onChange={(e) => handleChange("shopHours", e.target.value)}
                    placeholder="e.g. Mon-Sat: 10:00 AM - 7:00 PM"
                    className="w-full text-xs pl-9 pr-3 py-3 rounded-xl border border-slate-200 outline-none focus:border-[#AF4646]"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-bold text-slate-700 block mb-1">Store Fulfillment &amp; Dispatch Hub Address *</label>
                <textarea
                  rows={2}
                  value={formData.shopAddress}
                  onChange={(e) => handleChange("shopAddress", e.target.value)}
                  placeholder="e.g. Central Warehouse & Dispatch Node, Industrial Complex..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 outline-none focus:border-[#AF4646] leading-relaxed"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Shop GSTIN Number</label>
                <input
                  type="text"
                  value={formData.shopGstin}
                  onChange={(e) => handleChange("shopGstin", e.target.value)}
                  placeholder="e.g. 16AABCE1234F1Z5"
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 outline-none focus:border-[#AF4646] font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Drug License (DL) Number</label>
                <input
                  type="text"
                  value={formData.shopDrugLicense}
                  onChange={(e) => handleChange("shopDrugLicense", e.target.value)}
                  placeholder="e.g. TR-WZ-20B-2025/1102 & 21B-2025/1103"
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 outline-none focus:border-[#AF4646] font-mono"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-bold text-slate-700 block mb-1">Discreet Delivery Promise / Tagline</label>
                <input
                  type="text"
                  value={formData.shopDiscreetNotice}
                  onChange={(e) => handleChange("shopDiscreetNotice", e.target.value)}
                  placeholder="e.g. Plain packaging with zero label markings"
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 outline-none focus:border-[#AF4646]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-bold text-slate-700 block mb-1">Store Footer Copyright Notice</label>
                <input
                  type="text"
                  value={formData.shopCopyrightText}
                  onChange={(e) => handleChange("shopCopyrightText", e.target.value)}
                  placeholder="© 2026 Eastern Biochemicals Private Limited (EBL). All rights reserved."
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 outline-none focus:border-[#AF4646]"
                />
              </div>
            </div>

            {/* Shop Footer Live Preview */}
            <div className="pt-4 border-t space-y-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Live Store Footer Preview
              </span>
              <div className="bg-[#AF4646] text-white p-5 rounded-2xl text-xs space-y-3 font-sans shadow-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] border-b border-white/20 pb-3">
                  <div>
                    <span className="font-bold text-rose-200 block">Customer Care:</span>
                    <span>{formData.shopPhone}</span>
                    <span className="block text-white/70">WhatsApp: +{formData.shopWhatsapp}</span>
                  </div>
                  <div>
                    <span className="font-bold text-rose-200 block">Orders &amp; Email:</span>
                    <span>{formData.shopEmail}</span>
                    <span className="block text-white/70">{formData.shopHours}</span>
                  </div>
                  <div>
                    <span className="font-bold text-rose-200 block">Dispatch Hub:</span>
                    <span className="line-clamp-2 text-white/80">{formData.shopAddress}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-white/80 pt-1 gap-2">
                  <span>{formData.legalName} &bull; GSTIN: {formData.shopGstin} {formData.shopDrugLicense && `&bull; DL: ${formData.shopDrugLicense}`}</span>
                  <span>{formData.shopCopyrightText}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Save Action Bar */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          onClick={() => handleSave()}
          className="bg-[#0A1B8F] hover:bg-[#1527ab] text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-wider shadow-md flex items-center gap-2 cursor-pointer transition-all"
        >
          <Save className="w-4 h-4" />
          <span>Save All Settings</span>
        </button>
      </div>
    </div>
  );
}
