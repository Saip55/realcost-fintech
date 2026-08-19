import React, { useState } from "react";
import {
  TransactionItem,
  CALCULATIONS,
  formatCurrency,
  formatFutureValue,
} from "@/lib/calculations";

interface SubscriptionShockProps {
  transactions: TransactionItem[];
  expectedReturn: number;
  projectionYears: number;
  currencySymbol?: string;
  currencyCode?: string;
  onToggleRecurring?: (id: string) => void;
}

export const SubscriptionShock: React.FC<SubscriptionShockProps> = ({
  transactions,
  expectedReturn,
  projectionYears,
  currencySymbol = "₹",
  currencyCode = "INR",
  onToggleRecurring,
}) => {
  const recurring = transactions.filter((t) => t.isRecurring);
  const [markedForCancel, setMarkedForCancel] = useState<Record<string, boolean>>({});

  if (recurring.length === 0) {
    return null;
  }

  const toggleCancelMark = (id: string) => {
    setMarkedForCancel((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const activeRecurring = recurring.filter((t) => !markedForCancel[t.id]);
  const cancelledRecurring = recurring.filter((t) => markedForCancel[t.id]);

  const totalMonthlySpend = recurring.reduce((sum, t) => sum + Number(t.amount || 0), 0);
  const activeMonthlySpend = activeRecurring.reduce((sum, t) => sum + Number(t.amount || 0), 0);
  const savedMonthlySpend = cancelledRecurring.reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const totalMonths = projectionYears * 12;
  const lifetimeTotalDrain = CALCULATIONS.lifetimeCost(
    totalMonthlySpend,
    totalMonths,
    expectedReturn,
  );
  const lifetimeSavedWealth = CALCULATIONS.lifetimeCost(
    savedMonthlySpend,
    totalMonths,
    expectedReturn,
  );

  const formattedTotalDrain = formatFutureValue(
    lifetimeTotalDrain,
    0,
    0,
    currencySymbol,
    currencyCode,
  );
  const formattedSavedWealth = formatFutureValue(
    lifetimeSavedWealth,
    0,
    0,
    currencySymbol,
    currencyCode,
  );

  const ornaments = [
    { text: "💸", left: "10%", delay: "0s", duration: "3.5s" },
    { text: "💰", left: "28%", delay: "0.8s", duration: "4.2s" },
    { text: currencySymbol, left: "48%", delay: "1.4s", duration: "3.2s" },
    { text: "📉", left: "68%", delay: "0.5s", duration: "4.8s" },
    { text: "💥", left: "85%", delay: "1.9s", duration: "3.8s" },
  ];

  return (
    <div
      className="relative overflow-hidden glass-panel p-6 md:p-10 my-8 border-2 border-red-200/60 dark:border-red-900/50 bg-gradient-to-br from-white/90 via-red-50/30 to-amber-50/20 dark:from-[#241716] dark:via-[#1e1a17] dark:to-[#171c14] text-center"
      id="subscription-shock"
    >
      {/* Floating Ornaments */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {ornaments.map((ornament, idx) => (
          <div
            key={idx}
            className="ornament text-2xl opacity-75"
            style={{
              left: ornament.left,
              top: "15%",
              animationDelay: ornament.delay,
              animationDuration: ornament.duration,
            }}
          >
            {ornament.text}
          </div>
        ))}
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100/80 dark:bg-red-950/80 text-[#e8503f] dark:text-red-400 text-xs font-bold tracking-wide uppercase mb-3">
          💥 Subscription Drain & Audit Engine
        </div>

        <h3 className="text-2xl md:text-3xl font-extrabold text-[#121910] dark:text-white tracking-tight">
          Recurring Drain Over {projectionYears} Years
        </h3>

        <div className="my-5 grid grid-cols-1 md:grid-cols-2 gap-4 items-center max-w-2xl mx-auto">
          <div className="p-4 rounded-2xl bg-white/80 dark:bg-[#281a1a] border border-red-200/80 dark:border-red-900/50 shadow-sm">
            <div className="text-xs uppercase font-bold tracking-wider text-[#5e6d56] dark:text-gray-300 mb-1">
              Compounded Opportunity Loss
            </div>
            <div className="text-3xl md:text-4xl font-black text-[#e8503f] dark:text-red-400 font-mono tracking-tight">
              {formattedTotalDrain}
            </div>
            <p className="text-[11px] text-[#5e6d56] dark:text-[#a0b396] mt-1">
              At {formatCurrency(totalMonthlySpend, currencySymbol, currencyCode)}/mo across{" "}
              {recurring.length} subscriptions
            </p>
          </div>

          {savedMonthlySpend > 0 ? (
            <div className="p-4 rounded-2xl bg-emerald-50/90 dark:bg-[#1a2e1d] border border-emerald-300/80 dark:border-emerald-800 shadow-sm">
              <div className="text-xs uppercase font-bold tracking-wider text-emerald-700 dark:text-emerald-300 mb-1">
                Wealth Recoverable
              </div>
              <div className="text-3xl md:text-4xl font-black text-emerald-600 dark:text-emerald-400 font-mono tracking-tight">
                +{formattedSavedWealth}
              </div>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-300 mt-1">
                By trimming {formatCurrency(savedMonthlySpend, currencySymbol, currencyCode)}/mo in
                cancelled subs!
              </p>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-white/60 dark:bg-[#20281d] border border-dashed border-[#dff5cf] dark:border-[#2d3a29] text-xs text-[#5e6d56] dark:text-[#a0b396] flex items-center justify-center">
              💡 Tap any subscription below to test marking it for cancellation and calculate wealth
              recovered!
            </div>
          )}
        </div>

        {/* Subscription Audit Cards */}
        <div className="mt-6">
          <div className="text-xs font-bold uppercase tracking-wider text-[#5e6d56] dark:text-[#a0b396] mb-3">
            Interactive Subscription Audit (Tap to Mark for Trimming)
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {recurring.map((sub) => {
              const isMarked = !!markedForCancel[sub.id];
              return (
                <button
                  key={sub.id}
                  onClick={() => toggleCancelMark(sub.id)}
                  type="button"
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl border text-xs font-semibold transition-all shadow-sm cursor-pointer ${
                    isMarked
                      ? "bg-emerald-50 dark:bg-emerald-950/80 border-emerald-400 text-emerald-800 dark:text-emerald-300 line-through opacity-80"
                      : "bg-white/90 dark:bg-[#283225] border-red-200/80 dark:border-red-900/60 text-[#121910] dark:text-white hover:scale-105"
                  }`}
                >
                  <span>
                    {isMarked ? "✂️" : "🔁"} {sub.description}
                  </span>
                  <span
                    className={`font-mono font-bold ${isMarked ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}
                  >
                    {formatCurrency(sub.amount, currencySymbol, currencyCode)}/mo
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10 no-underline">
                    {isMarked ? "Trimmed" : "Keep"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
