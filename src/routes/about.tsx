import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useReducedMotion, Variants } from "framer-motion";
import {
  Clock,
  TrendingUp,
  ArrowRight,
  DollarSign,
  Zap,
  Sparkles,
  Lock,
  BarChart3,
  CheckCircle2,
} from "lucide-react";
import { RealCostCard } from "@/components/ui/realcost-card";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

// Scroll Reveal Motion Variants
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 35 },
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
      staggerChildren: 0.18,
    },
  },
};

const scaleUp: Variants = {
  hidden: { opacity: 0, scale: 0.94, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

function AboutPage() {
  const shouldReduceMotion = useReducedMotion();

  // Disable motion for users with prefers-reduced-motion
  const animationProps = (variants: Variants) =>
    shouldReduceMotion
      ? {}
      : {
          initial: "hidden",
          whileInView: "visible",
          viewport: { once: true, margin: "-60px" },
          variants,
        };

  return (
    <div className="relative min-h-screen bg-[#f7fdf3]/80 dark:bg-[#121910]/85 text-[#121910] dark:text-[#f7fdf3] flex flex-col items-center justify-between p-4 md:p-8 overflow-hidden transition-colors duration-300 selection:bg-[#b8f566] selection:text-[#121910]">
      {/* Ambient Radial Background Glows */}
      <div className="ambient-glow-top" aria-hidden="true" />
      <div className="ambient-glow-bottom" aria-hidden="true" />

      <div className="canvas-frame px-4 md:px-8 w-full max-w-5xl flex flex-col min-h-screen justify-between relative z-10 space-y-12">
        {/* Sticky Glass Navigation Bar */}
        <motion.header
          initial={shouldReduceMotion ? {} : { opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="sticky top-6 z-40 flex justify-center w-full"
        >
          <nav className="nav-pill dark:bg-[#1e281b]/90 dark:border-[#2d3a29]">
            <Link to="/" className="brand-logo">
              <svg className="w-5 h-5 fill-[#121910] dark:fill-[#83db28]" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              <span className="dark:text-white font-bold tracking-tight">RealCost</span>
            </Link>

            <div className="nav-links">
              <Link to="/" className="dark:text-gray-300">
                Dashboard
              </Link>
              <Link to="/about" className="active font-bold">
                About Us
              </Link>
            </div>

            <div className="ml-auto">
              <Link to="/" className="btn-card text-xs">
                View Dashboard
              </Link>
            </div>
          </nav>
        </motion.header>

        {/* Section A: Hero Section with Scroll Reveal */}
        <motion.section
          {...animationProps(fadeInUp)}
          className="text-center pt-8 pb-4 max-w-4xl mx-auto space-y-4"
        >
          <motion.div
            variants={fadeInUp}
            className="badge-pill inline-flex items-center gap-2 dark:bg-[#1e281b] dark:border-[#2d3a29]"
          >
            <Sparkles className="w-4 h-4 text-[#83db28]" />
            <span className="dark:text-white font-semibold">About RealCost</span>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-4xl md:text-6xl font-black text-[#121910] dark:text-white tracking-tight leading-[1.12]"
          >
            Money is time. <br />
            <span className="bg-gradient-to-r from-[#121910] via-[#2c4e16] to-[#60ad17] dark:from-white dark:via-[#83db28] dark:to-[#60ad17] bg-clip-text text-transparent">
              See what things actually cost.
            </span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-base md:text-lg text-[#5e6d56] dark:text-[#a0b396] max-w-2xl mx-auto leading-relaxed pt-2"
          >
            Most budgeting tools show you where your money went. RealCost shows you what you traded
            to get it, and what it could become if invested instead.
          </motion.p>

          {/* RealCost Card Visual Widget with Subtle Scale Reveal */}
          <motion.div variants={scaleUp} className="pt-6 flex justify-center">
            <RealCostCard />
          </motion.div>
        </motion.section>

        {/* Section B: Interactive Mini-Calculator Card */}
        <MiniCalculatorCard />

        {/* Section C: Value Proposition Grid (3 Feature Cards) */}
        <motion.section {...animationProps(staggerContainer)} className="space-y-6">
          <motion.div variants={fadeInUp} className="text-center max-w-xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#121910] dark:text-white tracking-tight">
              Three Pillars of Financial Clarity
            </h2>
            <p className="text-xs md:text-sm text-[#5e6d56] dark:text-[#a0b396] mt-1">
              Translating abstract numbers into intuitive human metrics.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <motion.div
              variants={scaleUp}
              className="p-8 rounded-3xl bg-white/80 dark:bg-[#1e281b] border border-white/90 dark:border-[#2d3a29] backdrop-blur-xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#f2faeb] dark:bg-[#28381e] border border-[#dff5cf] dark:border-[#2d3a29] flex items-center justify-center text-[#121910] dark:text-[#83db28] mb-5">
                  <Clock className="w-6 h-6 stroke-[2.2]" />
                </div>
                <h3 className="text-xl font-bold text-[#121910] dark:text-white mb-2">
                  Measure in Life Energy
                </h3>
                <p className="text-xs md:text-sm text-[#5e6d56] dark:text-[#a0b396] leading-relaxed">
                  Converts every purchase directly into working hours based on your net hourly rate.
                  Every expense is a trade of your finite time.
                </p>
              </div>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              variants={scaleUp}
              className="p-8 rounded-3xl bg-white/80 dark:bg-[#1e281b] border border-white/90 dark:border-[#2d3a29] backdrop-blur-xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#f2faeb] dark:bg-[#28381e] border border-[#dff5cf] dark:border-[#2d3a29] flex items-center justify-center text-[#121910] dark:text-[#83db28] mb-5">
                  <TrendingUp className="w-6 h-6 stroke-[2.2]" />
                </div>
                <h3 className="text-xl font-bold text-[#121910] dark:text-white mb-2">
                  See Opportunity Cost
                </h3>
                <p className="text-xs md:text-sm text-[#5e6d56] dark:text-[#a0b396] leading-relaxed">
                  Explains the 20-year compound projection formula and uncovers the true hidden
                  future wealth lost to impulse spending.
                </p>
              </div>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              variants={scaleUp}
              className="p-8 rounded-3xl bg-white/80 dark:bg-[#1e281b] border border-white/90 dark:border-[#2d3a29] backdrop-blur-xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#f2faeb] dark:bg-[#28381e] border border-[#dff5cf] dark:border-[#2d3a29] flex items-center justify-center text-[#121910] dark:text-[#83db28] mb-5">
                  <Zap className="w-6 h-6 stroke-[2.2]" />
                </div>
                <h3 className="text-xl font-bold text-[#121910] dark:text-white mb-2">
                  Audit Recurring Drains
                </h3>
                <p className="text-xs md:text-sm text-[#5e6d56] dark:text-[#a0b396] leading-relaxed">
                  Highlights how small monthly subscriptions compound into major capital losses over
                  decades, empowering you to cancel silent leaks.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Section D: Core Formulas Explainer */}
        <motion.section
          {...animationProps(fadeInUp)}
          className="p-8 md:p-10 rounded-3xl bg-white/70 dark:bg-[#1e281b]/80 border border-[#dff5cf] dark:border-[#2d3a29] backdrop-blur-xl shadow-sm space-y-6"
        >
          <div className="text-center max-w-xl mx-auto">
            <div className="badge-pill inline-flex items-center gap-2 mb-2 dark:bg-[#28381e]">
              <DollarSign className="w-4 h-4 text-[#83db28]" />
              <span>Mathematical Architecture</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#121910] dark:text-white tracking-tight">
              Foundational Equations
            </h2>
            <p className="text-xs md:text-sm text-[#5e6d56] dark:text-[#a0b396] mt-1">
              Transparent, deterministic calculations behind every single row in your ledger.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Formula 1 */}
            <motion.div
              variants={scaleUp}
              className="p-6 rounded-2xl bg-[#f2faeb]/90 dark:bg-[#1a2318] border border-[#dff5cf] dark:border-[#2d3a29] space-y-3"
            >
              <div className="text-xs font-bold uppercase tracking-wider text-[#5e6d56] dark:text-[#83db28]">
                Formula 1 — Life Energy Traded
              </div>
              <div className="p-4 rounded-xl bg-white/90 dark:bg-[#243021] border border-white dark:border-[#2d3a29] font-mono text-sm md:text-base font-bold text-[#121910] dark:text-white shadow-inner">
                Hours Traded = Expense / Hourly Rate
              </div>
              <p className="text-xs text-[#5e6d56] dark:text-[#a0b396] leading-relaxed">
                Calculates exact hours and minutes of labor required to earn the post-tax cash
                spent.
              </p>
            </motion.div>

            {/* Formula 2 */}
            <motion.div
              variants={scaleUp}
              className="p-6 rounded-2xl bg-[#f2faeb]/90 dark:bg-[#1a2318] border border-[#dff5cf] dark:border-[#2d3a29] space-y-3"
            >
              <div className="text-xs font-bold uppercase tracking-wider text-[#5e6d56] dark:text-[#83db28]">
                Formula 2 — Future Investment Value
              </div>
              <div className="p-4 rounded-xl bg-white/90 dark:bg-[#243021] border border-white dark:border-[#2d3a29] font-mono text-sm md:text-base font-bold text-[#2f6fed] dark:text-[#60a5fa] shadow-inner">
                Future Value = Expense × (1 + Rate)^Years
              </div>
              <p className="text-xs text-[#5e6d56] dark:text-[#a0b396] leading-relaxed">
                Projects what the expense amount would compound to if invested in an index return
                rate.
              </p>
            </motion.div>
          </div>
        </motion.section>

        {/* Section E: Mission & Principles */}
        <motion.section
          {...animationProps(staggerContainer)}
          className="p-8 md:p-12 rounded-3xl bg-white/80 dark:bg-[#1e281b] border border-white/90 dark:border-[#2d3a29] backdrop-blur-xl shadow-sm space-y-8"
        >
          <motion.div variants={fadeInUp} className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#121910] dark:text-white tracking-tight mb-3">
              Total clarity over every transaction.
            </h2>
            <p className="text-sm md:text-base text-[#5e6d56] dark:text-[#a0b396] leading-relaxed">
              We built RealCost because standard financial tools reward passive spending. RealCost
              brings honest personal accounting, zero demo clutter, and direct user ownership over
              your data.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <motion.div variants={scaleUp} className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#83db28] flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm text-[#121910] dark:text-white mb-1">
                  Zero Vanity Metrics
                </h4>
                <p className="text-xs text-[#5e6d56] dark:text-[#a0b396] leading-relaxed">
                  No arbitrary points or gamified spending. Only concrete hours and compounding
                  value.
                </p>
              </div>
            </motion.div>

            <motion.div variants={scaleUp} className="flex items-start gap-3">
              <BarChart3 className="w-5 h-5 text-[#83db28] flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm text-[#121910] dark:text-white mb-1">
                  Instant Opportunity Cost
                </h4>
                <p className="text-xs text-[#5e6d56] dark:text-[#a0b396] leading-relaxed">
                  Calculated live as you type your transaction details with 50+ auto-category chips.
                </p>
              </div>
            </motion.div>

            <motion.div variants={scaleUp} className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-[#83db28] flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm text-[#121910] dark:text-white mb-1">
                  Client-Side Privacy
                </h4>
                <p className="text-xs text-[#5e6d56] dark:text-[#a0b396] leading-relaxed">
                  All transaction data remains 100% private in local storage or your private
                  database.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Section F: Call to Action (CTA) Banner */}
        <motion.section
          {...animationProps(scaleUp)}
          className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-[#121910] via-[#1a2817] to-[#28381e] text-white text-center space-y-6 shadow-2xl relative overflow-hidden"
        >
          <div className="max-w-xl mx-auto space-y-3 relative z-10">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white">
              Take control of your real cost.
            </h2>
            <p className="text-sm md:text-base text-gray-300 leading-relaxed">
              Start transforming your everyday transactions into life-hours and long-term financial
              freedom.
            </p>
            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/"
                className="btn-card text-sm font-bold py-3 px-8 text-[#121910] bg-[#83db28] hover:bg-[#a2e84d] transition-all shadow-lg flex items-center gap-2 hover:scale-105"
              >
                <span>View Your Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.section>

        {/* Footer */}
        <footer className="w-full py-6 text-center text-xs text-[#5e6d56] dark:text-[#a0b396] border-t border-[#dff5cf] dark:border-[#2d3a29]">
          © {new Date().getFullYear()} RealCost Financial Engine. Built for financial intentionality
          and life-hour clarity.
        </footer>
      </div>
    </div>
  );
}

function MiniCalculatorCard() {
  const [viewMode, setViewMode] = useState<"traditional" | "realcost">("realcost");
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.section
      initial={shouldReduceMotion ? {} : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="p-8 md:p-10 rounded-3xl bg-white/80 dark:bg-[#1e281b] border border-white/90 dark:border-[#2d3a29] backdrop-blur-xl shadow-xl space-y-6 max-w-3xl mx-auto w-full"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="badge-pill inline-flex items-center gap-2 mb-1 dark:bg-[#28381e]">
            <Clock className="w-3.5 h-3.5 text-[#83db28]" />
            <span>Interactive Demo</span>
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#121910] dark:text-white tracking-tight">
            Experience the Mindset Shift
          </h2>
        </div>

        {/* Toggle Mode Button */}
        <div className="flex items-center p-1 rounded-full bg-[#f2faeb] dark:bg-[#1a2318] border border-[#dff5cf] dark:border-[#2d3a29] self-start md:self-auto">
          <button
            onClick={() => setViewMode("traditional")}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              viewMode === "traditional"
                ? "bg-white dark:bg-[#243021] text-[#121910] dark:text-white shadow-sm"
                : "text-[#5e6d56] dark:text-[#a0b396] hover:text-[#121910] dark:hover:text-white"
            }`}
          >
            Traditional View
          </button>
          <button
            onClick={() => setViewMode("realcost")}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewMode === "realcost"
                ? "bg-[#83db28] text-[#121910] shadow-md font-extrabold"
                : "text-[#5e6d56] dark:text-[#a0b396] hover:text-[#121910] dark:hover:text-white"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>RealCost View</span>
          </button>
        </div>
      </div>

      {/* Main Card Demo Container */}
      <div className="p-6 md:p-8 rounded-2xl bg-[#f7fdf3] dark:bg-[#141d12] border border-[#dff5cf] dark:border-[#2d3a29] space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#dff5cf] dark:border-[#2d3a29] pb-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#5e6d56] dark:text-[#a0b396]">
              Example Expense Scenario
            </div>
            <div className="text-lg font-bold text-[#121910] dark:text-white">
              Impulse Gadget Purchase
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs font-semibold text-[#5e6d56] dark:text-[#a0b396]">
              Hourly Rate: ₹500/hr
            </div>
            <div className="text-2xl font-black text-[#121910] dark:text-white">₹3,000</div>
          </div>
        </div>

        {viewMode === "traditional" ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="py-6 text-center space-y-3"
          >
            <div className="text-4xl font-extrabold text-gray-400 dark:text-gray-500">- ₹3,000</div>
            <p className="text-sm text-[#5e6d56] dark:text-[#a0b396] max-w-md mx-auto">
              Traditional budgeting apps only log ₹3,000 as a flat subtraction from your account
              balance. No perspective on work time or lost future compounding.
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Hours Traded View */}
              <div className="p-5 rounded-xl bg-white dark:bg-[#1e281b] border border-[#dff5cf] dark:border-[#2d3a29] space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#5e6d56] dark:text-[#83db28]">
                    1. Hours Traded
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-[#83db28]/20 text-[#2c4e16] dark:text-[#83db28]">
                    6 Hours of Life Traded
                  </span>
                </div>
                <div className="text-2xl font-black text-[#121910] dark:text-white">6.0 Hours</div>
                {/* Work Shift Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-semibold text-[#5e6d56] dark:text-[#a0b396]">
                    <span>Workday Shift (8 hrs)</span>
                    <span className="font-bold text-[#121910] dark:text-white">75% of Shift</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "75%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full rounded-full bg-gradient-to-r from-[#60ad17] to-[#83db28]"
                    />
                  </div>
                </div>
              </div>

              {/* Future Growth View */}
              <div className="p-5 rounded-xl bg-white dark:bg-[#1e281b] border border-[#dff5cf] dark:border-[#2d3a29] space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#2f6fed] dark:text-[#60a5fa]">
                    2. Future Growth (20 yrs @ 10%)
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                    6.73x Growth
                  </span>
                </div>
                <div className="text-2xl font-black text-[#2f6fed] dark:text-[#60a5fa]">
                  ₹20,182
                </div>
                <p className="text-xs text-[#5e6d56] dark:text-[#a0b396]">
                  ₹3,000 invested at 10% annual return compounds to ₹20,182 in 20 years.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#83db28]/15 border border-[#83db28]/30 text-xs md:text-sm text-[#121910] dark:text-[#e4f7d0] flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-[#2c4e16] dark:text-[#83db28] flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Mindset Shift: </span>
                By framing ₹3,000 as 6 hours of labor and ₹20,182 in long-term wealth, RealCost puts
                every purchasing decision into true perspective.
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
}
