"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2, Globe, Building2 } from "lucide-react";
import { COMPANY_INFO } from "@/lib/constants";
import { dataStore } from "@/lib/data-store";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [source, setSource] = useState("Distributor / Wholesale Enquiry");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dataStore.addLead({
      name,
      email,
      phone,
      company: company || "Individual",
      source,
      notes: message,
    });
    setSubmitted(true);
  };

  return (
    <div className="py-16 px-6 max-w-[1240px] mx-auto">
      <div className="max-w-3xl mb-14">
        <span className="text-[#1AA3D9] text-xs font-bold uppercase tracking-widest block mb-2">
          GET IN TOUCH
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-[#0B0B0F] tracking-tight mb-4">
          Connect with Eastern Biochemicals
        </h1>
        <p className="text-base text-gray-600 leading-relaxed">
          Whether you are a domestic distributor, international buyer, healthcare institution, or retail partner, our business development team is ready to assist.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Contact Info & Offices */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-[#FAFBFD] p-8 rounded-3xl border border-gray-200 space-y-6">
            <h3 className="text-xl font-bold text-gray-900">Corporate & Operational Presence</h3>

            <div>
              <span className="text-xs font-bold uppercase text-[#0A1B8F] block mb-1">
                Registered Office
              </span>
              <p className="text-xs text-gray-600 leading-relaxed">
                {COMPANY_INFO.registeredOffice}
              </p>
            </div>

            <div>
              <span className="text-xs font-bold uppercase text-[#0A1B8F] block mb-1">
                Secondary / Operations Hub
              </span>
              <p className="text-xs text-gray-600 leading-relaxed">
                {COMPANY_INFO.corporateOffice}
              </p>
            </div>

            <div className="pt-4 border-t border-gray-200 space-y-3">
              <div className="flex items-center gap-3 text-xs text-gray-700 font-semibold">
                <Phone className="w-4 h-4 text-[#0A1B8F]" />
                <span>{COMPANY_INFO.contactPhone}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-700 font-semibold">
                <Mail className="w-4 h-4 text-[#0A1B8F]" />
                <span>{COMPANY_INFO.contactEmail}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-700 font-semibold">
                <Globe className="w-4 h-4 text-[#0A1B8F]" />
                <span>CIN: {COMPANY_INFO.cin}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Enquiry Form */}
        <div className="lg:col-span-7">
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-gray-200 shadow-corpCard">
            <h3 className="text-2xl font-black text-gray-900 mb-2">Send an Enquiry</h3>
            <p className="text-xs text-gray-500 mb-6">
              Fill out the details below and our commercial team will respond within 24 business hours.
            </p>

            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-14 h-14 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold text-gray-900">Enquiry Submitted Successfully</h4>
                <p className="text-xs text-gray-600 max-w-md mx-auto">
                  Thank you, <strong>{name}</strong>. A confirmation has been registered with reference ID and assigned to our sales & distribution division.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-xs text-[#0A1B8F] underline font-bold mt-4"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. S. Sen"
                      className="w-full text-xs p-3 rounded-xl border border-gray-200 outline-none focus:border-[#0A1B8F]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Company / Organization</label>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="e.g. MedSupply Hub"
                      className="w-full text-xs p-3 rounded-xl border border-gray-200 outline-none focus:border-[#0A1B8F]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="sen@medsupply.com"
                      className="w-full text-xs p-3 rounded-xl border border-gray-200 outline-none focus:border-[#0A1B8F]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98450 12345"
                      className="w-full text-xs p-3 rounded-xl border border-gray-200 outline-none focus:border-[#0A1B8F]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Nature of Inquiry</label>
                  <select
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-gray-200 outline-none focus:border-[#0A1B8F] bg-white"
                  >
                    <option value="Distributor / Wholesale Enquiry">Domestic Distribution & Wholesale</option>
                    <option value="International Export">International Export & Formulations</option>
                    <option value="Institutional Hospital Supply">Hospital & Clinic Institutional Supply</option>
                    <option value="Consumer Wellness Store">EBL Consumer Store Order Query</option>
                    <option value="Other">General Corporate Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Message / Requirements *</label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Provide details on your required volumes, regions, or therapeutic categories..."
                    className="w-full text-xs p-3 rounded-xl border border-gray-200 outline-none focus:border-[#0A1B8F]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#0A1B8F] hover:bg-[#1527ab] text-white py-3.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-md flex items-center justify-center gap-2 transition-all"
                >
                  <span>Submit Corporate Enquiry</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
