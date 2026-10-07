"use client";

import React, { use } from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Truck, HelpCircle, FileText, CheckCircle } from "lucide-react";
import { COMPANY_INFO } from "@/lib/constants";

export default function PolicyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const getPolicyContent = () => {
    switch (slug) {
      case "privacy":
        return {
          title: "Privacy & Data Protection Policy",
          icon: ShieldCheck,
          content: (
            <div className="space-y-4">
              <p>
                Eastern Biochemicals Private Limited is committed to protecting your privacy in full compliance with the Digital Personal Data Protection (DPDP) Act 2023 of India.
              </p>
              <h3 className="text-base font-bold text-gray-900 mt-4">1. Information We Collect</h3>
              <p>
                We only collect contact, shipping address, and order information required to process and dispatch your wellness purchases. We never store credit/debit card numbers or bank credentials.
              </p>
              <h3 className="text-base font-bold text-gray-900 mt-4">2. Discreet Packaging Guarantee</h3>
              <p>
                Your privacy is paramount. All orders are packed inside plain outer cartons with no product names, logos, or wellness keywords displayed on the exterior shipping label.
              </p>
            </div>
          ),
        };
      case "delivery-returns":
        return {
          title: "Delivery & Returns Policy",
          icon: Truck,
          content: (
            <div className="space-y-4">
              <p>
                We offer free discreet shipping across all serviceable Indian pincodes for both prepaid and Cash on Delivery orders.
              </p>
              <h3 className="text-base font-bold text-gray-900 mt-4">1. Dispatch Timeline</h3>
              <p>
                Orders placed before 2:00 PM IST are packed and handed over to our express courier partners (BlueDart / Delhivery) on the same business day. Delivery takes 2–4 business days depending on location.
              </p>
              <h3 className="text-base font-bold text-gray-900 mt-4">2. Returns & Replacements</h3>
              <p>
                Due to the intimate, hygienic nature of wellness and healthcare products, opened items cannot be returned unless received in a damaged or defective state. If an item arrives damaged, report within 48 hours for immediate doorstep replacement.
              </p>
            </div>
          ),
        };
      case "warranty":
        return {
          title: "Warranty & Quality Guarantee",
          icon: CheckCircle,
          content: (
            <div className="space-y-4">
              <p>
                All electronic personal massagers and vibrating devices manufactured by Eastern Biochemicals come with a <strong>1-Year Limited Manufacturing Warranty</strong> covering internal motor and battery defects.
              </p>
              <h3 className="text-base font-bold text-gray-900 mt-4">How to Claim Warranty</h3>
              <p>
                Provide your Order Number (e.g. EB-100245) and a short video demonstration of the defect to support@easternbiochemicals.com. Our quality team will authorize an exchange.
              </p>
            </div>
          ),
        };
      case "legal-notice":
        return {
          title: "Legal Notice & Disclaimers",
          icon: FileText,
          content: (
            <div className="space-y-4">
              <p>
                <strong>Company:</strong> {COMPANY_INFO.legalName}<br />
                <strong>CIN:</strong> {COMPANY_INFO.cin}<br />
                <strong>Registered Office:</strong> {COMPANY_INFO.registeredOffice}
              </p>
              <p>
                All products sold on this portal comply with statutory drug and cosmetic licensing mandates. Information on this website is intended for educational purposes and should not substitute professional medical guidance.
              </p>
            </div>
          ),
        };
      default:
        return {
          title: "Customer Support & Help Desk",
          icon: HelpCircle,
          content: (
            <div className="space-y-4">
              <p>
                Need assistance with an existing order, product inquiries, or discreet shipping? Our customer care desk is available Monday through Saturday from 9:30 AM to 6:30 PM IST.
              </p>
              <div className="p-4 bg-gray-50 rounded-2xl space-y-2 mt-4 text-xs font-semibold">
                <p><strong>Email:</strong> {COMPANY_INFO.contactEmail}</p>
                <p><strong>Phone:</strong> {COMPANY_INFO.contactPhone}</p>
                <p><strong>WhatsApp:</strong> +91 {COMPANY_INFO.whatsappNumber}</p>
              </div>
            </div>
          ),
        };
    }
  };

  const policy = getPolicyContent();

  return (
    <div className="py-14 px-4 sm:px-6 max-w-2xl mx-auto pb-32">
      <Link
        href="/shop"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#E01B47] mb-8"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Store
      </Link>

      <div className="bg-white p-8 sm:p-12 rounded-3xl border border-gray-100 shadow-storeCard space-y-6">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#E01B47] flex items-center justify-center">
          <policy.icon className="w-6 h-6" />
        </div>

        <h1 className="text-3xl font-black text-gray-900 tracking-tight">{policy.title}</h1>

        <div className="text-xs sm:text-sm text-gray-600 leading-relaxed pt-2 border-t border-gray-100">
          {policy.content}
        </div>
      </div>
    </div>
  );
}
