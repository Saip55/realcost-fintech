import React from "react";

export interface RealCostCardProps {
  className?: string;
  onClick?: () => void;
}

export function RealCostCard({ className = "", onClick }: RealCostCardProps) {
  return (
    <div
      className={`relative w-full max-w-md h-96 flex items-center justify-center ${className}`}
      onClick={onClick}
    >
      {/* Globe Background */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-80 h-80 select-none">
          {/* Globe sphere with gradient */}
          <svg
            viewBox="0 0 200 200"
            className="w-full h-full"
            style={{
              filter: "drop-shadow(0 10px 30px rgba(0,0,0,0.15))",
            }}
          >
            {/* Ocean base */}
            <defs>
              <radialGradient id="globeGradient" cx="40%" cy="40%">
                <stop offset="0%" stopColor="#87ceeb" />
                <stop offset="100%" stopColor="#1e90ff" />
              </radialGradient>
              <radialGradient id="sphereShine" cx="35%" cy="35%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </radialGradient>
            </defs>

            {/* Main sphere */}
            <circle cx="100" cy="100" r="95" fill="url(#globeGradient)" />

            {/* Land masses (simplified) */}
            <ellipse cx="70" cy="60" rx="35" ry="40" fill="#90ee90" opacity="0.9" />
            <ellipse cx="80" cy="80" rx="25" ry="30" fill="#7cb342" opacity="0.9" />
            <ellipse cx="60" cy="100" rx="30" ry="35" fill="#558b2f" opacity="0.8" />

            {/* Additional landmass details */}
            <path
              d="M 90 50 Q 110 60 120 75"
              stroke="#7cb342"
              strokeWidth="3"
              fill="none"
              opacity="0.7"
            />

            {/* Shine/reflection */}
            <circle cx="100" cy="100" r="95" fill="url(#sphereShine)" />

            {/* Highlight circle */}
            <circle cx="75" cy="70" r="15" fill="white" opacity="0.2" />
          </svg>
        </div>
      </div>

      {/* Card */}
      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-64 h-56 bg-gradient-to-br from-lime-200 to-lime-300 rounded-3xl shadow-2xl p-6 z-10 cursor-pointer transition-transform duration-300 hover:scale-105 border border-lime-400/40">
        {/* Card content */}
        <div className="flex flex-col justify-between h-full">
          {/* Top section with chip and contactless */}
          <div className="flex items-start justify-between">
            {/* EMV Chip */}
            <div className="w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-300 rounded-lg p-2 flex items-center justify-center shadow-md">
              <div className="grid grid-cols-2 gap-1">
                <div className="w-2 h-2 bg-gray-600 rounded-full" />
                <div className="w-2 h-2 bg-gray-600 rounded-full" />
                <div className="w-2 h-2 bg-gray-600 rounded-full" />
                <div className="w-2 h-2 bg-gray-600 rounded-full" />
              </div>
            </div>

            {/* Contactless symbol */}
            <div className="text-gray-800">
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M16 6v14M16 6c4.4 0 8 3.6 8 8" strokeLinecap="round" />
                <path d="M16 10c2.2 0 4 1.8 4 4" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          {/* Brand name */}
          <div className="text-right">
            <h2
              className="text-3xl font-bold text-gray-800 tracking-tight"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              realcost
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RealCostCard;
