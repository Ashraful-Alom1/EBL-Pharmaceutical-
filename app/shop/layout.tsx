import React from "react";
import StoreHeader from "@/components/store/StoreHeader";
import StoreFooter from "@/components/store/StoreFooter";
import CartDrawer from "@/components/store/CartDrawer";
import WhatsAppButton from "@/components/store/WhatsAppButton";

export const metadata = {
  title: "Eastern Biochemicals Store | Healthcare & Intimate Care",
  description: "Official direct-to-consumer store of Eastern Biochemicals. Shop WHO-GMP certified pharmaceuticals, ultra-thin condoms, lubricants, and healthcare essentials.",
};

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-[#FFF9F7] text-[#141414]">
      <StoreHeader />
      <main className="flex-1">{children}</main>
      <StoreFooter />
      <CartDrawer />
      <WhatsAppButton />
    </div>
  );
}
