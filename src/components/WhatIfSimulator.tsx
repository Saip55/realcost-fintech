import React, { useState } from "react";
import { CALCULATIONS, formatCurrency, formatFutureValue } from "@/lib/calculations";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface WhatIfSimulatorProps {
  expectedReturn?: number;
  projectionYears?: number;
  currencySymbol?: string;
  currencyCode?: string;
  profile?: {
    expectedReturn?: number;
    projectionYears?: number;
    currencySymbol?: string;
    currencyCode?: string;
  };
}

export const WhatIfSimulator: React.FC<WhatIfSimulatorProps> = ({
  expectedReturn = 7,
  projectionYears = 20,
  currencySymbol = "₹",
  currencyCode = "INR",
  profile,
}) => {
  const actualReturn = profile?.expectedReturn ?? expectedReturn;
  const actualYears = profile?.projectionYears ?? projectionYears;
  const actualSymbol = profile?.currencySymbol ?? currencySymbol;
  const actualCode = profile?.currencyCode ?? currencyCode;

  const [monthlyCut, setMonthlyCut] = useState<number>(500);

  const totalMonths = actualYears * 12;
  const futureCompoundValue = CALCULATIONS.lifetimeCost(monthlyCut, totalMonths, actualReturn);

  const formattedFuture = formatFutureValue(
    futureCompoundValue,
    0,
    0,
    currencySymbol,
    currencyCode,
  );

  const presets = [100, 250, 500, 1000, 2500, 5000];

  // Generate chart data points for 0, 5, 10, 15, 20, 25, 30 years
  const chartData = [5, 10, 15, 20, 25, 30].map((y) => {
    const months = y * 12;
    const investedCash = monthlyCut * months;
    const compounded = CALCULATIONS.lifetimeCost(monthlyCut, months, expectedReturn);
    const interestEarned = Math.max(0, compounded - investedCash);
    return {
      year: `Yr ${y}`,
      compounded,
      investedCash,
      interestEarned,
    };
  });

  return (
    <div
      className="glass-panel p-6 md:p-12 my-8 dark:bg-[#1e281b] dark:border-[#2d3a29]"
      id="what-if"
    >
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="badge-pill mb-3">
          <svg className="w-4 h-4 fill-[#83db28]" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          Interactive Wealth Engine
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#121910] dark:text-white tracking-tight">
          Cut Your Spending, Grow Your Wealth
        </h2>
        <p className="text-sm md:text-base text-[#5e6d56] dark:text-[#a0b396] mt-2">
          See the exponential compounding curve of cutting a small monthly habit and investing the
          savings for {projectionYears} years at {expectedReturn}% return.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto">
        {/* Visual Dial & Recharts Curve */}
        <div className="lg:col-span-5 flex flex-col items-center gap-6">
          <div className="visual-dial group hover:scale-105 transition-transform duration-300 dark:bg-[#28381e] dark:border-[#83db28]/40">
            <div className="visual-dial-inner dark:bg-[#1a2318]">
              <span className="text-xs uppercase font-bold tracking-widest text-[#5e6d56] dark:text-[#a0b396] mb-1">
                Save / Month
              </span>
              <div className="number text-3xl md:text-4xl font-mono text-[#121910] dark:text-white">
                {currencySymbol}
                {monthlyCut}
              </div>
              <div className="unit text-xs text-[#83db28] font-bold mt-1 font-mono">
                ➔ {formattedFuture}
              </div>
            </div>
          </div>

          {/* Micro Area Chart */}
          <div className="w-full h-36 bg-white/60 dark:bg-[#243021] p-3 rounded-2xl border border-[#dff5cf] dark:border-[#2d3a29]">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#5e6d56] dark:text-[#a0b396] mb-1 text-center">
              30-Year Compounding Curve
            </div>
            <ResponsiveContainer width="100%" height="80%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="compoundedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#83db28" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#83db28" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="year" tick={{ fontSize: 10 }} />
                <YAxis hide />
                <Tooltip
                  formatter={(val: number) => [
                    formatCurrency(val, currencySymbol, currencyCode),
                    "Compounded",
                  ]}
                  contentStyle={{
                    background: "#1a2318",
                    border: "1px solid #83db28",
                    borderRadius: "12px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="compounded"
                  stroke="#83db28"
                  fillOpacity={1}
                  fill="url(#compoundedGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Controls & Metrics */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          <div className="p-6 rounded-2xl bg-white/70 dark:bg-[#243021] border border-[#dff5cf] dark:border-[#2d3a29] shadow-sm mb-6">
            <div className="text-xs uppercase font-bold tracking-wide text-[#5e6d56] dark:text-[#a0b396] mb-1">
              Projected {projectionYears}-Year Compounded Value
            </div>
            <div className="text-3xl md:text-4xl font-black text-[#121910] dark:text-white font-mono tracking-tight">
              {formattedFuture}
            </div>
            <p className="text-xs text-[#5e6d56] dark:text-[#a0b396] mt-1.5">
              By saving{" "}
              <span className="font-semibold text-[#121910] dark:text-white">
                {formatCurrency(monthlyCut, currencySymbol, currencyCode)}/month
              </span>
              , you invest {formatCurrency(monthlyCut * totalMonths, currencySymbol, currencyCode)}{" "}
              total and generate{" "}
              <span className="font-semibold text-[#83db28]">
                {formatCurrency(
                  Math.max(0, Math.round(futureCompoundValue - monthlyCut * totalMonths)),
                  currencySymbol,
                  currencyCode,
                )}
              </span>{" "}
              in pure investment interest!
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm font-semibold text-[#121910] dark:text-white">
              <span>Monthly Reduction</span>
              <span className="font-mono text-base text-[#255e09] dark:text-[#83db28]">
                {formatCurrency(monthlyCut, currencySymbol, currencyCode)} / mo
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="10000"
              step="50"
              value={monthlyCut}
              onChange={(e) => setMonthlyCut(Number(e.target.value))}
              className="rc-slider"
              aria-label="Monthly spending reduction"
            />

            <div className="flex justify-between text-xs text-[#5e6d56] dark:text-[#a0b396] font-mono">
              <span>{currencySymbol}0/mo</span>
              <span>{currencySymbol}5,000/mo</span>
              <span>{currencySymbol}10,000/mo</span>
            </div>

            {/* Quick Presets */}
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-[#5e6d56] dark:text-[#a0b396] mr-1">
                Presets:
              </span>
              {presets.map((preset) => (
                <button
                  key={preset}
                  onClick={() => setMonthlyCut(preset)}
                  className={`px-3 py-1 text-xs font-semibold rounded-full border transition-all ${
                    monthlyCut === preset
                      ? "bg-[#121910] text-white dark:bg-[#83db28] dark:text-[#121910] border-transparent"
                      : "bg-white/80 dark:bg-[#243021] text-[#121910] dark:text-white border-[#dff5cf] dark:border-[#2d3a29] hover:bg-[#e6f9d5]"
                  }`}
                >
                  {currencySymbol}
                  {preset}
                </button>
              ))}
              <button
                onClick={() => setMonthlyCut(500)}
                className="text-xs text-[#5e6d56] dark:text-[#a0b396] hover:text-[#121910] dark:hover:text-white ml-auto underline"
              >
                Reset to {currencySymbol}500
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
