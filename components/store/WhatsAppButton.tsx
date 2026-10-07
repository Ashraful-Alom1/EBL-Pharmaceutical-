"use client";

import React, { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";
import { dataStore } from "@/lib/data-store";

export default function WhatsAppButton() {
  const [whatsappNumber, setWhatsappNumber] = useState(dataStore.getCompanySettings().shopWhatsapp);

  useEffect(() => {
    setWhatsappNumber(dataStore.getCompanySettings().shopWhatsapp);
    const unsub = dataStore.subscribe(() => {
      setWhatsappNumber(dataStore.getCompanySettings().shopWhatsapp);
    });
    return unsub;
  }, []);

  const cleanNum = whatsappNumber.replace(/[^0-9]/g, "");
  const whatsappUrl = `https://wa.me/${cleanNum}?text=Hi%20Eastern%20Biochemicals%20Store%2C%20I%20have%20a%20question%20regarding%20an%20order.`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 bg-[#25D366] text-white px-4 py-2.5 rounded-full shadow-xl hover:bg-[#20ba5a] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 text-xs sm:text-sm font-bold tracking-wide border-2 border-white"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-4 h-4 fill-white" />
      <span>Chat Now</span>
    </a>
  );
}
