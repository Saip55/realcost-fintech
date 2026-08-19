import React from "react";
import {
  Search,
  Clock,
  TrendingUp,
  DollarSign,
  Repeat,
  ArrowUpDown,
  Plus,
  Inbox,
  Flame,
  Zap,
  Layers,
} from "lucide-react";
import { Transaction, UserProfile, CategoryType, SortOption, GlobalFramingMode } from "../types";
import { CATEGORIES } from "../lib/categorization";
import { calculateHoursWorked, calculateFutureValue } from "../lib/calculations";
import { formatCurrency, formatHours, formatCompactCurrency } from "../lib/formatters";
import { TransactionRow } from "./TransactionRow";

interface DashboardProps {
  transactions: Transaction[];
  profile: UserProfile;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: CategoryType | "all";
  setSelectedCategory: (cat: CategoryType | "all") => void;
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;
  globalFraming: GlobalFramingMode;
  onEditTransaction: (tx: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
  onOpenAddModal: () => void;
  onOpenSettingsModal: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  transactions,
  profile,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  globalFraming,
  onEditTransaction,
  onDeleteTransaction,
  onOpenAddModal,
  onOpenSettingsModal,
}) => {
  const totalSpent = transactions.reduce((acc, curr) => acc + curr.amount, 0);
  const totalHoursWorked = calculateHoursWorked(totalSpent, profile.hourlyWage);
  const totalFutureValue = calculateFutureValue(
    totalSpent,
    profile.targetReturnRate,
    profile.timeHorizonYears,
  );

  const recurringItems = transactions.filter(
    (t) => t.isRecurring || t.category === "subscriptions",
  );
  const monthlySubscriptionBurn = recurringItems.reduce((acc, curr) => acc + curr.amount, 0);

  // Filter logic
  const filtered = transactions.filter((tx) => {
    const matchesSearch =
      tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tx.notes && tx.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || tx.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort logic
  filtered.sort((a, b) => {
    if (sortBy === "date-desc") return new Date(b.date).getTime() - new Date(a.date).getTime();
    if (sortBy === "date-asc") return new Date(a.date).getTime() - new Date(b.date).getTime();
    if (sortBy === "amount-desc") return b.amount - a.amount;
    if (sortBy === "hours-desc")
      return b.amount / profile.hourlyWage - a.amount / profile.hourlyWage;
    if (sortBy === "future-value-desc")
      return (
        calculateFutureValue(b.amount, profile.targetReturnRate, profile.timeHorizonYears) -
        calculateFutureValue(a.amount, profile.targetReturnRate, profile.timeHorizonYears)
      );
    return 0;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 4 Top Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Spent */}
        <div className="p-5 rounded-3xl fintech-glass fintech-glass-hover shadow-xl">
          <div className="flex items-center justify-between text-xs font-semibold text-[#84967c]">
            <span>Raw Cash Spent</span>
            <DollarSign className="w-4 h-4 text-[#84967c]" />
          </div>
          <div className="text-2xl font-extrabold text-white mt-2">
            {formatCurrency(totalSpent, profile.currencySymbol)}
          </div>
          <div className="text-[11px] text-[#84967c] mt-1.5">
            Total across {transactions.length} expenses
          </div>
        </div>

        {/* Card 2: Life Hours Traded */}
        <div className="p-5 rounded-3xl fintech-glass fintech-glass-hover border-[#abf34d]/40 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-28 h-28 bg-[#abf34d]/10 rounded-full blur-2xl pointer-events-none group-hover:bg-[#abf34d]/20 transition duration-500" />
          <div className="flex items-center justify-between text-xs font-bold text-[#abf34d]">
            <span>Life Hours Traded</span>
            <Clock className="w-4 h-4 text-[#abf34d]" />
          </div>
          <div className="text-2xl font-extrabold text-[#abf34d] mt-2">
            ⏱️ {formatHours(totalHoursWorked)}
          </div>
          <div className="text-[11px] text-[#9bb093] mt-1.5">
            At {formatCurrency(profile.hourlyWage, profile.currencySymbol)}/hr life rate
          </div>
        </div>

        {/* Card 3: Opportunity Cost Lost */}
        <div className="p-5 rounded-3xl fintech-glass fintech-glass-hover border-emerald-500/30 shadow-xl relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
            <span>{profile.timeHorizonYears}-Yr Opportunity Loss</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-400 mt-2">
            📈 {formatCompactCurrency(totalFutureValue, profile.currencySymbol)}
          </div>
          <div className="text-[11px] text-[#84967c] mt-1.5">
            Invested @ {profile.targetReturnRate}% index fund return
          </div>
        </div>

        {/* Card 4: Monthly Subscription Leak */}
        <div className="p-5 rounded-3xl fintech-glass fintech-glass-hover border-purple-500/30 shadow-xl">
          <div className="flex items-center justify-between text-xs font-bold text-purple-400">
            <span>Recurring Monthly Leak</span>
            <Repeat className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-extrabold text-white mt-2">
            {formatCurrency(monthlySubscriptionBurn, profile.currencySymbol)}
            <span className="text-xs font-normal text-[#84967c]">/mo</span>
          </div>
          <div className="text-[11px] text-purple-300 mt-1.5">
            {recurringItems.length} active recurring subscriptions
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="fintech-glass rounded-3xl p-4 space-y-3">
        {/* Search Input & Sort Selector */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#84967c]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search expenses, coffee, Netflix..."
              className="w-full pl-9 pr-3 py-2 bg-[#070c06] border border-[#23321f] rounded-xl text-xs text-white focus:outline-none focus:border-[#abf34d]"
            />
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <span className="text-xs text-[#84967c] flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" />
              Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-[#070c06] border border-[#23321f] rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-[#abf34d]"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="hours-desc">Most Hours Traded</option>
              <option value="future-value-desc">Highest Opportunity Cost</option>
              <option value="amount-desc">Highest Amount ($)</option>
            </select>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              selectedCategory === "all"
                ? "bg-[#abf34d] text-[#070c06]"
                : "bg-[#070c06] text-[#84967c] hover:text-white border border-[#23321f]"
            }`}
          >
            All Categories
          </button>

          {Object.values(CATEGORIES).map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                selectedCategory === cat.id
                  ? "bg-[#abf34d] text-[#070c06]"
                  : "bg-[#070c06] text-[#84967c] hover:text-white border border-[#23321f]"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Transaction List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-extrabold text-[#9bb093] uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-[#abf34d]" />
            Logged Expenses ({filtered.length})
          </h3>
          <span className="text-xs text-[#84967c]">Reframed in Hours & Future Wealth</span>
        </div>

        {filtered.length === 0 ? (
          <div className="fintech-glass rounded-3xl p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#142312] text-[#abf34d] flex items-center justify-center mx-auto">
              <Inbox className="w-6 h-6" />
            </div>
            <div className="text-white font-bold text-base">No matching expenses found</div>
            <p className="text-xs text-[#84967c] max-w-sm mx-auto">
              Try adjusting your search query or category filters, or log a new transaction.
            </p>
            <button
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#abf34d] text-[#070c06] font-bold text-xs shadow-lg shadow-[#abf34d]/20 transition"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              Add Expense
            </button>
          </div>
        ) : (
          filtered.map((tx) => (
            <TransactionRow
              key={tx.id}
              transaction={tx}
              profile={profile}
              globalFraming={globalFraming}
              onEdit={onEditTransaction}
              onDelete={onDeleteTransaction}
            />
          ))
        )}
      </div>
    </div>
  );
};
