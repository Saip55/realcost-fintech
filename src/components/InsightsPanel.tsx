import React from "react";
import {
  TransactionItem,
  CALCULATIONS,
  formatCurrency,
  formatHours,
  formatFutureValue,
} from "@/lib/calculations";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface InsightsPanelProps {
  transactions: TransactionItem[];
  hourlyRate?: number;
  expectedReturn?: number;
  projectionYears?: number;
  currencySymbol?: string;
  currencyCode?: string;
  profile?: {
    hourlyRate?: number;
    expectedReturn?: number;
    projectionYears?: number;
    currencySymbol?: string;
    currencyCode?: string;
  };
}

const COLORS = ["#83db28", "#2f6fed", "#f43f5e", "#fbbf24", "#a855f7", "#06b6d4", "#64748b"];

export const InsightsPanel: React.FC<InsightsPanelProps> = ({
  transactions,
  hourlyRate = 500,
  expectedReturn = 7,
  projectionYears = 20,
  currencySymbol = "₹",
  currencyCode = "INR",
  profile,
}) => {
  const actualHourlyRate = profile?.hourlyRate ?? hourlyRate;
  const actualReturn = profile?.expectedReturn ?? expectedReturn;
  const actualYears = profile?.projectionYears ?? projectionYears;
  const actualSymbol = profile?.currencySymbol ?? currencySymbol;
  const actualCode = profile?.currencyCode ?? currencyCode;
  const totalSpend = transactions.reduce((sum, t) => sum + Number(t.amount || 0), 0);
  const totalHours = transactions.reduce(
    (sum, t) => sum + CALCULATIONS.hoursOfWork(Number(t.amount || 0), hourlyRate),
    0,
  );

  // Group by category
  const categories: Record<
    string,
    { amount: number; count: number; hours: number; futureVal: number }
  > = {};

  transactions.forEach((tx) => {
    const cat = tx.category || "Other";
    if (!categories[cat]) {
      categories[cat] = { amount: 0, count: 0, hours: 0, futureVal: 0 };
    }
    const amt = Number(tx.amount || 0);
    categories[cat].amount += amt;
    categories[cat].count += 1;
    categories[cat].hours += CALCULATIONS.hoursOfWork(amt, hourlyRate);
    categories[cat].futureVal += CALCULATIONS.futureValue(amt, expectedReturn, projectionYears);
  });

  const categoryIcons: Record<string, string> = {
    Food: "🍔",
    Subscriptions: "🔄",
    Transport: "🚗",
    Shopping: "🛍️",
    Health: "💪",
    Entertainment: "🎬",
    Other: "📦",
  };

  const pieData = Object.entries(categories).map(([name, val]) => ({
    name,
    value: val.amount,
  }));

  return (
    <div
      className="glass-panel p-6 md:p-10 my-8 dark:bg-[#1e281b] dark:border-[#2d3a29]"
      id="insights"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="badge-pill mb-2">
            <svg className="w-4 h-4 fill-[#83db28]" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            Spending Insights & Donut Breakdown
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#121910] dark:text-white tracking-tight">
            Life Hours & Opportunity Cost Breakdown
          </h2>
        </div>

        {/* Global summary badge */}
        <div className="flex items-center gap-4 bg-white/80 dark:bg-[#243021] border border-[#dff5cf] dark:border-[#2d3a29] rounded-2xl p-4 shadow-sm">
          <div>
            <div className="text-xs text-[#5e6d56] dark:text-[#a0b396] uppercase font-bold tracking-wider">
              Total Life Hours
            </div>
            <div className="text-xl font-bold font-mono text-[#121910] dark:text-white">
              {formatHours(totalHours)}
            </div>
          </div>
          <div className="h-8 w-px bg-[#dff5cf] dark:bg-[#2d3a29]" />
          <div>
            <div className="text-xs text-[#5e6d56] dark:text-[#a0b396] uppercase font-bold tracking-wider">
              Total Opportunity Loss
            </div>
            <div className="text-xl font-bold font-mono text-[#2f6fed] dark:text-[#60a5fa]">
              {formatFutureValue(
                totalSpend,
                projectionYears,
                expectedReturn,
                currencySymbol,
                currencyCode,
              )}
            </div>
          </div>
        </div>
      </div>

      {Object.keys(categories).length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-8 bg-white/60 dark:bg-[#243021] p-6 rounded-3xl border border-[#dff5cf] dark:border-[#2d3a29]">
          {/* Donut Chart */}
          <div className="lg:col-span-5 h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: number) => [
                    formatCurrency(val, currencySymbol, currencyCode),
                    "Amount",
                  ]}
                  contentStyle={{
                    background: "#1a2318",
                    border: "1px solid #83db28",
                    borderRadius: "12px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Allocation Gauge / Stats */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-lg font-bold text-[#121910] dark:text-white">
              Category Allocation Summary
            </h3>
            <p className="text-xs text-[#5e6d56] dark:text-[#a0b396]">
              Your top category is{" "}
              <strong className="text-[#121910] dark:text-white">
                {Object.entries(categories).sort((a, b) => b[1].amount - a[1].amount)[0]?.[0]}
              </strong>{" "}
              accounting for{" "}
              {formatHours(
                Object.entries(categories).sort((a, b) => b[1].amount - a[1].amount)[0]?.[1]
                  .hours || 0,
              )}{" "}
              of work.
            </p>

            <div className="p-4 rounded-2xl bg-white/80 dark:bg-[#1a2318] border border-[#dff5cf] dark:border-[#2d3a29] flex justify-between items-center text-xs font-mono">
              <span className="text-[#5e6d56] dark:text-[#a0b396]">Hourly Time-Wage Rate:</span>
              <span className="font-bold text-[#121910] dark:text-white">
                {formatCurrency(hourlyRate, currencySymbol, currencyCode)} / hr
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Category Grid */}
      {Object.keys(categories).length === 0 ? (
        <div className="text-center py-10 bg-white/60 dark:bg-[#243021] rounded-2xl border border-dashed border-[#dff5cf] dark:border-[#2d3a29]">
          <p className="text-sm font-semibold text-[#121910] dark:text-white mb-1">
            No category data yet
          </p>
          <p className="text-xs text-[#5e6d56] dark:text-[#a0b396]">
            Add an expense in the Dashboard to generate category distribution and life-hours
            insights.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Object.entries(categories).map(([cat, data]) => {
            const percent = totalSpend > 0 ? (data.amount / totalSpend) * 100 : 0;

            return (
              <div
                key={cat}
                className="p-5 rounded-2xl bg-white/80 dark:bg-[#243021] border border-white dark:border-[#2d3a29] hover:border-[#83db28]/50 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 font-bold text-base text-[#121910] dark:text-white">
                      <span className="text-lg">{categoryIcons[cat] || "🏷️"}</span>
                      <span>{cat}</span>
                    </div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#f2faeb] dark:bg-[#28381e] text-[#3e681b] dark:text-[#83db28]">
                      {data.count} {data.count === 1 ? "txn" : "txns"}
                    </span>
                  </div>

                  <div className="text-2xl font-extrabold text-[#121910] dark:text-white font-mono mb-1">
                    {formatCurrency(data.amount, currencySymbol, currencyCode)}
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-[#eef7e6] dark:bg-[#1a2318] h-2 rounded-full overflow-hidden my-2.5">
                    <div
                      className="bg-[#83db28] h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.max(5, percent))}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-[#5e6d56] dark:text-[#a0b396]">
                    <span>{percent.toFixed(1)}% of total</span>
                    <span className="font-mono">{formatHours(data.hours)}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#f0f7ea] dark:border-[#2d3a29] flex items-center justify-between text-xs">
                  <span className="text-[#5e6d56] dark:text-[#a0b396]">
                    If Invested ({projectionYears}y):
                  </span>
                  <span className="font-mono font-bold text-[#2f6fed] dark:text-[#60a5fa]">
                    {formatCurrency(data.futureVal, currencySymbol, currencyCode)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
