import React from "react";
import {
  Zap,
  Clock,
  TrendingUp,
  ShieldAlert,
  Repeat,
  Trash2,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  Flame,
  ZapOff,
} from "lucide-react";
import { Transaction, UserProfile } from "../types";
import { calculateSubscriptionLifetimeCost, calculateHoursWorked } from "../lib/calculations";
import { formatCurrency, formatHours, formatCompactCurrency } from "../lib/formatters";

interface ShockCardProps {
  transactions: Transaction[];
  profile: UserProfile;
  onToggleCancelSubscription: (id: string) => void;
  onDeleteTransaction: (id: string) => void;
  onOpenAddModal: () => void;
}

export const ShockCard: React.FC<ShockCardProps> = ({
  transactions,
  profile,
  onToggleCancelSubscription,
  onDeleteTransaction,
  onOpenAddModal,
}) => {
  // Filter all subscriptions (recurring or category === 'subscriptions')
  const subscriptions = transactions.filter((t) => t.isRecurring || t.category === "subscriptions");

  // Active subscriptions (not cancelled)
  const activeSubs = subscriptions.filter((s) => !s.isCancelled);
  const cancelledSubs = subscriptions.filter((s) => s.isCancelled);

  const monthlyTotal = activeSubs.reduce((sum, t) => sum + t.amount, 0);
  const monthlyHours = calculateHoursWorked(monthlyTotal, profile.hourlyWage);

  const totalCancelledMonthlySavings = cancelledSubs.reduce((sum, t) => sum + t.amount, 0);
  const cancelledShock20 = calculateSubscriptionLifetimeCost(
    totalCancelledMonthlySavings,
    profile.targetReturnRate,
    20,
  );

  // Projections for active subscriptions
  const shock10 = calculateSubscriptionLifetimeCost(monthlyTotal, profile.targetReturnRate, 10);
  const shock20 = calculateSubscriptionLifetimeCost(monthlyTotal, profile.targetReturnRate, 20);
  const shock30 = calculateSubscriptionLifetimeCost(monthlyTotal, profile.targetReturnRate, 30);

  // Determine Vampire Threat Level
  const getVampireLevel = (monthly: number) => {
    if (monthly > 4000)
      return {
        title: "EXTREME SUBSCRIPTION LEAK",
        color: "text-red-400",
        bg: "bg-red-500/15 border-red-500/30",
      };
    if (monthly > 1500)
      return {
        title: "HIGH RECURRING LEAK",
        color: "text-amber-400",
        bg: "bg-amber-500/15 border-amber-500/30",
      };
    return {
      title: "MODERATE SUBSCRIPTION BURN",
      color: "text-emerald-400",
      bg: "bg-emerald-500/15 border-emerald-500/30",
    };
  };

  const threat = getVampireLevel(monthlyTotal);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Shock Warning Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1c1808] via-[#162512] to-[#070c06] border border-amber-500/40 p-6 md:p-8 shadow-2xl shadow-amber-500/10">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-extrabold ${threat.bg} ${threat.color}`}
            >
              <ShieldAlert className="w-4 h-4" />
              {threat.title}
            </div>

            <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
              Your Subscriptions Cost You{" "}
              <span className="gradient-text-amber font-extrabold">
                {formatCompactCurrency(shock20.futureValueTotal, profile.currencySymbol)}
              </span>{" "}
              in Future Wealth
            </h2>

            <p className="text-sm text-[#9bb093] leading-relaxed">
              Recurring payments drain your life energy quietly. Your active monthly subscriptions
              cost{" "}
              <span className="text-white font-bold">
                {formatCurrency(monthlyTotal, profile.currencySymbol)}/mo
              </span>{" "}
              which trades away{" "}
              <span className="text-[#abf34d] font-bold">{formatHours(monthlyHours)} of work</span>{" "}
              every single month.
            </p>
          </div>

          {/* Quick Stats Box */}
          <div className="w-full lg:w-auto p-5 rounded-2xl bg-[#070c06]/90 border border-[#23321f] text-left lg:text-right space-y-3 min-w-[240px] shadow-2xl">
            <div>
              <div className="text-xs text-[#84967c]">Active Monthly Burn</div>
              <div className="text-2xl font-extrabold text-amber-400">
                {formatCurrency(monthlyTotal, profile.currencySymbol)}/mo
              </div>
            </div>
            <div className="pt-2 border-t border-[#23321f]">
              <div className="text-xs text-[#84967c]">Monthly Work Traded</div>
              <div className="text-sm font-extrabold text-[#abf34d]">
                ⏱️ {formatHours(monthlyHours)} / month
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancelled & Reclaimed Wealth Banner (If any subscriptions cancelled) */}
      {totalCancelledMonthlySavings > 0 && (
        <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-950/80 via-[#142312] to-[#070c06] border-2 border-emerald-400/60 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-400/20 text-emerald-400 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Reclaimed Financial Freedom
              </div>
              <div className="text-base font-extrabold text-white">
                You're saving {formatCurrency(totalCancelledMonthlySavings, profile.currencySymbol)}
                /mo across {cancelledSubs.length} cancelled subscription
                {cancelledSubs.length === 1 ? "" : "s"}!
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs text-[#9bb093]">
              Reclaimed {profile.timeHorizonYears}-Year Wealth:
            </div>
            <div className="text-xl font-extrabold text-emerald-400">
              +📈 {formatCurrency(cancelledShock20.futureValueTotal, profile.currencySymbol)}
            </div>
          </div>
        </div>
      )}

      {/* Lifetime Opportunity Loss Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 10-Year Horizon */}
        <div className="p-5 rounded-2xl fintech-glass hover:border-amber-500/40 transition">
          <div className="text-xs font-semibold text-[#84967c] flex items-center justify-between mb-2">
            <span>10-Year Horizon</span>
            <span className="text-amber-400 font-bold">10 Years</span>
          </div>
          <div className="text-xs text-[#9bb093]">Total Cash Spent:</div>
          <div className="text-lg font-bold text-white mb-2">
            {formatCurrency(shock10.spentTotal, profile.currencySymbol)}
          </div>
          <div className="text-xs text-[#9bb093]">Future Value if Invested:</div>
          <div className="text-2xl font-extrabold text-amber-400">
            {formatCurrency(shock10.futureValueTotal, profile.currencySymbol)}
          </div>
          <div className="text-[11px] text-[#84967c] mt-2 pt-2 border-t border-[#23321f]">
            Wealth lost: +{formatCurrency(shock10.opportunityLoss, profile.currencySymbol)}
          </div>
        </div>

        {/* 20-Year Horizon (Featured Baseline) */}
        <div className="p-5 rounded-2xl bg-[#142312] border-2 border-[#abf34d] shadow-xl shadow-[#abf34d]/10 relative overflow-hidden">
          <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-[#abf34d] text-[#070c06] font-extrabold text-[10px] uppercase">
            Baseline
          </div>
          <div className="text-xs font-semibold text-[#abf34d] flex items-center justify-between mb-2">
            <span>20-Year Horizon</span>
            <span className="text-white font-bold">20 Years</span>
          </div>
          <div className="text-xs text-[#9bb093]">Total Cash Spent:</div>
          <div className="text-lg font-bold text-white mb-2">
            {formatCurrency(shock20.spentTotal, profile.currencySymbol)}
          </div>
          <div className="text-xs text-[#9bb093]">Future Value if Invested:</div>
          <div className="text-2xl font-extrabold text-[#abf34d]">
            {formatCurrency(shock20.futureValueTotal, profile.currencySymbol)}
          </div>
          <div className="text-[11px] text-[#9bb093] mt-2 pt-2 border-t border-[#23321f]/60">
            Wealth lost: +{formatCurrency(shock20.opportunityLoss, profile.currencySymbol)}
          </div>
        </div>

        {/* 30-Year Horizon */}
        <div className="p-5 rounded-2xl fintech-glass hover:border-emerald-500/40 transition">
          <div className="text-xs font-semibold text-[#84967c] flex items-center justify-between mb-2">
            <span>30-Year Horizon</span>
            <span className="text-emerald-400 font-bold">30 Years</span>
          </div>
          <div className="text-xs text-[#9bb093]">Total Cash Spent:</div>
          <div className="text-lg font-bold text-white mb-2">
            {formatCurrency(shock30.spentTotal, profile.currencySymbol)}
          </div>
          <div className="text-xs text-[#9bb093]">Future Value if Invested:</div>
          <div className="text-2xl font-extrabold text-emerald-400">
            {formatCurrency(shock30.futureValueTotal, profile.currencySymbol)}
          </div>
          <div className="text-[11px] text-[#84967c] mt-2 pt-2 border-t border-[#23321f]">
            Wealth lost: +{formatCurrency(shock30.opportunityLoss, profile.currencySymbol)}
          </div>
        </div>
      </div>

      {/* Active Subscriptions Interactive Checklist */}
      <div className="fintech-glass rounded-3xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Repeat className="w-5 h-5 text-purple-400" />
              Interactive Subscription Killer ({subscriptions.length})
            </h3>
            <p className="text-xs text-[#84967c]">
              Click "Cancel & Invest" on any subscription to see live wealth recovery!
            </p>
          </div>

          <button
            onClick={onOpenAddModal}
            className="px-4 py-2 rounded-xl bg-[#abf34d]/15 text-[#abf34d] border border-[#abf34d]/30 text-xs font-bold hover:bg-[#abf34d] hover:text-[#070c06] transition"
          >
            + Add Subscription
          </button>
        </div>

        {subscriptions.length === 0 ? (
          <div className="text-center py-12 text-[#84967c] text-sm">
            No recurring subscriptions detected. Add subscription expenses to test cancellation
            shock!
          </div>
        ) : (
          <div className="space-y-3">
            {subscriptions.map((sub) => {
              const itemHours = calculateHoursWorked(sub.amount, profile.hourlyWage);
              const itemShock20 = calculateSubscriptionLifetimeCost(
                sub.amount,
                profile.targetReturnRate,
                profile.timeHorizonYears,
              );

              return (
                <div
                  key={sub.id}
                  className={`p-4 rounded-2xl border transition duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    sub.isCancelled
                      ? "bg-emerald-950/30 border-emerald-500/40 opacity-75"
                      : "bg-[#070c06] border-[#23321f] hover:border-purple-500/40"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                        sub.isCancelled
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : "bg-purple-500/15 text-purple-400 border border-purple-500/30"
                      }`}
                    >
                      {sub.isCancelled ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <Zap className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <div
                        className={`font-bold text-sm ${sub.isCancelled ? "line-through text-emerald-300" : "text-white"}`}
                      >
                        {sub.description}
                      </div>
                      <div className="text-xs text-[#84967c]">
                        {formatCurrency(sub.amount, profile.currencySymbol)} / month
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 justify-between md:justify-end">
                    <div className="text-left md:text-right">
                      <div className="text-[11px] text-[#84967c]">Monthly Work</div>
                      <div className="text-xs font-extrabold text-[#abf34d]">
                        ⏱️ {formatHours(itemHours)} / mo
                      </div>
                    </div>

                    <div className="text-left md:text-right">
                      <div className="text-[11px] text-[#84967c]">
                        {profile.timeHorizonYears}Y Invested Value
                      </div>
                      <div className="text-xs font-extrabold text-amber-400">
                        📈 {formatCurrency(itemShock20.futureValueTotal, profile.currencySymbol)}
                      </div>
                    </div>

                    {/* Interactive Cancel & Invest Action Toggle */}
                    <button
                      onClick={() => onToggleCancelSubscription(sub.id)}
                      className={`px-3 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 ${
                        sub.isCancelled
                          ? "bg-emerald-500 text-[#070c06] hover:bg-emerald-400"
                          : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-500/20"
                      }`}
                    >
                      {sub.isCancelled ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Restored</span>
                        </>
                      ) : (
                        <>
                          <ZapOff className="w-3.5 h-3.5" />
                          <span>Cancel & Invest</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
