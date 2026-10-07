import React from "react";
import CorpHeader from "@/components/corporate/CorpHeader";
import CorpFooter from "@/components/corporate/CorpFooter";

export default function CorporateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-white text-[#0B0B0F]">
      <CorpHeader />
      <main className="flex-1">{children}</main>
      <CorpFooter />
    </div>
  );
}
