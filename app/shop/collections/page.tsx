"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Layers, Sparkles, Search } from "lucide-react";

interface CollectionTile {
  name: string;
  count: number;
  slug: string;
  tag: string;
  description: string;
  image: string;
  group: "all" | "pharma" | "wellness";
  badgeColor?: string;
  gradientBg: string;
}

export default function CollectionsPage() {
  const [selectedGroup, setSelectedGroup] = useState<"all" | "pharma" | "wellness">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const collections: CollectionTile[] = [
    {
      name: "Shop All Formulations",
      count: 16,
      slug: "shop-all",
      tag: "ALL PRODUCTS",
      description: "Complete portfolio of certified pharmaceutical therapies and intimate wellness essentials.",
      image: "/images/products/ebl-master-showcase-3d.jpg",
      group: "all",
      gradientBg: "from-[#F9FAFC] via-[#F4F6FA] to-[#EDF1F7]",
    },
    {
      name: "Gastro & Reflux Care",
      count: 2,
      slug: "gastro-care",
      tag: "RAPID ACID FIGHT",
      description: "Fast-acting foaming raft barrier antacid suspensions and gastro-resistant enteric capsules.",
      image: "/images/products/ebl-raft-3d.jpg",
      group: "pharma",
      gradientBg: "from-[#F0FDF4] via-[#F3FAF5] to-[#E3F4EA]",
    },
    {
      name: "Cardio & Hypertension Care",
      count: 3,
      slug: "cardio-care",
      tag: "24-HR BP REGULATION",
      description: "Dual L/N-type calcium channel blocker Cilnidipine tablets for smooth arterial regulation.",
      image: "/images/products/ebl-cilalong-3d.jpg",
      group: "pharma",
      gradientBg: "from-[#EFF6FF] via-[#F2F7FF] to-[#E0ECFF]",
    },
    {
      name: "Women's Wellness & Vitality",
      count: 4,
      slug: "womens-wellness",
      tag: "DAILY MICRONUTRIENTS",
      description: "High-potency daily multivitamins, essential minerals, iron, calcium & vitality formulas.",
      image: "/images/products/ebl-vitaplus-3d.jpg",
      group: "pharma",
      gradientBg: "from-[#FFF1F2] via-[#FFF5F6] to-[#FFE4E6]",
    },
    {
      name: "General Health & Immunity",
      count: 6,
      slug: "general-wellness",
      tag: "ESSENTIAL HEALTH",
      description: "WHO-GMP certified therapeutic medicines and essential healthcare formulations.",
      image: "/images/products/ebl-pantop-3d.jpg",
      group: "pharma",
      gradientBg: "from-[#FEF3C7]/40 via-[#FFFBEB] to-[#FDE68A]/30",
    },
    {
      name: "Ultra Thin & Natural Feel",
      count: 10,
      slug: "ultra-thin-condoms",
      tag: "0.03MM ULTRA THIN",
      description: "Ultra-sensitive natural feel latex with advanced easy-peel buttercup hermetic seal.",
      image: "/images/products/ebl-ultrathin-3d.jpg",
      group: "wellness",
      gradientBg: "from-[#F0FDFA] via-[#F5FCFA] to-[#CCFBF1]/50",
    },
    {
      name: "Climax Delay & Endurance",
      count: 12,
      slug: "climax-delay-condoms",
      tag: "MAXIMUM ENDURANCE",
      description: "Formulated with active benzocaine to gently prolong intimacy and maximize stamina.",
      image: "/images/products/ebl-endurance-3d.jpg",
      group: "wellness",
      gradientBg: "from-[#FAF5FF] via-[#FBF7FE] to-[#F3E8FF]",
    },
    {
      name: "Lubricants & Intimate Gels",
      count: 3,
      slug: "lubricants",
      tag: "WATER BASED",
      description: "Silky, body-safe pH balanced hydrating lubrication for enhanced comfort and glide.",
      image: "/images/products/ebl-lube-3d.jpg",
      group: "wellness",
      gradientBg: "from-[#ECFDF5] via-[#F2FCF7] to-[#D1FAE5]",
    },
    {
      name: "Personal Massagers",
      count: 4,
      slug: "personal-massagers",
      tag: "BODY SAFE SILICONE",
      description: "Ergonomic, whisper-quiet multi-speed body-safe silicone wellness devices and rings.",
      image: "/images/products/ebl-massager-3d.jpg",
      group: "wellness",
      gradientBg: "from-[#FDF2F8] via-[#FCF4F8] to-[#FCE7F3]",
    },
    {
      name: "Extra Dotted & Ribbed",
      count: 10,
      slug: "extra-dotted-condoms",
      tag: "INTENSE TEXTURE",
      description: "Pyramid dotted matrices and contour ribbing engineered for elevated tactile pleasure.",
      image: "/images/products/ebl-matrix-3d.jpg",
      group: "wellness",
      gradientBg: "from-[#FFFBEB] via-[#FEF9E7] to-[#FEF08A]/40",
    },
  ];

  const filteredCollections = collections.filter((col) => {
    const matchesGroup = selectedGroup === "all" || col.group === selectedGroup || col.slug === "shop-all";
    const matchesSearch =
      col.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      col.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      col.tag.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGroup && matchesSearch;
  });

  return (
    <div className="py-8 sm:py-14 px-4 sm:px-6 max-w-[1340px] mx-auto pb-32">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
        <Link href="/shop" className="hover:text-[#E11D48] transition-colors">
          Store Home
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-bold">Collections</span>
      </div>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-gray-100 gap-6">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200/60 text-[#E11D48] text-[11px] font-bold tracking-wider uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Product Catalog &amp; Formulations</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight leading-tight">
            Browse Collections
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
            Discover Eastern Biochemicals&apos; clinically advanced pharmaceutical therapies, specialized healthcare formulations, and certified intimacy wellness essentials.
          </p>
        </div>

        {/* Search bar inside collections */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search collections..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-800 placeholder-gray-400 outline-none focus:border-[#E11D48] focus:ring-2 focus:ring-rose-100 transition-all shadow-xs"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2.5 mb-10">
        <button
          onClick={() => setSelectedGroup("all")}
          className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
            selectedGroup === "all"
              ? "bg-[#E11D48] text-white shadow-md shadow-rose-500/20"
              : "bg-white text-gray-700 border border-gray-200 hover:border-gray-400"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>All Collections ({collections.length})</span>
        </button>

        <button
          onClick={() => setSelectedGroup("pharma")}
          className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
            selectedGroup === "pharma"
              ? "bg-[#E11D48] text-white shadow-md shadow-rose-500/20"
              : "bg-white text-gray-700 border border-gray-200 hover:border-gray-400"
          }`}
        >
          <span>Pharmaceutical Care</span>
        </button>

        <button
          onClick={() => setSelectedGroup("wellness")}
          className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
            selectedGroup === "wellness"
              ? "bg-[#E11D48] text-white shadow-md shadow-rose-500/20"
              : "bg-white text-gray-700 border border-gray-200 hover:border-gray-400"
          }`}
        >
          <span>Intimate &amp; Personal Wellness</span>
        </button>
      </div>

      {/* Grid of Large Polished Product Box Tiles */}
      {filteredCollections.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
          <p className="text-gray-500 font-semibold text-sm">
            No collections found matching &ldquo;{searchQuery}&rdquo;.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedGroup("all");
            }}
            className="inline-block mt-4 text-xs font-bold text-[#E11D48] hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredCollections.map((col) => (
            <Link
              key={col.slug}
              href={`/shop/collections/${col.slug}`}
              className="group relative bg-white hover:bg-slate-50/50 rounded-[30px] p-5 sm:p-6 flex flex-col justify-between transition-all duration-300 border border-slate-200/90 hover:border-[#E11D48]/40 shadow-xs hover:shadow-2xl hover:-translate-y-1.5 overflow-hidden"
            >
              {/* Top Section: Assigned Product Box Container - 100% full coverage with 3D product visual, zero white layer padding */}
              <div
                className="w-full aspect-[4/3] sm:aspect-[16/11] relative rounded-[22px] overflow-hidden bg-slate-100 border border-slate-200/70 group-hover:border-rose-300 transition-all duration-300 shadow-inner"
              >
                {/* 3D Product Image Covering the entire container */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={col.image}
                  alt={col.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />

                {/* Ambient Soft Vignette Gradient to ensure badges are razor-sharp legible */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/25 pointer-events-none" />

                {/* Top Overlay Badges */}
                <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-20 pointer-events-none">
                  <span className="bg-white/95 backdrop-blur-md text-gray-900 text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border border-white/50 shadow-md">
                    {col.tag}
                  </span>
                  <span className="bg-gray-950/85 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-md border border-white/10">
                    {col.count} {col.count === 1 ? "Item" : "Items"}
                  </span>
                </div>
              </div>

              {/* Bottom Section: Title, Description, and Interactive Arrow */}
              <div className="w-full pt-5 flex flex-col justify-between flex-1">
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight group-hover:text-[#E11D48] transition-colors leading-snug flex items-baseline gap-1">
                    <span>{col.name}</span>
                    <sup className="text-[10px] font-extrabold text-gray-400">
                      {col.count}
                    </sup>
                  </h2>
                  <p className="text-xs text-gray-500 mt-1.5 leading-relaxed line-clamp-2 font-normal">
                    {col.description}
                  </p>
                </div>

                {/* Action Link Row */}
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-gray-700 group-hover:text-[#E11D48] transition-colors">
                  <span className="tracking-wide">Explore Collection</span>
                  <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-[#E11D48] text-gray-700 group-hover:text-white flex items-center justify-center transition-all shadow-xs group-hover:shadow-md">
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
