"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle2,
  ShieldCheck,
  Truck,
  CreditCard,
  QrCode,
  ArrowRight,
  AlertCircle,
  Copy,
  Lock,
} from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { dataStore } from "@/lib/data-store";
import { formatPaiseToInr, calculateGst } from "@/lib/gst";
import { COMPANY_INFO } from "@/lib/constants";
import { Order } from "@/lib/types";

export default function CheckoutPage() {
  const { items, clearCart, subtotalPaise } = useCart();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [line1, setLine1] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("Tripura");
  const [stateCode, setStateCode] = useState("16");
  const [pincode, setPincode] = useState("");

  const [paymentMethod, setPaymentMethod] = useState<"COD" | "MANUAL_UPI">("COD");
  const [utrNumber, setUtrNumber] = useState("");
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // States of India with GST State Codes
  const indianStates = [
    { code: "16", name: "Tripura" },
    { code: "18", name: "Assam" },
    { code: "33", name: "Tamil Nadu" },
    { code: "07", name: "Delhi" },
    { code: "27", name: "Maharashtra" },
    { code: "29", name: "Karnataka" },
    { code: "19", name: "West Bengal" },
    { code: "09", name: "Uttar Pradesh" },
    { code: "06", name: "Haryana" },
    { code: "24", name: "Gujarat" },
    { code: "32", name: "Kerala" },
  ];

  const handleStateChange = (code: string) => {
    const found = indianStates.find((s) => s.code === code);
    if (found) {
      setState(found.name);
      setStateCode(found.code);
    }
  };

  // Compute GST based on state
  const gstLines = items.map((i) => ({
    unitPricePaise: i.product.pricePaise,
    qty: i.qty,
    gstRate: i.product.gstRate,
    hsnCode: i.product.hsnCode,
  }));
  const gstSummary = calculateGst(gstLines, COMPANY_INFO.defaultHomeStateCode, stateCode);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    if (paymentMethod === "MANUAL_UPI" && !utrNumber.trim()) {
      setError("Please enter the UPI Transaction Reference / UTR Number after completing your transfer.");
      return;
    }

    setIsSubmitting(true);

    const result = dataStore.placeOrder({
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      shippingAddress: {
        name,
        phone,
        line1,
        city,
        state,
        stateCode,
        pincode,
        country: "India",
      },
      paymentMethod,
      items: items.map((i) => ({ productId: i.product.id, qty: i.qty })),
      paymentProofUtr: utrNumber.trim() || undefined,
    });

    if (result.success && result.order) {
      setPlacedOrder(result.order);
      clearCart();
    } else {
      setError(result.message || "Failed to place order. Please try again.");
    }
    setIsSubmitting(false);
  };

  if (placedOrder) {
    return (
      <div className="py-16 px-4 max-w-xl mx-auto text-center pb-32">
        <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-storeCard border border-gray-100 space-y-6">
          <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Order Confirmed!
          </h2>

          <div className="bg-[#FAF7F6] p-4 rounded-2xl text-xs space-y-2 text-left">
            <div className="flex justify-between">
              <span className="text-gray-500">Order Number:</span>
              <strong className="font-mono text-gray-900">{placedOrder.orderNo}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">GST Invoice Reference:</span>
              <strong className="font-mono text-[#0A1B8F]">{placedOrder.invoiceNo}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Payment Mode:</span>
              <strong className="text-gray-900">{placedOrder.paymentMethod}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Total Payable:</span>
              <strong className="text-[#E01B47]">{formatPaiseToInr(placedOrder.grandTotal)}</strong>
            </div>
          </div>

          <p className="text-xs text-gray-500 leading-relaxed">
            A confirmation receipt and GST invoice have been dispatched to <strong>{placedOrder.customerEmail}</strong>. Your shipment will be dispatched in a plain, confidential brown box within 24 hours.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href={`/shop/track-order`}
              className="flex-1 bg-[#E01B47] text-white py-3 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#C4153C] transition-colors"
            >
              Track This Order
            </Link>
            <Link
              href="/shop"
              className="flex-1 border border-gray-200 text-gray-700 py-3 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-gray-50 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-6 max-w-[1100px] mx-auto pb-32">
      <h1 className="text-3xl font-black text-gray-900 mb-8">Secure Checkout</h1>

      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50 text-red-700 text-xs flex items-center gap-2 border border-red-100">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Contact, Address & Payment */}
        <div className="lg:col-span-7 space-y-6">
          {/* Contact Details */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-storeCard space-y-4">
            <h3 className="font-extrabold text-base text-gray-900">1. Contact Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Aman Sharma"
                  className="w-full text-xs p-3 rounded-xl border border-gray-200 outline-none focus:border-[#E01B47]"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Phone Number (For Courier) *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full text-xs p-3 rounded-xl border border-gray-200 outline-none focus:border-[#E01B47]"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Email Address (For Invoice) *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="aman@example.com"
                className="w-full text-xs p-3 rounded-xl border border-gray-200 outline-none focus:border-[#E01B47]"
              />
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-storeCard space-y-4">
            <h3 className="font-extrabold text-base text-gray-900">2. Shipping Address</h3>
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Street Address & Flat / House No. *</label>
              <input
                type="text"
                required
                value={line1}
                onChange={(e) => setLine1(e.target.value)}
                placeholder="e.g. Flat 402, Royal Palms, B-Wing"
                className="w-full text-xs p-3 rounded-xl border border-gray-200 outline-none focus:border-[#E01B47]"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">City *</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Agartala"
                  className="w-full text-xs p-3 rounded-xl border border-gray-200 outline-none focus:border-[#E01B47]"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">State *</label>
                <select
                  value={stateCode}
                  onChange={(e) => handleStateChange(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-gray-200 outline-none focus:border-[#E01B47] bg-white font-medium"
                >
                  {indianStates.map((s) => (
                    <option key={s.code} value={s.code}>
                      {s.name} ({s.code})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Pincode *</label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                  placeholder="e.g. 799001"
                  className="w-full text-xs p-3 rounded-xl border border-gray-200 outline-none focus:border-[#E01B47]"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-storeCard space-y-4">
            <h3 className="font-extrabold text-base text-gray-900">3. Payment Method</h3>
            <div className="space-y-3">
              {/* Option 1: Cash on Delivery */}
              <label
                className={`p-4 rounded-2xl border-2 flex items-start gap-4 cursor-pointer transition-all ${
                  paymentMethod === "COD" ? "border-[#E01B47] bg-[#FFF9F7]" : "border-gray-200"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "COD"}
                  onChange={() => setPaymentMethod("COD")}
                  className="mt-1 accent-[#E01B47]"
                />
                <div>
                  <h4 className="text-xs sm:text-sm font-extrabold text-gray-900">
                    Cash on Delivery (COD)
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Pay in cash or through UPI to delivery courier at your doorstep.
                  </p>
                </div>
              </label>

              {/* Option 2: Manual UPI / Bank Transfer */}
              <label
                className={`p-4 rounded-2xl border-2 flex items-start gap-4 cursor-pointer transition-all ${
                  paymentMethod === "MANUAL_UPI" ? "border-[#E01B47] bg-[#FFF9F7]" : "border-gray-200"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "MANUAL_UPI"}
                  onChange={() => setPaymentMethod("MANUAL_UPI")}
                  className="mt-1 accent-[#E01B47]"
                />
                <div className="flex-1">
                  <h4 className="text-xs sm:text-sm font-extrabold text-gray-900">
                    Direct UPI / Bank Transfer (Zero Transaction Fee)
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Transfer directly to company current account and submit your UTR reference.
                  </p>

                  {paymentMethod === "MANUAL_UPI" && (
                    <div className="mt-4 p-4 rounded-xl bg-white border border-gray-200 space-y-2 text-xs text-gray-700">
                      <div className="flex justify-between items-center">
                        <span>UPI VPA:</span>
                        <strong className="font-mono text-[#0A1B8F]">easternbiochemicals@icici</strong>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Bank:</span>
                        <strong>ICICI Bank, Agartala Branch</strong>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>A/C No:</span>
                        <strong className="font-mono">032905001248</strong>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>IFSC:</span>
                        <strong className="font-mono">ICIC0000329</strong>
                      </div>

                      <div className="pt-2 border-t border-gray-100">
                        <label className="text-[11px] font-bold text-gray-800 block mb-1">
                          UPI UTR / Bank Transaction Reference Number *
                        </label>
                        <input
                          type="text"
                          required
                          value={utrNumber}
                          onChange={(e) => setUtrNumber(e.target.value)}
                          placeholder="e.g. 427810398211"
                          className="w-full text-xs p-2.5 rounded-lg border border-gray-300 outline-none focus:border-[#E01B47] font-mono"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right: Order Summary & GST Breakdown */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-storeCard space-y-4 sticky top-24">
            <h3 className="font-extrabold text-base text-gray-900 border-b border-gray-100 pb-3">
              Order Review ({items.reduce((s, i) => s + i.qty, 0)} items)
            </h3>

            {/* Items */}
            <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
              {items.map(({ product, qty }) => (
                <div key={product.id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 max-w-[200px]">
                    <div className="w-10 h-10 rounded-lg bg-gray-50 border p-1 relative shrink-0">
                      <Image
                        src={product.images[0]?.url || "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=100"}
                        alt={product.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 line-clamp-1">{product.name}</p>
                      <span className="text-[10px] text-gray-400">Qty: {qty}</span>
                    </div>
                  </div>
                  <span className="font-extrabold text-gray-900">
                    {formatPaiseToInr(product.pricePaise * qty)}
                  </span>
                </div>
              ))}
            </div>

            {/* GST Summary */}
            <div className="border-t border-gray-100 pt-4 space-y-2 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Taxable Value:</span>
                <span>{formatPaiseToInr(gstSummary.taxableTotal)}</span>
              </div>
              {gstSummary.isInterState ? (
                <div className="flex justify-between">
                  <span>IGST (Integrated GST):</span>
                  <span>{formatPaiseToInr(gstSummary.igstTotal)}</span>
                </div>
              ) : (
                <>
                  <div className="flex justify-between">
                    <span>CGST (Central GST):</span>
                    <span>{formatPaiseToInr(gstSummary.cgstTotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>SGST (State GST):</span>
                    <span>{formatPaiseToInr(gstSummary.sgstTotal)}</span>
                  </div>
                </>
              )}
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span className="text-green-600 font-bold uppercase">FREE</span>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-between items-center text-lg font-black text-gray-900">
              <span>Total Payable:</span>
              <span className="text-[#E01B47]">{formatPaiseToInr(gstSummary.grandTotal)}</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#E01B47] hover:bg-[#C4153C] text-white py-4 rounded-full font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <Lock className="w-4 h-4" />
              <span>{isSubmitting ? "Processing Order..." : "Place Order Now"}</span>
            </button>

            <div className="text-[11px] text-gray-400 space-y-1 text-center pt-2">
              <p>🔒 256-Bit SSL Encrypted & Confidential</p>
              <p>Zero Brand Labeling on Carton Box</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
