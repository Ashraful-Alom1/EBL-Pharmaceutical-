"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Trash2, ArrowRight, ShoppingBag, ShieldCheck } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatPaiseToInr } from "@/lib/gst";

export default function CartDrawer() {
  const { isCartOpen, setIsCartOpen, items, updateQty, removeItem, subtotalPaise } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-[#FFF9F7]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#E01B47]" />
              <h3 className="font-extrabold text-base text-gray-900 uppercase tracking-tight">
                Your Bag ({items.reduce((s, i) => s + i.qty, 0)})
              </h3>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Discreet message */}
          <div className="bg-[#ECFDF3] px-6 py-2 border-b border-green-100 text-xs text-[#16A34A] font-semibold flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Eligible for Free 100% Discreet Packaging</span>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-rose-50 flex items-center justify-center text-[#E01B47]">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="text-gray-600 font-semibold">Your shopping bag is empty.</p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="inline-block bg-[#E01B47] text-white text-xs font-bold px-6 py-2.5 rounded-full hover:bg-[#C4153C] transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              items.map(({ product, qty }) => (
                <div
                  key={product.id}
                  className="flex gap-4 p-3 bg-[#FFF9F7]/60 rounded-xl border border-rose-50 relative group"
                >
                  <div className="w-20 h-20 bg-white rounded-lg p-1.5 shrink-0 border border-gray-100 relative overflow-hidden">
                    <Image
                      src={product.images[0]?.url || "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300"}
                      alt={product.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-gray-900 line-clamp-2 leading-tight">
                        {product.name}
                      </h4>
                      <p className="text-[11px] text-gray-500 mt-0.5">{product.unit}</p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-[#E01B47]">
                          {formatPaiseToInr(product.pricePaise)}
                        </span>
                        {product.mrpPaise > product.pricePaise && (
                          <span className="text-[10px] text-gray-400 line-through">
                            {formatPaiseToInr(product.mrpPaise)}
                          </span>
                        )}
                      </div>

                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-gray-200 bg-white rounded-full text-xs font-semibold">
                        <button
                          onClick={() => updateQty(product.id, qty - 1)}
                          className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 rounded-l-full text-gray-600"
                        >
                          -
                        </button>
                        <span className="w-6 text-center text-xs">{qty}</span>
                        <button
                          onClick={() => updateQty(product.id, qty + 1)}
                          className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 rounded-r-full text-gray-600"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(product.id)}
                    className="absolute top-2 right-2 text-gray-300 hover:text-red-500 transition-colors p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer / Checkout */}
          {items.length > 0 && (
            <div className="p-6 border-t border-gray-100 bg-[#FFF9F7]">
              <div className="flex justify-between items-center mb-1 text-xs text-gray-500">
                <span>Shipping:</span>
                <span className="text-green-600 font-bold uppercase">FREE</span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-bold text-gray-900">Subtotal (incl. GST):</span>
                <span className="text-lg font-black text-[#E01B47]">
                  {formatPaiseToInr(subtotalPaise)}
                </span>
              </div>
              <Link
                href="/shop/checkout"
                onClick={() => setIsCartOpen(false)}
                className="w-full bg-[#E01B47] text-white py-3.5 rounded-full font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#C4153C] shadow-lg transition-all"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="text-[10px] text-gray-400 text-center mt-3">
                Cash on Delivery (COD) & UPI bank transfers accepted
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
