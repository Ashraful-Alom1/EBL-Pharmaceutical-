"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Menu,
  X,
  ShoppingBag,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Building,
  FlaskConical,
  ShieldCheck,
  Globe,
  FileText,
  Briefcase,
  ExternalLink,
} from "lucide-react";
import { COMPANY_INFO } from "@/lib/constants";
import EblLogo from "@/components/store/EblLogo";

export default function CorpHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [moreDrawerOpen, setMoreDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* 1. Announcement Bar */}
      <div className="bg-[#081997] text-white text-[13px] py-2 px-4 text-center font-normal flex flex-wrap items-center justify-center gap-2 border-b border-white/10 z-50 relative">
        <span className="opacity-95">
          Revised MRPs post GST rate reduction, effective 22nd September – Making healthcare and quality biochemicals more accessible.
        </span>
        <Link
          href="/corporate-info"
          className="inline-flex items-center gap-1 font-semibold text-white underline hover:text-[#0094D6] transition-colors ml-1"
        >
          Learn More
        </Link>
      </div>

      {/* 2. Main Transparent / Frosted Header */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-md py-2 border-b border-gray-100"
            : "bg-white/90 backdrop-blur-md py-3 border-b border-gray-100/80"
        }`}
      >
        <div className="max-w-[1360px] mx-auto px-4 sm:px-8 flex items-center justify-between">
          {/* Logo */}
          {/* HD Official Brand Logo */}
          <Link href="/" className="flex items-center gap-3.5 group shrink-0">
            <EblLogo className="h-11 sm:h-12" />
          </Link>

          {/* Desktop Nav with Mega Menus */}
          <nav className="hidden xl:flex items-center gap-8 text-[14px] font-medium text-gray-800">
            {/* Mega Menu 1: Company */}
            <div
              className="relative group py-4"
              onMouseEnter={() => setActiveDropdown("company")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center gap-1.5 hover:text-[#081997] transition-colors cursor-pointer py-1 font-medium">
                <span>Company</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:rotate-180 transition-transform duration-200" />
              </button>

              {activeDropdown === "company" && (
                <div className="absolute top-full left-1/2 -translate-x-1/3 w-[840px] bg-white shadow-2xl rounded-2xl border border-gray-100 p-8 grid grid-cols-12 gap-8 animate-fade-in z-50">
                  <div className="col-span-7 space-y-6">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#081997] mb-3 flex items-center gap-2">
                        <Building className="w-4 h-4" /> About Eastern Biochemicals
                      </h4>
                      <div className="grid grid-cols-2 gap-y-2.5 text-[13px] text-gray-600">
                        <Link href="/about" className="hover:text-[#081997] hover:translate-x-1 transition-all">Overview</Link>
                        <Link href="/about#milestones" className="hover:text-[#081997] hover:translate-x-1 transition-all">Milestones & History</Link>
                        <Link href="/about#management" className="hover:text-[#081997] hover:translate-x-1 transition-all">Board & Management</Link>
                        <Link href="/shop" className="hover:text-[#081997] hover:translate-x-1 transition-all">Products & Portfolio</Link>
                        <Link href="/contact" className="hover:text-[#081997] hover:translate-x-1 transition-all">Partner With Us</Link>
                        <Link href="/about#initiatives" className="hover:text-[#081997] hover:translate-x-1 transition-all">Our Initiatives</Link>
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-4">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                        Core Pillars
                      </h4>
                      <div className="flex gap-4 text-[13px] font-medium text-gray-700">
                        <Link href="/about" className="hover:text-[#081997]">Quality Benchmark</Link>
                        <span>·</span>
                        <Link href="/about" className="hover:text-[#081997]">cGMP Manufacturing</Link>
                        <span>·</span>
                        <Link href="/about" className="hover:text-[#081997]">BSV Bio-Alliances</Link>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-5 bg-gradient-to-br from-[#081997]/10 via-[#0094D6]/10 to-transparent p-6 rounded-xl border border-gray-100 flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#081997] block mb-2">Corporate Purpose</span>
                      <p className="text-sm font-semibold text-gray-800 leading-snug">
                        "We are driven by three core values of quality, affordability and accessibility across India."
                      </p>
                    </div>
                    <div className="pt-4 border-t border-gray-200/60 mt-4 flex items-center justify-between text-xs font-bold text-[#081997]">
                      <span>Learn about our story</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Mega Menu 2: R&D & Innovation */}
            <div
              className="relative group py-4"
              onMouseEnter={() => setActiveDropdown("rnd")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center gap-1.5 hover:text-[#081997] transition-colors cursor-pointer py-1 font-medium">
                <span>R&D & Innovation</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:rotate-180 transition-transform duration-200" />
              </button>

              {activeDropdown === "rnd" && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-[800px] bg-white shadow-2xl rounded-2xl border border-gray-100 p-8 grid grid-cols-12 gap-8 animate-fade-in z-50">
                  <div className="col-span-7 space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#081997] mb-2 flex items-center gap-2">
                      <FlaskConical className="w-4 h-4" /> Scientific Discovery
                    </h4>
                    <div className="grid grid-cols-2 gap-y-2.5 text-[13px] text-gray-600">
                      <Link href="/rnd" className="hover:text-[#081997]">R&D Overview</Link>
                      <Link href="/rnd" className="hover:text-[#081997]">Active Ingredients (API)</Link>
                      <Link href="/rnd" className="hover:text-[#081997]">Formulation R&D</Link>
                      <Link href="/rnd" className="hover:text-[#081997]">Biotechnology</Link>
                      <Link href="/rnd" className="hover:text-[#081997]">Analytical Testing</Link>
                      <Link href="/rnd" className="hover:text-[#081997]">Intellectual Property (IPR)</Link>
                    </div>
                  </div>
                  <div className="col-span-5 bg-gradient-to-br from-[#081997] to-[#12239e] text-white p-6 rounded-xl flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] tracking-widest uppercase text-cyan-300 font-bold block mb-1">Breakthrough Science</span>
                      <p className="text-sm font-medium text-white/95 leading-relaxed">
                        With cutting-edge lab capabilities, we pioneer specialized biochemical intermediates for India.
                      </p>
                    </div>
                    <Link href="/rnd" className="text-xs font-bold text-cyan-300 inline-flex items-center gap-1.5 hover:underline mt-4">
                      Explore R&D Pipeline <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Mega Menu 3: Safety & Sustainability */}
            <div
              className="relative group py-4"
              onMouseEnter={() => setActiveDropdown("sustainability")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center gap-1.5 hover:text-[#081997] transition-colors cursor-pointer py-1 font-medium">
                <span>Safety & Sustainability</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:rotate-180 transition-transform duration-200" />
              </button>

              {activeDropdown === "sustainability" && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-[720px] bg-white shadow-2xl rounded-2xl border border-gray-100 p-8 grid grid-cols-12 gap-8 animate-fade-in z-50">
                  <div className="col-span-7 space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#081997] mb-2 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4" /> ESG & Responsible Care
                    </h4>
                    <div className="space-y-2.5 text-[13px] text-gray-600">
                      <Link href="/sustainability" className="block hover:text-[#081997]">Environment Health & Safety (EHS)</Link>
                      <Link href="/sustainability" className="block hover:text-[#081997]">Decarbonization & Circular Economy</Link>
                      <Link href="/sustainability" className="block hover:text-[#081997]">Zero-Impact Resource Management</Link>
                      <Link href="/sustainability" className="block hover:text-[#081997]">Community Healthcare & Kind Care</Link>
                    </div>
                  </div>
                  <div className="col-span-5 bg-emerald-900 text-white p-6 rounded-xl flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] tracking-widest uppercase text-emerald-300 font-bold block mb-1">Green Commitment</span>
                      <p className="text-xs text-white/90 leading-relaxed">
                        Committed to achieving progressive net-zero targets and sustainable supply chains.
                      </p>
                    </div>
                    <Link href="/sustainability" className="text-xs font-bold text-emerald-300 inline-flex items-center gap-1.5 hover:underline mt-4">
                      Download ESG Goals <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Menu 4: International */}
            <Link href="/contact" className="hover:text-[#081997] transition-colors font-medium">
              International
            </Link>

            {/* Menu 5: Corporate Info (Investor Center equivalent) */}
            <div
              className="relative group py-4"
              onMouseEnter={() => setActiveDropdown("corpinfo")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center gap-1.5 hover:text-[#081997] transition-colors cursor-pointer py-1 font-medium">
                <span>Corporate Info</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:rotate-180 transition-transform duration-200" />
              </button>

              {activeDropdown === "corpinfo" && (
                <div className="absolute top-full right-0 w-[680px] bg-white shadow-2xl rounded-2xl border border-gray-100 p-8 grid grid-cols-12 gap-8 animate-fade-in z-50">
                  <div className="col-span-7 space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#081997] mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4" /> Governance & Disclosures
                    </h4>
                    <div className="grid grid-cols-2 gap-y-2.5 text-[13px] text-gray-600">
                      <Link href="/corporate-info" className="hover:text-[#081997]">Corporate Overview</Link>
                      <Link href="/corporate-info#board" className="hover:text-[#081997]">Board of Directors</Link>
                      <Link href="/corporate-info#statutory" className="hover:text-[#081997]">Statutory Filings</Link>
                      <Link href="/corporate-info#annual-reports" className="hover:text-[#081997]">Annual Reports</Link>
                      <Link href="/corporate-info#shareholding" className="hover:text-[#081997]">Shareholder Info</Link>
                      <Link href="/corporate-info#contact" className="hover:text-[#081997]">Secretarial Contact</Link>
                    </div>
                  </div>
                  <div className="col-span-5 bg-gray-50 border border-gray-200 p-5 rounded-xl text-xs space-y-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Entity Details</span>
                    <p className="font-bold text-gray-900 leading-tight">{COMPANY_INFO.legalName}</p>
                    <p className="text-gray-500 font-mono text-[11px]">CIN: {COMPANY_INFO.cin}</p>
                    <p className="text-gray-500 text-[11px]">ROC: {COMPANY_INFO.roc} · Unlisted</p>
                    <div className="pt-2 border-t border-gray-200 flex items-center justify-between text-emerald-700 font-semibold">
                      <span>Status</span>
                      <span className="bg-emerald-100 px-2 py-0.5 rounded text-[10px] uppercase font-bold">Active</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Menu 6: Careers */}
            <Link href="/careers" className="hover:text-[#081997] transition-colors font-medium">
              Careers
            </Link>
          </nav>

          {/* Right Action Icons & Buttons */}
          <div className="flex items-center gap-4">
            {/* Shop Button - Exact highlight like reference */}
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-[#E01B47] hover:bg-[#C4153C] text-white px-5 py-2.5 rounded-full font-bold text-[13px] tracking-wide shadow-md transition-all transform hover:-translate-y-0.5 uppercase"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Shop</span>
            </Link>

            {/* More / Hamburger Button for quick links */}
            <div className="relative">
              <button
                onClick={() => setMoreDrawerOpen(!moreDrawerOpen)}
                className="hidden xl:flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 hover:border-[#081997] hover:text-[#081997] text-gray-700 transition-colors"
                title="More Links"
                aria-label="More Links"
              >
                <Menu className="w-5 h-5" />
              </button>

              {moreDrawerOpen && (
                <div className="absolute right-0 top-12 w-64 bg-white shadow-xl rounded-2xl border border-gray-100 p-5 space-y-4 animate-fade-in z-50">
                  <div className="flex items-center justify-between border-b pb-3">
                    <span className="text-xs font-bold uppercase text-gray-400 tracking-wider">Explore More</span>
                    <button onClick={() => setMoreDrawerOpen(false)} className="text-gray-400 hover:text-gray-600">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-3 text-sm font-medium text-gray-700">
                    <Link href="/about" onClick={() => setMoreDrawerOpen(false)} className="block hover:text-[#081997]">About Eastern Biochemicals</Link>
                    <Link href="/corporate-info" onClick={() => setMoreDrawerOpen(false)} className="block hover:text-[#081997]">Corporate Governance</Link>
                    <Link href="/contact" onClick={() => setMoreDrawerOpen(false)} className="block hover:text-[#081997]">Contact Us</Link>
                    <Link href="/admin/login" onClick={() => setMoreDrawerOpen(false)} className="block text-xs text-gray-400 hover:text-gray-700 pt-2 border-t">Admin ERP Portal</Link>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 text-gray-700 hover:text-[#081997] focus:outline-none"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-white border-b border-gray-200 px-6 py-6 space-y-4 shadow-2xl animate-fade-in max-h-[80vh] overflow-y-auto">
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between text-base font-semibold text-gray-800 hover:text-[#081997] py-2 border-b border-gray-50"
            >
              <span>Company</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </Link>
            <Link
              href="/rnd"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between text-base font-semibold text-gray-800 hover:text-[#081997] py-2 border-b border-gray-50"
            >
              <span>R&D & Innovation</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </Link>
            <Link
              href="/sustainability"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between text-base font-semibold text-gray-800 hover:text-[#081997] py-2 border-b border-gray-50"
            >
              <span>Safety & Sustainability</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between text-base font-semibold text-gray-800 hover:text-[#081997] py-2 border-b border-gray-50"
            >
              <span>International & Distribution</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </Link>
            <Link
              href="/corporate-info"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between text-base font-semibold text-gray-800 hover:text-[#081997] py-2 border-b border-gray-50"
            >
              <span>Corporate Info & Filings</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </Link>
            <Link
              href="/careers"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between text-base font-semibold text-gray-800 hover:text-[#081997] py-2 border-b border-gray-50"
            >
              <span>Careers & Openings</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </Link>
            <div className="pt-4 space-y-3">
              <Link
                href="/shop"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 bg-[#E01B47] text-white py-3.5 rounded-full font-bold shadow-md uppercase tracking-wide text-sm"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Visit Online Store</span>
              </Link>
              <Link
                href="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full block text-center py-2 text-xs text-gray-500 hover:text-gray-800"
              >
                Admin ERP Portal
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
