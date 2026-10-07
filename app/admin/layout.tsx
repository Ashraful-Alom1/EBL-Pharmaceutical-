"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Layers,
  Truck,
  FileText,
  Users,
  Receipt,
  BarChart3,
  Briefcase,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Bell,
  Search,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { COMPANY_INFO } from "@/lib/constants";
import EblLogo from "@/components/store/EblLogo";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // If on login page, don't show admin sidebar/topbar
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Orders & Shipping", href: "/admin/orders", icon: ShoppingBag },
    { name: "Products & Catalog", href: "/admin/products", icon: Package },
    { name: "Wholesale & B2B", href: "/admin/wholesale", icon: Truck },
    { name: "Blog Articles", href: "/admin/blogs", icon: FileText },
    { name: "Store Visuals & Reviews", href: "/admin/visuals", icon: Sparkles },
    { name: "Inventory & Batches", href: "/admin/inventory", icon: Layers },
    { name: "CRM & Leads", href: "/admin/customers", icon: Users },
    { name: "GST Invoices", href: "/admin/invoices", icon: Receipt },
    { name: "Expenses", href: "/admin/expenses", icon: Receipt },
    { name: "Financial & GST Reports (Consolidated)", href: "/admin/reports", icon: BarChart3 },
    { name: "Careers Pipeline", href: "/admin/careers", icon: Briefcase },
    { name: "Company & Store Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex text-slate-800">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-[#0F172A] text-slate-300 flex flex-col justify-between transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div>
          {/* Logo & Header */}
          <div className="h-16 px-6 border-b border-slate-800 flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-2.5">
              <EblLogo className="h-8" variant="dark" showText={false} />
              <div className="flex flex-col">
                <span className="font-extrabold text-white text-xs tracking-wide">
                  EASTERN BIOCHEMICALS
                </span>
                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">
                  ERP Admin Panel
                </span>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-[#0A1B8F] text-white shadow-md font-bold"
                      : "hover:bg-slate-800/80 text-slate-400 hover:text-white"
                  }`}
                >
                  <item.icon className={`w-4 h-4 shrink-0 ${isActive ? "text-[#1AA3D9]" : ""}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile / Quick Links */}
        <div className="p-4 border-t border-slate-800 space-y-2 bg-[#090E1A]">
          <div className="flex items-center justify-between text-[11px] text-slate-400 px-2">
            <span>Role:</span>
            <span className="text-emerald-400 font-bold uppercase">Super Admin</span>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <Link
              href="/shop"
              target="_blank"
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-[11px] font-semibold transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              <span>Store</span>
            </Link>
            <Link
              href="/admin/login"
              className="flex items-center justify-center p-1.5 text-slate-400 hover:text-red-400 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 font-medium">
              <span>Admin Console</span>
              <span>/</span>
              <span className="text-slate-900 font-bold capitalize">
                {pathname.replace("/admin/", "") || "Dashboard"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>FY 26-27 Active</span>
            </div>

            <Link
              href="/admin/inventory"
              className="p-2 text-slate-500 hover:text-[#0A1B8F] relative transition-colors"
              title="Inventory Alerts"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#E01B47] rounded-full" />
            </Link>

            <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
              <div className="w-7 h-7 rounded-full bg-[#0A1B8F] text-white flex items-center justify-center text-xs font-bold">
                SA
              </div>
              <span className="hidden sm:inline text-xs font-bold text-slate-800">
                Super Admin
              </span>
            </div>
          </div>
        </header>

        {/* Page Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
