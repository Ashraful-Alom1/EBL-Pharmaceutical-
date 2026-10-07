"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Star,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Pause,
  Play,
  Volume2,
  VolumeX,
  Facebook,
  Twitter,
  MessageCircle,
  Truck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Camera,
  ThumbsUp,
} from "lucide-react";
import { dataStore } from "@/lib/data-store";
import { useCart } from "@/lib/cart-context";
import ProductCard from "@/components/store/ProductCard";
import ImageComparisonSlider from "@/components/store/ImageComparisonSlider";

export default function StoreHomePage() {
  const [products, setProducts] = useState(() => dataStore.getProducts());
  const { addItem } = useCart();
  const [visuals, setVisuals] = useState(() => dataStore.getStoreVisuals());

  useEffect(() => {
    return dataStore.subscribe(() => {
      setProducts(dataStore.getProducts());
      setVisuals(dataStore.getStoreVisuals());
      setCustomerReviews(dataStore.getReviews());
    });
  }, []);

  // 1. Seamless Infinite Slideshow State (Forward Continuous Loop, Zero Rewind)
  const heroSlides = visuals.heroSlides;
  const numSlides = heroSlides.length;
  // Extended array with clone of last at start and clone of first at end
  const extendedSlides = numSlides > 0
    ? [heroSlides[numSlides - 1], ...heroSlides, heroSlides[0]]
    : [];

  const [slideIndex, setSlideIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Auto-advance slideshow forward continuously
  useEffect(() => {
    if (numSlides <= 1 || isPaused) return;
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setSlideIndex((prev) => prev + 1);
    }, 5500);
    return () => clearInterval(timer);
  }, [numSlides, isPaused]);

  const handleNextSlide = () => {
    setIsTransitioning(true);
    setSlideIndex((prev) => prev + 1);
  };

  const handlePrevSlide = () => {
    setIsTransitioning(true);
    setSlideIndex((prev) => prev - 1);
  };

  const handleTransitionEnd = () => {
    if (slideIndex >= numSlides + 1) {
      // Reached cloned first slide -> silently jump back to index 1 without animation
      setIsTransitioning(false);
      setSlideIndex(1);
    } else if (slideIndex <= 0) {
      // Reached cloned last slide -> silently jump to real last slide without animation
      setIsTransitioning(false);
      setSlideIndex(numSlides);
    }
  };

  useEffect(() => {
    if (!isTransitioning) {
      const raf = requestAnimationFrame(() => {
        setIsTransitioning(true);
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [isTransitioning]);

  const activeDotIndex = numSlides > 0 ? (slideIndex - 1 + numSlides) % numSlides : 0;

  // Customer Reviews & Interactive Review Form State
  const [customerReviews, setCustomerReviews] = useState(() => dataStore.getReviews());
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewAuthor, setReviewAuthor] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewBody, setReviewBody] = useState("");
  const [reviewProductId, setReviewProductId] = useState(products[0]?.id || "eb-prod-001");

  // 2. Trending Filter Tags (PDF Pages 15 & 16)
  const [selectedTag, setSelectedTag] = useState("Gastro Care");
  const trendingTags = ["Gastro Care", "Cardiovascular", "Women's Health", "All"];

  const filteredTrending = products.filter((p) => {
    if (selectedTag === "All") return true;
    if (selectedTag === "Gastro Care") {
      return (
        p.categoryId === "gastro-care" ||
        p.name.toLowerCase().includes("raft") ||
        p.name.toLowerCase().includes("pantop")
      );
    }
    if (selectedTag === "Cardiovascular") {
      return (
        p.categoryId === "cardio-care" ||
        p.name.toLowerCase().includes("cilalong") ||
        p.name.toLowerCase().includes("cilnidipine")
      );
    }
    if (selectedTag === "Women's Health") {
      return (
        p.categoryId === "womens-wellness" ||
        p.name.toLowerCase().includes("vitaplus") ||
        p.name.toLowerCase().includes("women")
      );
    }
    return true;
  });

  // 3. Featured Product Showcase State (PDF Pages 11 & 13)
  const featVisuals = visuals.featuredProduct;
  const featuredProduct = products.find((p) => p.id === featVisuals.productId) || products[0];
  const [featuredQty, setFeaturedQty] = useState(1);
  const [selectedThumb, setSelectedThumb] = useState(0);
  const [pincode, setPincode] = useState("");
  const [pincodeStatus, setPincodeStatus] = useState<string | null>(null);

  const checkPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincode || pincode.length !== 6) {
      setPincodeStatus("Please enter a valid 6-digit Indian PIN code.");
      return;
    }
    setPincodeStatus("✓ Serviceable: Estimated delivery in 2-3 business days. Cash on delivery available.");
  };

  // 4. Video Hero State (PDF Page 14)
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [isVideoMuted, setIsVideoMuted] = useState(true);

  const toggleVideoPlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsVideoPlaying(true);
    } else {
      videoRef.current.pause();
      setIsVideoPlaying(false);
    }
  };

  const toggleVideoMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsVideoMuted(videoRef.current.muted);
  };

  // 5. Testimonials State (PDF Page 12)
  const [currentReview, setCurrentReview] = useState(0);
  const testimonialsList = visuals.testimonials.reviews;

  useEffect(() => {
    const revTimer = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % testimonialsList.length);
    }, 5500);
    return () => clearInterval(revTimer);
  }, [testimonialsList.length]);

  // 6. "You May Also Like" Products (PDF Page 10)
  const youMayAlsoLike = [
    {
      id: "eb-prod-002",
      name: "EBL Cilalong 10 mg Cilnidipine Tablets IP (3 x 10 Tablets)",
      mrp: 310,
      price: 240,
      discount: "Save 23%",
      rating: 4.85,
      image: "/images/products/ebl-cilalong-3d.jpg",
      slug: "ebl-cilalong-10mg-cilnidipine-tablets-ip",
    },
    {
      id: "eb-prod-005",
      name: "EBL Pantop-DSR Gastro Resistant Capsules (10 x 10 Capsules)",
      mrp: 245,
      price: 185,
      discount: "Save 24%",
      rating: 4.88,
      image: "/images/products/ebl-pantop-3d.jpg",
      slug: "ebl-pantop-dsr-gastro-resistant-capsules",
    },
    {
      id: "eb-prod-006",
      name: "EBL VitaPlus Women Daily Multivitamin & Minerals (100 Tablets)",
      mrp: 699,
      price: 499,
      discount: "Save 29%",
      rating: 4.92,
      image: "/images/products/ebl-vitaplus-3d.jpg",
      slug: "ebl-vitaplus-women-daily-multivitamin-minerals",
    },
    {
      id: "eb-prod-009",
      name: "EBL Feather-Touch 0.03mm Ultra-Thin Condoms (10 pcs)",
      mrp: 399,
      price: 299,
      discount: "Save 25%",
      rating: 4.94,
      image: "/images/products/ebl-ultrathin-3d.jpg",
      slug: "ebl-feather-touch-003mm-ultra-thin-condoms",
    },
  ];

  return (
    <div className="space-y-12 sm:space-y-20 lg:space-y-24 pb-20">
      {/* =========================================================================
          SECTION 1: HERO SLIDESHOW
          Infinite Forward Loop Carousel (Zero Rewinding, Continuous Loop-wise motion)
          Adjusted Framing: Clean aspect ratios, uncropped 3D products, and responsive layout
      ========================================================================= */}
      <section className="max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8 pt-2 sm:pt-4">
        <div
          className="relative rounded-[20px] sm:rounded-[32px] overflow-hidden shadow-sm h-[220px] sm:h-[320px] md:h-[390px] lg:h-[460px] xl:h-[490px] bg-[#E8D9EB] group select-none"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={(e) => {
            touchStartX.current = e.touches[0].clientX;
            setIsPaused(true);
          }}
          onTouchEnd={(e) => {
            if (touchStartX.current !== null) {
              const diff = touchStartX.current - e.changedTouches[0].clientX;
              if (diff > 40) handleNextSlide();
              else if (diff < -40) handlePrevSlide();
            }
            touchStartX.current = null;
            setIsPaused(false);
          }}
        >
          {/* Horizontal Slide Track */}
          <div
            className="flex h-full w-full"
            style={{
              transform: `translateX(-${slideIndex * 100}%)`,
              transition: isTransitioning
                ? "transform 700ms cubic-bezier(0.25, 1, 0.5, 1)"
                : "none",
            }}
            onTransitionEnd={handleTransitionEnd}
          >
            {extendedSlides.map((slide, idx) => {
              return (
                <div
                key={`${slide.id}-${idx}`}
                className="w-full min-w-full max-w-full h-full relative shrink-0 flex-none basis-full overflow-hidden"
                style={{
                  backgroundColor: slide.bgColor || "#E8D9EB",
                  width: "100%",
                  minWidth: "100%",
                  maxWidth: "100%",
                  flex: "0 0 100%",
                }}
              >
                  <Link href={slide.link} className="block w-full h-full relative group/slide overflow-hidden">
                    {/* Unified Full-Bleed Complete Banner - 100% same genuine EBL product banner across all devices */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        slide.id === "slide-ebl-pantop"
                          ? "/images/store/ebl-banner-pantop.jpg"
                          : slide.id === "slide-ebl-cilalong"
                          ? "/images/store/ebl-banner-cilalong.jpg"
                          : slide.id === "slide-ebl-vitaplus"
                          ? "/images/store/ebl-banner-vitaplus.jpg"
                          : slide.desktopImage?.includes("pantop")
                          ? "/images/store/ebl-banner-pantop.jpg"
                          : slide.desktopImage?.includes("cilalong")
                          ? "/images/store/ebl-banner-cilalong.jpg"
                          : slide.desktopImage?.includes("vitaplus")
                          ? "/images/store/ebl-banner-vitaplus.jpg"
                          : slide.desktopImage?.includes("raft")
                          ? "/images/store/ebl-banner-raft.jpg"
                          : slide.desktopImage || "/images/store/ebl-banner-raft.jpg"
                      }
                      alt={slide.alt || slide.title}
                      className="w-full h-full object-cover object-center"
                    />
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Left Arrow */}
          <button
            onClick={handlePrevSlide}
            className="absolute left-2.5 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-md text-white flex items-center justify-center transition-all text-sm sm:text-lg drop-shadow-md"
            aria-label="Previous Slide"
          >
            ←
          </button>

          {/* Right Arrow */}
          <button
            onClick={handleNextSlide}
            className="absolute right-2.5 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-md text-white flex items-center justify-center transition-all text-sm sm:text-lg drop-shadow-md"
            aria-label="Next Slide"
          >
            →
          </button>

          {/* Center Dots Indicator */}
          <div className="absolute bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 sm:gap-2 bg-black/20 backdrop-blur-md px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setIsTransitioning(true);
                  setSlideIndex(i + 1);
                }}
                className={`transition-all rounded-full ${
                  activeDotIndex === i
                    ? "w-5 sm:w-6 h-1.5 sm:h-2 bg-white shadow-sm"
                    : "w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white/50 hover:bg-white/80"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: THERAPEUTIC CARE ZONES
          Exact match with PDF Page 18.
          3 Circular Pale Pink Cards with High-Fidelity Official Visuals.
      ========================================================================= */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-8 text-center">
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">
          Therapeutic Care Zones
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1.5 sm:mt-2 mb-8 sm:mb-14 font-medium">
          Specialized Pharmaceutical Formulations by Eastern Biochemicals
        </p>

        <div className="grid grid-cols-3 gap-3 sm:gap-8 md:gap-12 max-w-5xl mx-auto px-1 sm:px-4">
          {visuals.desireZone.map((card) => (
            <Link
              key={card.id}
              href={card.link}
              className="group flex flex-col items-center cursor-pointer text-center"
            >
              {/* Circular Card with 3D product visual, zero extra white margin layer */}
              <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-44 lg:h-44 mx-auto rounded-full bg-white flex items-center justify-center shadow-md group-hover:scale-105 group-hover:shadow-2xl transition-all duration-300 relative overflow-hidden border-2 border-slate-200/80 p-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={card.image}
                  alt={card.alt}
                  className="w-full h-full object-cover object-center pointer-events-none group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              <h3 className="font-extrabold text-xs sm:text-base md:text-xl text-gray-900 mt-2 sm:mt-4 group-hover:text-[#E11D48] transition-colors leading-tight line-clamp-1 sm:line-clamp-none">
                {card.title}
              </h3>
              <span className="text-[10px] sm:text-xs md:text-sm text-slate-400 mt-0.5 font-medium block line-clamp-1 sm:line-clamp-none">
                {card.subtitle}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: SWITCH TO THIN X / EBL RAFT
          Exact match with PDF Page 17.
          Interactive Draggable Split Comparison Slider.
      ========================================================================= */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-8">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">
            <span className="bg-gradient-to-r from-[#0094DE] via-[#0A3B74] to-[#10B981] bg-clip-text text-transparent">
              {visuals.comparison.title}
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5 sm:mt-2 font-medium">
            {visuals.comparison.subtitle}
          </p>
        </div>

        <ImageComparisonSlider
          beforeImage={visuals.comparison.beforeImage}
          afterImage={visuals.comparison.afterImage}
          beforeLabel={visuals.comparison.beforeLabel}
          afterLabel={visuals.comparison.afterLabel}
        />
      </section>

      {/* =========================================================================
          SECTION 4: TRENDING PRODUCTS
          Exact match with PDF Pages 15 & 16.
          Pill Tabs Filter + Product Card Grid with Discount Badges.
      ========================================================================= */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-8">
        <h2 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight mb-4 sm:mb-6">
          Trending products
        </h2>

        {/* Filter Pills matching epiclovestore.com */}
        <div className="flex flex-wrap gap-2 sm:gap-2.5 mb-6 sm:mb-10">
          {trendingTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-bold transition-all ${
                selectedTag === tag
                  ? "bg-[#E11D48] text-white shadow-md"
                  : "bg-white text-slate-700 border border-slate-200 hover:border-slate-400"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Product Cards Grid: 2 columns on mobile, 3 on tablet, 4 on desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
          {filteredTrending.slice(0, 16).map((prod) => (
            <ProductCard key={prod.id} product={prod} showRating={false} />
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: VIDEO WITH TEXT OVERLAY
          Exact match with PDF Page 14.
          Rounded container with autoplay loop video and pause/play toggle.
      ========================================================================= */}
      <section className="max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8">
        <div className="relative rounded-[20px] sm:rounded-[36px] overflow-hidden bg-black min-h-[320px] sm:min-h-[460px] lg:min-h-[520px] flex items-center justify-center shadow-xl">
          {/* Autoplay Looping HTML5 Video */}
          <video
            ref={videoRef}
            autoPlay
            loop
            muted={isVideoMuted}
            playsInline
            poster={visuals.videoHero.posterUrl}
            className="absolute inset-0 w-full h-full object-cover object-center"
          >
            <source src={visuals.videoHero.videoUrl} type="video/mp4" />
          </video>

          {/* Dark Overlay for Text Legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/60 pointer-events-none" />

          {/* Overlay Text Content */}
          <div className="relative z-10 text-center text-white space-y-3 sm:space-y-4 p-5 sm:p-8 max-w-xl">
            <span className="inline-block text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-cyan-300 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
              {visuals.videoHero.badge}
            </span>
            <h3 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              {visuals.videoHero.heading}
            </h3>
            <p className="text-[11px] sm:text-xs md:text-sm text-slate-200 leading-relaxed font-normal">
              {visuals.videoHero.subtext}
            </p>
            <div className="pt-1 sm:pt-2">
              <Link
                href={visuals.videoHero.buttonLink}
                className="inline-flex items-center gap-2 bg-[#E11D48] hover:bg-[#C4153C] text-white px-5 sm:px-7 py-2.5 sm:py-3 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider shadow-lg transition-all"
              >
                <span>{visuals.videoHero.buttonText}</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </Link>
            </div>
          </div>

          {/* Video Control Buttons (Play/Pause & Sound) */}
          <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-20 flex items-center gap-2">
            <button
              onClick={toggleVideoMute}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/40 transition-colors"
              aria-label={isVideoMuted ? "Unmute video" : "Mute video"}
            >
              {isVideoMuted ? <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
            </button>
            <button
              onClick={toggleVideoPlay}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/40 transition-colors"
              aria-label={isVideoPlaying ? "Pause video" : "Play video"}
            >
              {isVideoPlaying ? <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: FEATURED PRODUCT SHOWCASE
          Exact match with PDF Pages 11 & 13.
          Spotlight EBL RAFT Antacid Suspension with 4 thumbnails & Pincode Checker.
          Admin can swap visuals via STORE_VISUALS.featuredProduct.
      ========================================================================= */}
      <section className="max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8">
        <div className="bg-white rounded-[20px] sm:rounded-[36px] p-4 sm:p-8 lg:p-12 shadow-sm border border-slate-100 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 items-center">
          {/* Left Thumbnail Gallery & Main Display */}
          <div className="lg:col-span-7 flex flex-col sm:flex-row gap-3 sm:gap-4">
            {/* 4 Thumbnails */}
            <div className="flex sm:flex-col gap-2 shrink-0 order-2 sm:order-1 overflow-x-auto pb-1 sm:pb-0">
              {featVisuals.thumbnails.map((thumb) => (
                <button
                  key={thumb.id}
                  onClick={() => setSelectedThumb(thumb.id)}
                  className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl border p-1 bg-[#ECEEF2] flex items-center justify-center cursor-pointer transition-all overflow-hidden shrink-0 ${
                    selectedThumb === thumb.id
                      ? "border-[#E11D48] ring-2 ring-rose-200"
                      : "border-slate-200 hover:border-slate-400"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={thumb.img}
                    alt={thumb.alt}
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>

            {/* Main Product Showcase Box - 100% full coverage with product visual, zero black margins */}
            <div className="flex-1 min-h-[260px] sm:min-h-[380px] lg:min-h-[440px] rounded-[20px] sm:rounded-[28px] bg-white flex items-center justify-center relative overflow-hidden order-1 sm:order-2 border border-slate-200/80 shadow-sm">
              <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-white/95 backdrop-blur-md px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-black text-slate-900 uppercase tracking-widest border border-slate-200 shadow-sm z-20">
                FEATURED PRODUCT
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={featVisuals.thumbnails[selectedThumb]?.img || featVisuals.thumbnails[0].img}
                alt={featVisuals.title}
                className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

          {/* Right Product Buy Box */}
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
              {featVisuals.brandTag}
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
              {featVisuals.title}
            </h3>

            {/* Star Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center text-[#F59E0B]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="text-xs text-slate-500 font-semibold">
                {featVisuals.ratingAvg} ({featVisuals.ratingCount} reviews)
              </span>
            </div>

            {/* Price Row */}
            <div className="flex items-baseline gap-3 pt-1">
              <span className="text-2xl sm:text-3xl font-black text-[#E11D48]">
                ₹{(featVisuals.pricePaise / 100).toFixed(2)}
              </span>
              <span className="text-sm text-gray-400 line-through">
                ₹{(featVisuals.mrpPaise / 100).toFixed(2)}
              </span>
              <span className="bg-rose-100 text-[#E11D48] text-[11px] font-bold px-2 py-0.5 rounded-md">
                {featVisuals.discountBadge}
              </span>
            </div>

            {/* In stock indicator */}
            <div className="flex items-center gap-2 text-xs font-bold text-[#16A34A]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A] animate-pulse" />
              <span>{featVisuals.stockStatus}</span>
            </div>

            {/* Quantity Stepper & Add to Cart */}
            <div className="pt-2 flex items-center gap-3">
              <div className="inline-flex items-center border border-slate-200 rounded-full bg-white px-3 py-2 w-28 justify-between">
                <button
                  onClick={() => setFeaturedQty((q) => Math.max(1, q - 1))}
                  className="font-bold text-slate-600 hover:text-black px-1"
                >
                  -
                </button>
                <span className="font-extrabold text-sm">{featuredQty}</span>
                <button
                  onClick={() => setFeaturedQty((q) => q + 1)}
                  className="font-bold text-slate-600 hover:text-black px-1"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => addItem(featuredProduct, featuredQty)}
                className="flex-1 bg-[#E11D48] hover:bg-[#C4153C] text-white py-3.5 rounded-full font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to cart</span>
              </button>
            </div>

            {/* Buy it now button */}
            <Link
              href="/shop/checkout"
              onClick={() => addItem(featuredProduct, featuredQty)}
              className="block w-full text-center border-2 border-slate-800 hover:bg-slate-900 hover:text-white text-slate-800 py-3.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all"
            >
              Buy it now
            </Link>

            {/* Pincode Estimator */}
            <div className="pt-4 border-t border-slate-100">
              <div className="text-[11px] font-bold text-slate-500 mb-1.5 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-[#E11D48]" />
                <span>Check Delivery &amp; COD Availability</span>
              </div>
              <form onSubmit={checkPincode} className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                  placeholder="Enter 6-digit Pincode"
                  className="flex-1 text-xs border border-slate-200 rounded-full px-4 py-2.5 outline-none focus:border-[#E11D48]"
                />
                <button
                  type="submit"
                  className="text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 px-5 rounded-full transition-colors"
                >
                  Check
                </button>
              </form>
              {pincodeStatus && (
                <p className="text-xs text-green-700 mt-2 font-medium">{pincodeStatus}</p>
              )}
            </div>

            {/* Social Share & Link to full details */}
            <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-slate-600">Share:</span>
                <Facebook className="w-4 h-4 hover:text-[#E11D48] cursor-pointer transition-colors" />
                <Twitter className="w-4 h-4 hover:text-[#E11D48] cursor-pointer transition-colors" />
                <MessageCircle className="w-4 h-4 hover:text-[#E11D48] cursor-pointer transition-colors" />
              </div>
              <Link
                href={`/shop/products/${featuredProduct.slug}`}
                className="text-xs font-bold text-[#E11D48] hover:underline"
              >
                View full details →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 7: YOU MAY ALSO LIKE
          Exact match with PDF Page 10.
          Carousel with Combo and Accessory Product Cards.
      ========================================================================= */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
            You may also like
          </h2>
          <div className="flex items-center gap-2">
            <button
              className="w-9 h-9 rounded-full border border-slate-200 hover:border-slate-900 flex items-center justify-center text-slate-700 transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              className="w-9 h-9 rounded-full border border-slate-200 hover:border-slate-900 flex items-center justify-center text-slate-700 transition-colors"
              aria-label="Next"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {youMayAlsoLike.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="relative">
                <span className="absolute top-0 left-0 bg-[#E11D48] text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-10">
                  {item.discount}
                </span>
                {item.rating && (
                  <span className="absolute top-0 right-0 flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-full z-10 shadow-xs border border-slate-100">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span>{item.rating}</span>
                  </span>
                )}
                <div className="w-full aspect-square bg-white rounded-2xl overflow-hidden mb-4 mt-4 relative border border-slate-200/80 shadow-xs p-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>

              <div>
                <h4 className="font-bold text-xs sm:text-sm text-gray-900 leading-snug line-clamp-2 mb-2">
                  {item.name}
                </h4>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="font-black text-sm text-[#E11D48]">
                    ₹{item.price}.00
                  </span>
                  <span className="text-xs text-gray-400 line-through">
                    ₹{item.mrp}.00
                  </span>
                </div>
                <Link
                  href={`/shop/products/${item.slug}`}
                  className="block w-full text-center py-2.5 rounded-full bg-[#E11D48] hover:bg-[#C4153C] text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all"
                >
                  View Product
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 8: CUSTOMER REVIEWS WIDGET (DYNAMIC, ZERO DUMMY DATA)
          Exact match with PDF Page 9 Judge.me layout.
          Connected directly to DataStore for verified reviews & photo thumbnails.
      ========================================================================= */}
      {(() => {
        const totalRevCount = customerReviews.length;
        const avgScore = totalRevCount > 0
          ? (customerReviews.reduce((sum, r) => sum + r.rating, 0) / totalRevCount).toFixed(2)
          : "5.00";
        const breakdownBars = [5, 4, 3, 2, 1].map((s) => {
          const count = customerReviews.filter((r) => Math.round(r.rating) === s).length;
          const pct = totalRevCount > 0 ? Math.round((count / totalRevCount) * 100) : 0;
          return { stars: `${s} stars`, count, pct };
        });
        const attachedPhotos = customerReviews
          .flatMap((r) => r.photos || [])
          .filter((p) => Boolean(p.url));

        return (
          <section className="max-w-[1400px] mx-auto px-4 sm:px-8">
            <div className="bg-white rounded-[24px] sm:rounded-[36px] p-6 sm:p-12 border border-slate-100 shadow-sm space-y-8">
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight text-center sm:text-left">
                Customer Reviews
              </h2>

              {/* Breakdown Header */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pb-8 border-b border-slate-100">
                {/* Average Rating Score */}
                <div className="lg:col-span-4 flex flex-col items-center sm:items-start space-y-2">
                  <div className="flex items-center gap-1.5 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-6 h-6 fill-current" />
                    ))}
                  </div>
                  <div className="text-2xl font-black text-slate-800">
                    {avgScore} <span className="text-sm font-normal text-slate-500">out of 5</span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">Based on {totalRevCount} verified reviews</p>
                </div>

                {/* Rating Bars */}
                <div className="lg:col-span-5 space-y-1.5 text-xs text-slate-600">
                  {breakdownBars.map((bar) => (
                    <div key={bar.stars} className="flex items-center gap-3">
                      <span className="w-14 text-right text-slate-400 font-medium">{bar.stars}</span>
                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#E11D48] rounded-full transition-all duration-500"
                          style={{ width: `${bar.pct}%` }}
                        />
                      </div>
                      <span className="w-4 text-slate-400 font-medium">{bar.count}</span>
                    </div>
                  ))}
                </div>

                {/* Write a Review Button */}
                <div className="lg:col-span-3 flex justify-center lg:justify-end">
                  <button
                    onClick={() => setShowReviewModal(true)}
                    className="bg-[#E11D48] hover:bg-[#C4153C] text-white px-7 py-3 rounded-full text-xs font-bold uppercase tracking-wider shadow-md transition-all cursor-pointer"
                  >
                    Write a review
                  </button>
                </div>
              </div>

              {/* Customer Photos & Videos Thumbnails */}
              {attachedPhotos.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
                    <Camera className="w-4 h-4 text-[#E11D48]" />
                    <span>Customer photos &amp; videos</span>
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {attachedPhotos.slice(0, 6).map((photo, pIdx) => (
                      <div key={pIdx} className="w-16 h-16 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={photo.url}
                          alt="Customer Review Photo"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Dynamic Customer Review Comments */}
              <div className="space-y-6 pt-4 border-t border-slate-100">
                {customerReviews.map((rev) => (
                  <div key={rev.id} className="space-y-2 border-b border-slate-100 pb-5 last:border-b-0 last:pb-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center font-bold text-xs text-[#E11D48]">
                          {rev.userName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-900">{rev.userName}</span>
                            {rev.verifiedBuyer && (
                              <span className="text-[10px] bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold px-2 py-0.5 rounded-full">
                                ✓ Verified Buyer
                              </span>
                            )}
                          </div>
                          {rev.productName && (
                            <span className="text-[10px] text-slate-400 font-medium block">
                              {rev.productName}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-[11px] text-slate-400 font-medium">{rev.createdAt}</span>
                    </div>

                    <div className="flex items-center text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${i < rev.rating ? "fill-current text-amber-400" : "text-slate-200"}`}
                        />
                      ))}
                    </div>

                    <p className="font-bold text-xs text-slate-900">{rev.title}</p>
                    <p className="text-xs text-slate-600 leading-relaxed">{rev.body}</p>

                    {rev.photos && rev.photos.length > 0 && (
                      <div className="flex gap-2 pt-1.5">
                        {rev.photos.map((ph, phIdx) => (
                          <div key={phIdx} className="w-14 h-14 rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={ph.url} alt="Review attachment" className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      })()}

      {/* =========================================================================
          SECTION 9: TESTIMONIALS BANNER
          Exact match with PDF Page 12.
          Dark Rose Dew Drops Floral Background with Centered Customer Quotes.
      ========================================================================= */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-8">
        <div className="relative rounded-[24px] sm:rounded-[36px] overflow-hidden min-h-[400px] sm:min-h-[480px] flex items-center justify-center text-center p-8 sm:p-16 shadow-2xl bg-[#1A0409]">
          {/* Background Image: Red Rose with Dew Drops */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={visuals.testimonials.backgroundImage}
            alt="Customer reviews"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-40 mix-blend-screen"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#2A080E]/90 via-[#3D0A14]/75 to-[#1A0409]/95" />

          {/* Testimonial Quote Carousel */}
          <div className="relative z-10 max-w-3xl text-white space-y-6">
            <div className="flex items-center justify-center gap-1 text-[#F59E0B]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
            </div>

            <div className="min-h-[120px] flex items-center justify-center">
              <blockquote className="text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-snug text-white">
                “{testimonialsList[currentReview]?.quote}”
              </blockquote>
            </div>

            <div className="space-y-1">
              <cite className="not-italic text-sm sm:text-base font-bold text-rose-200 block">
                — {testimonialsList[currentReview]?.author}
              </cite>
              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-semibold uppercase tracking-wider">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {testimonialsList[currentReview]?.badge}
              </span>
            </div>

            {/* Carousel Dots */}
            <div className="flex items-center justify-center gap-2.5 pt-4">
              {testimonialsList.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentReview(i)}
                  className={`transition-all rounded-full ${
                    currentReview === i
                      ? "w-8 h-2 bg-white"
                      : "w-2 h-2 bg-white/40 hover:bg-white/80"
                  }`}
                  aria-label={`Go to review ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Write a Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 border border-slate-100 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-black text-gray-900">Write a Customer Review</h3>
              <button
                onClick={() => setShowReviewModal(false)}
                className="text-gray-400 hover:text-gray-600 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const selProd = products.find((p) => p.id === reviewProductId);
                const added = dataStore.addReview({
                  productId: reviewProductId,
                  productName: selProd?.name || "EBL Formulation",
                  userName: reviewAuthor.trim() || "Verified Patient",
                  rating: reviewRating,
                  title: reviewTitle.trim() || "Quality Pharmaceutical Formulation",
                  body: reviewBody.trim(),
                });
                setCustomerReviews((prev) => [added, ...prev]);
                setShowReviewModal(false);
                setReviewAuthor("");
                setReviewTitle("");
                setReviewBody("");
              }}
              className="space-y-4"
            >
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Select Product</label>
                <select
                  value={reviewProductId}
                  onChange={(e) => setReviewProductId(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-200 outline-none focus:border-[#E11D48] bg-white font-medium text-slate-800"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  value={reviewAuthor}
                  onChange={(e) => setReviewAuthor(e.target.value)}
                  placeholder="e.g. Dr. Rajesh Kumar"
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-200 outline-none focus:border-[#E11D48]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className="p-1 cursor-pointer"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= reviewRating ? "fill-amber-400 text-amber-400" : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Review Headline</label>
                <input
                  type="text"
                  required
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  placeholder="e.g. Rapid acid relief and zero chalkiness"
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-200 outline-none focus:border-[#E11D48]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Detailed Feedback</label>
                <textarea
                  rows={3}
                  required
                  value={reviewBody}
                  onChange={(e) => setReviewBody(e.target.value)}
                  placeholder="Describe your clinical outcome or experience with this formulation..."
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-200 outline-none focus:border-[#E11D48]"
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
                  className="bg-[#E11D48] hover:bg-[#C4153C] text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-md"
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
