import React, { useState } from "react";
import {
  ProfileSettings,
  SUPPORTED_CURRENCIES,
  TransactionItem,
  exportToCSV,
} from "@/lib/calculations";

interface SettingsModalProps {
  isOpen: boolean;
  settings: ProfileSettings;
  transactions: TransactionItem[];
  onSave: (newSettings: ProfileSettings) => void;
  onClose: () => void;
  onClearData?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  settings,
  transactions,
  onSave,
  onClose,
  onClearData,
}) => {
  const [hourlyRate, setHourlyRate] = useState<number>(settings.hourlyRate);
  const [expectedReturn, setExpectedReturn] = useState<number>(settings.expectedReturn);
  const [projectionYears, setProjectionYears] = useState<number>(settings.projectionYears);
  const [currencyCode, setCurrencyCode] = useState<string>(settings.currencyCode || "INR");
  const [darkMode, setDarkMode] = useState<boolean>(settings.darkMode || false);
  const [annualSalary, setAnnualSalary] = useState<string>("");

  if (!isOpen) return null;

  const handleSalaryConvert = () => {
    const salary = Number(annualSalary);
    if (salary > 0) {
      // 52 weeks * 40 hours = 2080 working hours
      const calculatedRate = Math.round(salary / 2080);
      setHourlyRate(calculatedRate);
    }
  };

  const handleCurrencyChange = (code: string) => {
    setCurrencyCode(code);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currObj =
      SUPPORTED_CURRENCIES.find((c) => c.code === currencyCode) ?? SUPPORTED_CURRENCIES[0]!;
    onSave({
      hourlyRate: Number(hourlyRate) || 500,
      expectedReturn: Number(expectedReturn) || 7,
      projectionYears: Number(projectionYears) || 20,
      currencyCode: currObj.code,
      currencySymbol: currObj.symbol,
      darkMode: darkMode,
    });
    onClose();
  };

  const currentSymbol = SUPPORTED_CURRENCIES.find((c) => c.code === currencyCode)?.symbol || "₹";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-[#fcfdfa] dark:bg-[#1a2318] border border-[#dff5cf] dark:border-[#2d3a29] rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl relative text-[#121910] dark:text-white my-8 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 dark:hover:text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Close modal"
        >
          ✕
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-[#e6f9d5] dark:bg-[#28381e] flex items-center justify-center text-xl">
            ⚙️
          </div>
          <div>
            <h3 className="text-xl font-bold">Financial Settings</h3>
            <p className="text-xs text-[#5e6d56] dark:text-[#a0b396]">
              Tune your hourly wage, currency, & investment assumptions
            </p>
          </div>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-5">
          {/* Currency Selection */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider mb-1.5 block">
              Currency
            </label>
            <div className="grid grid-cols-3 gap-2">
              {SUPPORTED_CURRENCIES.map((curr) => (
                <button
                  key={curr.code}
                  type="button"
                  onClick={() => handleCurrencyChange(curr.code)}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all flex items-center justify-center gap-1.5 ${
                    currencyCode === curr.code
                      ? "bg-[#121910] text-white dark:bg-[#83db28] dark:text-[#121910] border-transparent shadow-sm"
                      : "bg-white dark:bg-[#243021] text-[#121910] dark:text-gray-200 border-[#dff5cf] dark:border-[#2d3a29] hover:bg-[#e6f9d5]"
                  }`}
                >
                  <span className="font-mono text-sm">{curr.symbol}</span>
                  <span>{curr.code}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Hourly Rate */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider">
                Net Hourly Rate ({currentSymbol}/hr)
              </label>
              <span className="text-xs text-[#5e6d56] dark:text-[#a0b396]">
                Default: {currentSymbol}500
              </span>
            </div>
            <input
              type="number"
              min="1"
              max="500000"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(Number(e.target.value))}
              className="input-glass font-mono font-bold text-base dark:bg-[#243021] dark:border-[#2d3a29] dark:text-white"
              required
            />

            {/* Quick salary converter helper */}
            <div className="mt-2 p-3 bg-white/70 dark:bg-[#243021] rounded-xl border border-[#dff5cf] dark:border-[#2d3a29] text-xs">
              <span className="text-[#5e6d56] dark:text-[#a0b396] block mb-1.5 font-medium">
                Calculate from Annual Take-Home Salary:
              </span>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="e.g. 1000000"
                  value={annualSalary}
                  onChange={(e) => setAnnualSalary(e.target.value)}
                  className="input-glass py-1.5 px-3 text-xs flex-1 dark:bg-[#1a2318] dark:border-[#2d3a29] dark:text-white"
                />
                <button
                  type="button"
                  onClick={handleSalaryConvert}
                  className="px-3 py-1.5 rounded-lg bg-[#e6f9d5] dark:bg-[#83db28] text-[#121910] font-semibold text-xs transition-colors hover:bg-[#b8f566]"
                >
                  Convert
                </button>
              </div>
            </div>
          </div>

          {/* Expected Annual Return */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider">
                Expected Annual Return (%)
              </label>
              <span className="text-xs text-[#5e6d56] dark:text-[#a0b396]">
                Equities/Index: ~7% to 12%
              </span>
            </div>
            <input
              type="number"
              min="0"
              max="30"
              step="0.5"
              value={expectedReturn}
              onChange={(e) => setExpectedReturn(Number(e.target.value))}
              className="input-glass font-mono font-bold text-base dark:bg-[#243021] dark:border-[#2d3a29] dark:text-white"
              required
            />
          </div>

          {/* Projection Years */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider">
                Compounding Horizon (Years)
              </label>
              <span className="text-xs text-[#5e6d56] dark:text-[#a0b396]">
                {projectionYears} Years
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[10, 15, 20, 30].map((years) => (
                <button
                  key={years}
                  type="button"
                  onClick={() => setProjectionYears(years)}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                    projectionYears === years
                      ? "bg-[#121910] text-white dark:bg-[#83db28] dark:text-[#121910] border-transparent shadow-sm"
                      : "bg-white dark:bg-[#243021] text-[#121910] dark:text-gray-200 border-[#dff5cf] dark:border-[#2d3a29] hover:bg-[#e6f9d5]"
                  }`}
                >
                  {years} Yrs
                </button>
              ))}
            </div>
          </div>

          {/* Data Export & Backup */}
          <div className="pt-2 border-t border-[#dff5cf] dark:border-[#2d3a29]">
            <label className="text-xs font-bold uppercase tracking-wider block mb-2">
              Data Management & Backup
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => exportToCSV(transactions, settings)}
                className="flex-1 py-2 px-3 rounded-xl border border-[#dff5cf] dark:border-[#2d3a29] bg-white dark:bg-[#243021] text-xs font-semibold hover:bg-[#e6f9d5] dark:hover:bg-[#28381e] flex items-center justify-center gap-1.5 transition-colors"
              >
                📥 Export CSV ({transactions.length} rows)
              </button>
              {onClearData && (
                <button
                  type="button"
                  onClick={onClearData}
                  className="py-2 px-3 rounded-xl border border-red-200 bg-red-50 text-red-700 text-xs font-semibold hover:bg-red-100 transition-colors"
                >
                  🗑️ Reset Data
                </button>
              )}
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-full border border-[#dff5cf] dark:border-[#2d3a29] bg-white dark:bg-[#243021] font-semibold text-sm hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button type="submit" className="flex-1 btn-card justify-center py-3 text-sm">
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
