"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Star, ShoppingBag, Eye, Check } from "lucide-react";
import { Product } from "@/lib/types";
import { formatPaiseToInr } from "@/lib/gst";
import { useCart } from "@/lib/cart-context";
import ProductBox3D from "./ProductBox3D";

export default function ProductCard({
  product,
  showRating = true,
}: {
  product: Product;
  showRating?: boolean;
}) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);

  const primaryImage = product.images?.[0]?.url || "/images/products/ebl-raft-3d.jpg";
  const [imgSrc, setImgSrc] = useState(primaryImage);
  const [quickViewImage, setQuickViewImage] = useState(primaryImage);

  const discountPercent =
    product.mrpPaise > product.pricePaise
      ? Math.round(((product.mrpPaise - product.pricePaise) / product.mrpPaise) * 100)
      : 0;

  const handleAdd = () => {
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <>
      <div className="group bg-white rounded-[20px] sm:rounded-[24px] p-2.5 sm:p-4 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between border border-slate-100 hover:border-[#E11D48]/30 relative overflow-hidden">
        {/* Top Badges */}
        <div className="flex items-center justify-between z-10 mb-2">
          {discountPercent > 0 ? (
            <span className="bg-[#E11D48] text-white text-[9px] sm:text-[11px] font-bold px-2 sm:px-2.5 py-0.5 rounded-full shadow-xs tracking-tight">
              Save {discountPercent}%
            </span>
          ) : (
            <span />
          )}

          <div className="flex items-center gap-1.5">
            {/* Quick View Eye Button */}
            <button
              onClick={() => {
                setQuickViewImage(primaryImage);
                setShowQuickView(true);
              }}
              className="w-7 h-7 rounded-full bg-white/95 hover:bg-[#E11D48] hover:text-white text-gray-600 shadow-sm flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 border border-slate-100"
              title="Quick View"
              aria-label="Quick View"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>

            {showRating && (
              <div className="flex items-center gap-1 text-[11px] font-bold text-gray-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>{product.ratingAvg.toFixed(1)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Product Media Container - 100% Edge-to-edge coverage by 3D product visual, zero extra white layers */}
        <Link
          href={`/shop/products/${product.slug}`}
          className="w-full aspect-square relative rounded-2xl bg-slate-900 border border-slate-200/80 group-hover:border-rose-300 transition-all duration-300 overflow-hidden block mb-3 shadow-inner"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imgSrc}
            alt={product.images?.[0]?.alt || product.name}
            onError={() => setImgSrc("/images/products/ebl-raft-3d.jpg")}
            className="w-full h-full object-cover object-center product-zoom-img group-hover:scale-108 hover:scale-108"
            loading="lazy"
          />

          {/* Out of Stock Overlay */}
          {product.stockAvailable <= 0 && (
            <div className="absolute inset-0 bg-white/85 backdrop-blur-xs flex items-center justify-center z-20">
              <span className="text-[11px] font-bold text-gray-600 uppercase tracking-wider bg-gray-100 px-3 py-1 rounded-full border border-gray-200 shadow-xs">
                Out of Stock
              </span>
            </div>
          )}
        </Link>

        {/* Product Info & Pricing */}
        <div className="flex-1 flex flex-col justify-between text-left space-y-2">
          <div>
            <Link
              href={`/shop/products/${product.slug}`}
              className="text-xs sm:text-sm font-semibold text-gray-900 group-hover:text-[#E11D48] transition-colors line-clamp-2 leading-snug min-h-[36px]"
            >
              {product.name}
            </Link>
          </div>

          <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-sm sm:text-base font-extrabold text-[#E11D48]">
                {formatPaiseToInr(product.pricePaise)}
              </span>
              {product.mrpPaise > product.pricePaise && (
                <span className="text-xs text-gray-400 line-through">
                  {formatPaiseToInr(product.mrpPaise)}
                </span>
              )}
            </div>

            {/* Quick Add Button */}
            <button
              onClick={handleAdd}
              disabled={product.stockAvailable <= 0}
              className={`p-2 sm:px-3 sm:py-1.5 rounded-full transition-all shadow-xs flex items-center gap-1 text-xs font-bold shrink-0 ${
                added
                  ? "bg-emerald-600 text-white"
                  : "bg-[#E11D48] text-white hover:bg-[#C4153C]"
              } disabled:bg-gray-300`}
              aria-label={`Add ${product.name} to cart`}
            >
              {added ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Added</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Add</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      {showQuickView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setShowQuickView(false)}
          />
          <div className="relative z-10 bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 animate-fade-in space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#E11D48] block">
                  Quick View
                </span>
                <h3 className="text-lg font-bold text-gray-900 leading-tight mt-1">
                  {product.name}
                </h3>
              </div>
              <button
                onClick={() => setShowQuickView(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {/* Quick View Main Product Box */}
            <div className="w-full aspect-[4/3] rounded-2xl bg-slate-900 flex items-center justify-center relative overflow-hidden border border-slate-200/80 shadow-inner">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={quickViewImage || primaryImage}
                alt={product.name}
                className="w-full h-full object-cover object-center relative z-10 transition-all duration-300"
              />
            </div>

            {/* Quick View Thumbnails strip (if multiple images available) */}
            {product.images && product.images.length > 1 && (
              <div className="flex items-center justify-center gap-2 pt-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setQuickViewImage(img.url)}
                    className={`w-14 h-14 rounded-xl border p-1 bg-white overflow-hidden transition-all ${
                      (quickViewImage || primaryImage) === img.url
                        ? "border-[#E11D48] ring-2 ring-rose-200 shadow-sm"
                        : "border-slate-200 hover:border-slate-400 opacity-70 hover:opacity-100"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.url}
                      alt={img.alt || product.name}
                      className="w-full h-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-[#E11D48]">
                  {formatPaiseToInr(product.pricePaise)}
                </span>
                {product.mrpPaise > product.pricePaise && (
                  <span className="text-sm text-gray-400 line-through">
                    {formatPaiseToInr(product.mrpPaise)}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="bg-rose-100 text-[#E11D48] text-xs font-bold px-2 py-0.5 rounded-full">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>

              <div className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                ✓ In Stock
              </div>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              {product.description}
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => {
                  handleAdd();
                  setTimeout(() => setShowQuickView(false), 500);
                }}
                className="flex-1 bg-[#E11D48] hover:bg-[#C4153C] text-white py-3.5 rounded-full font-bold text-xs uppercase tracking-wider shadow-md transition-colors"
              >
                Add To Cart
              </button>
              <Link
                href={`/shop/products/${product.slug}`}
                onClick={() => setShowQuickView(false)}
                className="border border-gray-300 hover:border-black text-gray-700 hover:text-black px-5 py-3.5 rounded-full font-bold text-xs uppercase tracking-wider transition-colors text-center"
              >
                Full Details
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

