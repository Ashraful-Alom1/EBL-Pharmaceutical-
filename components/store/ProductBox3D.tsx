"use client";

import React from "react";

export type ProductBoxType =
  | "playmax"
  | "thinx"
  | "overloaded"
  | "lube"
  | "thunder"
  | "kingdots"
  | "combo"
  | "staylong"
  | "healthok";

interface ProductBox3DProps {
  type: ProductBoxType | string;
  className?: string;
  showPod?: boolean;
}

export default function ProductBox3D({
  type,
  className = "w-full h-full",
  showPod = true,
}: ProductBox3DProps) {
  // Normalize type
  const normalizedType = type.toLowerCase();

  if (normalizedType.includes("thunder") || normalizedType.includes("massager")) {
    return (
      <div className={`relative flex items-center justify-center select-none ${className}`}>
        {/* Soft shadow under products */}
        <div className="absolute bottom-2 w-3/4 h-5 bg-black/15 blur-md rounded-full transform scale-y-50" />

        <div className="relative flex items-center justify-center gap-2 sm:gap-4 z-10 w-full h-full max-h-56">
          {/* White Silicone Vibrating Ring Device */}
          <div className="relative w-20 h-28 sm:w-24 sm:h-32 flex flex-col items-center justify-center shrink-0">
            {/* Ring body */}
            <div className="w-16 h-20 sm:w-20 sm:h-24 rounded-[32px] border-[10px] sm:border-[12px] border-slate-100 bg-transparent shadow-xl relative flex items-center justify-center ring-1 ring-slate-200/60">
              <div className="w-8 h-10 rounded-full bg-slate-50/50 inner-shadow" />
            </div>
            {/* Ergonomic Textured Stimulator Top */}
            <div className="absolute -top-1 w-10 h-7 bg-gradient-to-t from-slate-100 to-white rounded-t-2xl shadow-md border-t border-slate-200 flex items-center justify-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
              <div className="w-4 h-1 bg-slate-300 rounded-full" />
            </div>
          </div>

          {/* Holographic Purple Thunder Pouch */}
          <div className="relative w-28 h-40 sm:w-36 sm:h-48 rounded-xl bg-gradient-to-br from-[#120826] via-[#2D124D] to-[#0A0518] p-3 shadow-2xl border border-purple-500/30 flex flex-col justify-between overflow-hidden">
            {/* Holographic sheen line */}
            <div className="absolute -inset-full bg-gradient-to-tr from-transparent via-cyan-400/20 to-transparent transform rotate-45 pointer-events-none" />

            {/* Pouch Header */}
            <div className="flex items-center justify-between border-b border-purple-500/20 pb-1">
              <span className="text-[7px] font-black tracking-widest text-purple-300 uppercase">
                EASTERN BIOCHEMICALS
              </span>
              <div className="w-2.5 h-1 rounded-full bg-purple-400/40" />
            </div>

            {/* Center Neon Pulse Graphic */}
            <div className="flex-1 flex flex-col items-center justify-center my-1 relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-dashed border-cyan-400/40 flex items-center justify-center relative">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-purple-400 flex items-center justify-center bg-radial from-rose-500/30 to-transparent">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-400 to-rose-500 shadow-lg shadow-purple-500/50" />
                </div>
              </div>
              <h4 className="text-white font-black tracking-widest text-xs sm:text-sm mt-1 uppercase">
                THUNDER
              </h4>
              <span className="text-[8px] text-cyan-300 tracking-wider font-semibold">
                Vibrating Ring
              </span>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between text-[7px] text-purple-300/80 pt-1 border-t border-purple-500/20">
              <span>1 UNIT</span>
              <span>BODY-SAFE</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (normalizedType.includes("playmax") || normalizedType.includes("climax")) {
    return (
      <div className={`relative flex items-center justify-center select-none ${className}`}>
        <div className="absolute bottom-2 w-3/4 h-5 bg-black/12 blur-md rounded-full transform scale-y-50" />

        <div className="relative flex items-center justify-center gap-2 sm:gap-4 z-10 w-full h-full max-h-56">
          {/* Standing 3D Holographic Box */}
          <div className="relative w-28 h-40 sm:w-36 sm:h-48 rounded-xl bg-gradient-to-br from-[#EAEBF0] via-white to-[#D8DAE2] p-3 shadow-2xl border border-slate-300 flex flex-col justify-between overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-purple-400/20 to-transparent rounded-bl-full pointer-events-none" />

            {/* Top Brand */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-black italic text-[#0A1B8F] tracking-tighter">
                EBL CARE
              </span>
              <span className="text-[7px] font-bold text-slate-400 border border-slate-300 px-1 rounded">
                1 PC
              </span>
            </div>

            {/* Center Curved Wave Graphics */}
            <div className="flex-1 flex flex-col items-center justify-center relative">
              <div className="w-20 h-10 border-b-2 border-purple-600/60 rounded-b-full flex items-center justify-center mb-1">
                <span className="text-[11px] font-extrabold text-slate-800 tracking-tight">
                  Endurance
                </span>
              </div>
              <span className="text-[8px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full mt-1">
                Long Lasting Pleasure
              </span>
            </div>

            {/* Bottom 0.05 Spec */}
            <div className="border-t border-slate-200 pt-1.5 flex items-baseline justify-between">
              <div>
                <span className="text-base sm:text-lg font-black text-slate-900 leading-none">
                  0.05<span className="text-[9px] font-semibold text-slate-500">mm</span>
                </span>
                <span className="text-[7px] block font-bold text-slate-400 tracking-wider">
                  ULTRA THIN
                </span>
              </div>
              <span className="text-[8px] font-extrabold text-[#0A1B8F]">CLIMAX DELAY</span>
            </div>
          </div>

          {/* Buttercup Round Tin Pod sitting next to the box */}
          {showPod && (
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-slate-100 via-white to-slate-200 border-2 border-slate-300 shadow-xl flex flex-col items-center justify-center p-1 relative shrink-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-dashed border-purple-400 flex items-center justify-center bg-white/80">
                <span className="text-[9px] font-black italic text-purple-700 leading-none">
                  EBL
                </span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-purple-500 rounded-full border-2 border-white" />
            </div>
          )}
        </div>
      </div>
    );
  }

  if (normalizedType.includes("thinx") || normalizedType.includes("ultra-thin")) {
    return (
      <div className={`relative flex items-center justify-center select-none ${className}`}>
        <div className="absolute bottom-2 w-3/4 h-5 bg-black/12 blur-md rounded-full transform scale-y-50" />

        <div className="relative flex items-center justify-center gap-2 sm:gap-4 z-10 w-full h-full max-h-56">
          {/* Standing 3D ThinX Teal Box */}
          <div className="relative w-28 h-40 sm:w-36 sm:h-48 rounded-xl bg-gradient-to-br from-[#E7F3F3] via-white to-[#D2E7E7] p-3 shadow-2xl border border-teal-200 flex flex-col justify-between overflow-hidden">
            {/* Top Brand */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-black italic text-teal-800 tracking-tighter">
                EBL CARE
              </span>
              <span className="text-[7px] font-bold text-teal-700 bg-teal-50 px-1 rounded">
                0.03mm
              </span>
            </div>

            {/* Center Curved Wave Graphics */}
            <div className="flex-1 flex flex-col items-center justify-center relative">
              <div className="w-14 h-14 rounded-full border border-teal-400/40 flex items-center justify-center relative bg-white/70">
                <span className="text-xs sm:text-sm font-black text-slate-800 tracking-tighter">
                  0.03
                </span>
              </div>
              <span className="text-[8px] font-extrabold text-teal-800 tracking-wider mt-1">
                ULTRA THIN CONDOM
              </span>
            </div>

            {/* Bottom Buttercup Seal indicator */}
            <div className="border-t border-teal-100 pt-1.5 flex items-center justify-between text-[8px] text-teal-700 font-bold">
              <span>EASY PEEL</span>
              <span>100% SENSITIVITY</span>
            </div>
          </div>

          {/* Buttercup Round Tin Pod sitting next to the box */}
          {showPod && (
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-teal-50 via-white to-teal-100 border-2 border-teal-300 shadow-xl flex flex-col items-center justify-center p-1 relative shrink-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-dashed border-teal-500 flex items-center justify-center bg-white/80">
                <span className="text-[9px] font-black italic text-teal-700 leading-none">
                  ThinX
                </span>
              </div>
              <span className="text-[6px] font-black text-slate-500">0.03</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (normalizedType.includes("lube") || normalizedType.includes("lubricant")) {
    return (
      <div className={`relative flex items-center justify-center select-none ${className}`}>
        <div className="absolute bottom-2 w-28 h-5 bg-black/15 blur-md rounded-full transform scale-y-50" />

        {/* Realistic Aerosol / Pump Canister */}
        <div className="relative w-16 h-44 sm:w-20 sm:h-52 rounded-t-[30px] rounded-b-2xl bg-gradient-to-r from-slate-200 via-white to-slate-300 shadow-2xl border border-slate-300 flex flex-col justify-between overflow-hidden z-10">
          {/* Cap */}
          <div className="h-12 bg-gradient-to-b from-slate-100 to-slate-200 border-b border-slate-300 flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-slate-300/80 border border-slate-400" />
          </div>

          {/* Label Body with Green Botanical Leaf Graphic */}
          <div className="flex-1 bg-gradient-to-b from-emerald-600 via-emerald-700 to-emerald-900 text-white p-2.5 flex flex-col items-center justify-between text-center">
            <span className="text-[7px] font-black tracking-widest text-emerald-200 uppercase">
              EASTERN
            </span>

            <div>
              <h4 className="text-sm font-black italic tracking-tighter text-white">EBL CARE</h4>
              <span className="text-[9px] font-black tracking-wider uppercase text-emerald-100 block mt-0.5">
                LUBE
              </span>
              <span className="text-[6px] tracking-widest uppercase text-emerald-200 block">
                WATER BASED
              </span>
            </div>

            {/* Botanical icon */}
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <div className="w-4 h-4 rounded-full border border-emerald-300" />
            </div>

            <div className="text-[7px] font-bold text-emerald-200">100 ml e</div>
          </div>

          {/* Metal base rim */}
          <div className="h-3 bg-gradient-to-r from-slate-400 via-slate-200 to-slate-400" />
        </div>
      </div>
    );
  }

  if (normalizedType.includes("kingdots") || normalizedType.includes("dotted")) {
    return (
      <div className={`relative flex items-center justify-center select-none ${className}`}>
        <div className="absolute bottom-2 w-3/4 h-5 bg-black/20 blur-md rounded-full transform scale-y-50" />

        {/* Black Matte Box with Golden Crown / Dots */}
        <div className="relative w-28 h-40 sm:w-36 sm:h-48 rounded-xl bg-gradient-to-br from-[#121214] via-[#1E1E24] to-[#0A0A0C] p-3 shadow-2xl border border-amber-500/30 flex flex-col justify-between overflow-hidden z-10">
          <div className="flex items-center justify-between border-b border-amber-500/20 pb-1">
            <span className="text-[7px] font-black tracking-widest text-amber-400 uppercase">
              EASTERN
            </span>
            <span className="text-[7px] font-bold text-amber-300/80">10 PCS</span>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center my-1 text-center">
            <span className="text-[8px] tracking-widest uppercase text-amber-300 font-bold">
              EBL CARE
            </span>
            <h4 className="text-sm sm:text-base font-black text-white tracking-wider">
              MATRIX DOTS
            </h4>

            {/* Crown lines & dots */}
            <div className="w-16 h-12 flex flex-col items-center justify-center my-1 relative">
              <div className="w-12 h-6 border-b-2 border-amber-400 rounded-b-full flex items-center justify-around px-1">
                <span className="w-1 h-1 rounded-full bg-amber-400" />
                <span className="w-1 h-1 rounded-full bg-amber-400" />
                <span className="w-1 h-1 rounded-full bg-amber-400" />
              </div>
              <span className="text-[9px] font-black text-amber-400 mt-1">1572 DOTS</span>
            </div>
          </div>

          <div className="text-[7px] text-amber-200/80 border-t border-amber-500/20 pt-1 flex justify-between">
            <span>EXTRA STIMULATION</span>
            <span>PYRAMID DOTS</span>
          </div>
        </div>
      </div>
    );
  }

  if (normalizedType.includes("combo") || normalizedType.includes("flavoured")) {
    return (
      <div className={`relative flex items-center justify-center select-none ${className}`}>
        <div className="absolute bottom-2 w-3/4 h-5 bg-black/20 blur-md rounded-full transform scale-y-50" />

        {/* Black Matte Box with Multi-Colour Neon Rings */}
        <div className="relative w-28 h-40 sm:w-36 sm:h-48 rounded-xl bg-gradient-to-br from-[#121216] via-[#1E1E26] to-[#0A0A0E] p-3 shadow-2xl border border-rose-500/30 flex flex-col justify-between overflow-hidden z-10">
          <div className="flex items-center justify-between border-b border-rose-500/20 pb-1">
            <span className="text-[7px] font-black tracking-widest text-rose-300 uppercase">
              EASTERN
            </span>
            <span className="text-[7px] font-bold text-rose-300">20 PCS</span>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center my-1 text-center">
            {/* Multi-colour Neon Rings */}
            <div className="w-16 h-16 rounded-full border-2 border-rose-500 shadow-md shadow-rose-500/30 flex items-center justify-center relative p-1">
              <div className="w-12 h-12 rounded-full border border-cyan-400 flex items-center justify-center">
                <div className="text-[8px] font-black text-white uppercase leading-none">
                  COMBO<br /><span className="text-[7px] text-rose-400">PACK</span>
                </div>
              </div>
            </div>

            <p className="text-[6px] text-slate-400 mt-1 uppercase tracking-tighter">
              Chocolate · Strawberry · Black Grapes · Mint
            </p>
          </div>

          <div className="text-[7px] text-rose-200/80 border-t border-rose-500/20 pt-1 flex justify-between">
            <span>5 GOURMET FLAVOURS</span>
            <span>LUBRICATED</span>
          </div>
        </div>
      </div>
    );
  }

  if (normalizedType.includes("staylong") || normalizedType.includes("men")) {
    return (
      <div className={`relative flex items-center justify-center select-none ${className}`}>
        <div className="absolute bottom-2 w-3/4 h-5 bg-black/15 blur-md rounded-full transform scale-y-50" />

        <div className="relative flex items-center justify-center gap-2 sm:gap-3 z-10 w-full h-full max-h-56">
          {/* Blue Matte Box */}
          <div className="relative w-24 h-38 sm:w-28 sm:h-46 rounded-xl bg-gradient-to-br from-[#0c224a] via-[#10326e] to-[#081836] p-2.5 shadow-2xl border border-blue-400/30 flex flex-col justify-between text-white overflow-hidden">
            <span className="text-[7px] font-bold text-blue-200 uppercase">EASTERN</span>
            <div className="my-1">
              <span className="text-[8px] font-bold text-blue-300 block">EBL CARE</span>
              <h5 className="text-xs font-black tracking-tight leading-tight">
                STAY LONG SPRAY
              </h5>
              <span className="text-[7px] text-blue-200 block mt-0.5">Lidocaine Formula</span>
            </div>
            <span className="text-[7px] text-blue-300 border-t border-blue-400/20 pt-1 block">
              20g Canister
            </span>
          </div>

          {/* Metallic Blue Spray Bottle */}
          <div className="relative w-10 h-32 sm:w-12 sm:h-38 rounded-t-xl rounded-b-xl bg-gradient-to-r from-blue-900 via-blue-700 to-blue-950 border border-blue-400/40 shadow-xl flex flex-col justify-between p-1.5 text-center shrink-0">
            <div className="w-4 h-5 mx-auto bg-slate-300 rounded-t-md border-b border-blue-900" />
            <div className="text-[7px] font-black text-white uppercase transform -rotate-90">
              STAY LONG
            </div>
            <div className="h-2" />
          </div>
        </div>
      </div>
    );
  }

  if (normalizedType.includes("women") || normalizedType.includes("healthok")) {
    return (
      <div className={`relative flex items-center justify-center select-none ${className}`}>
        <div className="absolute bottom-2 w-28 h-5 bg-black/12 blur-md rounded-full transform scale-y-50" />

        {/* Women's Supplement Bottle with Pink Cap */}
        <div className="relative w-24 h-36 sm:w-28 sm:h-44 rounded-t-2xl rounded-b-2xl bg-white shadow-2xl border border-rose-200 flex flex-col justify-between overflow-hidden z-10">
          {/* Pink Ribbed Cap */}
          <div className="h-10 bg-gradient-to-b from-rose-500 to-rose-600 rounded-t-xl flex items-center justify-center border-b border-rose-700">
            <span className="text-[7px] font-black text-white uppercase tracking-wider">
              SEALED
            </span>
          </div>

          {/* Label Body with HealthOK Emblem */}
          <div className="p-2 text-center flex flex-col items-center justify-between flex-1">
            <span className="text-[6px] font-bold text-slate-400 uppercase tracking-widest">
              WOMEN&apos;S VITALITY
            </span>
            <div className="my-1">
              <h5 className="text-xs font-black text-rose-600 tracking-tight">HealthOK</h5>
              <span className="text-[7px] font-bold text-slate-600 block">
                20 Essential Nutrients
              </span>
            </div>
            <div className="w-8 h-8 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center">
              <span className="text-[7px] font-black text-rose-600">30 Caps</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default fallback: Overloaded extra lube / sleek product
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      <div className="absolute bottom-2 w-3/4 h-5 bg-black/12 blur-md rounded-full transform scale-y-50" />
      <div className="relative flex items-center justify-center gap-2 sm:gap-4 z-10 w-full h-full max-h-56">
        <div className="relative w-28 h-40 sm:w-36 sm:h-48 rounded-xl bg-gradient-to-br from-[#F5E6EB] via-white to-[#EED6DF] p-3 shadow-2xl border border-rose-200 flex flex-col justify-between overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-sm font-black italic text-[#E01B47] tracking-tighter">
              EBL CARE
            </span>
            <span className="text-[7px] font-bold text-rose-700 bg-rose-50 px-1 rounded">
              0.03mm
            </span>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center relative">
            <span className="text-[8px] font-extrabold text-[#E01B47] uppercase tracking-wider">
              FEATHER TOUCH
            </span>
            <span className="text-[7px] text-slate-500 font-bold">EXTRA LUBE</span>
            <span className="text-xs sm:text-sm font-black text-slate-900 mt-1">0.03mm</span>
          </div>
          <div className="border-t border-rose-100 pt-1.5 flex justify-between text-[7px] text-rose-700 font-bold">
            <span>DOUBLE LUBRICATED</span>
            <span>3 PCS</span>
          </div>
        </div>
        {showPod && (
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-rose-50 via-white to-rose-100 border-2 border-rose-300 shadow-xl flex flex-col items-center justify-center p-1 relative shrink-0">
            <span className="text-[9px] font-black italic text-rose-600">EBL</span>
          </div>
        )}
      </div>
    </div>
  );
}
