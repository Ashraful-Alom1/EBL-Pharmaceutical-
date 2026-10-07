"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, ArrowRight, ShoppingBag, ShieldCheck } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatPaiseToInr } from "@/lib/gst";

export default function CartPage() {
  const { items, updateQty, removeItem, subtotalPaise } = useCart();

  return (
    <div className="py-12 px-4 sm:px-6 max-w-[1000px] mx-auto pb-32">
      <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-8">
        Your Shopping Bag
      </h1>

      {items.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-storeCard space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-rose-50 flex items-center justify-center text-[#E01B47]">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Your bag is empty</h3>
          <p className="text-xs text-gray-500">Discover premium wellness and intimate care essentials.</p>
          <Link
            href="/shop"
            className="inline-block bg-[#E01B47] text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#C4153C] transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Item List */}
          <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-storeCard space-y-4">
            <div className="bg-[#ECFDF3] px-4 py-2.5 rounded-xl text-xs text-[#16A34A] font-bold flex items-center gap-2 mb-4">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>100% Discreet Packaging on all orders</span>
            </div>

            {items.map(({ product, qty }) => (
              <div
                key={product.id}
                className="flex items-center gap-4 py-4 border-b border-gray-100 last:border-0"
              >
                <div className="w-20 h-20 bg-[#FAF7F6] rounded-2xl p-2 shrink-0 relative overflow-hidden">
                  <Image
                    src={product.images[0]?.url || "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300"}
                    alt={product.name}
                    fill
                    className="object-contain"
                  />
                </div>

                <div className="flex-1">
                  <h3 className="text-xs sm:text-sm font-bold text-gray-900 line-clamp-1">
                    {product.name}
                  </h3>
                  <span className="text-[11px] text-gray-400 block mt-0.5">{product.unit}</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-extrabold text-[#E01B47]">
                      {formatPaiseToInr(product.pricePaise)}
                    </span>
                    {product.mrpPaise > product.pricePaise && (
                      <span className="text-[10px] text-gray-400 line-through">
                        {formatPaiseToInr(product.mrpPaise)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Qty Stepper */}
                <div className="flex items-center border border-gray-200 rounded-full px-2 py-1 text-xs">
                  <button
                    onClick={() => updateQty(product.id, qty - 1)}
                    className="w-6 h-6 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-full"
                  >
                    -
                  </button>
                  <span className="w-6 text-center font-bold">{qty}</span>
                  <button
                    onClick={() => updateQty(product.id, qty + 1)}
                    className="w-6 h-6 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-full"
                  >
                    +
                  </button>
                </div>

                <div className="text-right pl-2">
                  <span className="text-xs font-black text-gray-900 block">
                    {formatPaiseToInr(product.pricePaise * qty)}
                  </span>
                  <button
                    onClick={() => removeItem(product.id)}
                    className="text-gray-400 hover:text-red-500 p-1 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5 ml-auto" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-4 bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-storeCard space-y-4">
            <h3 className="font-extrabold text-base text-gray-900 border-b border-gray-100 pb-3">
              Order Summary
            </h3>
            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal (inclusive of GST)</span>
                <span className="font-bold text-gray-900">{formatPaiseToInr(subtotalPaise)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-bold text-green-600 uppercase">FREE</span>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-between items-center text-base font-black text-gray-900">
              <span>Total:</span>
              <span className="text-xl text-[#E01B47]">{formatPaiseToInr(subtotalPaise)}</span>
            </div>

            <Link
              href="/shop/checkout"
              className="w-full bg-[#E01B47] hover:bg-[#C4153C] text-white py-3.5 rounded-full font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <p className="text-[10px] text-gray-400 text-center">
              Cash on Delivery (COD) & Direct UPI payments accepted
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
