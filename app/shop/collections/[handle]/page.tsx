"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { ArrowLeft, SlidersHorizontal, Sparkles } from "lucide-react";
import { dataStore } from "@/lib/data-store";
import ProductCard from "@/components/store/ProductCard";

interface CollectionMeta {
  title: string;
  badge: string;
  description: string;
}

const COLLECTION_METAS: Record<string, CollectionMeta> = {
  "shop-all": {
    title: "All Products & Formulations",
    badge: "COMPLETE CATALOG",
    description: "Explore our full certified line of targeted gastro, cardiovascular, and daily wellness formulations.",
  },
  "gastro-care": {
    title: "Gastro & Reflux Care",
    badge: "RAPID ACID FIGHT THERAPY",
    description: "Rapid foaming raft barrier antacid suspensions and gastro-resistant enteric formulations for instant relief.",
  },
  "cardio-care": {
    title: "Cardio & Hypertension Care",
    badge: "24-HOUR BP REGULATION",
    description: "Dual L/N-type calcium channel blocker Cilnidipine tablets for smooth arterial blood pressure control.",
  },
  "womens-wellness": {
    title: "Women's Wellness & Vitality",
    badge: "DAILY MICRONUTRIENTS",
    description: "Multivitamins, essential minerals, iron, calcium, and vitality formulas designed for active women.",
  },
  "general-wellness": {
    title: "General Health & Immunity",
    badge: "WHO-GMP CERTIFIED REMEDIES",
    description: "High quality WHO-GMP certified therapeutic medicines and essential health supplements for the entire family.",
  },
  "ultra-thin-condoms": {
    title: "Ultra Thin & Natural Feel Condoms",
    badge: "0.03MM NATURAL TOUCH",
    description: "Ultra-sensitive natural feel latex with advanced easy-peel hermetic buttercup packaging.",
  },
  "climax-delay-condoms": {
    title: "Climax Delay & Endurance Condoms",
    badge: "MAXIMUM ENDURANCE",
    description: "Active delay formulation engineered to prolong intimacy and maximize personal stamina.",
  },
  "lubricants": {
    title: "Lubricants & Intimate Gels",
    badge: "WATER BASED & BODY SAFE",
    description: "Silky, pH balanced hydrating lubrication formulated for maximum comfort and smooth glide.",
  },
  "personal-massagers": {
    title: "Personal Massagers & Vibrating Rings",
    badge: "BODY-SAFE SILICONE",
    description: "Whisper-quiet multi-speed ergonomic personal massagers and vibrating rings for sensory pleasure.",
  },
  "extra-dotted-condoms": {
    title: "Extra Dotted & Ribbed Condoms",
    badge: "INTENSE TEXTURE",
    description: "Raised pyramid dot matrices and contour ribbing engineered for elevated tactile pleasure.",
  },
};

export default function SingleCollectionPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const resolvedParams = use(params);
  const handle = resolvedParams.handle;

  const categories = dataStore.getCategories();
  const allProducts = dataStore.getProducts();

  const currentCategory = categories.find((c) => c.slug === handle);
  const meta = COLLECTION_METAS[handle] || {
    title: currentCategory ? currentCategory.name : "Shop Collection",
    badge: "FEATURED COLLECTION",
    description: currentCategory?.description || "Explore medical-grade wellness and healthcare essentials crafted by Eastern Biochemicals.",
  };

  const isShopAll = handle === "shop-all" || !currentCategory;

  const filteredProducts = isShopAll
    ? allProducts
    : allProducts.filter((p) => p.categoryId === currentCategory.id);

  const [sortBy, setSortBy] = useState("featured");

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-low") return a.pricePaise - b.pricePaise;
    if (sortBy === "price-high") return b.pricePaise - a.pricePaise;
    if (sortBy === "rating") return b.ratingAvg - a.ratingAvg;
    return 0; // default featured
  });

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 max-w-[1340px] mx-auto pb-28">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
        <Link href="/shop" className="hover:text-[#E11D48] transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/shop/collections" className="hover:text-[#E11D48] transition-colors">
          Collections
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-bold">{meta.title}</span>
      </div>

      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-gray-100 gap-6">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200/60 text-[#E11D48] text-[10px] sm:text-[11px] font-bold tracking-wider uppercase mb-2.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{meta.badge}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight leading-tight">
            {meta.title}
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed font-normal">
            {meta.description}
          </p>
        </div>

        {/* Sort selector & Count */}
        <div className="flex items-center gap-3 self-start md:self-auto shrink-0">
          <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
            {sortedProducts.length} {sortedProducts.length === 1 ? "Product" : "Products"}
          </span>

          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-3 py-1.5 shadow-xs">
            <SlidersHorizontal className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-xs text-gray-500 font-semibold">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs font-bold text-gray-800 bg-transparent outline-none cursor-pointer"
            >
              <option value="featured">Featured First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {sortedProducts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-xs">
          <p className="text-gray-500 font-semibold text-sm">
            No products found in this collection.
          </p>
          <Link
            href="/shop/collections"
            className="inline-flex items-center gap-2 mt-4 text-xs font-bold text-[#E11D48] hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>View All Collections</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-7">
          {sortedProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
