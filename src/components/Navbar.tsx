import React from "react";
import {
  Clock,
  TrendingUp,
  PlusCircle,
  Settings,
  Zap,
  BarChart3,
  Calculator,
  LayoutDashboard,
  RotateCcw,
  SlidersHorizontal,
  Sparkles,
  Eye,
} from "lucide-react";
import { ActiveTab, UserProfile, GlobalFramingMode } from "../types";
import { formatCurrency } from "../lib/formatters";

interface NavbarProps {
  profile: UserProfile;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  globalFraming: GlobalFramingMode;
  setGlobalFraming: (mode: GlobalFramingMode) => void;
  onOpenAddModal: () => void;
  onOpenSettingsModal: () => void;
  onLoadDemoData: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  profile,
  activeTab,
  setActiveTab,
  globalFraming,
  setGlobalFraming,
  onOpenAddModal,
  onOpenSettingsModal,
  onLoadDemoData,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#070c06]/85 backdrop-blur-xl border-b border-[#23321f]/80 px-4 py-3 shadow-2xl shadow-black/60">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Brand & Wage Widget */}
        <div className="flex items-center justify-between w-full lg:w-auto gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#abf34d] via-[#8ae032] to-[#75cc1f] flex items-center justify-center shadow-lg shadow-[#abf34d]/25 text-[#070c06] transform hover:scale-105 transition duration-300">
                <Clock className="w-6 h-6 stroke-[2.5]" />
              </div>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#abf34d] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#abf34d]"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-white font-sans">
                  Real<span className="text-[#abf34d]">Cost</span>
                </span>
                <span className="text-[10px] uppercase font-extrabold tracking-widest px-2 py-0.5 rounded-full bg-[#abf34d]/15 text-[#abf34d] border border-[#abf34d]/30">
                  PRO
                </span>
              </div>
              <p className="text-[11px] text-[#84967c]">Time & Opportunity Reframe</p>
            </div>
          </div>

          {/* Interactive Life Wage Widget */}
          <button
            onClick={onOpenSettingsModal}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#121b0f] border border-[#23321f] hover:border-[#abf34d]/50 transition duration-300 group shadow-md"
            title="Click to edit your hourly wage & return benchmark"
          >
            <div className="w-2 h-2 rounded-full bg-[#abf34d] group-hover:animate-ping" />
            <span className="text-xs font-semibold text-[#9bb093]">
              Wage:{" "}
              <span className="text-[#abf34d] font-extrabold">
                {formatCurrency(profile.hourlyWage, profile.currencySymbol)}
              </span>
              /hr
            </span>
            <span className="text-[#23321f]">|</span>
            <span className="text-xs text-[#9bb093] hidden sm:flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              {profile.targetReturnRate}% @ {profile.timeHorizonYears}y
            </span>
          </button>
        </div>

        {/* Center Nav Tabs */}
        <nav className="flex items-center gap-1 p-1.5 rounded-2xl bg-[#121b0f] border border-[#23321f] overflow-x-auto max-w-full shadow-inner">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition duration-200 whitespace-nowrap ${
              activeTab === "dashboard"
                ? "bg-[#abf34d] text-[#070c06] shadow-lg shadow-[#abf34d]/20"
                : "text-[#9bb093] hover:text-white hover:bg-[#1a2b0e]/60"
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            Dashboard
          </button>

          <button
            onClick={() => setActiveTab("shock")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition duration-200 whitespace-nowrap ${
              activeTab === "shock"
                ? "bg-amber-400 text-[#070c06] shadow-lg shadow-amber-400/20"
                : "text-[#9bb093] hover:text-white hover:bg-[#1a2b0e]/60"
            }`}
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            Subscription Shock
          </button>

          <button
            onClick={() => setActiveTab("simulator")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition duration-200 whitespace-nowrap ${
              activeTab === "simulator"
                ? "bg-[#abf34d] text-[#070c06] shadow-lg shadow-[#abf34d]/20"
                : "text-[#9bb093] hover:text-white hover:bg-[#1a2b0e]/60"
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            What-If Simulator
          </button>

          <button
            onClick={() => setActiveTab("insights")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition duration-200 whitespace-nowrap ${
              activeTab === "insights"
                ? "bg-[#abf34d] text-[#070c06] shadow-lg shadow-[#abf34d]/20"
                : "text-[#9bb093] hover:text-white hover:bg-[#1a2b0e]/60"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Insights
          </button>
        </nav>

        {/* Right Action Controls & Framing Mode Toggle */}
        <div className="flex items-center gap-2">
          {/* View Framing Mode Selector */}
          <div className="hidden sm:flex items-center gap-1 p-1 rounded-xl bg-[#121b0f] border border-[#23321f] text-[11px] text-[#84967c]">
            <Eye className="w-3.5 h-3.5 ml-2 text-[#abf34d]" />
            <button
              onClick={() => setGlobalFraming("all")}
              className={`px-2 py-1 rounded-lg font-semibold transition ${
                globalFraming === "all" ? "bg-[#23321f] text-white" : "hover:text-white"
              }`}
              title="Show Hours & Future Value"
            >
              All
            </button>
            <button
              onClick={() => setGlobalFraming("hours")}
              className={`px-2 py-1 rounded-lg font-semibold transition ${
                globalFraming === "hours" ? "bg-[#abf34d] text-[#070c06]" : "hover:text-white"
              }`}
              title="Show Hours of Life Traded"
            >
              ⏱️ Hours
            </button>
            <button
              onClick={() => setGlobalFraming("future")}
              className={`px-2 py-1 rounded-lg font-semibold transition ${
                globalFraming === "future" ? "bg-emerald-400 text-[#070c06]" : "hover:text-white"
              }`}
              title="Show Future Wealth Opportunity"
            >
              📈 Opportunity
            </button>
          </div>

          <button
            onClick={onLoadDemoData}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#121b0f] hover:bg-[#1a2b0e] border border-[#23321f] text-xs font-semibold text-[#9bb093] hover:text-white transition"
            title="Reset to sample transactions"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">Demo Data</span>
          </button>

          <button
            onClick={onOpenSettingsModal}
            className="p-2 rounded-xl bg-[#121b0f] hover:bg-[#1a2b0e] border border-[#23321f] text-[#9bb093] hover:text-white transition"
            title="Settings & Baseline Rates"
          >
            <Settings className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#abf34d] to-[#8ae032] hover:from-[#bdf66a] hover:to-[#99ea43] text-[#070c06] font-extrabold text-xs shadow-xl shadow-[#abf34d]/20 transition transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <PlusCircle className="w-4 h-4 stroke-[2.5]" />
            Add Expense
          </button>
        </div>
      </div>
    </header>
  );
};
