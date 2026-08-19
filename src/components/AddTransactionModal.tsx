import React, { useState, useEffect } from "react";
import { X, Plus, Clock, TrendingUp, Sparkles, Check, Repeat } from "lucide-react";
import { Transaction, UserProfile, CategoryType } from "../types";
import { CATEGORIES, autoDetectCategory } from "../lib/categorization";
import { CALCULATIONS } from "../lib/calculations";
import { formatCurrency, formatHours } from "../lib/formatters";

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTransaction: (tx: Omit<Transaction, "id">) => void;
  onUpdateTransaction?: (id: string, tx: Partial<Transaction>) => void;
  editingTransaction?: Transaction | null;
  profile: UserProfile;
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
  onAddTransaction,
  onUpdateTransaction,
  editingTransaction,
  profile,
}) => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<CategoryType>("food");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0] || "");
  const [isRecurring, setIsRecurring] = useState(false);
  const [notes, setNotes] = useState("");
  const [autoDetectedPill, setAutoDetectedPill] = useState<CategoryType | null>(null);

  // Populate if editing existing
  useEffect(() => {
    if (editingTransaction) {
      setDescription(editingTransaction.description);
      setAmount(editingTransaction.amount.toString());
      setCategory(editingTransaction.category);
      setDate(editingTransaction.date);
      setIsRecurring(editingTransaction.isRecurring);
      setNotes(editingTransaction.notes || "");
    } else {
      setDescription("");
      setAmount("");
      setCategory("food");
      setDate(new Date().toISOString().split("T")[0] || "");
      setIsRecurring(false);
      setNotes("");
    }
  }, [editingTransaction, isOpen]);

  if (!isOpen) return null;

  // Handle Description Auto-Detection
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDescription(val);
    if (!editingTransaction && val.trim().length > 2) {
      const detected = autoDetectCategory(val);
      if (detected !== category) {
        setCategory(detected);
        setAutoDetectedPill(detected);
      }
    }
  };

  const parsedAmount = parseFloat(amount) || 0;
  const previewHours = CALCULATIONS.hoursOfWork(parsedAmount, profile.hourlyWage);
  const previewFutureVal = CALCULATIONS.futureValue(
    parsedAmount,
    profile.targetReturnRate,
    profile.timeHorizonYears,
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || parsedAmount <= 0) return;

    const finalDate = date || new Date().toISOString().split("T")[0] || "";

    const trimmedNotes = notes.trim();

    if (editingTransaction && onUpdateTransaction) {
      const updateData: Partial<Transaction> = {
        description: description.trim(),
        amount: parsedAmount,
        category,
        date: finalDate,
        isRecurring,
      };
      if (trimmedNotes) {
        updateData.notes = trimmedNotes;
      }
      onUpdateTransaction(editingTransaction.id, updateData);
    } else {
      const newTxData: Omit<Transaction, "id"> = {
        description: description.trim(),
        amount: parsedAmount,
        category,
        date: finalDate,
        isRecurring,
      };
      if (trimmedNotes) {
        newTxData.notes = trimmedNotes;
      }
      onAddTransaction(newTxData);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#141d11] border border-[#23321f] rounded-3xl p-6 shadow-2xl shadow-[#abf34d]/15 text-white">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#23321f]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#abf34d]/15 border border-[#abf34d]/30 flex items-center justify-center text-[#abf34d]">
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-lg font-bold">
                {editingTransaction ? "Edit Expense" : "Log New Expense"}
              </h2>
              <p className="text-xs text-[#84967c]">Instant hours & opportunity cost calculator</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#84967c] hover:text-white hover:bg-[#1a2b0e] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Transaction Description */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-[#9bb093]">Description / Merchant</label>
              {autoDetectedPill && (
                <span className="text-[10px] text-[#abf34d] bg-[#abf34d]/10 px-2 py-0.5 rounded-full border border-[#abf34d]/20 flex items-center gap-1 animate-pulse">
                  <Sparkles className="w-2.5 h-2.5" />
                  Auto-categorized as {CATEGORIES[autoDetectedPill].name}
                </span>
              )}
            </div>
            <input
              type="text"
              value={description}
              onChange={handleDescriptionChange}
              placeholder="e.g. Starbucks Caramel Macchiato, Netflix, Uber"
              className="w-full px-3.5 py-2.5 bg-[#0c120a] border border-[#23321f] rounded-xl text-sm font-semibold text-white focus:outline-none focus:border-[#abf34d]"
              required
              autoFocus
            />
          </div>

          {/* Amount & Category Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#9bb093] mb-1.5">
                Amount ({profile.currencySymbol})
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-[#84967c] font-bold text-sm">
                  {profile.currencySymbol}
                </span>
                <input
                  type="number"
                  step="any"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="500"
                  className="w-full pl-8 pr-3 py-2.5 bg-[#0c120a] border border-[#23321f] rounded-xl text-sm font-bold text-white focus:outline-none focus:border-[#abf34d]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#9bb093] mb-1.5">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryType)}
                className="w-full px-3 py-2.5 bg-[#0c120a] border border-[#23321f] rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-[#abf34d]"
              >
                {Object.values(CATEGORIES).map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* RealCost Dynamic Calculation Preview Box */}
          {parsedAmount > 0 && (
            <div className="p-4 rounded-2xl bg-[#0c120a] border border-[#abf34d]/30 grid grid-cols-2 gap-4 animate-fadeIn">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#abf34d]/15 flex items-center justify-center text-[#abf34d]">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] text-[#84967c]">Life Hours Traded</div>
                  <div className="text-sm font-extrabold text-[#abf34d]">
                    ⏱️ {formatHours(previewHours)}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 border-l border-[#23321f] pl-4">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-400">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] text-[#84967c]">
                    In {profile.timeHorizonYears} Years
                  </div>
                  <div className="text-sm font-extrabold text-emerald-400">
                    📈 {formatCurrency(previewFutureVal, profile.currencySymbol)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Date & Recurring Checkbox Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#9bb093] mb-1.5">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-[#0c120a] border border-[#23321f] rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-[#abf34d]"
                required
              />
            </div>

            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-white">
                <input
                  type="checkbox"
                  checked={isRecurring}
                  onChange={(e) => setIsRecurring(e.target.checked)}
                  className="w-4 h-4 rounded bg-[#0c120a] border-[#23321f] text-[#abf34d] focus:ring-0 accent-[#abf34d]"
                />
                <span className="flex items-center gap-1">
                  <Repeat className="w-3.5 h-3.5 text-purple-400" />
                  Recurring Subscription
                </span>
              </label>
            </div>
          </div>

          {/* Optional Notes */}
          <div>
            <label className="block text-xs font-semibold text-[#9bb093] mb-1.5">
              Notes (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Treat for finishing quarterly goal"
              className="w-full px-3 py-2 bg-[#0c120a] border border-[#23321f] rounded-xl text-xs text-white focus:outline-none focus:border-[#abf34d]"
            />
          </div>

          {/* Form Submit Button */}
          <div className="pt-3">
            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-[#abf34d] hover:bg-[#8ae032] text-[#0c120a] font-bold text-sm shadow-lg shadow-[#abf34d]/25 transition flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              {editingTransaction ? "Update Expense" : "Add Expense & Calculate Real Cost"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
