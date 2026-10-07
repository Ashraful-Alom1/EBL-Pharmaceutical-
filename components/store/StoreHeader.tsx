"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  User,
  ShoppingBag,
  Menu,
  X,
  ChevronRight,
  ArrowLeft,
  Package,
  BookOpen,
} from "lucide-react";
import { useCart } from "@/lib/cart-context";
import EblLogo from "./EblLogo";

export default function StoreHeader() {
  const { totalCount, setIsCartOpen } = useCart();
  const [menuDrawerOpen, setMenuDrawerOpen] = useState(false);
  const [searchDrawerOpen, setSearchDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/shop/collections?q=${encodeURIComponent(
        searchQuery.trim()
      )}`;
    }
  };

  const menuCategories = [
    { title: "Shop All", href: "/shop/collections" },
    { title: "Ultra Thin & Natural Feel", href: "/shop/collections/ultra-thin-condoms" },
    { title: "Climax Delay & Endurance", href: "/shop/collections/climax-delay" },
    { title: "Extra Dotted & Ribbed", href: "/shop/collections/dotted-condoms" },
    { title: "Flavoured & Exotic Aromas", href: "/shop/collections/flavoured-condoms" },
    { title: "Lubricants & Intimate Gels", href: "/shop/collections/lubes-combos" },
    { title: "Personal Massagers", href: "/shop/collections/massagers" },
    { title: "Gift Boxes & Accessories", href: "/shop/collections/gift-boxes" },
    { title: "Women's Health & Wellness", href: "/shop/collections/womens-health" },
    { title: "Men's Health & Vitality", href: "/shop/collections/mens-wellness" },
  ];

  return (
    <>
      {/* 1. TOP ANNOUNCEMENT BAR (Matching epiclovestore.com --gradient-background: #e11d48) */}
      <div className="bg-[#E11D48] text-white text-[11px] sm:text-xs py-2 px-4 text-center font-semibold tracking-wide flex items-center justify-between z-50 relative">
        <div className="hidden md:block w-32" />
        <div className="flex-1 text-center">
          <span>Free Discreet Shipping Across India on Orders Above ₹499 · 100% Genuine Care</span>
        </div>
        <div className="hidden md:flex justify-end w-32">
          <Link
            href="/"
            className="text-[11px] text-white/90 hover:text-white underline inline-flex items-center gap-1 font-normal"
          >
            <ArrowLeft className="w-3 h-3" /> Company Profile
          </Link>
        </div>
      </div>

      {/* 2. MAIN STORE HEADER (Transparent / Frosted Glass with rounded feel) */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? "bg-[#FFF5F7]/95 backdrop-blur-md shadow-sm border-b border-rose-100 py-2.5"
            : "bg-[#FFF5F7]/85 backdrop-blur-md border-b border-rose-100/60 py-3.5"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 grid grid-cols-12 items-center">
          {/* Left Navigation & Hamburger */}
          <div className="col-span-4 flex items-center gap-5">
            {/* Hamburger Button */}
            <button
              onClick={() => setMenuDrawerOpen(true)}
              className="p-1.5 text-gray-800 hover:text-[#E11D48] transition-colors"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Quick Search Button (Desktop) */}
            <button
              onClick={() => setSearchDrawerOpen(true)}
              className="p-1.5 text-gray-700 hover:text-[#E11D48] transition-colors hidden sm:block"
              aria-label="Search Catalog"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Primary Nav Links */}
            <nav className="hidden lg:flex items-center gap-6 text-[14px] font-medium text-gray-800">
              <Link
                href="/shop/collections"
                className="hover:text-[#E11D48] transition-colors relative py-1"
              >
                Shop
              </Link>
              <Link
                href="/shop/blogs"
                className="hover:text-[#E11D48] transition-colors relative py-1"
              >
                Blogs
              </Link>
              <Link
                href="/shop/track-order"
                className="hover:text-[#E11D48] transition-colors relative py-1"
              >
                Track Order
              </Link>
            </nav>
          </div>

          {/* Centered Brand Logo (EBL Pharmaceutical) */}
          <div className="col-span-4 flex justify-center">
            <Link href="/shop" className="hover:opacity-95 transition-opacity py-0.5">
              <EblLogo className="h-10 sm:h-12" />
            </Link>
          </div>

          {/* Right Action Buttons */}
          <div className="col-span-4 flex items-center justify-end gap-3 sm:gap-5 text-gray-800">
            {/* Search Icon (Mobile) */}
            <button
              onClick={() => setSearchDrawerOpen(true)}
              className="p-1.5 hover:text-[#E11D48] sm:hidden"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Account Icon */}
            <Link
              href="/shop/account/login"
              className="p-1.5 hover:text-[#E11D48] transition-colors hidden sm:flex items-center"
              aria-label="User Account"
            >
              <User className="w-5 h-5" />
            </Link>

            {/* Cart Icon with Live Count */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-1.5 hover:text-[#E11D48] transition-colors relative flex items-center"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-6 h-6" />
              {totalCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#E11D48] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {totalCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* 3. SLIDE-IN SEARCH DRAWER */}
      {searchDrawerOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-start">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setSearchDrawerOpen(false)}
          />
          <div className="relative z-10 bg-white border-b border-gray-200 px-6 py-8 shadow-2xl animate-fade-in">
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Search EBL Store
                </span>
                <button
                  onClick={() => setSearchDrawerOpen(false)}
                  className="p-1 text-gray-400 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search formulations, condoms, massagers, wellness..."
                  className="w-full bg-[#FFF5F7] border border-rose-200 rounded-full py-3.5 pl-5 pr-14 text-sm text-gray-900 focus:outline-none focus:border-[#E11D48]"
                  autoFocus
                />
                <button
                  type="submit"
                  className="absolute right-2 bg-[#E11D48] text-white p-2.5 rounded-full hover:bg-[#C4153C] transition-colors"
                >
                  <Search className="w-4 h-4" />
                </button>
              </form>
              <div className="flex flex-wrap gap-2 mt-4 text-xs">
                <span className="text-gray-400 py-1">Popular:</span>
                {["Ultra Thin", "Climax Delay", "Strawberry Lube", "Thunder Ring", "Vitamins"].map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      setSearchQuery(term);
                      window.location.href = `/shop/collections?q=${encodeURIComponent(term)}`;
                    }}
                    className="bg-gray-100 hover:bg-rose-50 hover:text-[#E11D48] px-3 py-1 rounded-full text-gray-600 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. SLIDE-IN NAVIGATION MENU DRAWER (Exact matching MenuDrawer from epiclovestore.com) */}
      {menuDrawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMenuDrawerOpen(false)}
          />

          {/* Drawer Inner Panel */}
          <div className="relative z-10 w-full max-w-md bg-[#FFF5F7] h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-fade-in border-r border-rose-100">
            <div>
              {/* Drawer Header */}
              <div className="p-6 flex items-center justify-between border-b border-rose-100/80 bg-white/70">
                <EblLogo className="h-9" />
                <button
                  onClick={() => setMenuDrawerOpen(false)}
                  className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Collections List */}
              <nav className="p-6 space-y-2">
                {menuCategories.map((item) => (
                  <Link
                    key={item.title}
                    href={item.href}
                    onClick={() => setMenuDrawerOpen(false)}
                    className="flex items-center justify-between text-lg font-bold text-gray-900 hover:text-[#E11D48] py-2.5 border-b border-rose-100/50 transition-colors group"
                  >
                    <span>{item.title}</span>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 group-hover:text-[#E11D48] transition-all" />
                  </Link>
                ))}

                <div className="pt-4 space-y-2">
                  <Link
                    href="/shop/track-order"
                    onClick={() => setMenuDrawerOpen(false)}
                    className="flex items-center gap-3 text-sm font-semibold text-gray-700 hover:text-[#E11D48] py-2"
                  >
                    <Package className="w-4 h-4 text-[#E11D48]" />
                    <span>Track Order</span>
                  </Link>
                  <Link
                    href="/shop/blogs"
                    onClick={() => setMenuDrawerOpen(false)}
                    className="flex items-center gap-3 text-sm font-semibold text-gray-700 hover:text-[#E11D48] py-2"
                  >
                    <BookOpen className="w-4 h-4 text-[#E11D48]" />
                    <span>Health & Pleasure Guides (Blogs)</span>
                  </Link>
                  <Link
                    href="/"
                    onClick={() => setMenuDrawerOpen(false)}
                    className="flex items-center gap-3 text-sm font-semibold text-[#005696] hover:underline py-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Switch to Corporate Website</span>
                  </Link>
                </div>
              </nav>
            </div>

            {/* Drawer Footer with Login Button */}
            <div className="p-6 border-t border-rose-100/80 bg-white/70 space-y-3">
              <Link
                href="/shop/account/login"
                onClick={() => setMenuDrawerOpen(false)}
                className="w-full flex items-center justify-center gap-2 bg-[#E11D48] text-white py-3.5 rounded-full font-bold shadow-md hover:bg-[#C4153C] transition-colors text-sm uppercase tracking-wide"
              >
                <User className="w-4 h-4" />
                <span>Customer Login / Register</span>
              </Link>
              <div className="text-center text-xs text-gray-400">
                100% Secure Checkout · Pan India Delivery
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
