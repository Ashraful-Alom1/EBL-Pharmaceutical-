"use client";

import React, { useState, useEffect } from "react";
import {
  Truck,
  Plus,
  Search,
  FileText,
  Building2,
  TrendingUp,
  DollarSign,
  PackageCheck,
  CheckCircle2,
  Trash2,
  X,
  Printer,
  ChevronRight,
  Clock,
  Layers,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { dataStore, Wholesaler, WholesaleOrder, WholesaleOrderItem } from "@/lib/data-store";
import { formatPaiseToInr } from "@/lib/gst";
import { COMPANY_INFO } from "@/lib/constants";
import EblLogo from "@/components/store/EblLogo";

export default function AdminWholesalePage() {
  const [activeTab, setActiveTab] = useState<"orders" | "wholesalers">("orders");
  const [wholesaleOrders, setWholesaleOrders] = useState<WholesaleOrder[]>([]);
  const [wholesalers, setWholesalers] = useState<Wholesaler[]>([]);
  const [search, setSearch] = useState("");

  // Modals state
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [isNewWholesalerModalOpen, setIsNewWholesalerModalOpen] = useState(false);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<WholesaleOrder | null>(null);

  // New Wholesaler Form State
  const [wsName, setWsName] = useState("");
  const [wsDlNumber, setWsDlNumber] = useState("");
  const [wsGstin, setWsGstin] = useState("");
  const [wsContactPerson, setWsContactPerson] = useState("");
  const [wsPhone, setWsPhone] = useState("");
  const [wsEmail, setWsEmail] = useState("");
  const [wsAddress, setWsAddress] = useState("");
  const [wsCity, setWsCity] = useState("");
  const [wsState, setWsState] = useState("Assam");
  const [wsStateCode, setWsStateCode] = useState("18");
  const [wsPincode, setWsPincode] = useState("");
  const [wsCreditDays, setWsCreditDays] = useState("30");

  // New Order Form State
  const products = dataStore.getProducts();
  const batches = dataStore.getBatches();

  const [orderWholesalerId, setOrderWholesalerId] = useState("");
  const [orderDueDate, setOrderDueDate] = useState("2026-11-15");
  const [orderNotes, setOrderNotes] = useState("Standard wholesale road transit with cold-chain monitoring.");

  // Order Items in builder
  const [orderItems, setOrderItems] = useState<
    {
      productId: string;
      batchNo: string;
      qty: number;
      wholesalePriceInr: number;
    }[]
  >([]);

  const [selectedProdId, setSelectedProdId] = useState(products[0]?.id || "");
  const [selectedBatchNo, setSelectedBatchNo] = useState("");
  const [itemQty, setItemQty] = useState(100);
  const [itemWholesalePriceInr, setItemWholesalePriceInr] = useState(130);

  useEffect(() => {
    setWholesaleOrders(dataStore.getWholesaleOrders());
    setWholesalers(dataStore.getWholesalers());

    if (dataStore.getWholesalers().length > 0 && !orderWholesalerId) {
      setOrderWholesalerId(dataStore.getWholesalers()[0].id);
    }

    const unsub = dataStore.subscribe(() => {
      setWholesaleOrders([...dataStore.getWholesaleOrders()]);
      setWholesalers([...dataStore.getWholesalers()]);
    });
    return unsub;
  }, [orderWholesalerId]);

  // KPIs
  const totalWholesaleRevenue = dataStore.getWholesaleTotalRevenue();
  const totalWholesaleProfit = dataStore.getWholesaleTotalProfit();
  const activeWholesalersCount = wholesalers.filter((w) => w.status === "ACTIVE").length;
  const totalConsignmentsCount = wholesaleOrders.length;

  // Auto-populate batch when product changes in modal
  useEffect(() => {
    const prodBatches = batches.filter((b) => b.productId === selectedProdId);
    if (prodBatches.length > 0) {
      setSelectedBatchNo(prodBatches[0].batchNo);
      // Default suggested wholesale price (approx 65% of MRP)
      const p = products.find((x) => x.id === selectedProdId);
      if (p) {
        setItemWholesalePriceInr(Math.round((p.mrpPaise / 100) * 0.65));
      }
    } else {
      setSelectedBatchNo("");
    }
  }, [selectedProdId, batches, products]);

  const handleAddItemToOrder = () => {
    if (!selectedProdId || itemQty <= 0 || itemWholesalePriceInr <= 0) return;
    setOrderItems([
      ...orderItems,
      {
        productId: selectedProdId,
        batchNo: selectedBatchNo,
        qty: itemQty,
        wholesalePriceInr: itemWholesalePriceInr,
      },
    ]);
  };

  const handleRemoveItemFromOrder = (index: number) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  const handleCreateWholesaleOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const ws = wholesalers.find((w) => w.id === orderWholesalerId);
    if (!ws || orderItems.length === 0) {
      alert("Please select a wholesaler and add at least one product item.");
      return;
    }

    const isInterState = ws.stateCode !== COMPANY_INFO.defaultHomeStateCode; // Home state Tripura 16
    const calculatedItems: WholesaleOrderItem[] = [];
    let subtotalPaise = 0;
    let taxTotalPaise = 0;
    let totalCostPaise = 0;
    let totalProfitPaise = 0;

    for (const line of orderItems) {
      const prod = products.find((p) => p.id === line.productId);
      const batch = batches.find((b) => b.batchNo === line.batchNo);
      if (!prod) continue;

      const mrpPaise = prod.mrpPaise;
      const unitCostPaise = batch?.costPaise || Math.round(prod.pricePaise * 0.5);
      const wholesalePricePaise = Math.round(line.wholesalePriceInr * 100);
      const taxableAmount = wholesalePricePaise * line.qty;

      const gstRate = prod.gstRate;
      let cgst = 0;
      let sgst = 0;
      let igst = 0;

      if (isInterState) {
        igst = Math.round((taxableAmount * gstRate) / 100);
      } else {
        cgst = Math.round((taxableAmount * (gstRate / 2)) / 100);
        sgst = Math.round((taxableAmount * (gstRate / 2)) / 100);
      }

      const lineTax = cgst + sgst + igst;
      const lineTotal = taxableAmount + lineTax;
      const lineCost = unitCostPaise * line.qty;
      const lineProfit = taxableAmount - lineCost; // Profit = Wholesale Revenue - Manufacturing Cost

      subtotalPaise += taxableAmount;
      taxTotalPaise += lineTax;
      totalCostPaise += lineCost;
      totalProfitPaise += lineProfit;

      calculatedItems.push({
        productId: prod.id,
        productName: prod.name,
        sku: prod.sku,
        hsnCode: prod.hsnCode || "30049099",
        batchNo: line.batchNo || "EB-GEN26",
        expiryDate: batch?.expiryDate || "2029-12-31",
        qty: line.qty,
        mrpPaise,
        unitCostPaise,
        wholesalePricePaise,
        gstRate,
        taxableAmountPaise: taxableAmount,
        cgstPaise: cgst,
        sgstPaise: sgst,
        igstPaise: igst,
        totalPaise: lineTotal,
        profitPaise: lineProfit,
      });
    }

    const grandTotalPaise = subtotalPaise + taxTotalPaise;

    dataStore.createWholesaleOrder({
      wholesalerId: ws.id,
      wholesalerName: ws.name,
      wholesalerDlNumber: ws.dlNumber,
      wholesalerGstin: ws.gstin,
      wholesalerAddress: `${ws.address}, ${ws.city}, ${ws.state} - ${ws.pincode}`,
      orderDate: new Date().toISOString().slice(0, 10),
      dueDate: orderDueDate,
      status: "CONFIRMED",
      paymentStatus: "PENDING",
      items: calculatedItems,
      subtotalPaise,
      taxTotalPaise,
      grandTotalPaise,
      totalCostPaise,
      totalProfitPaise,
      notes: orderNotes,
    });

    setIsNewOrderModalOpen(false);
    setOrderItems([]);
  };

  const handleCreateWholesaler = (e: React.FormEvent) => {
    e.preventDefault();
    dataStore.addWholesaler({
      name: wsName.trim(),
      dlNumber: wsDlNumber.trim().toUpperCase(),
      gstin: wsGstin.trim().toUpperCase(),
      contactPerson: wsContactPerson.trim(),
      phone: wsPhone.trim(),
      email: wsEmail.trim(),
      address: wsAddress.trim(),
      city: wsCity.trim(),
      state: wsState.trim(),
      stateCode: wsStateCode.trim(),
      pincode: wsPincode.trim(),
      creditDays: parseInt(wsCreditDays) || 30,
      status: "ACTIVE",
    });

    setIsNewWholesalerModalOpen(false);
    setWsName("");
    setWsDlNumber("");
    setWsGstin("");
    setWsContactPerson("");
    setWsPhone("");
    setWsEmail("");
    setWsAddress("");
    setWsCity("");
    setWsPincode("");
  };

  const handleToggleStatus = (id: string, currentStatus: WholesaleOrder["status"]) => {
    const nextStatus: WholesaleOrder["status"] =
      currentStatus === "CONFIRMED"
        ? "DISPATCHED"
        : currentStatus === "DISPATCHED"
        ? "DELIVERED"
        : currentStatus === "DELIVERED"
        ? "PAID"
        : "CONFIRMED";

    const nextPayment: WholesaleOrder["paymentStatus"] =
      nextStatus === "PAID" ? "PAID" : "PENDING";

    dataStore.updateWholesaleOrderStatus(id, nextStatus, nextPayment);
  };

  const handleDeleteWholesaleOrder = (id: string, invNo: string) => {
    if (confirm(`Are you sure you want to permanently delete wholesale consignment ${invNo}?`)) {
      dataStore.deleteWholesaleOrder(id);
    }
  };

  const handleDeleteWholesaler = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove wholesaler ${name}?`)) {
      dataStore.deleteWholesaler(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Truck className="w-7 h-7 text-[#0A1B8F]" />
            <span>Wholesale &amp; Medicine Distribution</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            B2B bulk orders, Drug License verification, automatic gross profit calculation, and compliant GST Tax Invoices.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsNewWholesalerModalOpen(true)}
            className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-xs flex items-center gap-2 transition-all cursor-pointer"
          >
            <Building2 className="w-4 h-4 text-[#0A1B8F]" />
            <span>Add Wholesaler</span>
          </button>
          <button
            onClick={() => setIsNewOrderModalOpen(true)}
            className="bg-[#0A1B8F] hover:bg-[#1527ab] text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Raise Consignment</span>
          </button>
        </div>
      </div>

      {/* KPI Cards (Automatic Profit Tracking) */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Total B2B Wholesale Revenue
          </span>
          <div className="text-2xl font-black text-slate-900">
            {formatPaiseToInr(totalWholesaleRevenue)}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">
            Across {totalConsignmentsCount} total consignments
          </span>
        </div>

        <div className="bg-emerald-50/70 p-5 rounded-3xl border border-emerald-100 shadow-xs">
          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 block mb-1">
            Automated Wholesale Profit
          </span>
          <div className="text-2xl font-black text-emerald-800">
            {formatPaiseToInr(totalWholesaleProfit)}
          </div>
          <span className="text-[10px] text-emerald-600 mt-1 block font-semibold">
            ✓ Auto-added to executive profit margin
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Registered Stockists &amp; Distributors
          </span>
          <div className="text-2xl font-black text-slate-900">
            {activeWholesalersCount}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">
            Verified Drug License holders
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Average Order Value (B2B)
          </span>
          <div className="text-2xl font-black text-slate-900">
            {totalConsignmentsCount > 0
              ? formatPaiseToInr(Math.round(totalWholesaleRevenue / totalConsignmentsCount))
              : "₹0"}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">
            Wholesale bulk transactions
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-xs font-bold">
        <button
          onClick={() => setActiveTab("orders")}
          className={`pb-3 transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === "orders"
              ? "border-b-2 border-[#0A1B8F] text-[#0A1B8F]"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <PackageCheck className="w-4 h-4" />
          <span>Wholesale Orders &amp; Consignments ({wholesaleOrders.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("wholesalers")}
          className={`pb-3 transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === "wholesalers"
              ? "border-b-2 border-[#0A1B8F] text-[#0A1B8F]"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Wholesalers Directory ({wholesalers.length})</span>
        </button>
      </div>

      {/* Tab 1: Wholesale Orders Table */}
      {activeTab === "orders" && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Invoice / Consignment</th>
                  <th className="py-3.5 px-4">Wholesaler Entity</th>
                  <th className="py-3.5 px-4">Allocated Items</th>
                  <th className="py-3.5 px-4">Invoice Value</th>
                  <th className="py-3.5 px-4">Consignment Profit</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {wholesaleOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      <div>{o.invoiceNo}</div>
                      <span className="text-[10px] text-slate-400 font-normal">
                        Date: {o.orderDate}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <strong className="text-slate-900 block">{o.wholesalerName}</strong>
                      <span className="text-[10px] text-slate-500 block font-mono">
                        DL: {o.wholesalerDlNumber}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {o.items.map((it: WholesaleOrderItem, i: number) => (
                        <div key={i} className="text-[11px] text-slate-700">
                          <span className="font-bold">{it.qty}x</span> {it.productName} ({it.batchNo})
                        </div>
                      ))}
                    </td>
                    <td className="py-3.5 px-4 font-black text-slate-900">
                      <div>{formatPaiseToInr(o.grandTotalPaise)}</div>
                      <span className="text-[10px] text-slate-400 font-normal">
                        GST: {formatPaiseToInr(o.taxTotalPaise)}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-black text-emerald-700 block bg-emerald-50 px-2 py-1 rounded-lg w-fit">
                        +{formatPaiseToInr(o.totalProfitPaise)}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleStatus(o.id, o.status)}
                        title="Click to progress stage"
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                          o.status === "PAID"
                            ? "bg-emerald-50 text-emerald-700"
                            : o.status === "DELIVERED"
                            ? "bg-blue-50 text-[#0A1B8F]"
                            : o.status === "DISPATCHED"
                            ? "bg-purple-50 text-purple-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {o.status} ↺
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedInvoiceOrder(o)}
                          className="bg-blue-50 hover:bg-blue-100 text-[#0A1B8F] px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition-colors cursor-pointer"
                          title="Generate Tax Invoice"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Invoice</span>
                        </button>
                        <button
                          onClick={() => handleDeleteWholesaleOrder(o.id, o.invoiceNo)}
                          className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                          title="Delete Order"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {wholesaleOrders.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      No wholesale distribution consignments raised yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Wholesalers Directory */}
      {activeTab === "wholesalers" && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Entity / Agency Name</th>
                  <th className="py-3.5 px-4">Drug License (DL No)</th>
                  <th className="py-3.5 px-4">GSTIN &amp; State</th>
                  <th className="py-3.5 px-4">Contact Person</th>
                  <th className="py-3.5 px-4">Phone &amp; Email</th>
                  <th className="py-3.5 px-4">Credit Terms</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {wholesalers.map((w) => (
                  <tr key={w.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <strong className="text-slate-900 block">{w.name}</strong>
                      <span className="text-[10px] text-slate-500">{w.address}, {w.city}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                      {w.dlNumber}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-700">
                      <div>{w.gstin}</div>
                      <span className="text-[10px] text-slate-500">{w.state} ({w.stateCode})</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-800">
                      {w.contactPerson}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-slate-900 block">{w.phone}</span>
                      <span className="text-[10px] text-slate-400">{w.email}</span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">
                      Net {w.creditDays} Days
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDeleteWholesaler(w.id, w.name)}
                        className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete Wholesaler"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {wholesalers.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      No stockists or wholesale distributors registered yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Raise Wholesale Consignment */}
      {isNewOrderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-xl font-black text-slate-900">Raise Wholesale Consignment</h3>
              <button
                onClick={() => setIsNewOrderModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateWholesaleOrder} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Select Wholesaler *</label>
                  <select
                    value={orderWholesalerId}
                    onChange={(e) => setOrderWholesalerId(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#0A1B8F] bg-white font-medium"
                  >
                    {wholesalers.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.name} ({w.city}, {w.state})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Expected Payment Due Date *</label>
                  <input
                    type="date"
                    required
                    value={orderDueDate}
                    onChange={(e) => setOrderDueDate(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#0A1B8F]"
                  />
                </div>
              </div>

              {/* Product item picker */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <span className="text-xs font-bold text-slate-800 block">Add Product Consignment Line:</span>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">Medicine *</label>
                    <select
                      value={selectedProdId}
                      onChange={(e) => setSelectedProdId(e.target.value)}
                      className="w-full text-xs p-2 rounded-xl border border-slate-200 outline-none bg-white"
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">Batch Allocation</label>
                    <select
                      value={selectedBatchNo}
                      onChange={(e) => setSelectedBatchNo(e.target.value)}
                      className="w-full text-xs p-2 rounded-xl border border-slate-200 outline-none bg-white font-mono"
                    >
                      {batches
                        .filter((b) => b.productId === selectedProdId)
                        .map((b) => (
                          <option key={b.id} value={b.batchNo}>
                            {b.batchNo} (Qty: {b.qtyOnHand})
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">Wholesale Qty</label>
                    <input
                      type="number"
                      min={1}
                      value={itemQty}
                      onChange={(e) => setItemQty(parseInt(e.target.value) || 0)}
                      className="w-full text-xs p-2 rounded-xl border border-slate-200 outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1">Wholesale Rate (₹/unit)</label>
                      <input
                        type="number"
                        min={1}
                        value={itemWholesalePriceInr}
                        onChange={(e) => setItemWholesalePriceInr(parseFloat(e.target.value) || 0)}
                        className="w-32 text-xs p-2 rounded-xl border border-slate-200 outline-none"
                      />
                    </div>
                    {/* Live estimated profit */}
                    {(() => {
                      const b = batches.find((x) => x.batchNo === selectedBatchNo);
                      const costInr = b ? b.costPaise / 100 : 70;
                      const profitPerUnit = itemWholesalePriceInr - costInr;
                      const totalLineProfit = profitPerUnit * itemQty;
                      return (
                        <div className="text-[11px] font-bold text-emerald-700 bg-emerald-100/60 px-3 py-1.5 rounded-xl self-end">
                          Est. Profit: +₹{totalLineProfit.toLocaleString("en-IN")}
                        </div>
                      );
                    })()}
                  </div>

                  <button
                    type="button"
                    onClick={handleAddItemToOrder}
                    className="bg-[#0A1B8F] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#1527ab] transition-colors cursor-pointer self-end"
                  >
                    + Add to Consignment
                  </button>
                </div>
              </div>

              {/* Order Items Table */}
              {orderItems.length > 0 && (
                <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100 font-bold text-slate-600">
                      <tr>
                        <th className="p-2.5">Product</th>
                        <th className="p-2.5">Batch</th>
                        <th className="p-2.5">Qty</th>
                        <th className="p-2.5">Rate</th>
                        <th className="p-2.5">Line Total</th>
                        <th className="p-2.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {orderItems.map((item, idx) => {
                        const prod = products.find((p) => p.id === item.productId);
                        return (
                          <tr key={idx}>
                            <td className="p-2.5 font-semibold text-slate-800">{prod?.name}</td>
                            <td className="p-2.5 font-mono">{item.batchNo}</td>
                            <td className="p-2.5 font-bold">{item.qty}</td>
                            <td className="p-2.5">₹{item.wholesalePriceInr}</td>
                            <td className="p-2.5 font-bold">
                              ₹{(item.wholesalePriceInr * item.qty).toLocaleString("en-IN")}
                            </td>
                            <td className="p-2.5 text-right">
                              <button
                                type="button"
                                onClick={() => handleRemoveItemFromOrder(idx)}
                                className="text-red-500 hover:text-red-700 font-bold"
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Transit / Dispatch Instructions</label>
                <input
                  type="text"
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewOrderModalOpen(false)}
                  className="text-xs font-bold text-slate-500 px-4 py-2 hover:bg-slate-100 rounded-full cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#0A1B8F] text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-md hover:bg-[#1527ab] transition-colors cursor-pointer"
                >
                  Issue Consignment &amp; Add Profit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Register New Wholesaler */}
      {isNewWholesalerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-xl font-black text-slate-900">Register Medicine Wholesaler</h3>
              <button
                onClick={() => setIsNewWholesalerModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateWholesaler} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Wholesaler / Agency Name *</label>
                <input
                  type="text"
                  required
                  value={wsName}
                  onChange={(e) => setWsName(e.target.value)}
                  placeholder="e.g. Guwahati Central Pharma Distributorship LLP"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#0A1B8F]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Drug License (DL No) *</label>
                  <input
                    type="text"
                    required
                    value={wsDlNumber}
                    onChange={(e) => setWsDlNumber(e.target.value.toUpperCase())}
                    placeholder="e.g. TR-AGT-20B-2025/0441, 21B-2025/0442"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#0A1B8F] font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">GSTIN Number *</label>
                  <input
                    type="text"
                    required
                    value={wsGstin}
                    onChange={(e) => setWsGstin(e.target.value.toUpperCase())}
                    placeholder="18AABCG1234F1Z8"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#0A1B8F] font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Contact Person *</label>
                  <input
                    type="text"
                    required
                    value={wsContactPerson}
                    onChange={(e) => setWsContactPerson(e.target.value)}
                    placeholder="e.g. Dr. B. K. Sarma"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#0A1B8F]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={wsPhone}
                    onChange={(e) => setWsPhone(e.target.value)}
                    placeholder="+91 98540 11223"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#0A1B8F]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Email</label>
                  <input
                    type="email"
                    value={wsEmail}
                    onChange={(e) => setWsEmail(e.target.value)}
                    placeholder="orders@wholesaler.com"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#0A1B8F]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Credit Limit (Days)</label>
                  <input
                    type="number"
                    value={wsCreditDays}
                    onChange={(e) => setWsCreditDays(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#0A1B8F]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Full Warehouse / Shop Address *</label>
                <input
                  type="text"
                  required
                  value={wsAddress}
                  onChange={(e) => setWsAddress(e.target.value)}
                  placeholder="GS Road, Near Supermarket Complex, Dispur"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#0A1B8F]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={wsCity}
                    onChange={(e) => setWsCity(e.target.value)}
                    placeholder="Guwahati"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#0A1B8F]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={wsState}
                    onChange={(e) => setWsState(e.target.value)}
                    placeholder="Assam"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#0A1B8F]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Pincode *</label>
                  <input
                    type="text"
                    required
                    value={wsPincode}
                    onChange={(e) => setWsPincode(e.target.value)}
                    placeholder="781006"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#0A1B8F]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewWholesalerModalOpen(false)}
                  className="text-xs font-bold text-slate-500 px-4 py-2 hover:bg-slate-100 rounded-full cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#0A1B8F] text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-md hover:bg-[#1527ab] transition-colors cursor-pointer"
                >
                  Register Wholesaler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable B2B Wholesale Tax Invoice Modal */}
      {selectedInvoiceOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-10 max-w-3xl w-full shadow-2xl max-h-[92vh] overflow-y-auto space-y-6 print:p-0 print:shadow-none">
            {/* Modal Controls */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 print:hidden">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Tax Invoice Preview (Form 20B/21B Compliant)
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="bg-[#0A1B8F] text-white px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 hover:bg-[#1527ab] transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Invoice</span>
                </button>
                <button
                  onClick={() => setSelectedInvoiceOrder(null)}
                  className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Invoice Document Body */}
            <div className="border border-slate-300 p-6 sm:p-8 rounded-2xl bg-white space-y-6 text-slate-800 font-sans">
              {/* Header */}
              <div className="flex justify-between items-start border-b border-slate-200 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <EblLogo className="h-7" variant="light" showText={false} />
                    <h2 className="text-lg font-black text-[#0A1B8F] tracking-tight">
                      {COMPANY_INFO.legalName}
                    </h2>
                  </div>
                  <p className="text-[11px] text-slate-600 max-w-sm">
                    {COMPANY_INFO.registeredOffice}
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                    GSTIN: {COMPANY_INFO.gstin} · PAN: {COMPANY_INFO.pan}
                  </p>
                  <p className="text-[10px] text-emerald-700 font-mono font-bold">
                    Drug License No: TR/W/2026/0491 (Form 20B / 21B)
                  </p>
                </div>

                <div className="text-right">
                  <span className="bg-[#0A1B8F] text-white px-3 py-1 rounded text-xs font-black uppercase tracking-wider block mb-1">
                    B2B TAX INVOICE
                  </span>
                  <div className="text-sm font-mono font-black text-slate-900">
                    {selectedInvoiceOrder.invoiceNo}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Date: {selectedInvoiceOrder.orderDate}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Due: {selectedInvoiceOrder.dueDate}
                  </div>
                </div>
              </div>

              {/* Billed To / Wholesaler Details */}
              <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                    Consignee / Billed To:
                  </span>
                  <strong className="text-slate-900 text-sm block">
                    {selectedInvoiceOrder.wholesalerName}
                  </strong>
                  <p className="text-slate-600 text-[11px] mt-0.5">
                    {selectedInvoiceOrder.wholesalerAddress}
                  </p>
                </div>
                <div className="space-y-1 font-mono text-[11px]">
                  <div>
                    <span className="text-slate-400 font-sans">GSTIN:</span>{" "}
                    <span className="font-bold text-slate-800">{selectedInvoiceOrder.wholesalerGstin}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-sans">DL Number:</span>{" "}
                    <span className="font-bold text-emerald-700">{selectedInvoiceOrder.wholesalerDlNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-sans">Payment Terms:</span>{" "}
                    <span className="font-bold text-slate-800">Net 30 Days (Direct NEFT/RTGS)</span>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-200">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-2 border-r border-slate-200">#</th>
                      <th className="p-2 border-r border-slate-200">Description of Medicine</th>
                      <th className="p-2 border-r border-slate-200">HSN</th>
                      <th className="p-2 border-r border-slate-200">Batch / Expiry</th>
                      <th className="p-2 border-r border-slate-200 text-right">Qty</th>
                      <th className="p-2 border-r border-slate-200 text-right">Rate (₹)</th>
                      <th className="p-2 border-r border-slate-200 text-right">GST %</th>
                      <th className="p-2 text-right">Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {selectedInvoiceOrder.items.map((it: WholesaleOrderItem, idx: number) => (
                      <tr key={idx}>
                        <td className="p-2 border-r border-slate-200 text-slate-500">{idx + 1}</td>
                        <td className="p-2 border-r border-slate-200 font-bold text-slate-800">
                          {it.productName}
                        </td>
                        <td className="p-2 border-r border-slate-200 font-mono text-slate-600">{it.hsnCode}</td>
                        <td className="p-2 border-r border-slate-200 font-mono text-[11px]">
                          {it.batchNo} · {it.expiryDate}
                        </td>
                        <td className="p-2 border-r border-slate-200 text-right font-bold">{it.qty}</td>
                        <td className="p-2 border-r border-slate-200 text-right">
                          {(it.wholesalePricePaise / 100).toFixed(2)}
                        </td>
                        <td className="p-2 border-r border-slate-200 text-right font-mono">{it.gstRate}%</td>
                        <td className="p-2 text-right font-bold">
                          {(it.taxableAmountPaise / 100).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals Breakdown */}
              <div className="flex justify-between items-start text-xs pt-2">
                <div className="max-w-xs space-y-1 text-[11px] text-slate-500">
                  <p className="font-bold text-slate-700">Bank Details for Wire Transfer:</p>
                  <p>Bank: State Bank of India (SBI), Agartala Main Branch</p>
                  <p>A/C No: 3948291039482 · IFSC: SBIN0000016</p>
                  <p className="italic text-slate-400">
                    Subject to Tripura Jurisdiction. E. &amp; O.E.
                  </p>
                </div>

                <div className="w-64 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Taxable Subtotal:</span>
                    <strong className="text-slate-900">{formatPaiseToInr(selectedInvoiceOrder.subtotalPaise)}</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Total GST Amount:</span>
                    <strong className="text-slate-900">{formatPaiseToInr(selectedInvoiceOrder.taxTotalPaise)}</strong>
                  </div>
                  <div className="flex justify-between font-black text-sm pt-2 border-t border-slate-300 text-[#0A1B8F]">
                    <span>Total Invoice Value:</span>
                    <span>{formatPaiseToInr(selectedInvoiceOrder.grandTotalPaise)}</span>
                  </div>
                </div>
              </div>

              {/* Signatures */}
              <div className="flex justify-between items-end pt-8 text-[11px]">
                <div className="text-slate-400">
                  <span>Prepared by: Pharmacist In-Charge</span>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-800">For Eastern Biochemicals Private Limited</p>
                  <div className="h-12 flex items-center justify-end">
                    <span className="font-serif italic text-slate-400">[Digital Signatory Stamp]</span>
                  </div>
                  <p className="text-slate-500 font-semibold">Authorised Signatory</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
