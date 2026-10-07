"use client";

import React from "react";
import { FileText, Download, Building2, CheckCircle, ShieldCheck } from "lucide-react";
import { COMPANY_INFO } from "@/lib/constants";

export default function CorporateInfoPage() {
  const documents = [
    { title: "Certificate of Incorporation (MCA)", size: "1.2 MB", date: "27 May 2025" },
    { title: "Memorandum of Association (MoA)", size: "2.4 MB", date: "27 May 2025" },
    { title: "Articles of Association (AoA)", size: "3.1 MB", date: "27 May 2025" },
    { title: "Annual Compliance Return FY 25-26", size: "1.8 MB", date: "31 Mar 2026" },
    { title: "Environmental, Social & Governance (ESG) Audit Report", size: "4.5 MB", date: "15 Jun 2026" },
    { title: "Code of Business Conduct & Ethics Policy", size: "850 KB", date: "01 Jul 2025" },
  ];

  return (
    <div className="py-16 px-6 max-w-[1240px] mx-auto">
      <div className="max-w-3xl mb-16">
        <span className="text-[#1AA3D9] text-xs font-bold uppercase tracking-widest block mb-2">
          STATUTORY & GOVERNANCE
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-[#0B0B0F] tracking-tight mb-6">
          Corporate Information & Governance Disclosures
        </h1>
        <p className="text-base text-gray-600 leading-relaxed">
          Eastern Biochemicals Private Limited operates with total transparency, ethical compliance, and statutory integrity under the Ministry of Corporate Affairs (MCA), Government of India.
        </p>
      </div>

      {/* Primary Details Card */}
      <div className="bg-[#FAFBFD] rounded-3xl p-8 sm:p-12 border border-gray-200 mb-16 shadow-sm">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-6 flex items-center gap-2">
          <Building2 className="w-6 h-6 text-[#0A1B8F]" />
          <span>Company Master Data</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 text-sm">
          <div className="border-b border-gray-100 pb-3">
            <span className="text-xs text-gray-400 uppercase font-semibold">Corporate Name</span>
            <p className="font-bold text-gray-900 text-base mt-0.5">{COMPANY_INFO.legalName}</p>
          </div>
          <div className="border-b border-gray-100 pb-3">
            <span className="text-xs text-gray-400 uppercase font-semibold">Corporate Identification Number (CIN)</span>
            <p className="font-bold text-[#0A1B8F] text-base mt-0.5">{COMPANY_INFO.cin}</p>
          </div>
          <div className="border-b border-gray-100 pb-3">
            <span className="text-xs text-gray-400 uppercase font-semibold">Registration Number</span>
            <p className="font-bold text-gray-900 text-base mt-0.5">{COMPANY_INFO.registrationNo}</p>
          </div>
          <div className="border-b border-gray-100 pb-3">
            <span className="text-xs text-gray-400 uppercase font-semibold">Incorporation Date</span>
            <p className="font-bold text-gray-900 text-base mt-0.5">{COMPANY_INFO.incorporated}</p>
          </div>
          <div className="border-b border-gray-100 pb-3">
            <span className="text-xs text-gray-400 uppercase font-semibold">Registrar of Companies</span>
            <p className="font-bold text-gray-900 text-base mt-0.5">{COMPANY_INFO.roc}</p>
          </div>
          <div className="border-b border-gray-100 pb-3">
            <span className="text-xs text-gray-400 uppercase font-semibold">Listing Status</span>
            <p className="font-bold text-gray-900 text-base mt-0.5">{COMPANY_INFO.status}</p>
          </div>
          <div className="border-b border-gray-100 pb-3">
            <span className="text-xs text-gray-400 uppercase font-semibold">Authorised Capital</span>
            <p className="font-bold text-gray-900 text-base mt-0.5">{COMPANY_INFO.authorisedCapital}</p>
          </div>
          <div className="border-b border-gray-100 pb-3">
            <span className="text-xs text-gray-400 uppercase font-semibold">Paid-up Capital</span>
            <p className="font-bold text-gray-900 text-base mt-0.5">{COMPANY_INFO.paidUpCapital}</p>
          </div>
          <div className="md:col-span-2 pt-2">
            <span className="text-xs text-gray-400 uppercase font-semibold">Registered Office Address</span>
            <p className="font-semibold text-gray-800 text-sm mt-0.5">{COMPANY_INFO.registeredOffice}</p>
          </div>
        </div>
      </div>

      {/* Downloadable Documents */}
      <div>
        <h3 className="text-2xl font-extrabold text-gray-900 mb-6">
          Download Corporate Documents & Policies
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {documents.map((doc, idx) => (
            <div
              key={idx}
              className="p-5 bg-white rounded-2xl border border-gray-200 hover:border-[#0A1B8F] flex items-center justify-between shadow-xs hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0A1B8F] flex items-center justify-center shrink-0 group-hover:bg-[#0A1B8F] group-hover:text-white transition-colors">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 group-hover:text-[#0A1B8F] transition-colors">
                    {doc.title}
                  </h4>
                  <p className="text-xs text-gray-400">
                    PDF · {doc.size} · Updated {doc.date}
                  </p>
                </div>
              </div>
              <button
                onClick={() => alert(`Downloading verified copy of: ${doc.title}`)}
                className="p-2 text-gray-400 hover:text-[#0A1B8F] transition-colors"
                aria-label={`Download ${doc.title}`}
              >
                <Download className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
