import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Leaf, Sun, Droplets, HeartHandshake, Download } from "lucide-react";

export const metadata = {
  title: "Safety & Sustainability | Eastern Biochemicals Private Limited",
  description: "Our ESG roadmap, carbon reduction initiatives, zero-liquid discharge water treatment, and employee welfare.",
};

export default function SustainabilityPage() {
  return (
    <div className="py-16 px-6 max-w-[1240px] mx-auto">
      <div className="max-w-3xl mb-16">
        <span className="text-[#1AA3D9] text-xs font-bold uppercase tracking-widest block mb-2">
          SAFETY & SUSTAINABILITY
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-[#0B0B0F] tracking-tight mb-6">
          Committed to Creating Value for People and Planet
        </h1>
        <p className="text-base text-gray-600 leading-relaxed">
          Eastern Biochemicals believes sustainable enterprise begins at the formulation table. From recyclable packaging to rooftop solar generation and complete wastewater recycling, our operations protect surrounding ecosystems.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <div className="bg-[#EEF2F8] p-8 rounded-3xl border border-blue-100 flex items-start gap-5">
          <div className="w-12 h-12 rounded-2xl bg-[#0A1B8F] text-white flex items-center justify-center shrink-0">
            <Sun className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Renewable Solar Energy Transition</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              We are aggressively shifting all warehouse lighting and cold-chain HVAC loads to on-site solar photovoltaics, targeting a 60% carbon footprint reduction by 2028.
            </p>
          </div>
        </div>

        <div className="bg-[#EEF2F8] p-8 rounded-3xl border border-blue-100 flex items-start gap-5">
          <div className="w-12 h-12 rounded-2xl bg-[#0A1B8F] text-white flex items-center justify-center shrink-0">
            <Droplets className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Zero Liquid Discharge (ZLD)</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              100% of process water is purified through membrane bio-reactors and reverse osmosis for cooling tower reuse, ensuring no contaminated effluent leaves our facilities.
            </p>
          </div>
        </div>

        <div className="bg-[#EEF2F8] p-8 rounded-3xl border border-blue-100 flex items-start gap-5">
          <div className="w-12 h-12 rounded-2xl bg-[#0A1B8F] text-white flex items-center justify-center shrink-0">
            <Leaf className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Sustainable Packaging</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Eliminating single-use virgin plastics in secondary packaging. All buttercup wrappers and retail boxes are printed with soy ink on FSC-certified paper.
            </p>
          </div>
        </div>

        <div className="bg-[#EEF2F8] p-8 rounded-3xl border border-blue-100 flex items-start gap-5">
          <div className="w-12 h-12 rounded-2xl bg-[#0A1B8F] text-white flex items-center justify-center shrink-0">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Community Health & Education</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Free health and nutritional screening camps for women and children in rural Sadar and West Tripura regions, delivering essential vitamins and hygiene kits.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#0A1B8F] to-[#6B1FA0] p-8 sm:p-12 rounded-3xl text-white flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h4 className="text-2xl font-black mb-1">Download Comprehensive ESG Roadmap</h4>
          <p className="text-xs text-blue-100">Full audit metrics, emission disclosures, and governance policies.</p>
        </div>
        <Link
          href="/corporate-info"
          className="bg-white text-[#0A1B8F] px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
        >
          <span>Download ESG Report</span>
          <Download className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
