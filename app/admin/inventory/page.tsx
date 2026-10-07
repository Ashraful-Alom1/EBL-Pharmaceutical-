"use client";

import React, { useState, useEffect } from "react";
import {
  Layers,
  Plus,
  Minus,
  AlertTriangle,
  CheckCircle2,
  Search,
  Trash2,
  X,
  ShieldAlert,
  Bell,
  Save,
  Sliders,
  Sparkles,
  ArrowRight,
  Database,
} from "lucide-react";
import { dataStore, InventoryBatch } from "@/lib/data-store";
import { formatPaiseToInr } from "@/lib/gst";
import type { Product } from "@/lib/types";

export default function AdminInventoryPage() {
  const [batches, setBatches] = useState<InventoryBatch[]>([]);
  const [products, setProducts] = useState<Product[]>(() => dataStore.getProducts());
  const [adjustBatchId, setAdjustBatchId] = useState<string | null>(null);
  const [adjustAmount, setAdjustAmount] = useState<string>("10");
  const [isAdding, setIsAdding] = useState(true);
  const [isAddBatchModalOpen, setIsAddBatchModalOpen] = useState(false);

  // Criteria Management State
  const [criteriaMap, setCriteriaMap] = useState<Record<string, { reorderLevel: number; maxLevel?: number }>>({});
  const [savedSuccessId, setSavedSuccessId] = useState<string | null>(null);
  const [globalThresholdInput, setGlobalThresholdInput] = useState<string>("30");
  const [globalSavedToast, setGlobalSavedToast] = useState(false);
  const [productSearch, setProductSearch] = useState("");

  // New batch form state
  const [newProductId, setNewProductId] = useState(products[0]?.id || "");
  const [newBatchNo, setNewBatchNo] = useState("");
  const [newExpiryDate, setNewExpiryDate] = useState("2029-12-31");
  const [newQty, setNewQty] = useState("100");
  const [newUnitCostInr, setNewUnitCostInr] = useState("85");

  useEffect(() => {
    setBatches(dataStore.getBatches());
    setProducts(dataStore.getProducts());

    // Initialize local criteria map from products
    const initialMap: Record<string, { reorderLevel: number; maxLevel?: number }> = {};
    dataStore.getProducts().forEach((p) => {
      initialMap[p.id] = {
        reorderLevel: p.reorderLevel ?? 25,
        maxLevel: p.maxLevel ?? 200,
      };
    });
    setCriteriaMap(initialMap);

    const unsub = dataStore.subscribe(() => {
      setBatches([...dataStore.getBatches()]);
      setProducts([...dataStore.getProducts()]);
    });
    return unsub;
  }, []);

  const handleAdjust = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustBatchId) return;

    const delta = parseInt(adjustAmount) || 0;
    const finalDelta = isAdding ? delta : -delta;

    dataStore.adjustBatchStock(adjustBatchId, finalDelta);
    setAdjustBatchId(null);
  };

  const handleAddBatch = (e: React.FormEvent) => {
    e.preventDefault();
    const prod = products.find((p) => p.id === newProductId);
    if (!prod) return;

    const costPaise = Math.round(parseFloat(newUnitCostInr) * 100);
    const qtyOnHand = parseInt(newQty) || 0;

    dataStore.addBatch({
      productId: prod.id,
      productName: prod.name,
      batchNo: newBatchNo.toUpperCase().trim(),
      expiryDate: newExpiryDate,
      qtyOnHand,
      costPaise,
    });

    setIsAddBatchModalOpen(false);
    setNewBatchNo("");
  };

  const handleDeleteBatch = (id: string, batchNo: string) => {
    if (confirm(`Are you sure you want to delete batch ${batchNo}?`)) {
      dataStore.deleteBatch(id);
    }
  };

  // Update a single product's criteria with ACID Firebase persistence
  const handleSaveProductCriteria = (productId: string) => {
    const item = criteriaMap[productId];
    if (!item) return;

    dataStore.updateStockAlertCriteria(productId, item.reorderLevel, item.maxLevel);
    setSavedSuccessId(productId);
    setTimeout(() => {
      setSavedSuccessId(null);
    }, 2500);
  };

  // Apply a global criteria threshold across all products with ACID Firebase persistence
  const handleApplyGlobalThreshold = () => {
    const val = parseInt(globalThresholdInput) || 25;
    dataStore.setGlobalStockAlertThreshold(val);

    // Update local state map
    const nextMap: Record<string, { reorderLevel: number; maxLevel?: number }> = {};
    products.forEach((p) => {
      nextMap[p.id] = {
        reorderLevel: val,
        maxLevel: criteriaMap[p.id]?.maxLevel ?? 200,
      };
    });
    setCriteriaMap(nextMap);

    setGlobalSavedToast(true);
    setTimeout(() => setGlobalSavedToast(false), 3000);
  };

  // Quick shortcut from alert card to open add batch modal for that product
  const handleQuickRestock = (productId: string) => {
    setNewProductId(productId);
    const prod = products.find((p) => p.id === productId);
    if (prod) {
      setNewBatchNo(`EB-${prod.sku.slice(0, 4)}-${Date.now().toString().slice(-3)}`);
    }
    setIsAddBatchModalOpen(true);
  };

  // Active Low Stock Items based on admin-defined criteria
  const lowStockAlerts = products.filter(
    (p) => p.stockAvailable <= (p.reorderLevel ?? 25)
  );
  const outOfStockItems = products.filter((p) => p.stockAvailable === 0);

  const filteredProductsForCriteria = products.filter((p) => {
    if (!productSearch.trim()) return true;
    const q = productSearch.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      p.categoryName?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Inventory &amp; Low Stock Control
            </h1>
            <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
              <Database className="w-2.5 h-2.5" />
              Firebase RTDB Synced
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manual criteria configuration for low stock triggers, FEFO batch allocations, and ACID-guaranteed ledger persistence.
          </p>
        </div>

        <button
          onClick={() => setIsAddBatchModalOpen(true)}
          className="bg-[#0A1B8F] hover:bg-[#1527ab] text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-2 self-start sm:self-auto transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Batch</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* ===== 1. LOW STOCK ALERT SECTION (ADMIN CONFIGURABLE CRITERIA) ===== */}
      {/* ========================================================================= */}
      <div id="low-stock-criteria" className="space-y-6">
        {/* Active Alert Notification Card */}
        <div
          className={`rounded-3xl border p-5 sm:p-6 transition-all ${
            lowStockAlerts.length > 0
              ? "bg-rose-50/70 border-rose-200/90 shadow-2xs"
              : "bg-emerald-50/60 border-emerald-200/80"
          }`}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/60">
            <div className="flex items-start gap-3">
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                  lowStockAlerts.length > 0
                    ? "bg-rose-600 text-white shadow-xs"
                    : "bg-emerald-600 text-white"
                }`}
              >
                {lowStockAlerts.length > 0 ? (
                  <ShieldAlert className="w-5 h-5 animate-pulse" />
                ) : (
                  <CheckCircle2 className="w-5 h-5" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black text-slate-900 tracking-tight">
                    {lowStockAlerts.length > 0
                      ? `Low Stock Alerts Active (${lowStockAlerts.length} Products Triggered)`
                      : "Stock Health Normal — 0 Products Below Threshold"}
                  </h2>
                  {outOfStockItems.length > 0 && (
                    <span className="bg-red-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-md">
                      {outOfStockItems.length} Out of Stock
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  Formulations below their configured threshold trigger instant operational notices. Criteria is managed below.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start md:self-auto text-xs font-bold">
              <span className="bg-white/80 border border-slate-200 px-3 py-1.5 rounded-xl text-slate-700">
                Monitored: <span className="font-black text-slate-900">{products.length}</span>
              </span>
              <span className="bg-white/80 border border-slate-200 px-3 py-1.5 rounded-xl text-emerald-700">
                Healthy:{" "}
                <span className="font-black">
                  {products.length - lowStockAlerts.length}
                </span>
              </span>
            </div>
          </div>

          {/* Alert Products List */}
          {lowStockAlerts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-4">
              {lowStockAlerts.map((prod) => {
                const isOutOfStock = prod.stockAvailable === 0;
                return (
                  <div
                    key={prod.id}
                    className="bg-white rounded-2xl border border-rose-200 p-4 shadow-2xs flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-mono text-[10px] font-bold text-slate-400">
                          {prod.sku}
                        </span>
                        <span
                          className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                            isOutOfStock
                              ? "bg-red-600 text-white"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {isOutOfStock ? "CRITICAL (0 UNITS)" : "LOW STOCK"}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-2">
                        {prod.name}
                      </h4>
                      <div className="text-[11px] text-slate-500 mt-1">
                        Category: <span className="font-medium text-slate-700">{prod.categoryName}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase">
                          Current Stock
                        </div>
                        <div
                          className={`text-base font-black ${
                            isOutOfStock ? "text-red-600" : "text-amber-600"
                          }`}
                        >
                          {prod.stockAvailable} units
                        </div>
                        <div className="text-[10px] text-slate-500 font-medium">
                          Alert criteria: &le; {prod.reorderLevel ?? 25} units
                        </div>
                      </div>

                      <button
                        onClick={() => handleQuickRestock(prod.id)}
                        className="bg-[#0A1B8F] hover:bg-[#1527ab] text-white text-[11px] font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-2xs transition-all cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Restock</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="pt-3 text-xs text-emerald-800 font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                All pharmaceutical formulations maintain stock levels exceeding their configured safety thresholds.
              </span>
            </div>
          )}
        </div>

        {/* Criteria Management Panel */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-[#0A1B8F]" />
                <h3 className="text-base font-black text-slate-900 tracking-tight">
                  Manually Configure Alert Criteria &amp; Thresholds
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Set custom trigger quantities per formulation. The system triggers visual warnings and badges whenever inventory &le; configured criteria limit.
              </p>
            </div>

            {/* Global Threshold Quick Apply */}
            <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-200 self-start lg:self-auto">
              <span className="text-xs font-bold text-slate-700 pl-1">
                Global Criteria:
              </span>
              <input
                type="number"
                min={1}
                max={500}
                value={globalThresholdInput}
                onChange={(e) => setGlobalThresholdInput(e.target.value)}
                className="w-16 px-2 py-1 text-xs font-mono font-bold text-center bg-white border border-slate-200 rounded-lg outline-none focus:border-[#0A1B8F]"
                title="Global low stock threshold units"
              />
              <span className="text-xs text-slate-500">units</span>
              <button
                onClick={handleApplyGlobalThreshold}
                className="bg-[#0A1B8F] hover:bg-[#1527ab] text-white px-3 py-1 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                <span>Apply to All</span>
              </button>
              {globalSavedToast && (
                <span className="text-[11px] font-bold text-emerald-600 px-1 animate-pulse">
                  Saved!
                </span>
              )}
            </div>
          </div>

          {/* Search bar inside criteria manager */}
          <div className="flex items-center justify-between gap-3">
            <div className="relative max-w-sm w-full">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search formulation by name or SKU..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-2 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-[#0A1B8F]"
              />
            </div>
            <span className="text-xs text-slate-400 font-medium">
              Showing {filteredProductsForCriteria.length} of {products.length} products
            </span>
          </div>

          {/* Criteria Table */}
          <div className="overflow-x-auto border border-slate-100 rounded-2xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/90 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Formulation &amp; SKU</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-center">Available Stock</th>
                  <th className="py-3 px-4 text-center">
                    Alert Criteria Limit (Units)
                  </th>
                  <th className="py-3 px-4 text-center">Max Capacity (Units)</th>
                  <th className="py-3 px-4 text-center">Current Status</th>
                  <th className="py-3 px-4 text-right">Save Criteria</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredProductsForCriteria.map((prod) => {
                  const currentCriteria = criteriaMap[prod.id] || {
                    reorderLevel: prod.reorderLevel ?? 25,
                    maxLevel: prod.maxLevel ?? 200,
                  };
                  const isLow = prod.stockAvailable <= currentCriteria.reorderLevel;
                  const isSaved = savedSuccessId === prod.id;

                  return (
                    <tr
                      key={prod.id}
                      className={`hover:bg-slate-50/60 transition-colors ${
                        isLow ? "bg-rose-50/30" : ""
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 line-clamp-1">
                          {prod.name}
                        </div>
                        <div className="font-mono text-[10px] text-slate-400">
                          {prod.sku}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-medium">
                        {prod.categoryName}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`font-black font-mono px-2 py-0.5 rounded-md ${
                            prod.stockAvailable === 0
                              ? "bg-red-100 text-red-700"
                              : isLow
                              ? "bg-amber-100 text-amber-800"
                              : "bg-slate-100 text-slate-800"
                          }`}
                        >
                          {prod.stockAvailable} units
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <input
                            type="number"
                            min={0}
                            max={1000}
                            value={currentCriteria.reorderLevel}
                            onChange={(e) => {
                              const val = Math.max(0, parseInt(e.target.value) || 0);
                              setCriteriaMap({
                                ...criteriaMap,
                                [prod.id]: {
                                  ...currentCriteria,
                                  reorderLevel: val,
                                },
                              });
                            }}
                            className="w-20 px-2 py-1 text-xs text-center font-mono font-bold border border-slate-300 rounded-lg outline-none focus:border-[#0A1B8F] bg-white shadow-2xs"
                          />
                          <span className="text-[10px] text-slate-400 font-bold">
                            units
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <input
                            type="number"
                            min={currentCriteria.reorderLevel}
                            max={5000}
                            value={currentCriteria.maxLevel ?? 200}
                            onChange={(e) => {
                              const val = Math.max(
                                currentCriteria.reorderLevel,
                                parseInt(e.target.value) || 200
                              );
                              setCriteriaMap({
                                ...criteriaMap,
                                [prod.id]: {
                                  ...currentCriteria,
                                  maxLevel: val,
                                },
                              });
                            }}
                            className="w-20 px-2 py-1 text-xs text-center font-mono text-slate-700 border border-slate-200 rounded-lg outline-none focus:border-[#0A1B8F] bg-white"
                          />
                          <span className="text-[10px] text-slate-400">units</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {prod.stockAvailable === 0 ? (
                          <span className="bg-red-600 text-white font-black text-[10px] uppercase px-2 py-0.5 rounded-md">
                            Out of Stock
                          </span>
                        ) : isLow ? (
                          <span className="bg-amber-500 text-white font-black text-[10px] uppercase px-2 py-0.5 rounded-md">
                            Alert Triggered
                          </span>
                        ) : (
                          <span className="bg-emerald-100 text-emerald-800 font-bold text-[10px] uppercase px-2 py-0.5 rounded-md">
                            Normal
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleSaveProductCriteria(prod.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 ml-auto cursor-pointer ${
                            isSaved
                              ? "bg-emerald-600 text-white"
                              : "bg-[#0A1B8F] hover:bg-[#1527ab] text-white"
                          }`}
                        >
                          {isSaved ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Saved</span>
                            </>
                          ) : (
                            <>
                              <Save className="w-3.5 h-3.5" />
                              <span>Save</span>
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ===== 2. FEFO BATCH ALLOCATIONS & INVENTORY LEDGER ===== */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Active Batch Inventory Ledger
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            FEFO (First-Expiry-First-Out) physical stock allocations, batch numbers, and unit valuations.
          </p>
        </div>
      </div>

      {/* Batches Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Batch Number</th>
                <th className="py-3.5 px-4">Associated Product</th>
                <th className="py-3.5 px-4">Expiry Date</th>
                <th className="py-3.5 px-4">Unit Cost</th>
                <th className="py-3.5 px-4">Stock on Hand</th>
                <th className="py-3.5 px-4">Valuation</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {batches.map((batch) => (
                <tr key={batch.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                    {batch.batchNo}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">
                    {batch.productName}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-600">
                    {batch.expiryDate}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700">
                    {formatPaiseToInr(batch.costPaise)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`font-black text-sm ${
                        batch.qtyOnHand < 50 ? "text-amber-600" : "text-emerald-700"
                      }`}
                    >
                      {batch.qtyOnHand} units
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {formatPaiseToInr(batch.costPaise * batch.qtyOnHand)}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setAdjustBatchId(batch.id)}
                        className="text-[#0A1B8F] font-bold hover:underline px-2 py-1 rounded-lg hover:bg-blue-50"
                      >
                        Adjust
                      </button>
                      <button
                        onClick={() => handleDeleteBatch(batch.id, batch.batchNo)}
                        className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                        title="Delete Batch"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {batches.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No inventory batches registered yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adjust Modal */}
      {adjustBatchId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-black text-slate-900">Adjust Batch Stock</h3>
            <p className="text-xs text-slate-500">
              Append an audit movement for incoming GRN or physical inventory write-off.
            </p>

            <form onSubmit={handleAdjust} className="space-y-4">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAdding(true)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                    isAdding
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  + Add Stock
                </button>
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                    !isAdding
                      ? "bg-red-600 text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  - Deduct Stock
                </button>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Quantity</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 outline-none focus:border-[#0A1B8F]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setAdjustBatchId(null)}
                  className="text-xs font-bold text-slate-500 px-4 py-2 hover:bg-slate-100 rounded-full"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#0A1B8F] text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-md hover:bg-[#1527ab] transition-colors"
                >
                  Confirm Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Batch Modal */}
      {isAddBatchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-lg font-black text-slate-900">Add Manufacturing Batch</h3>
              <button
                onClick={() => setIsAddBatchModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddBatch} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Target Product *</label>
                <select
                  value={newProductId}
                  onChange={(e) => setNewProductId(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#0A1B8F] bg-white font-medium"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Batch Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. EB-RF26B"
                  value={newBatchNo}
                  onChange={(e) => setNewBatchNo(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#0A1B8F] font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Expiry Date *</label>
                  <input
                    type="date"
                    required
                    value={newExpiryDate}
                    onChange={(e) => setNewExpiryDate(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#0A1B8F]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Quantity Units *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newQty}
                    onChange={(e) => setNewQty(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#0A1B8F]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Unit Cost (₹) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={newUnitCostInr}
                  onChange={(e) => setNewUnitCostInr(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#0A1B8F]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddBatchModalOpen(false)}
                  className="text-xs font-bold text-slate-500 px-4 py-2 hover:bg-slate-100 rounded-full"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#0A1B8F] text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-md hover:bg-[#1527ab] transition-colors"
                >
                  Save Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
