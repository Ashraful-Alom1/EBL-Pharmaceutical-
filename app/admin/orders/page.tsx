"use client";

import React, { useState, useEffect } from "react";
import {
  Package,
  Truck,
  CheckCircle,
  FileText,
  Clock,
  Search,
  Filter,
  AlertCircle,
  Send,
  Trash2,
} from "lucide-react";
import { dataStore } from "@/lib/data-store";
import { formatPaiseToInr } from "@/lib/gst";
import { Order } from "@/lib/types";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Shipment Modal State
  const [isShipModalOpen, setIsShipModalOpen] = useState(false);
  const [courierName, setCourierName] = useState("BlueDart Express");
  const [awbNumber, setAwbNumber] = useState("");
  const [trackingUrl, setTrackingUrl] = useState("https://www.bluedart.com/tracking");

  useEffect(() => {
    setOrders(dataStore.getOrders());
    const unsub = dataStore.subscribe(() => {
      setOrders([...dataStore.getOrders()]);
    });
    return unsub;
  }, []);

  const refreshOrders = () => {
    setOrders([...dataStore.getOrders()]);
  };

  const handleUpdateStatus = (
    orderId: string,
    newStatus: Order["status"],
    note: string
  ) => {
    dataStore.updateOrderStatus(orderId, newStatus, note);
    if (selectedOrder?.id === orderId) {
      setSelectedOrder(dataStore.getOrderById(orderId) || null);
    }
  };

  const handleDeleteOrder = (orderId: string, orderNo: string) => {
    if (confirm(`Are you sure you want to delete order ${orderNo}?`)) {
      dataStore.deleteOrder(orderId);
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(null);
      }
    }
  };

  const handleConfirmShipment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    dataStore.updateOrderStatus(
      selectedOrder.id,
      "SHIPPED",
      `Dispatched via ${courierName} (AWB: ${awbNumber})`,
      { courier: courierName, awb: awbNumber, trackingUrl }
    );
    setIsShipModalOpen(false);
    refreshOrders();
    setSelectedOrder(dataStore.getOrderById(selectedOrder.id) || null);
  };

  const handleMarkPaymentPaid = (orderId: string) => {
    dataStore.markPaymentPaid(orderId);
    refreshOrders();
    if (selectedOrder?.id === orderId) {
      setSelectedOrder(dataStore.getOrderById(orderId) || null);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = filterStatus === "ALL" || o.status === filterStatus;
    const matchesSearch =
      o.orderNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerPhone.includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Orders & Fulfillment
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track customer shipments, assign courier AWBs, and reconcile COD collections.
          </p>
        </div>

        {/* Search */}
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search order no, customer, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-xs px-4 py-2 border border-slate-200 rounded-full outline-none focus:border-[#0A1B8F] w-64 bg-white"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 pb-2 border-b border-slate-200">
        {[
          "ALL",
          "PENDING_PAYMENT",
          "CONFIRMED",
          "PACKED",
          "SHIPPED",
          "DELIVERED",
          "CANCELLED",
        ].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              filterStatus === st
                ? "bg-[#0A1B8F] text-white shadow-xs"
                : "bg-white text-slate-600 border border-slate-200 hover:border-slate-400"
            }`}
          >
            {st.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* Table & Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Table List */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Order No</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Payment</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Total</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      No orders found matching the filter.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((ord) => (
                    <tr
                      key={ord.id}
                      onClick={() => setSelectedOrder(ord)}
                      className={`hover:bg-blue-50/40 cursor-pointer transition-colors ${
                        selectedOrder?.id === ord.id ? "bg-blue-50/70" : ""
                      }`}
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        {ord.orderNo}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-900 block">{ord.customerName}</span>
                        <span className="text-[10px] text-slate-400">{ord.shippingAddress.city}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-[11px] font-bold block">{ord.paymentMethod}</span>
                        <span
                          className={`text-[10px] font-bold ${
                            ord.paymentStatus === "PAID" ? "text-emerald-600" : "text-amber-600"
                          }`}
                        >
                          {ord.paymentStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            ord.status === "DELIVERED"
                              ? "bg-emerald-50 text-emerald-700"
                              : ord.status === "CONFIRMED"
                              ? "bg-blue-50 text-[#0A1B8F]"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {ord.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-black text-slate-900">
                        {formatPaiseToInr(ord.grandTotal)}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOrder(ord);
                          }}
                          className="text-[#0A1B8F] font-bold hover:underline"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Order Detail Sidebar */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6 sticky top-24">
          {selectedOrder ? (
            <>
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Selected Order</span>
                  <h3 className="text-lg font-black text-slate-900 font-mono">
                    {selectedOrder.orderNo}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">GST Invoice</span>
                  <p className="text-xs font-mono font-bold text-[#0A1B8F]">
                    {selectedOrder.invoiceNo || "Pending Allocation"}
                  </p>
                </div>
              </div>

              {/* Status Actions */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                  Fulfillment Actions
                </span>

                <div className="grid grid-cols-2 gap-2">
                  {selectedOrder.status === "CONFIRMED" && (
                    <button
                      onClick={() =>
                        handleUpdateStatus(selectedOrder.id, "PACKED", "Order packed in discreet box")
                      }
                      className="bg-slate-800 hover:bg-slate-900 text-white py-2 rounded-xl text-xs font-bold transition-all"
                    >
                      Mark as Packed
                    </button>
                  )}

                  {(selectedOrder.status === "CONFIRMED" || selectedOrder.status === "PACKED") && (
                    <button
                      onClick={() => setIsShipModalOpen(true)}
                      className="bg-[#0A1B8F] hover:bg-[#1527ab] text-white py-2 rounded-xl text-xs font-bold transition-all"
                    >
                      Assign Courier / Ship
                    </button>
                  )}

                  {selectedOrder.status === "SHIPPED" && (
                    <button
                      onClick={() =>
                        handleUpdateStatus(selectedOrder.id, "DELIVERED", "Delivered to recipient")
                      }
                      className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-xl text-xs font-bold transition-all col-span-2"
                    >
                      Confirm Delivered (Reconcile Payment)
                    </button>
                  )}

                  {selectedOrder.paymentStatus === "PENDING" && selectedOrder.paymentMethod === "MANUAL_UPI" && (
                    <button
                      onClick={() => handleMarkPaymentPaid(selectedOrder.id)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-xl text-xs font-bold transition-all col-span-2"
                    >
                      Verify & Mark Payment PAID
                    </button>
                  )}
                </div>
              </div>

              {/* Customer & Address */}
              <div className="text-xs space-y-1.5 pt-2 border-t border-slate-100">
                <span className="font-bold text-slate-700 block">Shipping Destination:</span>
                <p className="font-semibold text-slate-900">{selectedOrder.customerName}</p>
                <p className="text-slate-500">{selectedOrder.customerPhone} · {selectedOrder.customerEmail}</p>
                <p className="text-slate-600">
                  {selectedOrder.shippingAddress.line1}, {selectedOrder.shippingAddress.city},{" "}
                  {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pincode}
                </p>
              </div>

              {/* Order Items */}
              <div className="text-xs space-y-2 pt-2 border-t border-slate-100">
                <span className="font-bold text-slate-700 block">
                  Items ({selectedOrder.items.length}):
                </span>
                {selectedOrder.items.map((item, i) => (
                  <div key={i} className="flex justify-between items-center text-slate-600 py-1">
                    <span>
                      {item.qty}x {item.nameSnapshot}
                    </span>
                    <strong className="text-slate-900">{formatPaiseToInr(item.lineTotal)}</strong>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-2 border-t border-slate-100 font-black text-sm">
                  <span>Grand Total:</span>
                  <span className="text-[#0A1B8F]">{formatPaiseToInr(selectedOrder.grandTotal)}</span>
                </div>
              </div>

              {/* Status History */}
              <div className="text-xs space-y-2 pt-2 border-t border-slate-100">
                <span className="font-bold text-slate-700 block">Audit Timeline:</span>
                <div className="space-y-1 text-[11px] text-slate-500">
                  {selectedOrder.statusHistory.map((h, i) => (
                    <div key={i} className="flex justify-between">
                      <span>{h.note}</span>
                      <span className="text-slate-400">{h.at.slice(0, 10)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delete Order Action */}
              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => handleDeleteOrder(selectedOrder.id, selectedOrder.orderNo)}
                  className="text-xs text-red-600 hover:text-red-700 font-bold flex items-center gap-1.5 p-1.5 rounded-xl hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Order</span>
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-16 text-slate-400">
              <Package className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p className="text-xs font-semibold">Select an order from the table to view details.</p>
            </div>
          )}
        </div>
      </div>

      {/* Shipment Modal */}
      {isShipModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-black text-slate-900">
              Dispatch Order {selectedOrder.orderNo}
            </h3>

            <form onSubmit={handleConfirmShipment} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Courier Partner *</label>
                <select
                  value={courierName}
                  onChange={(e) => setCourierName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#0A1B8F] bg-white font-medium"
                >
                  <option value="BlueDart Express">BlueDart Express</option>
                  <option value="Delhivery Surface">Delhivery Surface</option>
                  <option value="DTDC Express">DTDC Express</option>
                  <option value="India Post SpeedPost">India Post SpeedPost</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Air Waybill (AWB) Tracking No *</label>
                <input
                  type="text"
                  required
                  value={awbNumber}
                  onChange={(e) => setAwbNumber(e.target.value)}
                  placeholder="e.g. BLD7789210"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#0A1B8F] font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Courier Tracking URL</label>
                <input
                  type="url"
                  value={trackingUrl}
                  onChange={(e) => setTrackingUrl(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#0A1B8F]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsShipModalOpen(false)}
                  className="text-xs font-bold text-slate-500 px-4 py-2 hover:bg-slate-100 rounded-full"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#0A1B8F] text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-md"
                >
                  Confirm Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
