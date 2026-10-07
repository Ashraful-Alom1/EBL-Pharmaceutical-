"use client";

import React, { useId } from "react";

interface EblLogoProps {
  className?: string;
  variant?: "light" | "dark";
  showText?: boolean;
}

export default function EblLogo({
  className = "h-11",
  variant = "light",
  showText = true,
}: EblLogoProps) {
  const clipId = useId();
  // Ensure the logo text integrates cleanly with themes
  const eblColor = variant === "dark" ? "#FFFFFF" : "#0A1B8F";
  const subtextColor = variant === "dark" ? "#94A3B8" : "#64748B";
  const capsuleStroke = variant === "dark" ? "#FFFFFF" : "#0A1B8F";
  const dotColor = variant === "dark" ? "#0F172A" : "#FFFFFF";

  // The capsule symbol alone
  const emblem = (
    <>
      <defs>
        <clipPath id={`emblem-${clipId}`}>
          <rect x="0" y="5" width="30" height="60" rx="15" />
        </clipPath>
      </defs>

      <g clipPath={`url(#emblem-${clipId})`}>
        <rect x="0" y="5" width="30" height="30" fill="#0094D6" />
        <rect x="0" y="35" width="30" height="30" fill="#16A34A" />
        {/* Decorative dots in bottom half */}
        <circle cx="9" cy="46" r="3.5" fill={dotColor} />
        <line x1="7" y1="44" x2="11" y2="48" stroke="#16A34A" strokeWidth="1" />
        <circle cx="21" cy="42" r="2.5" fill={dotColor} />
        <circle cx="22" cy="51" r="2.5" fill={dotColor} />
        <circle cx="15" cy="55" r="2.5" fill={dotColor} />
      </g>

      <rect
        x="0"
        y="5"
        width="30"
        height="60"
        rx="15"
        stroke={capsuleStroke}
        strokeWidth="3"
        fill="none"
      />

      {/* Medical Cross (+): Placed slightly inside the capsule from the top right */}
      {/* Centered around x=26, y=18 */}
      <path
        d="M23 15 h6 v-6 h5 v6 h6 v5 h-6 v6 h-5 v-6 h-6 z"
        fill="#22C55E"
        stroke={capsuleStroke}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </>
  );

  if (!showText) {
    return (
      <div className={`inline-flex items-center justify-center shrink-0 bg-transparent ${className}`}>
        <svg
          viewBox="-2 -2 46 74"
          className="h-full w-auto max-h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="EBL Emblem"
          suppressHydrationWarning
        >
          {emblem}
        </svg>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center shrink-0 bg-transparent ${className}`}>
      <svg
        viewBox="-2 -2 280 74"
        className="h-full w-auto max-h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="EBL Pharmaceutical"
        suppressHydrationWarning
      >
        {emblem}

        {/* ================= TYPOGRAPHY ================= */}
        {/* Text avoids overlapping by starting at x = 54 */}
        <text
          x="54"
          y="42"
          fill={eblColor}
          fontFamily="system-ui, -apple-system, 'Inter', sans-serif"
          fontWeight="900"
          fontSize="38"
          letterSpacing="0.01em"
        >
          EASTERN
        </text>

        <text
          x="56"
          y="62"
          fill={subtextColor}
          fontFamily="system-ui, -apple-system, 'Inter', sans-serif"
          fontWeight="700"
          fontSize="12.5"
          letterSpacing="0.28em"
        >
          BIOCHEMICALS
        </text>
      </svg>
    </div>
  );
}
