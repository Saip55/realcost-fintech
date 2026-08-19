import React, { useState } from "react";
import { X, DollarSign, Clock, TrendingUp, Calendar, Check, Calculator } from "lucide-react";
import { UserProfile } from "../types";
import { formatCurrency } from "../lib/formatters";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
}) => {
  const [monthlyIncome, setMonthlyIncome] = useState(profile?.monthlyIncome?.toString() || "80000");
  const [workingHours, setWorkingHours] = useState(
    profile?.workingHoursPerMonth?.toString() || "160",
  );
  const [returnRate, setReturnRate] = useState(profile?.targetReturnRate?.toString() || "7");
  const [years, setYears] = useState(profile?.timeHorizonYears?.toString() || "20");
  const [currency, setCurrency] = useState(profile?.currencySymbol || "₹");

  if (!isOpen) return null;

  // Calculated hourly rate preview
  const parsedIncome = parseFloat(monthlyIncome) || 0;
  const parsedHours = parseFloat(workingHours) || 160;
  const calculatedWage = parsedHours > 0 ? Math.round((parsedIncome / parsedHours) * 100) / 100 : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      monthlyIncome: parsedIncome,
      workingHoursPerMonth: parsedHours,
      hourlyWage: calculatedWage,
      targetReturnRate: parseFloat(returnRate) || 7,
      timeHorizonYears: parseInt(years) || 20,
      currencySymbol: currency,
    });
    onClose();
  };

  const currencies = [
    { symbol: "₹", code: "INR", name: "Indian Rupee (₹)" },
    { symbol: "$", code: "USD", name: "US Dollar ($)" },
    { symbol: "€", code: "EUR", name: "Euro (€)" },
    { symbol: "£", code: "GBP", name: "British Pound (£)" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#141d11] border border-[#23321f] rounded-3xl p-6 shadow-2xl shadow-[#abf34d]/10 text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#23321f]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#abf34d]/15 border border-[#abf34d]/30 flex items-center justify-center text-[#abf34d]">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Financial Baseline & Rates</h2>
              <p className="text-xs text-[#84967c]">
                Configure your hourly life value & investment benchmarks
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#84967c] hover:text-white hover:bg-[#1a2b0e] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Currency Selection */}
          <div>
            <label className="block text-xs font-semibold text-[#9bb093] mb-1.5">
              Preferred Currency
            </label>
            <div className="grid grid-cols-4 gap-2">
              {currencies.map((c) => (
                <button
                  key={c.symbol}
                  type="button"
                  onClick={() => setCurrency(c.symbol)}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    currency === c.symbol
                      ? "bg-[#abf34d] text-[#0c120a] border-[#abf34d]"
                      : "bg-[#1a2616] text-[#9bb093] border-[#23321f] hover:border-[#abf34d]/40"
                  }`}
                >
                  <span className="text-base">{c.symbol}</span>
                  <span>{c.code}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Income & Working Hours Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#9bb093] mb-1.5">
                Monthly Net Income ({currency})
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-[#84967c] font-bold text-xs">
                  {currency}
                </span>
                <input
                  type="number"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(e.target.value)}
                  placeholder="80000"
                  className="w-full pl-7 pr-3 py-2 bg-[#0c120a] border border-[#23321f] rounded-xl text-sm font-semibold text-white focus:outline-none focus:border-[#abf34d]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#9bb093] mb-1.5">
                Monthly Work Hours
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={workingHours}
                  onChange={(e) => setWorkingHours(e.target.value)}
                  placeholder="160"
                  className="w-full px-3 py-2 bg-[#0c120a] border border-[#23321f] rounded-xl text-sm font-semibold text-white focus:outline-none focus:border-[#abf34d]"
                  required
                />
                <span className="absolute right-3 top-2.5 text-[#84967c] text-xs">hrs</span>
              </div>
            </div>
          </div>

          {/* Hourly Rate Live Calculation Display */}
          <div className="p-3.5 rounded-2xl bg-[#1a2b0e]/80 border border-[#abf34d]/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Clock className="w-5 h-5 text-[#abf34d]" />
              <div>
                <div className="text-xs text-[#9bb093]">Calculated Life Rate</div>
                <div className="text-base font-extrabold text-[#abf34d]">
                  {formatCurrency(calculatedWage, currency)} / hour
                </div>
              </div>
            </div>
            <div className="text-right text-[11px] text-[#84967c]">Based on {parsedHours}h/mo</div>
          </div>

          {/* Investment Parameters */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-[#9bb093] mb-1.5 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-[#abf34d]" />
                Annual Return Rate (%)
              </label>
              <input
                type="number"
                step="0.5"
                value={returnRate}
                onChange={(e) => setReturnRate(e.target.value)}
                placeholder="7"
                className="w-full px-3 py-2 bg-[#0c120a] border border-[#23321f] rounded-xl text-sm font-semibold text-white focus:outline-none focus:border-[#abf34d]"
                required
              />
              <span className="text-[10px] text-[#84967c] mt-1 block">
                Historical Index Fund avg ~7-10%
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#9bb093] mb-1.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#abf34d]" />
                Time Horizon (Years)
              </label>
              <input
                type="number"
                value={years}
                onChange={(e) => setYears(e.target.value)}
                placeholder="20"
                className="w-full px-3 py-2 bg-[#0c120a] border border-[#23321f] rounded-xl text-sm font-semibold text-white focus:outline-none focus:border-[#abf34d]"
                required
              />
              <span className="text-[10px] text-[#84967c] mt-1 block">
                Default comparison period
              </span>
            </div>
          </div>

          {/* Submit CTA */}
          <div className="pt-3">
            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-[#abf34d] hover:bg-[#8ae032] text-[#0c120a] font-bold text-sm shadow-lg shadow-[#abf34d]/25 transition flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              Save Financial Baseline
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
