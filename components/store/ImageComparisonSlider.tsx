"use client";

import React, { useState, useRef, useCallback } from "react";
import Image from "next/image";

interface ImageComparisonSliderProps {
  beforeImage?: string;
  afterImage?: string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
}

export default function ImageComparisonSlider({
  beforeImage = "/images/products/ebl-ultrathin-3d.jpg",
  afterImage = "/images/products/ebl-endurance-3d.jpg",
  beforeLabel = "Wrapper Struggle?",
  afterLabel = "Easy-Peel Buttercup",
  className = "",
}: ImageComparisonSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={() => setIsDragging(true)}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      className={`relative select-none overflow-hidden rounded-[20px] sm:rounded-[36px] shadow-2xl cursor-ew-resize border border-rose-100/60 aspect-[16/10] sm:aspect-[2.2/1] min-h-[220px] sm:min-h-[360px] md:min-h-[420px] bg-slate-900 ${className}`}
    >
      {/* 1. After Image (Background - Right / Struggle Ends) */}
      <div className="absolute inset-0 w-full h-full bg-[#18393D] flex items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={afterImage}
          alt={afterLabel}
          className="w-full h-full object-cover object-center pointer-events-none"
        />
        {/* Struggle Ends Overlay Badge */}
        <div className="absolute bottom-3 right-3 sm:bottom-8 sm:right-8 bg-black/50 backdrop-blur-md text-white px-3.5 py-1.5 sm:px-5 sm:py-2 rounded-full text-[10px] sm:text-xs font-bold tracking-wide pointer-events-none border border-white/20">
          <span>{afterLabel}</span>
        </div>
      </div>

      {/* 2. Before Image (Clipped overlay - Left / Wrapper Struggle) */}
      <div
        className="absolute inset-0 h-full overflow-hidden bg-[#EAE8E4]"
        style={{ width: `${sliderPosition}%` }}
      >
        <div
          className="absolute inset-0 h-full"
          style={{ width: containerRef.current ? `${containerRef.current.clientWidth}px` : "100%" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={beforeImage}
            alt={beforeLabel}
            className="w-full h-full object-cover object-center pointer-events-none"
          />
          {/* Wrapper Struggle Overlay Badge */}
          <div className="absolute bottom-3 left-3 sm:bottom-8 sm:left-8 bg-black/50 backdrop-blur-md text-white px-3.5 py-1.5 sm:px-5 sm:py-2 rounded-full text-[10px] sm:text-xs font-bold tracking-wide pointer-events-none border border-white/20">
            <span>{beforeLabel}</span>
          </div>
        </div>
      </div>

      {/* 3. Draggable Divider Handle */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_12px_rgba(0,0,0,0.5)] z-20 pointer-events-none"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white shadow-xl flex items-center justify-center border-2 border-slate-200 pointer-events-auto cursor-ew-resize hover:scale-110 active:scale-95 transition-transform">
          <div className="flex items-center gap-1">
            <span className="w-0.5 h-4 bg-slate-600 rounded-full" />
            <span className="w-0.5 h-4 bg-slate-600 rounded-full" />
            <span className="w-0.5 h-4 bg-slate-600 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
