"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Linkedin, Twitter, Facebook, Youtube } from "lucide-react";
import { dataStore } from "@/lib/data-store";
import EblLogo from "@/components/store/EblLogo";

export default function CorpFooter() {
  const [settings, setSettings] = useState(dataStore.getCompanySettings());

  useEffect(() => {
    setSettings(dataStore.getCompanySettings());
    const unsub = dataStore.subscribe(() => {
      setSettings(dataStore.getCompanySettings());
    });
    return unsub;
  }, []);

  return (
    <footer className="bg-[#1C1C1C] text-[#b3b3b3] pt-16 pb-8 font-sans">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-8">
        {/* 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-14 border-b border-gray-800 text-[13px] leading-relaxed">
          {/* Column 1: Corporate & Registered Office */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 tracking-normal">
              Contact Information
            </h4>
            <div className="space-y-2">
              <p className="text-gray-400 font-medium">Corporate &amp; Registered Office</p>
              <p className="text-white font-semibold">{settings.legalName}</p>
              <p className="text-gray-400 font-mono text-xs">CIN: {settings.cin}</p>
              <p className="text-gray-400 text-xs leading-normal">
                {settings.registeredOffice}
              </p>
              <p className="pt-2 text-gray-300">
                Tel:{" "}
                <a href={`tel:${settings.contactPhone}`} className="hover:text-white transition-colors">
                  {settings.contactPhone}
                </a>
              </p>
            </div>
          </div>

          {/* Column 2: Support & Inquiries */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 tracking-normal">
              Support &amp; Inquiries
            </h4>
            <div className="space-y-2">
              <p className="text-gray-400 font-medium">Corporate Communications</p>
              <p className="text-gray-300">
                E-mail:{" "}
                <a href={`mailto:${settings.contactEmail}`} className="hover:text-white transition-colors">
                  {settings.contactEmail}
                </a>
              </p>
              <p className="text-gray-300">
                Tel:{" "}
                <a href={`tel:${settings.contactPhone}`} className="hover:text-white transition-colors">
                  {settings.contactPhone}
                </a>
              </p>
              {settings.officeHours && (
                <p className="text-[11px] text-gray-400 pt-1">
                  Hours: {settings.officeHours}
                </p>
              )}
              <p className="text-xs text-gray-500 pt-2 leading-relaxed">
                Direct procurement, trade inquiries and institutional distribution across India.
              </p>
            </div>
          </div>

          {/* Column 3: Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 tracking-normal">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/careers" className="hover:text-white transition-colors">
                  Careers & Openings
                </Link>
              </li>
              <li>
                <Link href="/rnd" className="hover:text-white transition-colors">
                  R&D & Science Highlights
                </Link>
              </li>
              <li>
                <Link href="/sustainability" className="hover:text-white transition-colors">
                  Safety & Decarbonization
                </Link>
              </li>
              <li>
                <Link href="/corporate-info" className="hover:text-white transition-colors">
                  Corporate Governance
                </Link>
              </li>
              <li>
                <Link href="/shop" className="text-[#E01B47] font-semibold hover:underline">
                  Online Store (D2C)
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-white text-gray-500">
                  Stockist & Partner Login
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  FAQ&apos;s & Inquiries
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Get In Touch */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#081997] to-[#6B1FA0] flex items-center justify-center text-white font-bold text-sm">
                  EB
                </div>
                <span className="font-extrabold text-white text-base tracking-tight uppercase">
                  Eastern Biochemicals
                </span>
              </div>

              <div className="mb-6">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 bg-[#081997] hover:bg-[#0c22c7] text-white px-7 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all transform hover:-translate-y-0.5 shadow-md"
                >
                  <span>GET IN TOUCH</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-gray-800/80 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#081997] transition-all"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-gray-800/80 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#081997] transition-all"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-gray-800/80 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#081997] transition-all"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-gray-800/80 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#081997] transition-all"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Footer Sub Links */}
        <div className="py-6 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 gap-4 border-b border-gray-800/60">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-2">
            <Link href="/corporate-info" className="hover:text-gray-300 transition-colors">
              Code Of Conduct
            </Link>
            <Link href="/shop/pages/privacy" className="hover:text-gray-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/shop/pages/terms" className="hover:text-gray-300 transition-colors">
              Disclaimer
            </Link>
            <Link href="/contact" className="hover:text-gray-300 transition-colors">
              Smart ODR Portal
            </Link>
            <Link href="/careers" className="hover:text-gray-300 transition-colors">
              Recruitment Fraud Policy
            </Link>
            <Link href="/corporate-info" className="hover:text-gray-300 transition-colors">
              Disclosures
            </Link>
          </div>
          <div>
            <a
              href={`mailto:${settings.contactEmail}`}
              className="hover:text-gray-300 transition-colors font-medium text-gray-400"
            >
              {settings.contactEmail}
            </a>
          </div>
        </div>

        {/* Brand Display & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-3">
            <EblLogo className="h-9" variant="dark" />
          </div>
          <div>
            Eastern Biochemicals @ 2026. All Rights Reserved · CIN: {settings.cin}
          </div>
        </div>
      </div>
    </footer>
  );
}
