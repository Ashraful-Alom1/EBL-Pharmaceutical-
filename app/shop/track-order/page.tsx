"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Package, Truck, CheckCircle, Clock, AlertCircle, Download, ArrowRight } from "lucide-react";
import { dataStore } from "@/lib/data-store";
import { Order } from "@/lib/types";
import { formatPaiseToInr } from "@/lib/gst";

export default function TrackOrderPage() {
  const [orderNo, setOrderNo] = useState("");
  const [contact, setContact] = useState("");
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    setErrorMessage("");

    const order = dataStore.getOrderByNumber(orderNo);
    if (!order) {
      setSearchedOrder(null);
      setErrorMessage("No order found with that Order Number. Please check and try again.");
      return;
    }

    // verify contact match if provided
    if (contact.trim()) {
      const matchEmail = order.customerEmail.toLowerCase().includes(contact.trim().toLowerCase());
      const matchPhone = order.customerPhone.includes(contact.trim().replace(/\D/g, ""));
      if (!matchEmail && !matchPhone) {
        setSearchedOrder(null);
        setErrorMessage("Order Number found, but the phone or email does not match our records.");
        return;
      }
    }

    setSearchedOrder(order);
  };

  const steps = [
    { key: "CONFIRMED", label: "Order Confirmed", desc: "Order details verified & stock reserved" },
    { key: "PACKED", label: "Packed in Discreet Box", desc: "Zero external brand labels" },
    { key: "SHIPPED", label: "Handed over to Courier", desc: "Dispatched with tracking AWB" },
    { key: "OUT_FOR_DELIVERY", label: "Out for Delivery", desc: "Local courier executive on route" },
    { key: "DELIVERED", label: "Delivered", desc: "Safely received by customer" },
  ];

  const getStepStatus = (stepKey: string, currentStatus: Order["status"]) => {
    const orderIndex = steps.findIndex((s) => s.key === currentStatus);
    const thisIndex = steps.findIndex((s) => s.key === stepKey);

    if (currentStatus === "CANCELLED" || currentStatus === "RTO") {
      return "inactive";
    }

    if (thisIndex < orderIndex || thisIndex === orderIndex) {
      return "completed";
    }
    return "pending";
  };

  return (
    <div className="py-16 px-4 sm:px-6 max-w-xl mx-auto pb-32">
      {/* Title */}
      <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight text-center mb-8">
        Track Order
      </h1>

      {/* Form */}
      <form onSubmit={handleTrack} className="bg-white p-6 sm:p-8 rounded-3xl shadow-storeCard border border-gray-100 space-y-4">
        <div>
          <label className="text-xs font-bold text-gray-700 block mb-1">Order Number</label>
          <input
            type="text"
            required
            value={orderNo}
            onChange={(e) => setOrderNo(e.target.value)}
            placeholder="e.g. EB-100245"
            className="w-full text-xs p-3 rounded-xl border border-gray-200 outline-none focus:border-[#E01B47] uppercase font-mono"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-gray-700 block mb-1">Phone Number or Email</label>
          <input
            type="text"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="Enter phone or email used at checkout"
            className="w-full text-xs p-3 rounded-xl border border-gray-200 outline-none focus:border-[#E01B47]"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#E01B47] hover:bg-[#C4153C] text-white py-3.5 rounded-full font-bold text-xs uppercase tracking-wider shadow-md transition-all mt-2"
        >
          Track Order
        </button>
      </form>

      {/* Error State */}
      {errorMessage && (
        <div className="mt-6 p-4 rounded-2xl bg-red-50 text-red-700 text-xs flex items-center gap-2 border border-red-100">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Result Timeline */}
      {searchedOrder && (
        <div className="mt-10 bg-white p-6 sm:p-8 rounded-3xl shadow-storeCard border border-gray-100 space-y-8 animate-fade-in">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400">Order Reference</span>
              <h3 className="text-lg font-black text-gray-900 font-mono">{searchedOrder.orderNo}</h3>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-gray-400">Payment</span>
              <p className="text-xs font-bold text-gray-900">
                {searchedOrder.paymentMethod} · {searchedOrder.paymentStatus}
              </p>
            </div>
          </div>

          {/* Courier Info if shipped */}
          {searchedOrder.shipment?.awb && (
            <div className="bg-[#FAF7F6] p-4 rounded-2xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#E01B47]" />
                <span>
                  Courier: <strong>{searchedOrder.shipment.courier}</strong> (AWB:{" "}
                  <code className="bg-white px-2 py-0.5 rounded border border-gray-200">{searchedOrder.shipment.awb}</code>)
                </span>
              </div>
              {searchedOrder.shipment.trackingUrl && (
                <a
                  href={searchedOrder.shipment.trackingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#E01B47] font-bold underline"
                >
                  Live Courier Tracking
                </a>
              )}
            </div>
          )}

          {/* Vertical Progress Timeline */}
          <div className="space-y-6 pl-2">
            {steps.map((st, idx) => {
              const status = getStepStatus(st.key, searchedOrder.status);
              const isLast = idx === steps.length - 1;

              return (
                <div key={st.key} className="flex gap-4 relative">
                  {/* Line */}
                  {!isLast && (
                    <div
                      className={`absolute left-3.5 top-6 bottom-0 w-0.5 -mb-6 ${
                        status === "completed" ? "bg-green-500" : "bg-gray-200"
                      }`}
                    />
                  )}

                  {/* Icon */}
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 ${
                      status === "completed"
                        ? "bg-green-600 text-white shadow-sm"
                        : "bg-gray-100 text-gray-400 border border-gray-200"
                    }`}
                  >
                    {status === "completed" ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <Clock className="w-3.5 h-3.5" />
                    )}
                  </div>

                  {/* Text */}
                  <div>
                    <h4
                      className={`text-xs font-bold ${
                        status === "completed" ? "text-gray-900" : "text-gray-400"
                      }`}
                    >
                      {st.label}
                    </h4>
                    <p className="text-[11px] text-gray-500">{st.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Items in order */}
          <div className="border-t border-gray-100 pt-6 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Ordered Items ({searchedOrder.items.length})
            </h4>
            {searchedOrder.items.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-xs py-1">
                <span className="font-semibold text-gray-800">
                  {item.qty}x {item.nameSnapshot}
                </span>
                <span className="font-black text-[#E01B47]">
                  {formatPaiseToInr(item.lineTotal)}
                </span>
              </div>
            ))}
            <div className="flex justify-between items-center pt-2 border-t border-gray-100 text-sm font-black">
              <span>Total Amount:</span>
              <span className="text-[#E01B47]">{formatPaiseToInr(searchedOrder.grandTotal)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
