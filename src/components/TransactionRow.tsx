import React, { useState } from "react";
import {
  Clock,
  TrendingUp,
  Trash2,
  Edit3,
  Repeat,
  Utensils,
  Tv,
  ShoppingBag,
  Car,
  Zap,
  Film,
  HeartPulse,
  Home,
  Sparkles,
  ZapOff,
  Sparkle,
} from "lucide-react";
import { Transaction, UserProfile, CategoryType, GlobalFramingMode } from "../types";
import { CATEGORIES } from "../lib/categorization";
import { calculateHoursWorked, calculateFutureValue } from "../lib/calculations";
import { formatCurrency, formatHours, formatDate } from "../lib/formatters";

interface TransactionRowProps {
  transaction: Transaction;
  profile: UserProfile;
  globalFraming?: GlobalFramingMode;
  onEdit: (tx: Transaction) => void;
  onDelete: (id: string) => void;
}

export const TransactionRow: React.FC<TransactionRowProps> = ({
  transaction,
  profile,
  globalFraming = "all",
  onEdit,
  onDelete,
}) => {
  const [showMicroCalculator, setShowMicroCalculator] = useState(false);
  const categoryInfo = CATEGORIES[transaction.category] || CATEGORIES.misc;
  const hours = calculateHoursWorked(transaction.amount, profile.hourlyWage);
  const futureVal = calculateFutureValue(
    transaction.amount,
    profile.targetReturnRate,
    profile.timeHorizonYears,
  );

  const renderCategoryIcon = (cat: CategoryType) => {
    const props = { className: "w-4 h-4", style: { color: categoryInfo.color } };
    switch (cat) {
      case "food":
        return <Utensils {...props} />;
      case "subscriptions":
        return <Tv {...props} />;
      case "shopping":
        return <ShoppingBag {...props} />;
      case "transport":
        return <Car {...props} />;
      case "utilities":
        return <Zap {...props} />;
      case "entertainment":
        return <Film {...props} />;
      case "health":
        return <HeartPulse {...props} />;
      case "housing":
        return <Home {...props} />;
      default:
        return <Sparkles {...props} />;
    }
  };

  return (
    <div className="group relative fintech-glass fintech-glass-hover rounded-2xl p-4 transition-all duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left Column: Icon + Title + Tags */}
        <div className="flex items-start gap-3.5 flex-1 min-w-0">
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border border-white/10 shadow-inner"
            style={{ backgroundColor: categoryInfo.bgLight }}
          >
            {renderCategoryIcon(transaction.category)}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-white text-base tracking-tight truncate">
                {transaction.description}
              </span>

              {transaction.isRecurring && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  <Repeat className="w-2.5 h-2.5" />
                  Subscription
                </span>
              )}
            </div>

            <div className="flex items-center gap-2.5 text-xs text-[#84967c] mt-1 flex-wrap">
              <span className="font-medium text-[#9bb093]">{categoryInfo.name}</span>
              <span>•</span>
              <span>{formatDate(transaction.date)}</span>
              {transaction.notes && (
                <>
                  <span>•</span>
                  <span className="truncate max-w-[200px] italic text-[#6a7d62]">
                    "{transaction.notes}"
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Amount + The Reframe Cards */}
        <div className="flex items-center justify-between md:justify-end gap-3 flex-wrap pt-2 md:pt-0 border-t md:border-t-0 border-[#23321f]/60">
          {/* Spent Amount */}
          <div className="text-left md:text-right pr-2">
            <div className="text-[10px] text-[#84967c] font-semibold uppercase tracking-wider">
              Raw Amount
            </div>
            <div className="text-base font-extrabold text-white">
              {formatCurrency(transaction.amount, profile.currencySymbol)}
            </div>
          </div>

          {/* Reframe Badge 1: Hours of Work */}
          {(globalFraming === "all" || globalFraming === "hours") && (
            <div className="px-3.5 py-2 rounded-2xl bg-[#070c06]/80 border border-[#abf34d]/30 group-hover:border-[#abf34d]/60 transition text-left shadow-inner">
              <div className="flex items-center gap-1 text-[10px] font-bold text-[#84967c]">
                <Clock className="w-3 h-3 text-[#abf34d]" />
                Life Hours Traded
              </div>
              <div className="text-sm font-extrabold text-[#abf34d]">⏱️ {formatHours(hours)}</div>
            </div>
          )}

          {/* Reframe Badge 2: Future Opportunity Cost */}
          {(globalFraming === "all" || globalFraming === "future") && (
            <div className="px-3.5 py-2 rounded-2xl bg-[#070c06]/80 border border-emerald-500/30 group-hover:border-emerald-500/60 transition text-left shadow-inner">
              <div className="flex items-center gap-1 text-[10px] font-bold text-[#84967c]">
                <TrendingUp className="w-3 h-3 text-emerald-400" />
                In {profile.timeHorizonYears} Years
              </div>
              <div className="text-sm font-extrabold text-emerald-400">
                📈 {formatCurrency(futureVal, profile.currencySymbol)}
              </div>
            </div>
          )}

          {/* Interactive Micro Calculator Trigger Button */}
          <button
            onClick={() => setShowMicroCalculator(!showMicroCalculator)}
            className={`p-2 rounded-xl border text-xs font-bold transition flex items-center gap-1 ${
              showMicroCalculator
                ? "bg-[#abf34d] text-[#070c06] border-[#abf34d]"
                : "bg-[#121b0f] text-[#84967c] hover:text-[#abf34d] border-[#23321f]"
            }`}
            title="What if I skip or cut this expense?"
          >
            <Sparkle className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">What-If?</span>
          </button>

          {/* Edit / Delete Buttons */}
          <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
            <button
              onClick={() => onEdit(transaction)}
              className="p-2 rounded-xl text-[#84967c] hover:text-white hover:bg-[#23321f] transition"
              title="Edit Expense"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(transaction.id)}
              className="p-2 rounded-xl text-[#84967c] hover:text-red-400 hover:bg-red-500/10 transition"
              title="Delete Expense"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Micro-Calculator Popover Drawer */}
      {showMicroCalculator && (
        <div className="mt-3 p-4 rounded-2xl bg-[#0b1209] border border-[#abf34d]/40 space-y-2 animate-fadeIn">
          <div className="flex items-center justify-between text-xs font-bold text-white">
            <span className="flex items-center gap-1.5 text-[#abf34d]">
              <Sparkles className="w-4 h-4" />
              What If You Skip This Purchase Weekly?
            </span>
            <button
              onClick={() => setShowMicroCalculator(false)}
              className="text-[#84967c] hover:text-white text-xs"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
            <div className="p-2.5 rounded-xl bg-[#121b0f] border border-[#23321f]">
              <div className="text-[10px] text-[#84967c]">Annual Cash Saved</div>
              <div className="text-sm font-bold text-white">
                {formatCurrency(transaction.amount * 52, profile.currencySymbol)} / yr
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#121b0f] border border-[#23321f]">
              <div className="text-[10px] text-[#84967c]">Annual Life Hours Reclaimed</div>
              <div className="text-sm font-bold text-[#abf34d]">
                ⏱️ {formatHours(hours * 52)} / yr
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#121b0f] border border-[#abf34d]/30">
              <div className="text-[10px] text-[#84967c]">
                In {profile.timeHorizonYears} Years If Invested
              </div>
              <div className="text-sm font-bold text-emerald-400">
                📈 {formatCurrency(futureVal * 52, profile.currencySymbol)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
