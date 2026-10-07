import React from "react";
import Link from "next/link";
import { ArrowLeft, Home, ShoppingBag } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#EDF2F6] px-6 py-20 font-sans">
      <div className="max-w-md w-full bg-white rounded-[24px] p-8 sm:p-10 shadow-xl border border-gray-100 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-[#081997]/10 text-[#081997] font-black text-2xl flex items-center justify-center mx-auto">
          404
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Page Not Found
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#081997] hover:bg-[#0c22c7] text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-md"
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </Link>
          <Link
            href="/shop"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#E01B47] hover:bg-[#C4153C] text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-md"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Shop</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
