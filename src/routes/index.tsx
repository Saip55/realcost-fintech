import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { motion, useReducedMotion, Variants } from "framer-motion";
import {
  TransactionItem,
  ProfileSettings,
  DEFAULT_SETTINGS,
  SEED_DATA,
  CATEGORIES,
  autoCategorize,
  formatCurrency,
  formatHours,
  formatFutureValue,
  formatDateDisplay,
  CALCULATIONS,
  exportToCSV,
} from "@/lib/calculations";
import { FintechCard } from "@/components/FintechCard";
import { SubscriptionShock } from "@/components/SubscriptionShock";
import { WhatIfSimulator } from "@/components/WhatIfSimulator";
import { InsightsPanel } from "@/components/InsightsPanel";
import { SettingsModal } from "@/components/SettingsModal";
import { Timer, TrendingUp, Zap, Sparkles } from "lucide-react";

export const Route = createFileRoute("/")({
  component: RealCostMainPage,
});

// Scroll Motion Variants
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const scaleUp: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

function RealCostMainPage() {
  const shouldReduceMotion = useReducedMotion();

  const [settings, setSettings] = useState<ProfileSettings>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("realcost_settings");
        if (saved) return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_SETTINGS;
  });

  const [transactions, setTransactions] = useState<TransactionItem[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("realcost_transactions");
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return SEED_DATA;
  });

  const [activeTab, setActiveTab] = useState<"dashboard" | "insights" | "whatif">("dashboard");
  const [filterCategory, setFilterCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"date" | "amount" | "hours">("date");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Form State
  const [formDesc, setFormDesc] = useState("");
  const [formAmount, setFormAmount] = useState("");
  const [formCategory, setFormCategory] = useState<string>("Food");
  const [formIsRecurring, setFormIsRecurring] = useState(false);
  const [formNotes, setFormNotes] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("realcost_settings", JSON.stringify(settings));
    }
  }, [settings]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("realcost_transactions", JSON.stringify(transactions));
    }
  }, [transactions]);

  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [settings.darkMode]);

  const handleDescChange = (val: string) => {
    setFormDesc(val);
    const cat = autoCategorize(val);
    if (cat !== "Other") {
      setFormCategory(cat);
    }
  };

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(formAmount);
    if (!formDesc.trim() || isNaN(amt) || amt <= 0) {
      toast.error("Please enter a valid description and positive amount.");
      return;
    }

    const newTx: TransactionItem = {
      id: Date.now().toString(),
      description: formDesc.trim(),
      amount: amt,
      category: formCategory,
      isRecurring: formIsRecurring,
      date: new Date().toISOString().split("T")[0] || "",
    };
    if (formNotes.trim()) {
      newTx.notes = formNotes.trim();
    }

    setTransactions((prev) => [newTx, ...prev]);
    setFormDesc("");
    setFormAmount("");
    setFormNotes("");
    setFormIsRecurring(false);
    toast.success(
      `Logged "${newTx.description}" (${formatCurrency(amt, settings.currencySymbol, settings.currencyCode)})`,
    );
  };

  const handleDeleteTransaction = (id: string) => {
    const item = transactions.find((t) => t.id === id);
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    toast.info(`Deleted transaction "${item?.description || id}"`);
  };

  const handleToggleRecurring = (id: string) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isRecurring: !t.isRecurring } : t)),
    );
  };

  const handleResetDemoData = () => {
    setTransactions(SEED_DATA);
    toast.success("Reset to sample financial dataset");
  };

  // Aggregations
  const totalSpend = transactions.reduce((acc, t) => acc + t.amount, 0);
  const totalHoursWorked = CALCULATIONS.hoursOfWork(totalSpend, settings.hourlyRate);
  const totalFutureValue = CALCULATIONS.futureValue(
    totalSpend,
    settings.expectedReturn,
    settings.projectionYears,
  );

  // Filtering & Sorting
  const filteredTransactions = transactions
    .filter((t) => {
      const matchesCategory = filterCategory === "All" || t.category === filterCategory;
      const matchesSearch =
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.notes && t.notes.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "amount") return b.amount - a.amount;
      if (sortBy === "hours") {
        const hA = CALCULATIONS.hoursOfWork(a.amount, settings.hourlyRate);
        const hB = CALCULATIONS.hoursOfWork(b.amount, settings.hourlyRate);
        return hB - hA;
      }
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  const currencySymbol = settings.currencySymbol || "₹";
  const currencyCode = settings.currencyCode || "INR";

  const animationProps = (variants: Variants) =>
    shouldReduceMotion
      ? {}
      : {
          initial: "hidden",
          whileInView: "visible",
          viewport: { once: true, margin: "-50px" },
          variants,
        };

  return (
    <div className="relative min-h-screen bg-[#f7fdf3]/80 dark:bg-[#121910]/85 text-[#121910] dark:text-[#f7fdf3] flex flex-col items-center justify-between p-4 md:p-8 overflow-hidden transition-colors duration-300 selection:bg-[#b8f566] selection:text-[#121910]">
      {/* Ambient Radial Background Glows */}
      <div className="ambient-glow-top" aria-hidden="true" />
      <div className="ambient-glow-bottom" aria-hidden="true" />

      <div className="canvas-frame px-4 md:px-8 w-full max-w-6xl flex flex-col min-h-screen justify-between relative z-10">
        {/* Sticky Glass Navigation Bar */}
        <motion.header
          initial={shouldReduceMotion ? {} : { opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="sticky top-6 z-40 flex justify-center w-full mb-8"
        >
          <nav className="nav-pill dark:bg-[#1e281b]/90 dark:border-[#2d3a29]">
            <Link to="/" className="brand-logo">
              <svg className="w-5 h-5 fill-[#121910] dark:fill-[#83db28]" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              <span className="dark:text-white font-bold tracking-tight">RealCost</span>
            </Link>

            <div className="nav-links">
              <button
                onClick={() => {
                  setActiveTab("dashboard");
                  document.getElementById("dashboard")?.scrollIntoView({ behavior: "smooth" });
                }}
                className={activeTab === "dashboard" ? "active font-bold" : "dark:text-gray-300"}
              >
                Dashboard
              </button>
              <button
                onClick={() => {
                  setActiveTab("insights");
                  document.getElementById("insights")?.scrollIntoView({ behavior: "smooth" });
                }}
                className={activeTab === "insights" ? "active font-bold" : "dark:text-gray-300"}
              >
                Insights
              </button>
              <button
                onClick={() => {
                  setActiveTab("whatif");
                  document.getElementById("what-if")?.scrollIntoView({ behavior: "smooth" });
                }}
                className={activeTab === "whatif" ? "active font-bold" : "dark:text-gray-300"}
              >
                What-If Engine
              </button>
              <Link to="/about" className="dark:text-gray-300">
                About Us 🌐
              </Link>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={() => setSettings((prev) => ({ ...prev, darkMode: !prev.darkMode }))}
                className="p-2 rounded-full hover:bg-white/60 dark:hover:bg-[#28381e] text-[#121910] dark:text-white transition-colors"
                title="Toggle Dark Mode"
                aria-label="Toggle Dark Mode"
              >
                {settings.darkMode ? "☀️" : "🌙"}
              </button>

              <button
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 rounded-full hover:bg-white/60 dark:hover:bg-[#28381e] text-[#121910] dark:text-white transition-colors"
                title="Settings"
                aria-label="Settings"
              >
                <svg className="w-5 h-5 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>
            </div>
          </nav>
        </motion.header>

        {/* Hero Section */}
        <motion.section
          {...animationProps(fadeInUp)}
          className="text-center py-10 md:py-16 max-w-4xl mx-auto relative z-10"
          id="onboarding"
        >
          <motion.h1
            variants={fadeInUp}
            className="text-4xl md:text-6xl font-black text-[#121910] dark:text-white tracking-tight leading-[1.12] mb-5"
          >
            Discover Your{" "}
            <span className="bg-gradient-to-r from-[#121910] via-[#2c4e16] to-[#60ad17] dark:from-white dark:via-[#83db28] dark:to-[#60ad17] bg-clip-text text-transparent">
              Real Cost
            </span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-base md:text-lg text-[#5e6d56] dark:text-[#a0b396] max-w-2xl mx-auto leading-relaxed mb-8"
          >
            Every purchase has a hidden cost in{" "}
            <strong className="text-[#121910] dark:text-white">hours of work</strong> and{" "}
            <strong className="text-[#121910] dark:text-white">future wealth lost</strong>. Uncover
            what your spending actually costs you.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="flex flex-wrap items-center justify-center gap-4 mb-10"
          >
            <button
              onClick={() => {
                document.getElementById("dashboard")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="btn-card text-sm"
            >
              Add Expense
            </button>
            <button
              onClick={handleResetDemoData}
              className="px-6 py-2.5 rounded-full border border-[#dff5cf] dark:border-[#2d3a29] bg-white/90 dark:bg-[#243021] text-[#121910] dark:text-white font-semibold text-sm hover:bg-[#e6f9d5] dark:hover:bg-[#28381e] transition-all shadow-sm"
            >
              Reload Demo Data
            </button>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="px-6 py-2.5 rounded-full border border-[#dff5cf] dark:border-[#2d3a29] bg-white/90 dark:bg-[#243021] text-[#121910] dark:text-white font-semibold text-sm hover:bg-[#e6f9d5] dark:hover:bg-[#28381e] transition-all shadow-sm font-mono"
            >
              ⚙️ Wage ({currencySymbol}
              {settings.hourlyRate}/hr)
            </button>
          </motion.div>

          {/* 3D Interactive Floating Card */}
          <motion.div variants={scaleUp} className="flex justify-center my-6">
            <FintechCard
              hourlyRate={settings.hourlyRate}
              expectedReturn={settings.expectedReturn}
              projectionYears={settings.projectionYears}
              currencySymbol={currencySymbol}
              currencyCode={currencyCode}
              onClick={() => setIsSettingsOpen(true)}
            />
          </motion.div>
        </motion.section>

        {/* 4 Feature Pillars Grid */}
        <motion.section
          {...animationProps(staggerContainer)}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-12"
          aria-label="Key features"
        >
          {/* Card 1 */}
          <motion.div
            variants={scaleUp}
            className="group relative p-6 rounded-3xl bg-white/80 dark:bg-[#1e281b] border border-white/90 dark:border-[#2d3a29] backdrop-blur-xl shadow-sm hover:shadow-2xl hover:shadow-[#83db28]/20 hover:-translate-y-2 hover:scale-[1.02] hover:border-[#83db28]/70 dark:hover:border-[#83db28]/70 transition-all duration-300 flex flex-col items-center text-center cursor-pointer"
          >
            <div className="w-16 h-16 rounded-2xl bg-[#f2faeb] dark:bg-[#28381e] border border-[#dff5cf] dark:border-[#2d3a29] flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 group-hover:bg-[#83db28]/25 transition-all duration-300 shadow-sm">
              <Timer className="w-7 h-7 text-[#121910] dark:text-[#83db28] stroke-[2.2]" />
            </div>
            <h3 className="font-extrabold text-base md:text-lg text-[#121910] dark:text-white mb-2 tracking-tight group-hover:text-[#2c5213] dark:group-hover:text-[#83db28] transition-colors">
              Time-Cost Engine
            </h3>
            <p className="text-xs md:text-sm text-[#5e6d56] dark:text-[#a0b396] leading-relaxed">
              Converts every purchase into exact hours and minutes of your life traded.
            </p>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            variants={scaleUp}
            className="group relative p-6 rounded-3xl bg-white/80 dark:bg-[#1e281b] border border-white/90 dark:border-[#2d3a29] backdrop-blur-xl shadow-sm hover:shadow-2xl hover:shadow-[#83db28]/20 hover:-translate-y-2 hover:scale-[1.02] hover:border-[#83db28]/70 dark:hover:border-[#83db28]/70 transition-all duration-300 flex flex-col items-center text-center cursor-pointer"
          >
            <div className="w-16 h-16 rounded-2xl bg-[#f2faeb] dark:bg-[#28381e] border border-[#dff5cf] dark:border-[#2d3a29] flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 group-hover:bg-[#83db28]/25 transition-all duration-300 shadow-sm">
              <TrendingUp className="w-7 h-7 text-[#121910] dark:text-[#83db28] stroke-[2.2]" />
            </div>
            <h3 className="font-extrabold text-base md:text-lg text-[#121910] dark:text-white mb-2 tracking-tight group-hover:text-[#2c5213] dark:group-hover:text-[#83db28] transition-colors">
              Opportunity Value
            </h3>
            <p className="text-xs md:text-sm text-[#5e6d56] dark:text-[#a0b396] leading-relaxed">
              Reveals what that money would compound to in {settings.projectionYears} years if
              invested at {settings.expectedReturn}%.
            </p>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            variants={scaleUp}
            className="group relative p-6 rounded-3xl bg-white/80 dark:bg-[#1e281b] border border-white/90 dark:border-[#2d3a29] backdrop-blur-xl shadow-sm hover:shadow-2xl hover:shadow-[#83db28]/20 hover:-translate-y-2 hover:scale-[1.02] hover:border-[#83db28]/70 dark:hover:border-[#83db28]/70 transition-all duration-300 flex flex-col items-center text-center cursor-pointer"
          >
            <div className="w-16 h-16 rounded-2xl bg-[#f2faeb] dark:bg-[#28381e] border border-[#dff5cf] dark:border-[#2d3a29] flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 group-hover:bg-[#83db28]/25 transition-all duration-300 shadow-sm">
              <Zap className="w-7 h-7 text-[#121910] dark:text-[#83db28] stroke-[2.2]" />
            </div>
            <h3 className="font-extrabold text-base md:text-lg text-[#121910] dark:text-white mb-2 tracking-tight group-hover:text-[#2c5213] dark:group-hover:text-[#83db28] transition-colors">
              Subscription Shock
            </h3>
            <p className="text-xs md:text-sm text-[#5e6d56] dark:text-[#a0b396] leading-relaxed">
              Unmasks the compounding lifetime drain of small recurring monthly fees.
            </p>
          </motion.div>

          {/* Card 4 */}
          <motion.div
            variants={scaleUp}
            className="group relative p-6 rounded-3xl bg-white/80 dark:bg-[#1e281b] border border-white/90 dark:border-[#2d3a29] backdrop-blur-xl shadow-sm hover:shadow-2xl hover:shadow-[#83db28]/20 hover:-translate-y-2 hover:scale-[1.02] hover:border-[#83db28]/70 dark:hover:border-[#83db28]/70 transition-all duration-300 flex flex-col items-center text-center cursor-pointer"
          >
            <div className="w-16 h-16 rounded-2xl bg-[#f2faeb] dark:bg-[#28381e] border border-[#dff5cf] dark:border-[#2d3a29] flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 group-hover:bg-[#83db28]/25 transition-all duration-300 shadow-sm">
              <Sparkles className="w-7 h-7 text-[#121910] dark:text-[#83db28] stroke-[2.2]" />
            </div>
            <h3 className="font-extrabold text-base md:text-lg text-[#121910] dark:text-white mb-2 tracking-tight group-hover:text-[#2c5213] dark:group-hover:text-[#83db28] transition-colors">
              What-If Simulator
            </h3>
            <p className="text-xs md:text-sm text-[#5e6d56] dark:text-[#a0b396] leading-relaxed">
              Experiment with minor habit cuts to see massive long-term wealth transformation.
            </p>
          </motion.div>
        </motion.section>

        {/* Subscription Shock Audit Widget */}
        <motion.div {...animationProps(fadeInUp)}>
          <SubscriptionShock
            transactions={transactions}
            expectedReturn={settings.expectedReturn}
            projectionYears={settings.projectionYears}
            currencySymbol={currencySymbol}
            currencyCode={currencyCode}
            onToggleRecurring={handleToggleRecurring}
          />
        </motion.div>

        {/* Main Dashboard Ledger & Quick Add */}
        <motion.section
          {...animationProps(fadeInUp)}
          className="glass-panel p-6 md:p-10 my-8 dark:bg-[#1e281b] dark:border-[#2d3a29]"
          id="dashboard"
        >
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Quick Add Form */}
            <div className="lg:w-1/3 space-y-4">
              <div className="badge-pill mb-2">
                <span className="text-sm">⚡</span>
                Quick Add Expense
              </div>
              <h2 className="text-xl font-extrabold text-[#121910] dark:text-white">
                Log New Transaction
              </h2>

              <form onSubmit={handleAddTransaction} className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider block mb-1 dark:text-gray-200">
                    Description
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Starbucks Coffee, Netflix, Uber"
                    value={formDesc}
                    onChange={(e) => handleDescChange(e.target.value)}
                    className="input-glass dark:bg-[#243021] dark:border-[#2d3a29] dark:text-white w-full"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider block mb-1 dark:text-gray-200">
                      Amount ({currencySymbol})
                    </label>
                    <input
                      type="number"
                      step="any"
                      min="0.01"
                      placeholder="e.g. 250"
                      value={formAmount}
                      onChange={(e) => setFormAmount(e.target.value)}
                      className="input-glass dark:bg-[#243021] dark:border-[#2d3a29] dark:text-white w-full"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider block mb-1 dark:text-gray-200">
                      Category
                    </label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="input-glass dark:bg-[#243021] dark:border-[#2d3a29] dark:text-white w-full"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="isRecurring"
                    checked={formIsRecurring}
                    onChange={(e) => setFormIsRecurring(e.target.checked)}
                    className="rounded border-[#dff5cf] text-[#83db28] focus:ring-[#83db28]"
                  />
                  <label
                    htmlFor="isRecurring"
                    className="text-xs font-semibold text-[#5e6d56] dark:text-[#a0b396] cursor-pointer"
                  >
                    Recurring Monthly Subscription
                  </label>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider block mb-1 dark:text-gray-200">
                    Notes (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Weekly treat with friends"
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    className="input-glass dark:bg-[#243021] dark:border-[#2d3a29] dark:text-white w-full"
                  />
                </div>

                <button type="submit" className="btn-card w-full text-sm font-bold py-3 mt-2">
                  <span>Calculate & Log Expense</span>
                </button>
              </form>

              {/* RealCost Live Preview calculation */}
              {formAmount && parseFloat(formAmount) > 0 && (
                <div className="p-4 rounded-2xl bg-[#83db28]/15 border border-[#83db28]/30 space-y-1.5 animate-fadeIn">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#2c5213] dark:text-[#83db28]">
                    RealCost Live Calculation
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold">
                    <span>Hours of Work Traded:</span>
                    <span className="text-[#121910] dark:text-white">
                      {formatHours(
                        CALCULATIONS.hoursOfWork(parseFloat(formAmount), settings.hourlyRate),
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold">
                    <span>{settings.projectionYears}-Yr Opportunity Value:</span>
                    <span className="text-[#2f6fed] dark:text-[#60a5fa]">
                      {formatCurrency(
                        CALCULATIONS.futureValue(
                          parseFloat(formAmount),
                          settings.expectedReturn,
                          settings.projectionYears,
                        ),
                        currencySymbol,
                        currencyCode,
                      )}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Ledger Transactions Table */}
            <div className="lg:w-2/3 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-[#dff5cf] dark:border-[#2d3a29]">
                <div>
                  <h2 className="text-xl font-extrabold text-[#121910] dark:text-white">
                    RealCost Ledger
                  </h2>
                  <p className="text-xs text-[#5e6d56] dark:text-[#a0b396]">
                    Showing {filteredTransactions.length} of {transactions.length} total entries
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="text"
                    placeholder="Search expenses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input-glass py-1.5 px-3 text-xs w-36 sm:w-44 dark:bg-[#243021] dark:border-[#2d3a29] dark:text-white"
                  />

                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="input-glass py-1.5 px-3 text-xs dark:bg-[#243021] dark:border-[#2d3a29] dark:text-white"
                  >
                    <option value="All">All Categories</option>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as "date" | "amount" | "hours")}
                    className="input-glass py-1.5 px-3 text-xs dark:bg-[#243021] dark:border-[#2d3a29] dark:text-white"
                  >
                    <option value="date">Sort: Date (Recent)</option>
                    <option value="amount">Sort: Highest Amount</option>
                    <option value="hours">Sort: Most Life Hours</option>
                  </select>

                  <button
                    onClick={() => exportToCSV(transactions, settings)}
                    className="px-3 py-1.5 rounded-full border border-[#dff5cf] dark:border-[#2d3a29] bg-white/80 dark:bg-[#243021] text-xs font-bold hover:bg-[#e6f9d5] dark:hover:bg-[#28381e] transition-all"
                    title="Export Ledger to CSV"
                  >
                    📥 CSV
                  </button>
                </div>
              </div>

              {/* Transactions List */}
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {filteredTransactions.length === 0 ? (
                  <div className="p-8 text-center text-[#5e6d56] dark:text-[#a0b396] bg-white/40 dark:bg-[#1a2318] rounded-2xl border border-dashed border-[#dff5cf] dark:border-[#2d3a29]">
                    No transactions match your search or filter.
                  </div>
                ) : (
                  filteredTransactions.map((tx) => {
                    const hours = CALCULATIONS.hoursOfWork(tx.amount, settings.hourlyRate);
                    const fv = CALCULATIONS.futureValue(
                      tx.amount,
                      settings.expectedReturn,
                      settings.projectionYears,
                    );

                    return (
                      <motion.div
                        key={tx.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className="p-4 rounded-2xl bg-white/90 dark:bg-[#243021] border border-[#dff5cf] dark:border-[#2d3a29] hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-[#121910] dark:text-white">
                              {tx.description}
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#f2faeb] dark:bg-[#1a2318] text-[#5e6d56] dark:text-[#a0b396] border border-[#dff5cf] dark:border-[#2d3a29]">
                              {tx.category}
                            </span>
                            {tx.isRecurring && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#83db28]/20 text-[#2c4e16] dark:text-[#83db28]">
                                🔁 Sub
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-[#5e6d56] dark:text-[#a0b396] flex items-center gap-3">
                            <span>{formatDateDisplay(tx.date)}</span>
                            {tx.notes && <span>• {tx.notes}</span>}
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-[#dff5cf] dark:border-[#2d3a29]">
                          <div className="text-right">
                            <div className="text-sm font-extrabold text-[#121910] dark:text-white">
                              {formatCurrency(tx.amount, currencySymbol, currencyCode)}
                            </div>
                            <div className="text-xs font-bold text-[#5e6d56] dark:text-[#83db28]">
                              ⏱️ {formatHours(hours)}
                            </div>
                          </div>

                          <div className="text-right min-w-[90px]">
                            <div className="text-xs font-semibold text-[#5e6d56] dark:text-[#a0b396]">
                              Future Value
                            </div>
                            <div className="text-xs font-extrabold text-[#2f6fed] dark:text-[#60a5fa]">
                              {formatFutureValue(
                                tx.amount,
                                settings.projectionYears,
                                settings.expectedReturn,
                                currencySymbol,
                                currencyCode,
                              )}
                            </div>
                          </div>

                          <button
                            onClick={() => handleDeleteTransaction(tx.id)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                            title="Delete entry"
                            aria-label="Delete entry"
                          >
                            🗑️
                          </button>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Insights Analytics Section */}
        <motion.div {...animationProps(fadeInUp)} id="insights" className="my-10">
          <InsightsPanel
            transactions={transactions}
            hourlyRate={settings.hourlyRate}
            expectedReturn={settings.expectedReturn}
            projectionYears={settings.projectionYears}
            currencySymbol={currencySymbol}
            currencyCode={currencyCode}
          />
        </motion.div>

        {/* What-If Simulator Section */}
        <motion.div {...animationProps(fadeInUp)} id="what-if" className="my-10">
          <WhatIfSimulator
            expectedReturn={settings.expectedReturn}
            projectionYears={settings.projectionYears}
            currencySymbol={currencySymbol}
            currencyCode={currencyCode}
          />
        </motion.div>

        {/* Footer */}
        <footer className="w-full py-6 text-center text-xs text-[#5e6d56] dark:text-[#a0b396] border-t border-[#dff5cf] dark:border-[#2d3a29] mt-12">
          © {new Date().getFullYear()} RealCost Financial Engine. Calculated with post-tax hourly
          rate & compounding wealth formulas.
        </footer>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        transactions={transactions}
        onSave={(newSet: ProfileSettings) => {
          setSettings(newSet);
          toast.success("Updated wage & return parameters!");
        }}
      />
    </div>
  );
}
