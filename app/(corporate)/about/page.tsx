import React from "react";
import Link from "next/link";
import { ShieldCheck, Award, Users, Target, Eye, Building, ArrowRight } from "lucide-react";
import { COMPANY_INFO } from "@/lib/constants";

export const metadata = {
  title: "About Us | Eastern Biochemicals Private Limited",
  description: "Learn about the heritage, mission, leadership, and manufacturing excellence of Eastern Biochemicals Private Limited.",
};

export default function AboutPage() {
  return (
    <div className="py-16 px-6 max-w-[1240px] mx-auto">
      {/* Header */}
      <div className="max-w-3xl mb-16">
        <span className="text-[#1AA3D9] text-xs font-bold uppercase tracking-widest block mb-2">
          ABOUT EASTERN BIOCHEMICALS
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-[#0B0B0F] tracking-tight mb-6">
          Architects of Affordable Healthcare & Biochemical Excellence
        </h1>
        <p className="text-base text-gray-600 leading-relaxed">
          Incorporated on 27 May 2025, Eastern Biochemicals Private Limited has established itself as an innovative force in pharmaceutical manufacturing, active chemical formulations, and direct-to-consumer health innovations across India.
        </p>
      </div>

      {/* Vision & Mission */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
        <div className="bg-[#EEF2F8] p-8 sm:p-10 rounded-3xl border border-blue-100">
          <div className="w-12 h-12 rounded-2xl bg-[#0A1B8F] text-white flex items-center justify-center mb-6 shadow-sm">
            <Eye className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-[#0B0B0F] mb-3">Our Vision</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            To become India’s most trusted biochemical and pharmaceutical enterprise, delivering precision-engineered medications and wellness remedies accessible to every village and town across Bharat.
          </p>
        </div>

        <div className="bg-[#FAFBFD] p-8 sm:p-10 rounded-3xl border border-purple-100">
          <div className="w-12 h-12 rounded-2xl bg-[#6B1FA0] text-white flex items-center justify-center mb-6 shadow-sm">
            <Target className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-[#0B0B0F] mb-3">Our Mission</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Harness world-class laboratory research, stringent cGMP manufacturing standards, and transparent supply chains to deliver affordable, high-potency healthcare solutions without compromise.
          </p>
        </div>
      </div>

      {/* Corporate Facts Table */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-corpCard border border-gray-100 mb-20">
        <h3 className="text-2xl font-extrabold text-[#0B0B0F] mb-6">
          Statutory & Corporate Credentials
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
          <div className="p-4 bg-gray-50 rounded-xl">
            <span className="text-xs text-gray-400 block font-semibold">Corporate Identification Number (CIN)</span>
            <span className="font-bold text-[#0A1B8F] mt-1 block">{COMPANY_INFO.cin}</span>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl">
            <span className="text-xs text-gray-400 block font-semibold">Registration Number</span>
            <span className="font-bold text-gray-900 mt-1 block">{COMPANY_INFO.registrationNo}</span>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl">
            <span className="text-xs text-gray-400 block font-semibold">Date of Incorporation</span>
            <span className="font-bold text-gray-900 mt-1 block">{COMPANY_INFO.incorporated}</span>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl">
            <span className="text-xs text-gray-400 block font-semibold">Registrar of Companies (ROC)</span>
            <span className="font-bold text-gray-900 mt-1 block">{COMPANY_INFO.roc}</span>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl">
            <span className="text-xs text-gray-400 block font-semibold">Authorised Share Capital</span>
            <span className="font-bold text-gray-900 mt-1 block">{COMPANY_INFO.authorisedCapital}</span>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl">
            <span className="text-xs text-gray-400 block font-semibold">Paid-up Capital</span>
            <span className="font-bold text-gray-900 mt-1 block">{COMPANY_INFO.paidUpCapital}</span>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl sm:col-span-2">
            <span className="text-xs text-gray-400 block font-semibold">Registered Office Address</span>
            <span className="font-semibold text-gray-900 mt-1 block text-xs">{COMPANY_INFO.registeredOffice}</span>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-[#0A1B8F] to-[#6B1FA0] rounded-3xl p-10 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h4 className="text-2xl font-black mb-1">Looking for direct consumer products?</h4>
          <p className="text-sm text-blue-100">Browse our online wellness store with free doorstep delivery across India.</p>
        </div>
        <Link
          href="/shop"
          className="bg-[#E01B47] hover:bg-[#C4153C] text-white px-8 py-3.5 rounded-full font-bold text-sm shadow-xl transition-all shrink-0 inline-flex items-center gap-2"
        >
          <span>Visit EBL Store</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
