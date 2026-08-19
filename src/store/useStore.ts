import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import {
  Transaction,
  UserProfile,
  CategoryType,
  SortOption,
  ActiveTab,
  GlobalFramingMode,
} from "../types";
import { INITIAL_USER_PROFILE, SEED_TRANSACTIONS } from "../data/seedData";

const PROFILE_KEY = "realcost_user_profile_v2";
const TRANSACTIONS_KEY = "realcost_transactions_v2";

export function useRealCostStore() {
  const [profile, setProfileState] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(PROFILE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse profile", e);
      }
    }
    return INITIAL_USER_PROFILE;
  });

  const [transactions, setTransactionsState] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem(TRANSACTIONS_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse transactions", e);
      }
    }
    return SEED_TRANSACTIONS;
  });

  // UI state
  const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | "all">("all");
  const [sortBy, setSortBy] = useState<SortOption>("date-desc");
  const [globalFraming, setGlobalFraming] = useState<GlobalFramingMode>("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
  }, [transactions]);

  // Actions
  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfileState((prev) => {
      const next = { ...prev, ...updates };
      if (updates.monthlyIncome !== undefined || updates.workingHoursPerMonth !== undefined) {
        const income = updates.monthlyIncome ?? prev.monthlyIncome;
        const hours = updates.workingHoursPerMonth ?? prev.workingHoursPerMonth;
        if (hours > 0) {
          next.hourlyWage = Math.round((income / hours) * 100) / 100;
        }
      }
      return next;
    });
  };

  const addTransaction = (newTx: Omit<Transaction, "id">) => {
    const created: Transaction = {
      ...newTx,
      id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };
    setTransactionsState((prev) => [created, ...prev]);

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ["#abf34d", "#34d399", "#fbbf24"],
      });
    } catch (e) {
      // ignore
    }
  };

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    setTransactionsState((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    );
  };

  const toggleCancelSubscription = (id: string) => {
    setTransactionsState((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextState = !item.isCancelled;
          if (nextState) {
            // Trigger confetti on cancellation & investment!
            try {
              confetti({
                particleCount: 80,
                spread: 70,
                origin: { y: 0.6 },
                colors: ["#abf34d", "#10b981", "#ffffff"],
              });
            } catch (e) {
              // ignore
            }
          }
          return { ...item, isCancelled: nextState };
        }
        return item;
      }),
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactionsState((prev) => prev.filter((item) => item.id !== id));
  };

  const loadDemoData = () => {
    setProfileState(INITIAL_USER_PROFILE);
    setTransactionsState(SEED_TRANSACTIONS);
    try {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.7 },
      });
    } catch (e) {
      // ignore
    }
  };

  return {
    profile,
    transactions,
    activeTab,
    searchQuery,
    selectedCategory,
    sortBy,
    globalFraming,
    isAddModalOpen,
    isSettingsModalOpen,
    editingTransaction,

    updateProfile,
    addTransaction,
    updateTransaction,
    toggleCancelSubscription,
    deleteTransaction,
    loadDemoData,
    setActiveTab,
    setSearchQuery,
    setSelectedCategory,
    setSortBy,
    setGlobalFraming,
    setIsAddModalOpen,
    setIsSettingsModalOpen,
    setEditingTransaction,
  };
}
