"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShieldCheck, Truck, Lock, RotateCcw, Phone, Mail, MapPin, Clock } from "lucide-react";
import { dataStore } from "@/lib/data-store";
import EblLogo from "./EblLogo";

export default function StoreFooter() {
  const [settings, setSettings] = useState(dataStore.getCompanySettings());

  useEffect(() => {
    setSettings(dataStore.getCompanySettings());
    const unsub = dataStore.subscribe(() => {
      setSettings(dataStore.getCompanySettings());
    });
    return unsub;
  }, []);

  return (
    <footer className="w-full bg-[#AF4646] text-white pt-12 pb-8 font-sans">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
        {/* Top Perks Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-10 border-b border-white/20 text-center sm:text-left">
          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5 text-rose-200" />
            </div>
            <div>
              <h5 className="font-bold text-xs uppercase tracking-wider text-white">Discreet Delivery</h5>
              <p className="text-[11px] text-white/80">{settings.shopDiscreetNotice || "Plain packaging with zero label markings"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-rose-200" />
            </div>
            <div>
              <h5 className="font-bold text-xs uppercase tracking-wider text-white">100% Genuine</h5>
              <p className="text-[11px] text-white/80">Directly from EBL certified facilities</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5 text-rose-200" />
            </div>
            <div>
              <h5 className="font-bold text-xs uppercase tracking-wider text-white">Cash On Delivery</h5>
              <p className="text-[11px] text-white/80">Pay safely upon package delivery</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5 text-rose-200" />
            </div>
            <div>
              <h5 className="font-bold text-xs uppercase tracking-wider text-white">Dedicated Support</h5>
              <p className="text-[11px] text-white/80">{settings.shopHours || "Mon-Sat direct customer helpline"}</p>
            </div>
          </div>
        </div>

        {/* Dedicated Shop Contact Information Strip */}
        <div className="py-6 border-b border-white/15 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-white/90">
          <div className="flex items-start gap-2.5">
            <Phone className="w-4 h-4 text-rose-200 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-white text-[11px] uppercase tracking-wider">Customer Care &amp; WhatsApp:</span>
              <a href={`tel:${settings.shopPhone}`} className="hover:underline font-mono">
                {settings.shopPhone}
              </a>
              {settings.shopWhatsapp && (
                <span className="block text-[11px] text-white/70">
                  WhatsApp: +{settings.shopWhatsapp}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Mail className="w-4 h-4 text-rose-200 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-white text-[11px] uppercase tracking-wider">Orders &amp; Support Email:</span>
              <a href={`mailto:${settings.shopEmail}`} className="hover:underline">
                {settings.shopEmail}
              </a>
              <span className="block text-[11px] text-white/70 flex items-center gap-1 mt-0.5">
                <Clock className="w-3 h-3" /> {settings.shopHours}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-rose-200 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-white text-[11px] uppercase tracking-wider">Fulfillment &amp; Dispatch Hub:</span>
              <p className="text-[11px] text-white/80 leading-relaxed">
                {settings.shopAddress}
              </p>
            </div>
          </div>
        </div>

        {/* Center Brand and Info */}
        <div className="py-6 flex flex-col md:flex-row items-center justify-between gap-4 border-b border-white/15">
          <div className="flex items-center gap-3">
            <EblLogo className="h-9" variant="dark" />
          </div>
          <div className="text-center md:text-right text-xs text-white/80 max-w-xl">
            {settings.legalName} &bull; CIN: {settings.cin} &bull; GSTIN: {settings.shopGstin}
            {settings.shopDrugLicense && (
              <span className="block text-[10px] text-white/70 mt-0.5">DL No: {settings.shopDrugLicense}</span>
            )}
          </div>
        </div>

        {/* Bottom Copyright & Policy Links */}
        <div className="pt-6 flex flex-col lg:flex-row items-center justify-between gap-4 text-xs text-white/90">
          <div className="text-center lg:text-left text-white/80">
            {settings.shopCopyrightText || `© 2026 ${settings.legalName}. All rights reserved.`}
          </div>

          <ul className="flex flex-wrap gap-4 sm:gap-6 justify-center text-[12px] font-medium text-white/90">
            <li>
              <Link href="/shop/pages/privacy" className="hover:text-white underline-offset-4 hover:underline">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/shop/pages/terms" className="hover:text-white underline-offset-4 hover:underline">
                Terms &amp; Conditions
              </Link>
            </li>
            <li>
              <Link href="/shop/pages/delivery-returns" className="hover:text-white underline-offset-4 hover:underline">
                Delivery &amp; Returns
              </Link>
            </li>
            <li>
              <Link href="/shop/track-order" className="hover:text-white underline-offset-4 hover:underline">
                Track Order
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white underline-offset-4 hover:underline">
                Customer Support
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
