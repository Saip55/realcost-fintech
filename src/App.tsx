import React from "react";
import { Transaction } from "./types";
import { Navbar } from "./components/Navbar";
import { Dashboard } from "./components/Dashboard";
import { ShockCard } from "./components/ShockCard";
import { WhatIfSimulator } from "./components/WhatIfSimulator";
import { InsightsPanel } from "./components/InsightsPanel";
import { AddTransactionModal } from "./components/AddTransactionModal";
import { OnboardingModal } from "./components/OnboardingModal";
import { useRealCostStore } from "./store/useStore";
import { Clock, ShieldCheck, Heart, Sparkles, Lock } from "lucide-react";

export function App() {
  const {
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
  } = useRealCostStore();

  const handleEditClick = (tx: Transaction) => {
    setEditingTransaction(tx);
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setEditingTransaction(null);
  };

  return (
    <div className="min-h-screen bg-[#070c06] bg-mesh text-[#f1f7ed] flex flex-col font-sans selection:bg-[#abf34d] selection:text-[#070c06]">
      {/* Top Sticky Navigation */}
      <Navbar
        profile={profile}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        globalFraming={globalFraming}
        setGlobalFraming={setGlobalFraming}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
        onLoadDemoData={loadDemoData}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        {/* Render Active View */}
        {activeTab === "dashboard" && (
          <Dashboard
            transactions={transactions}
            profile={profile}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            sortBy={sortBy}
            setSortBy={setSortBy}
            globalFraming={globalFraming}
            onEditTransaction={handleEditClick}
            onDeleteTransaction={deleteTransaction}
            onOpenAddModal={() => setIsAddModalOpen(true)}
            onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
          />
        )}

        {activeTab === "shock" && (
          <ShockCard
            transactions={transactions}
            profile={profile}
            onToggleCancelSubscription={toggleCancelSubscription}
            onDeleteTransaction={deleteTransaction}
            onOpenAddModal={() => setIsAddModalOpen(true)}
          />
        )}

        {activeTab === "simulator" && <WhatIfSimulator profile={profile} />}

        {activeTab === "insights" && (
          <InsightsPanel transactions={transactions} profile={profile} />
        )}
      </main>

      {/* Ultra-Sleek Footer */}
      <footer className="border-t border-[#23321f]/80 bg-[#040804] py-8 px-4 mt-16 text-xs text-[#84967c]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-[#abf34d]/15 border border-[#abf34d]/30 flex items-center justify-center text-[#abf34d] font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-white text-sm">
                RealCost — Life & Opportunity Reframe
              </div>
              <div className="text-[11px] text-[#84967c]">
                Most apps show what you spent. RealCost shows what it cost you in life hours &
                future wealth.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 text-[#9bb093] text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-white">
              <Lock className="w-3.5 h-3.5 text-[#abf34d]" />
              Local-First & 100% Private
            </span>
            <span>•</span>
            <span>MIT License</span>
          </div>
        </div>
      </footer>

      {/* Add / Edit Expense Modal */}
      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onAddTransaction={addTransaction}
        onUpdateTransaction={updateTransaction}
        editingTransaction={editingTransaction}
        profile={profile}
      />

      {/* Baseline Settings Modal */}
      <OnboardingModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        profile={profile}
        onUpdateProfile={updateProfile}
      />
    </div>
  );
}

export default App;
