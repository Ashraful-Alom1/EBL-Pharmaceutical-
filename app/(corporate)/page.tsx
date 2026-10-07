"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Download,
  Play,
  Pause,
  Volume2,
  VolumeX,
  CheckCircle2,
  Pill,
  Heart,
  Atom,
  PawPrint,
  Sprout,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { COMPANY_INFO } from "@/lib/constants";

export default function CorporateHomePage() {
  // Swiper state for Card 1 (R&D Excellence)
  const [card1Slide, setCard1Slide] = useState(0);
  const card1Items = [
    { num: "740+", text: "Scientists" },
    { num: "07", text: "Top Notch R&D Centers" },
    { num: "918", text: "Product Filings Worldwide" },
  ];

  // Swiper state for Card 2 (Eastern Biochemicals Impact)
  const [card2Slide, setCard2Slide] = useState(0);
  const card2Items = [
    { num: "200+", text: "Speciality Drugs for Tier 2-3 Cities in India" },
    { num: "Highest", text: "Coverage in Tier II - Tier IV cities & rural markets" },
    { num: "44", text: "Billion units installed capacity" },
  ];

  // Sustainability slider state
  const [sustainSlide, setSustainSlide] = useState(0);
  const sustainCards = [
    {
      label: "Climate Action",
      title: "Building a Decarbonized Society",
      date: "BLOG | Nov 2024",
      image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80",
    },
    {
      label: "Circular Economy",
      title: "Embracing Waste Reduction and Circularity",
      date: "BLOG | Nov 2024",
      image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop&q=80",
    },
    {
      label: "Resource Management",
      title: "Preserving Our Ecosystem & Pure Water",
      date: "BLOG | Nov 2024",
      image: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=800&auto=format&fit=crop&q=80",
    },
    {
      label: "Employee Safety",
      title: "Ensuring Employee and Partner Wellbeing: Zero-Impact",
      date: "BLOG | Nov 2024",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80",
    },
    {
      label: "Supplier Assessments",
      title: "Strengthening Our Supply Chain for Sustainable Growth",
      date: "BLOG | Nov 2024",
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80",
    },
  ];

  // Audio player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState("1.0");
  const [audioProgress, setAudioProgress] = useState(25);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Auto-cycle the stat cards every 5s
  useEffect(() => {
    const timer = setInterval(() => {
      setCard1Slide((prev) => (prev + 1) % card1Items.length);
      setCard2Slide((prev) => (prev + 1) % card2Items.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [card1Items.length, card2Items.length]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleSpeedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const speed = parseFloat(e.target.value);
    setPlaybackSpeed(e.target.value);
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  };

  return (
    <div className="flex flex-col bg-white">
      {/* ============================================================== */}
      {/* 1. HERO SECTION (Eastern Biochemicals) */}
      {/* ============================================================== */}
      <section className="bg-white pt-6 pb-16">
        <div className="max-w-[1320px] mx-auto px-3 sm:px-6">
          {/* Framed Video Container */}
          <div className="relative w-full rounded-[20px] sm:rounded-[36px] overflow-hidden shadow-2xl bg-[#060e42] aspect-[16/10] sm:aspect-[16/9] md:aspect-[21/9] min-h-[260px] sm:min-h-[380px] md:min-h-[500px] flex items-center justify-center">
            <video
              muted
              loop
              autoPlay
              playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-80"
              poster="https://www.mankindpharma.com/wp-content/uploads/2024/11/kma.webp"
            >
              <source
                src="https://www.mankindpharma.com/wp-content/uploads/2024/12/kma_2Ou0cIpo.mp4"
                type="video/mp4"
              />
            </video>

            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />
            <div className="absolute inset-0 bg-radial from-transparent to-[#081997]/40 mix-blend-overlay" />

            {/* Overlaid Headline */}
            <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto space-y-2 sm:space-y-4">
              <div className="text-white text-xs sm:text-lg md:text-2xl font-light tracking-wide opacity-90 drop-shadow">
                Advancing Healthcare and Better Science for a
              </div>
              <h1 className="text-2xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight drop-shadow-md leading-tight">
                Healthier Bharat
              </h1>
            </div>

            {/* Floating Scroll Cue */}
            <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-8 hidden sm:flex items-center gap-2 text-white/80 text-xs font-semibold uppercase tracking-widest bg-black/30 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">
              <svg className="w-3.5 h-3.5 animate-bounce" viewBox="0 0 16 16" fill="none">
                <path d="M8 2V14M8 14L3 9M8 14L13 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>scroll</span>
            </div>
          </div>

          {/* Under-Hero Statement & CTA */}
          <div className="mt-8 sm:mt-16 text-center max-w-4xl mx-auto space-y-4 sm:space-y-6 px-3">
            <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-[#0B0B0F] tracking-tight leading-snug">
              Eastern Biochemicals, where every stride is a step towards better science and a healthier, resilient Bharat.
            </h2>
            <div>
              <Link
                href="/about"
                className="btn-pill-primary shadow-lg inline-flex items-center gap-2 text-xs sm:text-sm px-6 sm:px-9 h-11 sm:h-13"
              >
                <span>LEARN MORE</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. R&D & INNOVATION SECTION */}
      {/* ============================================================== */}
      <section className="bg-white py-20 border-t border-gray-100">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6">
          {/* Section Header with Rotating ISO Seal */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div>
              <span className="text-[#081997] text-xs font-bold uppercase tracking-[0.2em] block mb-2">
                R&D & INNOVATION
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0B0B0F] tracking-tight leading-tight">
                We seek out, and solve,<br />
                tough challenges.
              </h2>
            </div>

            {/* Rotating ISO Stamp */}
            <div className="relative w-28 h-28 flex items-center justify-center shrink-0 self-start md:self-auto">
              <div className="absolute inset-0 animate-spin-slow">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <path
                    id="circlePath"
                    d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                    fill="none"
                  />
                  <text className="text-[9px] uppercase tracking-[2.5px] fill-[#081997] font-bold">
                    <textPath href="#circlePath" startOffset="0%">
                      • ISO-45001 CERTIFIED • QUALITY EXCELLENCE
                    </textPath>
                  </text>
                </svg>
              </div>
              <div className="w-14 h-14 rounded-full bg-[#081997] text-white flex flex-col items-center justify-center font-bold text-[10px] leading-tight shadow-md">
                <span>ISO</span>
                <span className="text-[8px] font-medium text-cyan-300">45001</span>
              </div>
            </div>
          </div>

          {/* 3-Cards: Horizontal Swipeable on Mobile, 3-Columns on Desktop */}
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 lg:grid lg:grid-cols-3 lg:gap-6 no-scrollbar">
            {/* Card 1: R&D Excellence (Swiper Card) */}
            <div className="w-[84vw] sm:w-[380px] lg:w-auto shrink-0 snap-center relative rounded-[22px] sm:rounded-[24px] overflow-hidden bg-[#060e42] text-white p-6 sm:p-10 min-h-[320px] lg:min-h-[380px] flex flex-col justify-between shadow-xl">
              <video
                muted
                loop
                autoPlay
                playsInline
                className="absolute inset-0 w-full h-full object-cover opacity-35"
                poster="https://www.mankindpharma.com/wp-content/uploads/2024/12/poster-1.png"
              >
                <source
                  src="https://www.mankindpharma.com/wp-content/uploads/2024/11/DNA_L_V2.mp4"
                  type="video/mp4"
                />
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

              <div className="relative z-10">
                <h3 className="text-xl sm:text-2xl font-black tracking-tight uppercase leading-tight">
                  R&D<br />EXCELLENCE
                </h3>
              </div>

              <div className="relative z-10 my-auto py-6">
                <div className="text-5xl sm:text-6xl font-black text-white tracking-tight mb-2">
                  {card1Items[card1Slide].num}
                </div>
                <div className="text-sm font-semibold text-gray-200">
                  {card1Items[card1Slide].text}
                </div>
              </div>

              {/* Dots Pagination */}
              <div className="relative z-10 flex items-center gap-2">
                {card1Items.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCard1Slide(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      card1Slide === idx ? "w-8 bg-white" : "w-2 bg-white/40"
                    }`}
                    aria-label={`Slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Card 2: Eastern Biochemicals Impact (Swiper Card) */}
            <div className="w-[84vw] sm:w-[380px] lg:w-auto shrink-0 snap-center relative rounded-[22px] sm:rounded-[24px] overflow-hidden bg-[#060e42] text-white p-6 sm:p-10 min-h-[320px] lg:min-h-[380px] flex flex-col justify-between shadow-xl">
              <video
                muted
                loop
                autoPlay
                playsInline
                className="absolute inset-0 w-full h-full object-cover opacity-35"
                poster="https://www.mankindpharma.com/wp-content/uploads/2024/12/poster-2.png"
              >
                <source
                  src="https://www.mankindpharma.com/wp-content/uploads/2024/11/DNA_R_V2.mp4"
                  type="video/mp4"
                />
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

              <div className="relative z-10">
                <h3 className="text-xl sm:text-2xl font-black tracking-tight uppercase leading-tight">
                  EASTERN BIOCHEMICALS<br />IMPACT
                </h3>
              </div>

              <div className="relative z-10 my-auto py-6">
                <div className="text-5xl sm:text-6xl font-black text-white tracking-tight mb-2">
                  {card2Items[card2Slide].num}
                </div>
                <div className="text-sm font-semibold text-gray-200">
                  {card2Items[card2Slide].text}
                </div>
              </div>

              {/* Dots Pagination */}
              <div className="relative z-10 flex items-center gap-2">
                {card2Items.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCard2Slide(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      card2Slide === idx ? "w-8 bg-white" : "w-2 bg-white/40"
                    }`}
                    aria-label={`Slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Card 3: R&D Highlights (Highlight Card with Video) */}
            <div className="w-[84vw] sm:w-[380px] lg:w-auto shrink-0 snap-center relative rounded-[22px] sm:rounded-[24px] overflow-hidden bg-[#081997] text-white p-6 sm:p-10 min-h-[320px] lg:min-h-[380px] flex flex-col justify-between shadow-xl group">
              <video
                muted
                loop
                autoPlay
                playsInline
                className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700"
                poster="https://www.mankindpharma.com/wp-content/uploads/2024/11/rd.webp"
              >
                <source
                  src="https://www.mankindpharma.com/wp-content/uploads/2024/11/rd.mp4"
                  type="video/mp4"
                />
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-[#081997] via-[#081997]/70 to-transparent" />

              <div className="relative z-10">
                <h3 className="text-xl sm:text-2xl font-black tracking-tight uppercase leading-tight">
                  R&D<br />HIGHLIGHTS
                </h3>
              </div>

              <div className="relative z-10 space-y-6">
                <p className="text-lg font-bold text-white/95 leading-relaxed">
                  First in India to develop and commercialize advanced specialized biochemical intermediates.
                </p>

                <div>
                  <Link
                    href="/rnd"
                    className="inline-flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider group-hover:text-cyan-300 transition-colors"
                  >
                    <span>LEARN MORE</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 group-hover:-rotate-45 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. INNOVATING FOR THE WORLD (video_content split banner) */}
      {/* ============================================================== */}
      <section className="bg-white py-16">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-5 space-y-6">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0B0B0F] tracking-tight leading-tight">
                Innovating <br />
                for the world
              </h2>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                The obsession with innovative healthcare solutions has made us a trusted bio-pharmaceutical partner in India. We are architects of the future, setting new benchmarks in pharmaceutical excellence with drug discovery, advanced formulations, generic APIs, and biotechnology.
              </p>
            </div>

            {/* Right Video Container */}
            <div className="lg:col-span-7">
              <div className="relative rounded-[24px] md:rounded-[32px] overflow-hidden aspect-[16/9] shadow-xl bg-black">
                <video
                  muted
                  loop
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                  poster="https://www.mankindpharma.com/wp-content/uploads/2024/11/bharat.webp"
                >
                  <source
                    src="https://www.mankindpharma.com/wp-content/uploads/2024/11/bharat.mp4"
                    type="video/mp4"
                  />
                </video>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 4. OUR PROMISE SECTION (promise with light_grey_bg) */}
      {/* ============================================================== */}
      <section className="bg-[#EDF2F6] py-24">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-[#081997] text-xs font-bold uppercase tracking-[0.2em]">
              OUR PROMISE
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0B0B0F] tracking-tight leading-tight">
              Leave no citizen behind in the<br />
              journey towards a healthier nation.
            </h2>
          </div>

          {/* 3 Promise Cards: Horizontal Swipeable on Mobile, 3-Columns on Desktop */}
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 md:grid md:grid-cols-3 md:gap-8 no-scrollbar">
            {/* Promise 1: Quality */}
            <div className="w-[82vw] sm:w-[340px] md:w-auto shrink-0 snap-center bg-white rounded-[20px] sm:rounded-[24px] p-6 sm:p-8 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-4 sm:space-y-6">
                <div className="relative w-full rounded-2xl overflow-hidden aspect-[4/3] bg-black">
                  <video
                    muted
                    loop
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  >
                    <source
                      src="https://www.mankindpharma.com/wp-content/uploads/2024/11/quality-1.mp4"
                      type="video/mp4"
                    />
                  </video>
                  <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full shadow">
                    <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#081997]" />
                    <span className="text-[11px] sm:text-xs font-bold text-gray-900 uppercase">Quality</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Our non-compromising approach to quality ensures that we are constantly endeavoring to achieve and maintain the highest quality standards in the pharmaceutical industry in India.
                </p>
              </div>
            </div>

            {/* Promise 2: Affordability */}
            <div className="w-[82vw] sm:w-[340px] md:w-auto shrink-0 snap-center bg-white rounded-[20px] sm:rounded-[24px] p-6 sm:p-8 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-4 sm:space-y-6">
                <div className="relative w-full rounded-2xl overflow-hidden aspect-[4/3] bg-black">
                  <video
                    muted
                    loop
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  >
                    <source
                      src="https://www.mankindpharma.com/wp-content/uploads/2024/11/affordability.mp4"
                      type="video/mp4"
                    />
                  </video>
                  <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full shadow">
                    <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#081997]" />
                    <span className="text-[11px] sm:text-xs font-bold text-gray-900 uppercase">Affordability</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Staying true to our founding principles of being a price disruptor, we deliver affordable medication and healthcare formulations that meet the healthcare needs of Bharat.
                </p>
              </div>
            </div>

            {/* Promise 3: Accessibility */}
            <div className="w-[82vw] sm:w-[340px] md:w-auto shrink-0 snap-center bg-white rounded-[20px] sm:rounded-[24px] p-6 sm:p-8 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-4 sm:space-y-6">
                <div className="relative w-full rounded-2xl overflow-hidden aspect-[4/3] bg-black">
                  <video
                    muted
                    loop
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  >
                    <source
                      src="https://www.mankindpharma.com/wp-content/uploads/2024/11/accessibility.mp4"
                      type="video/mp4"
                    />
                  </video>
                  <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full shadow">
                    <Atom className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#081997]" />
                    <span className="text-[11px] sm:text-xs font-bold text-gray-900 uppercase">Accessibility</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  More than 50% of India’s total population resides in villages, making access to medicines difficult. Eastern Biochemicals&apos; pioneering use of supply chains and a dedicated distribution setup bolsters accessibility.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 5. OUR BUSINESS VERTICALS (verticals dark layout with video) */}
      {/* ============================================================== */}
      <section className="relative bg-[#060e42] text-white py-28 overflow-hidden">
        {/* Looping video backdrop */}
        <video
          muted
          loop
          autoPlay
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-25"
          poster="https://www.mankindpharma.com/wp-content/uploads/2024/11/rd.webp"
        >
          <source
            src="https://www.mankindpharma.com/wp-content/uploads/2024/11/business.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-[#060e42] via-[#060e42]/90 to-[#081997]/80" />

        <div className="relative z-10 max-w-[1320px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Header */}
            <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                Our Business <br />
                Verticals
              </h2>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                We excel in developing, manufacturing and marketing a diverse range of pharmaceutical formulations across various acute and chronic therapeutic areas, as well as several consumer healthcare products.
              </p>
              <div className="pt-2">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 bg-[#E01B47] hover:bg-[#C4153C] text-white px-7 py-3 rounded-full text-xs font-bold tracking-wider uppercase shadow-lg transition-all"
                >
                  <span>BROWSE SHOP CATALOG</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Right Cards Grid: Compact 2-column grid on mobile */}
            <div className="lg:col-span-8 grid grid-cols-2 gap-3 sm:gap-6">
              {/* Vertical 1: Formulations */}
              <Link
                href="/shop?category=formulations"
                className="glass-card-dark rounded-xl sm:rounded-2xl p-4 sm:p-7 flex flex-col justify-between hover:translate-y-[-4px] transition-all group"
              >
                <div>
                  <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-white/10 flex items-center justify-center mb-3 sm:mb-5 text-cyan-300 group-hover:scale-110 transition-transform">
                    <Pill className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <h3 className="text-sm sm:text-xl font-bold text-white mb-1.5 sm:mb-2">Formulations</h3>
                  <p className="text-[11px] sm:text-xs text-gray-300 leading-relaxed line-clamp-3 sm:line-clamp-none">
                    A range of pharmaceutical formulations across acute and chronic therapeutic areas.
                  </p>
                </div>
                <div className="pt-3 sm:pt-6 flex items-center justify-between text-[11px] sm:text-xs font-semibold text-cyan-300">
                  <span>Explore</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* Vertical 2: Consumer Healthcare */}
              <Link
                href="/shop?category=wellness"
                className="glass-card-dark rounded-xl sm:rounded-2xl p-4 sm:p-7 flex flex-col justify-between hover:translate-y-[-4px] transition-all group"
              >
                <div>
                  <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-white/10 flex items-center justify-center mb-3 sm:mb-5 text-rose-300 group-hover:scale-110 transition-transform">
                    <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <h3 className="text-sm sm:text-xl font-bold text-white mb-1.5 sm:mb-2">Consumer Health</h3>
                  <p className="text-[11px] sm:text-xs text-gray-300 leading-relaxed line-clamp-3 sm:line-clamp-none">
                    Non-prescription segment from daily wellness essentials to preventive diagnostics.
                  </p>
                </div>
                <div className="pt-3 sm:pt-6 flex items-center justify-between text-[11px] sm:text-xs font-semibold text-rose-300">
                  <span>Explore</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* Vertical 3: APIs */}
              <Link
                href="/rnd"
                className="glass-card-dark rounded-xl sm:rounded-2xl p-4 sm:p-7 flex flex-col justify-between hover:translate-y-[-4px] transition-all group"
              >
                <div>
                  <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-white/10 flex items-center justify-center mb-3 sm:mb-5 text-purple-300 group-hover:scale-110 transition-transform">
                    <Atom className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <h3 className="text-sm sm:text-xl font-bold text-white mb-1.5 sm:mb-2">Active APIs</h3>
                  <p className="text-[11px] sm:text-xs text-gray-300 leading-relaxed line-clamp-3 sm:line-clamp-none">
                    High-quality Active Pharmaceutical Ingredients for affordable, innovative medicines.
                  </p>
                </div>
                <div className="pt-3 sm:pt-6 flex items-center justify-between text-[11px] sm:text-xs font-semibold text-purple-300">
                  <span>Learn more</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* Vertical 4: Veterinary Care */}
              <Link
                href="/shop"
                className="glass-card-dark rounded-xl sm:rounded-2xl p-4 sm:p-7 flex flex-col justify-between hover:translate-y-[-4px] transition-all group"
              >
                <div>
                  <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-white/10 flex items-center justify-center mb-3 sm:mb-5 text-amber-300 group-hover:scale-110 transition-transform">
                    <ShieldAlert className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <h3 className="text-sm sm:text-xl font-bold text-white mb-1.5 sm:mb-2">Veterinary Care</h3>
                  <p className="text-[11px] sm:text-xs text-gray-300 leading-relaxed line-clamp-3 sm:line-clamp-none">
                    Comprehensive offerings include nutritional supplements, anti-infectives and dewormers.
                  </p>
                </div>
                <div className="pt-3 sm:pt-6 flex items-center justify-between text-[11px] sm:text-xs font-semibold text-amber-300">
                  <span>Explore</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* Vertical 5: Pet Care */}
              <Link
                href="/shop"
                className="glass-card-dark rounded-xl sm:rounded-2xl p-4 sm:p-7 flex flex-col justify-between hover:translate-y-[-4px] transition-all group"
              >
                <div>
                  <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-white/10 flex items-center justify-center mb-3 sm:mb-5 text-emerald-300 group-hover:scale-110 transition-transform">
                    <PawPrint className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <h3 className="text-sm sm:text-xl font-bold text-white mb-1.5 sm:mb-2">Pet Care</h3>
                  <p className="text-[11px] sm:text-xs text-gray-300 leading-relaxed line-clamp-3 sm:line-clamp-none">
                    Supporting the pet care ecosystem with nutritious food, wellness and grooming products.
                  </p>
                </div>
                <div className="pt-3 sm:pt-6 flex items-center justify-between text-[11px] sm:text-xs font-semibold text-emerald-300">
                  <span>Explore</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* Vertical 6: Agritech */}
              <Link
                href="/rnd"
                className="glass-card-dark rounded-xl sm:rounded-2xl p-4 sm:p-7 flex flex-col justify-between hover:translate-y-[-4px] transition-all group"
              >
                <div>
                  <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-white/10 flex items-center justify-center mb-3 sm:mb-5 text-lime-300 group-hover:scale-110 transition-transform">
                    <Sprout className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <h3 className="text-sm sm:text-xl font-bold text-white mb-1.5 sm:mb-2">Agritech</h3>
                  <p className="text-[11px] sm:text-xs text-gray-300 leading-relaxed line-clamp-3 sm:line-clamp-none">
                    Agri-input and crop protection demands for safe, sustainable crop production.
                  </p>
                </div>
                <div className="pt-3 sm:pt-6 flex items-center justify-between text-[11px] sm:text-xs font-semibold text-lime-300">
                  <span>Learn more</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 6. SUSTAINABILITY SPOTLIGHT (sustainability carousel) */}
      {/* ============================================================== */}
      <section className="bg-white py-24">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6">
          {/* Header with Navigation Controls */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
            <div>
              <span className="text-[#081997] text-xs font-bold uppercase tracking-[0.2em] block mb-2">
                SUSTAINABILITY SPOTLIGHT
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0B0B0F] tracking-tight">
                Committed to Creating Value<br />
                for People and Planet
              </h2>
            </div>

            {/* Slider Next/Prev Arrows */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSustainSlide((prev) => (prev > 0 ? prev - 1 : sustainCards.length - 3))}
                className="w-12 h-12 rounded-full bg-[#081997] text-white flex items-center justify-center hover:bg-[#0c22c7] transition-all shadow-md active:scale-95"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setSustainSlide((prev) => (prev < sustainCards.length - 3 ? prev + 1 : 0))}
                className="w-12 h-12 rounded-full bg-[#081997] text-white flex items-center justify-center hover:bg-[#0c22c7] transition-all shadow-md active:scale-95"
                aria-label="Next Slide"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Cards Slider Container */}
          <div className="overflow-hidden">
            <div
              className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6 transition-transform duration-500 no-scrollbar"
            >
              {sustainCards.slice(sustainSlide, sustainSlide + 3).map((item, idx) => (
                <div
                  key={idx}
                  className="w-[82vw] sm:w-[320px] md:w-auto shrink-0 snap-center bg-white rounded-[20px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5 sm:p-7 space-y-3 sm:space-y-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#081997] block">
                      {item.label}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-snug group-hover:text-[#081997] transition-colors">
                      {item.title}
                    </h3>
                    <div className="text-[11px] text-gray-400 font-medium pt-2 border-t border-gray-100">
                      {item.date}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 7. ESG REPORT DOWNLOAD BANNER (download_report_layer) */}
      {/* ============================================================== */}
      <section className="bg-white pb-20">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6">
          <div className="bg-[#EDF2F6] rounded-[28px] p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm border border-gray-200/50">
            <h3 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight text-center md:text-left">
              Our Environment, Social and<br className="hidden sm:block" />
              Governance Strategy
            </h3>
            <a
              href="/corporate-info#statutory"
              className="bg-white hover:bg-gray-50 text-[#081997] border border-gray-200 px-8 py-5 rounded-full font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all inline-flex items-center gap-3 shrink-0"
            >
              <span>DOWNLOAD 2025-26 ESG REPORT</span>
              <Download className="w-4 h-4 text-[#081997]" />
            </a>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 8. CAREERS SECTION (content_grid v2 with light_grey_bg) */}
      {/* ============================================================== */}
      <section className="bg-[#EDF2F6] py-24">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6">
              <h2 className="text-3xl sm:text-5xl font-black text-[#0B0B0F] tracking-tight leading-tight">
                Join us, <br />
                fuel the future.
              </h2>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                Eastern Biochemicals is not just a workplace. It’s a frontier of innovation. And by joining us, you will be one of the trailblazers using science to shape a healthier Bharat.
              </p>

              {/* Bullet Checklist */}
              <ul className="space-y-3.5 text-sm font-semibold text-gray-800">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#081997] shrink-0" />
                  <span>Nurturing growth in a world-class environment</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#081997] shrink-0" />
                  <span>Industry-leading compensation and perks</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#081997] shrink-0" />
                  <span>Innovation that impacts global healthcare</span>
                </li>
              </ul>

              <div className="pt-4">
                <Link
                  href="/careers"
                  className="btn-pill-primary inline-flex items-center gap-2 shadow-lg"
                >
                  <span>VIEW OPEN POSITIONS</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Video Container */}
            <div className="lg:col-span-6">
              <div className="relative rounded-[24px] md:rounded-[32px] overflow-hidden aspect-[4/3] bg-black shadow-xl">
                <video
                  muted
                  loop
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                  poster="https://www.mankindpharma.com/wp-content/uploads/2024/11/future.webp"
                >
                  <source
                    src="https://www.mankindpharma.com/wp-content/uploads/2024/12/future_HzhzuoHT.mp4"
                    type="video/mp4"
                  />
                </video>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 9. EARNINGS AUDIO PLAYER & ANNUAL REPORT (annual_grid_layer) */}
      {/* ============================================================== */}
      <section className="bg-[#EDF2F6] pb-24">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left: Interactive Earnings Call Audio Player */}
            <div className="lg:col-span-7 bg-white rounded-[24px] p-6 sm:p-8 shadow-sm flex flex-col justify-between border border-gray-100">
              <audio
                ref={audioRef}
                src="/media/ebl-earnings-briefing.mp3"
                preload="metadata"
                onTimeUpdate={() => {
                  if (audioRef.current) {
                    const current = audioRef.current.currentTime;
                    const duration = audioRef.current.duration || 100;
                    setAudioProgress((current / duration) * 100);
                  }
                }}
              />

              {/* Progress Slider */}
              <div className="mb-6">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={audioProgress}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setAudioProgress(val);
                    if (audioRef.current && audioRef.current.duration) {
                      audioRef.current.currentTime = (val / 100) * audioRef.current.duration;
                    }
                  }}
                  className="w-full h-1.5 bg-gray-200 rounded-lg audio-seek-slider"
                />
              </div>

              {/* Controls Row */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {/* Play/Pause Button */}
                  <button
                    onClick={togglePlay}
                    className="w-14 h-14 rounded-full bg-[#081997] hover:bg-[#0c22c7] text-white flex items-center justify-center shadow-md transition-all active:scale-95"
                    aria-label={isPlaying ? "Pause Earnings Audio" : "Play Earnings Audio"}
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                  </button>

                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#081997] block">
                      Listen to
                    </span>
                    <h4 className="text-sm sm:text-base font-bold text-gray-900 leading-tight">
                      Our Latest Earnings Call - Q4 FY26
                    </h4>
                    <div className="text-xs text-gray-400 font-mono mt-0.5">
                      0:24 / 01 : 08 : 00
                    </div>
                  </div>
                </div>

                {/* Right Mute & Speed Controls */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={toggleMute}
                    className="w-10 h-10 rounded-full border border-gray-200 hover:border-[#081997] text-gray-600 flex items-center justify-center transition-colors"
                    aria-label={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4" />}
                  </button>

                  <select
                    value={playbackSpeed}
                    onChange={handleSpeedChange}
                    className="border border-gray-200 rounded-full px-3 py-2 text-xs font-bold text-gray-700 bg-white cursor-pointer focus:outline-none focus:border-[#081997]"
                  >
                    <option value="1.0">1.0X</option>
                    <option value="1.5">1.5X</option>
                    <option value="2.0">2.0X</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Right: Annual Report Card & Entity Status */}
            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Annual Report Download */}
              <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">
                    Annual Report
                  </span>
                  <div className="text-2xl font-black text-gray-900">
                    FY 25-26
                  </div>
                </div>

                <div className="pt-6">
                  <a
                    href="/corporate-info#annual-reports"
                    className="w-12 h-12 rounded-full bg-[#081997] hover:bg-[#0c22c7] text-white flex items-center justify-center transition-all shadow-md group"
                    title="Download Annual Report"
                  >
                    <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
                  </a>
                </div>
              </div>

              {/* Entity Status / Corporate Info */}
              <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
                <div>
                  <h4 className="font-extrabold text-gray-900 text-sm leading-tight">
                    Eastern Biochemicals Ltd
                  </h4>
                  <p className="text-[11px] font-mono text-gray-400 mt-1">
                    CIN: {COMPANY_INFO.cin}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">ROC:</span>
                    <span className="text-xs font-bold text-gray-800">{COMPANY_INFO.roc}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-500">Status:</span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Active (Unlisted)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
