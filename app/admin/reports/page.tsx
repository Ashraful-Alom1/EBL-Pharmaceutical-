"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Download,
  BarChart3,
  TrendingUp,
  Truck,
  ShoppingBag,
  Package,
  Activity,
  TrendingDown,
  Filter,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import { dataStore } from "@/lib/data-store";
import { formatPaiseToInr } from "@/lib/gst";
import type { Order, Expense, WholesaleOrder, WholesaleOrderItem, Product, Wholesaler } from "@/lib/types";


function formatInrClean(paise: number): string {
  const rs = Math.round(paise / 100);
  return `\u20B9${rs.toLocaleString("en-IN")}`;
}

interface KpiCardProps {
  label: string;
  value: string;
  fullValue?: string;
  sub?: string;
  color?: "blue" | "coral" | "green" | "amber" | "slate";
  icon?: any;
}
function KpiCard({ label, value, fullValue, sub, color = "blue", icon: Icon }: KpiCardProps) {
  const clrMap: Record<string, string> = {
    blue: "text-[#5C93B3]",
    coral: "text-[#EB6B56]",
    green: "text-emerald-700",
    amber: "text-amber-600",
    slate: "text-slate-700",
  };
  const bgMap: Record<string, string> = {
    blue: "bg-sky-50 text-[#5C93B3]",
    coral: "bg-rose-50 text-[#EB6B56]",
    green: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-600",
    slate: "bg-slate-100 text-slate-700",
  };
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-3.5 sm:p-4 flex flex-col justify-between overflow-hidden">
      <div className="flex items-center justify-between mb-2 gap-1">
        <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 truncate" title={label}>{label}</span>
        {Icon && (
          <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg ${bgMap[color]} flex items-center justify-center shrink-0`}>
            <Icon className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
          </div>
        )}
      </div>
      <div className="min-w-0">
        <div
          title={fullValue || value}
          className={`text-base sm:text-lg xl:text-xl font-black ${clrMap[color]} tracking-tight leading-tight truncate`}
        >
          {value}
        </div>
        {sub && <span className="text-[10px] text-slate-400 font-medium mt-1 truncate block" title={sub}>{sub}</span>}
      </div>
    </div>
  );
}

export default function AdminReportsPage() {
  const [range, setRange] = useState<"week" | "month" | "year" | "all">("year");
  const [channelFilter, setChannelFilter] = useState<"all" | "retail" | "wholesale">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const [orders, setOrders] = useState<Order[]>(() =>
    typeof window !== "undefined" ? dataStore.getOrders() : []
  );
  const [wholesaleOrders, setWholesaleOrders] = useState<WholesaleOrder[]>(() =>
    typeof window !== "undefined" ? dataStore.getWholesaleOrders() : []
  );
  const [wholesalers, setWholesalers] = useState<Wholesaler[]>(() =>
    typeof window !== "undefined" ? dataStore.getWholesalers() : []
  );
  const [expenses, setExpenses] = useState<Expense[]>(() =>
    typeof window !== "undefined" ? dataStore.getExpenses() : []
  );
  const [products, setProducts] = useState<Product[]>(() =>
    typeof window !== "undefined" ? dataStore.getProducts() : []
  );

  useEffect(() => {
    const sync = () => {
      setOrders([...dataStore.getOrders()]);
      setWholesaleOrders([...dataStore.getWholesaleOrders()]);
      setWholesalers([...dataStore.getWholesalers()]);
      setExpenses([...dataStore.getExpenses()]);
      setProducts([...dataStore.getProducts()]);
    };
    sync();
    return dataStore.subscribe(sync);
  }, []);

  // Map wholesalers for fast channelType lookup
  const wholesalersMap = useMemo(() => {
    const map: Record<string, Wholesaler> = {};
    wholesalers.forEach((w) => {
      map[w.id] = w;
    });
    return map;
  }, [wholesalers]);

  // Date Filtering Boundaries
  const { rangeStart, rangeEnd } = useMemo(() => {
    const now = new Date();
    if (range === "week") {
      const day = now.getDay();
      const diffToMon = (day === 0 ? -6 : 1) - day;
      const mon = new Date(now);
      mon.setDate(now.getDate() + diffToMon);
      mon.setHours(0, 0, 0, 0);
      const sun = new Date(mon);
      sun.setDate(mon.getDate() + 6);
      sun.setHours(23, 59, 59, 999);
      return {
        rangeStart: mon,
        rangeEnd: sun,
      };
    }
    if (range === "month") {
      return {
        rangeStart: new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0),
        rangeEnd: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999),
      };
    }
    if (range === "year") {
      // FY 26-27 (From April 1, 2026 to March 31, 2027)
      return {
        rangeStart: new Date(2026, 3, 1, 0, 0, 0),
        rangeEnd: new Date(2027, 2, 31, 23, 59, 59),
      };
    }
    // "all"
    return {
      rangeStart: new Date(2020, 0, 1),
      rangeEnd: new Date(2030, 11, 31),
    };
  }, [range]);

  const inRange = (d: string) => {
    const t = new Date(d).getTime();
    return t >= rangeStart.getTime() && t <= rangeEnd.getTime();
  };

  // Base Date-filtered records
  const dateOrders = useMemo(() => orders.filter((o) => inRange(o.placedAt)), [orders, rangeStart, rangeEnd]);
  const dateWholesale = useMemo(
    () => wholesaleOrders.filter((o) => inRange(o.createdAt || o.orderDate)),
    [wholesaleOrders, rangeStart, rangeEnd]
  );
  const filteredExpenses = useMemo(() => expenses.filter((e) => inRange(e.paidOn)), [expenses, rangeStart, rangeEnd]);

  // Channel & Category filtered records for KPI & charts
  const filteredOrders = useMemo(() => {
    if (channelFilter === "wholesale") return [];
    if (categoryFilter === "all") return dateOrders;
    return dateOrders.filter((o) =>
      o.items.some((it) => {
        const prod = products.find((p) => p.id === it.productId);
        return prod?.categoryId === categoryFilter;
      })
    );
  }, [dateOrders, channelFilter, categoryFilter, products]);

  const filteredWholesale = useMemo(() => {
    if (channelFilter === "retail") return [];
    if (categoryFilter === "all") return dateWholesale;
    return dateWholesale.filter((o) =>
      o.items.some((it) => {
        const prod = products.find((p) => p.id === it.productId);
        return prod?.categoryId === categoryFilter;
      })
    );
  }, [dateWholesale, channelFilter, categoryFilter, products]);

  // Aggregate Real Metrics
  const retailGross = filteredOrders.reduce((s, o) => s + o.grandTotal, 0);
  const retailCancelled = filteredOrders
    .filter((o) => o.status === "CANCELLED")
    .reduce((s, o) => s + o.grandTotal, 0);
  const retailNet = retailGross - retailCancelled;
  const retailTax = filteredOrders.reduce((s, o) => s + o.taxTotal, 0);
  const retailTaxable = retailGross - retailTax;
  const retailUnits = filteredOrders
    .filter((o) => o.status !== "CANCELLED")
    .reduce((s, o) => s + o.items.reduce((si, i) => si + i.qty, 0), 0);
  const retailAOV =
    filteredOrders.filter((o) => o.status !== "CANCELLED").length > 0
      ? Math.round(retailNet / filteredOrders.filter((o) => o.status !== "CANCELLED").length)
      : 0;

  const wsGross = filteredWholesale.reduce((s, o) => s + o.grandTotalPaise, 0);
  const wsCancelled = filteredWholesale
    .filter((o) => o.status === "CANCELLED")
    .reduce((s, o) => s + o.grandTotalPaise, 0);
  const wsNet = wsGross - wsCancelled;
  const wsTax = filteredWholesale
    .filter((o) => o.status !== "CANCELLED")
    .reduce((s, o) => s + o.taxTotalPaise, 0);
  const wsTaxable = filteredWholesale
    .filter((o) => o.status !== "CANCELLED")
    .reduce((s, o) => s + o.subtotalPaise, 0);
  const wsProfit = filteredWholesale
    .filter((o) => o.status !== "CANCELLED")
    .reduce((s, o) => s + (o.totalProfitPaise || 0), 0);
  const wsUnits = filteredWholesale
    .filter((o) => o.status !== "CANCELLED")
    .reduce((s, o) => s + o.items.reduce((si, i: WholesaleOrderItem) => si + i.qty, 0), 0);

  const totalGross = retailGross + wsGross;
  const totalNet = retailNet + wsNet;
  const totalTax = retailTax + wsTax;
  const totalTaxable = retailTaxable + wsTaxable;
  const totalExp = filteredExpenses.reduce((s, e) => s + e.amountPaise, 0);
  const netProfit = Math.round(retailNet * 0.4) + wsProfit - totalExp;


  // GSTR-1 Tax Rate Summary
  const gstrSlabs = useMemo(() => {
    const slabs: Record<number, { taxable: number; cgst: number; sgst: number; igst: number }> = {};

    filteredOrders.forEach((o) => {
      if (o.status === "CANCELLED") return;
      o.items.forEach((it) => {
        const r = it.gstRate || 0;
        if (!slabs[r]) slabs[r] = { taxable: 0, cgst: 0, sgst: 0, igst: 0 };
        slabs[r].taxable += it.taxableValue;
        slabs[r].cgst += it.cgst;
        slabs[r].sgst += it.sgst;
        slabs[r].igst += it.igst;
      });
    });

    filteredWholesale.forEach((o) => {
      if (o.status === "CANCELLED") return;
      o.items.forEach((it: WholesaleOrderItem) => {
        const r = it.gstRate || 0;
        if (!slabs[r]) slabs[r] = { taxable: 0, cgst: 0, sgst: 0, igst: 0 };
        slabs[r].taxable += it.taxableAmountPaise;
        slabs[r].cgst += it.cgstPaise;
        slabs[r].sgst += it.sgstPaise;
        slabs[r].igst += it.igstPaise;
      });
    });

    return Object.entries(slabs)
      .map(([rate, v]) => ({
        rate: Number(rate),
        ...v,
        total: v.cgst + v.sgst + v.igst,
      }))
      .sort((a, b) => a.rate - b.rate);
  }, [filteredOrders, filteredWholesale]);

  const totalGSTR1Tax = gstrSlabs.reduce((s, sl) => s + sl.total, 0);

  // CSV Export
  const exportToCSV = () => {
    const hdr = [
      "Channel",
      "Invoice/Order No",
      "Date",
      "Party/Customer",
      "State",
      "Taxable Value (Paise)",
      "Tax GST (Paise)",
      "Grand Total (Paise)",
      "Profit (Paise)",
      "Status",
    ];
    const rRows = filteredOrders.map((o) => [
      "Retail B2C",
      o.orderNo,
      o.placedAt.slice(0, 10),
      `"${o.customerName}"`,
      `"${o.shippingAddress.state}"`,
      (o.grandTotal - o.taxTotal).toString(),
      o.taxTotal.toString(),
      o.grandTotal.toString(),
      Math.round(o.grandTotal * 0.4).toString(),
      o.status,
    ]);
    const wRows = filteredWholesale.map((w) => [
      "Wholesale B2B",
      w.invoiceNo,
      w.orderDate,
      `"${w.wholesalerName}"`,
      `"${w.wholesalerState || "Tripura"}"`,
      w.subtotalPaise.toString(),
      w.taxTotalPaise.toString(),
      w.grandTotalPaise.toString(),
      w.totalProfitPaise.toString(),
      w.status,
    ]);
    const csv =
      "data:text/csv;charset=utf-8," +
      [hdr.join(","), ...[...rRows, ...wRows].map((r) => r.join(","))].join("\n");
    const a = document.createElement("a");
    a.href = encodeURI(csv);
    a.download = `EBL_Sales_Analytics_${range.toUpperCase()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* ===== PAGE HEADER & ACTION CONTROLS ===== */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Financial &amp; GST Reports (Consolidated)
            </h1>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              Live Database
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-3xl">
            Live pharmaceutical business analytics dashboard with gross vs net sales tracking,
            multichannel performance, wholesale B2B distributor profit allocations, and statutory GSTR-1 compliance.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Time Range Filter Toggle */}
          <div className="flex bg-slate-200/90 p-1 rounded-xl text-xs font-bold shadow-2xs">
            {(
              [
                { id: "week", label: "This Week" },
                { id: "month", label: "This Month" },
                { id: "year", label: "FY 26-27" },
                { id: "all", label: "All Time" },
              ] as const
            ).map((r) => (
              <button
                key={r.id}
                onClick={() => setRange(r.id)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  range === r.id
                    ? "bg-white text-[#0A1B8F] shadow-xs font-black"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          {/* Channel Filter Toggle */}
          <div className="flex bg-slate-200/90 p-1 rounded-xl text-xs font-bold shadow-2xs">
            {(
              [
                { id: "all", label: "All Channels" },
                { id: "retail", label: "Retail (B2C)" },
                { id: "wholesale", label: "Wholesale (B2B)" },
              ] as const
            ).map((ch) => (
              <button
                key={ch.id}
                onClick={() => setChannelFilter(ch.id)}
                className={`px-2.5 py-1.5 rounded-lg transition-all ${
                  channelFilter === ch.id
                    ? "bg-[#0A1B8F] text-white shadow-xs font-black"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {ch.label}
              </button>
            ))}
          </div>

          <button
            onClick={exportToCSV}
            className="bg-[#0A1B8F] hover:bg-[#12249e] text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* ===== EXECUTIVE KPI CARDS ===== */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
        <KpiCard
          label="Gross Sales"
          value={formatInrClean(totalGross)}
          fullValue={formatPaiseToInr(totalGross)}
          icon={TrendingUp}
          color="coral"
          sub="Retail + Wholesale"
        />
        <KpiCard
          label="Net Sales"
          value={formatInrClean(totalNet)}
          fullValue={formatPaiseToInr(totalNet)}
          icon={TrendingDown}
          color="blue"
          sub="Excl. cancellations"
        />
        <KpiCard
          label="Total Orders"
          value={String(filteredOrders.length + filteredWholesale.length)}
          icon={ShoppingBag}
          color="slate"
          sub={`${filteredOrders.length} retail · ${filteredWholesale.length} B2B`}
        />
        <KpiCard
          label="Units Sold"
          value={String(retailUnits + wsUnits)}
          icon={Package}
          color="slate"
          sub={`${retailUnits} retail · ${wsUnits} B2B`}
        />
        <KpiCard
          label="Avg Order Value"
          value={formatInrClean(retailAOV)}
          fullValue={formatPaiseToInr(retailAOV)}
          icon={BarChart3}
          color="amber"
          sub="Retail orders only"
        />
        <KpiCard
          label="B2B Profit"
          value={formatInrClean(wsProfit)}
          fullValue={formatPaiseToInr(wsProfit)}
          icon={Truck}
          color="green"
          sub="Auto-calculated margin"
        />
        <KpiCard
          label="Net Operating P&L"
          value={formatInrClean(netProfit)}
          fullValue={formatPaiseToInr(netProfit)}
          icon={Activity}
          color={netProfit >= 0 ? "green" : "coral"}
          sub="Margins - expenses"
        />
      </div>


      {/* ========================================================================= */}
      {/* ===== EXISTING SECTION TABLES: WHOLESALE DISTRIBUTION & GSTR-1 TAX ===== */}
      {/* ========================================================================= */}

      {/* Wholesale Distribution & Consignments Profit Allocation Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <Truck className="w-5 h-5 text-[#0A1B8F]" />
              <span>Wholesale Distribution &amp; Profit Allocation</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Live automated profit breakdown across active pharmaceutical distributor consignments
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full shrink-0 self-start sm:self-auto">
            Total B2B Profit: {formatPaiseToInr(wsProfit)}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3">Invoice No</th>
                <th className="p-3">Wholesaler</th>
                <th className="p-3">Channel</th>
                <th className="p-3">State</th>
                <th className="p-3">Units</th>
                <th className="p-3">Grand Total</th>
                <th className="p-3">Profit</th>
                <th className="p-3 text-right">Margin %</th>
                <th className="p-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredWholesale.map((w) => {
                const units = w.items.reduce((s: number, it: WholesaleOrderItem) => s + it.qty, 0);
                const margin =
                  w.grandTotalPaise > 0
                    ? ((w.totalProfitPaise / w.grandTotalPaise) * 100).toFixed(1)
                    : "0.0";
                const ws = wholesalersMap[w.wholesalerId];
                return (
                  <tr key={w.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-3 font-mono font-bold text-slate-900">{w.invoiceNo}</td>
                    <td className="p-3 font-bold text-slate-900">{w.wholesalerName}</td>
                    <td className="p-3 text-slate-600">
                      <span className="bg-blue-50 text-[#0A1B8F] px-2 py-0.5 rounded-md font-semibold text-[10px]">
                        {ws?.channelType || "Wholesalers"}
                      </span>
                    </td>
                    <td className="p-3 text-slate-600">{w.wholesalerState || "Tripura"}</td>
                    <td className="p-3 font-bold text-slate-900">{units}</td>
                    <td className="p-3 font-mono font-bold text-slate-900">
                      {formatPaiseToInr(w.grandTotalPaise)}
                    </td>
                    <td className="p-3 font-mono font-bold text-emerald-700">
                      +{formatPaiseToInr(w.totalProfitPaise)}
                    </td>
                    <td className="p-3 text-right font-black text-emerald-700">{margin}%</td>
                    <td className="p-3 text-center">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          w.status === "DELIVERED"
                            ? "bg-emerald-100 text-emerald-800"
                            : w.status === "CONFIRMED"
                            ? "bg-blue-100 text-blue-800"
                            : w.status === "CANCELLED"
                            ? "bg-rose-100 text-rose-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {w.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {filteredWholesale.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center py-8 text-slate-400">
                    No wholesale consignments found for the selected criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Statutory GSTR-1 Tax Rate Summary Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-extrabold text-base text-slate-900">
              GSTR-1 Tax Rate Summary (Statutory Return Format)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Consolidated outward taxable supplies — computed from actual GST rates on every retail and wholesale B2B line item
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full shrink-0 self-start sm:self-auto">
            Total GST: {formatPaiseToInr(totalGSTR1Tax)}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3">GST Rate Slab</th>
                <th className="p-3 font-mono">Taxable Value</th>
                <th className="p-3 font-mono">CGST</th>
                <th className="p-3 font-mono">SGST</th>
                <th className="p-3 font-mono">IGST</th>
                <th className="p-3 font-mono text-right">Total Tax Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {gstrSlabs.length > 0 ? (
                gstrSlabs.map((sl) => (
                  <tr key={sl.rate} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-3 font-bold text-slate-900">{sl.rate}% GST</td>
                    <td className="p-3 font-mono">{formatPaiseToInr(sl.taxable)}</td>
                    <td className="p-3 font-mono">{formatPaiseToInr(sl.cgst)}</td>
                    <td className="p-3 font-mono">{formatPaiseToInr(sl.sgst)}</td>
                    <td className="p-3 font-mono">{formatPaiseToInr(sl.igst)}</td>
                    <td className="p-3 font-mono text-right font-black text-slate-900">
                      {formatPaiseToInr(sl.total)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-3 text-center text-slate-400">
                    No taxable transactions recorded in the selected period.
                  </td>
                </tr>
              )}
              {gstrSlabs.length > 0 && (
                <tr className="bg-slate-50 font-black text-slate-900 border-t-2 border-slate-200">
                  <td className="p-3">Total Consolidated Outward Supplies</td>
                  <td className="p-3 font-mono">
                    {formatPaiseToInr(gstrSlabs.reduce((s, sl) => s + sl.taxable, 0))}
                  </td>
                  <td className="p-3 font-mono">
                    {formatPaiseToInr(gstrSlabs.reduce((s, sl) => s + sl.cgst, 0))}
                  </td>
                  <td className="p-3 font-mono">
                    {formatPaiseToInr(gstrSlabs.reduce((s, sl) => s + sl.sgst, 0))}
                  </td>
                  <td className="p-3 font-mono">
                    {formatPaiseToInr(gstrSlabs.reduce((s, sl) => s + sl.igst, 0))}
                  </td>
                  <td className="p-3 font-mono text-right text-[#0A1B8F]">
                    {formatPaiseToInr(totalGSTR1Tax)}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
