import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";

export const metadata: Metadata = {
  title: "Eastern Biochemicals Private Limited | Healthcare, R&D & Wellness",
  description: "Official corporate portal and direct-to-consumer store of Eastern Biochemicals Private Limited. Advancing healthcare through science, quality formulations, and wellness essentials.",
  keywords: ["Eastern Biochemicals", "Pharmaceuticals", "Wellness", "R&D", "India Healthcare", "EBL Store"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased min-h-screen flex flex-col">
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
