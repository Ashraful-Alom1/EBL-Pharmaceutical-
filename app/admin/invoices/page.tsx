"use client";

import React, { useState } from "react";
import { Receipt, Download, Printer, Search, Building2, CheckCircle2 } from "lucide-react";
import { dataStore } from "@/lib/data-store";
import { formatPaiseToInr } from "@/lib/gst";
import { COMPANY_INFO } from "@/lib/constants";
import { Order } from "@/lib/types";
import EblLogo from "@/components/store/EblLogo";

export default function AdminInvoicesPage() {
  const orders = dataStore.getOrders();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            GST Tax Invoices
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Sequential statutory tax invoices (EBPL/FY/XXXX), CGST/SGST/IGST breakdown, and HSN summaries.
          </p>
        </div>
      </div>

      {/* Invoices List */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Invoice No</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Order Ref</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Place of Supply</th>
                <th className="py-3.5 px-4">Taxable</th>
                <th className="py-3.5 px-4">Total GST</th>
                <th className="py-3.5 px-4">Grand Total</th>
                <th className="py-3.5 px-4 text-right">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {orders.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#0A1B8F]">
                    {ord.invoiceNo || "EBPL/26-27/0001"}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">{ord.placedAt.slice(0, 10)}</td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-slate-700">
                    {ord.orderNo}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{ord.customerName}</td>
                  <td className="py-3.5 px-4">
                    {ord.shippingAddress.state} (Code: {ord.placeOfSupplyStateCode})
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-700">
                    {formatPaiseToInr(ord.grandTotal - ord.taxTotal)}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {formatPaiseToInr(ord.taxTotal)}
                  </td>
                  <td className="py-3.5 px-4 font-black text-[#E01B47]">
                    {formatPaiseToInr(ord.grandTotal)}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedOrder(ord)}
                      className="inline-flex items-center gap-1 text-[#0A1B8F] hover:underline font-bold"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>View Invoice</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Modal for Viewing & Printing */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl my-8 space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-4">
                <EblLogo className="h-10" variant="dark" />
                <div>
                  <span className="text-[10px] font-black uppercase text-[#1AA3D9] tracking-widest">
                    TAX INVOICE
                  </span>
                  <h3 className="text-xl font-mono font-black text-slate-900">
                    {selectedOrder.invoiceNo || "EBPL/26-27/0001"}
                  </h3>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Printer className="w-4 h-4" /> Print
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-slate-400 hover:text-slate-600 px-3 py-2 text-xs font-bold"
                >
                  ✕ Close
                </button>
              </div>
            </div>

            {/* Seller & Buyer Info */}
            <div className="grid grid-cols-2 gap-6 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Supplier Details</span>
                <h4 className="font-extrabold text-slate-900">{COMPANY_INFO.legalName}</h4>
                <p className="text-slate-500 text-[11px]">{COMPANY_INFO.registeredOffice}</p>
                <p className="font-mono text-slate-700">CIN: {COMPANY_INFO.cin}</p>
                <p className="font-mono text-slate-700">GSTIN: 16AAACE1457M1Z2 (Tripura, 16)</p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Billed & Shipped To</span>
                <h4 className="font-extrabold text-slate-900">{selectedOrder.customerName}</h4>
                <p className="text-slate-500 text-[11px]">
                  {selectedOrder.shippingAddress.line1}, {selectedOrder.shippingAddress.city},{" "}
                  {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pincode}
                </p>
                <p className="text-slate-700">Phone: {selectedOrder.customerPhone}</p>
                <p className="text-slate-700">Place of Supply: {selectedOrder.shippingAddress.state} ({selectedOrder.placeOfSupplyStateCode})</p>
              </div>
            </div>

            {/* Itemized Table */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b">
                  <tr>
                    <th className="p-3">Item Description</th>
                    <th className="p-3">HSN</th>
                    <th className="p-3 text-center">Qty</th>
                    <th className="p-3 text-right">Taxable</th>
                    <th className="p-3 text-right">GST Rate</th>
                    <th className="p-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedOrder.items.map((item, i) => (
                    <tr key={i}>
                      <td className="p-3 font-semibold text-slate-900">{item.nameSnapshot}</td>
                      <td className="p-3 font-mono text-slate-500">{item.hsn || "40141010"}</td>
                      <td className="p-3 text-center">{item.qty}</td>
                      <td className="p-3 text-right font-mono">
                        {formatPaiseToInr(item.taxableValue)}
                      </td>
                      <td className="p-3 text-right">{item.gstRate}%</td>
                      <td className="p-3 text-right font-black text-slate-900">
                        {formatPaiseToInr(item.lineTotal)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-between items-start pt-2 text-xs">
              <div className="text-[11px] text-slate-400 space-y-1">
                <p>Payment Mode: {selectedOrder.paymentMethod}</p>
                <p>Terms: Immediate on Delivery</p>
                <p>Computer generated invoice, no physical signature required.</p>
              </div>

              <div className="w-64 space-y-1.5 text-right">
                <div className="flex justify-between text-slate-600">
                  <span>Taxable Total:</span>
                  <span className="font-mono">
                    {formatPaiseToInr(selectedOrder.grandTotal - selectedOrder.taxTotal)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Total Tax (GST):</span>
                  <span className="font-mono">{formatPaiseToInr(selectedOrder.taxTotal)}</span>
                </div>
                <div className="flex justify-between font-black text-base text-slate-900 pt-2 border-t">
                  <span>Invoice Grand Total:</span>
                  <span className="text-[#0A1B8F]">
                    {formatPaiseToInr(selectedOrder.grandTotal)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
