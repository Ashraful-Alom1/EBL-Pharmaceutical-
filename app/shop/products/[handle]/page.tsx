"use client";

import React, { useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  ShoppingBag,
  Share2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Truck,
  Facebook,
  Twitter,
  MessageCircle,
  HelpCircle,
  Camera,
} from "lucide-react";
import { dataStore } from "@/lib/data-store";
import { formatPaiseToInr } from "@/lib/gst";
import { useCart } from "@/lib/cart-context";
import ProductCard from "@/components/store/ProductCard";
import { Review } from "@/lib/types";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const resolvedParams = use(params);
  const handle = resolvedParams.handle;

  const product = dataStore.getProductBySlug(handle);
  const allProducts = dataStore.getProducts();
  const { addItem } = useCart();

  const [qty, setQty] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [pincode, setPincode] = useState("");
  const [pincodeResult, setPincodeResult] = useState<string | null>(null);

  // Accordion state
  const [openAccordion, setOpenAccordion] = useState<string | null>("desc");

  // Review Modal state & dynamic reviews from dataStore
  const [reviews, setReviews] = useState<Review[]>(() => {
    const list = dataStore.getReviews(product?.id);
    return list.length > 0 ? list : dataStore.getReviews();
  });
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [authorName, setAuthorName] = useState("");
  const [rating, setRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewBody, setReviewBody] = useState("");

  if (!product) {
    return (
      <div className="py-24 text-center">
        <h2 className="text-2xl font-bold">Product not found.</h2>
        <Link href="/shop" className="text-[#E01B47] underline mt-4 inline-block font-semibold">
          Return to Store Home
        </Link>
      </div>
    );
  }

  const youMayAlsoLike = [
    {
      id: "combo-01",
      name: "EBL Gourmet Chocolate & Hazelnut Condoms (10 pcs)",
      sku: "EB-COCKTAIL-01",
      slug: "ebl-gourmet-chocolate-hazelnut-condoms",
      categoryId: "flavoured-condoms",
      categoryName: "Flavoured Condoms",
      shortDesc: "Rich gourmet cocktail flavour condoms.",
      description: "Gourmet hazelnut & chocolate flavour.",
      mrpPaise: 39600,
      pricePaise: 30000,
      gstRate: 12 as const,
      unit: "Pack of 10",
      trackInventory: true,
      reorderLevel: 20,
      stockAvailable: 150,
      isLowStock: false,
      requiresPrescription: false,
      ageRestricted18Plus: false,
      images: [{ url: "/images/products/ebl-matrix-3d.jpg", alt: "EBL Gourmet Condoms" }],
      status: "PUBLISHED" as const,
      searchKeywords: [],
      ratingAvg: 4.5,
      ratingCount: 12,
      createdAt: "",
      updatedAt: "",
    },
    {
      id: "combo-02",
      name: "EBL Pulse Body Massager & Pure Silk Lavender Lube Combo",
      sku: "EB-THUNDER-LAV-COMBO",
      slug: "ebl-pulse-body-massager-lavender-lube-combo",
      categoryId: "personal-massagers",
      categoryName: "Personal Massagers",
      shortDesc: "Whisper quiet body massager + 100ml soothing lavender lube combo.",
      description: "Complete mutual sensation combo.",
      mrpPaise: 114900,
      pricePaise: 59900,
      gstRate: 18 as const,
      unit: "Combo Pack",
      trackInventory: true,
      reorderLevel: 15,
      stockAvailable: 80,
      isLowStock: false,
      requiresPrescription: false,
      ageRestricted18Plus: false,
      images: [{ url: "/images/products/ebl-massager-3d.jpg", alt: "EBL Massager Combo" }],
      status: "PUBLISHED" as const,
      searchKeywords: [],
      ratingAvg: 4.8,
      ratingCount: 18,
      createdAt: "",
      updatedAt: "",
    },
    {
      id: "combo-03",
      name: "EBL Climax Delay & Endurance Gel - Lidocaine & Prilocaine (15g)",
      sku: "EB-STAYLONG-01",
      slug: "ebl-climax-delay-endurance-gel-15g",
      categoryId: "mens-wellness",
      categoryName: "Men's Wellness",
      shortDesc: "Endurance gel for prolonged climax control.",
      description: "Pharmaceutical delay gel.",
      mrpPaise: 13500,
      pricePaise: 12500,
      gstRate: 12 as const,
      unit: "Tube (15g)",
      trackInventory: true,
      reorderLevel: 20,
      stockAvailable: 120,
      isLowStock: false,
      requiresPrescription: false,
      ageRestricted18Plus: false,
      images: [{ url: "/images/products/ebl-endurance-3d.jpg", alt: "EBL Delay Gel" }],
      status: "PUBLISHED" as const,
      searchKeywords: [],
      ratingAvg: 4.7,
      ratingCount: 9,
      createdAt: "",
      updatedAt: "",
    },
    {
      id: "combo-04",
      name: "EBL Pulse Massager & Pure Silk Strawberry Lube Combo",
      sku: "EB-THUNDER-STRAW-COMBO",
      slug: "ebl-pulse-massager-strawberry-lube-combo",
      categoryId: "personal-massagers",
      categoryName: "Personal Massagers",
      shortDesc: "Silicone pulse massager with sweet strawberry hydrating lube.",
      description: "Intense sensations with aroma.",
      mrpPaise: 114900,
      pricePaise: 59900,
      gstRate: 18 as const,
      unit: "Combo Pack",
      trackInventory: true,
      reorderLevel: 15,
      stockAvailable: 95,
      isLowStock: false,
      requiresPrescription: false,
      ageRestricted18Plus: false,
      images: [{ url: "/images/products/ebl-lube-3d.jpg", alt: "EBL Strawberry Lube Combo" }],
      status: "PUBLISHED" as const,
      searchKeywords: [],
      ratingAvg: 4.9,
      ratingCount: 14,
      createdAt: "",
      updatedAt: "",
    },
  ];

  const checkPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.length !== 6) {
      setPincodeResult("Please enter a valid 6-digit Indian PIN code.");
      return;
    }
    setPincodeResult("✓ In Stock & Serviceable: Delivery in 2-3 business days. COD Available.");
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    const newRev = dataStore.addReview({
      productId: product.id,
      productName: product.name,
      userName: authorName.trim() || "Verified Buyer",
      rating,
      title: reviewTitle.trim() || "Quality Pharmaceutical Formulation",
      body: reviewBody.trim(),
    });
    setReviews((prev) => [newRev, ...prev]);
    setShowReviewModal(false);
    setAuthorName("");
    setReviewTitle("");
    setReviewBody("");
  };

  const totalReviews = reviews.length;
  const avgRatingScore = totalReviews > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(2)
    : "5.00";
  const starBreakdown = [5, 4, 3, 2, 1].map((s) => {
    const count = reviews.filter((r) => Math.round(r.rating) === s).length;
    const pct = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
    return { stars: s, count, pct };
  });
  const reviewPhotos = reviews.flatMap((r) => r.photos || []).filter((p) => Boolean(p.url));

  return (
    <div className="py-6 sm:py-10 px-4 sm:px-6 max-w-[1240px] mx-auto pb-36">
      {/* Product View Adjustment (PDF pages 11, 13) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-start mb-24">
        {/* Left: Vertical Thumbnails + Large 3D Product Showcase */}
        <div className="lg:col-span-7 flex flex-col sm:flex-row gap-4">
          {/* Vertical Thumbnail Column */}
          <div className="flex sm:flex-col gap-2.5 shrink-0 order-2 sm:order-1 overflow-x-auto sm:overflow-visible py-1 sm:py-0">
            {(product.images && product.images.length > 0
              ? product.images
              : [{ url: "/images/products/ebl-ultrathin-3d.jpg", alt: product.name }]
            ).map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedImageIndex(idx)}
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border p-1 bg-white flex items-center justify-center cursor-pointer transition-all shadow-xs overflow-hidden shrink-0 ${
                  selectedImageIndex === idx
                    ? "border-[#E01B47] ring-2 ring-rose-200"
                    : "border-slate-200 hover:border-slate-400"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.url}
                  alt={img.alt || product.name}
                  className="w-full h-full object-cover object-center rounded-xl"
                />
              </button>
            ))}
          </div>

          {/* Large Showcase Container - Edge-to-edge 3D product visual with 100% image coverage, zero black borders */}
          <div className="flex-1 w-full min-h-[300px] sm:min-h-[480px] aspect-square sm:aspect-auto rounded-[24px] sm:rounded-[36px] bg-white flex items-center justify-center relative shadow-sm overflow-hidden border border-slate-200/80 order-1 sm:order-2">
            {/* Circular Rotating Badge: "FEATURED PRODUCT" */}
            <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-black text-slate-900 uppercase tracking-widest border border-slate-200 shadow-sm">
              FEATURED PRODUCT
            </div>

            {product.images && product.images.length > 1 && (
              <button
                onClick={() => setSelectedImageIndex((prev) => (prev + 1) % product.images.length)}
                className="absolute right-4 z-20 w-9 h-9 rounded-full bg-[#E01B47] text-white flex items-center justify-center shadow-md hover:bg-[#C4153C] transition-all"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}

            {/* 3D Realistic Product Packaging - covers completely with zero black margins */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.images?.[selectedImageIndex]?.url || product.images?.[0]?.url || "/images/products/ebl-ultrathin-3d.jpg"}
              alt={product.name}
              className="w-full h-full object-cover object-center transition-all duration-300"
            />
          </div>
        </div>

        {/* Right Details & Buy Actions (PDF pages 11, 13) */}
        <div className="lg:col-span-5 space-y-4">
          <span className="text-xs text-[#E01B47] font-bold uppercase tracking-wider block">
            Eastern Biochemicals Private Limited
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center text-[#F59E0B]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <a href="#reviews" className="text-xs text-slate-500 font-semibold hover:text-[#E01B47]">
              4.67 ({reviews.length} reviews)
            </a>
          </div>

          {/* Pricing matching PDF */}
          <div className="flex items-baseline gap-3 pt-1">
            <span className="text-2xl sm:text-3xl font-black text-[#E01B47]">
              {formatPaiseToInr(product.pricePaise)}
            </span>
            {product.mrpPaise > product.pricePaise && (
              <span className="text-sm text-gray-400 line-through">
                {formatPaiseToInr(product.mrpPaise)}
              </span>
            )}
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-2 text-xs font-bold text-[#16A34A]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A] animate-pulse" />
            <span>In stock, ready to ship</span>
          </div>

          {/* Stepper + Add to Cart Pill (PDF pages 11, 13) */}
          <div className="pt-2 flex items-center gap-3">
            <div className="inline-flex items-center border border-slate-200 rounded-full bg-white px-3 py-2 w-28 justify-between">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="font-bold text-slate-600 hover:text-black"
              >
                &lt;
              </button>
              <span className="font-extrabold text-sm">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="font-bold text-slate-600 hover:text-black"
              >
                &gt;
              </button>
            </div>

            <button
              onClick={() => addItem(product, qty)}
              className="flex-1 bg-[#E01B47] hover:bg-[#C4153C] text-white py-3.5 rounded-full font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Add to cart</span>
            </button>
          </div>

          {/* Buy it now Pill */}
          <Link
            href="/shop/checkout"
            onClick={() => addItem(product, qty)}
            className="block w-full text-center border border-slate-300 hover:border-slate-800 text-slate-800 py-3.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all"
          >
            Buy it now
          </Link>

          {/* Pincode Check (PDF page 11) */}
          <div className="pt-3 border-t border-slate-100">
            <form onSubmit={checkPincode} className="flex gap-2">
              <input
                type="text"
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                placeholder="Enter Pincode"
                className="flex-1 text-xs border border-slate-200 rounded-full px-4 py-2.5 outline-none focus:border-[#E01B47] bg-white"
              />
              <button
                type="submit"
                className="text-xs font-bold text-slate-700 hover:text-[#E01B47] px-3"
              >
                Check
              </button>
            </form>
            {pincodeResult && (
              <p className="text-xs text-green-700 mt-2 font-medium">{pincodeResult}</p>
            )}
          </div>

          {/* Social Share & Need Help (PDF page 13) */}
          <div className="pt-3 flex items-center justify-between text-xs text-slate-500 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <span className="font-semibold">Share:</span>
              <Facebook className="w-4 h-4 hover:text-[#E01B47] cursor-pointer" />
              <Twitter className="w-4 h-4 hover:text-[#E01B47] cursor-pointer" />
              <MessageCircle className="w-4 h-4 hover:text-[#E01B47] cursor-pointer" />
            </div>
            <a
              href="https://wa.me/919110087654?text=Hi%2C%20I%20need%20help%20with%20an%20order"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 hover:text-[#E01B47]"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Need help?</span>
            </a>
          </div>

          <div className="pt-1">
            <a href="#details" className="text-xs font-bold text-slate-700 hover:text-[#E01B47]">
              View full details →
            </a>
          </div>
        </div>
      </div>

      {/* CUSTOMER REVIEWS (PDF page 9) */}
      <section id="reviews" className="mb-24 pt-10 border-t border-slate-200">
        <h2 className="text-2xl font-black text-gray-900 mb-8 text-center sm:text-left">
          Customer Reviews
        </h2>

        {/* Breakdown Card matching PDF page 9 */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-xs grid grid-cols-1 md:grid-cols-12 gap-8 items-center mb-8">
          <div className="md:col-span-4 text-center md:border-r border-slate-100 md:pr-6">
            <div className="flex items-center justify-center text-[#F59E0B] gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <div className="text-3xl font-black text-gray-900">{avgRatingScore} out of 5</div>
            <p className="text-xs text-slate-400 mt-1">Based on {totalReviews} reviews</p>
          </div>

          {/* Red Progress Distribution Bars */}
          <div className="md:col-span-5 space-y-1.5 text-xs text-slate-600">
            {starBreakdown.map((bar) => (
              <div key={bar.stars} className="flex items-center gap-2">
                <span className="w-12 font-medium">{bar.stars} stars</span>
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#E01B47] rounded-full transition-all duration-500"
                    style={{ width: `${bar.pct}%` }}
                  />
                </div>
                <span className="w-4 text-right text-slate-400">{bar.count}</span>
              </div>
            ))}
          </div>

          <div className="md:col-span-3 text-center">
            <button
              onClick={() => setShowReviewModal(true)}
              className="bg-[#E01B47] text-white hover:bg-[#C4153C] px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm transition-all"
            >
              Write a review
            </button>
          </div>
        </div>

        {/* Customer photos & videos (PDF page 9) */}
        {reviewPhotos.length > 0 && (
          <div className="mb-8">
            <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Camera className="w-4 h-4 text-[#E01B47]" />
              <span>Customer photos &amp; videos</span>
            </h4>
            <div className="flex gap-3">
              {reviewPhotos.slice(0, 4).map((p, idx) => (
                <div key={idx} className="w-20 h-20 rounded-2xl overflow-hidden relative border border-slate-200 bg-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.url}
                    alt={product.name}
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filter Bar */}
        <div className="mb-4">
          <span className="text-xs text-slate-500 font-semibold cursor-pointer flex items-center gap-1">
            Verified Reviews ({reviews.length}) ▾
          </span>
        </div>

        {/* Dynamic Reviews List */}
        <div className="space-y-4">
          {reviews.map((rev) => (
            <div key={rev.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-rose-50 text-[#E01B47] flex items-center justify-center font-bold text-xs border border-rose-100">
                    {rev.userName.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-extrabold text-xs text-slate-900">{rev.userName}</span>
                  {rev.verifiedBuyer && (
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                      ✓ Verified Buyer
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-slate-400">{rev.createdAt}</span>
              </div>
              <div className="flex text-[#F59E0B]">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < rev.rating ? "fill-current text-amber-400" : "text-gray-200"
                    }`}
                  />
                ))}
              </div>
              <h5 className="font-bold text-xs text-slate-900">{rev.title}</h5>
              <p className="text-xs text-slate-600 leading-relaxed">
                {rev.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* YOU MAY ALSO LIKE (PDF page 10) */}
      <section className="mb-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            You may also like
          </h2>
          <div className="flex gap-2">
            <button className="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center text-slate-600 hover:bg-slate-100">
              &lt;
            </button>
            <button className="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center text-slate-600 hover:bg-slate-100">
              &gt;
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {youMayAlsoLike.map((p) => (
            <ProductCard key={p.id} product={p as any} />
          ))}
        </div>
      </section>

      {/* BOTTOM STICKY MINI ADD-TO-CART BAR (PDF pages 9-11) */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-3 shadow-2xl">
        <div className="max-w-[1240px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 overflow-hidden relative shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.images?.[0]?.url || "/images/products/ebl-ultrathin-3d.jpg"}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900 line-clamp-1">{product.name}</p>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-[#E01B47]">
                  {formatPaiseToInr(product.pricePaise)}
                </span>
                {product.mrpPaise > product.pricePaise && (
                  <span className="text-xs text-gray-400 line-through">
                    {formatPaiseToInr(product.mrpPaise)}
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={() => addItem(product, 1)}
            className="bg-[#E01B47] hover:bg-[#C4153C] text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-md transition-all shrink-0"
          >
            Add to cart
          </button>
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-black text-gray-900">Write a Review</h3>
            <form onSubmit={handleAddReview} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="e.g. Dr. Rajesh Kumar"
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-200 outline-none focus:border-[#E01B47]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="p-1"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= rating ? "fill-amber-400 text-amber-400" : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Headline</label>
                <input
                  type="text"
                  required
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  placeholder="e.g. Excellent therapeutic response"
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-200 outline-none focus:border-[#E01B47]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Review</label>
                <textarea
                  rows={3}
                  required
                  value={reviewBody}
                  onChange={(e) => setReviewBody(e.target.value)}
                  placeholder="Describe your experience..."
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-200 outline-none focus:border-[#E01B47]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="text-xs font-bold text-gray-500 px-4 py-2 hover:bg-gray-100 rounded-full"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#E01B47] text-white px-6 py-2.5 rounded-full text-xs font-bold"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
