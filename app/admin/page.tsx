"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  TrendingUp,
  ShoppingBag,
  Package,
  AlertTriangle,
  Receipt,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Truck,
  ArrowRight,
} from "lucide-react";
import { dataStore } from "@/lib/data-store";
import { formatPaiseToInr } from "@/lib/gst";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import { subDays, format, isAfter, startOfDay, endOfDay, subMonths, subYears } from "date-fns";

function formatInrClean(paise: number): string {
  const rs = Math.round(paise / 100);
  return `\u20B9${rs.toLocaleString("en-IN")}`;
}

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState(() => dataStore.getOrders());
  const [products, setProducts] = useState(() => dataStore.getProducts());
  const [expenses, setExpenses] = useState(() => dataStore.getExpenses());
  const [wholesaleOrders, setWholesaleOrders] = useState(() => dataStore.getWholesaleOrders());

  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">("month");

  useEffect(() => {
    setOrders(dataStore.getOrders());
    setProducts(dataStore.getProducts());
    setExpenses(dataStore.getExpenses());
    setWholesaleOrders(dataStore.getWholesaleOrders());

    const unsub = dataStore.subscribe(() => {
      setOrders([...dataStore.getOrders()]);
      setProducts([...dataStore.getProducts()]);
      setExpenses([...dataStore.getExpenses()]);
      setWholesaleOrders([...dataStore.getWholesaleOrders()]);
    });
    return unsub;
  }, []);

  // KPI Calculations (Strictly consolidated with /admin/reports)
  const retailGrossPaise = orders.reduce((sum, o) => sum + o.grandTotal, 0);
  const retailCancelledPaise = orders
    .filter((o) => o.status === "CANCELLED")
    .reduce((sum, o) => sum + o.grandTotal, 0);
  const retailNetPaise = retailGrossPaise - retailCancelledPaise;

  const wholesaleGrossPaise = wholesaleOrders.reduce((sum, o) => sum + o.grandTotalPaise, 0);
  const wholesaleCancelledPaise = wholesaleOrders
    .filter((o) => o.status === "CANCELLED")
    .reduce((sum, o) => sum + o.grandTotalPaise, 0);
  const wholesaleNetPaise = wholesaleGrossPaise - wholesaleCancelledPaise;

  const totalGrossTurnoverPaise = retailGrossPaise + wholesaleGrossPaise;
  const totalNetTurnoverPaise = retailNetPaise + wholesaleNetPaise;

  const totalRetailOrdersCount = orders.length;
  const totalWholesaleConsignments = wholesaleOrders.length;

  const wholesaleProfitPaise = wholesaleOrders
    .filter((o) => o.status !== "CANCELLED")
    .reduce((sum, o) => sum + (o.totalProfitPaise || 0), 0);
  const retailMarginPaise = Math.round(retailNetPaise * 0.40); // 40% gross retail margin
  const totalExpensesPaise = expenses.reduce((sum, e) => sum + e.amountPaise, 0);
  const totalNetOperatingProfitPaise = retailMarginPaise + wholesaleProfitPaise - totalExpensesPaise;

  // Real Low Stock Products matching admin criteria
  const lowStockProducts = products.filter((p) => p.stockAvailable <= (p.reorderLevel ?? 25));

  const pendingOrders = orders.filter(
    (o) => o.status === "CONFIRMED" || o.status === "PENDING_PAYMENT"
  );

  // --- Real-Time Analytics Calculations ---
  const { chartData, channelData, topProducts } = useMemo(() => {
    let startDate = new Date();
    if (timeRange === "week") startDate = subDays(new Date(), 7);
    if (timeRange === "month") startDate = subMonths(new Date(), 1);
    if (timeRange === "year") startDate = subYears(new Date(), 1);
    
    // Revenue Dynamics (Area Chart)
    const daysCount = timeRange === "week" ? 7 : timeRange === "month" ? 30 : 12;
    const chartData = [];
    
    if (timeRange === "year") {
      // Group by month
      for (let i = 11; i >= 0; i--) {
        const d = subMonths(new Date(), i);
        const monthStart = new Date(d.getFullYear(), d.getMonth(), 1).getTime();
        const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999).getTime();
        
        const retailM = orders.filter(o => {
          if (o.status === "CANCELLED") return false;
          const t = new Date(o.placedAt).getTime();
          return t >= monthStart && t <= monthEnd;
        }).reduce((sum, o) => sum + o.grandTotal, 0);

        const wholesaleM = wholesaleOrders.filter(o => {
          if (o.status === "CANCELLED") return false;
          const t = new Date(o.createdAt || o.orderDate).getTime();
          return t >= monthStart && t <= monthEnd;
        }).reduce((sum, o) => sum + o.grandTotalPaise, 0);

        chartData.push({
          name: format(d, "MMM"),
          retail: retailM / 100,
          wholesale: wholesaleM / 100,
        });
      }
    } else {
      // Group by day
      for (let i = daysCount - 1; i >= 0; i--) {
        const d = subDays(new Date(), i);
        const dayStart = startOfDay(d).getTime();
        const dayEnd = endOfDay(d).getTime();

        const retailD = orders.filter(o => {
          if (o.status === "CANCELLED") return false;
          const t = new Date(o.placedAt).getTime();
          return t >= dayStart && t <= dayEnd;
        }).reduce((sum, o) => sum + o.grandTotal, 0);

        const wholesaleD = wholesaleOrders.filter(o => {
          if (o.status === "CANCELLED") return false;
          const t = new Date(o.createdAt || o.orderDate).getTime();
          return t >= dayStart && t <= dayEnd;
        }).reduce((sum, o) => sum + o.grandTotalPaise, 0);

        chartData.push({
          name: format(d, "dd MMM"),
          retail: retailD / 100,
          wholesale: wholesaleD / 100,
        });
      }
    }

    // Channel Performance (Pie Chart)
    const channelData = [
      { name: "Retail (B2C)", value: retailNetPaise / 100 },
      { name: "Wholesale (B2B)", value: wholesaleNetPaise / 100 },
    ];

    // Top Products Ranking
    const prodStats: Record<string, { name: string; revenue: number; qty: number }> = {};
    orders.forEach(o => {
      if (o.status === "CANCELLED") return;
      o.items.forEach(i => {
        if (!prodStats[i.productId]) prodStats[i.productId] = { name: i.nameSnapshot, revenue: 0, qty: 0 };
        prodStats[i.productId].revenue += i.lineTotal;
        prodStats[i.productId].qty += i.qty;
      });
    });
    wholesaleOrders.forEach(o => {
      if (o.status === "CANCELLED") return;
      o.items.forEach(i => {
        if (!prodStats[i.productId]) prodStats[i.productId] = { name: i.productName, revenue: 0, qty: 0 };
        prodStats[i.productId].revenue += i.totalPaise;
        prodStats[i.productId].qty += i.qty;
      });
    });
    const topProducts = Object.values(prodStats)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    return { chartData, channelData, topProducts };
  }, [orders, wholesaleOrders, timeRange, retailNetPaise, wholesaleNetPaise]);

  const PIE_COLORS = ["#0A1B8F", "#E01B47"];

  return (
    <div className="space-y-8">
      {/* Page Title & Time Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Executive Overview
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time business performance, inventory health, and fulfillment pipeline.
          </p>
        </div>

        {/* Time Filter Toggle */}
        <div className="flex bg-slate-200/80 p-1 rounded-xl text-xs font-bold self-start sm:self-auto">
          <button
            onClick={() => setTimeRange("week")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              timeRange === "week" ? "bg-white text-[#0A1B8F] shadow-xs" : "text-slate-600"
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setTimeRange("month")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              timeRange === "month" ? "bg-white text-[#0A1B8F] shadow-xs" : "text-slate-600"
            }`}
          >
            This Month
          </button>
          <button
            onClick={() => setTimeRange("year")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              timeRange === "year" ? "bg-white text-[#0A1B8F] shadow-xs" : "text-slate-600"
            }`}
          >
            This Year (FY 26-27)
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Gross Combined Turnover */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Gross Turnover</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0A1B8F] flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 truncate" title={formatPaiseToInr(totalGrossTurnoverPaise)}>
            {formatInrClean(totalGrossTurnoverPaise)}
          </div>
          <span className="text-[10px] text-slate-500 font-medium flex items-center gap-0.5 mt-2 truncate">
            Retail: {formatInrClean(retailGrossPaise)} | B2B: {formatInrClean(wholesaleGrossPaise)}
          </span>
        </div>

        {/* Card 2: Orders & Wholesale Consignments */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Orders & B2B</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-[#E01B47] flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {totalRetailOrdersCount + totalWholesaleConsignments}
          </div>
          <span className="text-[10px] text-slate-500 font-medium mt-2 block truncate">
            {totalRetailOrdersCount} Retail Orders · {totalWholesaleConsignments} Wholesale Consignments
          </span>
        </div>

        {/* Card 3: Automated Wholesale Profit */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">Wholesale Profit</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-700 truncate" title={formatPaiseToInr(wholesaleProfitPaise)}>
            {formatInrClean(wholesaleProfitPaise)}
          </div>
          <span className="text-[10px] text-emerald-700 font-bold mt-2 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" /> Auto-calculated margin
          </span>
        </div>

        {/* Card 4: Low Stock Alert (Linked directly to criteria manager) */}
        <Link
          href="/admin/inventory#low-stock-criteria"
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-amber-400 transition-all cursor-pointer block group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider group-hover:text-amber-700 transition-colors">
              Low Stock Criteria Alerts
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {lowStockProducts.length}
          </div>
          <span className="text-[10px] text-amber-600 font-bold mt-2 flex items-center gap-1">
            {lowStockProducts.length === 0
              ? "All SKUs healthy"
              : `${lowStockProducts.length} items below criteria limit →`}
          </span>
        </Link>

        {/* Card 5: Net Operating Profit */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Net P&L Profit</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 truncate" title={formatPaiseToInr(totalNetOperatingProfitPaise)}>
            {formatInrClean(totalNetOperatingProfitPaise)}
          </div>
          <span className="text-[10px] text-slate-500 font-medium mt-2 block truncate">
            Retail Margin + Wholesale Profit - Ops
          </span>
        </div>
      </div>

      {/* Charts Grid: Revenue Dynamics & Channel Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Revenue Dynamics Chart */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4 flex flex-col">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-slate-900">
              Revenue Dynamics ({timeRange.toUpperCase()})
            </h3>
            <span className="text-xs text-slate-400 font-medium">Aggregated Data (₹)</span>
          </div>
          <div className="flex-1 w-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRetail" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0A1B8F" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0A1B8F" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorWholesale" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E01B47" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#E01B47" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: "#64748b" }} 
                  dy={10} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: "#64748b" }} 
                  tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)", fontSize: "12px" }}
                  formatter={(value: any) => [`₹${Number(value || 0).toLocaleString('en-IN')}`, ""]}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                <Area type="monotone" name="Retail (B2C)" dataKey="retail" stroke="#0A1B8F" strokeWidth={3} fillOpacity={1} fill="url(#colorRetail)" />
                <Area type="monotone" name="Wholesale (B2B)" dataKey="wholesale" stroke="#E01B47" strokeWidth={3} fillOpacity={1} fill="url(#colorWholesale)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Channel Performance Pie Chart */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4 flex flex-col">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-slate-900">
              Sales Channels
            </h3>
            <span className="text-xs text-slate-400 font-medium">By Revenue</span>
          </div>
          <div className="flex-1 w-full min-h-[200px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={channelData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {channelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any) => [`₹${Number(value || 0).toLocaleString('en-IN')}`, "Revenue"]}
                  contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)", fontSize: "12px" }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: "11px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="pt-2 border-t border-slate-100 flex justify-between text-xs">
            <div className="text-center">
              <span className="block text-slate-400 font-medium">B2C Retail</span>
              <span className="font-bold text-[#0A1B8F]">{formatInrClean(retailNetPaise)}</span>
            </div>
            <div className="text-center">
              <span className="block text-slate-400 font-medium">B2B Wholesale</span>
              <span className="font-bold text-[#E01B47]">{formatInrClean(wholesaleNetPaise)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Grid Row 2: Top Products & Low Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Top Selling Products */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-slate-900">
              Top Revenue Products
            </h3>
            <Link href="/admin/products" className="text-xs text-[#0A1B8F] font-bold hover:underline">
              View Catalog
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-400 uppercase tracking-wider font-bold border-b border-slate-100">
                <tr>
                  <th className="py-2 px-2">Rank</th>
                  <th className="py-2 px-2">Product Name</th>
                  <th className="py-2 px-2 text-right">Units Sold</th>
                  <th className="py-2 px-2 text-right">Total Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 font-medium">
                {topProducts.map((p, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-3 px-2 text-slate-400 font-bold">#{idx + 1}</td>
                    <td className="py-3 px-2 font-bold text-slate-900 line-clamp-1 max-w-[200px]">{p.name}</td>
                    <td className="py-3 px-2 text-right text-slate-600">{p.qty}</td>
                    <td className="py-3 px-2 text-right font-black text-emerald-700">{formatPaiseToInr(p.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Warning List */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>Inventory Thresholds</span>
            </h3>
            <Link href="/admin/inventory" className="text-xs text-[#0A1B8F] font-bold hover:underline">
              View Batches
            </Link>
          </div>

          <div className="space-y-3">
            {products.slice(0, 4).map((p) => {
              const isLow = p.stockAvailable <= p.reorderLevel;
              return (
                <div
                  key={p.id}
                  className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                >
                  <div>
                    <h5 className="font-bold text-slate-900 line-clamp-1 max-w-[140px]">{p.name}</h5>
                    <span className="text-[10px] text-slate-400">SKU: {p.sku}</span>
                  </div>
                  <div className="text-right">
                    <span
                      className={`font-black block ${
                        isLow ? "text-amber-600" : "text-emerald-700"
                      }`}
                    >
                      {p.stockAvailable} units
                    </span>
                    <span className="text-[10px] text-slate-400">Reorder at {p.reorderLevel}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <Link
            href="/admin/wholesale"
            className="block w-full text-center bg-[#0A1B8F] hover:bg-[#1527ab] text-white py-2.5 rounded-full text-xs font-bold transition-all shadow-xs"
          >
            Dispatch Wholesale Consignment
          </Link>
        </div>
      </div>

      {/* Recent Orders Action Queue */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base text-slate-900">
              Orders Queue ({orders.length})
            </h3>
            <p className="text-xs text-slate-500">Live order status, invoice generation & dispatch</p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-bold text-[#0A1B8F] hover:underline inline-flex items-center gap-1"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Order No</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Destination</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {orders.slice(0, 5).map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">{ord.orderNo}</td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 block">{ord.customerName}</span>
                    <span className="text-[10px] text-slate-400">{ord.customerPhone}</span>
                  </td>
                  <td className="py-3 px-4">
                    {ord.shippingAddress.city}, {ord.shippingAddress.state}
                  </td>
                  <td className="py-3 px-4">
                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold">
                      {ord.paymentMethod}
                    </span>
                  </td>
                  <td className="py-3 px-4">
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
                  <td className="py-3 px-4 font-black text-slate-900">
                    {formatPaiseToInr(ord.grandTotal)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      href={`/admin/orders?highlight=${ord.orderNo}`}
                      className="text-[#0A1B8F] font-bold hover:underline"
                    >
                      Manage →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
