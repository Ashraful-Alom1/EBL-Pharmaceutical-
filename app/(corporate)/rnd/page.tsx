import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Atom, Award, FlaskConical, Microscope, ShieldCheck, ArrowRight } from "lucide-react";

export const metadata = {
  title: "R&D & Innovation | Eastern Biochemicals Private Limited",
  description: "Explore our research and development infrastructure, analytical testing, and novel formulation breakthroughs.",
};

export default function RndPage() {
  return (
    <div className="py-16 px-6 max-w-[1240px] mx-auto">
      {/* Header */}
      <div className="max-w-3xl mb-16">
        <span className="text-[#1AA3D9] text-xs font-bold uppercase tracking-widest block mb-2">
          R&D & INNOVATION
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-[#0B0B0F] tracking-tight mb-6">
          Pushing the Frontiers of Chemical & Pharmaceutical Discovery
        </h1>
        <p className="text-base text-gray-600 leading-relaxed">
          At Eastern Biochemicals, research is not a department — it is the heartbeat of our company. With more than 740 scientists and state-of-the-art testing hubs in Northeast and South India, we pioneer formulations that redefine therapeutic efficacy.
        </p>
      </div>

      {/* 3 Major Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-corpCard">
          <div className="w-12 h-12 rounded-2xl bg-[#0A1B8F] text-white flex items-center justify-center mb-6">
            <Microscope className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Novel Drug Delivery Systems (NDDS)</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Targeted release capsules, micro-emulsions, and specialized topical penetration enhancers that maximize bioavailability while minimizing side effects.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-corpCard">
          <div className="w-12 h-12 rounded-2xl bg-[#1AA3D9] text-white flex items-center justify-center mb-6">
            <FlaskConical className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Bio-Active Molecule Synthesis</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            High-precision crystallization and synthesis of Active Pharmaceutical Ingredients (APIs) complying with USP, BP, and IP pharmacopeia standards.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-corpCard">
          <div className="w-12 h-12 rounded-2xl bg-[#6B1FA0] text-white flex items-center justify-center mb-6">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Advanced Polymer Research</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Formulation of ultra-thin (0.03mm) medical-grade latex and biocompatible silicone matrices utilized across our consumer wellness brand.
          </p>
        </div>
      </div>

      {/* Laboratory Showcase */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl mb-20">
        <div className="h-96 relative">
          <Image
            src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1600&auto=format&fit=crop&q=80"
            alt="Pharmaceutical testing lab"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex items-center p-8 sm:p-14">
            <div className="max-w-md text-white">
              <span className="text-[#1AA3D9] text-xs font-bold uppercase tracking-wider block mb-2">
                AGARTALA & CHENNAI TESTING HUBS
              </span>
              <h2 className="text-3xl font-black mb-4">ISO-45001 & cGMP Certified Facilities</h2>
              <p className="text-xs text-gray-300 leading-relaxed mb-6">
                Equipped with HPLC, Gas Chromatography, Dissolution Testers, and climatic stability chambers running 24/7 accelerated stress testing.
              </p>
              <Link
                href="/careers"
                className="inline-flex items-center gap-2 bg-[#0A1B8F] text-white px-6 py-2.5 rounded-full text-xs font-bold hover:bg-[#1527ab] transition-colors"
              >
                <span>Join Our Science Team</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
